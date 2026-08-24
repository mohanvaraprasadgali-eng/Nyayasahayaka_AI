from flask import Blueprint, request, jsonify, g
from database.db import get_db_connection
from services.auth_service import AuthService, login_required
from services.document_security import DocumentSecurityService
from services.evidence_guidance import EvidenceGuidanceService
from services.matching_service import MatchingService
from services.ai_service import AIService
import json

cases_bp = Blueprint('cases', __name__)

@cases_bp.route('/api/stats', methods=['GET'])
def get_dashboard_stats():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM cases")
    total_cases = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM case_documents")
    total_documents = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM action_steps WHERE status != 'completed'")
    pending_actions = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM reminders WHERE completed = 0")
    upcoming_deadlines = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM document_requirements")
    total_req = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM document_requirements WHERE status = 'available'")
    available_req = cursor.fetchone()[0]
    
    evidence_pct = int((available_req / total_req * 100)) if total_req > 0 else 80
    
    conn.close()
    
    return jsonify({
        "success": True,
        "stats": {
            "total_cases": total_cases,
            "total_documents": total_documents,
            "pending_actions": pending_actions,
            "upcoming_deadlines": upcoming_deadlines,
            "evidence_collected_count": available_req,
            "total_evidence_count": total_req,
            "evidence_collected_percentage": evidence_pct
        }
    }), 200

@cases_bp.route('/api/cases', methods=['GET'])
def get_cases():
    user = AuthService.get_current_user_from_request()
    conn = get_db_connection()
    cursor = conn.cursor()

    if user and user['role'] == 'citizen':
        cursor.execute("""
            SELECT c.*, 
                   lp.bar_council_number, lp.specialization, lp.rating as lawyer_rating,
                   u_lawyer.name as assigned_lawyer_name, u_lawyer.phone as assigned_lawyer_phone, u_lawyer.email as assigned_lawyer_email
            FROM cases c
            LEFT JOIN lawyer_profiles lp ON c.assigned_lawyer_id = lp.id
            LEFT JOIN users u_lawyer ON lp.user_id = u_lawyer.id
            WHERE c.user_id = ?
            ORDER BY c.created_at DESC
        """, (user['id'],))
    elif user and user['role'] == 'lawyer':
        cursor.execute("SELECT id FROM lawyer_profiles WHERE user_id = ?", (user['id'],))
        lp = cursor.fetchone()
        lawyer_id = lp[0] if lp else -1
        cursor.execute("""
            SELECT c.*, 
                   u.name as client_name, u.phone as client_phone, u.email as client_email, u.location as client_location
            FROM cases c
            JOIN users u ON c.user_id = u.id
            WHERE c.assigned_lawyer_id = ?
            ORDER BY c.created_at DESC
        """, (lawyer_id,))
    else:
        cursor.execute("""
            SELECT c.*, 
                   u.name as client_name,
                   u_lawyer.name as assigned_lawyer_name
            FROM cases c
            LEFT JOIN users u ON c.user_id = u.id
            LEFT JOIN lawyer_profiles lp ON c.assigned_lawyer_id = lp.id
            LEFT JOIN users u_lawyer ON lp.user_id = u_lawyer.id
            ORDER BY c.created_at DESC
        """)

    cases = [dict(row) for row in cursor.fetchall()]

    for case in cases:
        # Document requirements count
        cursor.execute("SELECT COUNT(*) FROM document_requirements WHERE case_id = ?", (case['id'],))
        total_req = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM document_requirements WHERE case_id = ? AND status = 'available'", (case['id'],))
        col_req = cursor.fetchone()[0]
        
        # Pending action steps count
        cursor.execute("SELECT COUNT(*) FROM action_steps WHERE case_id = ? AND status != 'completed'", (case['id'],))
        pending_act = cursor.fetchone()[0]

        # Case documents count
        cursor.execute("SELECT COUNT(*) FROM case_documents WHERE case_id = ?", (case['id'],))
        doc_count = cursor.fetchone()[0]
        
        case['doc_progress'] = {
            "total": total_req,
            "available": col_req,
            "percentage": int((col_req / total_req * 100)) if total_req > 0 else 0
        }
        case['pending_actions_count'] = pending_act
        case['document_count'] = doc_count
        
    conn.close()
    return jsonify({
        "success": True,
        "cases": cases
    }), 200

