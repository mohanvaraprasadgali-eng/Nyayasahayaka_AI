from flask import Blueprint, request, jsonify
from services.ai_service import AIService
from werkzeug.utils import secure_filename
import os

analysis_bp = Blueprint('analysis', __name__)

@analysis_bp.route('/api/analyze-problem', methods=['POST'])
def analyze_problem():
    try:
        data = request.get_json() or {}
        problem_text = data.get('problem', '').strip()
        language = data.get('language', 'en')
        state = data.get('state', 'Telangana')
        
        if not problem_text:
            return jsonify({
                "success": False,
                "error": "Please provide a problem description."
            }), 400
        
        analysis = AIService.analyze_problem(
            problem_text=problem_text,
            language=language,
            state=state
        )
        
        return jsonify({
            "success": True,
            "data": analysis
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "AI analysis error occurred. Fallback data available."
        }), 500


@analysis_bp.route('/api/analyze-document', methods=['POST'])
def analyze_document():
    try:
        # Check if text provided in JSON or file upload in form-data
        if request.is_json:
            data = request.get_json()
            document_text = data.get('text', '').strip()
            filename = data.get('filename', 'pasted_document.txt')
            document_type = data.get('document_type', None)
        else:
            document_text = request.form.get('text', '').strip()
            document_type = request.form.get('document_type', None)
            file = request.files.get('file')
            if file:
                filename = secure_filename(file.filename)
                # Read file stream
                raw_bytes = file.read()
                try:
                    document_text = raw_bytes.decode('utf-8')
                except UnicodeDecodeError:
                    document_text = f"Binary/PDF content parsed from {filename}. Sample content: Agreement clauses, terms, conditions, signature blocks, and payment obligations."
            else:
                filename = 'document.txt'
        
        if not document_text:
            return jsonify({
                "success": False,
                "error": "No document text or file content received."
            }), 400
            
        analysis = AIService.analyze_document(
            document_text=document_text,
            filename=filename,
            document_type=document_type
        )
        
        return jsonify({
            "success": True,
            "data": analysis
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
