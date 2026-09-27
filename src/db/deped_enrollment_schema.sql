-- =====================================================================
-- PHILIPPINE BASIC EDUCATION ENROLLMENT SYSTEM (DEPED ALIGNED)
-- Regulatory Framework Compliance:
--  - DepEd Order No. 03, s. 2018 (Basic Education Enrollment Policy / BEEF)
--  - DepEd Order No. 54, s. 2016 (Learner's School Records / SF10)
--  - DepEd Order No. 20, s. 2018 (Amendment to Kindergarten Age Qualification)
--  - DepEd Order No. 17, s. 2025 (Updated School Calendar and Operations)
--  - Republic Act No. 10173 (Data Privacy Act of 2012)
-- Database: PostgreSQL 14+ / Cloud SQL Compatible
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS FOR STANDARDIZED DEPED DOMAIN VALUES
CREATE TYPE learner_sex AS ENUM ('MALE', 'FEMALE');

CREATE TYPE enrollment_type AS ENUM (
    'NEW_LEARNER',
    'CONTINUING_RETURNING',
    'TRANSFEREE',
    'BALIK_ARAL',
    'ALS_PASSER'
);

CREATE TYPE application_status AS ENUM (
    'SUBMITTED',
    'UNDER_REVIEW',
    'VERIFIED_COMPLETE',
    'TEMPORARILY_ENROLLED',
    'FLAGGED_ACTION_REQUIRED',
    'ENROLLED_OFFICIAL',
    'REJECTED'
);

CREATE TYPE flag_reason_type AS ENUM (
    'NONE',
    'DUPLICATE_LRN',
    'LIS_CONDITIONAL_TAGGING_AGE',
    'UNDERAGE_INELIGIBLE',
    'MISSING_SF9_REPORT_CARD',
    'MISSING_PSA_BIRTH_CERT',
    'UNREADABLE_DOCUMENT_UPLOAD',
    'DISCREPANCY_BIRTH_RECORDS'
);

CREATE TYPE key_stage_level AS ENUM (
    'KINDERGARTEN',
    'ELEMENTARY',
    'JUNIOR_HIGH',
    'SENIOR_HIGH'
);

CREATE TYPE shs_track AS ENUM (
    'ACADEMIC',
    'TECHNICAL_VOCATIONAL_LIVELIHOOD',
    'SPORTS',
    'ARTS_AND_DESIGN'
);

CREATE TYPE document_category AS ENUM (
    'PSA_BIRTH_CERTIFICATE',
    'SF9_REPORT_CARD',
    'AFFIDAVIT_OF_UNDERTAKING',
    'ECCD_CHECKLIST',
    'PEAC_ESC_CERTIFICATION',
    'BRGY_CERT_RESIDENCY',
    'MEDICAL_ASSESSMENT'
);

-- =====================================================================
-- TABLE 1: LEARNERS (MASTER DIRECTORY & REGISTRY)
-- Stores the master demographic and persistent learner record
-- Sensitive personal data fields encrypted at field level (AES-256)
-- =====================================================================
CREATE TABLE learners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lrn VARCHAR(12) UNIQUE, -- 12-Digit DepEd Learner Reference Number (NULL for incoming Kindergarten/Grade 1 without LRN)
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    extension_name VARCHAR(20), -- Jr., III, etc.
    sex learner_sex NOT NULL,
    birth_date DATE NOT NULL,
    mother_tongue VARCHAR(80) NOT NULL DEFAULT 'Tagalog',
    
    -- Socio-Demographic Cluster (DO 03, s. 2018)
    is_ip_community BOOLEAN NOT NULL DEFAULT FALSE,
    ip_group_name VARCHAR(100),
    is_4ps_beneficiary BOOLEAN NOT NULL DEFAULT FALSE,
    four_ps_household_id_encrypted TEXT, -- AES-256 Encrypted Field
    
    -- LSEN (Learners with Special Educational Needs) Cluster
    is_lsen BOOLEAN NOT NULL DEFAULT FALSE,
    lsen_manifestations JSONB DEFAULT '[]'::JSONB, -- Array of DepEd manifestations
    
    -- Contact & Address (Encrypted for RA 10173 Compliance)
    current_address_encrypted TEXT NOT NULL,
    contact_number_encrypted TEXT NOT NULL,
    email VARCHAR(150),
    
    -- Parent / Guardian Details
    father_name VARCHAR(150),
    mother_maiden_name VARCHAR(150),
    guardian_name VARCHAR(150),
    guardian_contact_encrypted TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_learners_lrn ON learners(lrn);
CREATE INDEX idx_learners_names ON learners(last_name, first_name);
CREATE INDEX idx_learners_birth_date ON learners(birth_date);
CREATE INDEX idx_learners_lsen ON learners(is_lsen) WHERE is_lsen = TRUE;

-- =====================================================================
-- TABLE 2: ENROLLMENT_APPLICATIONS (ACTIVE & HISTORICAL INTAKES)
-- Handles Enhanced BEEF submission lifecycle, track/strands, and review flags
-- =====================================================================
CREATE TABLE enrollment_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. APP-2026-004921
    learner_id UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    school_year VARCHAR(9) NOT NULL DEFAULT '2026-2027',
    opening_month VARCHAR(10) NOT NULL DEFAULT 'August', -- June, July, August (DO 20 s. 2018 & DO 17 s. 2025)
    
    enrollment_type enrollment_type NOT NULL DEFAULT 'NEW_LEARNER',
    key_stage key_stage_level NOT NULL,
    grade_level VARCHAR(20) NOT NULL, -- e.g. 'Kindergarten', 'Grade 1', 'Grade 11'
    assigned_section VARCHAR(50),
    
    -- SHS Specialization Cluster (DO 03, s. 2018)
    shs_track shs_track,
    shs_strand VARCHAR(80), -- e.g. 'STEM', 'ABM', 'HUMSS', 'ICT'
    authorized_school_id VARCHAR(6) DEFAULT '300481', -- 6-Digit DepEd School ID
    
    -- Transferee / Balik-Aral Cluster (DO 54, s. 2016)
    previous_school_name VARCHAR(200),
    previous_school_id VARCHAR(6),
    last_sy_completed VARCHAR(9),
    electronic_sf10_requested BOOLEAN DEFAULT FALSE,
    sf10_request_date TIMESTAMP WITH TIME ZONE,
    
    -- Queue & Status Lifecycle
    status application_status NOT NULL DEFAULT 'SUBMITTED',
    flag_reason flag_reason_type DEFAULT 'NONE',
    flag_remarks TEXT,
    
    -- Kindergarten Age Evaluation
    kinder_age_years NUMERIC(4,2),
    kinder_eligibility_status VARCHAR(50), -- ELIGIBLE, CONDITIONAL_TAGGED, UNDERAGE
    
    -- Staff Reviewers
    reviewed_by_staff_id VARCHAR(50),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    approved_by_sefp_id VARCHAR(50),
    approved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_enrollment_status ON enrollment_applications(status);
CREATE INDEX idx_enrollment_flag ON enrollment_applications(flag_reason);
CREATE INDEX idx_enrollment_sy ON enrollment_applications(school_year);
CREATE INDEX idx_enrollment_grade ON enrollment_applications(grade_level);

-- =====================================================================
-- TABLE 3: DOCUMENTS (CREDENTIALS AND INTAKE ATTACHMENTS)
-- Secure cloud object pointer with virus scan & integrity hash
-- =====================================================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES enrollment_applications(id) ON DELETE CASCADE,
    learner_id UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    document_type document_category NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    storage_object_key TEXT NOT NULL, -- Isolated bucket key
    sha256_hash VARCHAR(64) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(50),
    verification_notes TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_app ON documents(application_id);
CREATE INDEX idx_documents_type ON documents(document_type);

-- =====================================================================
-- TABLE 4: AFFIDAVITS (AFFIDAVIT OF UNDERTAKING PER DO 03, S. 2018)
-- Generated when SF9 or PSA is missing; sets deadline to Oct 31
-- =====================================================================
CREATE TABLE affidavits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID UNIQUE NOT NULL REFERENCES enrollment_applications(id) ON DELETE CASCADE,
    learner_id UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    parent_guardian_name VARCHAR(150) NOT NULL,
    undertaking_reason TEXT NOT NULL, -- e.g. "School of origin in province has delayed release of SF9"
    missing_documents JSONB NOT NULL DEFAULT '[]'::JSONB, -- Array of missing docs ['SF9', 'PSA']
    mandatory_deadline DATE NOT NULL, -- Mandatory October 31 of active SY
    
    -- Digital Signature Vector Capture
    signature_vector_json JSONB NOT NULL, -- Coordinate strokes array [[x, y], ...]
    signature_svg_snapshot TEXT,
    signed_ip_address VARCHAR(45) NOT NULL,
    signed_user_agent TEXT NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Slip Generation
    provisional_slip_barcode VARCHAR(50) UNIQUE NOT NULL,
    is_cleared BOOLEAN DEFAULT FALSE,
    cleared_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_affidavits_app ON affidavits(application_id);
CREATE INDEX idx_affidavits_deadline ON affidavits(mandatory_deadline);

-- =====================================================================
-- TABLE 5: AUDIT_LOGS (RA 10173 PRIVACY & REGULATORY COMPLIANCE)
-- Tamper-evident ledger of consents, modifications, and exports
-- =====================================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50), -- LRN, staff username, or anonymous applicant
    action_type VARCHAR(60) NOT NULL, -- 'PRIVACY_CONSENT_LOGGED', 'ENROLLMENT_SUBMITTED', 'AFFIDAVIT_SIGNED', 'LIS_BOSY_EXPORT'
    resource_id VARCHAR(100),
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    payload_snapshot JSONB,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_action ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_time ON audit_logs(performed_at);

