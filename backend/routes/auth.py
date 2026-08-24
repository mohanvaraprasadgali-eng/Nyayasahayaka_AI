from flask import Blueprint, request, jsonify, g
from database.db import get_db_connection
from services.auth_service import AuthService, login_required
from services.document_security import DocumentSecurityService

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json() or {}
        role = data.get('role', 'citizen').lower()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        phone = data.get('phone', '').strip()
        password = data.get('password', '').strip()
        location = data.get('location', 'Hyderabad')
        city = data.get('city', 'Hyderabad')
        state = data.get('state', 'Telangana')
        language = data.get('language', 'en')

        if not name or not email or not password:
            return jsonify({"success": False, "error": "Name, email, and password are required."}), 400

        if role not in ['citizen', 'lawyer', 'admin']:
            return jsonify({"success": False, "error": "Invalid account type."}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if email exists
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            conn.close()
            return jsonify({"success": False, "error": "An account with this email already exists."}), 409

        password_hash = AuthService.hash_password(password)

        cursor.execute("""
            INSERT INTO users (name, email, phone, password_hash, role, location, city, state, language)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (name, email, phone, password_hash, role, location, city, state, language))
        user_id = cursor.lastrowid

        lawyer_profile_id = None
        if role == 'lawyer':
            bar_council_number = data.get('bar_council_number', 'PENDING-REG')
            state_bar_council = data.get('state_bar_council', f"Bar Council of {state}")
            specialization = data.get('specialization', 'General Civil & Consumer Law')
            experience_years = int(data.get('experience_years', 1))
            languages_known = data.get('languages_known', 'English, Hindi, Telugu')
            bio = data.get('bio', '')

            cursor.execute("""
                INSERT INTO lawyer_profiles (user_id, bar_council_number, state_bar_council, specialization, experience_years, languages_known, bio, verification_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')
            """, (user_id, bar_council_number, state_bar_council, specialization, experience_years, languages_known, bio))
            lawyer_profile_id = cursor.lastrowid

            # Create notification for admin
            cursor.execute("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
            admin_row = cursor.fetchone()
            if admin_row:
                cursor.execute("""
                    INSERT INTO notifications (user_id, title, message, type, link_tab)
                    VALUES (?, 'New Lawyer Verification Request', ?, 'info', 'admin_lawyers')
                """, (admin_row[0], f"Advocate {name} ({bar_council_number}) submitted registration for verification."))

        conn.commit()

        # Audit log
        DocumentSecurityService.log_audit(
            user_id=user_id,
            user_role=role,
            user_name=name,
            action="REGISTER",
            target_type="user",
            target_id=str(user_id),
            details=f"Registered new {role} account ({email})."
        )

        conn.close()

        token = AuthService.create_token(user_id, role, email)

        return jsonify({
            "success": True,
            "message": "Account created successfully.",
            "token": token,
            "user": {
                "id": user_id,
                "name": name,
                "email": email,
                "phone": phone,
                "role": role,
                "location": location,
                "city": city,
                "state": state,
                "language": language,
                "lawyer_profile_id": lawyer_profile_id,
                "verification_status": "PENDING" if role == 'lawyer' else None
            }
        }), 201

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json() or {}
        email = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()

        if not email or not password:
            return jsonify({"success": False, "error": "Email and password are required."}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user_row = cursor.fetchone()
        if not user_row:
            conn.close()
            return jsonify({"success": False, "error": "Invalid email or password."}), 401

        user = dict(user_row)
        if not AuthService.verify_password(password, user['password_hash']):
            conn.close()
            return jsonify({"success": False, "error": "Invalid email or password."}), 401

        # Check lawyer profile
        lawyer_profile = None
        if user['role'] == 'lawyer':
            cursor.execute("SELECT * FROM lawyer_profiles WHERE user_id = ?", (user['id'],))
            lp_row = cursor.fetchone()
            if lp_row:
                lawyer_profile = dict(lp_row)

        conn.close()

        token = AuthService.create_token(user['id'], user['role'], user['email'])

        # Audit log
        DocumentSecurityService.log_audit(
            user_id=user['id'],
            user_role=user['role'],
            user_name=user['name'],
            action="LOGIN",
            target_type="auth",
            target_id=str(user['id']),
            details=f"User {user['name']} logged in."
        )

        user_info = {
            "id": user['id'],
            "name": user['name'],
            "email": user['email'],
            "phone": user['phone'],
            "role": user['role'],
            "location": user['location'],
            "city": user['city'],
            "state": user['state'],
            "language": user['language'],
            "profile_photo": user['profile_photo'],
            "lawyer_profile": lawyer_profile
        }

        return jsonify({
            "success": True,
            "token": token,
            "user": user_info
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@auth_bp.route('/api/auth/me', methods=['GET'])
def get_me():
    user = AuthService.get_current_user_from_request()
    if not user:
        return jsonify({"success": False, "error": "Not authenticated"}), 401

    conn = get_db_connection()
    cursor = conn.cursor()

    lawyer_profile = None
    if user['role'] == 'lawyer':
        cursor.execute("SELECT * FROM lawyer_profiles WHERE user_id = ?", (user['id'],))
        lp_row = cursor.fetchone()
        if lp_row:
            lawyer_profile = dict(lp_row)

    conn.close()

    return jsonify({
        "success": True,
        "user": {
            **user,
            "lawyer_profile": lawyer_profile
        }
    }), 200

@auth_bp.route('/api/auth/demo-users', methods=['GET'])
def get_demo_users():
    """
    Returns list of pre-seeded test personas for 1-click persona switching during testing.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT u.id, u.name, u.email, u.phone, u.role, u.location, u.city, u.state, u.language,
               lp.id as lawyer_profile_id, lp.bar_council_number, lp.specialization, lp.verification_status, lp.rating
        FROM users u
        LEFT JOIN lawyer_profiles lp ON u.id = lp.user_id
        ORDER BY u.id ASC
    """)
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()

    return jsonify({
        "success": True,
        "demo_users": rows
    }), 200
