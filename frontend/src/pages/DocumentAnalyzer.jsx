import React, { useState } from 'react';
import {
  FileSearch,
  Upload,
  FileText,
  AlertTriangle,
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Save
} from 'lucide-react';
import { api } from '../services/api';
import { useCaseContext } from '../context/CaseContext';

export const DocumentAnalyzer = () => {
  const { showToast, setActiveTab, currentCaseId, refreshStatsAndCases } = useCaseContext();
  const [docText, setDocText] = useState('');
  const [fileName, setFileName] = useState('');
  const [docType, setDocType] = useState('Rental Agreement');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const sampleContracts = {
    employment: `EMPLOYMENT AGREEMENT
Between: TechCorp Solutions Pvt Ltd (Employer) and Ramesh Kumar (Employee)
Date of Joining: 15 January 2024. Monthly Remuneration: Rs. 45,000/-
Terms:
1. Salary shall be paid by the 7th of every calendar month.
2. Non-compete: Employee shall not join any competing IT company anywhere in India for 2 years after resignation.
3. Lock-in period: Employee agrees to serve for minimum 24 months or pay Rs 2,00,000 liquidated damages.
4. Jurisdiction: Disputes subject exclusively to Courts at Hyderabad.`,

    rental: `LEASE & LICENCE AGREEMENT
Between: K. Satyanarayana (Licensor/Landlord) and Priya Sharma (Licensee/Tenant)
Premises: Flat 101, Sai Residency, Banjara Hills, Hyderabad.
Deposit: Rs. 60,000/- refundable at time of peaceful handover.
Terms:
1. Notice Period: 30 days written notice required by either party prior to vacation.
2. Maintenance and painting charges of Rs 10,000 shall be deducted unilaterally regardless of condition.
3. Lock-in: 6 months minimum tenure.`,

    legal_notice: `LEGAL NOTICE
To: TechCorp Solutions Pvt. Ltd., HITEC City, Hyderabad.
Dated: 20 August 2026.
Subject: DEMAND FOR UNPAID SALARY OF RS 1,35,000/-.
Under instructions of my client Mr. Ramesh Kumar, you are hereby called upon to pay unpaid salary of Rs 1,35,000 within 15 DAYS of receipt of this notice, failing which legal proceedings under Section 15 of Payment of Wages Act and criminal prosecution shall be instituted.`
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setDocText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!docText.trim()) return;

    setLoading(true);
    try {
      const res = await api.analyzeDocument(docText, fileName || 'legal_document.txt', docType);
      if (res.success) {
        setAnalysis(res.data);
      }
    } catch (err) {
      console.error('Doc analysis error:', err);
      showToast('Document analysis failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToCase = async () => {
    if (!analysis) return;
    try {
      await api.addEvidence({
        case_id: currentCaseId || 1,
        name: `Analyzed ${analysis.document_type}`,
        category: 'Contract',
        status: 'collected',
        importance: 'Essential',
        notes: `Extracted ${analysis.risk_clauses?.length || 0} risk clauses and ${analysis.deadlines_detected?.length || 0} response deadlines.`
      });
      showToast('Document analysis saved to Case Evidence Vault!');
      refreshStatsAndCases();
    } catch (e) {
      console.error('Save to case error:', e);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <FileSearch size={24} style={{ color: '#2563eb' }} />
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
            Document Analyzer
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Upload or paste any Indian legal agreement, notice, FIR copy, or consumer invoice. NyayaSahayak AI extracts parties, critical clauses, hidden risks, and response deadlines.
        </p>
      </div>

      {/* Upload / Input Form */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleAnalyze}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className="form-label">Upload Legal File (PDF / DOCX / Image / TXT)</label>
              <input
                type="file"
                className="form-input"
                accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.txt"
                onChange={handleFileUpload}
              />
            </div>

            <div>
              <label className="form-label">Or load a sample document:</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    setDocText(sampleContracts.rental);
                    setFileName('Rental_Agreement.txt');
                    setDocType('Rental / Lease Agreement');
                  }}
                >
                  Rental Agreement
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    setDocText(sampleContracts.employment);
                    setFileName('Employment_Contract.txt');
                    setDocType('Employment Agreement');
                  }}
                >
                  Employment Contract
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    setDocText(sampleContracts.legal_notice);
                    setFileName('Statutory_Notice.txt');
                    setDocType('Legal Notice');
                  }}
                >
                  Legal Notice
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Document Text / Clauses Content</label>
            <textarea
              className="form-textarea"
              rows={7}
              placeholder="Paste document text or clauses here..."
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !docText.trim()}
            >
              <Sparkles size={16} />
              <span>{loading ? 'Analyzing Clauses & Risks...' : 'Analyze Document'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Output */}
      {analysis && (
        <div>
          {/* Top Banner */}
          <div className="card" style={{ background: '#09172A', color: '#fff', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-blue">Document Verified</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginTop: '0.3rem' }}>
                  {analysis.document_type}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  File: {analysis.filename} • Analyzed on {analysis.timestamp}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-gold btn-sm" onClick={handleSaveToCase}>
                  <Save size={14} />
                  <span>Save to Case Vault</span>
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('doc_generator')}>
                  <FileText size={14} />
                  <span>Generate Response Draft</span>
                </button>
              </div>
            </div>
          </div>

          {/* Extracted Key Information Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div className="card">
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={16} style={{ color: '#2563eb' }} />
                Detected Dates & Deadlines
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#334155' }}>
                {analysis.extracted_data.detected_dates.map((d, i) => (
                  <div key={i}>• {d}</div>
                ))}
              </div>
            </div>

            <div className="card">
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} style={{ color: '#059669' }} />
                Monetary Amounts Detected
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#334155' }}>
                {analysis.extracted_data.detected_amounts.map((a, i) => (
                  <div key={i} style={{ fontWeight: 700, color: '#059669' }}>• {a}</div>
                ))}
              </div>
            </div>

            <div className="card">
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={16} style={{ color: '#9333ea' }} />
                Identified Parties
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#334155' }}>
                {analysis.extracted_data.parties_involved.map((p, i) => (
                  <div key={i}>• {p}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Clauses Detected */}
          <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #dc2626' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} style={{ color: '#dc2626' }} />
              Potentially Risky / Unfair Clauses Detected ({analysis.risk_clauses.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {analysis.risk_clauses.map((risk, i) => (
                <div key={i} style={{ background: '#fef2f2', padding: '0.85rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#991b1b' }}>
                      {risk.clause}
                    </span>
                    <span className="badge badge-red">{risk.severity} Risk</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#450a0a' }}>
                    {risk.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Next Steps */}
          <div className="card">
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowRight size={18} style={{ color: '#2563eb' }} />
              What Should I Do Next?
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {analysis.recommended_next_steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: '#334155' }}>
                  <span style={{ color: '#2563eb', fontWeight: 700 }}>{i + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('doc_generator')}>
                Generate Formal Legal Notice / Response
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('find_help')}>
                Find Appropriate Legal Authority
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
