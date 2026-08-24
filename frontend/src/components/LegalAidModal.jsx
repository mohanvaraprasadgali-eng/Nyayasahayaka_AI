import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle, AlertCircle, Phone, Building2, HelpCircle } from 'lucide-react';
import { api } from '../services/api';
import { useCaseContext } from '../context/CaseContext';

export const LegalAidModal = () => {
  const { showLegalAidModal, setShowLegalAidModal, setActiveTab } = useCaseContext();
  const [formData, setFormData] = useState({
    gender: 'male',
    category: 'general',
    annual_income: '200000',
    is_disabled: false,
    is_custody: false,
    is_industrial_workman: false,
    is_disaster_victim: false,
    state: 'Telangana'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!showLegalAidModal) return null;

  const handleEvaluate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.checkLegalAidEligibility({
        ...formData,
        annual_income: parseFloat(formData.annual_income || 0)
      });
      if (res.success) {
        setResult(res);
      }
    } catch (err) {
      console.error('Legal aid check error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowLegalAidModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                NALSA Free Legal Aid Screener
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Section 12, Legal Services Authorities Act, 1987
              </span>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon-only" onClick={() => setShowLegalAidModal(false)}>
            <X size={18} />
          </button>
        </div>

        {!result ? (
          <form onSubmit={handleEvaluate}>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem' }}>
              Under Indian law, eligible citizens are entitled to <strong>100% free legal representation</strong>, court fee exemptions, and advocate assignment funded by the Government through DLSA.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female (Women have 100% Free Aid)</option>
                  <option value="transgender">Transgender</option>
                </select>
              </div>

              <div>
                <label className="form-label">Social Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="sc">Scheduled Caste (SC)</option>
                  <option value="st">Scheduled Tribe (ST)</option>
                  <option value="obc">OBC</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Annual Family Income (INR)</label>
              <input
                type="number"
                className="form-input"
                value={formData.annual_income}
                onChange={(e) => setFormData({ ...formData, annual_income: e.target.value })}
                placeholder="e.g. 200000"
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Statutory limit for free aid in most states is ₹3,00,000 / year.
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '0.85rem', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.is_disabled}
                  onChange={(e) => setFormData({ ...formData, is_disabled: e.target.checked })}
                />
                Person with Disability (under RPwD Act 2016)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.is_industrial_workman}
                  onChange={(e) => setFormData({ ...formData, is_industrial_workman: e.target.checked })}
                />
                Industrial Workman / Factory Labourer
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.is_disaster_victim}
                  onChange={(e) => setFormData({ ...formData, is_disaster_victim: e.target.checked })}
                />
                Victim of Flood, Mass Disaster, or Ethnic Violence
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowLegalAidModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Checking Criteria...' : 'Check My Eligibility'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{
              padding: '1.25rem',
              borderRadius: '10px',
              background: result.eligible ? '#ecfdf5' : '#fffbeb',
              border: `1px solid ${result.eligible ? '#a7f3d0' : '#fde68a'}`,
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {result.eligible ? (
                  <CheckCircle size={22} style={{ color: '#059669' }} />
                ) : (
                  <AlertCircle size={22} style={{ color: '#d97706' }} />
                )}
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: result.eligible ? '#065f46' : '#92400e' }}>
                  {result.eligible ? 'You Qualify for 100% Free Legal Aid' : 'Income Above Free Threshold'}
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#334155' }}>
                {result.reasons.map((r, i) => (
                  <div key={i}>• {r}</div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
                How to claim your free legal aid:
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: '#475569' }}>
                {result.next_steps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 700, color: '#2563eb' }}>{i + 1}.</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f1f5f9',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={18} style={{ color: '#2563eb' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>National Legal Aid Helpline: <strong>15100</strong> (Toll Free 24x7)</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setResult(null)}
              >
                Re-check Criteria
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setShowLegalAidModal(false);
                  setActiveTab('find_help');
                }}
              >
                <Building2 size={14} />
                Find My District DLSA Office
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
