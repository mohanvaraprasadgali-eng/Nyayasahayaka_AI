import React, { useState } from 'react';
import { 
  X, 
  PlayCircle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Scale, 
  Lock, 
  CreditCard, 
  UserCheck, 
  MessageSquare,
  ShieldCheck,
  FolderLock,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCaseContext } from '../context/CaseContext';

export const HackathonDemoTourModal = ({ isOpen, onClose }) => {
  const { switchPersona } = useAuth();
  const { setActiveTab, showToast, setCurrentCaseId } = useCaseContext();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const demoSteps = [
    {
      title: "1. Citizen Problem Submission",
      role: "Citizen (Ramesh Kumar)",
      personaKey: "citizen_ramesh",
      targetTab: "create_case",
      caseId: 1,
      desc: "Citizen describes grievance in plain language: 'Landlord has not returned my security deposit of ₹60,000 after I vacated the flat.'",
      actionLabel: "View Create Case Flow ➔"
    },
    {
      title: "2. AI Categorization & Complexity Meter",
      role: "AI Intelligence Layer",
      personaKey: "citizen_ramesh",
      targetTab: "citizen_cases",
      caseId: 1,
      desc: "AI classifies dispute: Category: Rental/Housing, Complexity: 🟡 MODERATE (Platform Fee: ₹499), Cites Transfer of Property Act 1882 & Model Tenancy Act.",
      actionLabel: "View AI Complexity & Rights ➔"
    },
    {
      title: "3. 'I Don't Have This Document' Helper",
      role: "Citizen Evidence Assistance",
      personaKey: "citizen_ramesh",
      targetTab: "citizen_cases",
      caseId: 1,
      desc: "Citizen clicks 'I don't have my Rental Agreement'. System shows alternative admissible evidence (HDFC Bank transfer statement, WhatsApp move-out photos).",
      actionLabel: "Inspect Missing Doc Guidance ➔"
    },
    {
      title: "4. Prototype Payment Simulation",
      role: "Payment Gateway",
      personaKey: "citizen_ramesh",
      targetTab: "citizen_payments",
      caseId: 1,
      desc: "Citizen pays ₹499 fee via mock simulated UPI gateway. Payment is verified and case enters MATCHING status.",
      actionLabel: "View Payment Ledger & Receipt ➔"
    },
    {
      title: "5. Lawyer Matching & Anonymized Preview",
      role: "Verified Lawyer (Adv. Priya Sharma)",
      personaKey: "lawyer_priya",
      targetTab: "lawyer_requests",
      caseId: 1,
      desc: "Advocate Priya receives notification. Preview shows 'Citizen from Hyderabad' with case metadata. Private citizen contact and documents remain LOCKED.",
      actionLabel: "Switch to Lawyer & View Request ➔"
    },
    {
      title: "6. Lawyer Case Acceptance & Vault Handover",
      role: "Verified Lawyer (Adv. Priya Sharma)",
      personaKey: "lawyer_priya",
      targetTab: "document_vault",
      caseId: 1,
      desc: "Lawyer accepts case. Secure document vault UNLOCKS for Adv. Priya only (Other lawyers get 403 Forbidden).",
      actionLabel: "Inspect Private Document Vault ➔"
    },
    {
      title: "7. Private Case Consultation Chat",
      role: "Citizen + Assigned Lawyer",
      personaKey: "lawyer_priya",
      targetTab: "lawyer_chat",
      caseId: 1,
      desc: "End-to-end case-scoped encrypted channel between client and advocate. Lawyer confirms 14-day statutory demand notice.",
      actionLabel: "Open Private Client Chat ➔"
    },
    {
      title: "8. Admin Verification & Immutable Audit Logs",
      role: "Platform Operations Admin",
      personaKey: "admin",
      targetTab: "admin_audit_logs",
      caseId: 1,
      desc: "Admin reviews pending lawyer bar council proofs and inspects live immutable audit logs recording every document view and case assignment.",
      actionLabel: "Switch to Admin & View Audit Logs ➔"
    }
  ];

  const current = demoSteps[currentStep];

  const handleStepExecute = async () => {
    await switchPersona(current.personaKey);
    setActiveTab(current.targetTab);
    setCurrentCaseId(current.caseId);
    showToast(`Switched to ${current.role} (Step ${currentStep + 1} of ${demoSteps.length})`);
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#1e1b4b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}>
              <PlayCircle size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                SIH 2026 End-to-End Demo Journey
              </h3>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#94a3b8' }}>
                Complete 15-Step Citizen ➔ AI ➔ Verified Lawyer ➔ Private Vault ➔ Admin Flow
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Step Progress Pills */}
        <div style={{ display: 'flex', gap: '0.35rem', margin: '1rem 0 0.5rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
          {demoSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              style={{
                flex: 1,
                minWidth: '24px',
                height: '8px',
                borderRadius: '4px',
                background: idx === currentStep ? '#38bdf8' : (idx < currentStep ? '#10b981' : 'rgba(148, 163, 184, 0.2)'),
                border: 'none',
                cursor: 'pointer'
              }}
              title={step.title}
            />
          ))}
        </div>

        {/* Current Step Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid #3b82f6',
          borderRadius: '12px',
          padding: '1.25rem',
          margin: '0.8rem 0 1.2rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#60a5fa',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              Step {currentStep + 1} of {demoSteps.length}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>
              Active Role: {current.role}
            </span>
          </div>

          <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
            {current.title}
          </h4>

          <p style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            {current.desc}
          </p>

          <button
            className="btn btn-primary btn-block btn-lg"
            onClick={handleStepExecute}
            style={{ fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
          >
            <span>{current.actionLabel}</span>
          </button>
        </div>

        {/* Step List Overview */}
        <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem' }}>
          {demoSteps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentStep(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.4rem 0.6rem',
                borderRadius: '6px',
                background: idx === currentStep ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                cursor: 'pointer',
                fontSize: '0.8rem',
                color: idx === currentStep ? '#38bdf8' : '#94a3b8'
              }}
            >
              {idx < currentStep ? <CheckCircle2 size={14} className="text-emerald-500" /> : <ChevronRight size={14} />}
              <span style={{ fontWeight: idx === currentStep ? 700 : 500 }}>{step.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
