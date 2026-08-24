import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Receipt, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  Lock, 
  Clock,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCaseContext } from '../context/CaseContext';

export const CitizenPaymentsPage = () => {
  const { currentUser } = useAuth();
  const { showToast } = useCaseContext();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.getPaymentHistory();
      if (res.success) {
        setPayments(res.payments || []);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentUser]);

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
              Payments & Transaction Receipts
            </h2>
            <span className="badge-sih">{payments.length} Transactions</span>
          </div>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: '#94a3b8' }}>
            Official transaction ledger for case platform fees, consultation services, and subscriptions.
          </p>
        </div>
      </div>

      {/* Prototype Payment Simulation Disclaimer Banner */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '10px',
        padding: '0.85rem 1.25rem',
        marginBottom: '1.25rem',
        fontSize: '0.82rem',
        color: '#fbbf24'
      }}>
        ⚠️ <strong>Prototype Payment Simulation Notice:</strong> All listed transactions are generated via mock payment simulation. No actual credit card or bank funds are processed in this SIH prototype.
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading transaction records...</div>
      ) : payments.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <CreditCard size={44} style={{ color: '#64748b', margin: '0 auto 1rem' }} />
          <h4 style={{ margin: '0 0 0.4rem', color: '#f8fafc' }}>No transactions recorded</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Your consultation fee payments and receipts will appear here.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-color)', color: '#94a3b8' }}>
                <th style={{ padding: '0.9rem 1rem' }}>Transaction Ref</th>
                <th style={{ padding: '0.9rem 1rem' }}>Dispute / Purpose</th>
                <th style={{ padding: '0.9rem 1rem' }}>Amount</th>
                <th style={{ padding: '0.9rem 1rem' }}>Payment Mode</th>
                <th style={{ padding: '0.9rem 1rem' }}>Status</th>
                <th style={{ padding: '0.9rem 1rem' }}>Date</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: '#38bdf8' }}>
                    {p.transaction_ref}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', color: '#f8fafc' }}>
                    {p.case_title || (p.payment_type === 'subscription' ? 'Lawyer Subscription Renewal' : 'Legal Case Consultation')}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 800, color: '#34d399' }}>
                    ₹{p.amount?.toFixed(2)}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', color: '#cbd5e1' }}>
                    {p.payment_method}
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span className="badge-sih" style={{ background: '#059669', color: '#fff', fontSize: '0.7rem' }}>
                      ✓ {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', color: '#94a3b8' }}>
                    {p.created_at?.slice(0, 16)}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-xs"
                      onClick={() => {
                        setSelectedReceipt(p);
                        showToast(`Viewing receipt for ${p.transaction_ref}`);
                      }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Receipt size={13} />
                      <span>View Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Platform Transaction Receipt</h3>
              <button className="modal-close-btn" onClick={() => setSelectedReceipt(null)}>✕</button>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '1.25rem',
              margin: '1rem 0',
              fontSize: '0.84rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <div style={{ textAlign: 'center', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, color: '#f8fafc', fontWeight: 800 }}>NyayaAI Legal Gateway</h4>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Ministry of Law & Justice SIH Prototype</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Receipt Ref:</span>
                <strong style={{ color: '#38bdf8' }}>{selectedReceipt.transaction_ref}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Payer:</span>
                <span>{selectedReceipt.payer_name || currentUser?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Dispute / Purpose:</span>
                <span style={{ maxWidth: '240px', textAlign: 'right' }}>{selectedReceipt.case_title || "Case Consultation"}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Amount:</span>
                <strong style={{ color: '#34d399', fontSize: '1.1rem' }}>₹{selectedReceipt.amount?.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Payment Method:</span>
                <span>{selectedReceipt.payment_method}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Date:</span>
                <span>{selectedReceipt.created_at?.slice(0, 16)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Status:</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>PAID (Verified)</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-block"
              onClick={() => setSelectedReceipt(null)}
              style={{ fontWeight: 700 }}
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
