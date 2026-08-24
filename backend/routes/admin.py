from flask import Blueprint, request, jsonify, g
from database.db import get_db_connection
from services.auth_service import AuthService, login_required, require_role
from services.document_security import DocumentSecurityService

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/api/admin/stats', methods=['GET'])
@login_required
@require_role(['admin'])
def get_admin_stats():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'citizen'")
    citizens_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'lawyer'")
    lawyers_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM lawyer_profiles WHERE verification_status IN ('PENDING', 'UNDER_REVIEW')")
    pending_verifications = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM lawyer_profiles WHERE verification_status = 'VERIFIED'")
    verified_lawyers = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM cases WHERE status IN ('MATCHING', 'LAWYER_ACCEPTED', 'DOCUMENTS_SHARED', 'IN_PROGRESS')")
    active_cases = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM cases WHERE status IN ('RESOLVED', 'CLOSED')")
    completed_cases = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM lawyer_subscriptions WHERE status = 'ACTIVE'")
    active_subscriptions = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*), COALESCE(SUM(amount), 0) FROM payments WHERE status = 'SUCCESS'")
    pay_row = cursor.fetchone()
    total_txns = pay_row[0]
    total_revenue = pay_row[1]

    conn.close()

    return jsonify({
        "success": True,
        "stats": {
            "registered_citizens": citizens_count,
            "registered_lawyers": lawyers_count,
            "pending_verifications": pending_verifications,
            "verified_lawyers": verified_lawyers,
            "active_cases": active_cases,
            "completed_cases": completed_cases,
            "active_subscriptions": active_subscriptions,
            "total_transactions": total_txns,
            "total_revenue": total_revenue
        }
    }), 200

@admin_bp.route('/api/admin/lawyers/pending', methods=['GET'])
@login_required
@require_role(['admin'])
def get_pending_lawyers():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT lp.*, u.name, u.email, u.phone, u.city, u.state, u.created_at as registered_date
        FROM lawyer_profiles lp
        JOIN users u ON lp.user_id = u.id
        WHERE lp.verification_status IN ('PENDING', 'UNDER_REVIEW')
        ORDER BY lp.created_at ASC
    """)
    lawyers = [dict(r) for r in cursor.fetchall()]

    for l in lawyers:
        cursor.execute("""
            SELECT id, document_type, file_name, file_size, uploaded_at, status 
            FROM lawyer_verification_documents 
            WHERE lawyer_id = ?
        """, (l['id'],))
        l['documents'] = [dict(d) for d in cursor.fetchall()]

    conn.close()

    return jsonify({
        "success": True,
        "pending_lawyers": lawyers
    }), 200

@admin_bp.route('/api/admin/lawyers', methods=['GET'])
@login_required
@require_role(['admin'])
def get_all_lawyers():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT lp.*, u.name, u.email, u.phone, u.city, u.state, u.created_at as registered_date,
               ls.plan_name as subscription_plan, ls.status as subscription_status, ls.end_date as subscription_expiry
        FROM lawyer_profiles lp
        JOIN users u ON lp.user_id = u.id
        LEFT JOIN lawyer_subscriptions ls ON lp.id = ls.lawyer_id
        ORDER BY lp.created_at DESC
    """)
    lawyers = [dict(r) for r in cursor.fetchall()]

    for l in lawyers:
        cursor.execute("""
            SELECT id, document_type, file_name, file_size, uploaded_at, status 
            FROM lawyer_verification_documents 
            WHERE lawyer_id = ?
        """, (l['id'],))
        l['documents'] = [dict(d) for d in cursor.fetchall()]

    conn.close()

    return jsonify({
        "success": True,
        "lawyers": lawyers
    }), 200

@admin_bp.route('/api/admin/lawyers/<int:lawyer_id>/approve', methods=['POST'])
@login_required
@require_role(['admin'])
def approve_lawyer(lawyer_id):
    user = g.current_user
    data = request.get_json() or {}
    notes = data.get('notes', 'Bar council enrollment and identification verified by operations admin.')

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT lp.*, u.name, u.id as user_id FROM lawyer_profiles lp JOIN users u ON lp.user_id = u.id WHERE lp.id = ?", (lawyer_id,))
    lawyer_row = cursor.fetchone()
    if not lawyer_row:
        conn.close()
        return jsonify({"success": False, "error": "Lawyer profile not found."}), 404

    lawyer = dict(lawyer_row)

    cursor.execute("""
        UPDATE lawyer_profiles 
        SET verification_status = 'VERIFIED', verification_notes = ?
        WHERE id = ?
    """, (notes, lawyer_id))

    cursor.execute("""
        UPDATE lawyer_verification_documents 
        SET status = 'VERIFIED' 
        WHERE lawyer_id = ?
    """, (lawyer_id,))

    # Send Notification to Lawyer
    cursor.execute("""
        INSERT INTO notifications (user_id, title, message, type, link_tab)
        VALUES (?, 'Lawyer Profile Verified!', 'Congratulations! Your bar credentials have been verified. You can now receive and accept citizen case requests.', 'info', 'dashboard')
    """, (lawyer['user_id'],))

    conn.commit()

    DocumentSecurityService.log_audit(
        user_id=user['id'],
        user_role="admin",
        user_name=user['name'],
        action="ADMIN_APPROVED_LAWYER",
        target_type="lawyer",
        target_id=str(lawyer_id),
        details=f"Admin {user['name']} approved verification for Advocate {lawyer['name']} ({lawyer['bar_council_number']})."
    )

    conn.close()

    return jsonify({
        "success": True,
        "message": f"Advocate {lawyer['name']} has been approved and marked as VERIFIED.",
        "lawyer_id": lawyer_id,
        "verification_status": "VERIFIED"
    }), 200

