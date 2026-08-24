from flask import Blueprint, request, jsonify
from database.db import get_db_connection

evidence_bp = Blueprint('evidence', __name__)

@evidence_bp.route('/api/evidence', methods=['GET', 'POST'])
def manage_evidence():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if request.method == 'POST':
        data = request.get_json() or {}
        case_id = data.get('case_id')
        name = data.get('name', '').strip()
        category = data.get('category', 'General')
        status = data.get('status', 'pending')
        importance = data.get('importance', 'Essential')
        notes = data.get('notes', '')
        
        if not case_id or not name:
            conn.close()
            return jsonify({"success": False, "error": "case_id and name are required"}), 400
            
        cursor.execute("""
            INSERT INTO evidence (case_id, name, category, status, importance, notes)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (case_id, name, category, status, importance, notes))
        ev_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return jsonify({"success": True, "id": ev_id, "message": "Evidence item added"}), 201
        
    else:
        case_id = request.args.get('case_id')
        if case_id:
            cursor.execute("SELECT * FROM evidence WHERE case_id = ? ORDER BY id ASC", (case_id,))
        else:
            cursor.execute("SELECT * FROM evidence ORDER BY created_at DESC")
        items = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify({"success": True, "evidence": items}), 200

@evidence_bp.route('/api/evidence/<int:evidence_id>', methods=['PUT', 'DELETE'])
def update_or_delete_evidence(evidence_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if request.method == 'DELETE':
        cursor.execute("DELETE FROM evidence WHERE id = ?", (evidence_id,))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Evidence item deleted"}), 200
        
    else: # PUT
        data = request.get_json() or {}
        fields = []
        values = []
        for key in ['status', 'notes', 'name', 'category', 'importance']:
            if key in data:
                fields.append(f"{key} = ?")
                values.append(data[key])
                
        if fields:
            values.append(evidence_id)
            cursor.execute(f"UPDATE evidence SET {', '.join(fields)} WHERE id = ?", tuple(values))
            conn.commit()
            
        conn.close()
        return jsonify({"success": True, "message": "Evidence item updated"}), 200
