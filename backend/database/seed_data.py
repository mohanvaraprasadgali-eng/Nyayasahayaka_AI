import json
from datetime import datetime, timedelta
from database.db import get_db_connection
from services.auth_service import AuthService

def seed_database():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if already seeded
    cursor.execute("SELECT COUNT(*) FROM users")
    user_count = cursor.fetchone()[0]
    if user_count > 0:
        conn.close()
        return

    print("[DB] Seeding comprehensive NyayaAI multi-role data (Users, Lawyers, Cases, Subscriptions, Pricing, Audit Logs)...")

    # 1. Users
    password_citizen = AuthService.hash_password("pass123")
    password_lawyer = AuthService.hash_password("pass123")
    password_admin = AuthService.hash_password("admin123")

    users_data = [
        # Citizen 1
        ("Ramesh Kumar", "citizen@nyaya.ai", "+91 98765 43210", password_citizen, "citizen", "Madhapur, Hyderabad", "Hyderabad", "Telangana", "en", None),
        # Citizen 2
        ("Sunita Rao", "sunita@nyaya.ai", "+91 98480 12345", password_citizen, "citizen", "Indiranagar, Bengaluru", "Bengaluru", "Karnataka", "en", None),
        # Verified Lawyer 1
        ("Advocate Priya Sharma", "priya@nyaya.ai", "+91 98111 22233", password_lawyer, "lawyer", "High Court Road, Hyderabad", "Hyderabad", "Telangana", "en", None),
        # Verified Lawyer 2
        ("Advocate Rahul Kumar", "rahul@nyaya.ai", "+91 98222 33344", password_lawyer, "lawyer", "Banjara Hills, Hyderabad", "Hyderabad", "Telangana", "en", None),
        # Pending Lawyer 3
        ("Advocate Amit Verma", "amit@nyaya.ai", "+91 98333 44455", password_lawyer, "lawyer", "Secunderabad", "Secunderabad", "Telangana", "en", None),
        # Admin
        ("Legal Operations Admin", "admin@nyaya.ai", "+91 99999 88888", password_admin, "admin", "Admin HQ, New Delhi", "New Delhi", "Delhi", "en", None)
    ]

    for u in users_data:
        cursor.execute("""
            INSERT INTO users (name, email, phone, password_hash, role, location, city, state, language, profile_photo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, u)

    # 2. Lawyer Profiles
    # Adv Priya Sharma (user_id: 3)
    cursor.execute("""
        INSERT INTO lawyer_profiles (user_id, bar_council_number, state_bar_council, specialization, experience_years, languages_known, bio, verification_status, rating, total_cases_handled)
        VALUES (3, 'TS/1402/2016', 'Bar Council of Telangana', 'Real Estate & Tenancy, Consumer Law', 8, 'English, Telugu, Hindi', 'Senior High Court Advocate specializing in civil property disputes, tenancy rights, and consumer protection litigation.', 'VERIFIED', 4.9, 42)
    """)
    lawyer_priya_id = cursor.lastrowid

    # Adv Rahul Kumar (user_id: 4)
    cursor.execute("""
        INSERT INTO lawyer_profiles (user_id, bar_council_number, state_bar_council, specialization, experience_years, languages_known, bio, verification_status, rating, total_cases_handled)
        VALUES (4, 'TS/2091/2019', 'Bar Council of Telangana', 'Labour & Employment, Civil Law', 5, 'English, Telugu, Hindi', 'Practicing advocate with extensive experience in wage recovery, labour disputes, and service contracts.', 'VERIFIED', 4.7, 28)
    """)
    lawyer_rahul_id = cursor.lastrowid

    # Adv Amit Verma (user_id: 5 - PENDING)
    cursor.execute("""
        INSERT INTO lawyer_profiles (user_id, bar_council_number, state_bar_council, specialization, experience_years, languages_known, bio, verification_status, rating, total_cases_handled)
        VALUES (5, 'TS/3142/2023', 'Bar Council of Telangana', 'Cyber Law, IT Contracts & Privacy', 2, 'English, Hindi', 'Cyber law counsel focused on digital frauds, UPI scams, and data protection matters.', 'PENDING', 4.5, 6)
    """)
    lawyer_amit_id = cursor.lastrowid

    # 3. Lawyer Verification Documents
    cursor.execute("""
        INSERT INTO lawyer_verification_documents (lawyer_id, document_type, file_name, file_path, status)
        VALUES 
        (?, 'Bar Council Certificate', 'TS_1402_2016_Enrollment_Certificate.pdf', 'secure_storage/demo_bar_cert_priya.pdf', 'VERIFIED'),
        (?, 'Identity Proof', 'Aadhaar_Card_Verified.pdf', 'secure_storage/demo_id_priya.pdf', 'VERIFIED'),
        (?, 'Bar Council Certificate', 'TS_2091_2019_Enrollment_Certificate.pdf', 'secure_storage/demo_bar_cert_rahul.pdf', 'VERIFIED'),
        (?, 'Bar Council Certificate', 'TS_3142_2023_Enrollment_Pending.pdf', 'secure_storage/demo_bar_cert_amit.pdf', 'SUBMITTED'),
        (?, 'Identity Proof', 'Govt_ID_Card_Amit.pdf', 'secure_storage/demo_id_amit.pdf', 'SUBMITTED')
    """, (lawyer_priya_id, lawyer_priya_id, lawyer_rahul_id, lawyer_amit_id, lawyer_amit_id))

    # 4. Lawyer Subscriptions
    now = datetime.now()
    exp_active = (now + timedelta(days=78)).strftime('%Y-%m-%d')
    exp_soon = (now + timedelta(days=5)).strftime('%Y-%m-%d')

    cursor.execute("""
        INSERT INTO lawyer_subscriptions (lawyer_id, plan_name, price, duration_months, status, start_date, end_date)
        VALUES 
        (?, 'PRO', 999.0, 3, 'ACTIVE', ?, ?),
        (?, 'BASIC', 499.0, 1, 'EXPIRING_SOON', ?, ?)
    """, (lawyer_priya_id, (now - timedelta(days=12)).strftime('%Y-%m-%d'), exp_active, lawyer_rahul_id, (now - timedelta(days=25)).strftime('%Y-%m-%d'), exp_soon))

    # 5. Pricing Plans
    cursor.execute("""
        INSERT INTO pricing_plans (plan_type, name, code, price, duration_days, description, features, is_active)
        VALUES 
        ('case_fee', 'Basic Legal Consultation', 'CASE_BASIC', 199.0, 30, 'Standard single-issue legal inquiry and preliminary guidance.', '["AI Case Analysis", "Statutory Source Indexing", "Evidence Checklist", "1 Lawyer Match"]', 1),
        ('case_fee', 'Moderate Dispute Review & Notice', 'CASE_MODERATE', 499.0, 60, 'Comprehensive multi-document dispute with statutory legal notice and verified advocate connection.', '["Full AI Risk & Entity Extraction", "Missing Document Alternative Guidance", "Statutory Legal Notice Draft", "Priority Verified Lawyer Matching", "Private Case Vault & Encrypted Chat"]', 1),
        ('case_fee', 'Complex Litigation Escalation', 'CASE_COMPLEX', 999.0, 90, 'High monetary stakes, multi-party or institutional escalation with dedicated legal aid routing.', '["Deep Contract Clause Inspection", "Multi-Act Statutory Analysis", "Representation Draft to Regulators / SP", "Dedicated Senior Advocate Matching", "Direct DLSA Escalation Assistance"]', 1),
        ('lawyer_subscription', 'Basic Tier', 'LAWYER_BASIC', 499.0, 30, 'Ideal for junior advocates starting private practice.', '["Up to 10 case requests/month", "Standard verified badge", "Basic case analytics", "Secure document viewing"]', 1),
        ('lawyer_subscription', 'Professional Tier (Most Popular)', 'LAWYER_PRO', 999.0, 90, 'Optimal for active advocates seeking consistent client inquiries.', '["Unlimited case match requests", "Priority geographic matching", "Enhanced profile listing", "Client chat & document vault", "Advanced analytics"]', 1),
        ('lawyer_subscription', 'Premium Tier', 'LAWYER_PREMIUM', 1999.0, 180, 'For senior advocates and law chambers requiring maximum visibility.', '["Top-tier search placement", "Instant SMS/in-app case alerts", "Multi-practice category matching", "Direct regulatory referral routing", "6 months priority support"]', 1)
    """)

    # 6. Cases
    # Case 1: Security Deposit Dispute (Citizen: Ramesh Kumar, Assigned: Adv Priya Sharma, Status: IN_PROGRESS)
    cursor.execute("""
        INSERT INTO cases (user_id, title, category, sub_category, description, location, urgency, complexity, platform_fee, payment_status, risk_level, status, assigned_lawyer_id, summary, applicable_laws)
        VALUES (
            1,
            'Rental Security Deposit Non-Refund of ₹60,000',
            'Rental / Housing',
            'Security Deposit Withholding',
            'I vacated the 2BHK flat in Madhapur after giving 1 month advance notice as agreed. The landlord refuses to refund the security deposit of Rs 60,000 citing false damages.',
            'Madhapur, Hyderabad, Telangana',
            'Medium',
            'MODERATE',
            499.0,
            'PAID',
            'yellow',
            'IN_PROGRESS',
            ?,
            'Tenant vacated premises with standard notice. Landlord arbitrarily withholding ₹60,000 deposit without itemized repair receipts.',
            'Transfer of Property Act 1882 (Section 108), Model Tenancy Act 2021 (Section 13)'
        )
    """, (lawyer_priya_id,))
    case1_id = cursor.lastrowid

    # Case 2: Unpaid Salary Dispute (Citizen: Sunita Rao, Status: MATCHING - Open for lawyers)
    cursor.execute("""
        INSERT INTO cases (user_id, title, category, sub_category, description, location, urgency, complexity, platform_fee, payment_status, risk_level, status, assigned_lawyer_id, summary, applicable_laws)
        VALUES (
            2,
            'Unpaid Salary for 3 Months (₹1,80,000)',
            'Employment & Labour',
            'Wage Withholding & Unlawful Deduction',
            'My IT employer in Hitech City has not disbursed my monthly salary of ₹60,000 for May, June, and July despite regular biometric attendance and completed project deliverables.',
            'Hitech City, Hyderabad, Telangana',
            'High',
            'MODERATE',
            499.0,
            'PAID',
            'red',
            'MATCHING',
            NULL,
            'Employee claims non-payment of ₹1,80,000 salary for 3 months. Demands statutory notice under Payment of Wages Act.',
            'Payment of Wages Act 1936 (Section 15), Industrial Disputes Act 1947 (Section 33C(2))'
        )
    """)
    case2_id = cursor.lastrowid

    # 7. Document Requirements & Missing Guidance for Case 1
    cursor.execute("""
        INSERT INTO document_requirements (case_id, name, importance, status, why_useful, alternatives_guidance, how_to_obtain, user_notes)
        VALUES 
        (?, 'Rental Agreement', 'Essential', 'missing', 'Establishes tenancy duration, security deposit sum, and notice period obligations.', 'Monthly Rent Payment Bank Statements showing transfers, WhatsApp discussions with landlord, Utility bills in property address.', 'Request a digital copy from broker or check email archives.', 'Marked missing by citizen — using bank transfers as alternative.'),
        (?, 'Security Deposit Payment Proof', 'Essential', 'available', 'Proves ₹60,000 was transferred at tenancy inception.', 'Bank statement highlighting debit transaction, UPI Reference screenshot.', 'Download bank statement from net banking.', 'Bank transaction receipt uploaded.'),
        (?, 'WhatsApp / Notice Communication Records', 'Supporting', 'available', 'Demonstrates 30 days notice was served before vacating.', 'Exported WhatsApp chat transcript with timestamps, Email sent to landlord.', 'Export chat from WhatsApp application.', 'WhatsApp chat export attached.'),
        (?, 'Move-Out Handover & Key Return Proof', 'Supporting', 'available', 'Proves property was handed over without physical damage.', 'Video inspection walkthrough, Signed key handover slip.', 'Photos taken during move-out inspection.', 'Inspection photos uploaded.')
    """, (case1_id, case1_id, case1_id, case1_id))

    # 8. Private Case Documents in Vault for Case 1
    cursor.execute("""
        INSERT INTO case_documents (case_id, user_id, title, document_type, filename, file_path, file_size, mime_type, is_private, file_content)
        VALUES 
        (?, 1, 'Security Deposit Bank Transfer Receipt', 'Payment Proof', 'Deposit_Transfer_HDFC_60000.pdf', 'secure_storage/demo_deposit_receipt.pdf', 245760, 'application/pdf', 1, 'HDFC Bank E-Receipt: ₹60,000 transferred to Landlord A/C on 15-Jun-2024. UTR: HDFC0001928374.'),
        (?, 1, 'Landlord WhatsApp Notice & Eviction Chat', 'Communication Records', 'WhatsApp_Notice_Transcript.pdf', 'secure_storage/demo_whatsapp_chat.pdf', 184320, 'application/pdf', 1, 'WhatsApp Chat Export: Citizen sent 30-day notice on 01-Jul-2026. Landlord replied confirming receipt.'),
        (?, 1, 'Flat Vacating & Inspection Photos', 'Evidence', 'Flat_Handover_Inspection.pdf', 'secure_storage/demo_flat_photos.pdf', 524288, 'application/pdf', 1, 'Move-out inspection photos showing intact walls, fittings, and returned keys.')
    """, (case1_id, case1_id, case1_id))

    # 9. Private Chat Messages between Ramesh Kumar and Adv. Priya Sharma (Case 1)
    cursor.execute("""
        INSERT INTO case_messages (case_id, sender_id, receiver_id, sender_name, sender_role, message_text, is_read)
        VALUES 
        (?, 3, 1, 'Advocate Priya Sharma', 'lawyer', 'Hello Mr. Ramesh, I have reviewed your case summary regarding the withheld security deposit of ₹60,000. I can assist you with issuing a formal statutory notice.', 1),
        (?, 1, 3, 'Ramesh Kumar', 'citizen', 'Thank you Advocate Priya! As noted, I do not have a physical copy of the rental agreement, but I have uploaded the HDFC deposit transfer receipt and WhatsApp move-out confirmation.', 1),
        (?, 3, 1, 'Advocate Priya Sharma', 'lawyer', 'Under the Transfer of Property Act, regular bank transfers and the landlord acknowledgement serve as strong supporting evidence. I am preparing a 14-day statutory demand notice today.', 1)
    """, (case1_id, case1_id, case1_id))

    # 10. Payments History
    cursor.execute("""
        INSERT INTO payments (user_id, case_id, subscription_id, amount, payment_type, status, transaction_ref, payment_method, receipt_url)
        VALUES 
        (1, ?, NULL, 499.0, 'case_fee', 'SUCCESS', 'TXN-NYAYA-2026-8819', 'Prototype UPI Simulation', '/receipts/TXN-8819.pdf'),
        (2, ?, NULL, 499.0, 'case_fee', 'SUCCESS', 'TXN-NYAYA-2026-9042', 'Prototype Card Simulation', '/receipts/TXN-9042.pdf'),
        (3, NULL, 1, 999.0, 'subscription', 'SUCCESS', 'TXN-SUB-2026-1049', 'Prototype NetBanking Simulation', '/receipts/SUB-1049.pdf')
    """, (case1_id, case2_id))

    # 11. In-App Notifications
    cursor.execute("""
        INSERT INTO notifications (user_id, title, message, type, link_tab, case_id, is_read)
        VALUES 
        (1, 'Lawyer Assigned to Case', 'Advocate Priya Sharma has accepted your case regarding Rental Security Deposit.', 'case_accepted', 'cases', ?, 1),
        (1, 'New Secure Message', 'Advocate Priya Sharma sent you a message: "I am preparing a 14-day statutory demand notice today."', 'message', 'chat', ?, 0),
        (3, 'New Case Matching Your Specialization', 'A new Employment dispute in Hyderabad requires legal representation.', 'case_match', 'case_requests', ?, 0),
        (4, 'Subscription Expiring Soon', 'Your Basic Subscription expires in 5 days. Renew now to continue receiving case requests.', 'subscription_expiry', 'subscription', NULL, 0)
    """, (case1_id, case1_id, case2_id))

    # 12. Pre-seeded Audit Logs
    cursor.execute("""
        INSERT INTO audit_logs (user_id, user_role, user_name, action, target_type, target_id, case_id, document_id, details, ip_address)
        VALUES 
        (1, 'citizen', 'Ramesh Kumar', 'LOGIN', 'auth', '1', NULL, NULL, 'Citizen logged in via secure session.', '127.0.0.1'),
        (1, 'citizen', 'Ramesh Kumar', 'CASE_CREATED', 'case', '1', 1, NULL, 'Created legal case: Rental Security Deposit Non-Refund.', '127.0.0.1'),
        (1, 'citizen', 'Ramesh Kumar', 'UPLOAD_DOCUMENT', 'document', '1', 1, 1, 'Uploaded Security Deposit Bank Transfer Receipt to secure vault.', '127.0.0.1'),
        (1, 'citizen', 'Ramesh Kumar', 'PAYMENT_COMPLETED', 'payment', 'TXN-8819', 1, NULL, 'Paid platform consultation fee of ₹499 via mock gateway.', '127.0.0.1'),
        (3, 'lawyer', 'Advocate Priya Sharma', 'LAWYER_ACCEPTED', 'case', '1', 1, NULL, 'Advocate Priya Sharma accepted Case #1.', '127.0.0.1'),
        (3, 'lawyer', 'Advocate Priya Sharma', 'VIEW_DOCUMENT', 'document', '1', 1, 1, 'Assigned Lawyer viewed Deposit_Transfer_HDFC_60000.pdf in secure vault.', '127.0.0.1')
    """)

    # 13. Seed Statutory Legal Sources
    sources_data = [
        ("Timely Payment of Wages", "Payment of Wages Act, 1936", "Section 5", "Ministry of Labour and Employment, Govt. of India", "https://www.indiacode.nic.in/handle/123456789/2367", "Mandates that wages in establishments employing fewer than 1,000 persons must be paid before the expiry of the 7th day of the wage month.", "Verified"),
        ("Claims Arising Out of Deductions or Delay in Payment", "Payment of Wages Act, 1936", "Section 15", "Ministry of Labour and Employment, Govt. of India", "https://www.indiacode.nic.in/handle/123456789/2367", "Enables employees or registered trade unions to submit applications before the Labour Commissioner for delayed wages plus statutory compensation up to 10x.", "Verified"),
        ("Security Deposit Limit & Refund Timeline", "Model Tenancy Act, 2021", "Section 13", "Ministry of Housing and Urban Affairs, Govt. of India", "https://mohua.gov.in/upload/uploadfiles/files/Model_Tenancy_Act_English.pdf", "Limits residential security deposit to maximum 2 months rent and mandates full refund within 30 days after tenant vacates and hands over keys.", "Verified"),
        ("Rights of Lessor and Lessee", "Transfer of Property Act, 1882", "Section 108", "Legislative Department, Ministry of Law and Justice", "https://www.indiacode.nic.in/handle/123456789/2338", "Codifies obligations of landlord to ensure quiet enjoyment and tenant rights to return property subject to reasonable wear and tear without arbitrary deductions.", "Verified"),
        ("Consumer Rights to Redressal Against Unfair Trade Practices", "Consumer Protection Act, 2019", "Section 2(9) & Section 35", "Department of Consumer Affairs, Govt. of India", "https://www.indiacode.nic.in/handle/123456789/15256", "Empowers consumers to file complaints before District Consumer Commissions (e-Daakhil) for defective goods, deficiency of services, and refund of consideration.", "Verified"),
        ("Reporting of Cyber Fraud and Digital Offenses", "Information Technology Act, 2000", "Section 66D & Section 43", "Ministry of Electronics and Information Technology", "https://www.indiacode.nic.in/handle/123456789/1999", "Prescribes punishment of up to 3 years imprisonment and fine for cheating by personation using computer resource, phishing, or unauthorized fund transfers.", "Verified"),
        ("Information in Cognizable Cases & Refusal Remedy", "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)", "Section 173(3) & 173(4)", "Ministry of Home Affairs, Govt. of India", "https://www.mha.gov.in/en/acts-and-rules/bharatiya-nagarik-suraksha-sanhita-2023", "Mandates police registration of cognizable FIR. If Station House Officer refuses, citizen has statutory right to send substance in writing by post to District SP.", "Verified"),
        ("Right to Information and Form of Request", "Right to Information Act, 2005", "Section 6(1)", "Department of Personnel and Training, Govt. of India", "https://www.indiacode.nic.in/handle/123456789/2065", "Empowers any citizen to submit RTI application in English/Hindi/regional language accompanied by nominal fee of Rs 10 to Public Information Officer.", "Verified"),
        ("Free Legal Services Under Section 12", "Legal Services Authorities Act, 1987", "Section 12", "National Legal Services Authority (NALSA)", "https://nalsa.gov.in/acts-rules/the-legal-services-authorities-act-1987", "Entitles women, children, SC/ST, victims of trafficking, disabled persons, and low-income individuals to 100% free legal aid and advocate assignment.", "Verified")
    ]

    for s in sources_data:
        cursor.execute("""
            INSERT INTO legal_sources (title, act_name, section, official_source, source_url, description, verification_status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, s)

    # 14. Authorities
    authorities_data = [
        ("District Legal Services Authority (DLSA), Hyderabad", "Legal Aid", "Telangana", "Hyderabad", "Provides 100% free legal representation, counsel assignment, and Lok Adalat dispute mediation.", "Women, Children, SC/ST, Income < Rs 3,00,000/year", "Aadhaar Card, Income Certificate / Self-Declaration, Case Brief", "https://tsslsa.telangana.gov.in", "040-23446700", "dlsa-hyd@telangana.gov.in", "City Civil Court Complex, Purani Haveli, Hyderabad - 500002", 1),
        ("National Legal Services Authority (NALSA)", "Legal Aid", "All India", "All Districts", "Apex statutory body providing free legal services under Legal Services Authorities Act 1987. Coordinates DLSA, SLSA, and Lok Adalat services across all states.", "Women, Children, SC/ST, disaster victims, persons with disabilities, income < state threshold", "Income Certificate, Aadhaar, Caste Certificate (if applicable), Case Summary", "https://nalsa.gov.in", "011-23385268", "nalsa@nic.in", "12/11, Jam Nagar House, Shahjahan Road, New Delhi - 110011", 1),
        ("District Consumer Disputes Redressal Commission, Hyderabad", "Consumer Forum", "Telangana", "Hyderabad", "Statutory forum for adjudicating consumer grievances, defective goods, and service deficiencies up to Rs 50 Lakhs.", "Any consumer who purchased goods or hired services for consideration", "Purchase Invoice, Payment Proof, Written Notice, Complaint Petition", "https://edaakhil.nic.in", "040-27632626", "dcdrc-hyd@nic.in", "Chandra Vihar Complex, M.J. Road, Hyderabad - 500001", 0),
        ("National Consumer Helpline (NCH) — 1800-11-4000", "Consumer Forum", "All India", "All Districts", "Official helpline for consumer grievances against defective goods, service deficiencies, unfair trade, and e-commerce disputes under Consumer Protection Act 2019.", "Any aggrieved consumer; no income criteria", "Purchase receipt, complaint details, seller/brand information", "https://consumerhelpline.gov.in", "1800-11-4000 / 1915", "support@consumerhelpline.gov.in", "Ministry of Consumer Affairs, Krishi Bhavan, New Delhi", 0),
        ("Deputy Commissioner of Labour, Hyderabad", "Labour & Employment", "Telangana", "Hyderabad", "Adjudicates wage withholding, gratuity denial, and unlawful terminations under Payment of Wages Act.", "Employees and workers employed in commercial establishments and factories", "Appointment Letter, Salary Slips, Bank Statement, Formal Demand Notice", "https://labour.telangana.gov.in", "040-27613583", "col.labour@telangana.gov.in", "Anjaneya Bhavan, RTC X Roads, Hyderabad - 500020", 0),
        ("National Cyber Crime Reporting Portal (I4C) — Helpline 1930", "Cyber Crime", "All India", "All Districts", "Emergency financial fraud freeze and reporting under Indian Cyber Crime Coordination Centre (I4C). Dial 1930 immediately after financial fraud.", "Any victim of online financial fraud, phishing, unauthorized UPI/card/banking transactions", "Bank Transaction SMS, Account Statement, Suspect Phone/UPI ID, Screenshots", "https://cybercrime.gov.in", "1930", "citizen-support@cybercrime.gov.in", "Ministry of Home Affairs, New Delhi - 110001", 0),
        ("RTI Online — Central Government RTI Portal", "RTI", "All India", "All Districts", "File RTI applications online to CPIOs of all central government ministries and departments under Right to Information Act 2005.", "Any Indian citizen requesting information from Central Government bodies", "RTI Application with Rs 10 fee (exempted for BPL)", "https://rtionline.gov.in", "011-24627179", "rtionline-dopt@gov.in", "Department of Personnel & Training, Ministry of Personnel, New Delhi", 0)
    ]

    for a in authorities_data:
        cursor.execute("""
            INSERT INTO authorities (name, category, state, district, purpose, eligibility, documents_required, website, phone, email, address, is_legal_aid)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, a)

    conn.commit()
    conn.close()
    print("[DB] Multi-role seed data inserted successfully.")
