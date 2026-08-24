import os
from flask import Blueprint, request, jsonify, g, send_file
from database.db import get_db_connection
from services.auth_service import AuthService, login_required
from services.document_security import DocumentSecurityService
from config import Config

secure_docs_bp = Blueprint('secure_documents', __name__)

@secure_docs_bp.route('/api/cases/<int:case_id>/documents', methods=['GET'])
@login_required
def list_case_documents(case_id):
    user = g.current_user
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM cases WHERE id = ?", (case_id,))
    case_row = cursor.fetchone()
    if not case_row:
        conn.close()
        return jsonify({"success": False, "error": "Case not found."}), 404

    case = dict(case_row)

    # 1. Citizen owner access
    if user['role'] == 'citizen':
        if case['user_id'] != user['id']:
            conn.close()
            return jsonify({"success": False, "error": "Access Denied: You do not own this case."}), 403

    # 2. Lawyer access check
    elif user['role'] == 'lawyer':
        cursor.execute("SELECT * FROM lawyer_profiles WHERE user_id = ?", (user['id'],))
        lp_row = cursor.fetchone()
        if not lp_row:
            conn.close()
            return jsonify({"success": False, "error": "Lawyer profile not found."}), 404
        
        lawyer = dict(lp_row)
        if lawyer['verification_status'] != 'VERIFIED':
            conn.close()
            return jsonify({"success": False, "error": "Account not verified by administration."}), 403

        if case['assigned_lawyer_id'] != lawyer['id']:
            conn.close()
            return jsonify({
                "success": False,
                "error": "🔒 Access Denied: Case documents are private and accessible only to the accepted assigned advocate."
            }), 403

        allowed_statuses = ['LAWYER_ACCEPTED', 'DOCUMENTS_SHARED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
        if case['status'] not in allowed_statuses:
            conn.close()
            return jsonify({
                "success": False,
                "error": f"Case documents not yet unlocked (Current status: {case['status']})."
            }), 403

    # Fetch documents
    cursor.execute("""
        SELECT id, case_id, user_id, title, document_type, filename, file_size, mime_type, is_private, file_content, created_at
        FROM case_documents
        WHERE case_id = ?
        ORDER BY created_at DESC
    """, (case_id,))
    docs = [dict(r) for r in cursor.fetchall()]
    conn.close()

    # Log audit
    DocumentSecurityService.log_audit(
        user_id=user['id'],
        user_role=user['role'],
        user_name=user['name'],
        action="VIEW_DOCUMENT_LIST",
        target_type="case_documents",
        target_id=str(case_id),
        case_id=case_id,
        details=f"Viewed document list for Case #{case_id} ({len(docs)} documents)."
    )

    return jsonify({
        "success": True,
        "case_id": case_id,
        "access_level": "Authorized",
        "documents": docs
    }), 200

@secure_docs_bp.route('/api/cases/<int:case_id>/documents/<int:doc_id>', methods=['GET'])
@login_required
def get_secure_document(case_id, doc_id):
    user = g.current_user
    has_access, reason, doc = DocumentSecurityService.verify_document_access(user, case_id, doc_id)

    if not has_access:
        # Audit access violation attempt
        DocumentSecurityService.log_audit(
            user_id=user['id'],
            user_role=user['role'],
            user_name=user['name'],
            action="UNAUTHORIZED_ACCESS_ATTEMPT",
            target_type="case_document",
            target_id=str(doc_id),
            case_id=case_id,
            document_id=doc_id,
            details=f"Access denied: {reason}"
        )
        return jsonify({
            "success": False,
            "error": reason
        }), 403

    # Audit successful document access
    action_name = "DOWNLOAD_DOCUMENT" if request.args.get('download') == 'true' else "VIEW_DOCUMENT"
    DocumentSecurityService.log_audit(
        user_id=user['id'],
        user_role=user['role'],
        user_name=user['name'],
        action=action_name,
        target_type="case_document",
        target_id=str(doc_id),
        case_id=case_id,
        document_id=doc_id,
        details=f"{user['role'].capitalize()} {user['name']} accessed '{doc['filename']}' for Case #{case_id}."
    )

    # Check if actual physical file exists on disk
    file_path = doc.get('file_path')
    if file_path and os.path.exists(file_path):
        return send_file(
            file_path,
            mimetype=doc.get('mime_type', 'application/pdf'),
            as_attachment=(request.args.get('download') == 'true'),
            download_name=doc.get('filename')
        )

    # Fallback: Return structured metadata & content if text/generated
    return jsonify({
        "success": True,
        "document": {
            "id": doc['id'],
            "case_id": doc['case_id'],
            "title": doc['title'],
            "document_type": doc['document_type'],
            "filename": doc['filename'],
            "file_size": doc['file_size'],
            "mime_type": doc['mime_type'],
            "file_content": doc.get('file_content', 'Secure document payload verified and active.'),
            "created_at": doc['created_at'],
            "security_seal": "🔒 Verified Private Document — Restricted to Client & Assigned Legal Counsel"
        }
    }), 200

@secure_docs_bp.route('/api/cases/<int:case_id>/documents', methods=['POST'])
@login_required
def upload_case_document(case_id):
    user = g.current_user
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM cases WHERE id = ?", (case_id,))
    case_row = cursor.fetchone()
    if not case_row:
        conn.close()
        return jsonify({"success": False, "error": "Case not found."}), 404

    case = dict(case_row)

    # Check permission to upload
    can_upload = False
    if user['role'] == 'citizen' and case['user_id'] == user['id']:
        can_upload = True
    elif user['role'] == 'admin':
        can_upload = True
    elif user['role'] == 'lawyer':
        cursor.execute("SELECT id FROM lawyer_profiles WHERE user_id = ?", (user['id'],))
        lp = cursor.fetchone()
        if lp and case['assigned_lawyer_id'] == lp[0]:
            can_upload = True

    if not can_upload:
        conn.close()
        return jsonify({"success": False, "error": "Unauthorized to upload files to this case."}), 403

    title = request.form.get('title') or "Case Document"
    doc_type = request.form.get('document_type') or "Evidence"

    if 'file' in request.files:
        file = request.files['file']
        try:
            doc_meta = DocumentSecurityService.save_secure_file(
                file_obj=file,
                user_id=user['id'],
                case_id=case_id,
                title=title,
                doc_type=doc_type
            )
            conn.close()
            return jsonify({
                "success": True,
                "message": "File uploaded securely to private vault.",
                "document": doc_meta
            }), 201
        except Exception as e:
            conn.close()
            return jsonify({"success": False, "error": str(e)}), 400

    # JSON text payload
    data = request.get_json() or {}
    title = data.get('title', 'Legal Document')
    doc_type = data.get('document_type', 'Evidence')
    filename = data.get('filename', 'document.pdf')
    content = data.get('file_content', '')

    cursor.execute("""
        INSERT INTO case_documents (case_id, user_id, title, document_type, filename, file_path, file_size, mime_type, is_private, file_content)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'application/pdf', 1, ?)
    """, (case_id, user['id'], title, doc_type, filename, f"secure_storage/{filename}", len(content.encode('utf-8')), content))
    doc_id = cursor.lastrowid
    conn.commit()
    conn.close()

    DocumentSecurityService.log_audit(
        user_id=user['id'],
        user_role=user['role'],
        user_name=user['name'],
        action="UPLOAD_DOCUMENT",
        target_type="case_document",
        target_id=str(doc_id),
        case_id=case_id,
        document_id=doc_id,
        details=f"Uploaded '{filename}' ({doc_type}) for Case #{case_id}."
    )

    return jsonify({
        "success": True,
        "message": "Document added to private case vault.",
        "document_id": doc_id
    }), 201

@secure_docs_bp.route('/api/citizen/document-vault', methods=['GET'])
@login_required
def get_citizen_vault():
    user = g.current_user
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT cd.*, c.title as case_title, c.status as case_status,
               u_lawyer.name as assigned_lawyer_name
        FROM case_documents cd
        LEFT JOIN cases c ON cd.case_id = c.id
        LEFT JOIN lawyer_profiles lp ON c.assigned_lawyer_id = lp.id
        LEFT JOIN users u_lawyer ON lp.user_id = u_lawyer.id
        WHERE cd.user_id = ?
        ORDER BY cd.created_at DESC
    """, (user['id'],))
    docs = [dict(r) for r in cursor.fetchall()]
    conn.close()

    return jsonify({
        "success": True,
        "documents": docs
    }), 200
