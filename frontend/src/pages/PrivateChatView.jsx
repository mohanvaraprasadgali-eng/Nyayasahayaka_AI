import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Lock, 
  ShieldCheck, 
  Paperclip, 
  CheckCheck, 
  User, 
  FileText,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCaseContext } from '../context/CaseContext';

export const PrivateChatView = ({ caseId, caseTitle, partnerName, partnerRole, onClose }) => {
  const { currentUser } = useAuth();
  const { showToast } = useCaseContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!caseId) return;
    try {
      const res = await api.getCaseMessages(caseId);
      if (res.success) {
        setMessages(res.messages);
      }
    } catch (e) {
      console.warn("Error fetching chat messages:", e);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [caseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const textToSend = newMessage.trim();
    setNewMessage('');
    setLoading(true);

    try {
      const res = await api.sendCaseMessage(caseId, textToSend);
      setLoading(false);
      if (res.success) {
        fetchMessages();
      } else {
        showToast(res.error || "Failed to send message", "error");
      }
    } catch (e) {
      setLoading(false);
      showToast("Error sending message", "error");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px', height: '80vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        {/* Chat Header */}
        <div style={{
          padding: '1rem 1.25rem',
          background: 'rgba(15, 23, 42, 0.9)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}>
              {partnerName ? partnerName.slice(0, 2).toUpperCase() : "AG"}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
                  {partnerName}
                </h4>
                <span className="badge-sih" style={{ fontSize: '0.65rem' }}>
                  {partnerRole}
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Lock size={11} className="text-emerald-400" />
                <span>End-to-End Case Encrypted Channel (Case #{caseId})</span>
              </div>
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Security Notice Banner */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
          padding: '0.45rem 1rem',
          fontSize: '0.75rem',
          color: '#93c5fd',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          justifyContent: 'center'
        }}>
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>🔒 Private Case Conversation — Accessible strictly to Client & Assigned Advocate.</span>
        </div>

        {/* Messages Scroll Area */}
        <div style={{
          flex: 1,
          padding: '1.25rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          background: 'rgba(10, 15, 29, 0.5)'
        }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', marginTop: '3rem' }}>
              <Lock size={32} style={{ color: '#64748b', margin: '0 auto 0.5rem' }} />
              <p>No messages yet. Send a message to begin confidential case consultation.</p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.sender_id === currentUser?.id;
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '78%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMe ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    fontSize: '0.7rem',
                    color: '#94a3b8',
                    marginBottom: '0.2rem',
                    padding: '0 0.2rem'
                  }}>
                    {isMe ? "You" : m.sender_name} ({m.sender_role})
                  </div>

                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    background: isMe ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' : 'rgba(30, 41, 59, 0.9)',
                    color: '#fff',
                    fontSize: '0.86rem',
                    lineHeight: 1.45,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                  }}>
                    {m.message_text}
                  </div>

                  <div style={{
                    fontSize: '0.66rem',
                    color: '#64748b',
                    marginTop: '0.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0 0.2rem'
                  }}>
                    <span>{m.created_at?.slice(11, 16) || "Just now"}</span>
                    {isMe && <CheckCheck size={12} className="text-emerald-400" />}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          style={{
            padding: '0.9rem 1.25rem',
            background: 'rgba(15, 23, 42, 0.9)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '0.6rem',
            alignItems: 'center'
          }}
        >
          <input
            type="text"
            className="form-input"
            placeholder="Type your secure message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ flex: 1, fontSize: '0.88rem' }}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.2rem', fontWeight: 700 }}
          >
            <Send size={15} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
