from flask import Blueprint, request, jsonify
from database.db import get_db_connection

actions_bp = Blueprint('actions', __name__)

@actions_bp.route('/api/action-steps', methods=['GET', 'POST'])
def manage_action_steps():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if request.method == 'POST':
        data = request.get_json() or {}
        case_id = data.get('case_id')
        title = data.get('title', '').strip()
        description = data.get('description', '')
        authority = data.get('authority', '')
        deadline = data.get('deadline', '')
        step_order = data.get('step_order', 1)
        
        if not case_id or not title:
            conn.close()
            return jsonify({"success": False, "error": "case_id and title are required"}), 400
            
        cursor.execute("""
            INSERT INTO action_steps (case_id, step_order, title, description, authority, deadline, status)
            VALUES (?, ?, ?, ?, ?, ?, 'pending')
        """, (case_id, step_order, title, description, authority, deadline))
        step_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return jsonify({"success": True, "id": step_id, "message": "Action step added"}), 201
        
    else:
        case_id = request.args.get('case_id')
        if case_id:
            cursor.execute("SELECT * FROM action_steps WHERE case_id = ? ORDER BY step_order ASC", (case_id,))
        else:
            cursor.execute("SELECT * FROM action_steps ORDER BY id DESC")
        steps = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify({"success": True, "action_steps": steps}), 200

@actions_bp.route('/api/action-steps/<int:step_id>', methods=['PUT'])
def update_action_step(step_id):
    data = request.get_json() or {}
    conn = get_db_connection()
    cursor = conn.cursor()
    
    fields = []
    values = []
    for key in ['status', 'title', 'description', 'authority', 'deadline', 'step_order']:
        if key in data:
            fields.append(f"{key} = ?")
            values.append(data[key])
            
    if fields:
        values.append(step_id)
        cursor.execute(f"UPDATE action_steps SET {', '.join(fields)} WHERE id = ?", tuple(values))
        conn.commit()
        
    conn.close()
    return jsonify({"success": True, "message": "Action step updated"}), 200
