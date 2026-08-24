import React, { useState, useEffect } from 'react';
import {
  Compass,
  Building2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  FileText,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useCaseContext } from '../context/CaseContext';

// Official government domains — used to show Verified badge
const OFFICIAL_DOMAINS = ['.gov.in', '.nic.in', '.gov.in/', 'nalsa.gov.in', 'cybercrime.gov.in', 'consumerhelpline.gov.in', 'edaakhil.nic.in', 'rtionline.gov.in', 'doj.gov.in'];
const isOfficialDomain = (url) => !!url && OFFICIAL_DOMAINS.some(d => url.includes(d));

export const FindHelp = () => {
  const { setShowLegalAidModal } = useCaseContext();
  const [authorities, setAuthorities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const res = await api.getAuthorities(selectedCategory, selectedState);
        if (res.success && res.authorities) {
          setAuthorities(res.authorities);
        }
      } catch (e) {
        console.error('Fetch authorities error', e);
      }
    };
    fetchAuth();
  }, [selectedCategory, selectedState]);

  const categories = ['All', 'Legal Aid', 'Labour & Employment', 'Consumer Forum', 'Cyber Crime', 'Housing & Rent', 'RTI'];
  const states = ['All', 'Telangana', 'All India'];

  const filteredAuthorities = authorities.filter((auth) => {
    return auth.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           auth.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
           auth.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Compass size={24} style={{ color: '#2563eb' }} />
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
            Authority Finder & Legal Aid Directory
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Connect with official government dispute resolution authorities, labour commissioners, consumer commissions, cyber crime units, and DLSA legal aid clinics.
        </p>
      </div>

      {/* Free Legal Aid Banner (Section 12 NALSA) */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #065F46 0%, #047857 100%)',
        color: '#ffffff',
        marginBottom: '2rem',
        padding: '1.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ maxWidth: 650 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.2)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <ShieldCheck size={14} />
              <span>Section 12, Legal Services Authorities Act, 1987</span>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>
              Need a Free Advocate? Check Legal Aid Eligibility
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#d1fae5', lineHeight: 1.5 }}>
              Women, children, SC/ST citizens, disabled persons, and individuals with annual income below state limits are legally entitled to 100% free legal counsel and court representation.
            </p>
          </div>

          <button
            className="btn btn-gold btn-lg"
            onClick={() => setShowLegalAidModal(true)}
            style={{ flexShrink: 0 }}
          >
            <ShieldCheck size={18} />
            <span>Check Free Legal Aid Eligibility</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by authority name, purpose, or dispute type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Authorities Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {filteredAuthorities.map((auth) => (
          <div
            key={auth.id}
            className="card"
            style={{
              borderTop: auth.is_legal_aid ? '4px solid #059669' : '4px solid #2563EB',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className={`badge ${auth.is_legal_aid ? 'badge-green' : 'badge-blue'}`}>
                  {auth.category}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {auth.state} • {auth.district}
                </span>
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                {auth.name}
              </h4>

              <p style={{ fontSize: '0.86rem', color: '#334155', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                {auth.purpose}
              </p>

              {auth.eligibility && (
                <div style={{ background: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.78rem', color: '#475569', marginBottom: '0.75rem' }}>
                  <strong>Eligibility:</strong> {auth.eligibility}
                </div>
              )}

              {auth.documents_required && (
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  <strong>Required Documents:</strong> {auth.documents_required}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
              {auth.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f172a', fontWeight: 600 }}>
                  <Phone size={14} style={{ color: '#2563eb' }} />
                  <span>{auth.phone}</span>
                </div>
              )}

              {auth.address && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: '#64748b' }}>
                  <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{auth.address}</span>
                </div>
              )}

              {auth.website && (
                <div style={{ marginTop: '0.6rem' }}>
                  <a
                    href={auth.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline"
                    style={{ width: '100%', fontSize: '0.78rem' }}
                    onClick={(e) => {
                      if (!auth.website || auth.website === '#' || auth.website.includes('localhost')) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink size={12} />
                  </a>
                  {isOfficialDomain(auth.website) && (
                    <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700, marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <ShieldCheck size={11} />
                      ✓ Verified Official Source
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
