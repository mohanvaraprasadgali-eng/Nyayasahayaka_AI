from flask import Blueprint, request, jsonify
from database.db import get_db_connection

reminders_bp = Blueprint('reminders', __name__)

@reminders_bp.route('/api/reminders', methods=['GET', 'POST'])
def manage_reminders():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if request.method == 'POST':
        data = request.get_json() or {}
        case_id = data.get('case_id')
        title = data.get('title', '').strip()
        reminder_date = data.get('reminder_date', '')
        reminder_time = data.get('reminder_time', '10:00 AM')
        priority = data.get('priority', 'Medium')
        category = data.get('category', 'Deadline')
        
        if not title or not reminder_date:
            conn.close()
            return jsonify({"success": False, "error": "title and reminder_date are required"}), 400
            
        cursor.execute("""
            INSERT INTO reminders (case_id, title, reminder_date, reminder_time, priority, category, completed)
            VALUES (?, ?, ?, ?, ?, ?, 0)
        """, (case_id, title, reminder_date, reminder_time, priority, category))
        r_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return jsonify({"success": True, "id": r_id, "message": "Reminder created"}), 201
        
    else:
        case_id = request.args.get('case_id')
        if case_id:
            cursor.execute("SELECT r.*, c.title as case_title FROM reminders r LEFT JOIN cases c ON r.case_id = c.id WHERE r.case_id = ? ORDER BY r.reminder_date ASC", (case_id,))
        else:
            cursor.execute("SELECT r.*, c.title as case_title FROM reminders r LEFT JOIN cases c ON r.case_id = c.id ORDER BY r.reminder_date ASC")
        items = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify({"success": True, "reminders": items}), 200

@reminders_bp.route('/api/reminders/<int:reminder_id>', methods=['PUT', 'DELETE'])
def update_or_delete_reminder(reminder_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if request.method == 'DELETE':
        cursor.execute("DELETE FROM reminders WHERE id = ?", (reminder_id,))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Reminder deleted"}), 200
        
    else: # PUT
        data = request.get_json() or {}
        fields = []
        values = []
        for key in ['completed', 'title', 'reminder_date', 'reminder_time', 'priority', 'category']:
            if key in data:
                fields.append(f"{key} = ?")
                values.append(data[key])
                
        if fields:
            values.append(reminder_id)
            cursor.execute(f"UPDATE reminders SET {', '.join(fields)} WHERE id = ?", tuple(values))
            conn.commit()
            
        conn.close()
        return jsonify({"success": True, "message": "Reminder updated"}), 200