@cases_bp.route('/api/cases', methods=['POST'])
def create_case():
    try:
        user = AuthService.get_current_user_from_request()
        user_id = user['id'] if user else 1

        data = request.get_json() or {}
        title = data.get('title', '').strip()
        description = data.get('description', '').strip()
        category = data.get('category', 'General')
        sub_category = data.get('sub_category', '')
        location = data.get('location', 'Hyderabad, Telangana')
        urgency = data.get('urgency', 'Medium')
        preferred_language = data.get('preferred_language', 'en')
        
        if not description:
            return jsonify({"success": False, "error": "Problem description is required."}), 400

        # Step 1: Run AI Problem Analysis
        ai_res = AIService.analyze_problem(description, language=preferred_language)
        
        if not title:
            title = ai_res.get('problem_title', 'Citizen Legal Grievance')
        category = ai_res.get('legal_category', category)
        risk_level = ai_res.get('risk_assessment', {}).get('level', 'yellow')
        summary = ai_res.get('summary', '')
        
        # Determine Complexity (🟢 BASIC, 🟡 MODERATE, 🔴 COMPLEX)
        complexity = data.get('complexity')
        if not complexity:
            if risk_level == "red" or "fraud" in description.lower() or "fir" in description.lower() or "cyber" in description.lower() or len(description) > 350:
                complexity = "COMPLEX"
            elif risk_level == "yellow" or "salary" in description.lower() or "deposit" in description.lower() or "rent" in description.lower() or "warranty" in description.lower() or "₹" in description or "rs" in description.lower():
                complexity = "MODERATE"
            else:
                complexity = "BASIC"

        platform_fee = 199.0 if complexity == "BASIC" else (499.0 if complexity == "MODERATE" else 999.0)

        applicable_laws = ", ".join([f"{r.get('act', '')} ({r.get('section', '')})" for r in ai_res.get('possible_rights', [])])

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO cases (user_id, title, category, sub_category, description, location, urgency, complexity, platform_fee, payment_status, risk_level, status, summary, applicable_laws)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'UNPAID', ?, 'ANALYZED', ?, ?)
        """, (user_id, title, category, sub_category, description, location, urgency, complexity, platform_fee, risk_level, summary, applicable_laws))
        case_id = cursor.lastrowid

        # Insert Document Requirements
        evidence_needed = ai_res.get('evidence_needed', [])
        if not evidence_needed:
            evidence_needed = [
                {"name": "Relevant Agreement / Contract", "importance": "Essential"},
                {"name": "Payment Proof / Bank Statement", "importance": "Essential"},
                {"name": "Written Communications / Messages", "importance": "Supporting"}
            ]

        for item in evidence_needed:
            doc_name = item.get('name', 'Evidence Document')
            importance = item.get('importance', 'Essential')
            guidance = EvidenceGuidanceService.get_guidance_for_document(doc_name)
            
            cursor.execute("""
                INSERT INTO document_requirements (case_id, name, importance, status, why_useful, alternatives_guidance, how_to_obtain)
                VALUES (?, ?, ?, 'pending', ?, ?, ?)
            """, (case_id, doc_name, importance, guidance['why_useful'], json.dumps(guidance['alternatives']), guidance['how_to_obtain']))

        # Insert Action Steps
        action_plan = ai_res.get('action_plan', [])
        for idx, step in enumerate(action_plan, 1):
            cursor.execute("""
                INSERT INTO action_steps (case_id, step_order, title, description, authority, deadline)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (case_id, idx, step.get('step', f"Step {idx}"), step.get('description', ''), step.get('authority', 'Relevant Authority'), step.get('timeline', 'Within 15 days')))

        # Initial Timeline Event
        cursor.execute("""
            INSERT INTO timeline_events (case_id, event_date, title, description, event_type)
            VALUES (?, date('now'), 'Case Created & Analyzed', 'Citizen submitted problem description. AI structured legal categorization and document checklist.', 'problem_reported')
        """, (case_id,))

        conn.commit()

        # Audit log
        user_name = user['name'] if user else "Citizen"
        user_role = user['role'] if user else "citizen"
        DocumentSecurityService.log_audit(
            user_id=user_id,
            user_role=user_role,
            user_name=user_name,
            action="CASE_CREATED",
            target_type="case",
            target_id=str(case_id),
            case_id=case_id,
            details=f"Created case: '{title}' (Complexity: {complexity}, Fee: ₹{platform_fee})."
        )

        conn.close()

        return jsonify({
            "success": True,
            "case_id": case_id,
            "title": title,
            "category": category,
            "complexity": complexity,
            "platform_fee": platform_fee,
            "risk_level": risk_level,
            "summary": summary,
            "analysis": ai_res
        }), 201

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@cases_bp.route('/api/cases/<int:case_id>', methods=['GET'])
def get_case_detail(case_id):
    user = AuthService.get_current_user_from_request()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT c.*, 
               u.name as client_name, u.phone as client_phone, u.email as client_email, u.location as client_location, u.city as client_city, u.state as client_state,
               lp.bar_council_number, lp.specialization, lp.rating as lawyer_rating, lp.experience_years as lawyer_experience,
               u_lawyer.name as assigned_lawyer_name, u_lawyer.phone as assigned_lawyer_phone, u_lawyer.email as assigned_lawyer_email
        FROM cases c
        LEFT JOIN users u ON c.user_id = u.id
        LEFT JOIN lawyer_profiles lp ON c.assigned_lawyer_id = lp.id
        LEFT JOIN users u_lawyer ON lp.user_id = u_lawyer.id
        WHERE c.id = ?
    """, (case_id,))
    case_row = cursor.fetchone()

    if not case_row:
        conn.close()
        return jsonify({"success": False, "error": "Case not found"}), 404

    case = dict(case_row)

    # Check Anonymization if viewed by a lawyer who is NOT assigned
    is_assigned_lawyer = False
    if user and user['role'] == 'lawyer':
        cursor.execute("SELECT id FROM lawyer_profiles WHERE user_id = ?", (user['id'],))
        lp = cursor.fetchone()
        if lp and case.get('assigned_lawyer_id') == lp[0]:
            is_assigned_lawyer = True

    # If unassigned lawyer or public preview: Anonymize client identity
    if user and user['role'] == 'lawyer' and not is_assigned_lawyer:
        case['client_name'] = f"Citizen from {case.get('client_city', 'Hyderabad')}"
        case['client_phone'] = "🔒 Hidden until case acceptance"
        case['client_email'] = "🔒 Hidden until case acceptance"
        case['is_anonymized_preview'] = True
    else:
        case['is_anonymized_preview'] = False

    # Fetch document requirements
    cursor.execute("SELECT * FROM document_requirements WHERE case_id = ? ORDER BY id ASC", (case_id,))
    reqs = [dict(r) for r in cursor.fetchall()]
    for r in reqs:
        if r.get('alternatives_guidance') and isinstance(r['alternatives_guidance'], str):
            try:
                r['alternatives_guidance'] = json.loads(r['alternatives_guidance'])
            except Exception:
                pass
    case['document_requirements'] = reqs

    # Fetch action steps
    cursor.execute("SELECT * FROM action_steps WHERE case_id = ? ORDER BY step_order ASC", (case_id,))
    case['action_steps'] = [dict(r) for r in cursor.fetchall()]

    # Fetch timeline events
    cursor.execute("SELECT * FROM timeline_events WHERE case_id = ? ORDER BY event_date ASC, id ASC", (case_id,))
    case['timeline_events'] = [dict(r) for r in cursor.fetchall()]

    conn.close()
    return jsonify({
        "success": True,
        "case": case
    }), 200

@cases_bp.route('/api/cases/<int:case_id>/accept', methods=['POST'])
@login_required
def accept_case(case_id):
    user = g.current_user
    if user['role'] != 'lawyer' and user['role'] != 'admin':
        return jsonify({"success": False, "error": "Only registered advocates can accept case requests."}), 403

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM lawyer_profiles WHERE user_id = ?", (user['id'],))
    lp_row = cursor.fetchone()
    if not lp_row:
        conn.close()
        return jsonify({"success": False, "error": "Lawyer profile not found."}), 404

    lawyer = dict(lp_row)
    if lawyer['verification_status'] != 'VERIFIED':
        conn.close()
        return jsonify({"success": False, "error": "Your account must be verified before accepting citizen cases."}), 403

    # Check case availability
    cursor.execute("SELECT * FROM cases WHERE id = ?", (case_id,))
    case_row = cursor.fetchone()
    if not case_row:
        conn.close()
        return jsonify({"success": False, "error": "Case not found."}), 404

    case = dict(case_row)
    if case.get('assigned_lawyer_id') and case['assigned_lawyer_id'] != lawyer['id']:
        conn.close()
        return jsonify({"success": False, "error": "This case has already been accepted by another advocate."}), 409

    # Assign lawyer & update status
    cursor.execute("""
        UPDATE cases 
        SET assigned_lawyer_id = ?, status = 'IN_PROGRESS', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (lawyer['id'], case_id))

    # Add Timeline Event
    cursor.execute("""
        INSERT INTO timeline_events (case_id, event_date, title, description, event_type)
        VALUES (?, date('now'), 'Advocate Assigned & Documents Shared', ?, 'action')
    """, (case_id, f"{user['name']} accepted the case. Secure document vault and private consultation channel are now active."))

    # Send Notification to Citizen
    cursor.execute("""
        INSERT INTO notifications (user_id, title, message, type, link_tab, case_id)
        VALUES (?, 'Advocate Assigned to Your Case!', ?, 'case_accepted', 'cases', ?)
    """, (case['user_id'], f"{user['name']} ({lawyer['specialization']}) has accepted your case and is reviewing your documents.", case_id))

    conn.commit()

    # Log Audit
    DocumentSecurityService.log_audit(
        user_id=user['id'],
        user_role="lawyer",
        user_name=user['name'],
        action="LAWYER_ACCEPTED",
        target_type="case",
        target_id=str(case_id),
        case_id=case_id,
        details=f"Advocate {user['name']} accepted Case #{case_id}. Unlocked private documents and chat."
    )

    conn.close()

    return jsonify({
        "success": True,
        "message": f"Case #{case_id} accepted successfully! You now have secure access to case documents and client communication.",
        "case_id": case_id,
        "status": "IN_PROGRESS"
    }), 200

