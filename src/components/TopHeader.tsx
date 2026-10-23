import React from 'react';
import { Search, Plus, Download, CheckCircle2, Shield, Upload, FileText, Menu } from 'lucide-react';
import { ScreenId, UserRole } from '../types';
import { ROLE_CONFIGS, normalizeRole } from '../data/roles';

interface TopHeaderProps {
  currentScreen: ScreenId;
  currentRole: UserRole;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
  onSelectScreen: (screen: ScreenId) => void;
  onBackToHome?: () => void;
  onOpenMobileSidebar?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentScreen,
  currentRole,
  searchQuery,
  onSearchChange,
  onPrimaryAction,
  onSecondaryAction,
  onSelectScreen,
  onBackToHome: _onBackToHome,
  onOpenMobileSidebar,
}) => {
  const activeRole = normalizeRole(currentRole);
  const roleConfig = ROLE_CONFIGS[activeRole];

  // Screen title
  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'applicant_home':
        return 'K-12 Learner Enrollment Hub';
      case 'enrollment_roadmap':
        return 'K-12 Enrollment Roadmap';
      case 'upload_form':
        return 'Form 138 (SF9) Upload Center';
      case 'student_schedule':
        return 'Class Schedule & Timetable';
      case 'student_notifications':
        return 'Learner Notifications';
      case 'student_directory':
        return 'Learner Directory (LIS)';
      case 'course_management':
        return 'K-12 Subjects & Sections';
      case 'financial_billing':
        return 'Tuition & Voucher Billing';
      case 'user_settings':
        return activeRole === 'student' ? 'Learner & Parent Profile' : activeRole === 'registrar' ? 'Registrar Settings' : 'Admin Console';
      case 'applications':
        return 'Admissions & Compliance';
      default:
        return 'K-12 Enrollment Portal';
    }
  };

  // Search input placeholder
  const getSearchPlaceholder = () => {
    switch (currentScreen) {
      case 'student_schedule':
        return 'Search subject, room...';
      case 'student_notifications':
        return 'Search receipts, OR #...';
      case 'student_directory':
        return 'Search LRN, name...';
      case 'course_management':
        return 'Search subjects, teacher...';
      case 'financial_billing':
        return 'Search receipts, vouchers...';
      case 'applications':
        return 'Search ID, LRN, name...';
      default:
        return 'Search...';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      {/* Main Top bar */}
      <div className="h-16 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Title and Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Menu Hamburger Toggle */}
          <button
            id="btn-mobile-sidebar-toggle"
            onClick={onOpenMobileSidebar}
            className="p-1.5 -ml-1 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-slate-100 lg:hidden transition-colors shrink-0"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-neutral-900 tracking-tight truncate max-w-[170px] sm:max-w-xs md:max-w-md">
            {getScreenTitle()}
          </h1>

          <span
            className={`hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shrink-0 ${roleConfig.colorScheme.badge}`}
          >
            <Shield className="w-3 h-3" />
            <span>{roleConfig.badgeLabel}</span>
          </span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Action controls depending on screen */}
          {currentScreen === 'applicant_home' ? (
            <div className="flex items-center gap-2">
              <button
                id="btn-header-goto-roadmap"
                onClick={() => onSelectScreen('enrollment_roadmap')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View Roadmap</span>
                <span className="sm:hidden">Roadmap</span>
              </button>
            </div>
          ) : currentScreen === 'enrollment_roadmap' ? (
            <div className="flex items-center gap-2">
              <button
                id="btn-header-goto-upload"
                onClick={() => onSelectScreen('upload_form')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload Form 138 (SF9)</span>
                <span className="sm:hidden">Upload SF9</span>
              </button>
            </div>
          ) : currentScreen === 'upload_form' ? (
            <div className="flex items-center gap-2">
              <button
                id="btn-header-goto-roadmap"
                onClick={() => onSelectScreen('enrollment_roadmap')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 text-neutral-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View Roadmap</span>
                <span className="sm:hidden">Roadmap</span>
              </button>
            </div>
          ) : currentScreen === 'student_schedule' ? (
            <div className="flex items-center gap-2">
              <button
                id="btn-header-goto-roadmap"
                onClick={() => onSelectScreen('enrollment_roadmap')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 text-neutral-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View Roadmap</span>
                <span className="sm:hidden">Roadmap</span>
              </button>
            </div>
          ) : currentScreen === 'student_notifications' ? (
            <div className="flex items-center gap-2">
              <button
                id="btn-header-goto-upload"
                onClick={() => onSelectScreen('upload_form')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload Follow-up File</span>
                <span className="sm:hidden">Upload</span>
              </button>
            </div>
          ) : currentScreen === 'user_settings' ? (
            <div className="flex items-center gap-2">
              <button
                id="btn-save-changes"
                onClick={onPrimaryAction}
                className="px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Save</span>
              </button>
            </div>
          ) : currentScreen === 'financial_billing' ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                id="btn-download-report"
                onClick={onSecondaryAction}
                className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 text-neutral-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Report</span>
              </button>
              <button
                id="btn-create-invoice"
                onClick={onPrimaryAction}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Create Invoice</span>
                <span className="sm:hidden">Invoice</span>
              </button>
            </div>
          ) : activeRole === 'student' ? null : (
            /* Registrar / Admin: Student Directory, Course Management, Applications */
            <div className="flex items-center gap-2">
              <div className="relative w-28 sm:w-44 md:w-64 lg:w-72">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  id="top-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={getSearchPlaceholder()}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-neutral-800 focus:bg-white transition-colors"
                />
              </div>

              {currentScreen === 'student_directory' && (
                <button
                  id="btn-add-student"
                  onClick={onPrimaryAction}
                  className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add Student</span>
                  <span className="sm:hidden">Add</span>
                </button>
              )}

              {currentScreen === 'course_management' && (
                <button
                  id="btn-add-course"
                  onClick={onPrimaryAction}
                  className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add Course</span>
                  <span className="sm:hidden">Add</span>
                </button>
              )}

              {currentScreen === 'applications' && (
                <button
                  id="btn-batch-approval"
                  onClick={onPrimaryAction}
                  className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-1 shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Batch Approval</span>
                  <span className="sm:hidden">Approve</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
