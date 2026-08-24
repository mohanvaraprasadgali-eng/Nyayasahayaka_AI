import os
import json
import base64
import hashlib
import hmac
import time
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from flask import request, jsonify, g
from config import Config
from database.db import get_db_connection

class AuthService:
    @staticmethod
    def hash_password(password: str) -> str:
        return generate_password_hash(password)

    @staticmethod
    def verify_password(password: str, hashed_password: str) -> bool:
        return check_password_hash(hashed_password, password)

    @staticmethod
    def create_token(user_id: int, role: str, email: str) -> str:
        """
        Creates a lightweight signed token for user session management.
        """
        payload = {
            "user_id": user_id,
            "role": role,
            "email": email,
            "exp": int(time.time()) + (86400 * 7) # 7 days
        }
        header = {"alg": "HS256", "typ": "JWT"}
        
        encoded_header = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
        encoded_payload = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
        
        signature_base = f"{encoded_header}.{encoded_payload}".encode()
        signature = hmac.new(Config.SECRET_KEY.encode(), signature_base, hashlib.sha256).digest()
        encoded_signature = base64.urlsafe_b64encode(signature).decode().rstrip("=")
        
        return f"{encoded_header}.{encoded_payload}.{encoded_signature}"

    @staticmethod
    def verify_token(token: str):
        try:
            parts = token.split(".")
            if len(parts) != 3:
                return None
            encoded_header, encoded_payload, encoded_signature = parts
            
            signature_base = f"{encoded_header}.{encoded_payload}".encode()
            expected_sig = hmac.new(Config.SECRET_KEY.encode(), signature_base, hashlib.sha256).digest()
            expected_encoded_sig = base64.urlsafe_b64encode(expected_sig).decode().rstrip("=")
            
            if not hmac.compare_digest(encoded_signature, expected_encoded_sig):
                return None
                
            padded_payload = encoded_payload + "=" * (-len(encoded_payload) % 4)
            payload = json.loads(base64.urlsafe_b64decode(padded_payload.encode()).decode())
            
            if payload.get("exp", 0) < int(time.time()):
                return None
                
            return payload
        except Exception:
            return None

    @classmethod
    def get_current_user_from_request(cls):
        """
        Retrieves user from Authorization header 'Bearer <token>' or fallback query/header.
        """
        auth_header = request.headers.get('Authorization', '')
        token = None
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        elif 'x-auth-token' in request.headers:
            token = request.headers['x-auth-token']
        elif 'token' in request.args:
            token = request.args.get('token')

        if not token:
            # Check for simulated demo user header for easy frontend debugging
            demo_user_id = request.headers.get('x-demo-user-id')
            if demo_user_id:
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("SELECT id, name, email, phone, role, location, city, state, language, profile_photo FROM users WHERE id = ?", (demo_user_id,))
                row = cursor.fetchone()
                conn.close()
                if row:
                    user_dict = dict(row)
                    return user_dict
            return None

        payload = cls.verify_token(token)
        if not payload:
            return None

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, phone, role, location, city, state, language, profile_photo FROM users WHERE id = ?", (payload['user_id'],))
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            return None
        return dict(row)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = AuthService.get_current_user_from_request()
        if not user:
            return jsonify({"success": False, "error": "Authentication required. Please log in."}), 401
        g.current_user = user
        return f(*args, **kwargs)
    return decorated_function

def require_role(roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = AuthService.get_current_user_from_request()
            if not user:
                return jsonify({"success": False, "error": "Authentication required."}), 401
            if user['role'] not in roles and 'admin' not in user['role']:
                return jsonify({"success": False, "error": f"Access denied. Required role: {', '.join(roles)}"}), 403
            g.current_user = user
            return f(*args, **kwargs)
        return decorated_function
    return decorator
