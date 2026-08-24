import React, { useState } from 'react';
import { BookOpen, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LegalSourceCard = ({ source }) => {
  const { t } = useLanguage();
  const [linkError, setLinkError] = useState(false);
  const isVerified = source.verification_status === 'Verified';

  const handleLinkClick = (e, url) => {
    if (!url || url === '#' || url.startsWith('localhost') || url.startsWith('http://localhost')) {
      e.preventDefault();
      setLinkError(true);
      return;
    }
    // Valid external link — open in new tab (already set via target)
    setLinkError(false);
  };

  return (
    <div className="card" style={{ marginBottom: '1rem', borderLeft: isVerified ? '4px solid #2563EB' : '4px solid #f59e0b' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            {source.act_name} {source.section && `• ${source.section}`}
          </span>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginTop: '0.15rem' }}>
            {source.title}
          </h4>
        </div>

        <span className={`badge ${isVerified ? 'badge-green' : 'badge-yellow'}`}>
          {isVerified ? <ShieldCheck size={13} /> : <AlertTriangle size={13} />}
          {isVerified ? '✓ Verified Official Source' : source.verification_status}
        </span>
      </div>

      <p style={{ fontSize: '0.88rem', color: '#334155', marginBottom: '0.75rem' }}>
        {source.description}
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.75rem',
        borderTop: '1px solid #f1f5f9',
        fontSize: '0.8rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ color: '#64748b' }}>
          <span>Source: <strong>{source.official_source}</strong></span>
          <span style={{ marginLeft: '0.75rem' }}>Checked: {source.last_checked}</span>
        </div>

        {source.source_url && source.source_url !== '#' && !source.source_url.startsWith('localhost') ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-end' }}>
            <a
              href={source.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.75rem' }}
              onClick={(e) => handleLinkClick(e, source.source_url)}
            >
              <span>Visit Official Portal</span>
              <ExternalLink size={12} />
            </a>
            {isVerified && (
              <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <ShieldCheck size={11} />
                Official Government Source (.gov.in / .nic.in)
              </span>
            )}
            {linkError && (
              <span style={{ fontSize: '0.72rem', color: '#dc2626' }}>
                Official website is currently unavailable. Please try again later.
              </span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
