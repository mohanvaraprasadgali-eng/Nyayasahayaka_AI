import React, { useState } from 'react';
import {
  LayoutDashboard,
  Scale,
  FileSearch,
  FileText,
  ShieldAlert,
  CheckSquare,
  Compass,
  Calendar,
  Bell,
  Lock,
  UserCheck,
  PlusCircle,
  FolderLock,
  MessageSquare,
  CreditCard,
  Briefcase,
  Sliders,
  Shield,
  Zap,
  Coins,
  ClipboardList,
  LogOut,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCaseContext } from '../context/CaseContext';
import { useAuth } from '../context/AuthContext';

// Logout Confirmation Dialog
const LogoutConfirmDialog = ({ onConfirm, onCancel }) => (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <div style={{
      background: '#fff',
      borderRadius: '14px',
      padding: '2rem',
      width: '340px',
      maxWidth: '90vw',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      textAlign: 'center'
    }}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: 'rgba(239, 68, 68, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem'
      }}>
        <LogOut size={24} style={{ color: '#ef4444' }} />
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
        Confirm Logout
      </h3>
      <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        Are you sure you want to logout? Your session will be securely terminated.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            border: '1.5px solid #e2e8f0',
            background: '#f8fafc',
            color: '#475569',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          style={{
            flex: 1,
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  </div>
);

export const Sidebar = () => {
  const { t } = useLanguage();
  const { activeTab, setActiveTab, stats, isSidebarOpen, setIsSidebarOpen } = useCaseContext();
  const { currentUser, logout } = useAuth();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

  const role = currentUser?.role || 'citizen';

  // Citizen Nav Items
  const citizenNav = [
    { id: 'dashboard', label: t('nav_dashboard'), icon: LayoutDashboard, badge: null },
    { id: 'create_case', label: 'Create Legal Case', icon: PlusCircle, badge: 'AI' },
    { id: 'citizen_cases', label: 'My Cases', icon: Scale, badge: stats?.total_cases || null },
    { id: 'document_vault', label: 'Private Document Vault', icon: FolderLock, badge: 'Secured' },
    { id: 'analyzer', label: t('nav_ask_problem'), icon: Zap, badge: 'AI' },
    { id: 'doc_analyzer', label: t('nav_doc_analyzer'), icon: FileSearch, badge: null },
    { id: 'doc_generator', label: t('nav_doc_generator'), icon: FileText, badge: 'Draft' },
    { id: 'know_rights', label: t('nav_know_rights'), icon: ShieldAlert, badge: null },
    { id: 'evidence', label: t('nav_evidence'), icon: CheckSquare, badge: stats?.total_evidence_count ? `${stats.evidence_collected_count}/${stats.total_evidence_count}` : null },
    { id: 'find_help', label: t('nav_find_help'), icon: Compass, badge: 'Govt' },
    { id: 'citizen_payments', label: 'Payments & Receipts', icon: CreditCard, badge: null },
    { id: 'reminders', label: t('nav_reminders'), icon: Bell, badge: stats?.upcoming_deadlines || null },
    { id: 'privacy', label: t('nav_privacy'), icon: Shield, badge: 'Vault' }
  ];

  // Lawyer Nav Items
  const lawyerNav = [
    { id: 'lawyer_dashboard', label: 'Lawyer Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'lawyer_requests', label: 'Case Requests', icon: ClipboardList, badge: 'New' },
    { id: 'lawyer_active_cases', label: 'Active Cases', icon: Briefcase, badge: 'Active' },
    { id: 'document_vault', label: 'Case Documents Vault', icon: FolderLock, badge: '🔒 Private' },
    { id: 'lawyer_chat', label: 'Client Messages', icon: MessageSquare, badge: null },
    { id: 'lawyer_subscription', label: 'Subscription & Renewal', icon: Zap, badge: 'Pro' },
    { id: 'citizen_payments', label: 'Earnings & Payments', icon: CreditCard, badge: null },
    { id: 'lawyer_profile', label: 'Professional Profile', icon: UserCheck, badge: currentUser?.lawyer_profile?.verification_status === 'VERIFIED' ? 'Verified' : 'Pending' },
    { id: 'know_rights', label: 'India Code Reference', icon: ShieldAlert, badge: null },
    { id: 'doc_generator', label: 'Legal Notice Drafts', icon: FileText, badge: null }
  ];

  // Admin Nav Items
  const adminNav = [
    { id: 'admin_dashboard', label: 'Admin Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'admin_lawyers', label: 'Lawyer Verification', icon: UserCheck, badge: 'Review' },
    { id: 'citizen_cases', label: 'Platform Cases', icon: Scale, badge: null },
    { id: 'admin_pricing', label: 'Pricing Configuration', icon: Sliders, badge: 'Fees' },
    { id: 'citizen_payments', label: 'Transaction Ledger', icon: CreditCard, badge: null },
    { id: 'admin_audit_logs', label: 'Immutable Audit Logs', icon: Lock, badge: 'Secured' },
    { id: 'find_help', label: 'Authorities Directory', icon: Compass, badge: null }
  ];

  const currentNav = role === 'admin' ? adminNav : (role === 'lawyer' ? lawyerNav : citizenNav);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    setShowLogoutSuccess(true);

    // Show "Logged out successfully" for 1.5s, then perform logout
    setTimeout(() => {
      setShowLogoutSuccess(false);
      logout();
      // Redirect to dashboard/login state (app will re-render to login view)
      setActiveTab('dashboard');
    }, 1500);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const getInitials = (name) => {
    if (!name) return "US";
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getRoleLabel = () => {
    if (role === 'admin') return 'Platform Administrator';
    if (role === 'lawyer') return `Advocate (${currentUser?.city || 'Hyderabad'})`;
    return `Citizen (${currentUser?.city || 'Hyderabad'})`;
  };

  return (
    <>
      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <LogoutConfirmDialog
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}

      {/* Logout Success Toast */}
      {showLogoutSuccess && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'linear-gradient(135deg, #059669, #047857)',
          color: '#fff',
          padding: '0.85rem 1.5rem',
          borderRadius: '10px',
          fontWeight: 700,
          fontSize: '0.9rem',
          zIndex: 99999,
          boxShadow: '0 8px 30px rgba(5, 150, 105, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'slideInRight 0.3s ease'
        }}>
          <span>✓</span>
          Logged out successfully.
        </div>
      )}

      <aside className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}>
            <Scale size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#fff', letterSpacing: '-0.02em' }}>
              NyayaAI
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              {role.toUpperCase()} PORTAL
            </div>
          </div>
        </div>

        <div className="sidebar-nav-list">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            );
          })}
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-profile-card">
            <div className="profile-avatar">
              {getInitials(currentUser?.name)}
            </div>
            <div className="profile-details">
              <div className="profile-name">{currentUser?.name || "Ramesh Kumar"}</div>
              <div className="profile-role">{getRoleLabel()}</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ margin: '0.5rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }} />

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogoutClick}
            title="Logout — Securely end your session"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.6rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              background: 'rgba(239, 68, 68, 0.07)',
              color: '#fca5a5',
              fontWeight: 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '0.01em'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)';
              e.currentTarget.style.color = '#f87171';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.45)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.07)';
              e.currentTarget.style.color = '#fca5a5';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
