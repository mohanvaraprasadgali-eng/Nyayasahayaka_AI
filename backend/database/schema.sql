-- NyayaAI Database Schema (SIH 2026 Prototype)
-- Secure AI Legal Rights & Lawyer Assistance Platform

-- Users Table (Citizen, Lawyer, Admin)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'citizen', -- 'citizen', 'lawyer', 'admin'
    location TEXT DEFAULT 'Hyderabad',
    city TEXT DEFAULT 'Hyderabad',
    state TEXT DEFAULT 'Telangana',
    language TEXT DEFAULT 'en',
    profile_photo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lawyer Profiles & Verification
CREATE TABLE IF NOT EXISTS lawyer_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    bar_council_number TEXT NOT NULL,
    state_bar_council TEXT NOT NULL,
    specialization TEXT NOT NULL, -- e.g. 'Consumer Law', 'Labour & Employment', 'Civil & Property', 'Cyber Law'
    experience_years INTEGER DEFAULT 1,
    languages_known TEXT DEFAULT 'English, Telugu, Hindi',
    bio TEXT,
    verification_status TEXT DEFAULT 'PENDING', -- 'PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED'
    verification_notes TEXT,
    rating REAL DEFAULT 4.8,
    total_cases_handled INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Lawyer Professional Verification Documents (Admin Review Only)
CREATE TABLE IF NOT EXISTS lawyer_verification_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lawyer_id INTEGER NOT NULL,
    document_type TEXT NOT NULL, -- 'Bar Council Certificate', 'ID Proof', 'Practice License'
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'SUBMITTED', -- 'SUBMITTED', 'VERIFIED', 'REJECTED'
    FOREIGN KEY(lawyer_id) REFERENCES lawyer_profiles(id) ON DELETE CASCADE
);

-- Lawyer Subscription Plans
CREATE TABLE IF NOT EXISTS lawyer_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lawyer_id INTEGER NOT NULL,
    plan_name TEXT NOT NULL DEFAULT 'PRO', -- 'BASIC', 'PRO', 'PREMIUM'
    price REAL NOT NULL DEFAULT 999.0,
    duration_months INTEGER DEFAULT 3,
    status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'CANCELLED'
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(lawyer_id) REFERENCES lawyer_profiles(id) ON DELETE CASCADE
);

-- Configurable Platform Pricing Plans
CREATE TABLE IF NOT EXISTS pricing_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_type TEXT NOT NULL, -- 'case_fee', 'lawyer_subscription'
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    price REAL NOT NULL,
    duration_days INTEGER DEFAULT 30,
    description TEXT NOT NULL,
    features TEXT, -- JSON string
    is_active INTEGER DEFAULT 1
);

-- Legal Cases (Citizen Disputes)
CREATE TABLE IF NOT EXISTS cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    sub_category TEXT,
    description TEXT NOT NULL,
    location TEXT DEFAULT 'Hyderabad, Telangana',
    urgency TEXT DEFAULT 'Medium', -- 'Low', 'Medium', 'High', 'Urgent'
    complexity TEXT DEFAULT 'MODERATE', -- 'BASIC', 'MODERATE', 'COMPLEX'
    platform_fee REAL DEFAULT 499.0,
    payment_status TEXT DEFAULT 'PAID', -- 'UNPAID', 'PAID', 'REFUNDED'
    risk_level TEXT DEFAULT 'yellow', -- 'green', 'yellow', 'red'
    status TEXT DEFAULT 'MATCHING', -- 'OPEN', 'ANALYZED', 'PAID', 'MATCHING', 'LAWYER_ACCEPTED', 'DOCUMENTS_SHARED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'
    assigned_lawyer_id INTEGER,
    summary TEXT,
    applicable_laws TEXT, -- JSON string or comma-separated
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(assigned_lawyer_id) REFERENCES lawyer_profiles(id) ON DELETE SET NULL
);

-- Case Required / Recommended Documents & Missing Guidance
CREATE TABLE IF NOT EXISTS document_requirements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    importance TEXT DEFAULT 'Essential', -- 'Essential', 'Supporting', 'Optional'
    status TEXT DEFAULT 'pending', -- 'available', 'missing', 'not_applicable', 'pending'
    why_useful TEXT,
    alternatives_guidance TEXT,
    how_to_obtain TEXT,
    user_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- Case Documents (Secure Private Storage)
