import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  CreditCard,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface AdmissionGuideSectionProps {
  onStartAdmission: () => void;
  onOpenLogin: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const AdmissionGuideSection: React.FC<AdmissionGuideSectionProps> = ({
  onStartAdmission,
  onOpenLogin: _onOpenLogin,
  onNavigateTab,
}) => {
  const [activeStepTab, setActiveStepTab] = useState<number>(5);

  const enrollmentSteps = [
    {
      step: 1,
      title: 'Online Registration & Account Creation',
      category: 'Phase 1: Application',
      desc: 'Create your applicant profile on E-ENROLL, verify your primary contact email address, and receive your Applicant Tracking ID.',
      requirements: ['Valid Email Address', 'Active Mobile Contact Number'],
      digitalOnly: true,
    },
    {
      step: 2,
      title: 'Personal & Family Background Details',
      category: 'Phase 1: Application',
      desc: 'Fill in your complete legal name, date of birth, nationality, emergency contact persons, and residential address.',
      requirements: ['Proof of Legal Residence', 'Parent/Guardian Contact Details'],
      digitalOnly: true,
    },
    {
      step: 3,
      title: 'Academic Records & 12-Digit DepEd LRN',
      category: 'Phase 1: Application',
      desc: 'Input prior elementary or junior high school attended, 12-digit DepEd Learner Reference Number (LRN), and general average.',
      requirements: ['12-Digit DepEd LRN', 'Prior School Clearance / SF10 Form'],
      digitalOnly: true,
    },
    {
      step: 4,
      title: 'Grade Level & Academic Strand Selection',
      category: 'Phase 1: Application',
      desc: 'Select learner grade level (Kindergarten to Grade 12) and Senior High School Academic Track/Strand (STEM, ABM, HUMSS, TVL).',
      requirements: ['Grade Level Eligibility Check', 'SHS Strand Prerequisites'],
      digitalOnly: true,
    },
    {
      step: 5,
      title: 'Upload Digital Copies of Credentials',
      category: 'Phase 2: Document Verification',
      desc: 'Upload clear scans of DepEd Form 138 (SF9 report card), PSA Birth Certificate, Certificate of Good Moral Character, and 2x2 ID photo.',
      requirements: ['DepEd Form 138 / SF9 (PDF/JPG, Max 5MB)', 'PSA Birth Certificate', 'Good Moral Certificate'],
      digitalOnly: true,
    },
    {
      step: 6,
      title: 'Registrar Office Credential Screening',
      category: 'Phase 2: Document Verification',
      desc: 'School registrar officers verify submitted SF9 grades and DepEd LRN validity against LIS database.',
      requirements: ['LIS Learner Verification', 'Grade Average Evaluation'],
      digitalOnly: true,
    },
    {
      step: 7,
      title: 'Hard Copy SF9 & PSA Submission',
      category: 'Phase 2: Document Verification',
      desc: 'Submit original Form 138 (SF9), PSA Birth Certificate, and certificate of completion to the school registrar window.',
      requirements: ['Original DepEd Form 138 (SF9)', 'PSA Birth Certificate Copy', 'Good Moral Certificate'],
      digitalOnly: false,
    },
    {
      step: 8,
      title: 'School Health & Dental Clearance',
      category: 'Phase 2: Document Verification',
      desc: 'Submit basic physical appraisal, immunization/vaccination records, and emergency health contact card to the school clinic.',
      requirements: ['Health Appraisal Form', 'Immunization / Vaccine Card', 'Emergency Medical Consent'],
      digitalOnly: false,
    },
    {
      step: 9,
      title: 'Tuition, ESC & SHS Voucher Assessment',
      category: 'Phase 3: Finalization',
      desc: 'Review total school fees, apply PEAC / ESC subsidy discounts or DepEd SHS voucher deductions, and settle downpayment.',
      requirements: ['Tuition Assessment Sheet', 'ESC / DepEd Voucher Qualified Certificate'],
      digitalOnly: true,
    },
    {
      step: 10,
      title: 'Class Section Allocation & Subject Schedule',
      category: 'Phase 3: Finalization',
      desc: 'School registrar assigns learner section block (e.g. Grade 11 - STEM A), class adviser, and K-12 subject timetable.',
      requirements: ['Section Capacity Allotment', 'Adviser Assignment'],
      digitalOnly: true,
    },
    {
      step: 11,
      title: 'Certificate of Enrollment (COE) & School ID',
      category: 'Phase 3: Finalization',
      desc: 'Receive official Certificate of Enrollment (COE), validated Learner Reference Number confirmation, and student school ID.',
      requirements: ['Certificate of Enrollment (COE)', 'Official Learner School ID'],
      digitalOnly: false,
    },
  ];

  const currentStepData = enrollmentSteps[activeStepTab - 1];

  const requirementsList = [
    {
      name: 'Academic Transcript (Form 138 / TOR)',
      desc: 'Certified copy of high school Form 138 or Official Transcript of Records for transferees.',
      format: 'PDF or JPG (Max 5MB)',
      type: 'DIGITAL & HARD COPY',
      mandatory: true,
    },
    {
      name: 'Valid ID Card',
      desc: 'Government-issued ID, Passport, or valid secondary school identification card.',
      format: 'Clear scan / Photo',
      type: 'DIGITAL UPLOAD',
      mandatory: true,
    },
    {
      name: 'PSA Birth Certificate',
      desc: 'Original copy printed on Philippine Statistics Authority (PSA) security paper.',
      format: 'Original hard copy + PDF Scan',
      type: 'DIGITAL & HARD COPY',
      mandatory: true,
    },
    {
      name: 'Certificate of Good Moral Character',
      desc: 'Issued by previous school guidance office or principal within the last 6 months.',
      format: 'Original sealed letter',
      type: 'HARD COPY SUBMISSION',
      mandatory: true,
    },
    {
      name: 'Medical Clearance Certificate',
      desc: 'Standard physical examination, routine laboratory tests, and health clearance.',
      format: 'Clinic stamped form',
      type: 'CAMPUS CLINIC',
      mandatory: true,
    },
    {
      name: 'Recent 2x2 Identification Photos',
      desc: 'High-resolution photo with white background and formal collar attire.',
      format: 'Digital JPG + 4 Printed copies',
      type: 'DIGITAL & PRINT',
      mandatory: true,
    },
  ];

  return (
    <section id="admission" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 border border-slate-200 rounded-full text-xs font-bold text-neutral-800 uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5 text-neutral-900" />
            <span>Admission Guidelines & Procedure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Step-by-Step Enrollment Process
          </h2>
          <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
            Follow the 11-step roadmap to complete your registration.
            Track each milestone in real time through your applicant portal.
          </p>
        </div>

        {/* 11-Step Stepper Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold tracking-wider text-neutral-500 uppercase">
              SELECT A STEP TO VIEW REQUIREMENTS & INSTRUCTIONS
            </h3>
            <span className="text-xs font-mono font-bold text-neutral-800">
              STEP {activeStepTab} OF 11
            </span>
          </div>

          {/* Stepper Buttons 1 to 11 */}
          <div className="grid grid-cols-11 gap-1.5 sm:gap-2">
            {enrollmentSteps.map((s) => {
              const isSelected = activeStepTab === s.step;
              return (
                <button
                  key={s.step}
                  id={`btn-step-guide-${s.step}`}
                  onClick={() => setActiveStepTab(s.step)}
                  className={`py-3 rounded-lg flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-neutral-900 text-white shadow-sm ring-2 ring-neutral-900 ring-offset-2'
                      : 'bg-white border border-slate-200 text-neutral-700 hover:border-neutral-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-bold">{s.step}</span>
                  <span className="hidden md:inline text-[9px] uppercase font-semibold opacity-75 truncate max-w-[90%]">
                    {s.step === 5 ? 'Upload' : s.step === 11 ? 'Final' : `P${Math.ceil(s.step / 4)}`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Card for Active Step */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded uppercase tracking-wider">
                  {currentStepData.category}
                </span>
                <span className="text-xs font-mono font-bold text-neutral-400">
                  Step {currentStepData.step} of 11
                </span>
              </div>
              <h4 className="text-lg font-bold text-neutral-900">
                {currentStepData.title}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl">
                {currentStepData.desc}
              </p>

              <div className="pt-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Required For This Step:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentStepData.requirements.map((req, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-neutral-800"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900" />
                      <span>{req}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Next / Previous and Action CTA */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
              <button
                id="btn-apply-from-step"
                onClick={onStartAdmission}
                className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>Start Online Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <button
                  disabled={activeStepTab === 1}
                  onClick={() => setActiveStepTab((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 border border-slate-200 rounded text-neutral-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Previous Step
                </button>
                <button
                  disabled={activeStepTab === 11}
                  onClick={() => setActiveStepTab((prev) => Math.min(11, prev + 1))}
                  className="px-3 py-1.5 border border-slate-200 rounded text-neutral-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Breakdown Table / Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-neutral-900">
                Official Document Requirements
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500">
                All applicants must prepare certified copies in compliance with registrar validation standards.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-neutral-900" />
              <span>Encrypted File Uploads (PDF / JPG up to 5MB)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requirementsList.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-[10px] font-bold text-neutral-400">
                      REQ-0{index + 1}
                    </span>
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded font-bold text-[10px] tracking-wider uppercase">
                      {item.type}
                    </span>
                  </div>

                  <h4 className="font-bold text-neutral-900 text-sm">
                    {item.name}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400 font-medium">
                    Format: {item.format}
                  </span>
                  <span className="font-bold text-neutral-900 uppercase">
                    Mandatory
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Notice Card: Digital Submission vs Hard Copies */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded bg-neutral-900 text-white flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  DIGITAL SUBMISSION (PORTAL)
                </h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  Submit personal, academic data and upload digital copies of transcripts, IDs, and certificates directly into the E-ENROLL applicant portal.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded bg-neutral-900 text-white flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  HARD COPIES (REGISTRAR OFFICE)
                </h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  For requirements that must be submitted as hard copies (e.g. sealed high school transcript and original PSA birth certificates), submit them to the designated registrar window.
                </p>
              </div>
            </div>
          </div>

          {/* Dedicated Panel Cross-Links */}
          {onNavigateTab && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
                  <span>Ready to Begin or Have Questions?</span>
                </div>
                <h4 className="text-lg font-bold text-neutral-900">
                  Take the Next Step in Your Enrollment
                </h4>
                <p className="text-xs text-neutral-500">
                  Launch the enrollment wizard or reach out to our admissions registrar team for guidance.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigateTab('services')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Explore Services
                </button>
                <button
                  onClick={() => onNavigateTab('contact')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Contact Registrar
                </button>
                <button
                  onClick={onStartAdmission}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
                >
                  <span>Start Admission Process</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
