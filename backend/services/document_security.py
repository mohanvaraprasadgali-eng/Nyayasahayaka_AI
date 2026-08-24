import os
import uuid
import re
from datetime import datetime
from werkzeug.utils import secure_filename
from config import Config
from database.db import get_db_connection

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'docx', 'txt'}
ALLOWED_MIME_TYPES = {
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
}

class DocumentSecurityService:
    @staticmethod
    def init_storage():
        os.makedirs(Config.SECURE_STORAGE_PATH, exist_ok=True)

    @staticmethod
    def is_allowed_file(filename: str) -> bool:
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    @classmethod
    def save_secure_file(cls, file_obj, user_id: int, case_id: int = None, title: str = "Legal Document", doc_type: str = "General") -> dict:
        """
        Securely stores file to private storage outside web root and records in case_documents.
        """
        cls.init_storage()
        raw_filename = secure_filename(file_obj.filename)
        if not raw_filename:
            raw_filename = f"doc_{int(datetime.now().timestamp())}.pdf"

        if not cls.is_allowed_file(raw_filename):
            raise ValueError(f"File format not supported. Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}")

        unique_file_id = f"doc_{uuid.uuid4().hex[:12]}_{raw_filename}"
        disk_path = os.path.join(Config.SECURE_STORAGE_PATH, unique_file_id)
        
        file_obj.save(disk_path)
        file_size = os.path.getsize(disk_path)

        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO case_documents (case_id, user_id, title, document_type, filename, file_path, file_size, mime_type, is_private)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        """, (case_id, user_id, title, doc_type, raw_filename, disk_path, file_size, getattr(file_obj, 'content_type', 'application/pdf')))
        
        doc_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return {
            "id": doc_id,
            "filename": raw_filename,
            "file_size": file_size,
            "title": title,
            "document_type": doc_type
        }

    @classmethod
    def verify_document_access(cls, user: dict, case_id: int, document_id: int) -> tuple[bool, str, dict]:
        """
        Enforces strict role-based and case-based document authorization.
        Returns (has_access: bool, denial_reason: str, document_dict: dict)
        """
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM case_documents WHERE id = ?", (document_id,))
        doc_row = cursor.fetchone()
        if not doc_row:
            conn.close()
            return False, "Document not found in vault.", None

        doc = dict(doc_row)
        
        # Check Case Details
        effective_case_id = case_id or doc.get('case_id')
        case = None
        if effective_case_id:
            cursor.execute("SELECT * FROM cases WHERE id = ?", (effective_case_id,))
            case_row = cursor.fetchone()
            if case_row:
                case = dict(case_row)

        user_role = user.get('role', 'citizen')
        user_id = user.get('id')

        # 1. Admin Access
        if user_role == 'admin':
            conn.close()
            return True, "Authorized (Administrator)", doc

        # 2. Document Owner (Citizen who uploaded it)
        if doc['user_id'] == user_id:
            conn.close()
            return True, "Authorized (Document Owner)", doc

        # 3. Lawyer Access Check
        if user_role == 'lawyer':
            # Find lawyer profile
            cursor.execute("SELECT * FROM lawyer_profiles WHERE user_id = ?", (user_id,))
            lawyer_row = cursor.fetchone()
            if not lawyer_row:
                conn.close()
                return False, "Lawyer profile not found or incomplete.", None
            
            lawyer = dict(lawyer_row)
            
            if lawyer['verification_status'] != 'VERIFIED':
                conn.close()
                return False, f"Lawyer account is not verified (Status: {lawyer['verification_status']}).", None

            if not case:
                conn.close()
                return False, "Document is not associated with an accessible case.", None

            # Lawyer MUST be the assigned lawyer for this specific case
            if case.get('assigned_lawyer_id') != lawyer['id']:
                conn.close()
                return False, "Access Denied: You are not the assigned legal counsel for this case.", None

            # Case status must allow document sharing (accepted or later)
            allowed_statuses = ['LAWYER_ACCEPTED', 'DOCUMENTS_SHARED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
            if case.get('status') not in allowed_statuses:
                conn.close()
                return False, f"Case status ({case.get('status')}) does not permit document handover yet.", None

            conn.close()
            return True, "Authorized (Assigned Verified Lawyer)", doc

        conn.close()
        return False, "Unauthorized access: You do not have permission to view this document.", None

    @staticmethod
    def log_audit(user_id: int, user_role: str, user_name: str, action: str, target_type: str, target_id: str, case_id: int = None, document_id: int = None, details: str = "", ip_address: str = "127.0.0.1"):
        """
        Records an immutable audit log entry.
        Never logs sensitive document content.
        """
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO audit_logs (user_id, user_role, user_name, action, target_type, target_id, case_id, document_id, details, ip_address)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (user_id, user_role, user_name, action, target_type, target_id, case_id, document_id, details, ip_address))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"[AUDIT LOG ERROR] Failed to record audit log: {e}")
