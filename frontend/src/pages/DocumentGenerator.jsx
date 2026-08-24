import React, { useState, useEffect } from 'react';
import {
  FileText,
  Copy,
  Download,
  Printer,
  Save,
  Check,
  Sparkles,
  Info,
  ChevronDown,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { useCaseContext } from '../context/CaseContext';

export const DocumentGenerator = () => {
  const { currentCaseId, showToast, refreshStatsAndCases, pendingAnalysis } = useCaseContext();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('salary_notice');
  const [formData, setFormData] = useState({});
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load available templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await api.getDocumentTemplates();
        if (res.success && res.templates) {
          setTemplates(res.templates);
          // Check if pending analysis suggested a template
          if (pendingAnalysis?.suggestedTemplate) {
            setSelectedTemplateId(pendingAnalysis.suggestedTemplate);
            if (pendingAnalysis.sampleFields) {
              setFormData(pendingAnalysis.sampleFields);
            }
          }
        }
      } catch (e) {
        console.error('Fetch templates error', e);
      }
    };
    fetchTemplates();
  }, [pendingAnalysis]);

  const activeTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleGenerate = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await api.generateDocument(selectedTemplateId, formData, currentCaseId, false);
      if (res.success) {
        setGeneratedDraft(res.draft);
        showToast('Legal draft generated successfully!');
      }
    } catch (err) {
      console.error('Generate document error', err);
      showToast('Generation failed. Please retry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDraft);
    setIsCopied(true);
    showToast('Copied draft to clipboard');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedDraft], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedTemplateId}_legal_draft_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Legal draft downloaded as file.');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>${activeTemplate?.title || 'Legal Document Draft'}</title>
          <style>
            body { font-family: 'Times New Roman', serif; line-height: 1.6; padding: 40px; }
            pre { white-space: pre-wrap; font-family: inherit; }
          </style>
        </head>
        <body>
          <pre>${generatedDraft}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleSaveToCase = async () => {
    if (!generatedDraft) return;
    try {
      await api.generateDocument(selectedTemplateId, formData, currentCaseId || 1, true);
      showToast('Draft attached to case documents & timeline!');
      refreshStatsAndCases();
    } catch (e) {
      console.error('Save draft error:', e);
      showToast('Could not save draft to case', 'error');
    }
  };

  const handlePreloadSample = () => {
    if (selectedTemplateId === 'salary_notice') {
      setFormData({
        complainant_name: 'Ramesh Kumar',
        complainant_address: 'H.No 4-12, Madhapur, Hyderabad - 500081',
        employer_name: 'TechCorp Solutions Pvt. Ltd.',
        employer_address: 'Cyber Towers, HITEC City, Hyderabad',
        designation: 'Senior Software Engineer',
        unpaid_months: 'May 2026, June 2026, and July 2026',
        monthly_salary: 'Rs. 45,000/-',
        total_amount: 'Rs. 1,35,000/-'
      });
    } else if (selectedTemplateId === 'rental_deposit_notice') {
      setFormData({
        tenant_name: 'Priya Sharma',
        tenant_address: 'Flat 302, Green Meadows, Bengaluru',
        landlord_name: 'Mr. K. Satyanarayana',
        landlord_address: 'Plot 45, Jubilee Hills, Hyderabad',
        property_address: 'Flat 101, Sai Residency, Banjara Hills',
        deposit_amount: 'Rs. 60,000/-',
        vacation_date: '31st July 2026'
      });
    } else if (selectedTemplateId === 'consumer_notice') {
      setFormData({
        consumer_name: 'Arvind Mehta',
        consumer_address: '12/B, MG Road, Pune',
        company_name: 'Apex Electronics Retail Pvt. Ltd.',
        company_address: 'Industrial Area Phase 2, Mumbai',
        product_name: 'Smart LED Television 55-inch',
        invoice_number: 'INV-98421 dated 10 April 2026',
        purchase_price: 'Rs. 42,999/-',
        defect_description: 'Display screen stopped working within 2 months of purchase; service center refused free replacement despite active warranty.'
      });
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <FileText size={24} style={{ color: '#2563eb' }} />
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
            Legal Document Generator
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Generate professional, structured statutory notices, representations, and RTI drafts tailored to Indian legal standards.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: generatedDraft ? '1fr 1.2fr' : '1fr', gap: '1.5rem' }}>
        {/* Left Form: Select & Fill */}
        <div className="card">
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Select Document Type / Statutory Template</label>
            <select
              className="form-select"
              value={selectedTemplateId}
              onChange={(e) => {
                setSelectedTemplateId(e.target.value);
                setFormData({});
                setGeneratedDraft('');
              }}
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.category})
                </option>
              ))}
            </select>
          </div>

          {activeTemplate && (
            <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.82rem', color: '#475569' }}>
                {activeTemplate.description}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={handlePreloadSample}
            >
              <Sparkles size={14} style={{ color: '#d97706' }} />
              Auto-Fill Sample Data
            </button>
          </div>

          <form onSubmit={handleGenerate}>
            {activeTemplate?.fields?.map((field) => (
              <div key={field.name} className="form-group">
                <label className="form-label">
                  {field.label} {field.required && <span style={{ color: '#dc2626' }}>*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    required={field.required}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-input"
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    required={field.required}
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              <Sparkles size={18} />
              <span>{loading ? 'Generating Statutory Draft...' : 'Generate Legal Draft'}</span>
            </button>
          </form>
        </div>

        {/* Right Preview Panel */}
        {generatedDraft && (
          <div>
            <div className="doc-draft-container">
              <div className="doc-draft-header">
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                    {activeTemplate?.title || 'Generated Legal Draft'}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Standard Indian Legal Notice Format
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button className="btn btn-sm btn-secondary" onClick={handleCopy} title="Copy Draft">
                    {isCopied ? <Check size={14} style={{ color: '#059669' }} /> : <Copy size={14} />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={handleDownload} title="Download Text">
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={handlePrint} title="Print Document">
                    <Printer size={14} />
                    <span>Print</span>
                  </button>
                  <button className="btn btn-sm btn-gold" onClick={handleSaveToCase} title="Save to Case">
                    <Save size={14} />
                    <span>Save to Case</span>
                  </button>
                </div>
              </div>

              {/* Editable Draft Body */}
              <textarea
                className="doc-draft-body"
                value={generatedDraft}
                onChange={(e) => setGeneratedDraft(e.target.value)}
              />
            </div>

            {/* Mandatory AI Draft Disclaimer */}
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <AlertTriangle size={18} style={{ color: '#d97706', flexShrink: 0 }} />
              <span style={{ fontSize: '0.82rem', color: '#92400e', fontWeight: 500 }}>
                <strong>AI-generated draft — review carefully and seek professional advice when necessary.</strong> Always verify dates, recipient address, and dispatch via Speed Post AD / RPAD for legal admissibility.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
