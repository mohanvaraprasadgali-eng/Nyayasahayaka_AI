from flask import Blueprint, request, jsonify, g
from database.db import get_db_connection
from services.auth_service import AuthService, login_required
from services.document_security import DocumentSecurityService

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/api/cases/<int:case_id>/messages', methods=['GET'])
@login_required
def get_case_messages(case_id):
    user = g.current_user
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM cases WHERE id = ?", (case_id,))
    case_row = cursor.fetchone()
    if not case_row:
        conn.close()
        return jsonify({"success": False, "error": "Case not found."}), 404

    case = dict(case_row)

    # Authorization Check
    is_authorized = False
    if user['role'] == 'admin':
        is_authorized = True
    elif user['role'] == 'citizen' and case['user_id'] == user['id']:
        is_authorized = True
    elif user['role'] == 'lawyer':
        cursor.execute("SELECT id FROM lawyer_profiles WHERE user_id = ?", (user['id'],))
        lp = cursor.fetchone()
        if lp and case['assigned_lawyer_id'] == lp[0]:
            is_authorized = True

    if not is_authorized:
        conn.close()
        return jsonify({
            "success": False,
            "error": "🔒 Access Denied: Private case messages are restricted exclusively to the client and assigned advocate."
        }), 403

    # Mark incoming messages as read
    cursor.execute("""
        UPDATE case_messages 
        SET is_read = 1 
        WHERE case_id = ? AND receiver_id = ?
    """, (case_id, user['id']))
    conn.commit()

    cursor.execute("""
        SELECT cm.*, 
               u_sender.name as sender_name, u_sender.role as sender_role,
               cd.title as attachment_title, cd.filename as attachment_filename
        FROM case_messages cm
        JOIN users u_sender ON cm.sender_id = u_sender.id
        LEFT JOIN case_documents cd ON cm.attachment_doc_id = cd.id
        WHERE cm.case_id = ?
        ORDER BY cm.created_at ASC
    """, (case_id,))
    messages = [dict(r) for r in cursor.fetchall()]
    conn.close()

    return jsonify({
        "success": True,
        "case_id": case_id,
        "privacy_notice": "🔒 Private Case Conversation — Accessible only to Client & Assigned Legal Counsel",
        "messages": messages
    }), 200

@chat_bp.route('/api/cases/<int:case_id>/messages', methods=['POST'])
@login_required
def send_case_message(case_id):
    user = g.current_user
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM cases WHERE id = ?", (case_id,))
    case_row = cursor.fetchone()
    if not case_row:
        conn.close()
        return jsonify({"success": False, "error": "Case not found."}), 404

    case = dict(case_row)

    # Determine receiver
    receiver_id = None
    if user['role'] == 'citizen':
        if case['user_id'] != user['id']:
            conn.close()
            return jsonify({"success": False, "error": "Unauthorized"}), 403
        
        # Get assigned lawyer user_id
        if not case['assigned_lawyer_id']:
            conn.close()
            return jsonify({"success": False, "error": "No advocate is assigned to this case yet."}), 400
        
        cursor.execute("SELECT user_id FROM lawyer_profiles WHERE id = ?", (case['assigned_lawyer_id'],))
        lp = cursor.fetchone()
        if lp:
            receiver_id = lp[0]

    elif user['role'] == 'lawyer':
        cursor.execute("SELECT id FROM lawyer_profiles WHERE user_id = ?", (user['id'],))
        lp = cursor.fetchone()
        if not lp or case['assigned_lawyer_id'] != lp[0]:
            conn.close()
            return jsonify({"success": False, "error": "Unauthorized: You are not assigned to this case."}), 403
        receiver_id = case['user_id']

    elif user['role'] == 'admin':
        receiver_id = case['user_id']

    data = request.get_json() or {}
    message_text = data.get('message_text', '').strip()
    attachment_doc_id = data.get('attachment_doc_id')

    if not message_text:
        conn.close()
        return jsonify({"success": False, "error": "Message text cannot be empty."}), 400

    cursor.execute("""
        INSERT INTO case_messages (case_id, sender_id, receiver_id, sender_name, sender_role, message_text, attachment_doc_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (case_id, user['id'], receiver_id, user['name'], user['role'], message_text, attachment_doc_id))
    msg_id = cursor.lastrowid

    # Create notification for receiver
    if receiver_id:
        cursor.execute("""
            INSERT INTO notifications (user_id, title, message, type, link_tab, case_id)
            VALUES (?, 'New Secure Case Message', ?, 'message', 'chat', ?)
        """, (receiver_id, f"{user['name']} sent a message on Case #{case_id}: \"{message_text[:60]}...\"", case_id))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message_id": msg_id,
        "message": "Message delivered securely."
    }), 201
