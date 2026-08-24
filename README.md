# ⚖️ NyayaSahayak AI (న్యాయసహాయక్ AI)
### AI-Powered Legal Rights, Documentation & Action Assistant for Indian Citizens
**SIH 2026 Prototype — Responsible Legal Access Architecture**

> **USP: “Don’t just know your rights. Know what to do next.”**

---

## 📌 1. Core Problem & Existing System Limitations

Ordinary Indian citizens face significant systemic hurdles when encountering civil, contractual, and administrative disputes:
- **Lack of Legal Literacy:** Citizens do not know which statutory law applies or what their legal rights are.
- **Unclear Evidence Requirements:** Citizens do not know what documents, receipts, or timestamps they must collect.
- **Documentation Barriers:** Drafting a formal statutory notice or representation requires expensive legal counsel.
- **Procedural Uncertainty:** Unaware of where to submit complaints or what to do if an authority refuses to help (e.g. Police FIR refusal).
- **Statutory Limitation Pitfalls:** Missing 15-day notice windows or 30-day appeal deadlines forfeits statutory remedies.

### 🚫 Existing Legal AI vs. ✨ NyayaSahayak AI
| Existing Legal Chatbots | ⚖️ NyayaSahayak AI (Action Paradigm) |
| :--- | :--- |
| **Ask → Generic Text Answer** | **Tell → Understand → Verify → Rights → Evidence → Document → Action → Track → Escalate** |
| Generates unverified text with hallucination risk | Indexes rights directly to **India Code** & official gazettes |
| Stops at legal definitions | Produces dynamic **Evidence Checklist & Completeness Meter** |
| Requires user to write their own notices | Generates ready-to-dispatch **Statutory Legal Notices & RTI drafts** |
| No escalation or case management | Provides sequenced **Step-by-Step Action Plan & DLSA Legal Aid routing** |

---

## 🌟 2. Key Features

1. **Dashboard & Citizen Hub:**
   - Real-time grievance search, quick prompts, live case metrics (Cases, Documents, Pending Actions, Deadlines, Evidence Collected %).
2. **AI Legal Problem Analyzer:**
   - Natural language input in **English** and **Telugu (తెలుగు)** with Web Speech voice recognition.
   - 4-step real-time analysis loader and domain synthesis.
3. **Legal Assistance Level (Risk Assessment):**
   - 🟢 General Information, 🟡 Professional Guidance Recommended, 🔴 Urgent Professional Legal Help Recommended.
   - Strict anti-hallucination policies and outcome-prediction disclaimers.
4. **Statutory Source Verification:**
   - Every cited section is verified against **India Code** with official links, descriptions, and last-checked timestamps.
5. **Evidence Center & Completeness Meter:**
   - Dynamic evidence checklist per case (e.g. Appointment Letter, Bank Statements, Handover media) with progress tracking.
6. **AI Document Analyzer:**
   - Upload PDF/DOCX/Images/Text to extract parties, critical dates, monetary sums, unfair clauses (e.g. illegal non-competes, arbitrary deductions), and response deadlines.
7. **Statutory Legal Document Generator:**
   - Interactive generator for:
     - Salary Payment Legal Notice (Payment of Wages Act 1936)
     - Rental Security Deposit Refund Notice (Transfer of Property Act / Model Tenancy Act)
     - Consumer Grievance Legal Notice (Consumer Protection Act 2019)
     - Representation to Superintendent of Police (Section 173(3) BNSS / 154(3) CrPC)
     - Standard RTI Application (Section 6(1) RTI Act 2005)
   - Live editable draft preview, 1-click Copy, Print/PDF format, Download, and Save to Case Vault.
8. **Personalized Legal Action Plan:**
   - Sequenced action steps (Evidence -> Notice -> Submission -> Tracking -> Escalation) with completion checkboxes.
