import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FolderLock, 
  MessageSquare, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight,
  PlusCircle,
  FileText,
  CreditCard,
  Download,
  Eye,
  Lock,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { useCaseContext } from '../context/CaseContext';
import { useAuth } from '../context/AuthContext';
import { MissingDocModal } from '../components/MissingDocModal';
import { PrivateChatView } from './PrivateChatView';

export const CitizenCasesPage = () => {
  const { cases, currentCaseId, setCurrentCaseId, setActiveTab, showToast, refreshStatsAndCases } = useCaseContext();
  const { currentUser } = useAuth();

  const [selectedCase, setSelectedCase] = useState(null);
  const [caseDocuments, setCaseDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [missingDocModalData, setMissingDocModalData] = useState(null);

  const fetchSelectedCaseDetail = async (caseId) => {
    try {
      setLoadingDocs(true);
      const res = await api.getCaseDetail(caseId);
      if (res.success) {
        setSelectedCase(res.case);
        setCurrentCaseId(caseId);
      }
      
      const docRes = await api.getCaseDocuments(caseId);
      if (docRes.success) {
        setCaseDocuments(docRes.documents);
      }
      setLoadingDocs(false);
    } catch (e) {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    if (cases.length > 0) {
      const activeId = currentCaseId || cases[0].id;
      fetchSelectedCaseDetail(activeId);
    }
  }, [cases]);

  const handleCaseSelect = (caseId) => {
    fetchSelectedCaseDetail(caseId);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <span className="badge-sih" style={{ background: '#059669', color: '#fff' }}>🟢 IN PROGRESS</span>;
      case 'LAWYER_ACCEPTED':
        return <span className="badge-sih" style={{ background: '#2563eb', color: '#fff' }}>⚖️ LAWYER ACCEPTED</span>;
      case 'MATCHING':
        return <span className="badge-sih" style={{ background: '#d97706', color: '#fff' }}>⏳ MATCHING ADVOCATE</span>;
      case 'RESOLVED':
        return <span className="badge-sih" style={{ background: '#10b981', color: '#fff' }}>✅ RESOLVED</span>;
      default:
        return <span className="badge-sih">{status}</span>;
    }
  };

  const timelineSteps = [
    { key: 'CREATED', label: 'Case Created' },
    { key: 'ANALYZED', label: 'AI Analyzed' },
    { key: 'PAID', label: 'Fee Paid' },
    { key: 'MATCHING', label: 'Advocate Matching' },
    { key: 'LAWYER_ACCEPTED', label: 'Advocate Accepted' },
    { key: 'DOCUMENTS_SHARED', label: 'Docs Shared' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'RESOLVED', label: 'Resolved' }
  ];

  const getStepActiveIndex = (status) => {
    switch (status) {
      case 'OPEN': return 0;
      case 'ANALYZED': return 1;
      case 'PAID': return 2;
      case 'MATCHING': return 3;
      case 'LAWYER_ACCEPTED': return 4;
      case 'DOCUMENTS_SHARED': return 5;
      case 'IN_PROGRESS': return 6;
      case 'RESOLVED': return 7;
      default: return 4;
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <h2 style={{ margin: '0 0 0.2rem', fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
            My Legal Cases
          </h2>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8' }}>
            Track case status, manage private evidence documents, and communicate with your assigned advocate.
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setActiveTab('create_case')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
        >
          <PlusCircle size={16} />
          <span>+ Create New Case</span>
        </button>
      </div>

      {cases.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Scale size={48} style={{ color: '#64748b', margin: '0 auto 1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem', color: '#f8fafc' }}>No cases created yet</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0 0 1.5rem' }}>
            Describe your problem to get instant AI legal analysis, evidence checklist, and verified lawyer matching.
          </p>
          <button className="btn btn-primary" onClick={() => setActiveTab('create_case')}>
            Create Your First Case ➔
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.25rem', alignItems: 'flex-start' }}>
          {/* Left: Case Selector List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {cases.map((c) => (
              <div
                key={c.id}
                onClick={() => handleCaseSelect(c.id)}
                className="card"
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  border: selectedCase?.id === c.id ? '2px solid #3b82f6' : '1px solid var(--border-color)',
                  background: selectedCase?.id === c.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(30, 41, 59, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>
                    CASE-2026-{c.id.toString().padStart(3, '0')}
                  </span>
                  {getStatusBadge(c.status)}
                </div>

                <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.3 }}>
                  {c.title}
                </h4>

                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                  {c.category} • {c.location?.split(',')[0]}
                </div>

                {/* Progress bar */}
                <div style={{ height: '6px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${c.doc_progress?.percentage || 75}%`,
                    background: '#10b981',
                    borderRadius: '9999px'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                  <span>Evidence: {c.doc_progress?.available || 2}/{c.doc_progress?.total || 3} items</span>
                  <span>{c.doc_progress?.percentage || 75}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Case Detailed Workspace */}
          {selectedCase && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Case Summary Card */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>
                        CASE-2026-{selectedCase.id.toString().padStart(3, '0')}
                      </span>
                      {getStatusBadge(selectedCase.status)}
                      <span className="badge-sih">{selectedCase.complexity} COMPLEXITY</span>
                    </div>
                    <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
                      {selectedCase.title}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                      {selectedCase.category} • Location: {selectedCase.location} • Created: {selectedCase.created_at?.slice(0, 10)}
                    </div>
                  </div>

                  {selectedCase.assigned_lawyer_name && (
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowChatModal(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
                    >
                      <MessageSquare size={16} />
                      <span>🔒 Private Case Chat</span>
                    </button>
                  )}
                </div>

                <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, background: 'rgba(15, 23, 42, 0.5)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', margin: 0 }}>
                  {selectedCase.description}
                </p>
              </div>

              {/* Visual 8-Step Timeline Tracker */}
              <div className="card" style={{ padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                  Case Progression Milestones
                </h4>

                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  {timelineSteps.map((step, idx) => {
                    const activeIdx = getStepActiveIndex(selectedCase.status);
                    const isDone = idx <= activeIdx;
                    const isCurrent = idx === activeIdx;
                    return (
                      <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '75px', position: 'relative' }}>
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: isCurrent ? '#3b82f6' : (isDone ? '#10b981' : 'rgba(30, 41, 59, 0.8)'),
                          border: isCurrent ? '3px solid #93c5fd' : (isDone ? '2px solid #10b981' : '1px solid var(--border-color)'),
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          marginBottom: '0.4rem',
                          boxShadow: isCurrent ? '0 0 12px rgba(59, 130, 246, 0.6)' : 'none'
                        }}>
                          {isDone ? "✓" : idx + 1}
                        </div>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: isCurrent ? 800 : (isDone ? 600 : 400),
                          color: isCurrent ? '#38bdf8' : (isDone ? '#e2e8f0' : '#64748b'),
                          textAlign: 'center',
                          lineHeight: 1.2
                        }}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Assigned Advocate Profile Card if Assigned */}
              {selectedCase.assigned_lawyer_name ? (
                <div className="card" style={{ padding: '1.25rem', border: '1px solid #10b981', background: 'rgba(16, 185, 129, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10B981, #059669)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1rem'
                      }}>
                        PS
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f8fafc' }}>
                            {selectedCase.assigned_lawyer_name}
                          </span>
                          <span className="badge-sih" style={{ background: '#059669', color: '#fff', fontSize: '0.68rem' }}>
                            ✓ Verified Advocate
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          Bar Council: {selectedCase.bar_council_number || 'TS/1402/2016'} • Specialization: {selectedCase.specialization || 'Real Estate & Tenancy'}
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowChatModal(true)}
                      style={{ borderColor: '#10b981', color: '#34d399' }}
                    >
                      <MessageSquare size={15} />
                      <span>Send Direct Message</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card" style={{ padding: '1.25rem', border: '1px dashed #d97706', background: 'rgba(245, 158, 11, 0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <AlertTriangle size={20} className="text-amber-500" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fbbf24' }}>
                        Advocate Matching in Progress
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                        Your case summary is live in the verified advocate case pool. You will be notified the moment an advocate accepts.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Private Case Documents Vault Section */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FolderLock size={20} className="text-blue-400" />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                        Private Case Documents Vault
                      </h4>
                      <span style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 600 }}>
                        🔒 Accessible strictly to You and Assigned Legal Counsel
                      </span>
                    </div>
                  </div>
                </div>

                {caseDocuments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    No private documents uploaded for this case yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {caseDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.8rem 1rem',
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
                            🔒 Encrypted Access
                          </span>
                          <button
                            className="btn btn-secondary btn-xs"
                            onClick={() => showToast(`Opening secure document: ${doc.filename}`)}
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

              {/* Document Requirements with 'I Don't Have This Document' Helper */}
              {selectedCase.document_requirements && (
                <div className="card" style={{ padding: '1.25rem' }}>
                  <h4 style={{ margin: '0 0 0.8rem', fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                    Required Document Checklist & Alternative Evidence
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {selectedCase.document_requirements.map((req) => (
                      <div
                        key={req.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          background: req.status === 'available' ? 'rgba(16, 185, 129, 0.08)' : (req.status === 'missing' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(30, 41, 59, 0.4)'),
                          border: req.status === 'available' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {req.status === 'available' ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          ) : (
                            <AlertTriangle size={16} className="text-amber-500" />
                          )}
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                            {req.name}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="btn btn-secondary btn-xs"
                          onClick={() => setMissingDocModalData(req)}
                          style={{ fontSize: '0.75rem', color: '#fbbf24', borderColor: '#f59e0b' }}
                        >
                          Alternative Evidence Guide ➔
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Missing Doc Helper Modal */}
      <MissingDocModal
        isOpen={!!missingDocModalData}
        documentRequirement={missingDocModalData}
        onClose={() => setMissingDocModalData(null)}
        onMarkMissing={(reqId) => {
          showToast("Alternative evidence noted for advocate review.");
        }}
      />

      {/* Private Chat Modal */}
      {showChatModal && selectedCase && (
        <PrivateChatView
          caseId={selectedCase.id}
          caseTitle={selectedCase.title}
          partnerName={selectedCase.assigned_lawyer_name || "Advocate"}
          partnerRole="Assigned Advocate"
          onClose={() => setShowChatModal(false)}
        />
      )}
    </div>
  );
};
