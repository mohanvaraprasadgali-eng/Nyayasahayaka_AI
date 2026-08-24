import React, { useState } from 'react';
import { 
  X, 
  User, 
  Briefcase, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCaseContext } from '../context/CaseContext';

export const AuthModal = () => {
  const { showAuthModal, setShowAuthModal, authMode, setAuthMode, authRoleChoice, setAuthRoleChoice, loginWithCredentials, registerUser } = useAuth();
  const { showToast } = useCaseContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    location: 'Madhapur, Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    bar_council_number: '',
    state_bar_council: 'Bar Council of Telangana',
    specialization: 'Civil & Property, Tenancy Law',
    experience_years: 5,
    languages_known: 'English, Telugu, Hindi',
    bio: ''
  });

  if (!showAuthModal) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (authMode === 'login') {
      const res = await loginWithCredentials(formData.email, formData.password);
      setLoading(false);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`);
        setShowAuthModal(false);
      } else {
        setError(res.error || "Login failed. Please check your credentials.");
      }
    } else {
      const payload = {
        ...formData,
        role: authRoleChoice
      };
      const res = await registerUser(payload);
      setLoading(false);
      if (res.success) {
        showToast(
          authRoleChoice === 'lawyer'
            ? "Lawyer registration submitted! Your account is queued for admin verification."
            : "Citizen account registered successfully!"
        );
        setShowAuthModal(false);
      } else {
        setError(res.error || "Registration failed. Please verify the required fields.");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: authRoleChoice === 'lawyer' && authMode === 'register' ? '650px' : '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                {authMode === 'login' ? 'Login to NyayaAI' : 'Create Your Account'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                Secure Legal Rights & Verified Lawyer Assistance
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={() => setShowAuthModal(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Role Selector Tabs if Registering */}
        {authMode === 'register' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', margin: '1rem 0' }}>
            <button
              type="button"
              className={`btn ${authRoleChoice === 'citizen' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setAuthRoleChoice('citizen')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <User size={16} />
              <span>I am a Citizen</span>
            </button>
            <button
              type="button"
              className={`btn ${authRoleChoice === 'lawyer' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setAuthRoleChoice('lawyer')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Briefcase size={16} />
              <span>I am a Lawyer</span>
            </button>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {authMode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: '#cbd5e1' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="form-input"
                placeholder={authRoleChoice === 'lawyer' ? "e.g. Adv. Priya Sharma" : "e.g. Ramesh Kumar"}
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: '#cbd5e1' }}>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              className="form-input"
              placeholder="e.g. yourname@domain.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: '#cbd5e1' }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Lawyer Registration Fields */}
          {authMode === 'register' && authRoleChoice === 'lawyer' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: '#cbd5e1' }}>
                    Bar Council Reg Number *
                  </label>
                  <input
                    type="text"
                    name="bar_council_number"
                    required
                    className="form-input"
                    placeholder="e.g. TS/1402/2016"
                    value={formData.bar_council_number}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: '#cbd5e1' }}>
                    State Bar Council *
                  </label>
                  <input
                    type="text"
                    name="state_bar_council"
                    required
                    className="form-input"
                    placeholder="e.g. Bar Council of Telangana"
                    value={formData.state_bar_council}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: '#cbd5e1' }}>
                    Legal Specialization *
                  </label>
                  <select
                    name="specialization"
                    className="form-input"
                    value={formData.specialization}
                    onChange={handleChange}
                  >
                    <option value="Real Estate & Tenancy">Real Estate & Tenancy</option>
                    <option value="Labour & Employment">Labour & Employment</option>
                    <option value="Consumer Law">Consumer Law</option>
                    <option value="Civil & Property">Civil & Property</option>
                    <option value="Cyber Law & Financial Fraud">Cyber Law & Financial Fraud</option>
                    <option value="Criminal & BNSS Defense">Criminal & BNSS Defense</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: '#cbd5e1' }}>
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    name="experience_years"
                    min="1"
                    max="50"
                    required
                    className="form-input"
                    value={formData.experience_years}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Lawyer Verification Stage Banner */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px dashed #3b82f6',
                borderRadius: '8px',
                padding: '0.85rem',
                fontSize: '0.8rem',
                color: '#93c5fd'
              }}>
                <div style={{ fontWeight: 700, marginBottom: '0.2rem', color: '#60a5fa' }}>
                  🔒 Lawyer Verification Workflow
                </div>
                <div>
                  Registered ➔ Document Review ➔ Admin Verification ➔ Active Advocate. Verification documents are strictly confidential and reviewed only by authorized administrators.
                </div>
              </div>
            </>
          )}

          {authMode === 'register' && authRoleChoice === 'citizen' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: '#cbd5e1' }}>
                  City / Location
                </label>
                <input
                  type="text"
                  name="city"
                  className="form-input"
                  placeholder="e.g. Hyderabad"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: '#cbd5e1' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
            style={{ marginTop: '0.5rem', padding: '0.8rem', fontWeight: 700 }}
          >
            {loading ? "Processing..." : (authMode === 'login' ? "Login to Portal" : "Complete Registration")}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: '#94a3b8' }}>
          {authMode === 'login' ? (
            <div>
              Don't have an account?{' '}
              <button
                type="button"
                className="link-btn"
                style={{ color: '#38bdf8', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setAuthMode('register')}
              >
                Register as Citizen or Lawyer
              </button>
            </div>
          ) : (
            <div>
              Already have an account?{' '}
              <button
                type="button"
                className="link-btn"
                style={{ color: '#38bdf8', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setAuthMode('login')}
              >
                Login here
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
