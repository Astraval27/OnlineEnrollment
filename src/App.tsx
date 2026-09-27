import React, { useState } from 'react';
import { UserRole, ScreenId, Student, Course, Transaction, ApplicationItem, RequirementItem, DocumentQueueItem } from './types';
import { ROLE_CONFIGS, normalizeRole } from './data/roles';
import {
  INITIAL_STUDENTS,
  INITIAL_COURSES,
  INITIAL_TRANSACTIONS,
  INITIAL_APPLICATIONS,
  INITIAL_REQUIREMENTS,
  INITIAL_DOCUMENT_QUEUE,
} from './data/mockData';
import { Homepage } from './components/homepage/Homepage';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { ApplicantHome } from './components/screens/ApplicantHome';
import { StudentDirectory } from './components/screens/StudentDirectory';
import { CourseManagement } from './components/screens/CourseManagement';
import { FinancialBilling } from './components/screens/FinancialBilling';
import { UserProfileSettings } from './components/screens/UserProfileSettings';
import { ApplicationsRequirements } from './components/screens/ApplicationsRequirements';
import { AddStudentModal, CreateInvoiceModal, BatchApprovalModal } from './components/modals/ActionModals';
import { SystemCaptureModal } from './components/modals/SystemCaptureModal';

export default function App() {
  // Navigation view: 'homepage' or 'portal'
  const [viewMode, setViewMode] = useState<'homepage' | 'portal'>('homepage');

  // Screen and role states in Portal: student, registrar, or admin
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('applicant_home');
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStudent, setActiveStudent] = useState<Partial<Student> | null>(INITIAL_STUDENTS[1]); // Defaults to Johnny Tabulo or newly registered applicant

  // Data states
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [applications, setApplications] = useState<ApplicationItem[]>(INITIAL_APPLICATIONS);
  const [requirements, setRequirements] = useState<RequirementItem[]>(INITIAL_REQUIREMENTS);
  const [documentQueue] = useState<DocumentQueueItem[]>(INITIAL_DOCUMENT_QUEUE);

  // Modal states
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isBatchApprovalOpen, setIsBatchApprovalOpen] = useState(false);
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Entrance from Homepage into Portal
  const handleEnterPortal = (role: UserRole, initialScreen?: string, applicantData?: Partial<Student>) => {
    const normalized = normalizeRole(role);
    setCurrentRole(normalized);
    if (applicantData) {
      setActiveStudent(applicantData);
    }
    if (initialScreen) {
      setCurrentScreen(initialScreen as ScreenId);
    } else {
      setCurrentScreen(ROLE_CONFIGS[normalized].defaultScreen);
    }
    setViewMode('portal');
    showToast(`Welcome! Logged in as ${applicantData?.name || ROLE_CONFIGS[normalized].label} (${applicantData ? 'Student Portal' : ROLE_CONFIGS[normalized].name}).`);
  };

  // Switch between the 3 roles smoothly
  const handleChangeRole = (newRole: UserRole) => {
    const normalized = normalizeRole(newRole);
    setCurrentRole(normalized);
    const allowed = ROLE_CONFIGS[normalized].allowedScreens;
    if (!allowed.includes(currentScreen)) {
      setCurrentScreen(ROLE_CONFIGS[normalized].defaultScreen);
    }
    showToast(`Switched active profile to ${ROLE_CONFIGS[normalized].label} (${ROLE_CONFIGS[normalized].name}).`);
  };

  // Screen selection within portal
  const handleSelectScreen = (screen: ScreenId) => {
    const normalized = normalizeRole(currentRole);
    if (!ROLE_CONFIGS[normalized].allowedScreens.includes(screen)) {
      if (normalized === 'student') {
        setCurrentRole('registrar');
        showToast(`Screen requires staff authorization. Switched to Registrar role.`);
      } else if (normalized === 'registrar' && screen === 'financial_billing') {
        setCurrentRole('admin');
        showToast(`Financial & Billing requires Administrator privileges. Switched to Admin role.`);
      }
    }
    setCurrentScreen(screen);
  };

  const handleToggleRole = () => {
    const active = normalizeRole(currentRole);
    const nextRole: UserRole = active === 'student' ? 'registrar' : active === 'registrar' ? 'admin' : 'student';
    handleChangeRole(nextRole);
  };

  // Primary action button from top header
  const handlePrimaryAction = () => {
    switch (currentScreen) {
      case 'applicant_home':
        // Log out back to homepage
        showToast('You have logged out of the Applicant portal.');
        setViewMode('homepage');
        break;
      case 'student_directory':
        setIsAddStudentOpen(true);
        break;
      case 'course_management':
        // handled in course component
        break;
      case 'financial_billing':
        setIsCreateInvoiceOpen(true);
        break;
      case 'user_settings':
        showToast('Settings & profile changes saved successfully.');
        break;
      case 'applications':
        setIsBatchApprovalOpen(true);
        break;
    }
  };

  const handleDownloadReport = () => {
    const reportData = `E-ENROLL ACADEMIC FINANCIAL REPORT
Generated: ${new Date().toLocaleString()}
Term: 2026 Fall Semester
Total Revenue: PHP 1,240,500.00
Pending Payments: PHP 45,200.00
Overdue Accounts: 12
Scholarships Disbursed: PHP 210,000.00
Payment Channels:
- Bank Transfer: 42%
- Credit/Debit Card: 38%
- Online Wallet: 20%
`;
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_report_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Financial Summary Report downloaded successfully.');
  };

  // Add new student from admissions or modal
  const handleAddStudent = (newStudent: Partial<Student>) => {
    setStudents((prev) => [newStudent as Student, ...prev]);
    setActiveStudent(newStudent);
    showToast(`Application processed! Welcome, ${newStudent.name}.`);
  };

  // Add new course
  const handleAddNewCourse = (newCourse: Partial<Course>) => {
    setCourses((prev) => [newCourse as Course, ...prev]);
    showToast(`Added course section ${newCourse.code} - ${newCourse.title}.`);
  };

  // Create invoice
  const handleCreateInvoice = (newInvoice: Partial<Transaction>) => {
    setTransactions((prev) => [newInvoice as Transaction, ...prev]);
    showToast(`Invoice ${newInvoice.transactionId} issued to ${newInvoice.studentName}.`);
  };

  // Batch approve
  const handleBatchApprove = () => {
    setApplications((prev) =>
      prev.map((app) => ({
        ...app,
        status: 'APPROVED',
      }))
    );
    showToast('Batch approval completed for 284 candidate applications.');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1d20] font-sans antialiased">
      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-xl border border-neutral-800 flex items-center gap-2.5 animate-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* VIEW 1: PUBLIC HOMEPAGE */}
      {viewMode === 'homepage' ? (
        <Homepage
          onEnterPortal={handleEnterPortal}
          onEnrollmentComplete={handleAddStudent}
        />
      ) : (
        /* VIEW 2: PORTAL PANEL (WITH ALL 6 SCREENS) */
        <div className="min-h-screen flex">
          {/* Main Sidebar */}
          <Sidebar
            currentRole={currentRole}
            currentScreen={currentScreen}
            onSelectScreen={handleSelectScreen}
            onToggleRole={handleToggleRole}
            onChangeRole={handleChangeRole}
            onBackToHome={() => {
              setViewMode('homepage');
              showToast('You have successfully logged out of the portal.');
            }}
          />

          {/* Main Content Viewport */}
          <div className="flex-1 flex flex-col min-w-0">
            <TopHeader
              currentScreen={currentScreen}
              currentRole={currentRole}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onPrimaryAction={handlePrimaryAction}
              onSecondaryAction={handleDownloadReport}
              onSelectScreen={handleSelectScreen}
              onBackToHome={() => setViewMode('homepage')}
              onCapturePicture={() => setIsCaptureModalOpen(true)}
            />

            {/* Content Area rendering the appropriate screen */}
            <main className="flex-1 overflow-y-auto">
              {currentScreen === 'applicant_home' && (
                <ApplicantHome
                  activeStudent={activeStudent || INITIAL_STUDENTS[1]}
                  onLogOut={() => {
                    setViewMode('homepage');
                    showToast('You have logged out of the Applicant portal.');
                  }}
                />
              )}

              {currentScreen === 'student_directory' && (
                <StudentDirectory
                  students={students}
                  searchQuery={searchQuery}
                  onAddStudentClick={() => setIsAddStudentOpen(true)}
                />
              )}

              {currentScreen === 'course_management' && (
                <CourseManagement
                  courses={courses}
                  searchQuery={searchQuery}
                  onAddNewCourse={handleAddNewCourse}
                />
              )}

              {currentScreen === 'financial_billing' && (
                <FinancialBilling
                  transactions={transactions}
                  searchQuery={searchQuery}
                  onCreateInvoiceClick={() => setIsCreateInvoiceOpen(true)}
                  onDownloadReport={handleDownloadReport}
                />
              )}

              {currentScreen === 'user_settings' && (
                <UserProfileSettings
                  currentRole={currentRole}
                  onChangeRole={handleChangeRole}
                />
              )}

              {currentScreen === 'applications' && (
                <ApplicationsRequirements
                  applications={applications}
                  requirements={requirements}
                  documentQueue={documentQueue}
                  searchQuery={searchQuery}
                  students={students}
                  onBatchApprovalClick={() => setIsBatchApprovalOpen(true)}
                  onUpdateRequirement={setRequirements}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Action Modals */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={handleAddStudent}
      />

      <CreateInvoiceModal
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
        onCreateInvoice={handleCreateInvoice}
      />

      <BatchApprovalModal
        isOpen={isBatchApprovalOpen}
        onClose={() => setIsBatchApprovalOpen(false)}
        onApproveAll={handleBatchApprove}
      />

      {/* Whole System Picture & Live Snapshot Modal */}
      <SystemCaptureModal
        isOpen={isCaptureModalOpen}
        onClose={() => setIsCaptureModalOpen(false)}
        targetElementId="root"
        currentScreenName={currentScreen}
      />
    </div>
  );
}
