import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCaseContext } from '../context/CaseContext';
import { PaymentModal } from '../components/PaymentModal';

export const LawyerSubscriptionPage = () => {
  const { currentUser } = useAuth();
  const { showToast } = useCaseContext();

  const [currentSub, setCurrentSub] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const subRes = await api.getCurrentSubscription();
      if (subRes.success && subRes.has_subscription) {
        setCurrentSub(subRes.subscription);
      }

      const plansRes = await api.getSubscriptionPlans();
      if (plansRes.success) {
        setPlans(plansRes.plans || []);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [currentUser]);

  const handlePlanSelect = (plan) => {
    setSelectedPlanForPayment(plan);
  };

  const handlePaymentSuccess = () => {
    setSelectedPlanForPayment(null);
    showToast("Subscription renewed successfully!");
    fetchSubscriptionData();
  };

  const isExpiringSoon = currentSub && currentSub.remaining_days <= 7;
  const isExpired = currentSub && currentSub.remaining_days <= 0;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
        border: '1px solid #3b82f6',
        borderRadius: '16px',
        padding: '1.75rem',
        marginBottom: '1.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(59, 130, 246, 0.2)', padding: '0.25rem 0.75rem', borderRadius: '9999px', color: '#93c5fd', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.6rem' }}>
          <Zap size={14} />
          <span>Advocate Practice Tier & Case Allocation Engine</span>
        </div>
        <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
          Lawyer Subscription Management
        </h2>
        <p style={{ margin: 0, fontSize: '0.86rem', color: '#cbd5e1', maxWidth: '650px', lineHeight: 1.5 }}>
          Maintain an active subscription tier to receive citizen dispute matches, priority category routing, and unlimited client consultation channels.
        </p>
      </div>

      {/* Active Subscription Status Banner */}
      {currentSub ? (
        <div className="card" style={{
          padding: '1.5rem',
          marginBottom: '1.5rem',
          border: isExpired ? '1px solid #ef4444' : (isExpiringSoon ? '1px solid #f59e0b' : '1px solid #10b981'),
          background: isExpired ? 'rgba(239, 68, 68, 0.08)' : (isExpiringSoon ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)')
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <span className="badge-sih" style={{
                  background: isExpired ? '#dc2626' : (isExpiringSoon ? '#d97706' : '#059669'),
                  color: '#fff',
                  fontWeight: 800
                }}>
                  {isExpired ? "🔴 EXPIRED" : (isExpiringSoon ? "⚠️ EXPIRING SOON" : "🟢 ACTIVE SUBSCRIPTION")}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                  {currentSub.plan_name} Tier
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                Valid: <strong>{currentSub.start_date}</strong> to <strong>{currentSub.end_date}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Remaining Period</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isExpired ? '#f87171' : (isExpiringSoon ? '#fbbf24' : '#34d399') }}>
                  {currentSub.remaining_days} Days
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => handlePlanSelect({
                  code: `LAWYER_${currentSub.plan_name}`,
                  name: `${currentSub.plan_name} Plan Renewal`,
                  price: currentSub.price || 999.0
                })}
                style={{ fontWeight: 800 }}
              >
                <RefreshCw size={15} />
                <span>Renew Now (₹{currentSub.price?.toFixed(2)})</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '1px dashed #3b82f6', background: 'rgba(59, 130, 246, 0.05)' }}>
          <h4 style={{ margin: '0 0 0.3rem', color: '#f8fafc' }}>No Active Subscription</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
            Choose a plan below to activate your account and start receiving citizen case requests.
          </p>
        </div>
      )}

      {/* Subscription Tiers Grid */}
      <h3 style={{ margin: '0 0 1rem', fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
        Available Subscription Tiers
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Basic Plan */}
        <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Starter</div>
            <h4 style={{ margin: '0.2rem 0', fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>BASIC</h4>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', margin: '0.5rem 0' }}>
              ₹499 <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>/ month</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '1rem' }}>
              Essential case notification feed for advocates starting private practice.
            </p>

            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Receive up to 10 case requests/mo</li>
              <li>Standard verified advocate badge</li>
              <li>Basic dispute analytics</li>
              <li>Secure client document viewing</li>
            </ul>
          </div>

          <button
            className="btn btn-secondary btn-block"
            onClick={() => handlePlanSelect({ code: 'LAWYER_BASIC', name: 'Basic Tier', price: 499.0 })}
            style={{ marginTop: '1.5rem', fontWeight: 700 }}
          >
            Select Basic Tier ➔
          </button>
        </div>

        {/* Pro Plan (Most Popular) */}
        <div className="card" style={{
          padding: '1.5rem',
          border: '2px solid #3b82f6',
          background: 'rgba(59, 130, 246, 0.08)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            right: '20px',
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            color: '#fff',
            padding: '0.2rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 800
          }}>
            MOST POPULAR
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: '#60a5fa', textTransform: 'uppercase', fontWeight: 700 }}>Recommended</div>
            <h4 style={{ margin: '0.2rem 0', fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>PRO TIER</h4>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', margin: '0.5rem 0' }}>
              ₹999 <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>/ 3 months</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '1rem' }}>
              Comprehensive case matching with priority geographic routing.
            </p>

            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Unlimited</strong> case match requests</li>
              <li>Priority geographic radius matching</li>
              <li>Enhanced profile & 4.9⭐ trust badge</li>
              <li>Direct client chat & document vault</li>
              <li>Advanced dispute resolution analytics</li>
            </ul>
          </div>

          <button
            className="btn btn-primary btn-block"
            onClick={() => handlePlanSelect({ code: 'LAWYER_PRO', name: 'Professional Tier', price: 999.0 })}
            style={{ marginTop: '1.5rem', fontWeight: 800 }}
          >
            Activate Pro Tier ➔
          </button>
        </div>

        {/* Premium Plan */}
        <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Chambers</div>
            <h4 style={{ margin: '0.2rem 0', fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>PREMIUM</h4>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', margin: '0.5rem 0' }}>
              ₹1999 <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>/ 6 months</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '1rem' }}>
              Maximum visibility and instant multi-category alert routing for senior counsel.
            </p>

            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Top-tier search placement</li>
              <li>Instant SMS & In-app case alerts</li>
              <li>Multi-category dispute matching</li>
              <li>Institutional & regulatory referrals</li>
              <li>6 months full platform access</li>
            </ul>
          </div>

          <button
            className="btn btn-secondary btn-block"
            onClick={() => handlePlanSelect({ code: 'LAWYER_PREMIUM', name: 'Premium Tier', price: 1999.0 })}
            style={{ marginTop: '1.5rem', fontWeight: 700 }}
          >
            Select Premium Tier ➔
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlanForPayment && (
        <PaymentModal
          isOpen={true}
          onClose={() => setSelectedPlanForPayment(null)}
          paymentData={{
            payment_type: 'subscription',
            amount: selectedPlanForPayment.price,
            plan_code: selectedPlanForPayment.code,
            title: selectedPlanForPayment.name,
            description: "Simulated lawyer subscription transaction processing."
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
