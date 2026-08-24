import React, { useState } from 'react';
import { Check, Plus, Trash2, FileText, Upload, AlertCircle, Info } from 'lucide-react';
import { api } from '../services/api';
import { useCaseContext } from '../context/CaseContext';

export const EvidenceChecklist = ({ evidenceList = [], onUpdate, caseId = null, allowAdd = true }) => {
  const { showToast, refreshStatsAndCases } = useCaseContext();
  const [items, setItems] = useState(evidenceList);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('General');
  const [newItemNotes, setNewItemNotes] = useState('');

  const total = items.length;
  const collectedCount = items.filter(i => i.status === 'collected').length;
  const percentage = total > 0 ? Math.round((collectedCount / total) * 100) : 0;

  const toggleStatus = async (item, index) => {
    const newStatus = item.status === 'collected' ? 'pending' : 'collected';
    const updated = [...items];
    updated[index] = { ...item, status: newStatus };
    setItems(updated);

    if (item.id) {
      try {
        await api.updateEvidence(item.id, { status: newStatus });
        refreshStatsAndCases();
      } catch (e) {
        console.error('Failed to update evidence on server', e);
      }
    }
    if (onUpdate) onUpdate(updated);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem = {
      name: newItemName.trim(),
      category: newItemCategory,
      importance: 'Supporting',
      status: 'pending',
      notes: newItemNotes.trim()
    };

    if (caseId) {
      try {
        const res = await api.addEvidence({ ...newItem, case_id: caseId });
        if (res.success) {
          newItem.id = res.id;
          showToast('Evidence item added to case vault');
          refreshStatsAndCases();
        }
      } catch (err) {
        console.error('Add evidence error:', err);
      }
    }

    const updated = [...items, newItem];
    setItems(updated);
    if (onUpdate) onUpdate(updated);

    setNewItemName('');
    setNewItemNotes('');
    setShowAddForm(false);
  };

  const handleDeleteItem = async (item, index) => {
    if (item.id) {
      try {
        await api.updateEvidence(item.id, { status: 'deleted' }); // or delete endpoint
        refreshStatsAndCases();
      } catch (e) {
        console.error('Delete evidence error:', e);
      }
    }
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    if (onUpdate) onUpdate(updated);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <FileText size={20} style={{ color: '#2563EB' }} />
            Evidence & Document Checklist
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Strengthen your case by collecting and verifying necessary documents
          </span>
        </div>

        {allowAdd && (
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={14} />
            Add Custom Evidence
          </button>
        )}
      </div>

      {/* Evidence Completeness Progress Meter */}
      <div className="evidence-progress-header">
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
          Evidence Completeness: <span style={{ color: '#059669' }}>{collectedCount} / {total} collected ({percentage}%)</span>
        </span>
        <span className="badge badge-gray">
          {percentage === 100 ? 'Ready for Legal Action' : 'Collection in Progress'}
        </span>
      </div>

      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
      </div>

      {/* Add form */}
      {showAddForm && (
        <form onSubmit={handleAddItem} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Evidence Name (e.g. WhatsApp Chat Export, Bank Stamp)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              required
            />
            <select
              className="form-select"
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Financial">Financial</option>
              <option value="Contract">Contract</option>
              <option value="Correspondence">Correspondence</option>
              <option value="Visual Proof">Visual Proof</option>
            </select>
          </div>
          <input
            type="text"
            className="form-input"
            placeholder="Notes on where to obtain this document (optional)"
            value={newItemNotes}
            onChange={(e) => setNewItemNotes(e.target.value)}
            style={{ marginBottom: '0.75rem' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-sm btn-primary">Add Item</button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {/* Evidence items list */}
      <div className="evidence-list">
        {items.map((item, index) => {
          const isCollected = item.status === 'collected';
          return (
            <div
              key={item.id || index}
              className={`evidence-item-row ${isCollected ? 'collected' : ''}`}
            >
              <div className="evidence-item-left">
                <button
                  type="button"
                  className={`custom-checkbox ${isCollected ? 'checked' : ''}`}
                  onClick={() => toggleStatus(item, index)}
                  title={isCollected ? "Mark as pending" : "Mark as collected"}
                >
                  {isCollected && <Check size={14} strokeWidth={3} />}
                </button>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      color: isCollected ? '#065f46' : '#0f172a',
                      textDecoration: isCollected ? 'line-through' : 'none'
                    }}>
                      {item.name}
                    </span>
                    <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                      {item.category || 'General'}
                    </span>
                    {item.importance === 'Essential' && (
                      <span className="badge badge-yellow" style={{ fontSize: '0.68rem' }}>
                        Essential
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge ${isCollected ? 'badge-green' : 'badge-yellow'}`}>
                  {isCollected ? 'Collected' : 'Pending'}
                </span>
                {allowAdd && (
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item, index)}
                    className="btn btn-sm"
                    style={{ color: '#94a3b8', padding: '4px' }}
                    title="Delete item"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
