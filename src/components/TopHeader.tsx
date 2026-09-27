import React from 'react';
import { Search, LogOut, Plus, Download, CheckCircle2, Camera, Shield } from 'lucide-react';
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
  onCapturePicture?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentScreen,
  currentRole,
  searchQuery,
  onSearchChange,
  onPrimaryAction,
  onSecondaryAction,
  onSelectScreen,
  onBackToHome,
  onCapturePicture,
}) => {
  const activeRole = normalizeRole(currentRole);
  const roleConfig = ROLE_CONFIGS[activeRole];

  // Screen title
  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'applicant_home':
        return 'K-12 Learner Enrollment Hub';
      case 'student_directory':
        return 'Learner Directory & DepEd LIS Records';
      case 'course_management':
        return 'K-12 Subject Offerings & Class Sections';
      case 'financial_billing':
        return 'Tuition, ESC & SHS Voucher Billing';
      case 'user_settings':
        return activeRole === 'student' ? 'Learner & Parent Profile' : activeRole === 'registrar' ? 'Registrar Profile & LIS Settings' : 'Principal / Admin Console';
      case 'applications':
        return 'K-12 Admissions & DepEd Credentials Review';
      default:
        return 'K-12 Enrollment Portal';
    }
  };

  // Search input placeholder
  const getSearchPlaceholder = () => {
    switch (currentScreen) {
      case 'student_directory':
        return 'Search LRN, learner name, grade level...';
      case 'course_management':
        return 'Search subjects, grade level, teacher...';
      case 'financial_billing':
        return 'Search receipts, learner, vouchers...';
      case 'applications':
        return 'Search application ID, LRN, name...';
      default:
        return 'Search...';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      {/* Main Top bar */}
      <div className="h-16 px-8 flex items-center justify-between gap-4">
        {/* Title and Role Badge */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            {getScreenTitle()}
          </h1>
          <span
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${roleConfig.colorScheme.badge}`}
          >
            <Shield className="w-3 h-3" />
            <span>{roleConfig.badgeLabel}</span>
          </span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Universal System Capture Button */}
          {onCapturePicture && (
            <button
              id="btn-portal-capture-picture"
              onClick={onCapturePicture}
              className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 text-neutral-800 hover:bg-slate-100 hover:border-neutral-900 transition-colors flex items-center gap-1.5 uppercase tracking-wider shrink-0 shadow-2xs"
              title="Capture this whole system into a picture"
            >
              <Camera className="w-3.5 h-3.5 text-neutral-700" />
              <span className="hidden sm:inline">System Picture</span>
            </button>
          )}

          {/* Search bar or icon depending on screen */}
          {currentScreen === 'applicant_home' ? (
            <div className="flex items-center gap-3">
              <button
                id="btn-search-applicant"
                className="p-2 text-neutral-500 hover:text-neutral-800 rounded-lg hover:bg-slate-100 transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                id="btn-logout"
                onClick={onPrimaryAction}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          ) : currentScreen === 'user_settings' ? (
            <div className="flex items-center gap-3">
              <button
                id="btn-save-changes"
                onClick={onPrimaryAction}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          ) : currentScreen === 'financial_billing' ? (
            <div className="flex items-center gap-3">
              <button
                id="btn-download-report"
                onClick={onSecondaryAction}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-300 text-neutral-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
              <button
                id="btn-create-invoice"
                onClick={onPrimaryAction}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Invoice</span>
              </button>
            </div>
          ) : (
            /* Student Directory, Course Management, Applications */
            <div className="flex items-center gap-3">
              <div className="relative w-64 md:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="top-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={getSearchPlaceholder()}
                  className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-neutral-800 focus:bg-white transition-colors"
                />
              </div>

              {currentScreen === 'student_directory' && (
                <button
                  id="btn-add-student"
                  onClick={onPrimaryAction}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Student</span>
                </button>
              )}

              {currentScreen === 'course_management' && (
                <button
                  id="btn-add-course"
                  onClick={onPrimaryAction}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Course</span>
                </button>
              )}

              {currentScreen === 'applications' && (
                <button
                  id="btn-batch-approval"
                  onClick={onPrimaryAction}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Batch Approval</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
