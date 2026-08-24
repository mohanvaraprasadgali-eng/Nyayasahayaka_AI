import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Scale,
  FileText,
  FileSearch,
  CheckSquare,
  Compass,
  ArrowRight,
  Shield,
  Lock,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  UserCheck,
  FolderLock,
  CreditCard,
  Zap,
  PlayCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCaseContext } from '../context/CaseContext';
import { useAuth } from '../context/AuthContext';
import { VoiceInput } from '../components/VoiceInput';

export const Dashboard = () => {
  const { t, language } = useLanguage();
  const { stats, cases, setActiveTab, setPendingAnalysis, setShowDemoTourModal, setShowLegalAidModal, setCurrentCaseId } = useCaseContext();
  const { currentUser } = useAuth();
  const [problemQuery, setProblemQuery] = useState('');

  const examplePrompts = [
    { label: "Unpaid Salary", query: "My employer has not paid my salary for three months despite regular attendance." },
    { label: "Rental Deposit", query: "My landlord is not returning my security deposit of Rs 60,000 after I vacated the flat." },
    { label: "Police FIR Refusal", query: "The police station refused to register my complaint regarding property encroachment." },
    { label: "Online Fraud", query: "I was a victim of online financial fraud through a fake KYC update link." },
    { label: "Defective Product", query: "I bought a smart TV that broke in 2 months and the seller refuses warranty repair." },
    { label: "Telugu Query", query: "మా landlord advance return cheyyatledu, 1 month aindi." }
  ];

  const handleAnalyzeSubmit = (e) => {
    e?.preventDefault();
    if (!problemQuery.trim()) return;
    setPendingAnalysis({ prompt: problemQuery.trim() });
    setActiveTab('create_case');
  };

  const handlePromptClick = (query) => {
    setProblemQuery(query);
    setPendingAnalysis({ prompt: query });
    setActiveTab('create_case');
  };

  return (
    <div>
      {/* Hero Banner Section */}
      <div className="hero-banner">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)', color: '#fef08a', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' }}>
            <Sparkles size={14} />
            <span>AI-Powered Legal Rights & Verified Lawyer Assistance Platform</span>
          </div>

          <h2 className="hero-title">
            From Legal Confusion to the Right Next Step.
          </h2>
          <p className="hero-subtitle">
            Understand your legal situation, securely manage your documents, and connect with verified legal professionals.
          </p>

          {/* Large Problem Input Box */}
          <form onSubmit={handleAnalyzeSubmit} className="hero-input-box">
            <Search size={22} style={{ color: '#94a3b8', marginLeft: '0.5rem', flexShrink: 0 }} />
            <input
              type="text"
              className="hero-textarea"
              placeholder="Describe your legal issue in simple language (e.g. Landlord not returning deposit, unpaid salary)..."
              value={problemQuery}
              onChange={(e) => setProblemQuery(e.target.value)}
            />
            <VoiceInput
              onTranscript={(text) => {
                setProblemQuery(text);
                setPendingAnalysis({ prompt: text });
                setActiveTab('create_case');
              }}
            />
            <button type="submit" className="btn btn-primary btn-lg" style={{ flexShrink: 0 }}>
              <Scale size={18} />
              <span>Create Legal Case</span>
            </button>
          </form>

          {/* Example Prompt Pills */}
          <div className="hero-prompt-pills">
            <span className="prompt-pill-label">Try instant test disputes:</span>
            {examplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className="prompt-pill-btn"
                onClick={() => handlePromptClick(p.query)}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Quick Action Bar */}
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-accent btn-sm"
              onClick={() => setShowDemoTourModal(true)}
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1e1b4b', fontWeight: 800 }}
            >
              <PlayCircle size={16} />
              <span>Start SIH 2026 1-Click Demo Journey</span>
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('create_case')}
            >
              <span>+ Create Formal Case</span>
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('document_vault')}
            >
              <FolderLock size={15} />
              <span>Private Document Vault</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Value Proposition Cards */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
          Platform Pillars & Legal Access Architecture
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {/* Card 1 */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scale size={18} />
              </div>
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>
                Understand Your Rights
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45 }}>
              Indexed against official India Code gazettes (Payment of Wages, Model Tenancy Act, Consumer Protection 2019, BNSS/CrPC).
            </p>
          </div>

          {/* Card 2 */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileSearch size={18} />
              </div>
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>
                Secure Document Analysis
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45 }}>
              Upload contracts to identify illegal non-competes, arbitrary deduction clauses, critical notice dates, and financial liabilities.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={18} />
              </div>
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>
                Connect With Verified Lawyers
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45 }}>
              Every advocate undergoes administrative bar council and identity authentication before receiving citizen case opportunities.
            </p>
          </div>

          {/* Card 4 */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FolderLock size={18} />
              </div>
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>
                Private Case Documents
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45 }}>
              Strict case-level authorization checks. Uploaded evidence is accessible solely by you and your accepted legal counsel.
            </p>
          </div>

          {/* Card 5 */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Compass size={18} />
              </div>
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>
                Step-by-Step Guidance
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45 }}>
              Dynamic evidence checklists with alternative guidance when documents are missing, plus sequential escalation steps.
            </p>
          </div>

          {/* Card 6 */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={18} />
              </div>
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>
                Transparent Case Pricing
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45 }}>
              Restricted platform fee tiers (Basic ₹199, Moderate ₹499, Complex ₹999) based on dispute complexity and document count.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="card" style={{ padding: '1.25rem', cursor: 'pointer' }} onClick={() => setActiveTab('citizen_cases')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Active Cases</span>
            <Scale size={18} className="text-blue-400" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>
            {stats.total_cases}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#60a5fa' }}>View Case Workspace ➔</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', cursor: 'pointer' }} onClick={() => setActiveTab('document_vault')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Private Vault Documents</span>
            <FolderLock size={18} className="text-emerald-400" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399' }}>
            {stats.total_documents}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#34d399' }}>Encrypted & protected ➔</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', cursor: 'pointer' }} onClick={() => setActiveTab('evidence')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Evidence Completeness</span>
            <CheckSquare size={18} className="text-amber-400" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24' }}>
            {stats.evidence_collected_percentage}%
          </div>
          <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>Checklist meter ➔</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', cursor: 'pointer' }} onClick={() => setActiveTab('reminders')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Statutory Reminders</span>
            <Clock size={18} className="text-purple-400" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#c084fc' }}>
            {stats.upcoming_deadlines}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#c084fc' }}>Limitation tracking ➔</span>
        </div>
      </div>
    </div>
  );
};
