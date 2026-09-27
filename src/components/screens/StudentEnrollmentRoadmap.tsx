import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  CheckCircle2,
  UploadCloud,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Check,
  AlertCircle,
  Clock,
  ExternalLink,
  Download,
  FileCheck2,
  Mail,
  MessageSquare,
  AlertTriangle,
  FileWarning,
  RefreshCw,
  QrCode,
  Info,
  Calendar,
  Lock,
} from 'lucide-react';
import {
  EnrollmentRoadmapStatus,
  EnrollmentRoadmapStep,
  Student,
} from '../../types';
import {
  fetchStudentEnrollmentStatus,
  updateStudentEnrollment,
  AffidavitPayload,
} from '../../api/enrollmentApi';
import { AffidavitOfUndertakingModal } from '../modals/AffidavitOfUndertakingModal';

interface StudentEnrollmentRoadmapProps {
  activeStudent?: Partial<Student>;
  onLogOut?: () => void;
}

export const StudentEnrollmentRoadmap: React.FC<StudentEnrollmentRoadmapProps> = ({
  activeStudent,
  onLogOut,
}) => {
  const [roadmap, setRoadmap] = useState<EnrollmentRoadmapStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(5); // 1-indexed

  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [sf9FileName, setSf9FileName] = useState<string>('');
  const [psaFileName, setPsaFileName] = useState<string>('PSA_Birth_Certificate.pdf');
  const [isAffidavitModalOpen, setIsAffidavitModalOpen] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sf9InputRef = useRef<HTMLInputElement>(null);
  const psaInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeIdentifier =
    activeStudent?.lrn ||
    activeStudent?.studentId ||
    activeStudent?.email ||
    '109283746512';

  // Fetch live enrollment status from GET /api/student/enrollment-status
  useEffect(() => {
    let isMounted = true;
    const loadStatus = async () => {
      setLoading(true);
      try {
        const res = await fetchStudentEnrollmentStatus({
          lrn: activeStudent?.lrn,
          tempId: activeStudent?.studentId?.startsWith('TEMP') ? activeStudent.studentId : undefined,
          email: activeStudent?.email,
        });

        if (isMounted && res.success && res.roadmap) {
          setRoadmap(res.roadmap);
          setActiveStepIndex(res.roadmap.currentStep || 5);
        }
      } catch (err) {
        console.error('Failed to fetch enrollment roadmap:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadStatus();
    return () => {
      isMounted = false;
    };
  }, [activeIdentifier, activeStudent]);

  // Upload missing SF9 document via PUT /api/student/enrollment-update
  const handleSf9Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      try {
        const updateRes = await updateStudentEnrollment({
          lrn: roadmap?.lrn,
          tempId: roadmap?.tempReferenceId,
          applicationId: roadmap?.applicationId,
          documentUpload: {
            type: 'SF9_REPORT_CARD',
            fileName: file.name,
            fileSize: file.size,
          },
        });

        setSf9FileName(file.name);
        if (updateRes.updatedRoadmap) {
          setRoadmap(updateRes.updatedRoadmap);
          setActiveStepIndex(updateRes.updatedRoadmap.currentStep);
        }
        showToast(`Document ${file.name} successfully submitted for Registrar review!`);
      } catch {
        alert('Failed to upload document. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Upload missing PSA Birth Certificate
  const handlePsaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      try {
        const updateRes = await updateStudentEnrollment({
          lrn: roadmap?.lrn,
          tempId: roadmap?.tempReferenceId,
          applicationId: roadmap?.applicationId,
          documentUpload: {
            type: 'PSA_BIRTH_CERTIFICATE',
            fileName: file.name,
            fileSize: file.size,
          },
        });

        setPsaFileName(file.name);
        if (updateRes.updatedRoadmap) {
          setRoadmap(updateRes.updatedRoadmap);
          setActiveStepIndex(updateRes.updatedRoadmap.currentStep);
        }
        showToast(`PSA Birth Certificate ${file.name} uploaded successfully!`);
      } catch {
        alert('Failed to upload file.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Download provisional enrollment slip per DO 03, s. 2018
  const handleDownloadProvisionalSlip = () => {
    const content = `DEPARTMENT OF EDUCATION (DepEd)
PROVISIONAL ENROLLMENT SLIP
Issued pursuant to DepEd Order No. 03, s. 2018

Application Number: ${roadmap?.applicationId || 'APP-2026-004912'}
Learner Name: ${activeStudent?.name || 'Johnny Tabulo'}
Identifier: ${roadmap?.lrn || roadmap?.tempReferenceId || '109283746512'}
Grade Level: ${activeStudent?.gradeLevel || 'Grade 11'}
Track / Strand: ${activeStudent?.trackStrand || 'STEM'}
Status: TEMPORARILY ENROLLED (DO 03, s. 2018)
Mandatory Credential Submission Deadline: October 31, 2026

Missing Documents Under Undertaking:
${(roadmap?.missingDocuments || ['SF9 Report Card']).map((d) => `- ${d}`).join('\n')}

Issued by: Office of the School Registrar
E-ENROLL Academy (DepEd School ID: 300481)
Verification Barcode: DEPED-PROV-2026-${Date.now().toString(36).toUpperCase()}
Timestamp: ${new Date().toLocaleString()}
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DEPED_Provisional_Enrollment_Slip_${roadmap?.applicationId || 'APP'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Provisional Enrollment Slip downloaded successfully.');
  };

  const isTemporarilyEnrolled =
    roadmap?.status === 'TEMPORARILY_ENROLLED' ||
    (roadmap?.missingDocuments && roadmap.missingDocuments.length > 0 && !sf9FileName);

  const learnerDisplayName = activeStudent?.name || 'Johnny Tabulo';
  const displayGrade = activeStudent?.gradeLevel || 'Grade 11';
  const displaySection = activeStudent?.section || 'STEM - Newton';
  const displayIdentifier =
    roadmap?.lrn ||
    roadmap?.tempReferenceId ||
    activeStudent?.lrn ||
    activeStudent?.studentId ||
    '109283746512';
  const isTempId = displayIdentifier.startsWith('TEMP');

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
                Live Roadmap
              </span>
            </div>
            <p className="text-xs text-emerald-800 mt-0.5">
              SMS verification code and parent portal login confirmation have been transmitted. You are securely logged in.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowVerificationModal(true)}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shrink-0 shadow-2xs"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>View SMS & Email Receipt</span>
        </button>
      </div>

      {/* Welcome Card with Live Status */}
      <div
        id="applicant-welcome-card"
        className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Welcome, {learnerDisplayName}!
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-neutral-900 text-white uppercase">
              {displayGrade} • {activeStudent?.trackStrand || 'Academic'}
            </span>
            {isTempId ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                Temporary Reference ID
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-900 border border-blue-300 uppercase">
                DepEd 12-Digit LRN Verified
              </span>
            )}
          </div>
          <p className="text-neutral-500 text-sm mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              {isTempId ? 'Tracking ID' : 'Learner Reference No.'}:{' '}
              <strong className="font-mono text-neutral-800">{displayIdentifier}</strong>
            </span>
            <span>•</span>
            <span>
              App Ref: <strong className="font-mono text-neutral-800">{roadmap?.applicationId || 'APP-2026-004912'}</strong>
            </span>
            <span>•</span>
            <span>
              Parent: <strong className="text-neutral-800">{activeStudent?.parentGuardian || 'Roberto Tabulo'}</strong>
            </span>
          </p>
        </div>

        <div className="text-right flex flex-col md:items-end">
          <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
            ENROLLMENT STATUS (SY 2026-2027)
          </span>
          <div className="mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold tracking-wider uppercase shadow-2xs">
            {isTemporarilyEnrolled ? (
              <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>TEMPORARILY ENROLLED (DO 03, s. 2018)</span>
              </span>
            ) : (
              <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>STEP {activeStepIndex}: ADMISSION VERIFIED</span>
              </span>
            )}
          </div>
          {isTemporarilyEnrolled && (
            <span className="text-[11px] text-amber-700 font-semibold mt-1">
              Mandatory deadline: October 31, 2026
            </span>
          )}
        </div>
      </div>

      {/* 11-Step Basic Education Enrollment Roadmap Stepper Card */}
      <div id="enrollment-progress-card" className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold tracking-wider text-neutral-500 uppercase">
              DEPED K-12 BASIC EDUCATION ENROLLMENT ROADMAP
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              11 official milestones from intake to DepEd LIS beginning-of-school-year (BOSY) registration.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-800 bg-slate-100 px-2.5 py-1 rounded-md">
              Progress: {Math.round(((roadmap?.currentStep || activeStepIndex) / 11) * 100)}% Complete
            </span>
          </div>
        </div>

        {/* 11 Segmented Step Buttons with Interactive Selection */}
        <div className="grid grid-cols-11 gap-1.5 sm:gap-2 pt-2">
          {Array.from({ length: 11 }).map((_, idx) => {
            const stepNumber = idx + 1;
            const currentMilestone = roadmap?.currentStep || 5;
            const isCompleted = stepNumber < currentMilestone;
            const isCurrent = stepNumber === currentMilestone;
            const isSelected = stepNumber === activeStepIndex;

            return (
              <button
                key={idx}
                id={`progress-step-${stepNumber}`}
                onClick={() => setActiveStepIndex(stepNumber)}
                title={`Step ${stepNumber}: ${roadmap?.steps?.[idx]?.title || `Milestone ${stepNumber}`}`}
                className={`relative group h-9 rounded-lg flex items-center justify-center transition-all duration-200 font-mono text-xs font-bold ${
                  isSelected
                    ? 'ring-2 ring-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                    : isCurrent
                    ? 'bg-amber-500 text-white ring-2 ring-amber-400 animate-pulse'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNumber}
              </button>
            );
          })}
        </div>

        {/* Step details strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900">
              Active Focus: Step {activeStepIndex}
            </span>
            <span>—</span>
            <span className="font-semibold text-neutral-700">
              {roadmap?.steps?.[activeStepIndex - 1]?.title || `Phase ${activeStepIndex}`}
            </span>
            <span className="text-neutral-400">
              ({roadmap?.steps?.[activeStepIndex - 1]?.subtitle || 'DepEd Requirement'})
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800 inline-block" />
              <span>Completed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Current Task</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" />
              <span>Upcoming</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Roadmap Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Active Task & Document Upload Hub */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Task: Step 5 Credentials Upload / Temporary Enrollment */}
          <div id="active-task-card" className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                  ROADMAP MILESTONE 5 OF 11
                </span>
                <h3 className="text-lg font-bold text-neutral-900 mt-0.5">
                  Academic Credentials & DepEd Form 138 (SF9)
                </h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Per DepEd Order No. 03, s. 2018, please provide digital copies of your previous school records and PSA birth certificate. If physical records are still pending from your origin school, you may execute an Affidavit of Undertaking.
                </p>
              </div>

              {isTemporarilyEnrolled && (
                <button
                  onClick={handleDownloadProvisionalSlip}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Provisional Slip</span>
                </button>
              )}
            </div>

            {/* Document Item 1: SF9 Form 138 */}
            <div className="border border-slate-200 rounded-xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors bg-white">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                  sf9FileName ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {sf9FileName ? <Check className="w-5 h-5 stroke-[2.5]" /> : <FileWarning className="w-5 h-5 text-amber-700" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-neutral-900">
                      DepEd Form 138 / SF9 (Progress Report Card)
                    </h4>
                    {sf9FileName ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Uploaded
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Action Required
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {sf9FileName
                      ? `${sf9FileName} • Ready for Registrar audit`
                      : 'Final Grade 10/Previous SY report card with General Average and Learner Reference Number.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <input
                  ref={sf9InputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleSf9Upload}
                />
                <button
                  onClick={() => sf9InputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-neutral-800 hover:bg-slate-50 uppercase tracking-wider transition-colors shadow-2xs"
                >
                  {isUploading ? 'Uploading...' : sf9FileName ? 'Replace File' : 'Upload SF9 (PDF/JPG)'}
                </button>
              </div>
            </div>

            {/* Document Item 2: PSA Birth Certificate */}
            <div className="border border-slate-200 rounded-xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors bg-white">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-neutral-900">
                      PSA Birth Certificate / Recent Photo Scan
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {psaFileName} • Recorded in DepEd Registry
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <input
                  ref={psaInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handlePsaUpload}
                />
                <button
                  onClick={() => psaInputRef.current?.click()}
                  className="text-xs font-bold text-neutral-500 hover:text-neutral-900 uppercase tracking-wider px-2 py-1"
                >
                  Replace
                </button>
              </div>
            </div>

            {/* If missing SF9, offer DO 03, s. 2018 Affidavit of Undertaking Option */}
            {!sf9FileName && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Delayed Form 138 from Origin School?
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Under DepEd Order No. 03, s. 2018, parents can execute an electronic <strong>Affidavit of Undertaking</strong> to secure temporary enrollment with a deadline of October 31, 2026.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAffidavitModalOpen(true)}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-2xs"
                >
                  Sign Affidavit (AOU)
                </button>
              </div>
            )}
          </div>

          {/* Transferee SF10 Electronic Tracking Card (DO 54, s. 2016) */}
          {roadmap?.sf10Tracking && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <RefreshCw className="w-4 h-4 text-neutral-700" />
                  <h3 className="text-sm font-bold text-neutral-900">
                    DepEd SF10 Electronic Request Tracker (DO 54, s. 2016)
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 uppercase">
                  LIS System Dispatched
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    ORIGIN SCHOOL
                  </span>
                  <p className="text-xs font-bold text-neutral-900 mt-0.5 truncate">
                    {roadmap.sf10Tracking.originSchoolName}
                  </p>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    School ID: {roadmap.sf10Tracking.originSchoolId}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    TRACKING BARCODE
                  </span>
                  <p className="text-xs font-mono font-bold text-neutral-900 mt-0.5">
                    {roadmap.sf10Tracking.trackingCode}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    Encrypted SF10 Dispatch
                  </span>
                </div>

                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    TRANSFER STATUS
                  </span>
                  <p className="text-xs font-bold text-neutral-900 mt-0.5">
                    Dispatched to Registrar
                  </p>
                  <span className="text-[10px] text-neutral-500">
                    Auto-attaches upon release
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* New Student Age-Eligibility Card (DO 20, s. 2018) */}
          {roadmap?.ageEligibility && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-700" />
                  <span>DepEd Kindergarten / Grade 1 Age Evaluation (DO 20, s. 2018)</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                  {roadmap.ageEligibility.policyStatus}
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {roadmap.ageEligibility.policyNotice}
              </p>
            </div>
          )}
        </div>

        {/* Right 1 Col: Complete 11-Step Roadmap List & Account Overview */}
        <div className="space-y-6">
          {/* Account Profile Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 pb-2 border-b border-slate-100">
              Registered Portal Account
            </h3>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-neutral-400 block text-[11px] font-semibold uppercase">Parent / Guardian</span>
                <span className="font-bold text-neutral-900">{activeStudent?.parentGuardian || 'Roberto Tabulo'}</span>
              </div>

              <div>
                <span className="text-neutral-400 block text-[11px] font-semibold uppercase">Contact Email</span>
                <span className="font-mono text-neutral-800">{activeStudent?.email || 'parent@e-enroll.edu'}</span>
              </div>

              <div>
                <span className="text-neutral-400 block text-[11px] font-semibold uppercase">Mobile Notification Number</span>
                <span className="font-mono text-neutral-800">+63 917 555 0199</span>
              </div>

              <div>
                <span className="text-neutral-400 block text-[11px] font-semibold uppercase">Linked Learner ID</span>
                <span className="font-mono font-bold text-neutral-900 bg-slate-100 px-2 py-0.5 rounded">
                  {displayIdentifier}
                </span>
              </div>
            </div>

            {onLogOut && (
              <button
                onClick={onLogOut}
                className="w-full mt-2 py-2 border border-slate-300 hover:bg-slate-50 text-neutral-800 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Log Out of Portal
              </button>
            )}
          </div>

          {/* 11 Steps Roadmap Summary List */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 pb-2 border-b border-slate-100">
              11-Step Milestones Tracker
            </h3>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {(roadmap?.steps || []).map((step) => {
                const isPassed = step.stepNumber < (roadmap?.currentStep || 5);
                const isCurrent = step.stepNumber === (roadmap?.currentStep || 5);

                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => setActiveStepIndex(step.stepNumber)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      step.stepNumber === activeStepIndex
                        ? 'border-neutral-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isPassed
                            ? 'bg-neutral-900 text-white'
                            : isCurrent
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {isPassed ? <Check className="w-3 h-3" /> : step.stepNumber}
                        </span>
                        <span className="font-bold text-neutral-900 truncate">
                          {step.title}
                        </span>
                      </div>

                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        isPassed ? 'bg-neutral-100 text-neutral-700' : isCurrent ? 'bg-amber-100 text-amber-800' : 'text-slate-400'
                      }`}>
                        {isPassed ? 'Done' : isCurrent ? 'Active' : 'Queued'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Affidavit of Undertaking Modal */}
      <AffidavitOfUndertakingModal
        isOpen={isAffidavitModalOpen}
        onClose={() => setIsAffidavitModalOpen(false)}
        studentName={learnerDisplayName}
        parentName={activeStudent?.parentGuardian || 'Roberto Tabulo'}
        missingDocs={roadmap?.missingDocuments || ['SF9 Report Card']}
        onSignedComplete={async (payload: AffidavitPayload) => {
          setIsAffidavitModalOpen(false);
          const res = await updateStudentEnrollment({
            lrn: roadmap?.lrn,
            tempId: roadmap?.tempReferenceId,
            applicationId: roadmap?.applicationId,
            affidavit: payload,
          });
          if (res.updatedRoadmap) {
            setRoadmap(res.updatedRoadmap);
          }
          showToast('Affidavit of Undertaking recorded! Temporary enrollment confirmed until Oct 31, 2026.');
        }}
      />

      {/* Verification Dispatch Modal Preview (Simulated SMS & Email) */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-neutral-900">
                  Verification Transmission Logs
                </h3>
              </div>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="text-neutral-400 hover:text-neutral-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Simulated SMS Card */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-neutral-700" />
                  <span>SMS Dispatch to +63 917 555 0199</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                  Delivered
                </span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs text-neutral-800 font-mono leading-relaxed">
                [DepEd E-ENROLL]: Your K-12 Student Portal Account has been created for {learnerDisplayName} ({displayIdentifier}). Application Ref: {roadmap?.applicationId || 'APP-2026-004912'}. Security OTP: <strong>582914</strong>. Track your 11-step roadmap anytime.
              </div>
            </div>

            {/* Simulated Email Card */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Email Dispatch to {activeStudent?.email || 'parent@e-enroll.edu'}</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                  Sent
                </span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs text-neutral-800 leading-relaxed">
                <strong>Subject:</strong> DepEd Basic Education Enrollment Confirmation - SY 2026-2027<br />
                <strong>Dear Parent/Guardian,</strong><br />
                Your application for <strong>{learnerDisplayName}</strong> has been received under <em>{roadmap?.status || 'SUBMITTED'}</em>. You may log in to review your roadmap milestones and submit missing documents.
              </div>
            </div>

            <button
              onClick={() => setShowVerificationModal(false)}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Close Verification Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
