from flask import Blueprint, request, jsonify
from database.db import get_db_connection

authorities_bp = Blueprint('authorities', __name__)

@authorities_bp.route('/api/authorities', methods=['GET'])
def get_authorities():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    category = request.args.get('category')
    state = request.args.get('state')
    is_legal_aid = request.args.get('is_legal_aid')
    
    query = "SELECT * FROM authorities WHERE 1=1"
    params = []
    
    if category and category != 'All':
        query += " AND category LIKE ?"
        params.append(f"%{category}%")
    if state and state != 'All':
        query += " AND (state = ? OR state = 'All India')"
        params.append(state)
    if is_legal_aid is not None:
        query += " AND is_legal_aid = ?"
        params.append(int(is_legal_aid))
        
    query += " ORDER BY is_legal_aid DESC, id ASC"
    cursor.execute(query, tuple(params))
    authorities = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify({
        "success": True,
        "authorities": authorities
    }), 200

@authorities_bp.route('/api/legal-sources', methods=['GET'])
def get_legal_sources():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM legal_sources ORDER BY id ASC")
    sources = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify({
        "success": True,
        "sources": sources
    }), 200

@authorities_bp.route('/api/check-legal-aid', methods=['POST'])
def check_legal_aid_eligibility():
    """
    Evaluates citizen eligibility for 100% Free Legal Aid under
    Section 12 of the Legal Services Authorities Act, 1987 (NALSA).
    """
    data = request.get_json() or {}
    gender = data.get('gender', '').lower()
    category = data.get('category', '').lower() # sc, st, obc, general
    annual_income = float(data.get('annual_income', 0))
    is_disabled = data.get('is_disabled', False)
    is_custody = data.get('is_custody', False)
    is_industrial_workman = data.get('is_industrial_workman', False)
    is_disaster_victim = data.get('is_disaster_victim', False)
    state = data.get('state', 'Telangana')
    
    # State-wise income ceiling (typically 3 Lakhs in Telangana/AP/Delhi, 1.5 Lakhs in some states)
    income_limit = 300000
    
    eligible = False
    reasons = []
    
    if gender in ['female', 'woman', 'transgender']:
        eligible = True
        reasons.append("Eligible under Section 12(c) - Women and Child category (No income cap applies).")
        
    if category in ['sc', 'st', 'scheduled caste', 'scheduled tribe']:
        eligible = True
        reasons.append("Eligible under Section 12(a) - Member of Scheduled Caste or Scheduled Tribe.")
        
    if is_disabled:
        eligible = True
        reasons.append("Eligible under Section 12(d) - Person with disability (under RPwD Act 2016).")
        
    if is_custody:
        eligible = True
        reasons.append("Eligible under Section 12(g) - Person in custody / protective custody.")
        
    if is_industrial_workman:
        eligible = True
        reasons.append("Eligible under Section 12(e) - Industrial workman facing dispute.")
        
    if is_disaster_victim:
        eligible = True
        reasons.append("Eligible under Section 12(f) - Victim of mass disaster, ethnic violence, or flood.")
        
    if annual_income > 0 and annual_income <= income_limit:
        eligible = True
        reasons.append(f"Eligible under Section 12(h) - Annual income of ₹{int(annual_income):,} is below the state threshold of ₹{income_limit:,}.")
        
    if not eligible and annual_income > income_limit:
        reasons.append(f"Annual income ₹{int(annual_income):,} exceeds the ₹{income_limit:,} statutory free legal aid ceiling for general category. You can still access Lok Adalat mediation and DLSA pre-litigation counseling at nominal court fees.")

    return jsonify({
        "success": True,
        "eligible": eligible,
        "reasons": reasons,
        "act_reference": "Section 12 of Legal Services Authorities Act, 1987",
        "official_helpline": "15100 (National Legal Aid Toll-Free 24x7)",
        "next_steps": [
            "Visit the nearest District Legal Services Authority (DLSA) in your District Court complex.",
            "Carry copy of Aadhaar Card and relevant eligibility proof (or self-declaration affidavit).",
            "Fill NALSA Front Office Legal Aid Application Form (No fee required).",
            "DLSA will appoint an empanelled legal aid advocate to represent your matter at zero legal expense."
        ]
    }), 200
