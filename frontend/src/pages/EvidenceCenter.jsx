import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, FileText, Upload, FolderCheck, Filter } from 'lucide-react';
import { api } from '../services/api';
import { useCaseContext } from '../context/CaseContext';
import { EvidenceChecklist } from '../components/EvidenceChecklist';

export const EvidenceCenter = () => {
  const { cases, currentCaseId, setCurrentCaseId, refreshStatsAndCases } = useCaseContext();
  const [evidenceItems, setEvidenceItems] = useState([]);
  const [selectedCase, setSelectedCase] = useState(currentCaseId || 1);
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const res = await api.getEvidence(selectedCase);
        if (res.success && res.evidence) {
          setEvidenceItems(res.evidence);
        }
      } catch (e) {
        console.error('Fetch evidence error', e);
      }
    };
    fetchEvidence();
  }, [selectedCase]);

  const activeCaseObj = cases.find((c) => c.id === Number(selectedCase)) || cases[0];

  const filteredItems = evidenceItems.filter((item) => {
    if (categoryFilter === 'All') return true;
    return item.category === categoryFilter;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <CheckSquare size={24} style={{ color: '#2563eb' }} />
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
            Evidence Vault & Checklist Center
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Organize, categorize, and track all essential documents required to substantiate your claim before dispute resolution authorities.
        </p>
      </div>

      {/* Case Selector Filter Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 280 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
              Select Active Case:
            </span>
            <select
              className="form-select"
              value={selectedCase}
              onChange={(e) => {
                const newId = Number(e.target.value);
                setSelectedCase(newId);
                setCurrentCaseId(newId);
              }}
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  Case #{c.id}: {c.title} ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {['All', 'Contract', 'Financial', 'Correspondence', 'Visual Proof', 'Clearance'].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Case Summary Pill */}
      {activeCaseObj && (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e3e62' }}>
              {activeCaseObj.title}
            </h4>
            <span className="badge badge-blue">{activeCaseObj.status}</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#475569' }}>
            {activeCaseObj.description}
          </p>
        </div>
      )}

      {/* Evidence Checklist Component */}
      <EvidenceChecklist
        key={selectedCase}
        evidenceList={filteredItems}
        caseId={selectedCase}
        allowAdd={true}
        onUpdate={(updated) => setEvidenceItems(updated)}
      />
    </div>
  );
};
