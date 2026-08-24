import React, { useState, useEffect } from 'react';
import { Bell, Plus, Calendar, Clock, CheckCircle2, Trash2, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { useCaseContext } from '../context/CaseContext';

export const RemindersPage = () => {
  const { cases, currentCaseId, showToast, refreshStatsAndCases } = useCaseContext();
  const [reminders, setReminders] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('10:00 AM');
  const [priority, setPriority] = useState('High');
  const [category, setCategory] = useState('Deadline');
  const [caseId, setCaseId] = useState(currentCaseId || 1);

  const fetchReminders = async () => {
    try {
      const res = await api.getReminders();
      if (res.success && res.reminders) {
        setReminders(res.reminders);
      }
    } catch (e) {
      console.error('Fetch reminders error', e);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleToggleComplete = async (rem) => {
    const newCompleted = rem.completed ? 0 : 1;
    try {
      await api.updateReminder(rem.id, { completed: newCompleted });
      showToast(newCompleted ? 'Reminder marked completed' : 'Reminder restored');
      fetchReminders();
      refreshStatsAndCases();
    } catch (e) {
      console.error('Update reminder error', e);
    }
  };

  const handleDelete = async (remId) => {
    try {
      await api.deleteReminder(remId);
      showToast('Reminder deleted');
      fetchReminders();
      refreshStatsAndCases();
    } catch (e) {
      console.error('Delete reminder error', e);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !reminderDate) return;

    try {
      const res = await api.createReminder({
        case_id: caseId,
        title: title.trim(),
        reminder_date: reminderDate,
        reminder_time: reminderTime,
        priority,
        category
      });
      if (res.success) {
        showToast('Legal deadline reminder set!');
        fetchReminders();
        refreshStatsAndCases();
        setShowAddModal(false);
        setTitle('');
        setReminderDate('');
      }
    } catch (e) {
      console.error('Add reminder error', e);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Bell size={24} style={{ color: '#2563eb' }} />
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
              Statutory Deadlines & Reminders
            </h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Never miss critical legal limitation windows (e.g. 15-day notice response, 30-day appeal limits, or hearing dates).
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          <span>Add Legal Reminder</span>
        </button>
      </div>

      {/* Add Reminder Modal / Form */}
      {showAddModal && (
        <div className="card" style={{ marginBottom: '2rem', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e3e62', marginBottom: '1rem' }}>
            Set New Legal Deadline / Follow-up Alert
          </h3>

          <form onSubmit={handleAddSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="form-label">Reminder Title / Milestone</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 15-Day Legal Notice Response Window Expires"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Link to Case</label>
                <select
                  className="form-select"
                  value={caseId}
                  onChange={(e) => setCaseId(Number(e.target.value))}
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      Case #{c.id}: {c.title.slice(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="form-label">Deadline Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Time</label>
                <input
                  type="text"
                  className="form-input"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  placeholder="10:00 AM"
                />
              </div>

              <div>
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="High">High (Strict Limitation)</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Deadline">Statutory Deadline</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Hearing">Hearing / Lok Adalat</option>
                  <option value="Evidence">Evidence Collection</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Reminder
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reminders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {reminders.map((rem) => {
          const isDone = rem.completed === 1;
          return (
            <div
              key={rem.id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.1rem 1.25rem',
                borderLeft: isDone ? '4px solid #cbd5e1' : (rem.priority === 'High' ? '4px solid #dc2626' : '4px solid #f59e0b'),
                background: isDone ? '#f8fafc' : '#ffffff',
                opacity: isDone ? 0.75 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => handleToggleComplete(rem)}
                  style={{ background: 'transparent', color: isDone ? '#059669' : '#cbd5e1' }}
                  title={isDone ? "Restore Reminder" : "Mark as Completed"}
                >
                  <CheckCircle2 size={24} />
                </button>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: isDone ? '#64748b' : '#0f172a',
                      textDecoration: isDone ? 'line-through' : 'none'
                    }}>
                      {rem.title}
                    </h4>
                    <span className={`badge ${rem.priority === 'High' ? 'badge-red' : 'badge-yellow'}`} style={{ fontSize: '0.7rem' }}>
                      {rem.priority} Priority
                    </span>
                    <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                      {rem.category}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem', fontSize: '0.8rem', color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#dc2626', fontWeight: 600 }}>
                      <Calendar size={13} />
                      Due: {rem.reminder_date} at {rem.reminder_time}
                    </span>
                    {rem.case_title && (
                      <span>Case: {rem.case_title}</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(rem.id)}
                className="btn btn-secondary btn-icon-only"
                style={{ color: '#94a3b8' }}
                title="Delete Reminder"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
