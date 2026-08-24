import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const CaseContext = createContext();

export const CaseProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentCaseId, setCurrentCaseId] = useState(1);
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState({
    total_cases: 2,
    total_documents: 3,
    pending_actions: 4,
    upcoming_deadlines: 2,
    evidence_collected_percentage: 80
  });
  const [pendingAnalysis, setPendingAnalysis] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showLegalAidModal, setShowLegalAidModal] = useState(false);
  const [showDemoTourModal, setShowDemoTourModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const refreshStatsAndCases = async () => {
    try {
      const statsRes = await api.getDashboardStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
      const casesRes = await api.getCases();
      if (casesRes.success) {
        setCases(casesRes.cases);
        if (casesRes.cases.length > 0 && !currentCaseId) {
          setCurrentCaseId(casesRes.cases[0].id);
        }
      }
    } catch (e) {
      console.error('Error refreshing stats & cases:', e);
    }
  };

  useEffect(() => {
    refreshStatsAndCases();
  }, []);

  return (
    <CaseContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentCaseId,
        setCurrentCaseId,
        cases,
        setCases,
        stats,
        setStats,
        pendingAnalysis,
        setPendingAnalysis,
        refreshStatsAndCases,
        toastMessage,
        showToast,
        showDemoModal,
        setShowDemoModal,
        showLegalAidModal,
        setShowLegalAidModal,
        showDemoTourModal,
        setShowDemoTourModal,
        isSidebarOpen,
        setIsSidebarOpen
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useCaseContext = () => useContext(CaseContext);
