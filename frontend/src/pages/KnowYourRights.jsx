import React, { useState } from 'react';
import { Shield, Search, ExternalLink, ShieldCheck, BookOpen, AlertCircle, Globe } from 'lucide-react';
import { api } from '../services/api';
import { LegalSourceCard } from '../components/LegalSourceCard';
import { useLanguage } from '../context/LanguageContext';

// Verified Official Government Resources — matched by legal category
const OFFICIAL_RESOURCES = [
  {
    id: 'nalsa',
    name: 'National Legal Services Authority (NALSA)',
    category: 'Free Legal Aid',
    description: 'Provides free legal aid and representation to eligible citizens including women, children, SC/ST, persons with disabilities, and individuals below income threshold under Sec 12, Legal Services Authorities Act 1987.',
    website: 'https://nalsa.gov.in',
    icon: '⚖️',
    isOfficial: true,
    domain: 'nalsa.gov.in'
  },
  {
    id: 'cybercrime',
    name: 'National Cyber Crime Reporting Portal',
    category: 'Cyber Crime',
    description: 'Official I4C portal under Ministry of Home Affairs for reporting online fraud, financial cyber crime, phishing, UPI/banking fraud. Dial 1930 for emergency financial fraud freeze.',
    website: 'https://cybercrime.gov.in',
    icon: '🛡️',
    isOfficial: true,
    domain: 'cybercrime.gov.in'
  },
  {
    id: 'nch',
    name: 'National Consumer Helpline (NCH)',
    category: 'Consumer Rights',
    description: 'Official helpline (1800-11-4000 / 1915) for consumer grievances against defective goods, service deficiencies, unfair trade practices, and e-commerce disputes under Consumer Protection Act 2019.',
    website: 'https://consumerhelpline.gov.in',
    icon: '🛒',
    isOfficial: true,
    domain: 'consumerhelpline.gov.in'
  },
  {
    id: 'edaakhil',
    name: 'E-Daakhil — Online Consumer Forum',
    category: 'Consumer Rights',
    description: 'File consumer complaints online before District, State, and National Consumer Disputes Redressal Commissions (CDRC). No physical presence required for filing.',
    website: 'https://edaakhil.nic.in',
    icon: '📋',
    isOfficial: true,
    domain: 'edaakhil.nic.in'
  },
  {
    id: 'indiacode',
    name: 'India Code — Official Digital Repository of Central Acts',
    category: 'Legal Reference',
    description: 'Official repository of all Central Acts and subordinate legislation published by the Legislative Department, Ministry of Law and Justice, Government of India.',
    website: 'https://www.indiacode.nic.in',
    icon: '📚',
    isOfficial: true,
    domain: 'indiacode.nic.in'
  },
  {
    id: 'doj',
    name: 'Department of Justice — Ministry of Law & Justice',
    category: 'Legal Aid & Justice',
    description: 'Oversees legal aid schemes, Tele-Law services, Nyaya Mitra programme, and access to justice initiatives under the Government of India.',
    website: 'https://doj.gov.in',
    icon: '🏛️',
    isOfficial: true,
    domain: 'doj.gov.in'
  },
  {
    id: 'telelaw',
    name: 'Tele-Law Service — Common Service Centres',
    category: 'Free Legal Aid',
    description: 'Access legal advice from empanelled lawyers via video conference at CSC centres. Available in all districts. Especially useful for rural and marginalized citizens.',
    website: 'https://tele-law.in',
    icon: '📞',
    isOfficial: true,
    domain: 'tele-law.in'
  },
  {
    id: 'rti',
    name: 'RTI Online — Right to Information Portal',
    category: 'RTI',
    description: 'File RTI applications online to Central Public Information Officers (CPIOs) under all central government ministries and departments.',
    website: 'https://rtionline.gov.in',
    icon: '📄',
    isOfficial: true,
    domain: 'rtionline.gov.in'
  },
  {
    id: 'cic',
    name: 'Central Information Commission (CIC)',
    category: 'RTI',
    description: 'File second appeals against RTI refusals or unsatisfactory responses from Central Public Authorities before the Central Information Commission.',
    website: 'https://cic.gov.in',
    icon: '🔍',
    isOfficial: true,
    domain: 'cic.gov.in'
  },
  {
    id: 'labour',
    name: 'Ministry of Labour & Employment',
    category: 'Labour Rights',
    description: 'Access central government schemes, wage-related acts, EPFO grievances, and the Shram Suvidha portal for employment and labour-related matters.',
    website: 'https://labour.gov.in',
    icon: '👷',
    isOfficial: true,
    domain: 'labour.gov.in'
  },
  {
    id: 'mohua',
    name: 'Ministry of Housing & Urban Affairs — Model Tenancy Act',
    category: 'Housing / Tenancy',
    description: 'Official source for the Model Tenancy Act 2021, guidelines on rent agreements, security deposits, and eviction procedures.',
    website: 'https://mohua.gov.in',
    icon: '🏠',
    isOfficial: true,
    domain: 'mohua.gov.in'
  },
  {
    id: 'mha',
    name: 'Ministry of Home Affairs — Police / FIR',
    category: 'Police / Criminal',
    description: 'Central authority overseeing law enforcement, BNSS/CrPC provisions for FIR filing, and police grievance redressal mechanisms.',
    website: 'https://www.mha.gov.in',
    icon: '👮',
    isOfficial: true,
    domain: 'mha.gov.in'
  }
];

