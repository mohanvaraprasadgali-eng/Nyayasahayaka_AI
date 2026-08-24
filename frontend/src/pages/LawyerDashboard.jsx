import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  ClipboardList, 
  UserCheck, 
  Zap, 
  CreditCard, 
  Scale, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  FolderLock,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCaseContext } from '../context/CaseContext';

export const LawyerDashboard = () => {
  const { currentUser } = useAuth();
  const { setActiveTab, showToast } = useCaseContext();
  const [stats, setStats] = useState({
    verification_status: 'VERIFIED',
    is_verified: true,
    rating: 4.9,
    subscription_status: 'ACTIVE',
    subscription_plan: 'PRO',
    remaining_days: 78,
    new_case_requests_count: 3,
    accepted_cases_count: 7,
    active_cases_count: 4,
    completed_cases_count: 18,
    case_categories: ["Rental / Housing", "Employment & Labour", "Consumer Rights", "Civil & Property", "Cybercrime"]
  });

  const fetchStats = async () => {
    try {
      const res = await api.getLawyerStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (e) {
      console.warn("Failed to fetch lawyer stats:", e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [currentUser]);

  const isExpiringSoon = stats.remaining_days <= 7;

  return (
    <div>
      {/* Lawyer Header Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #0f172a 100%)',
        border: '1px solid #10b981',
        borderRadius: '16px',
        padding: '1.75rem',
        marginBottom: '1.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{
                background: stats.is_verified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: stats.is_verified ? '#34d399' : '#fbbf24',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid currentColor',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                {stats.is_verified ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                <span>{stats.is_verified ? "Official Bar Verified Advocate" : `Status: ${stats.verification_status}`}</span>
              </span>

              <span style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#93c5fd',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid rgba(59, 130, 246, 0.4)'
              }}>
                ⭐ {stats.rating} Rating (42 Disputes Handled)
              </span>
            </div>

            <h2 style={{ margin: '0 0 0.3rem', fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
              Welcome, {currentUser?.name || "Advocate Priya Sharma"}
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
              Practice Jurisdiction: {currentUser?.city || "Hyderabad"}, {currentUser?.state || "Telangana"} • Bar Council: TS/1402/2016
            </p>
          </div>

          {/* Subscription Status Pill */}
          <div style={{
            background: isExpiringSoon ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: isExpiringSoon ? '1px solid #ef4444' : '1px solid #10b981',
            borderRadius: '12px',
            padding: '0.85rem 1.25rem',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600 }}>
              Subscription Tier: <strong style={{ color: '#fff' }}>{stats.subscription_plan}</strong>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: isExpiringSoon ? '#f87171' : '#34d399', margin: '0.2rem 0' }}>
              {stats.remaining_days} Days Left
            </div>
            <button
              className="btn btn-secondary btn-xs"
              onClick={() => setActiveTab('lawyer_subscription')}
              style={{ fontSize: '0.72rem', borderColor: isExpiringSoon ? '#ef4444' : '#10b981', color: isExpiringSoon ? '#f87171' : '#34d399' }}
            >
              <Zap size={12} />
              <span>{isExpiringSoon ? "Renew Now" : "Manage Tier"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Expiry Warning Banner if <= 7 days */}
      {isExpiringSoon && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          borderRadius: '10px',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle size={20} className="text-red-500" />
            <span style={{ fontSize: '0.86rem', color: '#f87171', fontWeight: 600 }}>
              ⚠️ Your subscription expires in {stats.remaining_days} days. Renew to maintain uninterrupted case matching.
            </span>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActiveTab('lawyer_subscription')}
            style={{ background: '#dc2626', borderColor: '#b91c1c' }}
          >
            Renew Subscription
          </button>
        </div>
      )}

      {/* Metric Counters Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', cursor: 'pointer' }} onClick={() => setActiveTab('lawyer_requests')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>New Case Requests</span>
            <ClipboardList size={18} className="text-blue-400" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>
            {stats.new_case_requests_count}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#60a5fa' }}>Available in matching pool ➔</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', cursor: 'pointer' }} onClick={() => setActiveTab('lawyer_active_cases')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Active Cases</span>
            <Briefcase size={18} className="text-emerald-400" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399' }}>
            {stats.active_cases_count}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#34d399' }}>Client consultation active ➔</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', cursor: 'pointer' }} onClick={() => setActiveTab('lawyer_active_cases')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Accepted Inquiries</span>
            <Scale size={18} className="text-amber-400" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24' }}>
            {stats.accepted_cases_count}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#fbbf24' }}>Total accepted on platform</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Completed Cases</span>
            <CheckCircle2 size={18} className="text-purple-400" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#c084fc' }}>
            {stats.completed_cases_count}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#c084fc' }}>Resolved & closed</span>
        </div>
      </div>

      {/* Quick Action Rows */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Case Requests Teaser */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardList size={18} className="text-blue-400" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                Incoming Case Opportunities
              </h3>
            </div>
            <button
              className="btn btn-secondary btn-xs"
              onClick={() => setActiveTab('lawyer_requests')}
            >
              View Feed ➔
            </button>
          </div>

          <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1rem' }}>
            Anonymized dispute requests matching your practice area (Tenancy, Wage Claims, Consumer Protection). Review case complexity, location, and fee before accepting.
          </div>

          <button
            className="btn btn-primary btn-block"
            onClick={() => setActiveTab('lawyer_requests')}
            style={{ fontWeight: 700 }}
          >
            Inspect Case Requests ({stats.new_case_requests_count}) ➔
          </button>
        </div>

        {/* Private Documents & Chat */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FolderLock size={18} className="text-emerald-400" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                Secure Client Workspace
              </h3>
            </div>
            <button
              className="btn btn-secondary btn-xs"
              onClick={() => setActiveTab('lawyer_active_cases')}
            >
              Active Cases ➔
            </button>
          </div>

          <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1rem' }}>
            Access private citizen agreements, evidence checklists, bank transaction proofs, and encrypted consultation channels for your accepted cases.
          </div>

          <button
            className="btn btn-secondary btn-block"
            onClick={() => setActiveTab('lawyer_active_cases')}
            style={{ fontWeight: 700, borderColor: '#10b981', color: '#34d399' }}
          >
            Open Active Cases Workspace ➔
          </button>
        </div>
      </div>
    </div>
  );
};