9. **Authority Finder & NALSA Legal Aid Screener:**
   - Filterable directory of District Legal Services Authorities (DLSA), Consumer Commissions (e-Daakhil), Labour Commissioners, Cyber Crime Portals (1930), and Rent Tribunals.
   - Interactive Section 12 NALSA eligibility screener for 100% free advocate assignment.
10. **Case Timeline & Statutory Reminders:**
    - Visual chronological milestones and deadline tracking for notice windows and limitation dates.
11. **Privacy & Security Center:**
    - Zero data mining, no frontend API key leaks, clear cache/session controls.
12. **SIH 2026 Demo Mode:**
    - 5 Predefined 1-click test scenarios for instant hackathon evaluation.

---

## 🛠️ 3. Technology Stack

- **Frontend:** React 18, Vite 5, Vanilla CSS Design System (Navy/Royal Blue/Gold), Lucide React Icons.
- **Backend:** Python 3.13, Flask 3, Flask-CORS, REST API architecture.
- **Database:** SQLite (Relational schema ready for PostgreSQL migration).
- **AI / NLP Layer:**
  - AI Service Abstraction supporting Gemini / OpenAI LLM APIs via environment variables.
  - Comprehensive Indian Legal Knowledge Base Engine (Payment of Wages, Model Tenancy Act, Consumer Protection 2019, IT Act 2000, BNSS/CrPC, RTI 2005, NALSA 1987).

---

## 🗄️ 4. Database Schema

The SQLite database (`backend/database/nyayasahayak.db`) comprises:
- `users`: User profiles and preferred language (`en`/`te`).
- `cases`: Disputed grievances, legal category, risk level, status, and summaries.
- `documents`: Uploaded and generated legal drafts, extracted clauses, and metadata.
- `evidence`: Case-specific evidence items, categories, status (`collected`/`pending`), and notes.
- `action_steps`: Ordered action sequences with designated authorities, deadlines, and statuses.
- `reminders`: Statutory limitation alerts, follow-up dates, and priority tags.
- `legal_sources`: India Code statutory provisions, verification status, and URLs.
- `authorities`: State & District dispute resolution bodies, contact numbers, and legal aid clinics.
- `timeline_events`: Chronological history of milestones logged per case.

---

## 🚀 5. Installation & Running Instructions

### Prerequisites
- Python 3.10+ installed
- Node.js 18+ and npm installed

### Step 1: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start Flask API server (runs on http://127.0.0.1:5000)
python app.py
```

### Step 2: Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install node dependencies
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

---

## 🧪 6. SIH 2026 Predefined Demo Scenarios

Click the **"Demo Scenarios (SIH 2026)"** button in the navbar to test:
1. **Unpaid Salary for 3 Months:** Payment of Wages Act violation, evidence checklist, statutory 15-day notice generation, and Labour Commissioner claim initiation.
2. **Rental Deposit Withholding (Rs 60,000):** Model Tenancy Act rights, move-out inspection photo evidence, and 14-day refund notice.
3. **Online Financial Fraud / UPI Scam:** RBI Zero Liability rule within 3 days, 1930 Cyber helpline protocol, and cybercrime.gov.in complaint draft.
4. **Defective Product & Warranty Refusal:** Consumer Protection Act 2019, e-Daakhil filing steps, and manufacturer notice.
5. **Police Station Refusal to Register FIR:** Lalita Kumari Supreme Court ruling, Section 173(3) BNSS / 154(3) CrPC written representation to District SP.

---

## 🛡️ 7. Responsible AI & Legal Limitations

- **No False Pretenses:** NyayaSahayak AI explicitly states it is an empowerment tool, not a certified lawyer.
- **No Hallucinated Laws:** Every cited statutory section corresponds to enacted Indian legislation.
- **No Outcome Prediction:** The platform never claims "You have an 85% chance of winning". It measures **"Evidence Completeness: 80%"**.
- **Advocate Routing:** High-risk disputes route citizens to official **District Legal Services Authorities (DLSA)** for free legal representation under Section 12 of the Legal Services Authorities Act, 1987.
