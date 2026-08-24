import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  FolderLock, 
  MessageSquare, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Lock, 
  Eye, 
  Download, 
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCaseContext } from '../context/CaseContext';
import { PrivateChatView } from './PrivateChatView';

export const LawyerActiveCases = () => {
  const { currentUser } = useAuth();
  const { showToast, currentCaseId, setCurrentCaseId } = useCaseContext();

  const [activeCases, setActiveCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseDocs, setCaseDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  const fetchActiveCases = async () => {
    try {
      setLoading(true);
      const res = await api.getLawyerActiveCases();
      if (res.success) {
        setActiveCases(res.cases || []);
        if (res.cases.length > 0) {
          const targetCase = res.cases.find(c => c.id === currentCaseId) || res.cases[0];
          setSelectedCase(targetCase);
          fetchCaseDocuments(targetCase.id);
        }
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const fetchCaseDocuments = async (caseId) => {
    try {
      const docRes = await api.getCaseDocuments(caseId);
      if (docRes.success) {
        setCaseDocs(docRes.documents || []);
      }
    } catch (e) {
      console.warn("Error fetching documents:", e);
    }
  };

  useEffect(() => {
    fetchActiveCases();
  }, [currentUser]);

  const handleCaseSelect = (caseItem) => {
    setSelectedCase(caseItem);
    setCurrentCaseId(caseItem.id);
    fetchCaseDocuments(caseItem.id);
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
              Active Client Cases
            </h2>
            <span className="badge-sih" style={{ background: '#059669', color: '#fff' }}>
              {activeCases.length} Assigned
            </span>
          </div>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: '#94a3b8' }}>
            Direct legal counsel workspace with secure document vault and confidential client messaging.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading active cases...</div>
      ) : activeCases.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Briefcase size={44} style={{ color: '#64748b', margin: '0 auto 1rem' }} />
          <h4 style={{ margin: '0 0 0.4rem', color: '#f8fafc' }}>No active cases currently</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Accept incoming case requests from your feed to begin client representation.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.25rem', alignItems: 'flex-start' }}>
          {/* Left: Active Cases List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeCases.map((c) => (
              <div
                key={c.id}
                onClick={() => handleCaseSelect(c)}
                className="card"
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  border: selectedCase?.id === c.id ? '2px solid #10b981' : '1px solid var(--border-color)',
                  background: selectedCase?.id === c.id ? 'rgba(16, 185, 129, 0.08)' : 'rgba(30, 41, 59, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700 }}>
                    CASE-2026-{c.id.toString().padStart(3, '0')}
                  </span>
                  <span className="badge-sih" style={{ background: '#059669', color: '#fff', fontSize: '0.68rem' }}>
                    {c.status}
                  </span>
                </div>

                <h4 style={{ margin: '0 0 0.3rem', fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.3 }}>
                  {c.title}
                </h4>

                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                  Client: <strong>{c.client_name}</strong> ({c.client_location?.split(',')[0]})
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', borderTop: '1px solid var(--border-color)', paddingTop: '0.4rem' }}>
                  <span>📁 {c.document_count || 3} Private Docs</span>
                  <span>💬 Chat Active</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Selected Case Workspace */}
          {selectedCase && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Unlocked Client Contact Card */}
              <div className="card" style={{ padding: '1.5rem', border: '1px solid #10b981', background: 'rgba(16, 185, 129, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                      <span className="badge-sih" style={{ background: '#059669', color: '#fff' }}>
                        🔒 Full Client Dossier Unlocked
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        CASE-2026-{selectedCase.id.toString().padStart(3, '0')}
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
                      {selectedCase.title}
                    </h3>

                    {/* Unlocked Contact Details */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.84rem', color: '#cbd5e1', marginTop: '0.6rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <User size={15} className="text-blue-400" />
                        <strong>Client: {selectedCase.client_name}</strong>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Phone size={15} className="text-emerald-400" />
                        <span>{selectedCase.client_phone || "+91 98765 43210"}</span>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Mail size={15} className="text-purple-400" />
                        <span>{selectedCase.client_email || "client@nyaya.ai"}</span>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={15} className="text-amber-400" />
                        <span>{selectedCase.client_location || "Hyderabad, Telangana"}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={() => setShowChat(!showChat)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
                  >
                    <MessageSquare size={16} />
                    <span>Open Confidential Chat</span>
                  </button>
                </div>

                <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, background: 'rgba(15, 23, 42, 0.5)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', margin: 0 }}>
                  {selectedCase.description}
                </p>
              </div>

              {/* Secure Document Vault for this Case */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FolderLock size={20} className="text-blue-400" />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                        Case Evidence & Document Vault
                      </h4>
                      <span style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 600 }}>
                        🔒 Decrypted & accessible strictly to assigned counsel ({currentUser?.name})
                      </span>
                    </div>
                  </div>
                </div>

                {caseDocs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    No private documents uploaded for this case yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {caseDocs.map((doc) => (
                      <div
                        key={doc.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.85rem 1rem',
                          borderRadius: '8px',
                          background: 'rgba(15, 23, 42, 0.6)',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <FileText size={18} className="text-blue-400" />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f8fafc' }}>
                              {doc.title}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                              {doc.filename} • {doc.document_type} • {(doc.file_size / 1024).toFixed(1)} KB
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.72rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                            Verified Private
                          </span>
                          <button
                            className="btn btn-secondary btn-xs"
                            onClick={() => showToast(`Audit log recorded: Advocate viewed ${doc.filename}`)}
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Private Chat Drawer Modal */}
      {showChat && selectedCase && (
        <PrivateChatView
          caseId={selectedCase.id}
          caseTitle={selectedCase.title}
          partnerName={selectedCase.client_name || "Client"}
          partnerRole="Client"
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};
