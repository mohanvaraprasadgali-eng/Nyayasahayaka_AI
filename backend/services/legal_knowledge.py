"""
NyayaSahayak AI - Comprehensive Indian Legal Knowledge Base
Covers statutory provisions, legal rights, evidence checklists, action plans,
risk assessments, and Telugu language keyword mappings.
"""

LEGAL_KNOWLEDGE_BASE = {
    "employment_wages": {
        "id": "employment_wages",
        "category": "Employment / Labour Law",
        "title": "Unpaid Wages & Employment Dispute",
        "keywords": [
            "salary", "wage", "wages", "unpaid", "employer", "company", "boss", "fired", "terminated", "increment",
            "gratuity", "pf", "provident fund", "notice period", "experience letter", "relieving letter", "overtime",
            # Telugu keywords
            "jeetham", "jeethalu", "salary ivvaledu", "pani chesanu", "udhyogam", "company dabbu", "kompany",
            "జీతం", "ఉద్యోగం", "జీతాలు", "కంపెనీ"
        ],
        "possible_rights": [
            {
                "title": "Right to Timely Payment of Wages",
                "explanation": "Under the law, an employer is obligated to disburse wages by the 7th or 10th day of every calendar month following the wage period.",
                "legal_source": "Payment of Wages Act, 1936 - Section 5",
                "source_url": "https://www.indiacode.nic.in/handle/123456789/2361",
                "verification_status": "Verified",
                "last_checked": "2026-08-20"
            },
            {
                "title": "Right to Claim Unpaid Wages with Compensation",
                "explanation": "If wages are withheld without lawful deduction, an employee can claim the entire pending amount along with statutory compensation up to 10 times the amount.",
                "legal_source": "Payment of Wages Act, 1936 - Section 15 & Code on Wages 2019",
                "source_url": "https://labour.gov.in/wage-related-acts",
                "verification_status": "Verified",
                "last_checked": "2026-08-20"
            },
            {
                "title": "Right to Receive Relieving Letter & Service Certificate",
                "explanation": "An employer cannot unlawfully hold back experience letters or relieving documents after service tenure or formal resignation, as it hinders the constitutional right to livelihood.",
                "legal_source": "Industrial Employment (Standing Orders) Act / Art. 19(1)(g) Constitution of India",
                "source_url": "https://www.indiacode.nic.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-15"
            }
        ],
        "evidence_needed": [
            {"name": "Appointment Letter / Employment Contract", "category": "Contract", "importance": "Essential", "notes": "Shows agreed salary, designation, and terms of service."},
            {"name": "Salary Slips of Previous Months", "category": "Financial", "importance": "Essential", "notes": "Demonstrates monthly wage calculation and regular employment."},
            {"name": "Bank Account Statement (Deficit Period)", "category": "Financial", "importance": "Essential", "notes": "Proves lack of wage credit during the unpaid months."},
            {"name": "Written Communications & Demand Emails", "category": "Correspondence", "importance": "Essential", "notes": "Copies of emails/messages sent to HR/Management demanding pending salary."},
            {"name": "Attendance Logs / Biometric / Work Emails", "category": "Work Record", "importance": "Supporting", "notes": "Evidence establishing active work performed during unpaid period."}
        ],
        "action_plan": [
            {"step_order": 1, "title": "Audit & Compile Salary Evidence", "description": "Download bank statements for the unpaid period, preserve employment contract and all past pay slips in a secure folder.", "authority": "Self / Applicant", "deadline": "1-2 Days"},
            {"step_order": 2, "title": "Send Written Demand Letter to Employer", "description": "Issue an official written email/letter to HR and Managing Director giving a 7-day deadline to clear dues.", "authority": "Employer Management", "deadline": "Within 7 Days"},
            {"step_order": 3, "title": "Issue Formal Legal Notice", "description": "If employer fails to respond or refuses, generate and serve a 15-day formal Legal Demand Notice via Registered Post AD.", "authority": "Advocate / NyayaSahayak Draft", "deadline": "15 Days Notice"},
            {"step_order": 4, "title": "Lodge Complaint with Labour Commissioner", "description": "File a petition under Section 15 of Payment of Wages Act or conciliation petition under Industrial Disputes Act.", "authority": "Office of Deputy Labour Commissioner", "deadline": "Post Notice Expiry"},
            {"step_order": 5, "title": "Approach DLSA for Free Legal Representation", "description": "If employer files insolvency or disputes the claim, apply to the District Legal Services Authority for free legal counsel.", "authority": "District Legal Services Authority (DLSA)", "deadline": "During Conciliation"}
        ],
        "risk_level": "yellow",
        "risk_reasoning": "Withholding earned wages is illegal. While formal notice often resolves the matter, you may need to file a petition before the Labour Authority if the employer continues to default.",
        "default_authority_category": "Labour & Employment"
    },

    "rental_deposit": {
        "id": "rental_deposit",
        "category": "Housing / Tenancy Dispute",
        "title": "Unreturned Security Deposit & Tenancy Rights",
        "keywords": [
            "landlord", "tenant", "rent", "rental", "security deposit", "advance", "house owner", "flat", "lease",
            "eviction", "agreement", "house rent", "maintenance charge", "broker", "handover",
            # Telugu keywords
            "advance", "advance return cheyyatledu", "intlo", "rent", "adhey", "illu", "owner", "deposit ivvaledu",
            "అడ్వాన్స్", "అద్దె", "ఇల్లు", "ఓనర్", "డిపాజిట్"
        ],
        "possible_rights": [
            {
                "title": "Right to Full Refund of Eligible Security Deposit",
                "explanation": "Upon peaceful vacation and handover of premises, the landlord is legally mandated to refund the deposit after deducting only legitimate, documented arrears or actual damages.",
                "legal_source": "Transfer of Property Act, 1882 (Sec 108) & Model Tenancy Act, 2021 (Sec 11)",
                "source_url": "https://mohua.gov.in/upload/uploadfiles/files/Model_Tenancy_Act_English.pdf",
                "verification_status": "Verified",
                "last_checked": "2026-08-18"
            },
            {
                "title": "Right to Itemized Invoices for Deductions",
                "explanation": "A landlord cannot make arbitrary deductions for routine wear and tear or repainting unless specifically agreed in the contract with supporting receipts.",
                "legal_source": "State Rent Control Legislations / Consumer Precedents",
                "source_url": "https://www.indiacode.nic.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-18"
            },
            {
                "title": "Protection Against Arbitrary / Forceful Eviction",
                "explanation": "A landlord cannot forcibly disconnect water/electricity or lock premises without due process of law and reasonable written notice as per the rental agreement.",
                "legal_source": "Model Tenancy Act, 2021 - Section 20",
                "source_url": "https://mohua.gov.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-18"
            }
        ],
        "evidence_needed": [
            {"name": "Executed Rental / Lease Agreement", "category": "Contract", "importance": "Essential", "notes": "Must show security deposit amount, notice period, and handover terms."},
            {"name": "Bank Proof of Initial Deposit Transfer", "category": "Financial", "importance": "Essential", "notes": "Bank statement, UPI receipt, or signed owner acknowledgment."},
            {"name": "Vacation Handover Photos & Video Walkthrough", "category": "Visual Proof", "importance": "Essential", "notes": "Time-stamped photos/videos proving the apartment was left in clean condition."},
            {"name": "Notice of Vacation & WhatsApp / Email Exchanges", "category": "Correspondence", "importance": "Essential", "notes": "Written evidence proving timely notice of intent to vacate was served."},
            {"name": "Utility Bills & Society No-Dues Clearance", "category": "Clearance", "importance": "Supporting", "notes": "Electricity, water, and maintenance paid receipts."}
        ],
        "action_plan": [
            {"step_order": 1, "title": "Organize Move-Out Proof & No-Dues Proof", "description": "Compile time-stamped handover photographs, last month rent receipt, and electricity bill receipts.", "authority": "Tenant / Applicant", "deadline": "1-2 Days"},
            {"step_order": 2, "title": "Send Formal Written Demand Notice", "description": "Serve a formal legal notice to the landlord giving 10-14 days to remit the security deposit to your bank account.", "authority": "Landlord / Owner", "deadline": "Within 14 Days"},
            {"step_order": 3, "title": "File Grievance before Rent Authority / Consumer Forum", "description": "If landlord fails to refund, submit a petition before the Rent Authority or Consumer Commission for unfair trade practice.", "authority": "Rent Authority / DCDRC", "deadline": "Post Notice Period"},
            {"step_order": 4, "title": "Initiate Pre-Litigation Mediation via DLSA", "description": "Request District Legal Services Authority to conduct a mediation session with the landlord for immediate refund.", "authority": "District Legal Services Authority (DLSA)", "deadline": "Mediation Hearing"}
        ],
        "risk_level": "green",
        "risk_reasoning": "Clear contractual and documentary evidence (agreement + bank receipts + handover media) usually leads to prompt settlement or summary relief through mediation / Rent Authority.",
        "default_authority_category": "Housing & Rent"
    },

    "cyber_fraud": {
        "id": "cyber_fraud",
        "category": "Cyber Crime & Financial Protection",
        "title": "Online Financial Fraud / UPI Scam / Identity Theft",
        "keywords": [
            "fraud", "scam", "cyber", "upi", "bank", "otp", "phishing", "debit", "credit card", "hacked", "stolen money",
            "fake call", "kyc scam", "telegram scam", "part time job scam", "lottery", "crypto scam",
            # Telugu keywords
            "mosam", "dabbu poyindi", "bank account", "otp adigaru", "cyber crime", "dabbu kottesaaru",
            "మోసం", "డబ్బులు", "బ్యాంక్", "సైబర్ క్రైమ్"
        ],
        "possible_rights": [
            {
                "title": "Zero Liability for Unauthorized Electronic Banking",
                "explanation": "If you notify your bank regarding an unauthorized electronic transaction within 3 working days of the debit, you have zero liability under mandatory RBI guidelines.",
                "legal_source": "RBI Master Circular - DBR.No.Leg.BC.78/09.07.005/2017-18",
                "source_url": "https://www.rbi.org.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-21"
            },
            {
                "title": "Right to Instant Registration on 1930 Helpline",
                "explanation": "Citizens have the right to report financial cyber fraud on the national portal 1930 to initiate immediate beneficiary account freeze across banking rails.",
                "legal_source": "Citizen Financial Cyber Fraud Reporting System / MHA I4C",
                "source_url": "https://cybercrime.gov.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-21"
            },
            {
                "title": "Statutory Punishment for Cyber Impersonation & Cheating",
                "explanation": "Cheating by personation using computer resources or fraudulent digital transactions is a cognizable criminal offense punishable with imprisonment up to 3 years and fine.",
                "legal_source": "Information Technology Act, 2000 - Section 66D & Bharatiya Nyaya Sanhita (BNS Sec 318)",
                "source_url": "https://www.indiacode.nic.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-21"
            }
        ],
        "evidence_needed": [
            {"name": "Bank Account Statement Highlighting Fraudulent Debits", "category": "Financial", "importance": "Essential", "notes": "Must clearly show date, time, UTR / UPI Transaction reference number."},
            {"name": "Screenshots of Scam Chats / SMS / Payment Requests", "category": "Digital Record", "importance": "Essential", "notes": "WhatsApp/Telegram messages, fake payment screenshots, or spoofed links."},
            {"name": "Phone Numbers & UPI Handles of the Fraudster", "category": "Identifiers", "importance": "Essential", "notes": "Caller IDs, fraudulent bank account numbers, or receiving UPI VPA."},
            {"name": "Official Bank Written Dispute & Acknowledgement Slip", "category": "Banking", "importance": "Essential", "notes": "Copy of transaction dispute form submitted to home branch with stamp/token."}
        ],
        "action_plan": [
            {"step_order": 1, "title": "Immediate Call to 1930 / Cyber Crime Portal", "description": "Report the fraudulent transaction on Helpline 1930 within the 'Golden Hour' (first 2-4 hours) to freeze money in recipient account.", "authority": "National Cyber Crime Reporting Portal", "deadline": "Within 2 Hours"},
            {"step_order": 2, "title": "Block Cards / UPI & Notify Bank in Writing", "description": "Block all associated cards/UPI apps immediately and email bank customer care raising a formal unauthorized debit dispute.", "authority": "Home Bank Branch", "deadline": "Within 24 Hours"},
            {"step_order": 3, "title": "File Formal Cyber Crime Complaint", "description": "Lodge a comprehensive cyber complaint on cybercrime.gov.in with UTR numbers and screenshots and obtain Crime Number / Acknowledgment.", "authority": "Cyber Crime Police Station", "deadline": "Within 48 Hours"},
            {"step_order": 4, "title": "Escalate to Banking Ombudsman if Bank Fails", "description": "If bank does not credit back unauthorized transaction within 30 days under RBI guidelines, file complaint on RBI CMS portal.", "authority": "RBI Banking Ombudsman (CMS Portal)", "deadline": "After 30 Days"}
        ],
        "risk_level": "red",
        "risk_reasoning": "Cyber financial fraud is time-critical. Immediate reporting (within hours) is necessary to freeze the suspect bank account before funds are siphoned off.",
        "default_authority_category": "Cyber Crime"
    },

    "consumer_complaint": {
        "id": "consumer_complaint",
        "category": "Consumer Protection",
        "title": "Defective Goods, Deficiency of Service & Unfair Trade",
        "keywords": [
            "product", "defect", "defective", "warranty", "ecommerce", "amazon", "flipkart", "service", "mechanic",
            "hotel", "flight", "refund", "overcharging", "damaged goods", "fake product", "guarantee", "repair refusal",
            # Telugu keywords
            "vasthuvu", "cheddipoindi", "warranty", "refund ivvaledu", "fake product", "repair cheyyatledu",
            "వస్తువు", "రీఫండ్", "వారంటీ"
        ],
        "possible_rights": [
            {
                "title": "Right to Safety, Information & Consumer Choice",
                "explanation": "Consumers have the statutory right to be protected against hazardous goods and informed about quality, quantity, potency, purity, and price.",
                "legal_source": "Consumer Protection Act, 2019 - Section 2(9)",
                "source_url": "https://consumeraffairs.nic.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-22"
            },
            {
                "title": "Right to Redressal, Full Refund & Replacement",
                "explanation": "A consumer can seek full replacement of defective goods, reimbursement of purchase price, and compensation for deficiency in service or mental harassment.",
                "legal_source": "Consumer Protection Act, 2019 - Section 39",
                "source_url": "https://edaakhil.nic.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-22"
            },
            {
                "title": "Product Liability of Manufacturers & E-commerce Sellers",
                "explanation": "Manufacturers and digital marketplaces are held strictly liable for any harm or loss caused by a defective product or inaccurate product description.",
                "legal_source": "Consumer Protection Act, 2019 - Chapter VI (Product Liability)",
                "source_url": "https://www.indiacode.nic.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-22"
            }
        ],
        "evidence_needed": [
            {"name": "Tax Invoice / Cash Memo / Order Receipt", "category": "Purchase Record", "importance": "Essential", "notes": "Shows date of purchase, seller details, item description, and total price."},
            {"name": "Warranty Card & Service Terms", "category": "Contract", "importance": "Essential", "notes": "Proof that the product/service was covered under warranty at the time of failure."},
            {"name": "Photographs / Video Proof of Defect", "category": "Visual Proof", "importance": "Essential", "notes": "Clear imagery showing the defect, malfunction, or broken condition."},
            {"name": "Job Sheet / Service Center Refusal Slip", "category": "Service Record", "importance": "Essential", "notes": "Official inspection report or refusal to repair under warranty."},
            {"name": "Grievance Ticket / Customer Support Emails", "category": "Correspondence", "importance": "Supporting", "notes": "All communications showing seller/brand ignored resolution requests."}
        ],
        "action_plan": [
            {"step_order": 1, "title": "Collate Purchase & Defect Proofs", "description": "Assemble tax invoice, warranty card, service job sheets, and photo/video evidence.", "authority": "Consumer / Applicant", "deadline": "1 Day"},
            {"step_order": 2, "title": "Lodge Grievance on National Consumer Helpline (NCH)", "description": "Call 1915 or file on consumerhelpline.gov.in. Most corporate brands resolve issues at the NCH stage.", "authority": "National Consumer Helpline (NCH)", "deadline": "Within 3 Days"},
            {"step_order": 3, "title": "Serve Legal Notice to Seller & Manufacturer", "description": "If unresolved, generate a formal 15-day Consumer Dispute Notice claiming refund, replacement, and compensation.", "authority": "Seller / Manufacturer", "deadline": "15 Days Notice"},
            {"step_order": 4, "title": "E-file Consumer Case on e-Daakhil Portal", "description": "Submit a formal consumer complaint online via e-Daakhil without hiring an expensive lawyer.", "authority": "District Consumer Commission (DCDRC)", "deadline": "Post Notice Window"}
        ],
        "risk_level": "green",
        "risk_reasoning": "Consumer forums in India offer streamlined, low-cost redressal with simple online filing on e-Daakhil and no mandatory advocate requirement.",
        "default_authority_category": "Consumer Forum"
    },

    "police_complaint_refusal": {
        "id": "police_complaint_refusal",
        "category": "Criminal Justice & Civil Rights",
        "title": "Police Refusal to Register FIR / Grievance",
        "keywords": [
            "police", "fir", "station", "sho", "complaint refusal", "police not registering", "bribe", "cognizable",
            "threat", "assault", "harassment", "theft", "fir copy", "refused complaint",
            # Telugu keywords
            "police complaint", "fir rayatledu", "police teeskoledu", "station", "donga", "threat",
            "పోలీస్", "ఎఫ్‌ఐఆర్", "కంప్లైంట్"
        ],
        "possible_rights": [
            {
                "title": "Statutory Right to Mandatory FIR Registration",
                "explanation": "Under the landmark Supreme Court ruling (Lalita Kumari case) and statutory procedure, police officers are legally obligated to register an FIR if a cognizable offence is disclosed.",
                "legal_source": "Bharatiya Nagarik Suraksha Sanhita 2023 (Sec 173) / CrPC Sec 154(1)",
                "source_url": "https://www.mha.gov.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-19"
            },
            {
                "title": "Right to Submit Complaint to Superintendent of Police (SP / DCP)",
                "explanation": "If the Station House Officer refuses to register the FIR, the aggrieved citizen has the statutory right to send the complaint in writing by Registered Post to the District SP / Commissioner of Police.",
                "legal_source": "BNSS Section 173(3) / CrPC Section 154(3)",
                "source_url": "https://www.indiacode.nic.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-19"
            },
            {
                "title": "Right to Approach Judicial Magistrate (Sec 156(3) / 175 BNSS)",
                "explanation": "If the police higher authorities also fail to investigate, a citizen can file a direct application before the Judicial Magistrate seeking an order directing the police to register FIR and investigate.",
                "legal_source": "Bharatiya Nagarik Suraksha Sanhita (Sec 175) / CrPC Section 156(3)",
                "source_url": "https://www.indiacode.nic.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-19"
            }
        ],
        "evidence_needed": [
            {"name": "Original Written Complaint Copy with Station Details", "category": "Legal Record", "importance": "Essential", "notes": "Copy of the complaint that was presented to the police station with date and time."},
            {"name": "Speed Post / Registered Post Dispatch Receipt & Tracking", "category": "Dispatch Proof", "importance": "Essential", "notes": "India Post receipt proving delivery of complaint to SP / Commissioner office."},
            {"name": "Medical Legal Report / Injury Photos (if physical assault)", "category": "Medical Proof", "importance": "Essential", "notes": "Government hospital MLC or doctor inspection summary."},
            {"name": "CCTV Footage / Audio-Video Recordings / Witness Contacts", "category": "Corroboration", "importance": "Supporting", "notes": "Direct evidence establishing the occurrence of the cognizable incident."}
        ],
        "action_plan": [
            {"step_order": 1, "title": "Draft Formal Written Representation", "description": "Prepare a factual, structured complaint stating exact dates, accused names, sequence of events, and offenses.", "authority": "Complainant / Citizen", "deadline": "Immediate"},
            {"step_order": 2, "title": "Send via Registered Post AD to Superintendent of Police", "description": "Dispatch signed complaint copy to District SP / Commissioner of Police citing Section 173(3) BNSS / 154(3) CrPC.", "authority": "Office of SP / Police Commissioner", "deadline": "Within 24 Hours"},
            {"step_order": 3, "title": "Lodge Online Grievance on State Police Citizen Portal", "description": "Upload the complaint on state police grievance portal / CCTNS to obtain a digital reference number.", "authority": "State Police CCTNS Portal", "deadline": "Within 2 Days"},
            {"step_order": 4, "title": "File Application before Judicial Magistrate", "description": "If no action is initiated within 15 days, file petition under Section 175 BNSS / 156(3) CrPC with DLSA legal aid advocate.", "authority": "Judicial Magistrate Court / DLSA", "deadline": "After 15 Days"}
        ],
        "risk_level": "red",
        "risk_reasoning": "Police refusal in serious criminal matters requires strict procedural compliance (Postal delivery to SP followed by Magistrate application) to protect personal safety and legal rights.",
        "default_authority_category": "Police & Home"
    },

    "cheque_bounce": {
        "id": "cheque_bounce",
        "category": "Commercial / Financial Law",
        "title": "Dishonour of Cheque (Cheque Bounce)",
        "keywords": [
            "cheque", "check", "bounce", "dishonour", "insufficient funds", "stop payment", "drawer", "bank memo",
            "138 notice", "debt recovery", "promissory note",
            # Telugu keywords
            "cheque bounce", "dabbu raledu", "bank check", "cheque chellaledu",
            "చెక్", "బౌన్స్"
        ],
        "possible_rights": [
            {
                "title": "Right to Issue Statutory 30-Day Legal Demand Notice",
                "explanation": "Upon receiving a Cheque Return Memo from the bank, you have the legal right to send a mandatory statutory notice within 30 days demanding payment within 15 days.",
                "legal_source": "Negotiable Instruments Act, 1881 - Section 138(b)",
                "source_url": "https://www.indiacode.nic.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-20"
            },
            {
                "title": "Right to Criminal Prosecution with Strict Penalties",
                "explanation": "Dishonour of cheque for discharge of legally enforceable debt is a criminal offence punishable with imprisonment up to 2 years and/or fine up to twice the cheque amount.",
                "legal_source": "Negotiable Instruments Act, 1881 - Section 138",
                "source_url": "https://www.indiacode.nic.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-20"
            },
            {
                "title": "Right to Claim Interim Compensation up to 20%",
                "explanation": "The trial court is empowered to order the drawer of the bounced cheque to pay up to 20% of the cheque amount as interim compensation to the complainant.",
                "legal_source": "Negotiable Instruments Act, 1881 - Section 143A",
                "source_url": "https://www.indiacode.nic.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-20"
            }
        ],
        "evidence_needed": [
            {"name": "Original Dishonoured Cheque", "category": "Financial Instrument", "importance": "Essential", "notes": "Must be preserved without damage or markings."},
            {"name": "Official Bank Return Memo", "category": "Bank Record", "importance": "Essential", "notes": "Shows exact reason (e.g. 'Funds Insufficient', 'Account Closed') and date of dishonour."},
            {"name": "Contract / Invoice / Proof of Debt", "category": "Underlying Transaction", "importance": "Essential", "notes": "Invoice, loan agreement, or promissory note proving legally enforceable debt."},
            {"name": "Speed Post Receipt & Tracking Delivery Proof", "category": "Postal Record", "importance": "Essential", "notes": "Proof that the statutory 138 notice was dispatched and delivered to the drawer."}
        ],
        "action_plan": [
            {"step_order": 1, "title": "Verify Cheque Return Memo Date", "description": "Ensure that the 30-day statutory limitation window from the date of the bank return memo has not expired.", "authority": "Complainant", "deadline": "Within 30 Days of Return"},
            {"step_order": 2, "title": "Serve Formal Section 138 Legal Notice", "description": "Dispatch a formal legal demand notice via Speed Post AD demanding payment of full cheque amount within 15 days.", "authority": "Advocate / Complainant", "deadline": "15 Days Notice Period"},
            {"step_order": 3, "title": "Calculate 15-Day Cure Period", "description": "Wait for 15 days from the date of delivery. The cause of action arises on the 16th day if no payment is made.", "authority": "Legal Limitation Window", "deadline": "15 Days Post Delivery"},
            {"step_order": 4, "title": "File Criminal Complaint under Section 138", "description": "Lodge formal complaint before the Judicial Magistrate within 30 days from the date cause of action arose.", "authority": "Metropolitan / Judicial Magistrate Court", "deadline": "Within 30 Days of Expiry"}
        ],
        "risk_level": "yellow",
        "risk_reasoning": "Section 138 cases have strict statutory limitation periods (30-day notice window, 15-day cure window, 30-day filing window). Missing deadlines can forfeit the criminal remedy.",
        "default_authority_category": "Judicial Magistrate / Civil Court"
    },

    "rti_information": {
        "id": "rti_information",
        "category": "Governance & Right to Information",
        "title": "RTI Application & Transparency Dispute",
        "keywords": [
            "rti", "right to information", "government delay", "pension delay", "scholarship", "tender", "records",
            "public authority", "pio", "first appeal", "transparency",
            # Telugu keywords
            "rti", "samachara hakku", "govt office", "govt delay",
            "సమాచార హక్కు", "ప్రభుత్వ"
        ],
        "possible_rights": [
            {
                "title": "Right to Receive Information within 30 Days",
                "explanation": "Every citizen has the legal right to inspect works, documents, and records and receive certified copies within 30 days of application.",
                "legal_source": "Right to Information Act, 2005 - Section 7(1)",
                "source_url": "https://rtionline.gov.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-23"
            },
            {
                "title": "Right to Free Information on PIO Delay",
                "explanation": "If the Public Information Officer fails to provide information within the statutory 30-day period, the information must be provided free of all charges.",
                "legal_source": "Right to Information Act, 2005 - Section 7(6)",
                "source_url": "https://rtionline.gov.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-23"
            },
            {
                "title": "Right to File First and Second Statutory Appeals",
                "explanation": "Citizens can appeal to the First Appellate Authority within 30 days of non-response, and to Central/State Information Commission with penalty up to ₹25,000 on defaulting officers.",
                "legal_source": "Right to Information Act, 2005 - Section 19 & Section 20",
                "source_url": "https://cic.gov.in/",
                "verification_status": "Verified",
                "last_checked": "2026-08-23"
            }
        ],
        "evidence_needed": [
            {"name": "Previous Application / Reference Number", "category": "Govt Record", "importance": "Supporting", "notes": "Any previous acknowledgement or letter number with the public department."},
            {"name": "Identity Proof / BPL Certificate (if fee exemption claimed)", "category": "ID", "importance": "Supporting", "notes": "Aadhaar / Voter ID or BPL card for fee exemption."},
            {"name": "RTI Application Fee Payment Proof (Rs 10)", "category": "Receipt", "importance": "Essential", "notes": "IPO, Court Fee Stamp, Demand Draft, or Online Payment Receipt."}
        ],
        "action_plan": [
            {"step_order": 1, "title": "Identify Correct Public Authority & PIO", "description": "Locate the designated Public Information Officer (PIO) for the relevant ministry, municipal body, or university.", "authority": "Citizen / RTI Portal", "deadline": "1 Day"},
            {"step_order": 2, "title": "Draft Clear, Specific RTI Questions", "description": "Formulate concise, numbered questions asking for specific records, inspection dates, or certified copies.", "authority": "NyayaSahayak Generator", "deadline": "1 Day"},
            {"step_order": 3, "title": "Submit RTI Application Online / Speed Post", "description": "File on rtionline.gov.in or send physically with Rs 10 postal order via Speed Post.", "authority": "Public Information Officer", "deadline": "Within 30 Days Clock Starts"},
            {"step_order": 4, "title": "File First Appeal if No Response", "description": "If PIO does not respond in 30 days or gives unsatisfactory reply, file First Appeal before First Appellate Authority.", "authority": "First Appellate Authority (FAA)", "deadline": "Within 30 Days"}
        ],
        "risk_level": "green",
        "risk_reasoning": "RTI is a direct, citizen-friendly statutory tool requiring no lawyers and minimal nominal fees (₹10).",
        "default_authority_category": "RTI Portal / Information Commission"
    }
}


