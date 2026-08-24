import React from 'react';
import { AlertTriangle, Info, AlertOctagon, ShieldAlert } from 'lucide-react';
import { useCaseContext } from '../context/CaseContext';

export const RiskBadge = ({ level = 'yellow', reasoning = '', disclaimer = '' }) => {
  const { setShowLegalAidModal, setActiveTab } = useCaseContext();

  const levelConfigs = {
    green: {
      badgeClass: 'badge-green',
      icon: Info,
      title: '🟢 General Legal Information',
      description: 'Standard civil or consumer procedure with established administrative remedies.'
    },
    yellow: {
      badgeClass: 'badge-yellow',
      icon: AlertTriangle,
      title: '🟡 Professional Guidance Recommended',
      description: 'Procedural timelines or documentation requirements make advocate review advisable.'
    },
    red: {
      badgeClass: 'badge-red',
      icon: AlertOctagon,
      title: '🔴 Urgent Professional Legal Help Recommended',
      description: 'Time-critical situation involving significant legal or financial consequences. Prompt action needed.'
    }
  };

  const config = levelConfigs[level] || levelConfigs.yellow;
  const Icon = config.icon;

  return (
    <div className="card" style={{
      borderLeft: `4px solid ${level === 'green' ? '#059669' : (level === 'yellow' ? '#d97706' : '#dc2626')}`,
      background: level === 'green' ? '#f0fdf4' : (level === 'yellow' ? '#fffbeb' : '#fef2f2')
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
            Legal Assistance Level
          </span>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.2rem', color: '#0f172a' }}>
            {config.title}
          </h4>
        </div>
        <span className={`badge ${config.badgeClass}`}>
          <Icon size={14} />
          {level.toUpperCase()}
        </span>
      </div>

      <p style={{ fontSize: '0.88rem', color: '#334155', marginBottom: '0.85rem' }}>
        {reasoning || config.description}
      </p>

      <div style={{
        fontSize: '0.78rem',
        color: '#64748b',
        background: 'rgba(255, 255, 255, 0.7)',
        padding: '0.6rem 0.85rem',
        borderRadius: '6px',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        marginBottom: '0.75rem'
      }}>
        <strong>Note:</strong> {disclaimer || "AI-generated information does not predict case outcomes or replace advice from a qualified advocate."}
      </div>

      {level !== 'green' && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setActiveTab('find_help')}
          >
            Find Relevant Authority
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setShowLegalAidModal(true)}
          >
            <ShieldAlert size={14} />
            Free Legal Aid Checker
          </button>
        </div>
      )}
    </div>
  );
};
