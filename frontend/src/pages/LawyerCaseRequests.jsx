import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Lock, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle,
  ArrowRight,
  EyeOff
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCaseContext } from '../context/CaseContext';

export const LawyerCaseRequests = () => {
  const { currentUser } = useAuth();
  const { showToast, setActiveTab, setCurrentCaseId } = useCaseContext();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(true);
  const [subExpired, setSubExpired] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.getLawyerCaseRequests();
      if (res.success) {
        setRequests(res.case_requests || []);
        setIsVerified(res.is_verified);
        setSubExpired(!!res.subscription_expired);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentUser]);

  const handleAccept = async (caseId) => {
    setAcceptingId(caseId);
    try {
      const res = await api.acceptCase(caseId);
      setAcceptingId(null);
      if (res.success) {
        showToast(`Case #${caseId} accepted! Private documents vault and client consultation unlocked.`);
        setCurrentCaseId(caseId);
        setActiveTab('lawyer_active_cases');
      } else {
        showToast(res.error || "Failed to accept case", "error");
      }
    } catch (e) {
      setAcceptingId(null);
      showToast("Error accepting case", "error");
    }
  };

  const handleDecline = async (caseId) => {
    try {
      await api.declineCase(caseId);
      showToast(`Case #${caseId} declined. Removed from your feed.`);
      setRequests(prev => prev.filter(r => r.id !== caseId));
    } catch (e) {}
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
              Incoming Case Opportunities
            </h2>
            <span className="badge-sih">{requests.length} Available</span>
          </div>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: '#94a3b8' }}>
            Dispute inquiries matched to your legal domain and practice jurisdiction.
          </p>
        </div>
      </div>

      {/* Strict Privacy Guarantee Banner */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid #3b82f6',
        borderRadius: '10px',
        padding: '1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem'
      }}>
        <EyeOff size={24} className="text-blue-400" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.45 }}>
          <strong style={{ color: '#60a5fa' }}>Pre-Acceptance Anonymization:</strong> Citizen identity, contact numbers, and sensitive evidence files remain strictly locked until you officially accept the case assignment.
        </div>
      </div>

      {/* Verification / Subscription Warning */}
      {!isVerified && (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', border: '1px dashed #f59e0b', background: 'rgba(245, 158, 11, 0.05)', marginBottom: '1.5rem' }}>
          <AlertTriangle size={40} style={{ color: '#f59e0b', margin: '0 auto 0.75rem' }} />
          <h3 style={{ color: '#f8fafc', margin: '0 0 0.4rem' }}>Account Verification Required</h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', maxWidth: '500px', margin: '0 auto 1rem' }}>
            Your advocate account is currently pending administrative review. You will receive citizen case requests as soon as your bar credentials are authenticated.
          </p>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('lawyer_profile')}>
            Check Verification Status ➔
          </button>
        </div>
      )}

      {subExpired && (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', border: '1px dashed #ef4444', background: 'rgba(239, 68, 68, 0.05)', marginBottom: '1.5rem' }}>
          <AlertTriangle size={40} style={{ color: '#ef4444', margin: '0 auto 0.75rem' }} />
          <h3 style={{ color: '#f8fafc', margin: '0 0 0.4rem' }}>Subscription Expired</h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', maxWidth: '500px', margin: '0 auto 1rem' }}>
            Your lawyer subscription has expired. Please renew your subscription to unlock new citizen case opportunities.
          </p>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('lawyer_subscription')}>
            Renew Subscription Now ➔
          </button>
        </div>
      )}

      {/* Case Requests List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading case requests...</div>
      ) : requests.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <ClipboardList size={44} style={{ color: '#64748b', margin: '0 auto 1rem' }} />
          <h4 style={{ margin: '0 0 0.4rem', color: '#f8fafc' }}>No matching case requests currently</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>You will receive real-time notifications when new citizen disputes are filed in your jurisdiction.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.map((req) => (
            <div
              key={req.id}
              className="card"
              style={{
                padding: '1.5rem',
                border: '1px solid var(--border-color)',
                background: 'rgba(30, 41, 59, 0.5)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '0.8rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>
                      {req.case_code}
                    </span>
                    <span className="badge-sih">{req.category}</span>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: req.complexity === 'COMPLEX' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: req.complexity === 'COMPLEX' ? '#f87171' : '#fbbf24',
                      border: '1px solid currentColor'
                    }}>
                      Complexity: {req.complexity}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                    {req.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                    <MapPin size={14} className="text-blue-400" />
                    <span>{req.location_display}</span>
                    <span>•</span>
                    <Clock size={14} className="text-amber-400" />
                    <span>Urgency: {req.urgency}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Consultation / Platform Fee</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
                    ₹{req.platform_fee?.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Anonymized Description */}
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, background: 'rgba(15, 23, 42, 0.5)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', margin: '0 0 1rem' }}>
                {req.short_description}
              </p>

              {/* Privacy Footer & Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.9rem' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Lock size={12} className="text-amber-400" />
                  <span>{req.privacy_notice}</span>
                </span>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleDecline(req.id)}
                  >
                    <XCircle size={14} />
                    <span>Decline</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={acceptingId === req.id}
                    onClick={() => handleAccept(req.id)}
                    style={{ fontWeight: 800, background: 'linear-gradient(135deg, #10b981, #059669)' }}
                  >
                    <CheckCircle2 size={15} />
                    <span>{acceptingId === req.id ? "Accepting..." : "Accept Case Assignment ➔"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
