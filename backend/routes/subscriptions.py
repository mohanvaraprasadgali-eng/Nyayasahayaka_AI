from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, g
from database.db import get_db_connection
from services.auth_service import AuthService, login_required
from services.document_security import DocumentSecurityService

subscriptions_bp = Blueprint('subscriptions', __name__)

@subscriptions_bp.route('/api/subscriptions/current', methods=['GET'])
@login_required
def get_current_subscription():
    user = g.current_user
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM lawyer_profiles WHERE user_id = ?", (user['id'],))
    lp_row = cursor.fetchone()
    if not lp_row:
        conn.close()
        return jsonify({"success": False, "error": "Lawyer profile not found."}), 404

    lawyer_id = lp_row[0]

    cursor.execute("""
        SELECT * FROM lawyer_subscriptions
        WHERE lawyer_id = ?
        ORDER BY created_at DESC LIMIT 1
    """, (lawyer_id,))
    sub_row = cursor.fetchone()

    if not sub_row:
        conn.close()
        return jsonify({
            "success": True,
            "has_subscription": False,
            "subscription": None
        }), 200

    sub = dict(sub_row)
    remaining_days = 0
    if sub.get('end_date'):
        try:
            end_dt = datetime.strptime(sub['end_date'], '%Y-%m-%d')
            remaining_days = (end_dt - datetime.now()).days
            sub['remaining_days'] = max(0, remaining_days)
            if remaining_days <= 0:
                sub['status'] = 'EXPIRED'
            elif remaining_days <= 7:
                sub['status'] = 'EXPIRING_SOON'
        except Exception:
            sub['remaining_days'] = 30

    conn.close()

    return jsonify({
        "success": True,
        "has_subscription": True,
        "subscription": sub
    }), 200

@subscriptions_bp.route('/api/subscriptions/plans', methods=['GET'])
def get_subscription_plans():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pricing_plans WHERE plan_type = 'lawyer_subscription' AND is_active = 1 ORDER BY price ASC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()

    return jsonify({
        "success": True,
        "plans": rows
    }), 200

@subscriptions_bp.route('/api/subscriptions/renew', methods=['POST'])
@login_required
def renew_subscription():
    user = g.current_user
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM lawyer_profiles WHERE user_id = ?", (user['id'],))
    lp_row = cursor.fetchone()
    if not lp_row:
        conn.close()
        return jsonify({"success": False, "error": "Lawyer profile not found."}), 404

    lawyer_id = lp_row[0]
    data = request.get_json() or {}
    plan_name = data.get('plan_name', 'PRO')
    price = float(data.get('price', 999.0))
    duration_months = int(data.get('duration_months', 3))

    start_date = datetime.now().strftime('%Y-%m-%d')
    end_date = (datetime.now() + timedelta(days=duration_months * 30)).strftime('%Y-%m-%d')

    cursor.execute("""
        INSERT INTO lawyer_subscriptions (lawyer_id, plan_name, price, duration_months, status, start_date, end_date)
        VALUES (?, ?, ?, ?, 'ACTIVE', ?, ?)
    """, (lawyer_id, plan_name, price, duration_months, start_date, end_date))
    sub_id = cursor.lastrowid

    txn_ref = f"TXN-SUB-2026-{sub_id:04d}"
    cursor.execute("""
        INSERT INTO payments (user_id, subscription_id, amount, payment_type, status, transaction_ref, payment_method)
        VALUES (?, ?, ?, 'subscription', 'SUCCESS', ?, 'Prototype Payment Simulation')
    """, (user['id'], sub_id, price, txn_ref))

    conn.commit()

    DocumentSecurityService.log_audit(
        user_id=user['id'],
        user_role="lawyer",
        user_name=user['name'],
        action="SUBSCRIPTION_RENEWED",
        target_type="subscription",
        target_id=str(sub_id),
        details=f"Renewed {plan_name} plan for {duration_months} months (₹{price:.2f})."
    )

    conn.close()

    return jsonify({
        "success": True,
        "message": f"Subscription renewed successfully under {plan_name} Plan for {duration_months} months!",
        "subscription_id": sub_id,
        "plan_name": plan_name,
        "start_date": start_date,
        "end_date": end_date,
        "remaining_days": duration_months * 30
    }), 200
