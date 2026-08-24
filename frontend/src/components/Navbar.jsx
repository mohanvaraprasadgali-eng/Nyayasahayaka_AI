import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  Menu, 
  X, 
  Bell, 
  User, 
  ChevronDown, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Shield,
  Briefcase,
  PlayCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCaseContext } from '../context/CaseContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { setShowDemoModal, setShowLegalAidModal, isSidebarOpen, setIsSidebarOpen, setShowDemoTourModal } = useCaseContext();
  const { currentUser, switchPersona, setShowAuthModal, setAuthMode, setAuthRoleChoice } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await api.getNotifications();
      if (res.success) {
        setNotifications(res.notifications);
        setUnreadCount(res.unread_count);
      }
    } catch (e) {
      // quiet fail
    }
  };

  useEffect(() => {
    fetchNotes();
    const timer = setInterval(fetchNotes, 15000);
    return () => clearInterval(timer);
  }, [currentUser]);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setUnreadCount(0);
      fetchNotes();
    } catch (e) {}
  };

  const handlePersonaSelect = async (personaKey) => {
    await switchPersona(personaKey);
    setShowPersonaMenu(false);
  };

  const roleDisplay = () => {
    if (!currentUser) return "Guest";
    if (currentUser.role === 'admin') return "🛡️ Platform Admin";
    if (currentUser.role === 'lawyer') {
      const isVerif = currentUser.lawyer_profile?.verification_status === 'VERIFIED';
      return isVerif ? "⚖️ Verified Advocate" : "⏳ Advocate (Pending Review)";
    }
    return "👤 Citizen";
  };

  return (
    <header className="navbar-header">
      <div className="navbar-left">
        <button
          className="mobile-menu-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="brand-badge-seal">
          <div className="brand-logo-icon">
            <Scale size={22} strokeWidth={2.4} />
          </div>
          <div className="brand-titles">
            <h1>
              NyayaAI
              <span className="brand-sih-tag">SIH 2026 Platform</span>
            </h1>
          </div>
        </div>

        <div className="navbar-usp-banner">
          <Sparkles size={14} className="usp-highlight" />
          <span>“From Legal Confusion to the Right Next Step.”</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* 1-Click End-to-End Demo Journey button */}
        <button
          className="btn btn-accent btn-sm demo-journey-btn"
          onClick={() => setShowDemoTourModal(true)}
          title="Start 1-Click Interactive Hackathon Demo Flow"
          style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#1e1b4b', fontWeight: 800 }}
        >
          <PlayCircle size={16} />
          <span>Demo Journey</span>
        </button>

        {/* 1-Click Persona Switcher for Evaluators */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: '#3b82f6', background: 'rgba(59, 130, 246, 0.08)' }}
            title="Switch User Persona (Citizen / Lawyer / Admin)"
          >
            <User size={15} className="text-blue-500" />
            <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{roleDisplay()}</span>
            <ChevronDown size={14} />
          </button>

          {showPersonaMenu && (
            <div className="persona-dropdown-menu">
              <div className="dropdown-header">
                <span>Select Test Persona</span>
                <span className="badge-sih">SIH Evaluator</span>
              </div>
              <button className="persona-option" onClick={() => handlePersonaSelect('citizen_ramesh')}>
                <span className="persona-avatar">RK</span>
                <div className="persona-info">
                  <span className="persona-name">Ramesh Kumar (Citizen)</span>
                  <span className="persona-role">Case #1: Security Deposit Dispute</span>
                </div>
              </button>
              <button className="persona-option" onClick={() => handlePersonaSelect('citizen_sunita')}>
                <span className="persona-avatar">SR</span>
                <div className="persona-info">
                  <span className="persona-name">Sunita Rao (Citizen)</span>
                  <span className="persona-role">Case #2: Unpaid Salary Dispute (Matching)</span>
                </div>
              </button>
              <button className="persona-option" onClick={() => handlePersonaSelect('lawyer_priya')}>
                <span className="persona-avatar" style={{ background: '#059669' }}>PS</span>
                <div className="persona-info">
                  <span className="persona-name">Adv. Priya Sharma (Verified Lawyer)</span>
                  <span className="persona-role">Pro Tier • 8 Yrs Exp • Assigned to Case #1</span>
                </div>
              </button>
              <button className="persona-option" onClick={() => handlePersonaSelect('lawyer_rahul')}>
                <span className="persona-avatar" style={{ background: '#d97706' }}>RK</span>
                <div className="persona-info">
                  <span className="persona-name">Adv. Rahul Kumar (Expiring Soon)</span>
                  <span className="persona-role">Basic Tier • 5 Days Left to Renew</span>
                </div>
              </button>
              <button className="persona-option" onClick={() => handlePersonaSelect('lawyer_amit')}>
                <span className="persona-avatar" style={{ background: '#64748b' }}>AV</span>
                <div className="persona-info">
                  <span className="persona-name">Adv. Amit Verma (Pending Lawyer)</span>
                  <span className="persona-role">Awaiting Admin Verification Review</span>
                </div>
              </button>
              <button className="persona-option" onClick={() => handlePersonaSelect('admin')}>
                <span className="persona-avatar" style={{ background: '#7c3aed' }}>AD</span>
                <div className="persona-info">
                  <span className="persona-name">Legal Admin HQ</span>
                  <span className="persona-role">Lawyer Approvals • Pricing • Audit Logs</span>
                </div>
              </button>

              <div style={{ borderTop: '1px solid var(--border-color)', padding: '0.4rem', display: 'flex', gap: '0.3rem' }}>
                <button
                  className="btn btn-secondary btn-xs"
                  style={{ flex: 1, fontSize: '0.75rem' }}
                  onClick={() => {
                    setShowPersonaMenu(false);
                    setAuthMode('register');
                    setAuthRoleChoice('citizen');
                    setShowAuthModal(true);
                  }}
                >
                  + New Citizen
                </button>
                <button
                  className="btn btn-secondary btn-xs"
                  style={{ flex: 1, fontSize: '0.75rem' }}
                  onClick={() => {
                    setShowPersonaMenu(false);
                    setAuthMode('register');
                    setAuthRoleChoice('lawyer');
                    setShowAuthModal(true);
                  }}
                >
                  + New Lawyer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* In-App Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowNotifications(!showNotifications)}
            title="In-App Notifications"
            style={{ position: 'relative', padding: '0.5rem 0.65rem' }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="nav-notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown-menu">
              <div className="notification-header">
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</span>
                {unreadCount > 0 && (
                  <button className="mark-all-read-btn" onClick={handleMarkAllRead}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="notification-empty">No notifications yet.</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`notification-item ${n.is_read ? 'read' : 'unread'}`}>
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-body">{n.message}</div>
                      <div className="notif-time">{n.created_at?.slice(0, 16)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* NALSA Legal Aid Screener button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowLegalAidModal(true)}
          title="Check eligibility for 100% Free Government Legal Aid"
        >
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>{t('legal_aid_screener')}</span>
        </button>

        {/* Multilingual Selector (English / Telugu) */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={toggleLanguage}
          title="Toggle English / తెలుగు Language"
        >
          <Globe size={15} />
          <span style={{ fontWeight: 700 }}>
            {language === 'en' ? 'తెలుగు (TE)' : 'English (EN)'}
          </span>
        </button>
      </div>
    </header>
  );
};
