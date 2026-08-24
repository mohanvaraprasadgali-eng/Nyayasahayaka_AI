import React, { createContext, useContext, useState } from 'react';

export const LanguageContext = createContext();

const translations = {
  en: {
    brand_name: "NyayaSahayak AI",
    usp_tag: "Don’t just know your rights. Know what to do next.",
    welcome_title: "Welcome to NyayaSahayak AI",
    welcome_sub: "Understand your rights. Prepare your documents. Take the next step.",
    ask_hero_title: "What legal problem are you facing?",
    ask_hero_placeholder: "Describe your problem in your own words (e.g. My employer has not paid my salary for three months...)",
    btn_analyze: "Analyze My Problem",
    btn_speak: "Speak Instead",
    nav_dashboard: "Dashboard",
    nav_ask_problem: "Ask a Legal Problem",
    nav_doc_analyzer: "Document Analyzer",
    nav_doc_generator: "Document Generator",
    nav_know_rights: "Know Your Rights",
    nav_evidence: "Evidence Center",
    nav_find_help: "Find Help & Legal Aid",
    nav_timeline: "Case Timeline",
    nav_reminders: "Reminders & Deadlines",
    nav_privacy: "Privacy Center",
    quick_actions: "Quick Actions",
    stat_cases: "My Cases",
    stat_docs: "Documents",
    stat_pending: "Pending Actions",
    stat_deadlines: "Upcoming Deadlines",
    stat_evidence: "Evidence Collected",
    demo_mode_btn: "Demo Scenarios (SIH 2026)",
    legal_aid_screener: "Free Legal Aid Checker",
    risk_general: "General Legal Information",
    risk_guidance: "Professional Guidance Recommended",
    risk_urgent: "Urgent Professional Legal Help Recommended",
    evidence_completeness: "Evidence Completeness",
    save_to_case_btn: "Save as Official Case",
    create_notice_btn: "Generate Legal Notice",
    why_matters: "Why this matters:",
    why_matters_desc: "Legal information can change. Always verify important legal provisions from official sources or a qualified legal professional."
  },
  te: {
    brand_name: "న్యాయసహాయక్ AI",
    usp_tag: "మీ హక్కులను తెలుసుకోవడమే కాదు. తదుపరి ఏం చేయాలో తెలుసుకోండి.",
    welcome_title: "న్యాయసహాయక్ AI కి స్వాగతం",
    welcome_sub: "మీ హక్కులను అర్థం చేసుకోండి. చట్టపరమైన పత్రాలు సిద్ధం చేయండి. తదుపరి అడుగు వేయండి.",
    ask_hero_title: "మీరు ఎలాంటి చట్టపరమైన సమస్యను ఎదుర్కొంటున్నారు?",
    ask_hero_placeholder: "మీ సమస్యను మీ సొంత మాటల్లో లేదా తెలుగులో వివరించండి (ఉదా: మా ఓనర్ అడ్వాన్స్ డిపాజిట్ తిరిగి ఇవ్వట్లేదు / కంపెనీ జీతం ఇవ్వలేదు...)",
    btn_analyze: "సమస్యను విశ్లేషించండి",
    btn_speak: "మాట్లాడి చెప్పండి",
    nav_dashboard: "డ్యాష్‌బోర్డ్",
    nav_ask_problem: "సమస్యను అడగండి",
    nav_doc_analyzer: "పత్రాల విశ్లేషణ",
    nav_doc_generator: "పత్రాల తయారీ",
    nav_know_rights: "మీ హక్కులు",
    nav_evidence: "సాక్ష్యాధారాల కేంద్రం",
    nav_find_help: "సహాయం & లీగల్ ఎయిడ్",
    nav_timeline: "కేసు కాలక్రమం",
    nav_reminders: "రిమైండర్లు & గడువులు",
    nav_privacy: "గోప్యతా కేంద్రం",
    quick_actions: "త్వరిత చర్యలు",
    stat_cases: "నా కేసులు",
    stat_docs: "పత్రాలు",
    stat_pending: "పెండింగ్ చర్యలు",
    stat_deadlines: "రాబోయే గడువులు",
    stat_evidence: "సేకరించిన సాక్ష్యాలు",
    demo_mode_btn: "డెమో దృశ్యాలు (SIH 2026)",
    legal_aid_screener: "ఉచిత న్యాయ సహాయ తనిఖీ",
    risk_general: "సాధారణ చట్ట సమాచారం",
    risk_guidance: "న్యాయవాది సలహా సిఫార్సు చేయబడింది",
    risk_urgent: "అత్యవసర న్యాయవాది సహాయం అవసరం",
    evidence_completeness: "సాక్ష్యాల సేకరణ శాతం",
    save_to_case_btn: "కేసుగా సేవ్ చేయండి",
    create_notice_btn: "లీగల్ నోటీసు తయారు చేయండి",
    why_matters: "ఇది ఎందుకు ముఖ్యం:",
    why_matters_desc: "చట్టపరమైన నిబంధనలు మారుతుంటాయి. అధికారిక ప్రభుత్వ ఆధారాలు లేదా అర్హత కలిగిన న్యాయవాది ద్వారా ఎల్లప్పుడూ ధృవీకరించుకోండి."
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    return translations.en[key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'te' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