@admin_bp.route('/api/admin/lawyers/<int:lawyer_id>/reject', methods=['POST'])
@login_required
@require_role(['admin'])
def reject_lawyer(lawyer_id):
    user = g.current_user
    data = request.get_json() or {}
    reason = data.get('reason', 'Bar Council certificate or identity document could not be authenticated.')

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT lp.*, u.name, u.id as user_id FROM lawyer_profiles lp JOIN users u ON lp.user_id = u.id WHERE lp.id = ?", (lawyer_id,))
    lawyer = cursor.fetchone()
    if not lawyer:
        conn.close()
        return jsonify({"success": False, "error": "Lawyer profile not found."}), 404

    cursor.execute("""
        UPDATE lawyer_profiles 
        SET verification_status = 'REJECTED', verification_notes = ?
        WHERE id = ?
    """, (reason, lawyer_id))

    cursor.execute("""
        INSERT INTO notifications (user_id, title, message, type, link_tab)
        VALUES (?, 'Verification Application Update', ?, 'info', 'profile')
    """, (lawyer['user_id'], f"Verification could not be approved: {reason}. Please re-submit valid credentials."))

    conn.commit()

    DocumentSecurityService.log_audit(
        user_id=user['id'],
        user_role="admin",
        user_name=user['name'],
        action="ADMIN_REJECTED_LAWYER",
        target_type="lawyer",
        target_id=str(lawyer_id),
        details=f"Admin rejected lawyer ID #{lawyer_id}: {reason}"
    )

    conn.close()

    return jsonify({
        "success": True,
        "message": f"Lawyer #{lawyer_id} has been marked as REJECTED.",
        "verification_status": "REJECTED"
    }), 200

@admin_bp.route('/api/admin/lawyers/<int:lawyer_id>/suspend', methods=['POST'])
@login_required
@require_role(['admin'])
def suspend_lawyer(lawyer_id):
    user = g.current_user
    data = request.get_json() or {}
    reason = data.get('reason', 'Account suspended pending regulatory review.')

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("UPDATE lawyer_profiles SET verification_status = 'SUSPENDED', verification_notes = ? WHERE id = ?", (reason, lawyer_id))
    conn.commit()

    DocumentSecurityService.log_audit(
        user_id=user['id'],
        user_role="admin",
        user_name=user['name'],
        action="ADMIN_SUSPENDED_LAWYER",
        target_type="lawyer",
        target_id=str(lawyer_id),
        details=f"Admin suspended lawyer ID #{lawyer_id}: {reason}"
    )

    conn.close()

    return jsonify({
        "success": True,
        "message": f"Lawyer #{lawyer_id} status updated to SUSPENDED.",
        "verification_status": "SUSPENDED"
    }), 200

@admin_bp.route('/api/admin/pricing/<int:plan_id>', methods=['PUT'])
@login_required
@require_role(['admin'])
def update_pricing_plan(plan_id):
    data = request.get_json() or {}
    price = data.get('price')
    description = data.get('description')
    is_active = data.get('is_active')

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE pricing_plans 
        SET price = COALESCE(?, price),
            description = COALESCE(?, description),
            is_active = COALESCE(?, is_active)
        WHERE id = ?
    """, (price, description, is_active, plan_id))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Pricing plan updated successfully."
    }), 200

@admin_bp.route('/api/admin/audit-logs', methods=['GET'])
@login_required
@require_role(['admin'])
def get_audit_logs():
    action = request.args.get('action')
    user_role = request.args.get('role')
    limit = int(request.args.get('limit', 50))

    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM audit_logs WHERE 1=1"
    params = []
    if action:
        query += " AND action = ?"
        params.append(action)
    if user_role:
        query += " AND user_role = ?"
        params.append(user_role)

    query += " ORDER BY created_at DESC LIMIT ?"
    params.append(limit)

    cursor.execute(query, tuple(params))
    logs = [dict(r) for r in cursor.fetchall()]
    conn.close()

    return jsonify({
        "success": True,
        "logs": logs
    }), 200
