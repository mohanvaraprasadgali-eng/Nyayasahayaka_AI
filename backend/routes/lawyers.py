from flask import Blueprint, request, jsonify, g
from datetime import datetime
from database.db import get_db_connection
from services.auth_service import AuthService, login_required, require_role
from services.document_security import DocumentSecurityService

lawyers_bp = Blueprint('lawyers', __name__)

@lawyers_bp.route('/api/lawyers/profile', methods=['GET'])
@login_required
def get_lawyer_profile():
    user = g.current_user
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT lp.*, u.name, u.email, u.phone, u.city, u.state
        FROM lawyer_profiles lp
        JOIN users u ON lp.user_id = u.id
        WHERE u.id = ?
    """, (user['id'],))
    lp_row = cursor.fetchone()

    if not lp_row:
        conn.close()
        return jsonify({"success": False, "error": "Lawyer profile not found."}), 404

    profile = dict(lp_row)

    # Fetch active subscription
    cursor.execute("""
        SELECT * FROM lawyer_subscriptions 
        WHERE lawyer_id = ? 
        ORDER BY created_at DESC LIMIT 1
    """, (profile['id'],))
    sub_row = cursor.fetchone()
    subscription = dict(sub_row) if sub_row else None

    # Calculate remaining days
    if subscription and subscription.get('end_date'):
        try:
            end_dt = datetime.strptime(subscription['end_date'], '%Y-%m-%d')
            remaining_days = (end_dt - datetime.now()).days
            subscription['remaining_days'] = max(0, remaining_days)
            if remaining_days <= 0:
                subscription['status'] = 'EXPIRED'
            elif remaining_days <= 7:
                subscription['status'] = 'EXPIRING_SOON'
        except Exception:
            subscription['remaining_days'] = 30

    # Fetch verification documents
    cursor.execute("""
        SELECT id, document_type, file_name, uploaded_at, status 
        FROM lawyer_verification_documents 
        WHERE lawyer_id = ?
    """, (profile['id'],))
    verif_docs = [dict(r) for r in cursor.fetchall()]

    conn.close()

    return jsonify({
        "success": True,
        "profile": profile,
        "subscription": subscription,
        "verification_documents": verif_docs
    }), 200

@lawyers_bp.route('/api/lawyers/verification', methods=['POST'])
@login_required
def upload_verification():
    user = g.current_user
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM lawyer_profiles WHERE user_id = ?", (user['id'],))
    lp = cursor.fetchone()
    if not lp:
        conn.close()
        return jsonify({"success": False, "error": "Lawyer profile not found."}), 404

    lawyer_id = lp[0]
    data = request.get_json() or {}
    doc_type = data.get('document_type', 'Bar Council Certificate')
    file_name = data.get('file_name', 'bar_certificate.pdf')

    cursor.execute("""
        INSERT INTO lawyer_verification_documents (lawyer_id, document_type, file_name, file_path, status)
        VALUES (?, ?, ?, ?, 'SUBMITTED')
    """, (lawyer_id, doc_type, file_name, f"secure_storage/{file_name}"))

    cursor.execute("""
        UPDATE lawyer_profiles 
        SET verification_status = 'UNDER_REVIEW' 
        WHERE id = ? AND verification_status = 'PENDING'
    """, (lawyer_id,))

    conn.commit()
    conn.close()

    DocumentSecurityService.log_audit(
        user_id=user['id'],
        user_role="lawyer",
        user_name=user['name'],
        action="UPLOAD_DOCUMENT",
        target_type="verification_document",
        target_id=str(lawyer_id),
        details=f"Uploaded verification document: {doc_type} ({file_name})."
    )

    return jsonify({
        "success": True,
        "message": "Verification document uploaded successfully and queued for admin review."
    }), 201

@lawyers_bp.route('/api/lawyers/case-requests', methods=['GET'])
@login_required
def get_case_requests():
    """
    Returns anonymized case opportunities matching the lawyer.
    STRICT PRIVACY: Does NOT expose citizen identity, sensitive phone/email, or private documents.
    """
    user = g.current_user
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM lawyer_profiles WHERE user_id = ?", (user['id'],))
    lp_row = cursor.fetchone()
    if not lp_row:
        conn.close()
        return jsonify({"success": False, "error": "Lawyer profile not found."}), 404

    lawyer = dict(lp_row)

    # Verification check
    if lawyer['verification_status'] != 'VERIFIED':
        conn.close()
        return jsonify({
            "success": True,
            "verification_status": lawyer['verification_status'],
            "is_verified": False,
            "case_requests": [],
            "message": f"Your lawyer account is currently {lawyer['verification_status']}. You will receive citizen case requests once approved by our legal administration team."
        }), 200

    # Subscription check
    cursor.execute("""
        SELECT * FROM lawyer_subscriptions 
        WHERE lawyer_id = ? AND status IN ('ACTIVE', 'EXPIRING_SOON')
        ORDER BY created_at DESC LIMIT 1
    """, (lawyer['id'],))
    sub_row = cursor.fetchone()
    
    if not sub_row:
        conn.close()
        return jsonify({
            "success": True,
            "is_verified": True,
            "subscription_expired": True,
            "case_requests": [],
            "message": "Your lawyer subscription has expired. Please renew your subscription to unlock new citizen case requests."
        }), 200

    # Fetch available matching cases (status = MATCHING or OPEN)
    cursor.execute("""
        SELECT 
            c.id,
            c.title,
            c.category,
            c.sub_category,
            c.description,
            c.location,
            c.urgency,
            c.complexity,
            c.platform_fee,
            c.payment_status,
            c.created_at,
            u.city as citizen_city,
            u.state as citizen_state
        FROM cases c
        JOIN users u ON c.user_id = u.id
        WHERE c.assigned_lawyer_id IS NULL
          AND c.status IN ('MATCHING', 'PAID', 'OPEN')
        ORDER BY c.created_at DESC
    """)
    raw_cases = [dict(r) for r in cursor.fetchall()]
    conn.close()

    anonymized_requests = []
    for c in raw_cases:
        # Create anonymized preview
        anonymized_requests.append({
            "id": c['id'],
            "case_code": f"CASE-2026-{c['id']:03d}",
            "title": c['title'],
            "category": c['category'],
            "sub_category": c['sub_category'],
            "complexity": c['complexity'],
            "urgency": c['urgency'],
            "platform_fee": c['platform_fee'],
            "created_at": c['created_at'],
            # Anonymized location string
            "location_display": f"Citizen from {c['citizen_city'] or 'Hyderabad'}, {c['citizen_state'] or 'Telangana'}",
            "short_description": (c['description'][:140] + '...') if len(c['description']) > 140 else c['description'],
            "documents_attached_count": 3,
            "privacy_notice": "🔒 Private citizen contact & documents remain locked until formal case acceptance."
        })

    return jsonify({
        "success": True,
        "is_verified": True,
        "case_requests": anonymized_requests
    }), 200

@lawyers_bp.route('/api/lawyers/active-cases', methods=['GET'])
@login_required
def get_active_cases():
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
        SELECT 
            c.*,
            u.name as client_name,
            u.email as client_email,
            u.phone as client_phone,
            u.location as client_location
        FROM cases c
        JOIN users u ON c.user_id = u.id
        WHERE c.assigned_lawyer_id = ?
        ORDER BY c.updated_at DESC
    """, (lawyer_id,))
    cases = [dict(r) for r in cursor.fetchall()]

    for c in cases:
        # Fetch document count
        cursor.execute("SELECT COUNT(*) FROM case_documents WHERE case_id = ?", (c['id'],))
        c['document_count'] = cursor.fetchone()[0]

        # Fetch unread messages
        cursor.execute("SELECT COUNT(*) FROM case_messages WHERE case_id = ? AND receiver_id = ? AND is_read = 0", (c['id'], user['id']))
        c['unread_messages_count'] = cursor.fetchone()[0]

        # Fetch evidence completeness
        cursor.execute("SELECT COUNT(*) FROM document_requirements WHERE case_id = ?", (c['id'],))
        total_req = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM document_requirements WHERE case_id = ? AND status = 'available'", (c['id'],))
        avail_req = cursor.fetchone()[0]
        c['doc_progress'] = {
            "available": avail_req,
            "total": total_req,
            "percentage": int((avail_req / total_req * 100)) if total_req > 0 else 100
        }

    conn.close()

    return jsonify({
        "success": True,
        "cases": cases
    }), 200

