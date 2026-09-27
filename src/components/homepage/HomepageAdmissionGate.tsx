import React from 'react';
import {
  UserPlus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Calendar,
  FileCheck2,
  Clock,
  GraduationCap,
  FileText,
  BadgeCheck,
  CheckCircle2,
} from 'lucide-react';

interface HomepageAdmissionGateProps {
  onSelectPathway: (pathway: 'new_student' | 'transferee') => void;
}

export const HomepageAdmissionGate: React.FC<HomepageAdmissionGateProps> = ({
  onSelectPathway,
}) => {
  return (
    <div id="admission-gate" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs my-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-neutral-800 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
            <span>Public Admission Gate • SY 2026-2027</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Apply / Enroll Now (Guest Admission)
          </h2>
          <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
            No account required to begin. Select your learner category below. You will complete your DepEd Basic Education Intake (BEEF), set up your parent portal account, and track your 11-step enrollment roadmap in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>DepEd DO 03, s. 2018 Compliant</span>
          </span>
        </div>
      </div>

      {/* Two Initial Pathways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        {/* Pathway 1: New Student (No LRN) */}
        <div className="border-2 border-slate-200 hover:border-neutral-900 rounded-xl p-6 transition-all duration-200 bg-slate-50/50 hover:bg-white group flex flex-col justify-between shadow-2xs hover:shadow-md">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                <UserPlus className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-extrabold tracking-wider text-neutral-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full uppercase">
                PATHWAY A
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-neutral-900 group-hover:text-neutral-900 transition-colors">
                New Student (No LRN)
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Incoming Kindergarten and Grade 1 learners without a 12-digit DepEd Learner Reference Number.
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-2 pt-2 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  <strong>DO 20, s. 2018 & DO 17, s. 2025:</strong> Automatic age-eligibility validation (5 years old by Oct 31 cutoff).
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  <strong>Temporary Reference ID:</strong> Auto-generated tracking code (e.g. <code>TEMP-2026-XXXXXX</code>) for LIS processing.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  <strong>Integrated Portal Account:</strong> Direct hand-off to your live Enrollment Roadmap.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              id="btn-pathway-new-student"
              onClick={() => onSelectPathway('new_student')}
              className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs group-hover:shadow-md"
            >
              <span>Enroll as New Student</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Pathway 2: Transferee / Balik-Aral (With LRN) */}
        <div className="border-2 border-slate-200 hover:border-neutral-900 rounded-xl p-6 transition-all duration-200 bg-slate-50/50 hover:bg-white group flex flex-col justify-between shadow-2xs hover:shadow-md">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-300 text-neutral-900 flex items-center justify-center shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-extrabold tracking-wider text-neutral-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full uppercase">
                PATHWAY B
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-neutral-900 group-hover:text-neutral-900 transition-colors">
                Transferee / Balik-Aral (With LRN)
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Incoming Grades 1 to 12 learners transferring from public/private schools or returning after school gap.
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-2 pt-2 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  <strong>12-Digit LRN Registry Query:</strong> 70%+ profile auto-fill from DepEd LIS database.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  <strong>SF10 Electronic Tracking (DO 54, s. 2016):</strong> Automatic digital transfer request sent to origin school ID.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  <strong>DO 03, s. 2018 Temporary Enrollment:</strong> Protected conditional enrollment if SF9 report card is delayed.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              id="btn-pathway-transferee"
              onClick={() => onSelectPathway('transferee')}
              className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs group-hover:shadow-md"
            >
              <span>Enroll with 12-Digit LRN</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Assurance Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-neutral-400" />
          <span>Average intake time: 4-6 minutes • Automatic session auto-save</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-neutral-700" />
            <span>Republic Act No. 10173 (Data Privacy Act) Enforced</span>
          </span>
        </div>
      </div>
    </div>
  );
};
