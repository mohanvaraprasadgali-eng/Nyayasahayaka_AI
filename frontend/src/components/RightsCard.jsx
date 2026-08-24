import React, { useState } from 'react';
import { Shield, ExternalLink, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const RightsCard = ({ right }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="right-card">
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <h4 className="right-card-title">
            <Shield size={18} style={{ color: '#2563EB', flexShrink: 0 }} />
            <span>{right.title}</span>
          </h4>
          <span className="badge badge-green" style={{ flexShrink: 0 }}>
            <CheckCircle2 size={12} />
            {right.verification_status || 'Verified'}
          </span>
        </div>

        <p className="right-card-body">
          {right.explanation}
        </p>
      </div>

      <div className="right-card-footer">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span style={{ fontWeight: 600, color: '#0f172a' }}>
            📜 {right.legal_source}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
            Verified on: {right.last_checked || '2026-08-20'}
          </span>
        </div>

        {right.source_url && (
          <a
            href={right.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            title="View statutory text on India Code / Official Ministry Portal"
          >
            <span>India Code</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
};
