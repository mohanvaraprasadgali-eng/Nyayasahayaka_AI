import React, { useState } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  Scale, 
  CheckSquare, 
  AlertTriangle, 
  ArrowRight, 
  FileText, 
  Lock, 
  CreditCard, 
  ShieldCheck, 
  HelpCircle,
  Clock,
  MapPin,
  FileQuestion,
  CheckCircle2,
  UploadCloud,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { useCaseContext } from '../context/CaseContext';
import { useAuth } from '../context/AuthContext';
import { VoiceInput } from '../components/VoiceInput';
import { MissingDocModal } from '../components/MissingDocModal';
import { PaymentModal } from '../components/PaymentModal';

export const CreateCasePage = () => {
  const { showToast, setActiveTab, setCurrentCaseId, refreshStatsAndCases } = useCaseContext();
  const { currentUser } = useAuth();

  // Multi-step form state
  const [step, setStep] = useState(1); // 1: Description, 2: AI Analysis & Checklist, 3: Pricing & Match
  const [loading, setLoading] = useState(false);
  const [problemDescription, setProblemDescription] = useState('');
  const [location, setLocation] = useState('Madhapur, Hyderabad, Telangana');
  const [urgency, setUrgency] = useState('Medium');
  
  // AI Analysis Results
  const [analyzedCase, setAnalyzedCase] = useState(null);
  const [documentReqs, setDocumentReqs] = useState([]);
  
  // Modals
  const [selectedMissingDoc, setSelectedMissingDoc] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdCaseId, setCreatedCaseId] = useState(null);

  const examplePrompts = [
    { title: "Rental Deposit Dispute", text: "My landlord has not returned my security deposit of ₹60,000 after I vacated the flat with proper notice." },
    { title: "Unpaid Salary", text: "My employer has not paid my monthly salary of ₹60,000 for three months despite regular biometric attendance." },
    { title: "Defective Product & Warranty", text: "I bought a smart TV that stopped functioning in 2 months, and the seller refused warranty repair or refund." }
  ];

  const handleAnalyzeAndCreate = async (e) => {
    e?.preventDefault();
    if (!problemDescription.trim()) {
      showToast("Please describe your legal problem.", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await api.createCase({
        description: problemDescription.trim(),
        location,
        urgency,
        preferred_language: 'en'
      });

      setLoading(false);
      if (res.success) {
        setCreatedCaseId(res.case_id);
        setCurrentCaseId(res.case_id);
        setAnalyzedCase(res);

        // Fetch case detail for full document requirements list
        const caseDetailRes = await api.getCaseDetail(res.case_id);
        if (caseDetailRes.success) {
          setDocumentReqs(caseDetailRes.case.document_requirements || []);
        }

        setStep(2);
        showToast("AI analyzed your case and generated the required document checklist!");
        refreshStatsAndCases();
      } else {
        showToast(res.error || "Failed to create case", "error");
      }
    } catch (e) {
      setLoading(false);
      showToast("Error creating case", "error");
    }
  };

  const handleMarkMissing = async (reqId) => {
    try {
      await api.updateDocRequirement(createdCaseId, reqId, 'missing', 'Citizen marked as missing — using alternative supporting evidence.');
      setDocumentReqs(prev => prev.map(r => r.id === reqId ? { ...r, status: 'missing' } : r));
      showToast("Document marked as Missing. Alternative supporting evidence noted.");
    } catch (e) {}
  };

  const handleMarkAvailable = async (reqId) => {
    try {
      await api.updateDocRequirement(createdCaseId, reqId, 'available', 'Uploaded / Available');
      setDocumentReqs(prev => prev.map(r => r.id === reqId ? { ...r, status: 'available' } : r));
      showToast("Document marked as Available!");
    } catch (e) {}
  };

  // Calculate completeness
  const totalDocs = documentReqs.length || 1;
  const availableDocs = documentReqs.filter(r => r.status === 'available').length;
  const missingDocs = documentReqs.filter(r => r.status === 'missing').length;
  const completenessPct = Math.min(100, Math.round(((availableDocs + (missingDocs * 0.5)) / totalDocs) * 100));

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    showToast("Case platform fee paid! Matching with verified advocates now.");
    setActiveTab('citizen_cases');
    refreshStatsAndCases();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)',
        border: '1px solid #3b82f6',
        borderRadius: '16px',
        padding: '1.75rem',
        marginBottom: '1.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(59, 130, 246, 0.2)', padding: '0.25rem 0.75rem', borderRadius: '9999px', color: '#93c5fd', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.6rem' }}>
          <Sparkles size={14} />
          <span>AI-Assisted Legal Dispute Intake & Advocate Connect</span>
        </div>
        <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
          Create a Legal Case
        </h2>
        <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1', maxWidth: '680px', lineHeight: 1.5 }}>
          Describe your problem in everyday words. Our Indian Legal AI extracts statutory claims, generates a document checklist with missing-evidence guidance, and matches you with verified advocates.
        </p>
      </div>

      {/* Step 1: Problem Input */}
      {step === 1 && (
        <div className="card" style={{ padding: '1.75rem' }}>
          <form onSubmit={handleAnalyzeAndCreate}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f8fafc' }}>
                Describe Your Legal Issue in Plain Language *
              </label>
              <div style={{ position: 'relative' }}>
                <textarea
                  className="form-input"
                  rows={5}
                  required
                  placeholder="e.g. My landlord has not returned my security deposit of ₹60,000 after I vacated the flat on 1st July despite 1 month notice..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  style={{ width: '100%', fontSize: '0.92rem', lineHeight: 1.5, paddingRight: '45px' }}
                />
                <div style={{ position: 'absolute', right: '10px', bottom: '10px' }}>
                  <VoiceInput onTranscript={(text) => setProblemDescription(prev => prev ? `${prev} ${text}` : text)} />
                </div>
              </div>
            </div>

            {/* Quick Example Prompts */}
            <div style={{ marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                Or try instant test examples:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {examplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => setProblemDescription(p.text)}
                    style={{ fontSize: '0.78rem' }}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>
                  Location / Jurisdiction
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>
                  Urgency Level
                </label>
                <select
                  className="form-input"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                >
                  <option value="Low">Low (Standard consultation)</option>
                  <option value="Medium">Medium (Dispute within 30 days)</option>
                  <option value="High">High (Immediate notice window expiring)</option>
                  <option value="Urgent">Urgent (Police/Cybercrime emergency)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block btn-lg"
              style={{ fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
            >
              <Sparkles size={18} />
              <span>{loading ? "Analyzing with Indian Legal AI..." : "Analyze Case & Generate Evidence Checklist ➔"}</span>
            </button>
          </form>
        </div>
      )}

      {/* Step 2: AI Classification, Complexity & Missing Document Checklist */}
      {step === 2 && analyzedCase && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* AI Categorization Summary Card */}
          <div className="card" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Case Classification
                </span>
                <h3 style={{ margin: '0.2rem 0', fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                  {analyzedCase.title}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                  <span className="badge-sih">{analyzedCase.category}</span>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: analyzedCase.complexity === 'COMPLEX' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: analyzedCase.complexity === 'COMPLEX' ? '#f87171' : '#fbbf24',
                    border: '1px solid currentColor'
                  }}>
                    Complexity: {analyzedCase.complexity === 'BASIC' ? '🟢 BASIC' : (analyzedCase.complexity === 'MODERATE' ? '🟡 MODERATE' : '🔴 COMPLEX')}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Platform Consultation Fee</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>
                  ₹{analyzedCase.platform_fee?.toFixed(2)}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              {analyzedCase.summary}
            </p>
          </div>

          {/* Document Collection Status Progress Meter */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckSquare size={18} className="text-blue-400" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>
                  Case Documentation Completeness
                </span>
              </div>
              <span style={{ fontWeight: 800, color: completenessPct >= 75 ? '#34d399' : '#f59e0b' }}>
                {completenessPct}% Ready
              </span>
            </div>

            <div style={{ height: '10px', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '0.6rem' }}>
              <div style={{
                height: '100%',
                width: `${completenessPct}%`,
                background: completenessPct >= 75 ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #f59e0b, #d97706)',
                borderRadius: '9999px',
                transition: 'width 0.4s ease'
              }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#94a3b8' }}>
              <span>✅ Available: <strong>{availableDocs}</strong></span>
              <span>⚠️ Missing (Alternatives noted): <strong>{missingDocs}</strong></span>
              <span>Total Recommended: <strong>{totalDocs}</strong></span>
            </div>
          </div>

          {/* AI Document Requirement Checklist */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.8rem', fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
              Required & Recommended Documents
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 1rem' }}>
              Review the documents suggested by AI for your case. If you do not have a document, click <strong>"I Don't Have This Document"</strong> to inspect alternative admissible evidence and retrieve steps.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {documentReqs.map((req) => (
                <div
                  key={req.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    background: req.status === 'available' ? 'rgba(16, 185, 129, 0.08)' : (req.status === 'missing' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(30, 41, 59, 0.5)'),
                    border: req.status === 'available' ? '1px solid rgba(16, 185, 129, 0.3)' : (req.status === 'missing' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-color)'),
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {req.status === 'available' ? (
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    ) : (req.status === 'missing' ? (
                      <AlertTriangle size={20} className="text-amber-500" />
                    ) : (
                      <FileText size={20} className="text-slate-400" />
                    ))}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
                        {req.name}
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: req.importance === 'Essential' ? '#f87171' : '#94a3b8', fontWeight: 600 }}>
                          [{req.importance}]
                        </span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                        {req.status === 'available' ? "Document is ready & attached" : (req.status === 'missing' ? "Using alternative evidence (Bank statement / Chat)" : req.why_useful)}
                      </div>
                    </div>
                  </div>

                  {/* Actions per document */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {req.status !== 'available' && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => handleMarkAvailable(req.id)}
                      >
                        ✓ Mark Available
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary btn-xs"
                      onClick={() => setSelectedMissingDoc(req)}
                      style={{ color: '#fbbf24', borderColor: '#f59e0b', background: 'rgba(245, 158, 11, 0.08)' }}
                    >
                      <HelpCircle size={13} />
                      <span>I Don't Have This</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(1)}
              >
                ← Back to Description
              </button>

              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => setShowPaymentModal(true)}
                style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <CreditCard size={18} />
                <span>Continue to Case Payment (₹{analyzedCase.platform_fee?.toFixed(2)}) ➔</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Missing Document Helper Modal */}
      <MissingDocModal
        isOpen={!!selectedMissingDoc}
        documentRequirement={selectedMissingDoc}
        onClose={() => setSelectedMissingDoc(null)}
        onMarkMissing={handleMarkMissing}
      />

      {/* Prototype Payment Simulation Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        paymentData={{
          payment_type: 'case_fee',
          amount: analyzedCase?.platform_fee || 499.0,
          case_id: createdCaseId,
          plan_code: analyzedCase?.complexity || 'CASE_MODERATE',
          title: `${analyzedCase?.title || 'Case'} Consultation Fee`,
          description: "Covers AI legal verification, missing document assistance, and verified advocate matching."
        }}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
