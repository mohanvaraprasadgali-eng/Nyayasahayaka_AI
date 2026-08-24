import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Search, 
  ShieldCheck, 
  Clock, 
  User, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Filter
} from 'lucide-react';
import { api } from '../services/api';
import { useCaseContext } from '../context/CaseContext';

export const AdminAuditLogsPage = () => {
  const { showToast } = useCaseContext();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.getAuditLogs(actionFilter, roleFilter);
      if (res.success) {
        setLogs(res.logs || []);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, roleFilter]);

  const getActionBadge = (action) => {
    if (action.includes('VIEW_DOCUMENT') || action.includes('DOWNLOAD')) {
      return <span className="badge-sih" style={{ background: '#2563eb', color: '#fff' }}>📄 {action}</span>;
    }
    if (action.includes('LAWYER_ACCEPTED') || action.includes('APPROVED')) {
      return <span className="badge-sih" style={{ background: '#059669', color: '#fff' }}>✓ {action}</span>;
    }
    if (action.includes('PAYMENT')) {
      return <span className="badge-sih" style={{ background: '#10b981', color: '#fff' }}>💳 {action}</span>;
    }
    if (action.includes('UNAUTHORIZED')) {
      return <span className="badge-sih" style={{ background: '#dc2626', color: '#fff' }}>⚠️ {action}</span>;
    }
    return <span className="badge-sih">{action}</span>;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
              Immutable Audit & Access Logs
            </h2>
            <span className="badge-sih" style={{ background: '#059669', color: '#fff' }}>
              {logs.length} Logged Events
            </span>
          </div>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: '#94a3b8' }}>
            Real-time, non-repudiable audit ledger capturing every document access, lawyer assignment, and platform transaction.
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            fetchLogs();
            showToast("Audit logs refreshed!");
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={14} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        padding: '0.85rem 1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#94a3b8' }}>
          <Filter size={15} />
          <span style={{ fontWeight: 600 }}>Filter By:</span>
        </div>

        <select
          className="form-input"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          style={{ maxWidth: '220px', fontSize: '0.82rem' }}
        >
          <option value="">All Action Types</option>
          <option value="VIEW_DOCUMENT">VIEW_DOCUMENT</option>
          <option value="DOWNLOAD_DOCUMENT">DOWNLOAD_DOCUMENT</option>
          <option value="UPLOAD_DOCUMENT">UPLOAD_DOCUMENT</option>
          <option value="LAWYER_ACCEPTED">LAWYER_ACCEPTED</option>
          <option value="CASE_CREATED">CASE_CREATED</option>
          <option value="PAYMENT_COMPLETED">PAYMENT_COMPLETED</option>
          <option value="ADMIN_APPROVED_LAWYER">ADMIN_APPROVED_LAWYER</option>
          <option value="LOGIN">LOGIN</option>
        </select>

        <select
          className="form-input"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ maxWidth: '180px', fontSize: '0.82rem' }}
        >
          <option value="">All Roles</option>
          <option value="citizen">Citizen</option>
          <option value="lawyer">Lawyer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Audit Logs Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading audit logs...</div>
      ) : logs.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Lock size={44} style={{ color: '#64748b', margin: '0 auto 1rem' }} />
          <h4 style={{ margin: '0 0 0.4rem', color: '#f8fafc' }}>No matching audit logs found</h4>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-color)', color: '#94a3b8' }}>
                <th style={{ padding: '0.8rem 1rem' }}>Timestamp</th>
                <th style={{ padding: '0.8rem 1rem' }}>User / Actor</th>
                <th style={{ padding: '0.8rem 1rem' }}>Role</th>
                <th style={{ padding: '0.8rem 1rem' }}>Action</th>
                <th style={{ padding: '0.8rem 1rem' }}>Case / Target</th>
                <th style={{ padding: '0.8rem 1rem' }}>Audit Event Details</th>
                <th style={{ padding: '0.8rem 1rem' }}>IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.8rem 1rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {log.created_at?.slice(0, 16)}
                  </td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 700, color: '#f8fafc' }}>
                    {log.user_name || `User #${log.user_id}`}
                  </td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <span style={{
                      textTransform: 'uppercase',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: log.user_role === 'lawyer' ? '#34d399' : (log.user_role === 'admin' ? '#c084fc' : '#38bdf8')
                    }}>
                      {log.user_role}
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    {getActionBadge(log.action)}
                  </td>
                  <td style={{ padding: '0.8rem 1rem', color: '#cbd5e1' }}>
                    {log.case_id ? `Case #${log.case_id}` : (log.target_type ? `${log.target_type}:${log.target_id}` : 'Platform')}
                  </td>
                  <td style={{ padding: '0.8rem 1rem', color: '#cbd5e1', maxWidth: '300px' }}>
                    {log.details}
                  </td>
                  <td style={{ padding: '0.8rem 1rem', color: '#64748b' }}>
                    {log.ip_address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
