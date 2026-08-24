from flask import Blueprint, request, jsonify, g
from database.db import get_db_connection
from services.auth_service import AuthService, login_required

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/api/notifications', methods=['GET'])
@login_required
def get_notifications():
    user = g.current_user
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM notifications 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 30
    """, (user['id'],))
    notes = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = 0", (user['id'],))
    unread_count = cursor.fetchone()[0]

    conn.close()

    return jsonify({
        "success": True,
        "unread_count": unread_count,
        "notifications": notes
    }), 200

@notifications_bp.route('/api/notifications/<int:note_id>/read', methods=['POST'])
@login_required
def mark_read(note_id):
    user = g.current_user
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE notifications 
        SET is_read = 1 
        WHERE id = ? AND user_id = ?
    """, (note_id, user['id']))
    conn.commit()
    conn.close()

    return jsonify({"success": True}), 200

@notifications_bp.route('/api/notifications/read-all', methods=['POST'])
@login_required
def mark_all_read():
    user = g.current_user
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("UPDATE notifications SET is_read = 1 WHERE user_id = ?", (user['id'],))
    conn.commit()
    conn.close()

    return jsonify({"success": True}), 200
