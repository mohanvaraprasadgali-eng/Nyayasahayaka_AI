import React, { useState, useEffect } from 'react';
import {
  Scale,
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
  Building2,
  CheckCircle,
  AlertCircle,
  Save,
  Send,
  RotateCcw,
  ExternalLink,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useCaseContext } from '../context/CaseContext';
import { VoiceInput } from '../components/VoiceInput';
import { RiskBadge } from '../components/RiskBadge';
import { RightsCard } from '../components/RightsCard';
import { EvidenceChecklist } from '../components/EvidenceChecklist';
import { ActionPlanList } from '../components/ActionPlanList';

export const ProblemAnalyzer = () => {
  const { t, language } = useLanguage();
  const { pendingAnalysis, setPendingAnalysis, showToast, refreshStatsAndCases, setActiveTab, setCurrentCaseId } = useCaseContext();

  const [problemText, setProblemText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [savingCase, setSavingCase] = useState(false);

  const loaderSteps = [
    "Understanding your situation...",
    "Identifying potential legal issues under Indian Law...",
    "Checking relevant statutory provisions & India Code...",
    "Preparing your personalized legal action plan..."
  ];

  // Auto-run if triggered from Dashboard or Demo Scenarios
  useEffect(() => {
    if (pendingAnalysis?.prompt) {
      setProblemText(pendingAnalysis.prompt);
      runAnalysis(pendingAnalysis.prompt);
      setPendingAnalysis(null);
    }
  }, [pendingAnalysis]);

  const runAnalysis = async (queryToAnalyze) => {
    const query = queryToAnalyze || problemText;
    if (!query.trim()) return;

    setLoading(true);
    setLoadingStep(0);
    setAnalysisResult(null);

    // Step animation timer
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loaderSteps.length - 1 ? prev + 1 : prev));
    }, 600);

    try {
      const res = await api.analyzeProblem(query, language, 'Telangana');
      clearInterval(interval);
      if (res.success) {
        setAnalysisResult(res.data);
      } else {
        showToast('Analysis error occurred', 'error');
      }
    } catch (err) {
      clearInterval(interval);
      console.error('Problem analysis failed', err);
      showToast('Service temporarily unavailable. Loading fallback legal intelligence.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsCase = async () => {
    if (!analysisResult) return;
    setSavingCase(true);
    try {
      const res = await api.createCase({
        title: analysisResult.problem_title,
        category: analysisResult.legal_category,
        sub_category: analysisResult.topic_id,
        description: analysisResult.query,
        risk_level: analysisResult.risk_assessment?.level || 'yellow',
        status: 'Open',
        summary: analysisResult.summary,
        applicable_laws: analysisResult.possible_rights.map(r => r.legal_source).join('; '),
        evidence_needed: analysisResult.evidence_needed,
        action_plan: analysisResult.action_plan
      });

      if (res.success) {
        showToast('Case created successfully with full action plan and evidence checklist!');
        await refreshStatsAndCases();
        setCurrentCaseId(res.case_id);
        setActiveTab('timeline');
      }
    } catch (e) {
      console.error('Failed to save case:', e);
      showToast('Could not save case to database', 'error');
    } finally {
      setSavingCase(false);
    }
  };

  const handleOpenDocGenerator = () => {
    setActiveTab('doc_generator');
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Scale size={24} style={{ color: '#2563eb' }} />
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
            AI Legal Problem Analyzer
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Describe your grievance in natural English or Telugu. NyayaSahayak converts citizen complaints into actionable rights, evidence lists, and legal workflows.
        </p>
      </div>

      {/* Input Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={(e) => { e.preventDefault(); runAnalysis(); }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>
              Describe your legal grievance or dispute:
            </label>
            <VoiceInput onTranscript={(txt) => setProblemText(txt)} />
          </div>

          <textarea
            className="form-textarea"
            rows={4}
            placeholder="e.g. My employer has not paid my salary of Rs 45,000 for May, June, and July 2026 despite regular attendance... or మా landlord advance return cheyyatledu..."
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            style={{ marginBottom: '1rem', fontSize: '0.95rem' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              💡 <em>Supports Telugu transliterated phrases (e.g. "jeetham ivvaledu", "advance return cheyyatledu")</em>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {analysisResult && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setAnalysisResult(null);
                    setProblemText('');
                  }}
                >
                  <RotateCcw size={14} />
                  Reset
                </button>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !problemText.trim()}
              >
                <Sparkles size={16} />
                <span>{loading ? 'Analyzing Problem...' : 'Analyze Problem'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Step-by-Step Analysis Loading Animation */}
      {loading && (
        <div className="analysis-loader-card">
          <div className="loader-spinner-ring" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Analyzing Legal Problem
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Evaluating applicable Indian statutes, official authorities, and legal procedures...
          </p>

          <div className="loader-steps-list">
            {loaderSteps.map((step, idx) => {
              const isDone = idx < loadingStep;
              const isActive = idx === loadingStep;
              return (
                <div
                  key={idx}
                  className={`loader-step-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                >
                  {isDone ? (
                    <CheckCircle size={16} style={{ color: '#059669', flexShrink: 0 }} />
                  ) : isActive ? (
                    <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #2563eb', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #cbd5e1', flexShrink: 0 }} />
                  )}
                  <span>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Structured Analysis Results View */}
      {analysisResult && !loading && (
        <div>
          {/* Action Header Card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #09172A 0%, #1E3E62 100%)', color: '#ffffff', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#93c5fd', textTransform: 'uppercase' }}>
                  Identified Legal Issue
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                  {analysisResult.problem_title}
                </h3>
                <span className="badge badge-blue" style={{ marginTop: '0.4rem', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                  Category: {analysisResult.legal_category}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-gold"
                  onClick={handleSaveAsCase}
                  disabled={savingCase}
                >
                  <Save size={16} />
                  <span>{savingCase ? 'Creating Case...' : 'Save as Official Case'}</span>
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={handleOpenDocGenerator}
                  style={{ background: '#fff', color: '#0f172a' }}
                >
                  <FileText size={16} />
                  <span>Generate Legal Draft</span>
                </button>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '0.85rem' }}>
              {analysisResult.summary}
            </p>

            {/* Telugu Translation / Summary Banner if detected */}
            {analysisResult.telugu_summary && (
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1rem', borderRadius: '8px', marginTop: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fde047', marginBottom: '0.2rem' }}>
                  తెలుగు వివరణ (Telugu Summary):
                </div>
                <div style={{ fontSize: '0.88rem', color: '#f8fafc', lineHeight: 1.5 }}>
                  {analysisResult.telugu_summary}
                </div>
              </div>
            )}
          </div>

          {/* Risk Level Badge */}
          <div style={{ marginBottom: '1.5rem' }}>
            <RiskBadge
              level={analysisResult.risk_assessment?.level}
              reasoning={analysisResult.risk_assessment?.reasoning}
              disclaimer={analysisResult.risk_assessment?.disclaimer}
            />
          </div>

          {/* Rights Section */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={20} style={{ color: '#2563eb' }} />
                Your Statutory Rights (India Code Verified)
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                3-5 Relevant Statutory Protections
              </span>
            </div>

            <div className="rights-grid">
              {analysisResult.possible_rights?.map((right, i) => (
                <RightsCard key={i} right={right} />
              ))}
            </div>
          </div>

          {/* Evidence Checklist Section */}
          <div style={{ marginBottom: '2rem' }}>
            <EvidenceChecklist
              evidenceList={analysisResult.evidence_needed}
              allowAdd={false}
            />
          </div>

          {/* Action Plan Section */}
          <div style={{ marginBottom: '2rem' }}>
            <ActionPlanList
              actionSteps={analysisResult.action_plan}
            />
          </div>

          {/* Recommended Authority & Legal Aid */}
          <div className="card" style={{ borderLeft: '4px solid #9333ea' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Official Dispute Resolution Authority
                </span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
                  {analysisResult.recommended_authority?.category}
                </h4>
              </div>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setActiveTab('find_help')}
              >
                <Building2 size={14} />
                View Contact Directory
              </button>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#475569' }}>
              {analysisResult.recommended_authority?.notes || "Statutory authority established under Indian law for redressing this category of grievances."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
