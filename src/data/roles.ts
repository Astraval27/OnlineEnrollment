import { ScreenId, UserRole } from '../types';

export interface RoleConfig {
  id: 'student' | 'registrar' | 'admin';
  label: string;
  badgeLabel: string;
  name: string;
  email: string;
  idNumber: string;
  department: string;
  roleDescription: string;
  allowedScreens: ScreenId[];
  defaultScreen: ScreenId;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    accent: string;
  };
}

export const ROLE_CONFIGS: Record<'student' | 'registrar' | 'admin', RoleConfig> = {
  student: {
    id: 'student',
    label: 'Student / Parent',
    badgeLabel: 'K-12 LEARNER PORTAL',
    name: 'Johnny Tabulo',
    email: 'j.tabulo@k12school.edu',
    idNumber: 'LRN: 109283746512',
    department: 'Senior High School • Grade 11 - STEM A',
    roleDescription: 'Learner milestone roadmap, DepEd Form 138 submission, ESC/Voucher status & class schedule',
    allowedScreens: ['applicant_home', 'user_settings'],
    defaultScreen: 'applicant_home',
    colorScheme: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      accent: 'emerald',
    },
  },
  registrar: {
    id: 'registrar',
    label: 'School Registrar',
    badgeLabel: 'K-12 REGISTRAR PORTAL',
    name: 'Maria Santos',
    email: 'registrar.santos@k12school.edu',
    idNumber: 'REG-2024-04',
    department: 'K-12 Basic Education Registrar Office',
    roleDescription: 'DepEd LRN verification, Form 138/SF9 evaluations, SHS voucher qualification & class sectioning',
    allowedScreens: ['applications', 'student_directory', 'course_management', 'user_settings'],
    defaultScreen: 'applications',
    colorScheme: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      badge: 'bg-blue-100 text-blue-800 border-blue-300',
      accent: 'blue',
    },
  },
  admin: {
    id: 'admin',
    label: 'Principal / Admin',
    badgeLabel: 'K-12 ADMIN PORTAL',
    name: 'Dr. Elena Rivera',
    email: 'principal.rivera@k12school.edu',
    idNumber: 'ADM-2024-01',
    department: 'Office of the Principal & Basic Education Administration',
    roleDescription: 'School-wide governance across Kinder to Grade 12, fee assessment, voucher subsidies & DepEd reporting',
    allowedScreens: [
      'student_directory',
      'financial_billing',
      'course_management',
      'applications',
      'user_settings',
      'applicant_home',
    ],
    defaultScreen: 'student_directory',
    colorScheme: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-900',
      badge: 'bg-purple-100 text-purple-800 border-purple-300',
      accent: 'purple',
    },
  },
};

/** Normalize role string in case 'applicant' is passed */
export const normalizeRole = (role: UserRole): 'student' | 'registrar' | 'admin' => {
  if (role === 'applicant' || role === 'student') return 'student';
  if (role === 'registrar') return 'registrar';
  return 'admin';
};