def find_matching_legal_topic(text):
    """
    Matches natural language text (English or Telugu romanized/script)
    to the most relevant Indian legal domain topic.
    """
    if not text:
        return LEGAL_KNOWLEDGE_BASE["employment_wages"]
    
    text_lower = text.lower()
    
    scores = {}
    for key, topic in LEGAL_KNOWLEDGE_BASE.items():
        score = 0
        for kw in topic["keywords"]:
            if kw.lower() in text_lower:
                score += 2
        # Title match
        if topic["title"].lower() in text_lower:
            score += 5
        # Category match
        if topic["category"].lower() in text_lower:
            score += 4
        scores[key] = score
    
    # Pick topic with highest score
    best_key = max(scores, key=scores.get)
    if scores[best_key] > 0:
        return LEGAL_KNOWLEDGE_BASE[best_key]
    
    # Default fallback to employment or rental if generic
    if "rent" in text_lower or "deposit" in text_lower or "flat" in text_lower or "owner" in text_lower or "advance" in text_lower:
        return LEGAL_KNOWLEDGE_BASE["rental_deposit"]
    elif "fraud" in text_lower or "scam" in text_lower or "money" in text_lower or "bank" in text_lower or "otp" in text_lower:
        return LEGAL_KNOWLEDGE_BASE["cyber_fraud"]
    elif "police" in text_lower or "fir" in text_lower or "threat" in text_lower:
        return LEGAL_KNOWLEDGE_BASE["police_complaint_refusal"]
    elif "product" in text_lower or "item" in text_lower or "warranty" in text_lower or "company" in text_lower:
        return LEGAL_KNOWLEDGE_BASE["consumer_complaint"]
    
    return LEGAL_KNOWLEDGE_BASE["employment_wages"]
