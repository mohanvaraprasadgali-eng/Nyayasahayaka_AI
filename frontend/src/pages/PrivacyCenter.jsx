import React from 'react';
import { Lock, ShieldCheck, Trash2, AlertOctagon, CheckCircle2, EyeOff, Key } from 'lucide-react';
import { useCaseContext } from '../context/CaseContext';

export const PrivacyCenter = () => {
  const { showToast, setCases, refreshStatsAndCases } = useCaseContext();

  const handleClearSession = () => {
    localStorage.clear();
    sessionStorage.clear();
    showToast('Client session data cleared securely.');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Lock size={24} style={{ color: '#2563eb' }} />
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
            Privacy, Security & Responsible AI Center
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Legal documents contain highly sensitive personal and financial information. Understand how NyayaSahayak safeguards your privacy.
        </p>
      </div>

      {/* Core Privacy Guarantees Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderTop: '4px solid #059669' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '8px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <EyeOff size={18} />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Zero Data Mining</h4>
          </div>
          <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
            Your legal agreements, notices, and personal communications are never used to train public language models or shared with commercial entities.
          </p>
        </div>

        <div className="card" style={{ borderTop: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <Key size={18} />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>No Frontend API Key Exposure</h4>
          </div>
          <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
            All AI operations and document generation logic execute through backend microservice abstractions with strictly isolated environment variables.
          </p>
        </div>

        <div className="card" style={{ borderTop: '4px solid #d97706' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '8px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
              <ShieldCheck size={18} />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Anti-Hallucination Legal Guardrails</h4>
          </div>
          <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
            Statutory provisions and Act sections are strictly grounded in official gazettes and India Code to eliminate fabricated case laws or sections.
          </p>
        </div>
      </div>

      {/* AI Safety & Legal Disclaimer */}
      <div className="card" style={{ background: '#fffbeb', border: '1px solid #fde68a', marginBottom: '2rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <AlertOctagon size={22} style={{ color: '#d97706' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#92400e' }}>
            Statutory AI Disclaimer & Advocate Access
          </h3>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#78350f', lineHeight: 1.6, marginBottom: '0.75rem' }}>
          <strong>NyayaSahayak AI is a legal empowerment and documentation assistant, NOT a certified law firm or practicing advocate.</strong>
        </p>

        <ul style={{ fontSize: '0.84rem', color: '#78350f', lineHeight: 1.6, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <li>The platform does not guarantee litigation success or predict case win probabilities.</li>
          <li>All generated draft notices must be reviewed and signed by the complainant before postal dispatch.</li>
          <li>For high-risk civil and criminal disputes, citizens are routed directly to DLSA / State Legal Aid authorities or qualified advocates.</li>
        </ul>
      </div>

      {/* Data Management Controls */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '0.75rem' }}>
          Citizen Data Control
        </h3>
        <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '1.25rem' }}>
          You can wipe temporary browser cache, reset active sessions, or manage case data anytime.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleClearSession}>
            <Trash2 size={16} />
            <span>Clear Local Session Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
};