CREATE TABLE IF NOT EXISTS case_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    document_type TEXT NOT NULL, -- 'Agreement', 'Payment Proof', 'Notice', 'Complaint', 'Evidence', 'Legal Draft'
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER DEFAULT 0,
    mime_type TEXT DEFAULT 'application/pdf',
    is_private INTEGER DEFAULT 1, -- 1: Private (Owner & Assigned Lawyer only)
    file_content TEXT, -- Extracted text or drafted notice
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE SET NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Backward compatibility for existing documents table
CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER,
    title TEXT NOT NULL,
    document_type TEXT NOT NULL,
    filename TEXT,
    extracted_text TEXT,
    structured_analysis TEXT,
    file_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE SET NULL
);

-- Case Messages (Private Citizen-Lawyer Chat)
CREATE TABLE IF NOT EXISTS case_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL, -- 'citizen', 'lawyer'
    message_text TEXT NOT NULL,
    attachment_doc_id INTEGER,
    is_read INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- In-App Notifications Queue
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- 'case_match', 'case_accepted', 'payment_success', 'message', 'doc_shared', 'subscription_expiry'
    link_tab TEXT DEFAULT 'dashboard',
    case_id INTEGER,
    is_read INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payments & Transaction Ledger
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    case_id INTEGER,
    subscription_id INTEGER,
    amount REAL NOT NULL,
    payment_type TEXT NOT NULL, -- 'case_fee', 'subscription'
    status TEXT DEFAULT 'SUCCESS', -- 'SUCCESS', 'PENDING', 'FAILED', 'REFUNDED'
    transaction_ref TEXT NOT NULL,
    payment_method TEXT DEFAULT 'Mock UPI / Card Simulation',
    receipt_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE SET NULL
);

-- Evidence items
CREATE TABLE IF NOT EXISTS evidence (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    status TEXT DEFAULT 'pending', -- 'collected', 'pending', 'missing', 'not_applicable'
    importance TEXT DEFAULT 'Essential',
    notes TEXT,
    file_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- Action Steps
CREATE TABLE IF NOT EXISTS action_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER NOT NULL,
    step_order INTEGER DEFAULT 1,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    authority TEXT,
    deadline TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- Reminders
CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER,
    title TEXT NOT NULL,
    reminder_date TEXT NOT NULL,
    reminder_time TEXT DEFAULT '10:00 AM',
    priority TEXT DEFAULT 'Medium',
    category TEXT DEFAULT 'Deadline',
    completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE SET NULL
);

-- Statutory Legal Sources
CREATE TABLE IF NOT EXISTS legal_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    act_name TEXT NOT NULL,
    section TEXT,
    official_source TEXT NOT NULL,
    source_url TEXT NOT NULL,
    description TEXT NOT NULL,
    verification_status TEXT DEFAULT 'Verified',
    last_checked TEXT DEFAULT '2026-08-20'
);

-- Dispute Resolution Authorities & Legal Aid
CREATE TABLE IF NOT EXISTS authorities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    state TEXT DEFAULT 'All India',
    district TEXT DEFAULT 'All Districts',
    purpose TEXT NOT NULL,
    eligibility TEXT,
    documents_required TEXT,
    website TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    is_legal_aid INTEGER DEFAULT 0
);

-- Case Timeline Milestones
CREATE TABLE IF NOT EXISTS timeline_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER NOT NULL,
    event_date TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT DEFAULT 'action',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- Immutable Security & Access Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    user_role TEXT DEFAULT 'unknown',
    user_name TEXT,
    action TEXT NOT NULL, -- 'LOGIN', 'LOGOUT', 'VIEW_DOCUMENT', 'DOWNLOAD_DOCUMENT', 'UPLOAD_DOCUMENT', 'CASE_CREATED', 'LAWYER_MATCHED', 'LAWYER_ACCEPTED', 'PAYMENT_COMPLETED', 'SUBSCRIPTION_RENEWED', 'ADMIN_APPROVED_LAWYER'
    target_type TEXT, -- 'case', 'document', 'lawyer', 'payment', 'subscription'
    target_id TEXT,
    case_id INTEGER,
    document_id INTEGER,
    details TEXT,
    ip_address TEXT DEFAULT '127.0.0.1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
