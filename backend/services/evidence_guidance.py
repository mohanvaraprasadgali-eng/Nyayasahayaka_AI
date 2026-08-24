"""
Evidence Guidance Service
Powers the 'I Don't Have All the Required Documents' workflow for Indian legal disputes.
Provides actionable alternative evidence suggestions and retrieval steps without false legal equivalence claims.
"""

DOCUMENT_GUIDANCE_CATALOG = {
    "rental agreement": {
        "title": "Rental / Lease Agreement",
        "why_useful": "Establishes tenant-landlord relationship, security deposit amount, notice period, and monthly rent terms under the Transfer of Property Act / State Tenancy Acts.",
        "alternatives": [
            "Monthly Rent Payment Bank Statements showing regular transfers to landlord's account",
            "Security Deposit Transfer Proof (Bank statement, UPI receipt, Cheque counterfoil)",
            "WhatsApp / Email conversations discussing tenancy start date, rent amount, or deposit",
            "Electricity, Water, or Gas bills in landlord's name delivered to the property address",
            "Key Handover receipt or landlord's written acknowledgement"
        ],
        "how_to_obtain": "Request a digital copy from the broker/landlord, or locate the stamp paper reference number if registered on the state IGRS portal."
    },
    "payment proof": {
        "title": "Payment Proof / Deposit Receipt",
        "why_useful": "Proves consideration was actually transferred and creates financial liability under civil and contract law.",
        "alternatives": [
            "Bank Account Statement with highlighted debit transaction and UTR number",
            "UPI Application Transaction screenshot showing Reference ID (Google Pay / PhonePe / Paytm)",
            "Credit Card Statement showing merchant charge",
            "Email acknowledgement or SMS confirmation from payee"
        ],
        "how_to_obtain": "Download e-statement directly from net banking or request a stamped account statement from your bank branch."
    },
    "employment contract": {
        "title": "Employment Contract / Appointment Letter",
        "why_useful": "Proves employer-employee relationship, salary designation, and wage payment date under Payment of Wages Act 1936.",
        "alternatives": [
            "Monthly Salary Credit entries in Bank Statement",
            "EPFO / Provident Fund Member Passbook entries (UAN passbook)",
            "Company Email ID access proof, Offer Letter, or Slack/Teams workspace invite",
            "Income Tax Form 16 / Form 26AS showing TDS deducted by employer",
            "ID Card photo or official company communication"
        ],
        "how_to_obtain": "Check your personal email for onboarding attachments or download your EPFO passbook from epfindia.gov.in."
    },
    "communication records": {
        "title": "Communication Records / Notice Proof",
        "why_useful": "Demonstrates prior notice, refusal to remedy, and absence of dispute or negligence before escalating.",
        "alternatives": [
            "Exported WhatsApp chat history (.txt export with timestamps)",
            "Email threads with full header information",
            "Postal Speed Post / Registered Post tracking delivery receipt",
            "Call recordings or SMS screenshots with date and sender metadata"
        ],
        "how_to_obtain": "In WhatsApp, use 'More > Export Chat' without media to generate a clean timestamped transcript."
    },
    "invoice": {
        "title": "Purchase Invoice / Warranty Card",
        "why_useful": "Mandatory to prove consumer status under Section 2(7) of the Consumer Protection Act 2019.",
        "alternatives": [
            "E-commerce Order History invoice download (Amazon, Flipkart, etc.)",
            "Credit card or UPI payment receipt corresponding to vendor name",
            "Product serial number registration confirmation email",
            "Authorized Service Center job sheet / inspection report"
        ],
        "how_to_obtain": "Login to the merchant portal and download the tax invoice PDF, or contact vendor customer support with your phone number."
    },
    "police acknowledgment": {
        "title": "Police Complaint Acknowledgment / CSR",
        "why_useful": "Proves formal reporting of cognizable offense or financial fraud within statutory limitation.",
        "alternatives": [
            "National Cyber Crime Reporting Portal (cybercrime.gov.in) Acknowledgement slip",
            "1930 Cyber Helpline complaint reference number",
            "Speed post tracking receipt for complaint sent to District Superintendent of Police",
            "Email sent to official district police commissioner mailbox"
        ],
        "how_to_obtain": "File an online e-FIR / grievance on your State Police citizen portal or submit a written representation via Speed Post."
    }
}

class EvidenceGuidanceService:
    @classmethod
    def get_guidance_for_document(cls, doc_name: str) -> dict:
        """
        Returns structured guidance for a missing document name.
        """
        name_lower = doc_name.lower()
        matched_key = None
        for key in DOCUMENT_GUIDANCE_CATALOG:
            if key in name_lower or any(word in name_lower for word in key.split()):
                matched_key = key
                break

        if matched_key:
            data = DOCUMENT_GUIDANCE_CATALOG[matched_key]
        else:
            data = {
                "title": doc_name,
                "why_useful": f"Provides essential evidentiary support for your claims regarding {doc_name}.",
                "alternatives": [
                    "Bank transaction statements or financial audit trails",
                    "Written correspondence, emails, or text messages",
                    "Official third-party acknowledgments or digital logs",
                    "Witness statements or photo/video evidence with metadata"
                ],
                "how_to_obtain": "Request a duplicate copy from the issuing party or download account statements from the service provider."
            }

        return {
            "name": doc_name,
            "title": data["title"],
            "why_useful": data["why_useful"],
            "alternatives": data["alternatives"],
            "how_to_obtain": data["how_to_obtain"],
            "legal_disclaimer": "This may help provide supporting context, but an advocate or the relevant tribunal will confirm admissible evidence under Indian statutory rules."
        }
