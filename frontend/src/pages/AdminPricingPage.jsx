import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  CreditCard, 
  Zap, 
  CheckCircle2, 
  Save, 
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { useCaseContext } from '../context/CaseContext';

export const AdminPricingPage = () => {
  const { showToast } = useCaseContext();
  const [casePlans, setCasePlans] = useState([]);
  const [subPlans, setSubPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const res = await api.getPricingPlans();
      if (res.success) {
        setCasePlans(res.case_plans || []);
        setSubPlans(res.subscription_plans || []);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const handleSavePlan = async (planId) => {
    try {
      const res = await api.updatePricingPlan(planId, parseFloat(editPrice), editDesc);
      if (res.success) {
        showToast("Pricing plan updated successfully!");
        setEditingId(null);
        fetchPricing();
      }
    } catch (e) {
      showToast("Error updating pricing", "error");
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
        border: '1px solid #3b82f6',
        borderRadius: '16px',
        padding: '1.75rem',
        marginBottom: '1.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(59, 130, 246, 0.2)', padding: '0.25rem 0.75rem', borderRadius: '9999px', color: '#93c5fd', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.6rem' }}>
          <Sliders size={14} />
          <span>Configurable Platform Pricing Architecture</span>
        </div>
        <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
          Platform Fee & Subscription Configuration
        </h2>
        <p style={{ margin: 0, fontSize: '0.86rem', color: '#cbd5e1', maxWidth: '650px', lineHeight: 1.5 }}>
          Modify citizen case consultation tiers based on AI complexity estimates and configure advocate subscription pricing.
        </p>
      </div>

      {/* Case Fee Tiers */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <CreditCard size={20} className="text-blue-400" />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
            Citizen Case Consultation Fee Tiers
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {casePlans.map((plan) => {
            const isEditing = editingId === plan.id;
            return (
              <div
                key={plan.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: isEditing ? '2px solid #3b82f6' : '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f8fafc' }}>
                      {plan.name}
                    </span>
                    <span className="badge-sih">{plan.code}</span>
                  </div>

                  {isEditing ? (
                    <input
                      type="text"
                      className="form-input"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      style={{ fontSize: '0.84rem', marginTop: '0.4rem' }}
                    />
                  ) : (
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                      {plan.description}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ color: '#38bdf8', fontWeight: 800 }}>₹</span>
                      <input
                        type="number"
                        className="form-input"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        style={{ width: '100px', fontWeight: 800, fontSize: '1.1rem' }}
                      />
                    </div>
                  ) : (
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>
                      ₹{plan.price?.toFixed(2)}
                    </div>
                  )}

                  {isEditing ? (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleSavePlan(plan.id)}>
                        <Save size={14} />
                        <span>Save</span>
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setEditingId(plan.id);
                        setEditPrice(plan.price);
                        setEditDesc(plan.description);
                      }}
                    >
                      Edit Fee
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lawyer Subscription Tiers */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Zap size={20} className="text-amber-400" />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
            Advocate Subscription Tier Rates
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {subPlans.map((plan) => {
            const isEditing = editingId === plan.id;
            return (
              <div
                key={plan.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: isEditing ? '2px solid #f59e0b' : '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f8fafc' }}>
                      {plan.name}
                    </span>
                    <span className="badge-sih" style={{ background: '#d97706', color: '#fff' }}>{plan.code}</span>
                  </div>

                  {isEditing ? (
                    <input
                      type="text"
                      className="form-input"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      style={{ fontSize: '0.84rem', marginTop: '0.4rem' }}
                    />
                  ) : (
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                      {plan.description}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ color: '#38bdf8', fontWeight: 800 }}>₹</span>
                      <input
                        type="number"
                        className="form-input"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        style={{ width: '100px', fontWeight: 800, fontSize: '1.1rem' }}
                      />
                    </div>
                  ) : (
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>
                      ₹{plan.price?.toFixed(2)}
                    </div>
                  )}

                  {isEditing ? (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleSavePlan(plan.id)}>
                        <Save size={14} />
                        <span>Save</span>
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setEditingId(plan.id);
                        setEditPrice(plan.price);
                        setEditDesc(plan.description);
                      }}
                    >
                      Edit Rate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