@cases_bp.route('/api/cases/<int:case_id>/decline', methods=['POST'])
@login_required
def decline_case(case_id):
    user = g.current_user
    return jsonify({
        "success": True,
        "message": f"Case #{case_id} declined. It remains available in the pool for other advocates."
    }), 200

@cases_bp.route('/api/cases/<int:case_id>/matching-lawyers', methods=['GET'])
def get_matching_lawyers(case_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cases WHERE id = ?", (case_id,))
    case_row = cursor.fetchone()
    conn.close()

    if not case_row:
        return jsonify({"success": False, "error": "Case not found"}), 404

    lawyers = MatchingService.find_matching_lawyers_for_case(dict(case_row))
    return jsonify({
        "success": True,
        "case_id": case_id,
        "lawyers": lawyers
    }), 200

@cases_bp.route('/api/cases/<int:case_id>/document-requirement/<int:req_id>', methods=['PUT'])
def update_doc_requirement(case_id, req_id):
    data = request.get_json() or {}
    status = data.get('status', 'available') # 'available', 'missing', 'not_applicable'
    user_notes = data.get('user_notes', '')

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE document_requirements
        SET status = ?, user_notes = ?
        WHERE id = ? AND case_id = ?
    """, (status, user_notes, req_id, case_id))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Document status updated successfully.",
        "requirement_id": req_id,
        "status": status
    }), 200

@cases_bp.route('/api/cases/<int:case_id>/missing-guidance', methods=['GET'])
def get_missing_guidance(case_id):
    doc_name = request.args.get('document_name', 'Agreement')
    guidance = EvidenceGuidanceService.get_guidance_for_document(doc_name)
    return jsonify({
        "success": True,
        "guidance": guidance
    }), 200
