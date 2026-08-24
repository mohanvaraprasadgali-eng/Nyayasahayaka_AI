import uuid
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, g
from database.db import get_db_connection
from services.auth_service import AuthService, login_required
from services.document_security import DocumentSecurityService

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/api/pricing-plans', methods=['GET'])
def get_pricing_plans():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pricing_plans WHERE is_active = 1 ORDER BY plan_type, price ASC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()

    case_plans = [r for r in rows if r['plan_type'] == 'case_fee']
    subscription_plans = [r for r in rows if r['plan_type'] == 'lawyer_subscription']

    return jsonify({
        "success": True,
        "case_plans": case_plans,
        "subscription_plans": subscription_plans
    }), 200

@payments_bp.route('/api/payments/mock', methods=['POST'])
@login_required
def process_mock_payment():
    user = g.current_user
    data = request.get_json() or {}
    payment_type = data.get('payment_type', 'case_fee') # 'case_fee', 'subscription'
    amount = float(data.get('amount', 499.0))
    case_id = data.get('case_id')
    plan_code = data.get('plan_code', 'CASE_MODERATE')
    payment_method = data.get('payment_method', 'Mock UPI Simulation (Google Pay / PhonePe)')

    txn_ref = f"TXN-NYAYA-2026-{uuid.uuid4().hex[:8].upper()}"
    receipt_url = f"/receipts/{txn_ref}.pdf"

    conn = get_db_connection()
    cursor = conn.cursor()

    subscription_id = None

    if payment_type == 'case_fee' and case_id:
        # Update case status
        cursor.execute("""
            UPDATE cases 
            SET payment_status = 'PAID', status = 'MATCHING', updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (case_id,))

        cursor.execute("""
            INSERT INTO timeline_events (case_id, event_date, title, description, event_type)
            VALUES (?, date('now'), 'Platform Consultation Fee Paid', ?, 'action')
        """, (case_id, f"Demo payment of ₹{amount:.2f} completed via {payment_method}. Case routed to verified advocates."))

        # Notify matching verified lawyers
        cursor.execute("SELECT id, user_id FROM lawyer_profiles WHERE verification_status = 'VERIFIED'")
        verified_lawyers = cursor.fetchall()
        for lp in verified_lawyers:
            cursor.execute("""
                INSERT INTO notifications (user_id, title, message, type, link_tab, case_id)
                VALUES (?, 'New Case Available for Acceptance', 'A new dispute matching your legal domain is available in your case feed.', 'case_match', 'case_requests', ?)
            """, (lp[1], case_id))

    elif payment_type == 'subscription':
        cursor.execute("SELECT id FROM lawyer_profiles WHERE user_id = ?", (user['id'],))
        lp_row = cursor.fetchone()
        if not lp_row:
            conn.close()
            return jsonify({"success": False, "error": "Lawyer profile not found."}), 404
        
        lawyer_id = lp_row[0]
        duration_days = 90 if 'PRO' in plan_code else (180 if 'PREMIUM' in plan_code else 30)
        start_date = datetime.now().strftime('%Y-%m-%d')
        end_date = (datetime.now() + timedelta(days=duration_days)).strftime('%Y-%m-%d')

        cursor.execute("""
            INSERT INTO lawyer_subscriptions (lawyer_id, plan_name, price, duration_months, status, start_date, end_date)
            VALUES (?, ?, ?, ?, 'ACTIVE', ?, ?)
        """, (lawyer_id, plan_code.replace('LAWYER_', ''), amount, duration_days // 30, start_date, end_date))
        subscription_id = cursor.lastrowid

    # Record payment
    cursor.execute("""
        INSERT INTO payments (user_id, case_id, subscription_id, amount, payment_type, status, transaction_ref, payment_method, receipt_url)
        VALUES (?, ?, ?, ?, ?, 'SUCCESS', ?, ?, ?)
    """, (user['id'], case_id, subscription_id, amount, payment_type, txn_ref, payment_method, receipt_url))
    payment_id = cursor.lastrowid

    conn.commit()

    # Log Audit
    DocumentSecurityService.log_audit(
        user_id=user['id'],
        user_role=user['role'],
        user_name=user['name'],
        action="PAYMENT_COMPLETED",
        target_type="payment",
        target_id=txn_ref,
        case_id=case_id,
        details=f"Paid ₹{amount:.2f} for {payment_type} ({txn_ref}) via {payment_method}."
    )

    conn.close()

    return jsonify({
        "success": True,
        "payment_id": payment_id,
        "transaction_ref": txn_ref,
        "amount": amount,
        "status": "SUCCESS",
        "simulation_disclaimer": "⚠️ Prototype Payment Simulation — No real financial charge occurred.",
        "receipt": {
            "transaction_ref": txn_ref,
            "date": datetime.now().strftime("%d %b %Y, %I:%M %p"),
            "amount": f"₹{amount:.2f}",
            "payment_method": payment_method,
            "payer_name": user['name'],
            "payer_email": user['email'],
            "case_id": case_id,
            "receipt_url": receipt_url
        }
    }), 200

@payments_bp.route('/api/payments/history', methods=['GET'])
@login_required
def get_payment_history():
    user = g.current_user
    conn = get_db_connection()
    cursor = conn.cursor()

    if user['role'] == 'admin':
        cursor.execute("""
            SELECT p.*, u.name as payer_name, u.email as payer_email, c.title as case_title
            FROM payments p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN cases c ON p.case_id = c.id
            ORDER BY p.created_at DESC
        """)
    else:
        cursor.execute("""
            SELECT p.*, u.name as payer_name, u.email as payer_email, c.title as case_title
            FROM payments p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN cases c ON p.case_id = c.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        """, (user['id'],))

    payments = [dict(r) for r in cursor.fetchall()]
    conn.close()

    return jsonify({
        "success": True,
        "payments": payments
    }), 200
