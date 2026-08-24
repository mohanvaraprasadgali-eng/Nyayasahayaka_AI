import React from 'react';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  FileQuestion, 
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Info
} from 'lucide-react';

export const MissingDocModal = ({ isOpen, onClose, documentRequirement, onMarkMissing }) => {
  if (!isOpen || !documentRequirement) return null;

  const {
    id,
    name,
    why_useful = "Provides key legal backing under Indian civil dispute standards.",
    alternatives_guidance = [
      "Bank transaction history highlighting the payment with UTR number",
      "WhatsApp or email correspondence acknowledging the dispute",
      "Utility bills or delivery slips linking you to the dispute address"
    ],
    how_to_obtain = "Download statement from net banking or request a digital copy from the other party."
  } = documentRequirement;

  const alternativesList = Array.isArray(alternatives_guidance) 
    ? alternatives_guidance 
    : (typeof alternatives_guidance === 'string' ? alternatives_guidance.split(', ') : []);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileQuestion size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                Don't Have Your {name}?
              </h3>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#94a3b8' }}>
                Alternative Evidence Guidance & Actionable Steps
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Responsible AI Disclaimer */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: '8px',
          padding: '0.75rem',
          margin: '0.9rem 0',
          fontSize: '0.79rem',
          color: '#93c5fd',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'flex-start'
        }}>
          <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Legal Note:</strong> Alternative documents help provide supporting context, but a qualified advocate or tribunal will confirm what evidence is admissible under statutory rules.
          </span>
        </div>

        {/* Why this document is useful */}
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.9rem', color: '#f8fafc', fontWeight: 700 }}>
            📌 Why is this document important?
          </h4>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5, background: 'rgba(15, 23, 42, 0.5)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            {why_useful}
          </p>
        </div>

        {/* Alternative Supporting Evidence */}
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.9rem', color: '#34d399', fontWeight: 700 }}>
            💡 Admissible Supporting Alternatives:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.84rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {alternativesList.map((alt, idx) => (
              <li key={idx} style={{ lineHeight: 1.4 }}>{alt}</li>
            ))}
          </ul>
        </div>

        {/* How to Obtain */}
        {how_to_obtain && (
          <div style={{ marginBottom: '1.2rem' }}>
            <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.9rem', color: '#f59e0b', fontWeight: 700 }}>
              🔍 How can you retrieve or request a copy?
            </h4>
            <p style={{ margin: 0, fontSize: '0.83rem', color: '#e2e8f0', background: 'rgba(30, 41, 59, 0.5)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              {how_to_obtain}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '0.9rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => {
              onMarkMissing(id);
              onClose();
            }}
            style={{ background: 'linear-gradient(135deg, #d97706, #b45309)', color: '#fff', fontWeight: 700 }}
          >
            Mark as "Missing" & Continue with Alternatives ➔
          </button>
        </div>
      </div>
    </div>
  );
};
