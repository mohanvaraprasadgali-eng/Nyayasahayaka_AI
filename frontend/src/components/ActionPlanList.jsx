import React, { useState } from 'react';
import { CheckCircle, Clock, Building2, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { useCaseContext } from '../context/CaseContext';

export const ActionPlanList = ({ actionSteps = [], onStepUpdate, caseId = null }) => {
  const { showToast, refreshStatsAndCases, setActiveTab } = useCaseContext();
  const [steps, setSteps] = useState(actionSteps);

  const toggleStep = async (step, index) => {
    const newStatus = step.status === 'completed' ? 'pending' : 'completed';
    const updated = [...steps];
    updated[index] = { ...step, status: newStatus };
    setSteps(updated);

    if (step.id) {
      try {
        await api.updateActionStep(step.id, { status: newStatus });
        showToast(newStatus === 'completed' ? `Completed Step ${step.step_order || index + 1}` : `Re-opened Step ${step.step_order || index + 1}`);
        refreshStatsAndCases();
      } catch (err) {
        console.error('Update action step failed', err);
      }
    }

    if (onStepUpdate) onStepUpdate(updated);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <ArrowRight size={20} style={{ color: '#2563EB' }} />
            Your Personalized Legal Action Plan
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Follow these sequential steps to resolve your legal grievance through lawful channels
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const stepNum = step.step_order || index + 1;

          return (
            <div
              key={step.id || index}
              className={`action-step-card ${isCompleted ? 'completed' : ''}`}
            >
              <div className={`step-number-bubble ${isCompleted ? 'completed' : ''}`}>
                {isCompleted ? <CheckCircle size={20} /> : stepNum}
              </div>

              <div className="step-details">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <h4 className="step-title" style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
                    {step.title}
                  </h4>
                  <button
                    className={`btn btn-sm ${isCompleted ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem', flexShrink: 0 }}
                    onClick={() => toggleStep(step, index)}
                  >
                    {isCompleted ? 'Mark Pending' : 'Mark as Complete'}
                  </button>
                </div>

                <p className="step-desc">
                  {step.description}
                </p>

                <div className="step-meta-row">
                  {step.authority && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#1e3e62', fontWeight: 600 }}>
                      <Building2 size={13} />
                      {step.authority}
                    </span>
                  )}

                  {step.deadline && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#d97706', fontWeight: 600 }}>
                      <Calendar size={13} />
                      Deadline: {step.deadline}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