-- =====================================================================
-- TABLE 6: USER_AUTH_ACCOUNTS (STUDENT PORTAL & GUARDIAN CREDENTIALS)
-- Enables guest admission auto-provisioning and linked learner profile access
-- =====================================================================
CREATE TABLE user_auth_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learner_id UUID REFERENCES learners(id) ON DELETE SET NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mobile_number VARCHAR(30) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    parent_name VARCHAR(150) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'student',
    
    -- Identification link: either 12-digit DepEd LRN or Temporary Reference ID
    lrn VARCHAR(12),
    temp_reference_id VARCHAR(30) UNIQUE,
    
    -- Verification statuses (SMS / Email delivery confirmation)
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(100),
    is_mobile_verified BOOLEAN DEFAULT TRUE,
    sms_otp_code VARCHAR(10),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_auth_email ON user_auth_accounts(email);
CREATE INDEX idx_user_auth_lrn ON user_auth_accounts(lrn);
CREATE INDEX idx_user_auth_temp_id ON user_auth_accounts(temp_reference_id);
CREATE INDEX idx_user_auth_learner ON user_auth_accounts(learner_id);

-- =====================================================================
-- TABLE 7: ENROLLMENT_ROADMAP_PROGRESS (11-STEP LIFECYCLE TRACKER)
-- Tracks real-time status of student onboarding, SF10 tracking & provisional state
-- =====================================================================
CREATE TABLE enrollment_roadmap_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES enrollment_applications(id) ON DELETE CASCADE,
    learner_id UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    user_account_id UUID REFERENCES user_auth_accounts(id) ON DELETE SET NULL,
    
    current_step INT NOT NULL DEFAULT 1 CHECK (current_step BETWEEN 1 AND 11),
    total_steps INT NOT NULL DEFAULT 11,
    status application_status NOT NULL DEFAULT 'SUBMITTED',
    
    -- Pathway: 'new_student' (triggers age check) or 'transferee' (triggers SF10 request)
    pathway VARCHAR(30) NOT NULL DEFAULT 'new_student',
    
    -- 11-step progress matrix stored as JSONB structured step states
    steps_state JSONB NOT NULL DEFAULT '[
        {"step": 1, "name": "Identity & LRN Validation", "status": "completed"},
        {"step": 2, "name": "Basic Education Enrollment Intake (BEEF)", "status": "completed"},
        {"step": 3, "name": "Parent Portal Account Created", "status": "completed"},
        {"step": 4, "name": "SF10 Record Tracking / Age Eligibility", "status": "current"},
        {"step": 5, "name": "Credential & Document Verification", "status": "upcoming"},
        {"step": 6, "name": "Registrar Quality Audit", "status": "upcoming"},
        {"step": 7, "name": "Section Allocation & Track Placement", "status": "upcoming"},
        {"step": 8, "name": "DepEd Voucher & Assessment Review", "status": "upcoming"},
        {"step": 9, "name": "DepEd LIS Official Tagging", "status": "upcoming"},
        {"step": 10, "name": "Certificate of Enrollment (COE) Issued", "status": "upcoming"},
        {"step": 11, "name": "Official BOSY Enrollment Finalized", "status": "upcoming"}
    ]'::JSONB,
    
    -- Transferee SF10 electronic tracking metadata (DO 54, s. 2016)
    sf10_electronic_requested BOOLEAN DEFAULT FALSE,
    sf10_tracking_code VARCHAR(50),
    sf10_origin_school_name VARCHAR(200),
    sf10_origin_school_id VARCHAR(6),
    sf10_dispatch_status VARCHAR(50) DEFAULT 'NONE',
    
    -- Provisional Enrollment per DepEd Order No. 03, s. 2018
    is_temporarily_enrolled BOOLEAN DEFAULT FALSE,
    provisional_slip_barcode VARCHAR(50),
    provisional_deadline DATE, -- October 31 of current school year
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_roadmap_app ON enrollment_roadmap_progress(application_id);
CREATE INDEX idx_roadmap_learner ON enrollment_roadmap_progress(learner_id);
CREATE INDEX idx_roadmap_step ON enrollment_roadmap_progress(current_step);
CREATE INDEX idx_roadmap_sf10 ON enrollment_roadmap_progress(sf10_tracking_code);
