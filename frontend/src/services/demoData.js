/**
 * NyayaSahayak AI - SIH 2026 Predefined Demo Scenarios
 * Enables 1-click evaluation of complete citizen legal workflows.
 */

export const DEMO_SCENARIOS = [
  {
    id: "unpaid_salary",
    title: "Unpaid Salary for 3 Months",
    category: "Employment / Labour",
    badge: "🟡 Professional Guidance Recommended",
    icon: "Briefcase",
    prompt: "My employer has not paid my monthly salary of Rs 45,000 for May, June, and July 2026 despite regular attendance and repeated emails.",
    teluguPrompt: "మా కంపెనీ గత 3 నెలల నుండి నా జీతం ఇవ్వడం లేదు. అనేకసార్లు అడిగినా స్పందించడం లేదు.",
    description: "Demonstrates employee rights under Payment of Wages Act 1936, statutory demand notice generation, and Labour Commissioner claim initiation.",
    suggestedTemplate: "salary_notice",
    sampleFields: {
      complainant_name: "Ramesh Kumar",
      complainant_address: "H.No 4-12, Madhapur, Hyderabad - 500081",
      employer_name: "TechCorp Solutions Pvt. Ltd.",
      employer_address: "Cyber Towers, HITEC City, Hyderabad",
      designation: "Senior Software Engineer",
      unpaid_months: "May 2026, June 2026, and July 2026",
      monthly_salary: "Rs. 45,000/-",
      total_amount: "Rs. 1,35,000/-"
    }
  },
  {
    id: "rental_deposit",
    title: "Rental Deposit Withholding",
    category: "Housing / Tenancy",
    badge: "🟢 General Information",
    icon: "Home",
    prompt: "My landlord is not returning my security deposit of Rs 60,000 even after I vacated the flat 30 days ago with zero damages.",
    teluguPrompt: "మా landlord advance return cheyyatledu. Flat vacche chesi 1 month aindi.",
    description: "Demonstrates tenant rights under Model Tenancy Act 2021 & Transfer of Property Act, eviction protection, and 14-day formal refund notice.",
    suggestedTemplate: "rental_deposit_notice",
    sampleFields: {
      tenant_name: "Priya Sharma",
      tenant_address: "Flat 302, Green Meadows, Gachibowli, Hyderabad",
      landlord_name: "Mr. K. Satyanarayana",
      landlord_address: "Plot 45, Jubilee Hills, Hyderabad",
      property_address: "Flat 101, Sai Residency, Banjara Hills, Hyderabad",
      deposit_amount: "Rs. 60,000/-",
      vacation_date: "25th July 2026"
    }
  },
  {
    id: "online_fraud",
    title: "Online Financial Fraud / UPI Scam",
    category: "Cyber Crime & Financial Protection",
    badge: "🔴 Urgent Legal Help Recommended",
    icon: "ShieldAlert",
    prompt: "I was defrauded of Rs 35,000 through a fake KYC update link on WhatsApp that debited money via unauthorized UPI transaction.",
    teluguPrompt: "నా బ్యాంక్ అకౌంట్ నుండి కేవైసీ పేరుతో రూ. 35,000 మోసపూరితంగా కట్ చేశారు.",
    description: "Demonstrates RBI Zero Liability guideline, 1930 Cyber Helpline immediate reporting, and Cyber Crime Portal FIR filing protocol.",
    suggestedTemplate: "police_sp_representation",
    sampleFields: {
      complainant_name: "K. Rajesh",
      complainant_address: "Flat 401, Kakatiya Nagar, Secunderabad | +91 9988776655",
      police_station_name: "Cyber Crime Police Station, Hyderabad Commissionerate",
      visit_date: "20th August 2026 at 11:00 AM",
      accused_details: "Unknown cyber scammer operating WhatsApp +91 8877665544 & UPI ID paytm-fraud@upi",
      incident_facts: "Victim received spoofed SMS regarding electricity disconnection; clicked APK link and lost Rs 35,000 in two unauthorized UPI debits."
    }
  },
  {
    id: "consumer_complaint",
    title: "Defective Product & Warranty Refusal",
    category: "Consumer Protection",
    badge: "🟢 General Information",
    icon: "ShoppingBag",
    prompt: "I purchased a smart TV from an e-commerce retailer and the screen stopped working within 2 months. The brand is refusing warranty repair or replacement.",
    teluguPrompt: "కొత్తగా కొన్న టీవీ 2 నెలల్లో పాడైపోయింది, కంపెనీ వారంటీ రిపేర్ చేయడానికి నిరాకరిస్తోంది.",
    description: "Demonstrates Consumer Protection Act 2019 provisions, e-Daakhil filing guidelines, and formal statutory consumer legal notice.",
    suggestedTemplate: "consumer_notice",
    sampleFields: {
      consumer_name: "Arvind Mehta",
      consumer_address: "12/B, MG Road, Secunderabad",
      company_name: "Apex Electronics Retail Pvt. Ltd.",
      company_address: "Industrial Area Phase 2, Mumbai",
      product_name: "Smart LED Television 55-inch",
      invoice_number: "INV-98421 dated 10 April 2026",
      purchase_price: "Rs. 42,999/-",
      defect_description: "Display panel completely blank within 60 days of purchase; authorized center refused free repair claiming physical abuse without inspection."
    }
  },
  {
    id: "police_refusal",
    title: "Police Station Refusal to Register FIR",
    category: "Criminal Justice & Civil Rights",
    badge: "🔴 Urgent Legal Help Recommended",
    icon: "FileWarning",
    prompt: "I went to the police station to lodge a complaint about criminal intimidation and property damage, but the SHO refused to register an FIR or give a receipt.",
    teluguPrompt: "పోలీస్ స్టేషన్‌లో నా కంప్లైంట్ తీసుకోలేదు, ఎఫ్‌ఐఆర్ రాయడానికి నిరాకరించారు.",
    description: "Demonstrates Supreme Court Lalita Kumari mandate, Section 173(3) BNSS / 154(3) CrPC written representation to SP, and Judicial Magistrate 156(3) escalation.",
    suggestedTemplate: "police_sp_representation",
    sampleFields: {
      complainant_name: "S. Venkatesh",
      complainant_address: "H.No 8-2-120, Gachibowli, Hyderabad | +91 9876543210",
      police_station_name: "Gachibowli Police Station, Cyberabad Commissionerate",
      visit_date: "18th August 2026 at 4:30 PM",
      accused_details: "Local land grabbers Rahul and associates",
      incident_facts: "Criminal intimidation, broken boundary wall, and verbal threats to vacate ancestral land."
    }
  }
];