@lawyers_bp.route('/api/lawyers/stats', methods=['GET'])
@login_required
def get_lawyer_dashboard_stats():
    user = g.current_user
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM lawyer_profiles WHERE user_id = ?", (user['id'],))
    lp_row = cursor.fetchone()
    if not lp_row:
        conn.close()
        return jsonify({"success": False, "error": "Lawyer profile not found."}), 404

    lawyer = dict(lp_row)

    # Active Cases
    cursor.execute("SELECT COUNT(*) FROM cases WHERE assigned_lawyer_id = ? AND status IN ('LAWYER_ACCEPTED', 'DOCUMENTS_SHARED', 'IN_PROGRESS')", (lawyer['id'],))
    active_cases = cursor.fetchone()[0]

    # Completed Cases
    cursor.execute("SELECT COUNT(*) FROM cases WHERE assigned_lawyer_id = ? AND status IN ('RESOLVED', 'CLOSED')", (lawyer['id'],))
    completed_cases = cursor.fetchone()[0]

    # New Requests Count (Available for matching)
    cursor.execute("SELECT COUNT(*) FROM cases WHERE assigned_lawyer_id IS NULL AND status IN ('MATCHING', 'PAID', 'OPEN')")
    new_requests = cursor.fetchone()[0]

    # Subscription
    cursor.execute("SELECT * FROM lawyer_subscriptions WHERE lawyer_id = ? ORDER BY created_at DESC LIMIT 1", (lawyer['id'],))
    sub_row = cursor.fetchone()
    sub_info = dict(sub_row) if sub_row else None
    remaining_days = 0
    if sub_info and sub_info.get('end_date'):
        try:
            end_dt = datetime.strptime(sub_info['end_date'], '%Y-%m-%d')
            remaining_days = max(0, (end_dt - datetime.now()).days)
        except Exception:
            remaining_days = 30

    conn.close()

    return jsonify({
        "success": True,
        "stats": {
            "verification_status": lawyer['verification_status'],
            "is_verified": lawyer['verification_status'] == 'VERIFIED',
            "rating": lawyer['rating'],
            "subscription_status": sub_info['status'] if sub_info else 'NONE',
            "subscription_plan": sub_info['plan_name'] if sub_info else 'None',
            "remaining_days": remaining_days,
            "new_case_requests_count": new_requests,
            "accepted_cases_count": active_cases + completed_cases,
            "active_cases_count": active_cases,
            "completed_cases_count": completed_cases,
            "case_categories": ["Rental / Housing", "Employment & Labour", "Consumer Rights", "Civil & Property", "Cybercrime"]
        }
    }), 200
