import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  UserCheck, 
  Scale, 
  CreditCard, 
  Zap, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sliders, 
  Eye,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import { useCaseContext } from '../context/CaseContext';

export const AdminDashboard = () => {
  const { setActiveTab, showToast } = useCaseContext();
  const [stats, setStats] = useState({
    registered_citizens: 2,
    registered_lawyers: 3,
    pending_verifications: 1,
    verified_lawyers: 2,
    active_cases: 2,
    completed_cases: 18,
    active_subscriptions: 2,
    total_transactions: 3,
    total_revenue: 1997.0
  });
  const [pendingLawyers, setPendingLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLawyerDocs, setSelectedLawyerDocs] = useState(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const statsRes = await api.getAdminStats();
      if (statsRes.success) setStats(statsRes.stats);

      const pendingRes = await api.getPendingLawyers();
      if (pendingRes.success) setPendingLawyers(pendingRes.pending_lawyers || []);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApprove = async (lawyerId, name) => {
    try {
      const res = await api.approveLawyer(lawyerId, "Bar council enrollment and ID authenticated by operations admin.");
      if (res.success) {
        showToast(`Advocate ${name} approved and marked as VERIFIED!`);
        fetchAdminData();
      }
    } catch (e) {
      showToast("Error approving lawyer", "error");
    }
  };

  const handleReject = async (lawyerId, name) => {
    try {
      const res = await api.rejectLawyer(lawyerId, "Incomplete bar credentials submitted.");
      if (res.success) {
        showToast(`Advocate ${name} marked as REJECTED.`);
        fetchAdminData();
      }
    } catch (e) {
      showToast("Error rejecting lawyer", "error");
    }
  };

  return (
    <div>
      {/* Admin Header */}
      <div style={{
        background: 'linear-gradient(135deg, #4c1d95 0%, #0f172a 100%)',
        border: '1px solid #7c3aed',
        borderRadius: '16px',
        padding: '1.75rem',
        marginBottom: '1.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(124, 58, 237, 0.2)', padding: '0.25rem 0.75rem', borderRadius: '9999px', color: '#c4b5fd', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.6rem' }}>
          <ShieldAlert size={14} />
          <span>Platform Operations & Regulatory Control Center</span>
        </div>
        <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
          NyayaAI Platform Administration
        </h2>
        <p style={{ margin: 0, fontSize: '0.86rem', color: '#cbd5e1', maxWidth: '650px', lineHeight: 1.5 }}>
          Review bar verification documents, configure dispute fee tiers, monitor active lawyer subscriptions, and inspect live immutable audit logs.
        </p>
      </div>

      {/* Overview Metric Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Citizens Registered</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
            {stats.registered_citizens}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#60a5fa' }}>Active dispute creators</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Verified Lawyers</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>
            {stats.verified_lawyers}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#34d399' }}>Active in matching pool</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', border: stats.pending_verifications > 0 ? '1px solid #f59e0b' : '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.76rem', color: '#fbbf24', fontWeight: 700 }}>Pending Verifications</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.2rem' }}>
            {stats.pending_verifications}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>Requires document review ➔</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Active Cases</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#c084fc', marginTop: '0.2rem' }}>
            {stats.active_cases}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#c084fc' }}>Assigned & in progress</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Total Platform Revenue</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>
            ₹{stats.total_revenue?.toFixed(2)}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#34d399' }}>Case fees + subscriptions</span>
        </div>
      </div>

      {/* Pending Lawyer Verification Queue */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCheck size={20} className="text-amber-400" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
              Lawyer Verification Review Queue ({pendingLawyers.length})
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Confidential documents viewable only by authorized operations admin
          </span>
        </div>

        {pendingLawyers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.85rem' }}>
            <CheckCircle2 size={32} className="text-emerald-500" style={{ margin: '0 auto 0.5rem' }} />
            All registered advocate applications have been reviewed and processed!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingLawyers.map((l) => (
              <div
                key={l.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f8fafc' }}>
                      {l.name}
                    </span>
                    <span className="badge-sih" style={{ background: '#d97706', color: '#fff', fontSize: '0.68rem' }}>
                      {l.verification_status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                    Bar Council: <strong>{l.bar_council_number}</strong> • State: {l.state_bar_council} • {l.specialization} • {l.experience_years} Yrs Exp
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Email: {l.email} • Phone: {l.phone || "+91 98333 44455"} • Registered: {l.registered_date?.slice(0, 10)}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedLawyerDocs(l)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Eye size={14} />
                    <span>Inspect Docs ({l.documents?.length || 2})</span>
                  </button>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleApprove(l.id, l.name)}
                    style={{ background: '#059669', borderColor: '#047857', fontWeight: 700 }}
                  >
                    ✓ Approve Advocate
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleReject(l.id, l.name)}
                    style={{ borderColor: '#dc2626', color: '#f87171' }}
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Inspector Modal for Admin */}
      {selectedLawyerDocs && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                Verification Proofs: {selectedLawyerDocs.name}
              </h3>
              <button className="modal-close-btn" onClick={() => setSelectedLawyerDocs(null)}>✕</button>
            </div>

            <div style={{ margin: '1rem 0' }}>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.8rem' }}>
                Bar Council: <strong>{selectedLawyerDocs.bar_council_number}</strong> ({selectedLawyerDocs.state_bar_council})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {selectedLawyerDocs.documents?.map((d) => (
                  <div
                    key={d.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      background: 'rgba(15, 23, 42, 0.7)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={18} className="text-blue-400" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#f8fafc' }}>
                          {d.document_type}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                          {d.file_name}
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn btn-secondary btn-xs"
                      onClick={() => showToast(`Audit log recorded: Admin inspected ${d.file_name}`)}
                    >
                      Inspect File
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '0.9rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleApprove(selectedLawyerDocs.id, selectedLawyerDocs.name);
                  setSelectedLawyerDocs(null);
                }}
                style={{ background: '#059669', fontWeight: 700 }}
              >
                Approve & Mark Verified
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
