import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  FileText, 
  Smartphone, 
  ArrowRight,
  Download,
  Lock
} from 'lucide-react';
import { api } from '../services/api';
import { useCaseContext } from '../context/CaseContext';

export const PaymentModal = ({ isOpen, onClose, paymentData, onSuccess }) => {
  const { showToast } = useCaseContext();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Mock UPI Simulation (Google Pay / PhonePe)');
  const [completedReceipt, setCompletedReceipt] = useState(null);

  if (!isOpen) return null;

  const {
    payment_type = 'case_fee', // 'case_fee' or 'subscription'
    amount = 499.0,
    case_id = null,
    plan_code = 'CASE_MODERATE',
    title = 'Case Consultation & Advocate Routing Fee',
    description = 'Covers AI legal verification, missing document assistance, and priority advocate matching.'
  } = paymentData || {};

  const handleSimulatePayment = async () => {
    setLoading(true);
    try {
      const res = await api.processMockPayment(payment_type, amount, case_id, plan_code, paymentMethod);
      setLoading(false);
      if (res.success) {
        setCompletedReceipt(res.receipt);
        showToast("Payment simulation completed successfully!");
        if (onSuccess) onSuccess(res);
      } else {
        showToast(res.error || "Payment failed", "error");
      }
    } catch (e) {
      setLoading(false);
      showToast("Error processing payment", "error");
    }
  };

  const handleClose = () => {
    setCompletedReceipt(null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #10B981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <CreditCard size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                {completedReceipt ? "Payment Successful" : "Prototype Payment Simulation"}
              </h3>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#94a3b8' }}>
                Secure Case Consultation & Platform Routing Gateway
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Prototype Banner Disclaimer */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '8px',
          padding: '0.75rem',
          margin: '0.9rem 0',
          fontSize: '0.8rem',
          color: '#fbbf24',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span>
            <strong>Prototype Payment Simulation:</strong> No real bank charge or credit card deduction will occur. This simulates instant platform transaction processing for hackathon evaluation.
          </span>
        </div>

        {!completedReceipt ? (
          <div>
            {/* Payment Summary Box */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>{title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>{description}</div>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
                  ₹{amount.toFixed(2)}
                </div>
              </div>

              <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.6rem', marginTop: '0.6rem', fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
                <span>AI Complexity Classification:</span>
                <span style={{ fontWeight: 700, color: '#34d399' }}>Verified Tier ({plan_code})</span>
              </div>
            </div>

            {/* Simulated Payment Methods */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem', color: '#cbd5e1' }}>
                Select Simulated Payment Mode
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  "Mock UPI Simulation (Google Pay / PhonePe)",
                  "Mock Credit / Debit Card Gateway",
                  "Mock NetBanking Simulation (HDFC / SBI / ICICI)"
                ].map((mode) => (
                  <label
                    key={mode}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: paymentMethod === mode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                      border: paymentMethod === mode ? '1px solid #3b82f6' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      fontSize: '0.84rem'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={mode}
                      checked={paymentMethod === mode}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={handleSimulatePayment}
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', fontWeight: 700 }}
            >
              <Lock size={16} />
              <span>{loading ? "Processing Simulation..." : `Pay ₹${amount.toFixed(2)} (Demo Simulation)`}</span>
            </button>
          </div>
        ) : (
          /* Completed Receipt View */
          <div>
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                Payment Successful!
              </h4>
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                Ref: {completedReceipt.transaction_ref}
              </p>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '1rem',
              fontSize: '0.84rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              marginBottom: '1.2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Amount Paid:</span>
                <span style={{ fontWeight: 800, color: '#38bdf8' }}>{completedReceipt.amount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Payment Method:</span>
                <span>{completedReceipt.payment_method}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Payer:</span>
                <span>{completedReceipt.payer_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Timestamp:</span>
                <span>{completedReceipt.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Status:</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>VERIFIED & CONFIRMED</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-block"
              onClick={handleClose}
              style={{ fontWeight: 700 }}
            >
              Continue to Case Workspace ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
