import React from 'react';
import {
  Home,
  FileText,
  Upload,
  Bell,
  Settings,
  Users,
  GraduationCap,
  CreditCard,
  FolderArchive,
  BookOpen,
  ShieldCheck,
  UserCheck,
  LogOut,
} from 'lucide-react';
import { UserRole, ScreenId } from '../types';
import { ROLE_CONFIGS, normalizeRole } from '../data/roles';

interface SidebarProps {
  currentRole: UserRole;
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  onToggleRole?: () => void;
  onChangeRole?: (role: UserRole) => void;
  onBackToHome?: () => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentScreen,
  onSelectScreen,
  onToggleRole,
  onChangeRole,
  onBackToHome,
  unreadCount = 3,
}) => {
  const activeRole = normalizeRole(currentRole);
  const roleConfig = ROLE_CONFIGS[activeRole];

  const handleRoleChange = (newRole: 'student' | 'registrar' | 'admin') => {
    if (onChangeRole) {
      onChangeRole(newRole);
    } else if (onToggleRole) {
      onToggleRole();
    }
  };

  return (
    <aside
      id="main-sidebar"
      className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-20 select-none"
    >
      {/* Top section */}
      <div>
        {/* Logo brand */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-widest text-neutral-900 leading-tight">
                E-ENROLL
              </span>
              <span className="text-[9px] tracking-wider uppercase font-semibold text-neutral-400">
                K-12 Basic Education
              </span>
            </div>
          </div>
        </div>

        {/* Current Role Banner */}
        <div className={`px-4 py-2.5 border-b border-slate-100 ${roleConfig.colorScheme.bg} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-900 animate-pulse" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-800">
              {roleConfig.badgeLabel}
            </span>
          </div>
          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${roleConfig.colorScheme.badge}`}>
            ACTIVE
          </span>
        </div>

        {/* Navigation list based on 3 roles */}
        <div className="px-4 py-4 space-y-1">
          {/* ROLE 1: STUDENT */}
          {activeRole === 'student' && (
            <>
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Learner Navigation
              </div>
              <button
                id="nav-student-dashboard"
                onClick={() => onSelectScreen('applicant_home')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === 'applicant_home'
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <Home className={`w-4 h-4 ${currentScreen === 'applicant_home' ? 'text-white' : 'text-neutral-500'}`} />
                <span>Dashboard</span>
              </button>

              <button
                id="nav-student-form"
                onClick={() => onSelectScreen('applicant_home')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                <FileText className="w-4 h-4 text-neutral-500" />
                <span>Enrollment Roadmap</span>
              </button>

              <button
                id="nav-student-upload"
                onClick={() => onSelectScreen('applicant_home')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                <Upload className="w-4 h-4 text-neutral-500" />
                <span>Upload Form 138 (SF9)</span>
              </button>

              <button
                id="nav-student-notifications"
                onClick={() => {}}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-neutral-500" />
                  <span>Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                id="nav-student-settings"
                onClick={() => onSelectScreen('user_settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === 'user_settings'
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <Settings className={`w-4 h-4 ${currentScreen === 'user_settings' ? 'text-white' : 'text-neutral-500'}`} />
                <span>Profile & Settings</span>
              </button>
            </>
          )}

          {/* ROLE 2: REGISTRAR */}
          {activeRole === 'registrar' && (
            <>
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                School Registrar Tools
              </div>
              <button
                id="nav-registrar-applications"
                onClick={() => onSelectScreen('applications')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === 'applications'
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <FileText className={`w-4 h-4 ${currentScreen === 'applications' ? 'text-white' : 'text-neutral-500'}`} />
                <span>Learner Applications</span>
              </button>

              <button
                id="nav-registrar-students"
                onClick={() => onSelectScreen('student_directory')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === 'student_directory'
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <Users className={`w-4 h-4 ${currentScreen === 'student_directory' ? 'text-white' : 'text-neutral-500'}`} />
                <span>Learner Directory (LIS)</span>
              </button>

              <button
                id="nav-registrar-courses"
                onClick={() => onSelectScreen('course_management')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === 'course_management'
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <BookOpen className={`w-4 h-4 ${currentScreen === 'course_management' ? 'text-white' : 'text-neutral-500'}`} />
                <span>Class Sections & Subjects</span>
              </button>

              <button
                id="nav-registrar-documents"
                onClick={() => onSelectScreen('applications')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                <FolderArchive className="w-4 h-4 text-neutral-500" />
                <span>DepEd Document Queue</span>
              </button>

              <button
                id="nav-registrar-settings"
                onClick={() => onSelectScreen('user_settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === 'user_settings'
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <Settings className={`w-4 h-4 ${currentScreen === 'user_settings' ? 'text-white' : 'text-neutral-500'}`} />
                <span>Registrar Settings</span>
              </button>
            </>
          )}

          {/* ROLE 3: ADMIN */}
          {activeRole === 'admin' && (
            <>
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Principal & Admin Console
              </div>
              <button
                id="nav-admin-students"
                onClick={() => onSelectScreen('student_directory')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === 'student_directory'
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <Users className={`w-4 h-4 ${currentScreen === 'student_directory' ? 'text-white' : 'text-neutral-500'}`} />
                <span>Learner Directory (LIS)</span>
              </button>

              <button
                id="nav-admin-financial"
                onClick={() => onSelectScreen('financial_billing')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === 'financial_billing'
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <CreditCard className={`w-4 h-4 ${currentScreen === 'financial_billing' ? 'text-white' : 'text-neutral-500'}`} />
                <span>Financial & Vouchers</span>
              </button>

              <button
                id="nav-admin-courses"
                onClick={() => onSelectScreen('course_management')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === 'course_management'
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <BookOpen className={`w-4 h-4 ${currentScreen === 'course_management' ? 'text-white' : 'text-neutral-500'}`} />
                <span>K-12 Subject Offerings</span>
              </button>

              <button
                id="nav-admin-applications"
                onClick={() => onSelectScreen('applications')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === 'applications'
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <FileText className={`w-4 h-4 ${currentScreen === 'applications' ? 'text-white' : 'text-neutral-500'}`} />
                <span>Admissions & Enrollees</span>
              </button>

              <button
                id="nav-admin-student-view"
                onClick={() => onSelectScreen('applicant_home')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === 'applicant_home'
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <Home className={`w-4 h-4 ${currentScreen === 'applicant_home' ? 'text-white' : 'text-neutral-500'}`} />
                <span>Learner Portal View</span>
              </button>

              <button
                id="nav-admin-settings"
                onClick={() => onSelectScreen('user_settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === 'user_settings'
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <Settings className={`w-4 h-4 ${currentScreen === 'user_settings' ? 'text-white' : 'text-neutral-500'}`} />
                <span>System Administration</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom user profile card */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-slate-300 bg-white shadow-2xs overflow-hidden flex items-center justify-center shrink-0 font-bold text-xs text-neutral-800">
            {activeRole === 'student' ? 'JT' : activeRole === 'registrar' ? 'MS' : 'ER'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-neutral-900 truncate">
              {roleConfig.name}
            </p>
            <p className="text-[11px] text-neutral-500 truncate">
              {roleConfig.department}
            </p>
          </div>
        </div>

        {/* In Registrar and Principal panels: Change this section into Log Out. In Learner panel: Remove completely since it already has a top logout button */}
        {activeRole !== 'student' && onBackToHome && (
          <button
            id="btn-sidebar-logout"
            onClick={onBackToHome}
            className="mt-3 w-full py-2 px-3 rounded-lg text-xs font-bold text-neutral-700 hover:text-white hover:bg-neutral-900 border border-slate-200 hover:border-neutral-900 transition-all flex items-center justify-center gap-2 uppercase tracking-wider shadow-2xs group"
          >
            <LogOut className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
            <span>Log Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};
