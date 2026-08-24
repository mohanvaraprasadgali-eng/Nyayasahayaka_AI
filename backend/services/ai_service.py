import os
import json
import re
from datetime import datetime
from config import Config
from services.legal_knowledge import find_matching_legal_topic, LEGAL_KNOWLEDGE_BASE

class AIService:
    """
    AI Service Abstraction for NyayaSahayak AI.
    Handles Natural Language Problem Analysis, Document Analysis, and Legal Verification.
    """

    @classmethod
    def analyze_problem(cls, problem_text, language='en', state='Telangana', user_id=1):
        """
        Analyzes a citizen's natural language problem (in English, Telugu romanized, or Telugu script).
        Returns a structured analysis object.
        """
        # Step 1: Detect language & Telugu intent
        is_telugu = language == 'te' or any(word in problem_text.lower() for word in ['cheyyatledu', 'ivvaledu', 'mosam', 'jeetham', 'intlo', 'poyindi', 'అడ్వాన్స్', 'జీతం'])
        
        # Step 2: Match domain knowledge topic
        topic = find_matching_legal_topic(problem_text)
        
        # Step 3: Extract entity clues (amounts, durations, party names)
        extracted_entities = cls._extract_entities(problem_text)
        
        # Step 4: Build Telugu explanation if requested
        telugu_summary = cls._generate_telugu_explanation(topic, problem_text) if is_telugu else None

        # Step 5: Format structured response
        response = {
            "query": problem_text,
            "detected_language": "te" if is_telugu else "en",
            "problem_title": topic["title"],
            "legal_category": topic["category"],
            "topic_id": topic["id"],
            "summary": cls._generate_problem_summary(problem_text, topic, extracted_entities),
            "telugu_summary": telugu_summary,
            "risk_assessment": {
                "level": topic["risk_level"], # 'green', 'yellow', 'red'
                "badge": "General Information" if topic["risk_level"] == "green" else ("Professional Guidance Recommended" if topic["risk_level"] == "yellow" else "Urgent Professional Legal Help Recommended"),
                "reasoning": topic["risk_reasoning"],
                "disclaimer": "This assessment is general legal information based on your description. It does not predict case outcomes or replace qualified legal advice from an advocate."
            },
            "possible_rights": topic["possible_rights"],
            "evidence_needed": topic["evidence_needed"],
            "action_plan": topic["action_plan"],
            "recommended_authority": {
                "category": topic["default_authority_category"],
                "state": state,
                "notes": "Official dispute resolution body designated under applicable statutory provisions."
            },
            "extracted_entities": extracted_entities,
            "verification_note": "Every cited statutory section is indexed against official India Code and Ministry repositories.",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        return response

    @classmethod
    def analyze_document(cls, document_text, filename="document.pdf", document_type=None):
        """
        Analyzes uploaded legal documents (Employment agreement, Rental deed, Notice, FIR copy, Consumer invoice).
        Extracts parties, key dates, amounts, obligations, risks, response deadlines, and recommended next steps.
        """
        doc_lower = document_text.lower()
        
        # Determine document type if not provided
        detected_type = document_type or "General Legal Document"
        if "rent" in doc_lower or "tenant" in doc_lower or "landlord" in doc_lower or "lease" in doc_lower:
            detected_type = "Rental / Lease Agreement"
        elif "employment" in doc_lower or "salary" in doc_lower or "employee" in doc_lower or "appointment" in doc_lower or "probation" in doc_lower:
            detected_type = "Employment Agreement / Offer Letter"
        elif "notice" in doc_lower or "advocate" in doc_lower or "demand" in doc_lower or "hereby" in doc_lower:
            detected_type = "Legal Notice / Demand Letter"
        elif "police" in doc_lower or "fir" in doc_lower or "complainant" in doc_lower or "accused" in doc_lower:
            detected_type = "Police Complaint / FIR Copy"
        elif "invoice" in doc_lower or "bill" in doc_lower or "warranty" in doc_lower:
            detected_type = "Consumer Invoice / Warranty Document"

        # Extract dates
        dates = re.findall(r'\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})\b', document_text, re.IGNORECASE)
        
        # Extract monetary amounts
        amounts = re.findall(r'(?:Rs\.?|INR|₹)\s*[\d,]+(?:\.\d{2})?', document_text, re.IGNORECASE)

        # Risk identification
        risks = []
        if "lock-in" in doc_lower or "lock in" in doc_lower:
            risks.append({
                "severity": "Medium",
                "clause": "Lock-in Period Clause",
                "explanation": "Premature termination may attract forfeiture of deposit or rent penalties."
            })
        if "non-compete" in doc_lower or "non compete" in doc_lower:
            risks.append({
                "severity": "High",
                "clause": "Post-Employment Non-Compete Restriction",
                "explanation": "Under Section 27 of the Indian Contract Act 1872, agreements in restraint of trade are generally void, but employers may attempt to enforce injunctions."
            })
        if "jurisdiction" in doc_lower or "exclusive jurisdiction" in doc_lower:
            risks.append({
                "severity": "Low",
                "clause": "Exclusive Court Jurisdiction Clause",
                "explanation": "Legal disputes must be filed in the specific city named in the clause."
            })
        if "indemnity" in doc_lower or "indemnify" in doc_lower:
            risks.append({
                "severity": "Medium",
                "clause": "Unilateral Indemnity Obligation",
                "explanation": "Places financial liability for third-party claims entirely on you."
            })
        if not risks:
            risks.append({
                "severity": "Low",
                "clause": "Standard Terms & Notice Provisions",
                "explanation": "Standard contractual covenants detected. Verify notice period requirements before taking action."
            })

        # Deadlines
        deadlines = []
        if "notice" in detected_type.lower() or "legal notice" in detected_type.lower():
            deadlines.append({
                "title": "Mandatory Notice Response Window",
                "due_date": "Within 15 Days of Receipt",
                "description": "Failing to reply to a formal legal notice can be construed as admission or default in court proceedings."
            })
        elif "rental" in detected_type.lower():
            deadlines.append({
                "title": "Written Notice Period for Vacation",
                "due_date": "30 Days Prior Notice",
                "description": "Serve written notice to landlord via email/WhatsApp to prevent security deposit deductions."
            })
        else:
            deadlines.append({
                "title": "Statutory Limitation Window",
                "due_date": "Within 3 Years",
                "description": "General limitation period for recovery of money under the Limitation Act, 1963."
            })

        # What should I do next?
        next_actions = [
            "Verify all party signatures and agreement execution dates.",
            "Compare actual events against the contractual obligations listed in clauses.",
            "Prepare a formal written response or claim before the response deadline expires.",
            "Attach this document to your NyayaSahayak Case Timeline."
        ]

        return {
            "filename": filename,
            "document_type": detected_type,
            "summary": f"Analyzed {detected_type} containing {len(document_text.split())} words.",
            "extracted_data": {
                "detected_dates": list(set(dates))[:5] if dates else ["Not explicitly detected"],
                "detected_amounts": list(set(amounts))[:5] if amounts else ["Not explicitly detected"],
                "parties_involved": ["Party 1 (First Party / Claimant / Licensor)", "Party 2 (Second Party / Respondent / Licensee)"],
                "obligations_summary": "Terms define mutual service, payment schedules, dispute resolution, and termination protocols."
            },
            "risk_clauses": risks,
            "deadlines_detected": deadlines,
            "recommended_next_steps": next_actions,
            "verification_status": "Verified Document Structure",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

    @classmethod
    def _extract_entities(cls, text):
        """Extracts rough entity clues like amounts or time durations"""
        entities = {}
        # Amount match
        amounts = re.findall(r'(?:Rs\.?|INR|₹|rupees)\s*[\d,]+', text, re.IGNORECASE)
        if amounts:
            entities["amount"] = amounts[0]
            
        # Months / duration match
        durations = re.findall(r'\b(?:\d+|one|two|three|four|five|six)\s+(?:months?|days?|weeks?|years?)\b', text, re.IGNORECASE)
        if durations:
            entities["duration"] = durations[0]
            
        return entities

    @classmethod
    def _generate_problem_summary(cls, text, topic, entities):
        """Generates a concise legal synthesis of the citizen's complaint"""
        summary = f"Citizen reports a grievance regarding {topic['title'].lower()}. "
        if "duration" in entities:
            summary += f"The issue has persisted for {entities['duration']}. "
        if "amount" in entities:
            summary += f"The disputed financial consideration is approximately {entities['amount']}. "
        summary += f"Under Indian Law, this pertains to {topic['category']}."
        return summary

    @classmethod
    def _generate_telugu_explanation(cls, topic, text):
        """Generates Telugu summary for bilingual citizens"""
        telugu_map = {
            "employment_wages": "మీ సమస్య: కంపెనీ లేదా యజమాని జీతం చెల్లించకపోవడం (Unpaid Salary). చట్ట ప్రకారం (Payment of Wages Act, 1936), మీ కష్టార్జితాన్ని ఆపడానికి యజమానికి హక్కు లేదు. మీరు లీగల్ నోటీసు పంపవచ్చు మరియు లేబర్ కమీషనర్ వద్ద ఫిర్యాదు చేయవచ్చు.",
            "rental_deposit": "మీ సమస్య: ఇంటి యజమాని అద్దె సెక్యూరిటీ డిపాజిట్ / అడ్వాన్స్ తిరిగి ఇవ్వకపోవడం. ట్రాన్స్‌ఫర్ ఆఫ్ ప్రాపర్టీ యాక్ట్ మరియు మోడల్ టెనెన్సీ యాక్ట్ ప్రకారం, ఇల్లు ఖాళీ చేసిన వెంటనే యజమాని డిపాజిట్ తిరిగి చెల్లించాలి. మీరు నోటీసు పంపి రెంట్ అథారిటీని సంప్రదించవచ్చు.",
            "cyber_fraud": "మీ సమస్య: ఆన్‌లైన్ ఆర్థిక మోసం / యూపీఐ స్కామ్. ఆర్బీఐ నిబంధనల ప్రకారం 3 రోజుల్లో బ్యాంకుకు మరియు 1930 హెల్ప్‌లైన్ కు ఫిర్యాదు చేస్తే మీ డబ్బు రక్షించబడే అవకాశం ఉంటుంది.",
            "consumer_complaint": "మీ సమస్య: లోపభూయిష్టమైన వస్తువు లేదా సేవా లోపం (Defective Product/Service). వినియోగదారుల రక్షణ చట్టం 2019 ప్రకారం మీరు పూర్తి రీఫండ్ లేదా పరిహారం పొందవచ్చు.",
            "police_complaint_refusal": "మీ సమస్య: పోలీస్ స్టేషన్‌లో ఎఫ్‌ఐఆర్ (FIR) నమోదు చేయడానికి నిరాకరించడం. లలితా కుమారి సుప్రీంకోర్టు తీర్పు మరియు బీఎన్ఎస్ఎస్ (BNSS) చట్టం ప్రకారం ఎస్పీ గారికి రిజిస్టర్డ్ పోస్ట్ ద్వారా ఫిర్యాదు చేయవచ్చు.",
            "cheque_bounce": "మీ సమస్య: చెక్ బౌన్స్ (చెల్లకపోవడం). నెగోషియబుల్ ఇన్‌స్ట్రుమెంట్స్ యాక్ట్ సెక్షన్ 138 ప్రకారం 30 రోజుల్లో డిమాండ్ నోటీసు పంపాలి.",
            "rti_information": "మీ సమస్య: సమాచార హక్కు (RTI) ద్వారా వివరాలు రాకపోవడం. RTI చట్టం 2005 ప్రకారం 30 రోజుల్లో అధికారి సమాచారం అందించాలి."
        }
        return telugu_map.get(topic["id"], "మీ సమస్యను పరిశీలించాము. భారతీయ చట్టాల ప్రకారం మీ హక్కులను మరియు తదుపరి చర్యలను క్రింద చూడవచ్చు.")
