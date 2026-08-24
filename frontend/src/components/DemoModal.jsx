import React from 'react';
import { X, Sparkles, ArrowRight, Briefcase, Home, ShieldAlert, ShoppingBag, FileWarning } from 'lucide-react';
import { DEMO_SCENARIOS } from '../services/demoData';
import { useCaseContext } from '../context/CaseContext';
import { useLanguage } from '../context/LanguageContext';

export const DemoModal = () => {
  const { showDemoModal, setShowDemoModal, setActiveTab, setPendingAnalysis } = useCaseContext();
  const { language } = useLanguage();

  if (!showDemoModal) return null;

  const iconMap = {
    Briefcase: Briefcase,
    Home: Home,
    ShieldAlert: ShieldAlert,
    ShoppingBag: ShoppingBag,
    FileWarning: FileWarning
  };

  const handleSelectScenario = (scenario) => {
    setShowDemoModal(false);
    const chosenPrompt = (language === 'te' && scenario.teluguPrompt) ? scenario.teluguPrompt : scenario.prompt;
    setPendingAnalysis({
      prompt: chosenPrompt,
      scenarioId: scenario.id,
      suggestedTemplate: scenario.suggestedTemplate,
      sampleFields: scenario.sampleFields
    });
    setActiveTab('analyzer');
  };

  return (
    <div className="modal-overlay" onClick={() => setShowDemoModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                SIH 2026 Predefined Demo Scenarios
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Select a real-world Indian citizen scenario to test the complete end-to-end legal workflow
              </p>
            </div>
          </div>
          <button
            className="btn btn-secondary btn-icon-only"
            onClick={() => setShowDemoModal(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {DEMO_SCENARIOS.map((item) => {
            const Icon = iconMap[item.icon] || Briefcase;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectScenario(item)}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#2563EB';
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1e3e62',
                    flexShrink: 0
                  }}>
                    <Icon size={20} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                        {item.title}
                      </h4>
                      <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                        {item.category}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
                      {item.description}
                    </p>
                    <div style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 500, marginTop: '0.25rem' }}>
                      Prompt: "{item.prompt}"
                    </div>
                  </div>
                </div>

                <div style={{ color: '#2563eb', flexShrink: 0 }}>
                  <ArrowRight size={20} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
