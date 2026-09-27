export type UserRole = 'student' | 'registrar' | 'admin' | 'applicant';

export type ScreenId =
  | 'applicant_home'       // Page 1: Learner/Parent Dashboard & 11-Step Enrollment Roadmap
  | 'student_directory'    // Page 2: K-12 Learner Directory & LRN Records
  | 'course_management'    // Page 3: K-12 Subjects & Section Management
  | 'financial_billing'    // Page 4: School Fees, Vouchers & Assessment
  | 'user_settings'        // Page 5: Profile & School System Configuration
  | 'applications';        // Page 6: Admissions & Form 138/SF9 Document Verification

export interface RoleInfo {
  id: 'student' | 'registrar' | 'admin';
  title: string;
  name: string;
  department: string;
  email: string;
  allowedScreens: ScreenId[];
  defaultScreen: ScreenId;
  badgeColor: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  lrn?: string; // 12-digit Learner Reference Number
  gradeLevel: string; // e.g., 'Grade 11', 'Grade 10', 'Grade 7', 'Kindergarten'
  section?: string; // e.g., 'STEM-A', 'Rizal', 'Diamond'
  trackStrand?: string; // For SHS: 'STEM', 'ABM', 'HUMSS', 'GAS', 'TVL'
  program: string; // Display string: 'Grade 11 - STEM (Senior High)'
  department: string; // 'Senior High School', 'Junior High School', 'Elementary', 'Kindergarten'
  parentGuardian?: string;
  currentStep: number;
  totalSteps: number;
  status: 'ENROLLED' | 'PENDING' | 'REVIEWING' | 'INCOMPLETE';
  avatar?: string;
  enrollmentDate?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  gradeLevel: string;
  department: string; // e.g., 'Senior High School', 'Junior High School', 'Elementary'
  instructor: string;
  enrolled: number;
  capacity: number;
  schedule: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'FULL';
  semester: string; // e.g., 'Semester 1', 'Full Academic Year'
}

export interface Transaction {
  id: string;
  transactionId: string;
  studentName: string;
  studentId: string;
  lrn?: string;
  gradeLevel?: string;
  amount: number;
  date: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  channel: 'Bank Transfer' | 'Credit/Debit Card' | 'Online Wallet' | 'DepEd Voucher Subsidy' | 'Cash / Over-the-Counter';
  description?: string;
}

export interface ApplicationItem {
  id: string;
  appNumber: string;
  applicantName: string;
  appliedDate: string;
  lrn?: string;
  gradeLevel: string;
  trackStrand?: string;
  tags: { label: string; status: 'completed' | 'pending' | 'missing' }[];
  status: 'REVIEWING' | 'URGENT' | 'INCOMPLETE' | 'APPROVED';
  program: string;
}

export interface DocumentQueueItem {
  id: string;
  filename: string;
  studentName: string;
  uploadedTime: string;
  fileType: 'pdf' | 'jpg' | 'png';
  fileSize: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface RequirementItem {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  required: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface UserAuthAccount {
  id: string;
  learnerId?: string;
  email: string;
  mobileNumber: string;
  parentName: string;
  role: 'student' | 'registrar' | 'admin';
  tempReferenceId?: string;
  lrn?: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface EnrollmentRoadmapStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  status: 'completed' | 'current' | 'upcoming' | 'action_required';
  description: string;
  completedDate?: string;
  actionLabel?: string;
}

export interface EnrollmentRoadmapStatus {
  applicationId: string;
  learnerId: string;
  lrn?: string;
  tempReferenceId?: string;
  pathway: 'new_student' | 'transferee';
  currentStep: number;
  totalSteps: number;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED_COMPLETE' | 'TEMPORARILY_ENROLLED' | 'FLAGGED_ACTION_REQUIRED' | 'ENROLLED_OFFICIAL';
  statusLabel: string;
  steps: EnrollmentRoadmapStep[];
  missingDocuments: string[];
  provisionalDeadline?: string;
  sf10Tracking?: {
    requested: boolean;
    trackingCode: string;
    originSchoolName: string;
    originSchoolId: string;
    requestDate: string;
    status: 'DISPATCHED_TO_ORIGIN_SCHOOL' | 'IN_TRANSIT' | 'RECEIVED_BY_REGISTRAR' | 'ATTACHED_TO_LIS';
  };
  ageEligibility?: {
    isEligible: boolean;
    ageYears: number;
    policyStatus: string;
    policyNotice: string;
  };
}

export interface AdmissionRegisterPayload {
  pathway: 'new_student' | 'transferee';
  // Parent/Guardian Account details
  parentEmail: string;
  parentMobile: string;
  password: string;
  parentName: string;

  // Learner BEEF details
  lrn?: string;
  tempReferenceId?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  extensionName?: string;
  sex: 'Male' | 'Female';
  birthDate: string;
  motherTongue: string;
  gradeLevel: string;
  keyStage: 'Kindergarten' | 'Elementary' | 'Junior High' | 'Senior High';
  shsTrack?: string;
  trackStrand?: string;

  // Transferee Details
  previousSchoolName?: string;
  previousSchoolId?: string;
  lastSYCompleted?: string;

  // Socio-demographics & Address
  is4Ps?: boolean;
  fourPsHouseholdId?: string;
  isIP?: boolean;
  ipGroupName?: string;
  isLSEN?: boolean;
  lsenManifestations?: string[];
  currentAddress: string;
  contactNumber: string;

  // Documents
  hasPSABirthCert: boolean;
  hasSF9ReportCard: boolean;
  documentsAttached?: Array<{
    type: string;
    fileName: string;
    fileSize: number;
  }>;
  affidavitSigned?: boolean;
  affidavitData?: any;
  privacyConsentAgreed: boolean;
}
