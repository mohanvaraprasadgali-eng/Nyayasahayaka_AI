from flask import Blueprint, request, jsonify
from datetime import datetime
from services.doc_generator import TEMPLATES_METADATA, generate_document_text
from database.db import get_db_connection
import json

documents_bp = Blueprint('documents', __name__)

@documents_bp.route('/api/document-templates', methods=['GET'])
def get_templates():
    return jsonify({
        "success": True,
        "templates": TEMPLATES_METADATA
    }), 200

@documents_bp.route('/api/generate-document', methods=['POST'])
def generate_document():
    try:
        data = request.get_json() or {}
        template_id = data.get('template_id', 'salary_notice')
        fields = data.get('fields', {})
        case_id = data.get('case_id')
        save_to_case = data.get('save_to_case', False)
        
        draft_text = generate_document_text(template_id, fields)
        
        doc_id = None
        if save_to_case and case_id:
            conn = get_db_connection()
            cursor = conn.cursor()
            template_meta = next((t for t in TEMPLATES_METADATA if t['id'] == template_id), None)
            doc_title = template_meta['title'] if template_meta else "Generated Legal Notice"
            
            cursor.execute("""
                INSERT INTO documents (case_id, title, document_type, filename, extracted_text, file_content)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (case_id, doc_title, "Legal Draft", f"{template_id}_{datetime.now().strftime('%Y%m%d%H%M')}.txt", draft_text[:500], draft_text))
            doc_id = cursor.lastrowid
            
            # Also add timeline event
            cursor.execute("""
                INSERT INTO timeline_events (case_id, event_date, title, description, event_type)
                VALUES (?, date('now'), ?, ?, 'notice_generated')
            """, (case_id, f"Draft Generated: {doc_title}", f"Drafted statutory notice using NyayaSahayak AI."))
            
            conn.commit()
            conn.close()

        return jsonify({
            "success": True,
            "draft": draft_text,
            "template_id": template_id,
            "document_id": doc_id,
            "disclaimer": "AI-generated draft — review carefully and seek professional advice when necessary."
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@documents_bp.route('/api/documents', methods=['GET', 'POST'])
def list_or_create_documents():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if request.method == 'POST':
        data = request.get_json() or {}
        case_id = data.get('case_id')
        title = data.get('title', 'Untitled Document')
        doc_type = data.get('document_type', 'General')
        extracted_text = data.get('extracted_text', '')
        file_content = data.get('file_content', '')
        structured_analysis = json.dumps(data.get('structured_analysis', {}))
        
        cursor.execute("""
            INSERT INTO documents (case_id, title, document_type, filename, extracted_text, structured_analysis, file_content)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (case_id, title, doc_type, data.get('filename', 'document.txt'), extracted_text, structured_analysis, file_content))
        doc_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            "success": True,
            "id": doc_id,
            "message": "Document saved successfully"
        }), 201
        
    else:
        case_id = request.args.get('case_id')
        if case_id:
            cursor.execute("SELECT * FROM documents WHERE case_id = ? ORDER BY created_at DESC", (case_id,))
        else:
            cursor.execute("SELECT * FROM documents ORDER BY created_at DESC")
            
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify({
            "success": True,
            "documents": rows
        }), 200
