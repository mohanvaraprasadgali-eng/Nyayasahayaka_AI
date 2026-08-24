import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  UploadCloud, 
  MapPin, 
  Briefcase, 
  Award,
  Globe
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCaseContext } from '../context/CaseContext';

export const LawyerProfilePage = () => {
  const { currentUser } = useAuth();
  const { showToast } = useCaseContext();

  const [profile, setProfile] = useState(null);
  const [verifDocs, setVerifDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadDocType, setUploadDocType] = useState('Practice License');
  const [uploadFileName, setUploadFileName] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.getLawyerProfile();
      if (res.success) {
        setProfile(res.profile);
        setVerifDocs(res.verification_documents || []);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  const handleUploadDoc = async (e) => {
    e.preventDefault();
    if (!uploadFileName.trim()) {
      showToast("Please provide a file name.", "warning");
      return;
    }

    try {
      const res = await api.uploadLawyerVerification(uploadDocType, uploadFileName.trim());
      if (res.success) {
        showToast("Verification document uploaded and queued for admin review!");
        setUploadFileName('');
        fetchProfile();
      }
    } catch (e) {
      showToast("Error uploading verification document", "error");
    }
  };

  const isVerified = profile?.verification_status === 'VERIFIED';

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
        border: '1px solid #3b82f6',
        borderRadius: '16px',
        padding: '1.75rem',
        marginBottom: '1.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.4rem',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
            }}>
              {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "AD"}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
                  {currentUser?.name || "Advocate Priya Sharma"}
                </h2>
                <span className="badge-sih" style={{
                  background: isVerified ? '#059669' : '#d97706',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  {isVerified ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                  <span>{profile?.verification_status || 'PENDING'}</span>
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
                Bar Council: <strong>{profile?.bar_council_number || 'TS/1402/2016'}</strong> ({profile?.state_bar_council || 'Telangana'})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Details Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
          Professional Information & Credentials
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Specialization Area:</span>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#f8fafc', marginTop: '0.2rem' }}>
              {profile?.specialization || 'Civil & Property, Real Estate & Tenancy'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Years of Experience:</span>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#f8fafc', marginTop: '0.2rem' }}>
              {profile?.experience_years || 8} Years Active Practice
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Languages Known:</span>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#f8fafc', marginTop: '0.2rem' }}>
              {profile?.languages_known || 'English, Telugu, Hindi'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Practice City:</span>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#f8fafc', marginTop: '0.2rem' }}>
              {currentUser?.city || 'Hyderabad'}, {currentUser?.state || 'Telangana'}
            </div>
          </div>
        </div>

        {profile?.bio && (
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Professional Biography:</span>
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              {profile.bio}
            </p>
          </div>
        )}
      </div>

      {/* Verification Documents & Admin Review Status */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.8rem', fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
          Verification Documents (Confidential Admin Review)
        </h3>
        <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: '#94a3b8' }}>
          Verification documents are strictly confidential and reviewed only by authorized administrators.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
          {verifDocs.map((doc) => (
            <div
              key={doc.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} className="text-blue-400" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f8fafc' }}>
                    {doc.document_type}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    {doc.file_name} • Uploaded: {doc.uploaded_at?.slice(0, 10)}
                  </div>
                </div>
              </div>

              <span className="badge-sih" style={{
                background: doc.status === 'VERIFIED' ? '#059669' : '#d97706',
                color: '#fff',
                fontSize: '0.72rem'
              }}>
                {doc.status}
              </span>
            </div>
          ))}
        </div>

        {/* Upload Additional Verification Document */}
        <form onSubmit={handleUploadDoc} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <h4 style={{ margin: '0 0 0.6rem', fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
            + Upload Additional Verification Proof
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: '0.6rem', alignItems: 'center' }}>
            <select
              className="form-input"
              value={uploadDocType}
              onChange={(e) => setUploadDocType(e.target.value)}
            >
              <option value="Practice License">Practice License</option>
              <option value="Bar Council Certificate">Bar Certificate</option>
              <option value="ID Proof">Government ID Proof</option>
              <option value="Chamber Proof">Chamber Registration</option>
            </select>

            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Bar_Enrollment_Copy_2026.pdf"
              value={uploadFileName}
              onChange={(e) => setUploadFileName(e.target.value)}
            />

            <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
              Upload Proof
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
