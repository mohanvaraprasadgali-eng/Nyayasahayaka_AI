import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
  Send,
  Building2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';
import { useCaseContext } from '../context/CaseContext';

export const CaseTimeline = () => {
  const { cases, currentCaseId, setCurrentCaseId, showToast, refreshStatsAndCases, setActiveTab } = useCaseContext();
  const [caseDetail, setCaseDetail] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventType, setNewEventType] = useState('action');
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0]);

  const activeCaseId = currentCaseId || (cases[0]?.id || 1);

  const fetchDetail = async (id) => {
    try {
      const res = await api.getCaseDetail(id);
      if (res.success && res.case) {
        setCaseDetail(res.case);
      }
    } catch (e) {
      console.error('Fetch case detail error', e);
    }
  };

  useEffect(() => {
    if (activeCaseId) {
      fetchDetail(activeCaseId);
    }
  }, [activeCaseId]);

  const handleStatusChange = async (newStatus) => {
    try {
      await api.updateCase(activeCaseId, { status: newStatus });
      showToast(`Case status updated to "${newStatus}"`);
      fetchDetail(activeCaseId);
      refreshStatsAndCases();
    } catch (e) {
      console.error('Update status error', e);
    }
  };

  const handleAddEventSubmit = async (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    try {
      await api.addTimelineEvent(activeCaseId, {
        title: newEventTitle.trim(),
        description: newEventDesc.trim(),
        event_type: newEventType,
        event_date: newEventDate
      });
      showToast('Event added to Case Timeline');
      fetchDetail(activeCaseId);
      setShowAddEvent(false);
      setNewEventTitle('');
      setNewEventDesc('');
    } catch (err) {
      console.error('Add event error:', err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Calendar size={24} style={{ color: '#2563eb' }} />
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
            Case Progression Timeline
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Track the chronological progress of your dispute from initial AI diagnosis to notice dispatch, response tracking, and escalation.
        </p>
      </div>

      {/* Case Selector & Status Banner */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 280 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
              Active Case:
            </span>
            <select
              className="form-select"
              value={activeCaseId}
              onChange={(e) => {
                const id = Number(e.target.value);
                setCurrentCaseId(id);
                fetchDetail(id);
              }}
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  Case #{c.id}: {c.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
              Status:
            </span>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={caseDetail?.status || 'Open'}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Notice Sent">Notice Sent</option>
              <option value="Under Hearing">Under Hearing</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <button
              className="btn btn-sm btn-primary"
              onClick={() => setShowAddEvent(!showAddEvent)}
            >
              <Plus size={14} />
              Add Timeline Event
            </button>
          </div>
        </div>

        {caseDetail && (
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              {caseDetail.title}
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
              {caseDetail.description}
            </p>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#64748b', flexWrap: 'wrap' }}>
              <span>Category: <strong>{caseDetail.category}</strong></span>
              <span>Applicable Laws: <strong>{caseDetail.applicable_laws || 'Indian Statutory Law'}</strong></span>
              <span>Created: <strong>{caseDetail.created_at}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Add Event Form */}
      {showAddEvent && (
        <form onSubmit={handleAddEventSubmit} className="card" style={{ marginBottom: '1.5rem', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3e62', marginBottom: '0.75rem' }}>
            Log New Milestone / Timeline Event
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Event Title (e.g. Received Postal AD Card, Speed Post Delivered)"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              required
            />
            <select
              className="form-select"
              value={newEventType}
              onChange={(e) => setNewEventType(e.target.value)}
            >
              <option value="action">Action Taken</option>
              <option value="notice_generated">Notice Generated</option>
              <option value="submitted">Dispatched / Submitted</option>
              <option value="hearing">Hearing / Mediation</option>
              <option value="resolved">Resolved</option>
            </select>
            <input
              type="date"
              className="form-input"
              value={newEventDate}
              onChange={(e) => setNewEventDate(e.target.value)}
              required
            />
          </div>

          <textarea
            className="form-textarea"
            rows={2}
            placeholder="Event details or notes..."
            value={newEventDesc}
            onChange={(e) => setNewEventDesc(e.target.value)}
            style={{ marginBottom: '0.75rem' }}
          />

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-sm btn-primary">Save Event</button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowAddEvent(false)}>Cancel</button>
          </div>
        </form>
      )}

      {/* Vertical Timeline Progression */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>
          Chronological Event History
        </h3>

        {caseDetail?.timeline && caseDetail.timeline.length > 0 ? (
          <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            {/* Vertical Line */}
            <div style={{
              position: 'absolute',
              left: '9px',
              top: '12px',
              bottom: '12px',
              width: '2px',
              background: '#cbd5e1'
            }} />

            {caseDetail.timeline.map((evt, idx) => (
              <div key={evt.id || idx} style={{ position: 'relative', marginBottom: '1.75rem' }}>
                {/* Node Bullet */}
                <div style={{
                  position: 'absolute',
                  left: '-2rem',
                  top: '2px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#2563eb',
                  border: '3px solid #ffffff',
                  boxShadow: '0 0 0 2px #93c5fd'
                }} />

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                      {evt.title}
                    </h4>
                    <span className="badge badge-gray" style={{ fontSize: '0.75rem' }}>
                      {evt.event_date}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.4 }}>
                    {evt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
            No timeline events recorded yet. Click "Add Timeline Event" to start logging milestones.
          </div>
        )}
      </div>
    </div>
  );
};
