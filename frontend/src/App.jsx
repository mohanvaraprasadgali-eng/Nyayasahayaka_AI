import React, { useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CaseProvider, useCaseContext } from './context/CaseContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DemoModal } from './components/DemoModal';
import { LegalAidModal } from './components/LegalAidModal';
import { AuthModal } from './components/AuthModal';
import { HackathonDemoTourModal } from './components/HackathonDemoTourModal';
import { LogOut, Scale, ShieldCheck } from 'lucide-react';

// Existing Pages
import { Dashboard } from './pages/Dashboard';
import { ProblemAnalyzer } from './pages/ProblemAnalyzer';
import { DocumentAnalyzer } from './pages/DocumentAnalyzer';
import { DocumentGenerator } from './pages/DocumentGenerator';
import { KnowYourRights } from './pages/KnowYourRights';
import { EvidenceCenter } from './pages/EvidenceCenter';
import { FindHelp } from './pages/FindHelp';
import { CaseTimeline } from './pages/CaseTimeline';
import { RemindersPage } from './pages/RemindersPage';
import { PrivacyCenter } from './pages/PrivacyCenter';

// New Extended Multi-Role Pages
import { CreateCasePage } from './pages/CreateCasePage';
import { CitizenCasesPage } from './pages/CitizenCasesPage';
import { DocumentVaultPage } from './pages/DocumentVaultPage';
import { CitizenPaymentsPage } from './pages/CitizenPaymentsPage';
import { LawyerDashboard } from './pages/LawyerDashboard';
import { LawyerCaseRequests } from './pages/LawyerCaseRequests';
import { LawyerActiveCases } from './pages/LawyerActiveCases';
import { LawyerSubscriptionPage } from './pages/LawyerSubscriptionPage';
import { LawyerProfilePage } from './pages/LawyerProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminPricingPage } from './pages/AdminPricingPage';
import { AdminAuditLogsPage } from './pages/AdminAuditLogsPage';

// ----- Logged-Out Screen -----
// Shown when user explicitly logs out. Prevents back-navigation to protected content.
const LoggedOutScreen = () => {
  const { setShowAuthModal, setAuthMode, switchPersona } = useAuth();

  // Push a new history entry so browser back can't silently return to the app
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const onPopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '3rem 2.5rem',
        maxWidth: '440px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5)'
      }}>
        {/* Logo */}
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          boxShadow: '0 8px 30px rgba(37, 99, 235, 0.4)'
        }}>
          <Scale size={32} style={{ color: '#fff' }} />
        </div>

        {/* Logout Success Indicator */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(5, 150, 105, 0.15)',
          border: '1px solid rgba(5, 150, 105, 0.3)',
          borderRadius: '9999px',
          padding: '0.3rem 0.85rem',
          marginBottom: '1rem'
        }}>
          <ShieldCheck size={14} style={{ color: '#34d399' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399' }}>
            Session Securely Terminated
          </span>
        </div>

        <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
          You've been logged out
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '2rem', lineHeight: 1.6 }}>
          Your session has been securely ended. All authentication tokens and sensitive data have been cleared.
        </p>

        {/* Login Button */}
        <button
          type="button"
          onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
          style={{
            width: '100%',
            padding: '0.85rem',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            color: '#fff',
            border: 'none',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            marginBottom: '0.75rem',
            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)'
          }}
        >
          Login Again
        </button>

        {/* Quick demo access */}
        <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.75rem' }}>
          — or switch to a demo persona —
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { key: 'citizen_ramesh', label: 'Citizen' },
            { key: 'lawyer_priya', label: 'Lawyer' },
            { key: 'admin', label: 'Admin' }
          ].map(p => (
            <button
              key={p.key}
              type="button"
              onClick={() => switchPersona(p.key)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                color: '#cbd5e1',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {p.label} Demo
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const MainLayout = () => {
  const { activeTab, toastMessage, showDemoTourModal, setShowDemoTourModal, setActiveTab } = useCaseContext();
  const { currentUser, isLoggedOut, setShowAuthModal, setAuthMode } = useAuth();

  // If the user has explicitly logged out, show the logout screen (blocks back-navigation to protected content)
  if (isLoggedOut || !currentUser) {
    return (
      <>
        <LoggedOutScreen />
        <AuthModal />
      </>
    );
  }

  const renderActivePage = () => {
    switch (activeTab) {
      // Citizen & Shared Pages
      case 'dashboard':
        return currentUser?.role === 'lawyer' ? <LawyerDashboard /> : (currentUser?.role === 'admin' ? <AdminDashboard /> : <Dashboard />);
      case 'create_case':
        return <CreateCasePage />;
      case 'citizen_cases':
        return <CitizenCasesPage />;
      case 'document_vault':
        return <DocumentVaultPage />;
      case 'citizen_payments':
        return <CitizenPaymentsPage />;

      // Lawyer Pages
      case 'lawyer_dashboard':
        return <LawyerDashboard />;
      case 'lawyer_requests':
        return <LawyerCaseRequests />;
      case 'lawyer_active_cases':
      case 'lawyer_chat':
      case 'lawyer_documents':
        return <LawyerActiveCases />;
      case 'lawyer_subscription':
        return <LawyerSubscriptionPage />;
      case 'lawyer_profile':
        return <LawyerProfilePage />;

      // Admin Pages
      case 'admin_dashboard':
      case 'admin_lawyers':
      case 'admin_cases':
      case 'admin_subscriptions':
        return <AdminDashboard />;
      case 'admin_pricing':
        return <AdminPricingPage />;
      case 'admin_audit_logs':
        return <AdminAuditLogsPage />;

      // Existing Tools (100% Preserved)
      case 'analyzer':
        return <ProblemAnalyzer />;
      case 'doc_analyzer':
        return <DocumentAnalyzer />;
      case 'doc_generator':
        return <DocumentGenerator />;
      case 'know_rights':
        return <KnowYourRights />;
      case 'evidence':
        return <EvidenceCenter />;
      case 'find_help':
        return <FindHelp />;
      case 'timeline':
        return <CaseTimeline />;
      case 'reminders':
        return <RemindersPage />;
      case 'privacy':
        return <PrivacyCenter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: toastMessage.type === 'error' ? '#dc2626' : (toastMessage.type === 'warning' ? '#d97706' : '#059669'),
          color: '#ffffff',
          padding: '0.85rem 1.35rem',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          fontSize: '0.9rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          animation: 'slideUp 0.25s ease'
        }}>
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <Navbar />
        <main className="page-content">
          {renderActivePage()}
        </main>
      </div>

      {/* Overlays / Modals */}
      <DemoModal />
      <LegalAidModal />
      <AuthModal />
      <HackathonDemoTourModal
        isOpen={showDemoTourModal}
        onClose={() => setShowDemoTourModal(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CaseProvider>
          <MainLayout />
        </CaseProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
