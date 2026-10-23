import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Upload,
  ArrowRight,
  ShieldCheck,
  Check,
  Building,
  GraduationCap,
  FileCheck2,
  Calendar,
  Lock,
  Info,
  Printer,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Student, ScreenId } from '../../types';
import { fetchStudentEnrollmentStatus } from '../../api/enrollmentApi';

interface EnrollmentRoadmapScreenProps {
  activeStudent?: Partial<Student>;
  onSelectScreen?: (screen: ScreenId) => void;
  onNavigateToUpload?: () => void;
}

interface RoadmapMilestone {
  stepNumber: number;
  title: string;
  subtitle: string;
  depEdPolicy: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'LOCKED';
  completedDate?: string;
  officerInCharge: string;
  description: string;
  requirements: Array<{
    item: string;
    isFulfilled: boolean;
    note?: string;
  }>;
  actionLabel?: string;
  actionType?: 'upload' | 'download_provisional' | 'download_cor' | 'contact_adviser' | 'view_details';
}

export const EnrollmentRoadmapScreen: React.FC<EnrollmentRoadmapScreenProps> = ({
  activeStudent,
  onSelectScreen,
  onNavigateToUpload,
}) => {
  const [selectedStep, setSelectedStep] = useState<number>(5);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const studentName = activeStudent?.name || 'Johnny Tabulo';
  const lrn = activeStudent?.lrn || '109283746512';
  const gradeLevel = activeStudent?.gradeLevel || 'Grade 11';
  const trackStrand = activeStudent?.trackStrand || 'STEM (Science, Technology, Engineering & Math)';
  const section = activeStudent?.section || 'STEM - Newton';
  const appId = 'APP-2026-004912';

  const milestones: RoadmapMilestone[] = [
    {
      stepNumber: 1,
      title: 'Basic Education Enrollment Form (BEEF) Intake',
      subtitle: 'DepEd Official Online / Physical Intake Form',
      depEdPolicy: 'DepEd Order No. 03, s. 2018 Section IV.A',
      status: 'COMPLETED',
      completedDate: 'June 15, 2026 09:30 AM',
      officerInCharge: 'Online Admissions Intake System',
      description:
        'Submission of learner personal details, mother tongue, parent/guardian household information, 4Ps CCT ID, and disability/LSEN manifestations.',
      requirements: [
        { item: 'Completed Learner Demographic Profile', isFulfilled: true },
        { item: 'Parent / Legal Guardian Consent & Digital Signature', isFulfilled: true },
        { item: 'Data Privacy Notice & Republic Act 10173 Acknowledgement', isFulfilled: true },
      ],
      actionLabel: 'View Intake Copy',
      actionType: 'view_details',
    },
    {
      stepNumber: 2,
      title: '12-Digit LRN Validation & Duplicate Check',
      subtitle: 'DepEd Learner Information System (LIS) Verification',
      depEdPolicy: 'DepEd Order No. 58, s. 2017 & DO 22, s. 2012',
      status: 'COMPLETED',
      completedDate: 'June 17, 2026 02:15 PM',
      officerInCharge: 'School Registrar • Maria Santos',
      description:
        'Validation of 12-digit Learner Reference Number (LRN: 109283746512) against DepEd national database to eliminate ghost or duplicate enrollees across schools.',
      requirements: [
        { item: '12-digit Valid LRN Format Verified', isFulfilled: true, note: 'Matched with DepEd LIS database' },
        { item: 'De-duplication Check against Origin Division', isFulfilled: true, note: 'Zero duplicate entries detected' },
        { item: 'Previous School ID & Division Cleared', isFulfilled: true },
      ],
      actionLabel: 'LRN Certified Matched',
      actionType: 'view_details',
    },
    {
      stepNumber: 3,
      title: 'Track, Strand & Curriculum Allocation',
      subtitle: 'Senior High School Program & Track Assessment',
      depEdPolicy: 'DepEd Order No. 51, s. 2015 & DO 21, s. 2019',
      status: 'COMPLETED',
      completedDate: 'June 20, 2026 11:00 AM',
      officerInCharge: 'Academic Program Head • Dr. Evelyn Ramos',
      description:
        'Placement in Senior High School Academic Track: Science, Technology, Engineering, and Mathematics (STEM). Evaluation of Grade 10 National Career Assessment Examination (NCAE) alignment.',
      requirements: [
        { item: 'Grade 10 Junior High School Completion Certification', isFulfilled: true },
        { item: 'Senior High School Academic Track: STEM', isFulfilled: true },
        { item: 'Class section seat quota reserved in STEM - Newton', isFulfilled: true },
      ],
      actionLabel: 'Track Confirmed',
      actionType: 'view_details',
    },
    {
      stepNumber: 4,
      title: 'Health, Immunization & Clinic Clearance',
      subtitle: 'DepEd School Health & Nutrition Assessment',
      depEdPolicy: 'DepEd Order No. 41, s. 2020 (School Health Mandates)',
      status: 'COMPLETED',
      completedDate: 'June 22, 2026 03:45 PM',
      officerInCharge: 'School Nurse & Medical Unit',
      description:
        'Health appraisal, physical fitness evaluation, immunization records, emergency contact validation, and dietary allergy recording for on-campus activities.',
      requirements: [
        { item: 'Medical History & Emergency Contacts Filed', isFulfilled: true },
        { item: 'Routine Vision and Hearing Appraisal', isFulfilled: true },
        { item: 'Clinic Health Clearance Slip Issued', isFulfilled: true },
      ],
      actionLabel: 'Clinic Cleared',
      actionType: 'view_details',
    },
    {
      stepNumber: 5,
      title: 'DepEd Form 138 (SF9) & PSA Credentials Submission',
      subtitle: 'Academic Credentials Review & Temporary Enrollment Handling',
      depEdPolicy: 'DepEd Order No. 03, s. 2018 (Basic Education Enrollment Policy)',
      status: 'IN_PROGRESS',
      officerInCharge: 'Admissions & Registrar Credentials Desk',
      description:
        'Submission of original/certified true copy of DepEd Form 138 (SF9 Progress Report Card) and PSA SECPA Birth Certificate. Pursuant to DepEd Order No. 03, s. 2018, learner is TEMPORARILY ENROLLED under an Affidavit of Undertaking pending physical release of credentials by origin school.',
      requirements: [
        { item: 'PSA SECPA Birth Certificate (PDF/Image)', isFulfilled: true, note: 'Verified by Registrar' },
        { item: 'DepEd Form 138 / SF9 Report Card', isFulfilled: false, note: 'Pending upload or submission' },
        { item: 'Affidavit of Undertaking (DepEd DO 03, s. 2018)', isFulfilled: true, note: 'Signed & active until Oct 31, 2026' },
      ],
      actionLabel: 'Go to Upload Form 138 (SF9)',
      actionType: 'upload',
    },
    {
      stepNumber: 6,
      title: 'Registrar Academic Evaluation & Transfer Clearance',
      subtitle: 'Subject Prerequisites & General Average Verification',
      depEdPolicy: 'DepEd Order No. 8, s. 2015 (Classroom Assessment)',
      status: 'PENDING',
      officerInCharge: 'School Registrar • Maria Santos',
      description:
        'Evaluation of General Average, subject grade prerequisites (General Math, Biology, Physics), and formal clearance of student transfer from previous school division.',
      requirements: [
        { item: 'Verification of SF9 General Average >= 85.0%', isFulfilled: false, note: 'Pending SF9 copy' },
        { item: 'STEM Core Subject Prerequisites Clearance', isFulfilled: false },
        { item: 'School Transfer Clearance (DepEd Form 137 / SF10 Request dispatched)', isFulfilled: true },
      ],
      actionLabel: 'Awaiting Document Upload',
      actionType: 'view_details',
    },
    {
      stepNumber: 7,
      title: 'Class Sectioning & Faculty Adviser Assignment',
      subtitle: 'Official Section Roster & Room Scheduling',
      depEdPolicy: 'DepEd Order No. 03, s. 2018 Section IV.D (Sectioning Policy)',
      status: 'PENDING',
      officerInCharge: 'SHS Sectioning Committee',
      description:
        'Permanent assignment to Senior High School class section STEM - Newton (Room 304, Science Wing). Roster capacity capped at 45 learners per section per DepEd standards.',
      requirements: [
        { item: 'Provisional Section Hold: STEM - Newton (Seat #28/45)', isFulfilled: true },
        { item: 'Class Adviser Assigned: Engr. Ricardo Dalisay, M.S.', isFulfilled: true },
        { item: 'Final Section Masterlist Confirmation', isFulfilled: false, note: 'Unlocks upon Step 5 completion' },
      ],
      actionLabel: 'View Schedule Details',
      actionType: 'view_details',
    },
    {
      stepNumber: 8,
      title: 'Tuition Assessment, ESC & DepEd SHS Voucher Billing',
      subtitle: 'Government Subsidy Billing & School Fee Assessment',
      depEdPolicy: 'DepEd Order No. 19, s. 2017 & PEAC ESC Guidelines',
      status: 'PENDING',
      officerInCharge: 'School Accounting & Billing Office',
      description:
        'Application of DepEd Senior High School Voucher Program (SHS VP) subsidy (₱17,500.00) or PEAC ESC grant. Total tuition balance is 100% subsidized with zero out-of-pocket cost.',
      requirements: [
        { item: 'DepEd SHS Voucher / ESC Certificate Validated', isFulfilled: true, note: '₱17,500.00 Subsidy Applied' },
        { item: 'Official Billing Assessment & Statement of Account', isFulfilled: true, note: 'Current Balance: ₱0.00' },
        { item: 'Finance Clearance Certificate Signed', isFulfilled: false },
      ],
      actionLabel: 'View Fee Statement',
      actionType: 'view_details',
    },
    {
      stepNumber: 9,
      title: 'DepEd Order No. 03 Undertaking Compliance Audit',
      subtitle: 'Credentials Delivery Tracking & Grace Period Compliance',
      depEdPolicy: 'DepEd Order No. 03, s. 2018 Section IV.B (Undertaking Mandate)',
      status: 'PENDING',
      officerInCharge: 'Registrar Compliance Desk',
      description:
        'Monitoring of the mandatory October 31, 2026 deadline for formal submission of missing original academic credentials. School-to-school transfer request via DepEd SF10 online facility.',
      requirements: [
        { item: 'Affidavit of Undertaking on Official Record', isFulfilled: true, note: 'Deadline: October 31, 2026' },
        { item: 'Official DepEd Form 137 / SF10 Origin School Release', isFulfilled: false },
        { item: 'Full Regularization of Enrollment Status', isFulfilled: false },
      ],
      actionLabel: 'Download Provisional Slip',
      actionType: 'download_provisional',
    },
    {
      stepNumber: 10,
      title: 'Official Certificate of Registration (COR) Issuance',
      subtitle: 'Permanent Matriculation & Student ID Validation',
      depEdPolicy: 'Manual of Regulations for Private Basic Education Schools',
      status: 'PENDING',
      officerInCharge: 'Office of the School Registrar',
      description:
        'Generation of certified DepEd Certificate of Registration (COR) containing student course load, class section schedules, adviser signature, and official school seal.',
      requirements: [
        { item: 'Complete Submission of Academic Credentials', isFulfilled: false },
        { item: 'Adviser & Registrar Digital Verification Stamps', isFulfilled: false },
        { item: 'Active Student ID Card Activation', isFulfilled: false },
      ],
      actionLabel: 'Preview COR Template',
      actionType: 'download_cor',
    },
    {
      stepNumber: 11,
      title: 'DepEd BOSY (Beginning of School Year) LIS Encoding',
      subtitle: 'National Basic Education Enrollment Finalization',
      depEdPolicy: 'DepEd Order No. 27, s. 2019 (LIS BOSY Encoding)',
      status: 'PENDING',
      officerInCharge: 'Division DepEd LIS Coordinator',
      description:
        'Final electronic encoding and confirmation of learner into the Department of Education national Learner Information System for School Year 2026-2027 Beginning-of-School-Year registry.',
      requirements: [
        { item: 'Registrar Final BOSY Masterlist Batch Inclusion', isFulfilled: false },
        { item: 'Division Office DepEd LIS Synced & Locked', isFulfilled: false },
        { item: 'DepEd Official School Register (SF1) Generated', isFulfilled: false },
      ],
      actionLabel: 'Scheduled for August 2026',
      actionType: 'view_details',
    },
  ];

  const currentActiveMilestone = milestones.find((m) => m.stepNumber === selectedStep) || milestones[4];

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

NOTE: The learner has been admitted provisionally and shall attend classes
regularly without prejudice. Official Form 138/SF9 or school-to-school
SF10 request must be satisfied on or before October 31, 2026.

ISSUED BY:
Office of the School Registrar
DepEd School ID: 300481 • E-Enroll Academy
Verification Code: DEPED-RO7-ROADMAP-${Date.now().toString(36).toUpperCase()}
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
    showToast('Provisional Enrollment Slip successfully downloaded.');
  };

  const handlePrintRoadmap = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-xl border border-neutral-800 flex items-center gap-2.5 animate-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-neutral-900 text-white uppercase tracking-wider">
              SY 2026-2027
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
              11-Step Official Roadmap
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 uppercase">
              DO 03, s. 2018 Undertaking Active
            </span>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight mt-2">
            Enrollment Roadmap: {studentName}
          </h2>
          <p className="text-neutral-500 text-sm mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              LRN: <strong className="font-mono text-neutral-800">{lrn}</strong>
            </span>
            <span>•</span>
            <span>
              Program: <strong className="text-neutral-800">{gradeLevel} — {trackStrand}</strong>
            </span>
            <span>•</span>
            <span>
              Application: <strong className="font-mono text-neutral-800">{appId}</strong>
            </span>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            id="btn-print-roadmap"
            onClick={handlePrintRoadmap}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-neutral-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Roadmap</span>
          </button>
          <button
            id="btn-download-provisional-slip"
            onClick={handleDownloadProvisionalSlip}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-amber-700" />
            <span>Provisional Slip (DO 03)</span>
          </button>
          <button
            id="btn-roadmap-goto-upload"
            onClick={() => {
              if (onNavigateToUpload) onNavigateToUpload();
              else if (onSelectScreen) onSelectScreen('upload_form');
            }}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Form 138 (SF9)</span>
          </button>
        </div>
      </div>

      {/* Progress Metric Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="font-bold uppercase tracking-wider text-neutral-500">
              Department of Education Enrollment Milestones Progress
            </span>
            <div className="text-sm font-bold text-neutral-900 mt-0.5">
              Milestone 5 of 11: Academic Credentials & DepEd Form 138 (SF9)
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              4 Milestones Complete
            </span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
              1 In Progress
            </span>
            <span className="text-xs font-bold text-neutral-700 bg-slate-100 px-2.5 py-1 rounded-md">
              45% Overall
            </span>
          </div>
        </div>

        {/* 11 Interactive Segmented Steps */}
        <div className="grid grid-cols-11 gap-1.5 sm:gap-2 pt-1">
          {milestones.map((m) => {
            const isCompleted = m.status === 'COMPLETED';
            const isCurrent = m.status === 'IN_PROGRESS';
            const isSelected = m.stepNumber === selectedStep;

            return (
              <button
                key={m.stepNumber}
                id={`btn-step-${m.stepNumber}`}
                onClick={() => setSelectedStep(m.stepNumber)}
                title={`Step ${m.stepNumber}: ${m.title}`}
                className={`h-11 rounded-lg flex flex-col items-center justify-center transition-all duration-200 font-mono text-xs font-bold relative group ${
                  isSelected
                    ? 'ring-2 ring-neutral-900 bg-neutral-900 text-white shadow-md'
                    : isCompleted
                    ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                    : isCurrent
                    ? 'bg-amber-500 text-white ring-2 ring-amber-400 animate-pulse'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span>{m.stepNumber}</span>
                )}
                <span className="text-[9px] font-sans font-medium opacity-80 hidden md:block">
                  {isCompleted ? 'Done' : isCurrent ? 'Active' : 'Step'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-[11px] text-neutral-500">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-neutral-700">Click any step number</span> to view policy citation, officer in charge, and requirement checklist.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800 inline-block" />
              <span>Completed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Active Action Needed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" />
              <span>Upcoming Milestone</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Focus Detail Card for Selected Step */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 uppercase">
                Milestone {currentActiveMilestone.stepNumber} of 11
              </span>
              {currentActiveMilestone.status === 'COMPLETED' ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>COMPLETED</span>
                </span>
              ) : currentActiveMilestone.status === 'IN_PROGRESS' ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                  <span>CURRENT ACTIVE MILESTONE</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>UPCOMING REGISTRAR TASK</span>
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-neutral-900 mt-2">
              {currentActiveMilestone.title}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              {currentActiveMilestone.subtitle} • <strong className="text-neutral-700">{currentActiveMilestone.depEdPolicy}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase block">
              Officer in Charge
            </span>
            <span className="text-xs font-semibold text-neutral-800 block mt-0.5">
              {currentActiveMilestone.officerInCharge}
            </span>
            {currentActiveMilestone.completedDate && (
              <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">
                Completed: {currentActiveMilestone.completedDate}
              </span>
            )}
          </div>
        </div>

        {/* Milestone Description */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4.5 text-xs text-neutral-700 leading-relaxed">
          {currentActiveMilestone.description}
        </div>

        {/* Requirements Checklist */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
            Milestone Requirements & Verification Checklist
          </h4>
          <div className="space-y-2.5">
            {currentActiveMilestone.requirements.map((req, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-3.5 rounded-lg border border-slate-100 bg-white hover:border-slate-200 transition-colors text-xs"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                      req.isFulfilled
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-slate-300 text-transparent'
                    }`}
                  >
                    {req.isFulfilled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className={`font-semibold ${req.isFulfilled ? 'text-neutral-800' : 'text-neutral-900 font-bold'}`}>
                      {req.item}
                    </span>
                    {req.note && (
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Note: {req.note}
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    req.isFulfilled
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {req.isFulfilled ? 'Fulfilled' : 'Action Required'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Footer Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <div className="text-xs text-neutral-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-neutral-400" />
            <span>
              Pursuant to DepEd Order No. 03, s. 2018, temporary enrollment status does not delay classroom participation.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {currentActiveMilestone.actionType === 'upload' && (
              <button
                id="btn-milestone-action-upload"
                onClick={() => {
                  if (onNavigateToUpload) onNavigateToUpload();
                  else if (onSelectScreen) onSelectScreen('upload_form');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Form 138 (SF9) Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {currentActiveMilestone.actionType === 'download_provisional' && (
              <button
                id="btn-milestone-download-slip"
                onClick={handleDownloadProvisionalSlip}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Provisional Slip</span>
              </button>
            )}

            {currentActiveMilestone.actionType === 'download_cor' && (
              <button
                id="btn-milestone-download-cor"
                onClick={() => showToast('Certificate of Registration will be available upon completion of Step 5 and 6.')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 text-neutral-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-neutral-500" />
                <span>Preview COR Template</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Full 11-Step Roadmap Journey Timeline Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-wider text-neutral-900 uppercase">
              Complete 11-Milestone Enrollment Journey
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              From online intake to DepEd national Beginning-of-School-Year registry
            </p>
          </div>
          <span className="text-xs font-bold text-neutral-600 bg-slate-100 px-3 py-1 rounded-md">
            School Year 2026-2027
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {milestones.map((m) => {
            const isCompleted = m.status === 'COMPLETED';
            const isCurrent = m.status === 'IN_PROGRESS';

            return (
              <div
                key={m.stepNumber}
                onClick={() => setSelectedStep(m.stepNumber)}
                className={`py-4 px-3 sm:px-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                  selectedStep === m.stepNumber
                    ? 'bg-neutral-50/80 border border-neutral-300/80'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                      isCompleted
                        ? 'bg-neutral-900 text-white'
                        : isCurrent
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : m.stepNumber}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-neutral-900">
                        {m.title}
                      </h4>
                      {isCompleted ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Done
                        </span>
                      ) : isCurrent ? (
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                          Active Focus
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-neutral-500 bg-slate-100 px-2 py-0.5 rounded">
                          Upcoming
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {m.officerInCharge} • {m.depEdPolicy}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right self-end sm:self-center">
                  {m.completedDate ? (
                    <span className="text-xs font-mono text-neutral-500 hidden md:block">
                      {m.completedDate.split(' ')[0]}
                    </span>
                  ) : isCurrent ? (
                    <span className="text-xs font-bold text-amber-700">
                      In Progress
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
