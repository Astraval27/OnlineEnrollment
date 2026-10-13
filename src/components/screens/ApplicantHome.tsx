import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  GraduationCap,
  Calendar,
  Download,
  Bell,
  BookOpen,
  DollarSign,
  UserCheck,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Student, ScreenId } from '../../types';

interface ApplicantHomeProps {
  activeStudent?: Partial<Student>;
  onLogOut?: () => void;
  onShowAllNotifications?: () => void;
  onSelectScreen?: (screen: ScreenId) => void;
}

export const ApplicantHome: React.FC<ApplicantHomeProps> = ({
  activeStudent,
  onLogOut,
  onSelectScreen,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const studentName = activeStudent?.name || 'Johnny Tabulo';
  const lrn = activeStudent?.lrn || '109283746512';
  const gradeLevel = activeStudent?.gradeLevel || 'Grade 11';
  const trackStrand = activeStudent?.trackStrand || 'STEM (Senior High School)';
  const section = activeStudent?.section || 'STEM - Newton';
  const parentName = activeStudent?.parentGuardian || 'Roberto Tabulo';
  const appId = 'APP-2026-004912';

  const handleDownloadProvisionalSlip = () => {
    const textContent = `=======================================================
DEPARTMENT OF EDUCATION (DepEd) - REGION VII
OFFICE OF THE SCHOOL REGISTRAR • BASIC EDUCATION
PROVISIONAL ENROLLMENT SLIP & ROADMAP STATUS
(Pursuant to DepEd Order No. 03, s. 2018 - "No Refusal Policy")
=======================================================

APPLICATION REFERENCE : ${appId}
DATE OF ISSUANCE      : ${new Date().toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
LEARNER NAME          : ${studentName.toUpperCase()}
12-DIGIT LRN          : ${lrn}
GRADE LEVEL & STRAND  : ${gradeLevel} • ${trackStrand}
PROVISIONAL SECTION   : ${section} (Room 304, Building B)
CLASS ADVISER         : Engr. Ricardo Dalisay, M.S.

ENROLLMENT STATUS     : TEMPORARILY ENROLLED (DO 03, s. 2018)
MANDATORY DEADLINE    : OCTOBER 31, 2026

ROADMAP PROGRESS      : MILESTONE 5 OF 11 ACTIVE (45% COMPLETE)
- Step 1: BEEF Demographic Intake -> [COMPLETED]
- Step 2: 12-Digit LRN Validation -> [COMPLETED]
- Step 3: Track & Strand Placement -> [COMPLETED]
- Step 4: Health Clinic Clearance -> [COMPLETED]
- Step 5: SF9 Report Card Upload  -> [PENDING / UNDER UNDERTAKING]
- Step 6 to 11: Final Evaluation & BOSY LIS -> [QUEUED]

ISSUED BY:
Office of the School Registrar
DepEd School ID: 300481 • E-Enroll Academy
Barcode: DEPED-RO7-ROADMAP-${Date.now().toString(36).toUpperCase()}
=======================================================`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DEPED_Provisional_Enrollment_Slip_${appId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Provisional Enrollment Slip downloaded successfully.');
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-xl border border-neutral-800 flex items-center gap-2.5 animate-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Post-Submission Hand-off Verification Dispatch Alert Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-emerald-950">
                Student Portal Account Active & Verification Dispatched
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-200 text-emerald-900 uppercase">
                SY 2026-2027
              </span>
            </div>
            <p className="text-xs text-emerald-800 mt-0.5">
              SMS verification code and parent portal login confirmation have been transmitted. You are securely logged in as <strong>{studentName}</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadProvisionalSlip}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shrink-0 shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Provisional Slip</span>
        </button>
      </div>

      {/* Learner Identity Hero Card */}
      <div
        id="applicant-welcome-card"
        className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Welcome, {studentName}!
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-neutral-900 text-white uppercase">
              {gradeLevel} • {trackStrand}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-900 border border-blue-300 uppercase">
              DepEd 12-Digit LRN Verified
            </span>
          </div>

          <p className="text-neutral-500 text-sm mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              Learner Reference No.: <strong className="font-mono text-neutral-800">{lrn}</strong>
            </span>
            <span>•</span>
            <span>
              Application Ref: <strong className="font-mono text-neutral-800">{appId}</strong>
            </span>
            <span>•</span>
            <span>
              Parent: <strong className="text-neutral-800">{parentName}</strong>
            </span>
          </p>
        </div>

        <div className="text-left md:text-right shrink-0">
          <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block">
            ENROLLMENT STATUS (SY 2026-2027)
          </span>
          <div className="mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold tracking-wider uppercase shadow-2xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>TEMPORARILY ENROLLED (DO 03, s. 2018)</span>
          </div>
          <span className="text-[11px] text-amber-700 font-semibold block mt-1">
            Credentials submission deadline: October 31, 2026
          </span>
        </div>
      </div>

      {/* TWO PRIMARY INTERACTIVE PORTAL HUBS (Roadmap & Upload Form) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hub 1: Enrollment Roadmap Panel Entry */}
        <div
          id="hub-card-roadmap"
          className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-5"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-800">
                45% Completed
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-neutral-900">
                K-12 Basic Education Enrollment Roadmap
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Track your full 11-milestone progression from BEEF demographic intake to DepEd LIS Beginning-of-School-Year (BOSY) official registration.
              </p>
            </div>

            {/* Progress Bar Preview */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-neutral-700">Active: Milestone 5 (Academic Credentials)</span>
                <span className="text-neutral-500">4 Completed</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-900 rounded-full w-[45%]" />
              </div>
            </div>
          </div>

          <button
            id="btn-goto-roadmap-panel"
            onClick={() => onSelectScreen && onSelectScreen('enrollment_roadmap')}
            className="w-full py-2.5 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>Open Enrollment Roadmap Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hub 2: Upload Form 138 (SF9) Hub Entry */}
        <div
          id="hub-card-upload"
          className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-5"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Pending Submission
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-neutral-900">
                Upload Form 138 (SF9) & Credentials Center
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Submit digital copies of your DepEd Form 138 Progress Report Card, PSA Birth Certificate, or execute an Affidavit of Undertaking under DepEd Order No. 03.
              </p>
            </div>

            {/* Document Status Snapshot */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900">
                <span className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>PSA Birth Certificate</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-200/80 px-2 py-0.5 rounded">
                  Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                <span className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Form 138 / SF9 Report Card</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase bg-amber-200 px-2 py-0.5 rounded">
                  Under Undertaking
                </span>
              </div>
            </div>
          </div>

          <button
            id="btn-goto-upload-panel"
            onClick={() => onSelectScreen && onSelectScreen('upload_form')}
            className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>Open Upload Form Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tertiary Info Cards: Section, Financial Voucher, DepEd BOSY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Section & Class Schedule */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Class Section & Adviser
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-neutral-700">
              Active Roster
            </span>
          </div>
          <div>
            <div className="text-base font-bold text-neutral-900">{section}</div>
            <div className="text-xs text-neutral-500 mt-0.5">Room 304 • Science Wing Building B</div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-xs text-neutral-600 flex items-center justify-between">
            <span>Class Adviser:</span>
            <strong className="text-neutral-800">Engr. Ricardo Dalisay, M.S.</strong>
          </div>
        </div>

        {/* Card 2: Tuition & Voucher Subsidy */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Financial & Subsidy Status
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              100% Subsidized
            </span>
          </div>
          <div>
            <div className="text-base font-bold text-neutral-900">₱17,500.00 Applied</div>
            <div className="text-xs text-neutral-500 mt-0.5">DepEd Senior High School Voucher (SHS VP)</div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-xs text-neutral-600 flex items-center justify-between">
            <span>Outstanding Balance:</span>
            <strong className="text-emerald-700 font-bold">₱0.00 (Cleared)</strong>
          </div>
        </div>

        {/* Card 3: Important DepEd Dates */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Important Milestones
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
              DepEd Calendar
            </span>
          </div>
          <div>
            <div className="text-base font-bold text-neutral-900">October 31, 2026</div>
            <div className="text-xs text-neutral-500 mt-0.5">Mandatory Form 138 Undertaking Submission</div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-xs text-neutral-600 flex items-center justify-between">
            <span>BOSY LIS Confirmation:</span>
            <strong className="text-neutral-800">August 2026 Batch</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
