import React from 'react';
import {
  Shield,
  Users,
  Award,
  ArrowRight,
  Clock,
  Sparkles,
  PhoneCall,
  FileCheck2,
  Layers,
} from 'lucide-react';

interface AboutSectionProps {
  onNavigateTab?: (tab: string) => void;
  onOpenAdmission?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onNavigateTab,
  onOpenAdmission,
}) => {
  return (
    <section id="about" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-neutral-800 uppercase tracking-wider shadow-2xs">
            <Award className="w-3.5 h-3.5 text-neutral-900" />
            <span>About E-ENROLL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Next-Generation K-12 Basic Education Enrollment Infrastructure
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            E-ENROLL is an institutional-grade digital admissions and learner management platform designed to eliminate long school queues, protect credential integrity, and provide a unified digital hub for learners, parents, teachers, and school administrators.
          </p>
        </div>

        {/* 3 Core Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              Integrity & Data Security
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Every applicant record, transcript scan, and identification credential is processed through 256-bit encrypted validation containers, ensuring compliance with institutional privacy standards.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              Speed & Transparency
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Eliminate physical waiting lines. Applicants track verification status across all 11 steps in real time, receiving immediate notifications when documents are reviewed, accepted, or flagged.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              Unified Administrative Ecosystem
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Seamless synchronization between Admissions, Registrar Office, Cashier/Finance, and Academic Department Chairs ensures consistent records from first application to final graduation.
            </p>
          </div>
        </div>

        {/* 3 Dedicated Role Profiles Section */}
        <div className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Role-Based Access Architecture
            </span>
            <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
              Tailored Experiences for Three Core User Roles
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl mx-auto">
              Each user type has dedicated permissions, customized navigation dashboards, and distinct operational tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Role 1: Student */}
            <div className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-xs hover:border-emerald-500 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                  ROLE 1: LEARNER & PARENT
                </span>
                <span className="text-xs font-bold text-neutral-400">Applicant Portal</span>
              </div>
              <h4 className="text-base font-bold text-neutral-900">Learner & Parent Hub</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Step-by-step 11-stage enrollment roadmap, digital Form 138 (SF9) upload card, verification status tracker, enrolled schedule preview, and personalized tuition balances.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-emerald-800">
                Primary views: Enrollment Roadmap, Document Submissions, Learner Settings.
              </div>
            </div>

            {/* Role 2: Registrar */}
            <div className="p-6 rounded-2xl bg-white border border-blue-200 shadow-xs hover:border-blue-500 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300 uppercase">
                  ROLE 2: REGISTRAR
                </span>
                <span className="text-xs font-bold text-neutral-400">Academic Records</span>
              </div>
              <h4 className="text-base font-bold text-neutral-900">School Registrar</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Admissions application queue, DepEd Form 138 (SF9) / PSA document validation, LIS Learner Reference Number checks, master learner directory, and class section capacity management.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-blue-800">
                Primary views: Applications Review, Learner Directory, Class Sections.
              </div>
            </div>

            {/* Role 3: Administrator */}
            <div className="p-6 rounded-2xl bg-white border border-purple-200 shadow-xs hover:border-purple-500 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-300 uppercase">
                  ROLE 3: PRINCIPAL / ADMIN
                </span>
                <span className="text-xs font-bold text-neutral-400">Executive & Finance</span>
              </div>
              <h4 className="text-base font-bold text-neutral-900">Principal & Finance Admin</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Comprehensive school governance, DepEd voucher and ESC billing management, tuition financial ledger, learner view simulation, and security audit logs.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-purple-800">
                Primary views: Financial & Billing, All Academic Modules, System Config.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner Stats */}
        <div className="bg-neutral-900 text-white rounded-2xl p-8 sm:p-10 shadow-lg grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-white block">
              100%
            </span>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-1 block">
              Digital Workflow
            </span>
          </div>

          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-white block">
              1,420+
            </span>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-1 block">
              Enrolled Learners
            </span>
          </div>

          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-white block">
              11
            </span>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-1 block">
              Guided Milestones
            </span>
          </div>

          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-white block">
              24/7
            </span>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-1 block">
              Portal Availability
            </span>
          </div>
        </div>

        {/* Dedicated Panel Cross-Links */}
        {onNavigateTab && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
                <span>Next Steps in the Portal</span>
              </div>
              <h4 className="text-lg font-bold text-neutral-900">
                Explore More Dedicated Panels
              </h4>
              <p className="text-xs text-neutral-500">
                Learn more about our basic education services or review the full 11-step admission roadmap.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('services')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-neutral-700" />
                <span>Services Panel</span>
              </button>
              <button
                onClick={() => onNavigateTab('admission')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <FileCheck2 className="w-4 h-4 text-neutral-700" />
                <span>Admission Panel</span>
              </button>
              {onOpenAdmission && (
                <button
                  onClick={onOpenAdmission}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
                >
                  <span>Enroll Learner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