const OfficialResourceCard = ({ resource }) => {
  const [unavailable, setUnavailable] = useState(false);

  const handleVisit = () => {
    if (!resource.website) {
      setUnavailable(true);
      return;
    }
    window.open(resource.website, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="card" style={{
      padding: '1.25rem',
      borderTop: `3px solid ${resource.isOfficial ? '#059669' : '#f59e0b'}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '220px'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.3rem' }}>{resource.icon}</span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              background: 'rgba(37, 99, 235, 0.1)',
              color: '#2563eb',
              border: '1px solid rgba(37, 99, 235, 0.2)'
            }}>
              {resource.category}
            </span>
          </div>
          {resource.isOfficial && (
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              background: 'rgba(5, 150, 105, 0.08)',
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
              border: '1px solid rgba(5, 150, 105, 0.3)'
            }}>
              <ShieldCheck size={10} />
              Verified Official
            </span>
          )}
        </div>

        <h4 style={{ fontSize: '0.97rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0' }}>
          {resource.name}
        </h4>

        <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: '0.3rem 0 0.8rem' }}>
          {resource.description}
        </p>

        {resource.website && (
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.6rem', fontFamily: 'monospace' }}>
            🔗 {resource.domain}
          </div>
        )}
      </div>

      <div>
        {unavailable ? (
          <div style={{
            fontSize: '0.78rem',
            color: '#dc2626',
            background: 'rgba(220, 38, 38, 0.06)',
            border: '1px solid rgba(220, 38, 38, 0.2)',
            borderRadius: '6px',
            padding: '0.5rem 0.75rem',
            marginBottom: '0.5rem'
          }}>
            <AlertCircle size={13} style={{ display: 'inline', marginRight: '4px' }} />
            Official website is currently unavailable. Please try again later.
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleVisit}
          style={{
            width: '100%',
            padding: '0.55rem 0.85rem',
            borderRadius: '8px',
            background: resource.isOfficial ? 'linear-gradient(135deg, #059669, #047857)' : '#f1f5f9',
            color: resource.isOfficial ? '#fff' : '#334155',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            transition: 'opacity 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          <Globe size={14} />
          Visit Official Website
          <ExternalLink size={12} />
        </button>
      </div>
    </div>
  );
};

export const KnowYourRights = () => {
  const { t } = useLanguage();
  const [sources, setSources] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState('All');
  const [activeSection, setActiveSection] = React.useState('resources'); // 'resources' | 'rights'
  const [resourceFilter, setResourceFilter] = React.useState('All');

  React.useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await api.getLegalSources();
        if (res.success && res.sources) {
          setSources(res.sources);
        }
      } catch (e) {
        console.error('Fetch legal sources error', e);
      }
    };
    fetchSources();
  }, []);

  const categories = ['All', 'Payment of Wages', 'Tenancy', 'Consumer', 'Cyber', 'Police', 'RTI', 'Legal Aid'];
  const resourceCategories = ['All', 'Free Legal Aid', 'Cyber Crime', 'Consumer Rights', 'Labour Rights', 'Housing / Tenancy', 'RTI', 'Legal Reference', 'Police / Criminal', 'Legal Aid & Justice'];

  const filteredSources = sources.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.act_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedFilter === 'All') return matchSearch;
    return matchSearch && (s.title.includes(selectedFilter) || s.act_name.includes(selectedFilter));
  });

  const filteredResources = OFFICIAL_RESOURCES.filter(r =>
    resourceFilter === 'All' ? true : r.category === resourceFilter
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Shield size={24} style={{ color: '#2563eb' }} />
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
            Know Your Rights & Official Legal Resources
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Verified Indian statutory rights indexed against official India Code repositories, and direct links to official government legal portals.
        </p>
      </div>

      {/* Section Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          type="button"
          className={`btn btn-sm ${activeSection === 'resources' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSection('resources')}
        >
          <Globe size={14} />
          <span>Official Government Resources</span>
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeSection === 'rights' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSection('rights')}
        >
          <BookOpen size={14} />
          <span>Statutory Rights & Acts</span>
        </button>
      </div>

      {/* SECTION: Official Government Resources */}
      {activeSection === 'resources' && (
        <div>
          {/* Verified Sources Trust Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <ShieldCheck size={22} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#065f46', marginBottom: '0.2rem' }}>
                ✓ Verified Official Government Sources Only
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#047857', lineHeight: 1.5 }}>
                All resources below are official Government of India portals (.gov.in / .nic.in). Clicking "Visit Official Website" opens the portal in a new browser tab. No external content is embedded.
              </p>
            </div>
          </div>

          {/* Resource Category Filter */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {resourceCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${resourceFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setResourceFilter(cat)}
                style={{ fontSize: '0.78rem' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Resources Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.1rem' }}>
            {filteredResources.map((resource) => (
              <OfficialResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      )}

      {/* SECTION: Statutory Rights */}
      {activeSection === 'rights' && (
        <div>
          {/* Trust Callout */}
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <BookOpen size={22} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3e62', marginBottom: '0.2rem' }}>
                {t('why_matters')} Source Verification Guarantee
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5 }}>
                {t('why_matters_desc')} NyayaAI never invents sections, acts, or judgments. Every legal provision shown is indexed directly to authoritative Indian legislation.
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Search by Act name, Section, or keyword (e.g., Wages, Deposit, FIR, Cyber)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`btn btn-sm ${selectedFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sources List */}
          <div>
            {filteredSources.map((source) => (
              <LegalSourceCard key={source.id} source={source} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
