import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Upload,
  ShieldCheck,
  GraduationCap,
  Search,
  AlertTriangle,
  FileWarning,
  Info,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Users,
  Check,
  FileCheck2,
  Sparkles,
  Smartphone,
  Mail,
  UserPlus,
  Clock,
  Edit3,
  Calendar,
  AlertCircle,
  HelpCircle,
  BadgeCheck,
} from 'lucide-react';
import { Student } from '../../types';
import {
  evaluateKindergartenEligibility,
  evaluateGrade1Eligibility,
  validateLRN,
  validateSchoolId,
  validate4PsHouseholdId,
  DEPED_RECOGNIZED_IP_GROUPS,
  DEPED_LSEN_MANIFESTATIONS,
  DEPED_MOTHER_TONGUES,
  SHS_TRACKS_AND_STRANDS,
  SchoolOpeningMonth,
} from '../../utils/depedValidation';
import {
  formatPhilippineMobile,
  isValidPhilippineMobile,
  formatDateOfBirthMask,
  isValidDateOfBirth,
  formatLRNMask,
  cleanLRN,
  format4PsMask,
  formatSchoolIdMask,
} from '../../utils/inputMasking';
import {
  queryLearnerByLRN,
  registerAdmissionAccount,
  AffidavitPayload,
} from '../../api/enrollmentApi';
import { AffidavitOfUndertakingModal } from '../modals/AffidavitOfUndertakingModal';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnrollmentComplete: (newStudent: Partial<Student>, authAccount?: any) => void;
  initialPathway?: 'new_student' | 'transferee';
}

export const AdmissionModal: React.FC<AdmissionModalProps> = ({
  isOpen,
  onClose,
  onEnrollmentComplete,
  initialPathway = 'new_student',
}) => {
  // Wizard Steps:
  // 1 = Admission Pathway & Gatekeeper (New Student Age Check or Transferee LRN / Previous School)
  // 2 = DepEd Enhanced BEEF Intake
  // 3 = Credentials, Documents & Affidavit
  // 4 = Integrated Parent/Guardian Account Creation
  // 5 = Comprehensive Review & Edit Screen (with single-click edit shortcuts)
  // 6 = Post-Submission Hand-off & Verification Receipt
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5; // Steps 1 to 5, step 6 is final receipt
  const [cameFromReview, setCameFromReview] = useState(false);

  // --- STAGE 1: GATEWAY & PATHWAY SELECTION ---
  const [pathway, setPathway] = useState<'new_student' | 'transferee'>(initialPathway);
  const [tempReferenceId, setTempReferenceId] = useState<string>('');
  const [rawLrn, setRawLrn] = useState('');
  const [lrnQueryError, setLrnQueryError] = useState<string | null>(null);
  const [lrnAutoFilled, setLrnAutoFilled] = useState<boolean>(false);
  const [openingMonth, setOpeningMonth] = useState<SchoolOpeningMonth>('August');

  // Transferee previous school details (triggers SF10 electronic tracking)
  const [prevSchoolName, setPrevSchoolName] = useState('');
  const [prevSchoolId, setPrevSchoolId] = useState('');
  const [lastSYCompleted, setLastSYCompleted] = useState('2025-2026');

  // --- STAGE 2: DEMOGRAPHIC & BEEF CLUSTERS ---
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [extensionName, setExtensionName] = useState('');
  const [sex, setSex] = useState<'Male' | 'Female'>('Male');
  const [birthDate, setBirthDate] = useState('2021-04-12'); // Defaults to age-eligible Kindergarten
  const [dobError, setDobError] = useState<string | null>(null);
  const [motherTongue, setMotherTongue] = useState('Tagalog');

  // Socio-demographics
  const [is4Ps, setIs4Ps] = useState(false);
  const [fourPsId, setFourPsId] = useState('');
  const [isIP, setIsIP] = useState(false);
  const [ipGroup, setIpGroup] = useState<string>(DEPED_RECOGNIZED_IP_GROUPS[0]);

  // LSEN Cluster
  const [isLSEN, setIsLSEN] = useState(false);
  const [selectedManifestations, setSelectedManifestations] = useState<string[]>([]);

  // Key Stage & Grade Selection
  const [gradeLevel, setGradeLevel] = useState('Kindergarten');
  const [shsTrack, setShsTrack] = useState<keyof typeof SHS_TRACKS_AND_STRANDS>('Academic');
  const [shsStrand, setShsStrand] = useState('STEM');

  // Contact & Address
  const [currentAddress, setCurrentAddress] = useState('Metro Manila, Philippines');
  const [contactNumber, setContactNumber] = useState('+63 917-555-0100');

  // --- STAGE 3: CREDENTIALS, DOCUMENTS & AFFIDAVIT ---
  const [hasPSABirthCert, setHasPSABirthCert] = useState(true);
  const [hasSF9ReportCard, setHasSF9ReportCard] = useState(true);
  const [psaFileName, setPsaFileName] = useState('');
  const [sf9FileName, setSf9FileName] = useState('');
  const [isAffidavitModalOpen, setIsAffidavitModalOpen] = useState(false);
  const [affidavitPayload, setAffidavitPayload] = useState<AffidavitPayload | null>(null);

  // --- STAGE 4: INTEGRATED ACCOUNT CREATION (PARENT / GUARDIAN) ---
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentMobile, setParentMobile] = useState('');
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [accountPassword, setAccountPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [privacyConsentAgreed, setPrivacyConsentAgreed] = useState(false);

  // --- STAGE 6: POST-SUBMISSION STATE ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Initialize pathway and temporary reference ID
  useEffect(() => {
    if (initialPathway) {
      setPathway(initialPathway);
      if (initialPathway === 'new_student') {
        setGradeLevel('Kindergarten');
        setBirthDate('2021-04-12');
      } else {
        setGradeLevel('Grade 11');
        setBirthDate('2009-08-14');
      }
    }
  }, [initialPathway]);

  useEffect(() => {
    if (!tempReferenceId) {
      setTempReferenceId(`TEMP-2026-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, []);

  if (!isOpen) return null;

  // LRN Lookup handler for Transferee pathway
  const cleanLrnValue = cleanLRN(rawLrn);
  const handleQueryLRN = async () => {
    setLrnQueryError(null);
    const res = await queryLearnerByLRN(cleanLrnValue);
    if (!res.success) {
      setLrnQueryError(res.message || 'Invalid LRN format');
      return;
    }
    if (res.found && res.data) {
      const d = res.data;
      if (d.firstName) setFirstName(d.firstName);
      if (d.middleName) setMiddleName(d.middleName);
      if (d.lastName) setLastName(d.lastName);
      if (d.extensionName) setExtensionName(d.extensionName);
      if (d.sex) setSex(d.sex);
      if (d.birthDate) setBirthDate(d.birthDate);
      if (d.motherTongue) setMotherTongue(d.motherTongue);
      if (d.is4Ps !== undefined) setIs4Ps(d.is4Ps);
      if (d.fourPsHouseholdId) setFourPsId(format4PsMask(d.fourPsHouseholdId));
      if (d.isIP !== undefined) setIsIP(d.isIP);
      if (d.ipGroupName) setIpGroup(d.ipGroupName);
      if (d.currentAddress) setCurrentAddress(d.currentAddress);
      if (d.contactNumber) setContactNumber(formatPhilippineMobile(d.contactNumber));
      if (d.email) setParentEmail(d.email);
      if (d.parentGuardianName) setParentName(d.parentGuardianName);
      if (d.parentGuardianContact) setParentMobile(formatPhilippineMobile(d.parentGuardianContact));
      if (d.previousSchoolName) setPrevSchoolName(d.previousSchoolName);
      if (d.previousSchoolId) setPrevSchoolId(d.previousSchoolId);
      if (d.lastSYCompleted) setLastSYCompleted(d.lastSYCompleted);
      if (d.gradeLevel) setGradeLevel(d.gradeLevel);
      setLrnAutoFilled(true);
    } else {
      setLrnAutoFilled(false);
      setLrnQueryError('LRN valid. No prior registry entry found; proceed with manual entry.');
    }
  };

  // Age Evaluation for Kindergarten & Grade 1
  const isKinder = gradeLevel === 'Kindergarten';
  const isGrade1 = gradeLevel === 'Grade 1';
  const kinderEvaluation = isKinder
    ? evaluateKindergartenEligibility(birthDate, openingMonth, 2026)
    : isGrade1
    ? evaluateGrade1Eligibility(birthDate, openingMonth, 2026)
    : null;

  const toggleManifestation = (item: string) => {
    setSelectedManifestations((prev) =>
      prev.includes(item) ? prev.filter((m) => m !== item) : [...prev, item]
    );
  };

  // Step 1 Validation
  const handleValidateStep1 = () => {
    if (pathway === 'transferee') {
      const lrnValidation = validateLRN(cleanLrnValue);
      if (!lrnValidation.isValid) {
        alert(lrnValidation.message);
        return false;
      }
      if (prevSchoolId && !validateSchoolId(prevSchoolId)) {
        alert('Previous DepEd School ID must be exactly 6 numeric digits (e.g. 300481).');
        return false;
      }
    } else {
      // New student age check
      if (kinderEvaluation && kinderEvaluation.status === 'UNDERAGE_INELIGIBLE') {
        alert(
          `Under DepEd Order No. 20, s. 2018, this learner is underage for ${gradeLevel}: ${kinderEvaluation.policyNotice}`
        );
        return false;
      }
    }
    return true;
  };

  // Step 2 Validation
  const handleValidateStep2 = () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('Learner First Name and Last Name are required per DepEd BEEF.');
      return false;
    }
    const dobCheck = isValidDateOfBirth(birthDate);
    if (!dobCheck.isValid) {
      alert(dobCheck.message);
      return false;
    }
    if (is4Ps && fourPsId && !validate4PsHouseholdId(fourPsId)) {
      alert('DepEd requires a valid 12-to-14 character 4Ps Household ID (e.g. HH-1082-940185).');
      return false;
    }
    return true;
  };

  // Step 3 Validation
  const handleValidateStep3 = () => {
    const isMissing = !hasPSABirthCert || !hasSF9ReportCard;
    if (isMissing && !affidavitPayload) {
      setIsAffidavitModalOpen(true);
      return false;
    }
    return true;
  };

  // Step 4 Validation (Account Creation)
  const handleValidateStep4 = () => {
    if (!parentName.trim()) {
      alert('Parent/Guardian Full Name is required to create the Student Portal account.');
      return false;
    }
    if (!parentEmail.trim() || !parentEmail.includes('@')) {
      alert('A valid Parent/Guardian Email address is required for portal login and notices.');
      return false;
    }
    if (!parentMobile.trim() || !isValidPhilippineMobile(parentMobile)) {
      alert('A valid Philippine Mobile Number (+63 9XX-XXX-XXXX) is required for official SMS alerts.');
      return false;
    }
    if (!accountPassword || accountPassword.length < 6) {
      alert('Please create an account password with at least 6 characters.');
      return false;
    }
    if (!privacyConsentAgreed) {
      alert('Mandatory explicit Data Privacy Consent under Republic Act No. 10173 is required.');
      return false;
    }
    return true;
  };

  // Jump to specific step from Review Screen
  const handleJumpToStep = (stepNumber: number) => {
    setCameFromReview(true);
    setCurrentStep(stepNumber);
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!handleValidateStep1()) return;
    } else if (currentStep === 2) {
      if (!handleValidateStep2()) return;
    } else if (currentStep === 3) {
      if (!handleValidateStep3()) return;
    } else if (currentStep === 4) {
      if (!handleValidateStep4()) return;
    }

    if (cameFromReview) {
      setCurrentStep(5); // Return to review screen directly
      setCameFromReview(false);
    } else {
      setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Final Submission to POST /api/admission/register
  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!handleValidateStep4()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        pathway,
        parentEmail,
        parentMobile,
        password: accountPassword,
        parentName,
        lrn: pathway === 'transferee' ? cleanLrnValue : undefined,
        tempReferenceId: pathway === 'new_student' ? tempReferenceId : undefined,
        firstName,
        middleName,
        lastName,
        extensionName,
        sex,
        birthDate,
        motherTongue,
        gradeLevel,
        keyStage: (gradeLevel.includes('Grade 11') || gradeLevel.includes('Grade 12')
          ? 'Senior High'
          : gradeLevel.includes('Grade 7') || gradeLevel.includes('Grade 8') || gradeLevel.includes('Grade 9') || gradeLevel.includes('Grade 10')
          ? 'Junior High'
          : gradeLevel === 'Kindergarten'
          ? 'Kindergarten'
          : 'Elementary') as any,
        shsTrack: gradeLevel.includes('Grade 11') || gradeLevel.includes('Grade 12') ? (shsTrack as string) : undefined,
        trackStrand: gradeLevel.includes('Grade 11') || gradeLevel.includes('Grade 12') ? shsStrand : undefined,
        previousSchoolName: pathway === 'transferee' ? prevSchoolName : undefined,
        previousSchoolId: pathway === 'transferee' ? prevSchoolId : undefined,
        lastSYCompleted: pathway === 'transferee' ? lastSYCompleted : undefined,
        is4Ps,
        fourPsHouseholdId: is4Ps ? fourPsId : undefined,
        isIP,
        ipGroupName: isIP ? ipGroup : undefined,
        isLSEN,
        lsenManifestations: isLSEN ? selectedManifestations : [],
        currentAddress: currentAddress || 'Metro Manila, Philippines',
        contactNumber: parentMobile || contactNumber,
        hasPSABirthCert,
        hasSF9ReportCard,
        documentsAttached: [
          ...(hasPSABirthCert ? [{ type: 'PSA_BIRTH_CERTIFICATE', fileName: psaFileName || 'PSA_Birth_Cert.pdf', fileSize: 1048576 }] : []),
          ...(hasSF9ReportCard ? [{ type: 'SF9_REPORT_CARD', fileName: sf9FileName || 'SF9_Form138.pdf', fileSize: 1572864 }] : []),
        ],
        affidavitSigned: Boolean(affidavitPayload),
        affidavitData: affidavitPayload || undefined,
        privacyConsentAgreed,
      };

      const result = await registerAdmissionAccount(payload);
      setSubmissionResult(result);

      if (result.success) {
        setCurrentStep(6); // Step 6: Post-Submission Receipt & Direct Roadmap Hand-Off
      } else {
        alert(result.message || 'Submission failed. Please check form details.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Immediate direct hand-off into Student Portal Roadmap
  const handleProceedToRoadmap = () => {
    if (!submissionResult) return;
    const studentData: Partial<Student> = {
      id: submissionResult.learner?.id || `s_${Date.now()}`,
      name: `${firstName} ${lastName}`.trim(),
      email: parentEmail,
      studentId: pathway === 'transferee' ? cleanLrnValue : tempReferenceId,
      lrn: pathway === 'transferee' ? cleanLrnValue : undefined,
      gradeLevel,
      trackStrand: shsStrand || 'Academic',
      section: 'Section 1 (Assigned)',
      parentGuardian: `${parentName} (${parentMobile})`,
      program: `${gradeLevel} - ${shsStrand || 'K-12 Basic Education'}`,
      department: gradeLevel.includes('Grade 11') || gradeLevel.includes('Grade 12')
        ? 'Senior High School'
        : gradeLevel.includes('Grade 7') || gradeLevel.includes('Grade 8') || gradeLevel.includes('Grade 9') || gradeLevel.includes('Grade 10')
        ? 'Junior High School'
        : gradeLevel === 'Kindergarten'
        ? 'Kindergarten'
        : 'Elementary',
      currentStep: submissionResult.roadmap?.currentStep || 5,
      totalSteps: 11,
      status: submissionResult.roadmap?.status === 'TEMPORARILY_ENROLLED' ? 'PENDING' : 'ENROLLED',
      enrollmentDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    onEnrollmentComplete(studentData, submissionResult.user);
    onClose();
  };

  const boundIdentifierDisplay = pathway === 'transferee' ? (cleanLrnValue ? formatLRNMask(cleanLrnValue) : '12-Digit LRN') : tempReferenceId;

  return (
    <>
      <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl relative my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm tracking-wider text-neutral-900">
                    PUBLIC ADMISSION & PORTAL ACCOUNT SETUP
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-neutral-700 border border-slate-200">
                    DepEd DO 03, s. 2018
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Step {currentStep} of {totalSteps}: {
                    currentStep === 1 ? 'Admission Pathway & Identification' :
                    currentStep === 2 ? 'DepEd BEEF Intake & Profile' :
                    currentStep === 3 ? 'Credentials & SF9 Report Card' :
                    currentStep === 4 ? 'Parent / Guardian Account Setup' :
                    'Review & Verify Application Summary'
                  }
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Header (Steps 1 to 5) */}
          {currentStep <= 5 && (
            <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pr-2">
                {[
                  { step: 1, label: '1. Pathway' },
                  { step: 2, label: '2. BEEF' },
                  { step: 3, label: '3. Credentials' },
                  { step: 4, label: '4. Account' },
                  { step: 5, label: '5. Review & Edit' },
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => {
                      // Allow jumping backward or directly to review if already reached
                      if (s.step <= currentStep || currentStep === 5) {
                        setCurrentStep(s.step);
                      }
                    }}
                    className={`flex items-center gap-1.5 text-[11px] font-bold transition-colors ${
                      currentStep === s.step
                        ? 'text-neutral-900'
                        : currentStep > s.step
                        ? 'text-emerald-700 hover:text-emerald-900 cursor-pointer'
                        : 'text-neutral-400'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        currentStep === s.step
                          ? 'bg-neutral-900 text-white'
                          : currentStep > s.step
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-neutral-500'
                      }`}
                    >
                      {currentStep > s.step ? '✓' : s.step}
                    </span>
                    <span className="whitespace-nowrap">{s.label}</span>
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-bold text-neutral-400 hidden sm:inline shrink-0">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
          )}

          {/* Return to Review Banner if in Edit Mode */}
          {cameFromReview && currentStep < 5 && (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2 font-medium">
                <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                <span>Editing Section from Review Screen. Make changes and return anytime.</span>
              </div>
              <button
                onClick={() => {
                  setCurrentStep(5);
                  setCameFromReview(false);
                }}
                className="px-3 py-1 bg-amber-900 hover:bg-amber-800 text-white rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors"
              >
                Return to Review →
              </button>
            </div>
          )}

          {/* Form Content Area */}
          <div className="p-6 sm:p-7 overflow-y-auto flex-1 space-y-6 text-xs text-neutral-800">
            {/* ========================================================= */}
            {/* STEP 1: HOMEPAGE ADMISSION GATE (TWO INITIAL PATHWAYS)     */}
            {/* ========================================================= */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                      Select Your Initial Pathway (DepEd DO No. 03, s. 2018)
                    </label>
                    <span className="text-[11px] text-neutral-400">Step 1 of 5</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Pathway 1: New Student */}
                    <button
                      type="button"
                      onClick={() => {
                        setPathway('new_student');
                        setGradeLevel('Kindergarten');
                        setBirthDate('2021-04-12');
                      }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        pathway === 'new_student'
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-neutral-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <strong className="text-xs">New Student (No LRN)</strong>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          pathway === 'new_student' ? 'bg-white/20' : 'bg-slate-100 text-neutral-700'
                        }`}>
                          Kinder / Grade 1
                        </span>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${pathway === 'new_student' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        Triggers Kindergarten/Grade 1 age-eligibility validation logic. Allocates a temporary tracking reference ID.
                      </p>
                    </button>

                    {/* Pathway 2: Transferee */}
                    <button
                      type="button"
                      onClick={() => {
                        setPathway('transferee');
                        setGradeLevel('Grade 11');
                        setBirthDate('2009-08-14');
                      }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        pathway === 'transferee'
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-neutral-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <strong className="text-xs">Transferee / Balik-Aral (With LRN)</strong>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          pathway === 'transferee' ? 'bg-white/20' : 'bg-slate-100 text-neutral-700'
                        }`}>
                          Grades 1-12
                        </span>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${pathway === 'transferee' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        Prompts for 12-digit LRN and previous school details to trigger SF10 electronic tracking per DO 54, s. 2016.
                      </p>
                    </button>
                  </div>
                </div>

                {/* PATHWAY 1 CONFIGURATION: New Student Age-Eligibility Check */}
                {pathway === 'new_student' && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-neutral-800" />
                        <span>Age-Eligibility Validation (DO No. 20, s. 2018 & DO 17, s. 2025)</span>
                      </span>
                      <span className="text-[10px] font-bold text-neutral-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        Temporary Reference ID: <code className="font-mono">{tempReferenceId}</code>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                          Intended Grade Level
                        </label>
                        <select
                          value={gradeLevel}
                          onChange={(e) => setGradeLevel(e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                        >
                          <option value="Kindergarten">Kindergarten (Age 5 Cutoff)</option>
                          <option value="Grade 1">Grade 1 (Age 6 Cutoff)</option>
                        </select>
                        <span className="text-[10px] text-neutral-400 mt-1 block">
                          DO 20 s. 2018 benchmark grade level
                        </span>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                          Date of Birth (YYYY-MM-DD) *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={10}
                            placeholder="YYYY-MM-DD (e.g. 2021-04-12)"
                            value={birthDate}
                            onChange={(e) => {
                              const masked = formatDateOfBirthMask(e.target.value);
                              setBirthDate(masked);
                              const check = isValidDateOfBirth(masked);
                              setDobError(check.isValid ? null : check.message || null);
                            }}
                            className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono bg-white focus:border-neutral-900 outline-none"
                          />
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-1 block">
                          Format: YYYY-MM-DD per PSA Certificate
                        </span>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                          DepEd Opening Month
                        </label>
                        <select
                          value={openingMonth}
                          onChange={(e) => setOpeningMonth(e.target.value as SchoolOpeningMonth)}
                          className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                        >
                          <option value="August">August (DO 17, s. 2025 Standard)</option>
                          <option value="July">July Opening</option>
                          <option value="June">June Opening</option>
                        </select>
                        <span className="text-[10px] text-neutral-400 mt-1 block">
                          Defines October 31 age-cutoff baseline
                        </span>
                      </div>
                    </div>

                    {/* Age Eligibility Evaluation Result Banner */}
                    {kinderEvaluation && (
                      <div className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                        kinderEvaluation.status === 'ELIGIBLE'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : kinderEvaluation.status === 'LIS_CONDITIONAL_TAGGING'
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}>
                        {kinderEvaluation.status === 'ELIGIBLE' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <strong>{kinderEvaluation.status}: </strong>
                          <span>{kinderEvaluation.policyNotice}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* PATHWAY 2 CONFIGURATION: Transferee LRN & Previous School Details */}
                {pathway === 'transferee' && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-neutral-800" />
                        <span>12-Digit LRN & SF10 Origin School Tracking (DO 54, s. 2016)</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Electronic SF10 Request Enabled
                      </span>
                    </div>

                    {/* LRN Input & Query with Dynamic Format Masking */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-neutral-600 block">
                          12-Digit DepEd Learner Reference Number (LRN) *
                        </label>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {cleanLrnValue.length}/12 digits
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={13} // 12 digits + 1 hyphen
                          placeholder="e.g. 108249-000185 or 108249-000214"
                          value={rawLrn}
                          onChange={(e) => {
                            const masked = formatLRNMask(e.target.value);
                            setRawLrn(masked);
                          }}
                          className="flex-1 p-2 border border-slate-300 rounded-lg text-xs font-mono font-bold bg-white focus:border-neutral-900 outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleQueryLRN}
                          disabled={cleanLrnValue.length < 12}
                          className="px-4 py-2 bg-neutral-900 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 flex items-center gap-1.5 uppercase tracking-wider transition-colors"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>Query LIS</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Dynamic format mask: XXXXXX-XXXXXX. Demo registered test accounts: <code>108249-000185</code> (Grade 11 STEM) or <code>108249-000214</code>.
                      </p>
                      {lrnQueryError && (
                        <p className="text-[11px] text-amber-700 mt-1 font-medium">{lrnQueryError}</p>
                      )}
                      {lrnAutoFilled && (
                        <p className="text-[11px] text-emerald-700 mt-1 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>70%+ of learner profile auto-filled from DepEd LIS registry!</span>
                        </p>
                      )}
                    </div>

                    {/* Previous School Details for SF10 Tracking with Masking */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                          Previous School of Origin Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Pasig City Science High School"
                          value={prevSchoolName}
                          onChange={(e) => setPrevSchoolName(e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                        />
                        <span className="text-[10px] text-neutral-400 mt-1 block">
                          School of origin where permanent academic record (SF10) is currently archived
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-neutral-600 block">
                            School ID (6 Digits) *
                          </label>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {prevSchoolId.length}/6
                          </span>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="300481"
                          value={prevSchoolId}
                          onChange={(e) => setPrevSchoolId(formatSchoolIdMask(e.target.value))}
                          className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono bg-white"
                        />
                        <span className="text-[10px] text-neutral-400 mt-1 block">
                          Official 6-digit DepEd School ID
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 2: DEPED ENHANCED BEEF INTAKE                        */}
            {/* ========================================================= */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border-b border-slate-100 pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">
                        DepEd Basic Education Enrollment Form (DO No. 03, s. 2018)
                      </h3>
                      <p className="text-neutral-500 text-xs">
                        Demographic profile and socio-demographic indicators with automated input masking.
                      </p>
                    </div>
                    <span className="text-[11px] text-neutral-400">Step 2 of 5</span>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">First Name *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Johnny"
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">Given name</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Middle Name</label>
                    <input
                      type="text"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      placeholder="Mendoza"
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">Maternal surname</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Tabulo"
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">Paternal family name</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Extension</label>
                    <input
                      type="text"
                      value={extensionName}
                      onChange={(e) => setExtensionName(e.target.value)}
                      placeholder="Jr., III"
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">Optional suffix</span>
                  </div>
                </div>

                {/* Sex, DOB Mask, Mother Tongue */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Sex at Birth</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSex('Male')}
                        className={`flex-1 py-2 rounded-lg border font-bold text-xs ${
                          sex === 'Male' ? 'bg-neutral-900 text-white border-neutral-900' : 'border-slate-300 bg-white text-neutral-700'
                        }`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setSex('Female')}
                        className={`flex-1 py-2 rounded-lg border font-bold text-xs ${
                          sex === 'Female' ? 'bg-neutral-900 text-white border-neutral-900' : 'border-slate-300 bg-white text-neutral-700'
                        }`}
                      >
                        Female
                      </button>
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-1 block">Per official PSA record</span>
                  </div>

                  {/* DOB Input with Masking */}
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Date of Birth (YYYY-MM-DD) *
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={birthDate}
                      onChange={(e) => {
                        const masked = formatDateOfBirthMask(e.target.value);
                        setBirthDate(masked);
                        const check = isValidDateOfBirth(masked);
                        setDobError(check.isValid ? null : check.message || null);
                      }}
                      placeholder="2010-08-15"
                      className={`w-full p-2 border rounded-lg text-xs font-mono bg-white outline-none ${
                        dobError ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300 focus:border-neutral-900'
                      }`}
                    />
                    {dobError ? (
                      <span className="text-[10px] text-rose-600 mt-1 block font-medium">{dobError}</span>
                    ) : (
                      <span className="text-[10px] text-neutral-400 mt-1 block">
                        Format: YYYY-MM-DD (e.g. 2010-08-15)
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Mother Tongue</label>
                    <select
                      value={motherTongue}
                      onChange={(e) => setMotherTongue(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                    >
                      {DEPED_MOTHER_TONGUES.map((mt) => (
                        <option key={mt} value={mt}>{mt}</option>
                      ))}
                    </select>
                    <span className="text-[10px] text-neutral-400 mt-1 block">Learner primary native language</span>
                  </div>
                </div>

                {/* Grade Level & SHS Strand */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Applying For Grade</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                    >
                      <option value="Kindergarten">Kindergarten</option>
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                      <option value="Grade 4">Grade 4</option>
                      <option value="Grade 5">Grade 5</option>
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 7">Grade 7 (Junior High)</option>
                      <option value="Grade 8">Grade 8 (Junior High)</option>
                      <option value="Grade 9">Grade 9 (Junior High)</option>
                      <option value="Grade 10">Grade 10 (Junior High)</option>
                      <option value="Grade 11">Grade 11 (Senior High)</option>
                      <option value="Grade 12">Grade 12 (Senior High)</option>
                    </select>
                    <span className="text-[10px] text-neutral-400 mt-1 block">Key stage category</span>
                  </div>

                  {(gradeLevel.includes('Grade 11') || gradeLevel.includes('Grade 12')) && (
                    <>
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-600 block mb-1">SHS Track</label>
                        <select
                          value={shsTrack}
                          onChange={(e) => setShsTrack(e.target.value as any)}
                          className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                        >
                          {Object.keys(SHS_TRACKS_AND_STRANDS).map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <span className="text-[10px] text-neutral-400 mt-1 block">DO 03, s. 2018 SHS Track</span>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-neutral-600 block mb-1">SHS Strand</label>
                        <select
                          value={shsStrand}
                          onChange={(e) => setShsStrand(e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                        >
                          {SHS_TRACKS_AND_STRANDS[shsTrack]?.map((s) => (
                            <option key={s.code} value={s.code}>{s.code} - {s.title}</option>
                          ))}
                        </select>
                        <span className="text-[10px] text-neutral-400 mt-1 block">Specialized course track</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Residential Address with Masking / Formatting */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                    Complete Residential Address *
                  </label>
                  <input
                    type="text"
                    value={currentAddress}
                    onChange={(e) => setCurrentAddress(e.target.value)}
                    placeholder="House/Unit No., Street, Barangay, City/Municipality, Province"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Protected under RA 10173 with AES-256 field-level storage encryption
                  </span>
                </div>

                {/* Socio-demographic Checkboxes (4Ps with Masking, IP, LSEN) */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex flex-wrap items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={is4Ps}
                        onChange={(e) => setIs4Ps(e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span className="font-semibold text-xs">4Ps Beneficiary Household</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isIP}
                        onChange={(e) => setIsIP(e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span className="font-semibold text-xs">Indigenous Peoples (IP)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isLSEN}
                        onChange={(e) => setIsLSEN(e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span className="font-semibold text-xs">Special Educational Needs (LSEN)</span>
                    </label>
                  </div>

                  {is4Ps && (
                    <div className="pt-2">
                      <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                        4Ps Household ID Number *
                      </label>
                      <input
                        type="text"
                        maxLength={14}
                        placeholder="HH-1082-940185"
                        value={fourPsId}
                        onChange={(e) => setFourPsId(format4PsMask(e.target.value))}
                        className="w-full max-w-sm p-2 border border-slate-300 rounded-lg text-xs bg-white font-mono"
                      />
                      <span className="text-[10px] text-neutral-400 mt-1 block">
                        Format: HH-XXXX-XXXXXX per DSWD 4Ps beneficiary database
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 3: CREDENTIALS, DOCUMENTS & AFFIDAVIT OF UNDERTAKING  */}
            {/* ========================================================= */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border-b border-slate-100 pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">
                        Mandatory Credentials & DepEd Order No. 03, s. 2018
                      </h3>
                      <p className="text-neutral-500 text-xs">
                        Upload digital copies of PSA Birth Certificate and Form 138 (SF9). If physical copies are delayed from your origin school, you may execute an electronic Affidavit of Undertaking.
                      </p>
                    </div>
                    <span className="text-[11px] text-neutral-400">Step 3 of 5</span>
                  </div>
                </div>

                {/* Form 138 / SF9 Report Card Upload */}
                <div className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">
                      DepEd Form 138 / SF9 (Progress Report Card)
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {sf9FileName ? `${sf9FileName} - Attached` : 'Final report card with General Average and Learner Reference Number.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
                      <input
                        type="checkbox"
                        checked={hasSF9ReportCard}
                        onChange={(e) => setHasSF9ReportCard(e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span>Available Now</span>
                    </label>

                    {hasSF9ReportCard && (
                      <label className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-neutral-800 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-2xs">
                        <span>{sf9FileName ? 'Change File' : 'Upload File'}</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setSf9FileName(e.target.files[0].name);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* PSA Birth Certificate Upload */}
                <div className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">
                      PSA Birth Certificate
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {psaFileName ? `${psaFileName} - Attached` : 'Official Philippine Statistics Authority (PSA) Birth Certificate.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
                      <input
                        type="checkbox"
                        checked={hasPSABirthCert}
                        onChange={(e) => setHasPSABirthCert(e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span>Available Now</span>
                    </label>

                    {hasPSABirthCert && (
                      <label className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-neutral-800 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-2xs">
                        <span>{psaFileName ? 'Change File' : 'Upload File'}</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setPsaFileName(e.target.files[0].name);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* DO 03, s. 2018 Affidavit of Undertaking Notice */}
                {(!hasSF9ReportCard || !hasPSABirthCert) && (
                  <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/80 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <FileWarning className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wider">
                          TEMPORARY ENROLLMENT APPLIES (DepEd Order No. 03, s. 2018)
                        </h4>
                        <p className="text-amber-900 text-xs mt-0.5 leading-relaxed">
                          Because one or more credentials are missing, the learner will be admitted under <strong>Temporary Enrollment</strong>. Parents must execute an Affidavit of Undertaking promising submission on or before <strong>October 31, 2026</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-semibold text-amber-800">
                        Status:{' '}
                        {affidavitPayload ? (
                          <strong className="text-emerald-700 font-bold">✓ Signed Electronically</strong>
                        ) : (
                          <strong className="text-amber-900">Pending Parent Signature</strong>
                        )}
                      </span>

                      <button
                        type="button"
                        onClick={() => setIsAffidavitModalOpen(true)}
                        className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{affidavitPayload ? 'Edit Affidavit' : 'Execute Affidavit of Undertaking'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 4: INTEGRATED STUDENT PORTAL ACCOUNT CREATION        */}
            {/* ========================================================= */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border-b border-slate-100 pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">
                        Create Parent/Guardian Student Portal Account
                      </h3>
                      <p className="text-neutral-500 text-xs">
                        Required before submitting admission. Enables direct tracking of your 11-step enrollment roadmap.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-neutral-900 text-white font-mono text-[11px] font-bold">
                      {boundIdentifierDisplay}
                    </span>
                  </div>
                </div>

                {/* Account Fields Grid with Masking */}
                <div className="space-y-4">
                  {/* Parent Full Name */}
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                      Parent / Guardian Full Legal Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Roberto Tabulo"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white focus:border-neutral-900 outline-none"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      Name of parent, primary guardian, or legal custodian
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Parent Email */}
                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                        Parent / Guardian Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="parent.guardian@gmail.com"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white focus:border-neutral-900 outline-none"
                      />
                      <span className="text-[10px] text-neutral-400 mt-1 block">
                        Used as your portal account username and for official email receipts.
                      </span>
                    </div>

                    {/* Mobile Number with Dynamic Format Mask */}
                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                        Mobile Phone Number (+63 9XX-XXX-XXXX) *
                      </label>
                      <input
                        type="tel"
                        maxLength={16}
                        placeholder="+63 917-555-0199"
                        value={parentMobile}
                        onChange={(e) => {
                          const masked = formatPhilippineMobile(e.target.value);
                          setParentMobile(masked);
                          if (masked && !isValidPhilippineMobile(masked)) {
                            setMobileError('Please enter a complete 10-digit Philippine mobile number (+63 9XX-XXX-XXXX)');
                          } else {
                            setMobileError(null);
                          }
                        }}
                        className={`w-full p-2.5 border rounded-lg text-xs font-mono bg-white outline-none ${
                          mobileError ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300 focus:border-neutral-900'
                        }`}
                      />
                      {mobileError ? (
                        <span className="text-[10px] text-rose-600 mt-1 block font-medium">{mobileError}</span>
                      ) : (
                        <span className="text-[10px] text-neutral-400 mt-1 block">
                          Dynamic format: +63 9XX-XXX-XXXX. Used for SMS OTP and enrollment dispatches.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Account Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                        Create Account Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="At least 6 characters"
                          value={accountPassword}
                          onChange={(e) => setAccountPassword(e.target.value)}
                          className="w-full p-2.5 pr-10 border border-slate-300 rounded-lg text-xs bg-white focus:border-neutral-900 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <span className="text-[10px] text-neutral-400 mt-1 block">
                        Minimum 6 characters. Stores with secure bcrypt hashing simulation.
                      </span>
                    </div>

                    {/* Bound Identifier Confirmation */}
                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                        Bound Learner Identifier
                      </label>
                      <div className="p-2.5 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-neutral-900">
                          {boundIdentifierDisplay}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                          Locked to Profile
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 mt-1 block">
                        Permanently associates this guardian account with the learner record
                      </span>
                    </div>
                  </div>

                  {/* RA 10173 Consent Checkbox */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacyConsentAgreed}
                        onChange={(e) => setPrivacyConsentAgreed(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300"
                      />
                      <span className="text-xs text-neutral-700 leading-relaxed">
                        I hereby authorize E-ENROLL Academy and the Department of Education (DepEd) to collect and process this learner information in accordance with the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong> for admission and LIS enrolment tracking.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 5: COMPREHENSIVE REVIEW & EDIT SCREEN               */}
            {/* ========================================================= */}
            {currentStep === 5 && (
              <div className="space-y-5 animate-in fade-in">
                {/* Header with Instructions */}
                <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Review & Edit Application Summary</span>
                    </h3>
                    <p className="text-neutral-500 text-xs mt-0.5">
                      Carefully verify all details before submitting. Click <strong className="text-neutral-800">Edit Section</strong> on any card to make instant adjustments.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-900 text-white uppercase self-start sm:self-auto">
                    Final Verification Step
                  </span>
                </div>

                {/* 4 Clean Summary Cards with Single-Click Edit Shortcuts */}
                <div className="space-y-4">
                  {/* SUMMARY CARD 1: ADMISSION PATHWAY & IDENTIFICATION */}
                  <div className="border border-slate-200 rounded-xl p-4.5 bg-white shadow-2xs hover:border-slate-300 transition-colors space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-neutral-800" />
                        <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                          Section 1: Admission Pathway & Identification
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleJumpToStep(1)}
                        className="px-3 py-1 text-xs font-bold text-neutral-800 hover:text-neutral-900 hover:bg-slate-100 rounded-md border border-slate-200 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                      >
                        <Edit3 className="w-3 h-3 text-neutral-700" />
                        <span>Edit Section</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Pathway</span>
                        <strong className="text-neutral-900">
                          {pathway === 'new_student' ? 'New Student (No LRN)' : 'Transferee / Balik-Aral'}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Identifier</span>
                        <strong className="font-mono text-neutral-900 bg-slate-100 px-1.5 py-0.5 rounded">
                          {boundIdentifierDisplay}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Grade & Track</span>
                        <strong className="text-neutral-900">
                          {gradeLevel} {shsStrand && gradeLevel.includes('Grade 11') ? `(${shsStrand})` : ''}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">School Year</span>
                        <strong className="text-neutral-900">SY 2026-2027 ({openingMonth})</strong>
                      </div>
                    </div>

                    {pathway === 'transferee' && prevSchoolName && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-neutral-600">
                        <span>
                          <strong>Origin School:</strong> {prevSchoolName} (School ID: <code className="font-mono">{prevSchoolId || '300481'}</code>)
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800">
                          SF10 Electronic Tracking Active
                        </span>
                      </div>
                    )}

                    {pathway === 'new_student' && kinderEvaluation && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-neutral-600">
                        <span>
                          <strong>Age Status:</strong> {kinderEvaluation.policyNotice}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">
                          {kinderEvaluation.status}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* SUMMARY CARD 2: LEARNER DEMOGRAPHIC & BEEF PROFILE */}
                  <div className="border border-slate-200 rounded-xl p-4.5 bg-white shadow-2xs hover:border-slate-300 transition-colors space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-neutral-800" />
                        <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                          Section 2: Learner Demographic & BEEF Profile
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleJumpToStep(2)}
                        className="px-3 py-1 text-xs font-bold text-neutral-800 hover:text-neutral-900 hover:bg-slate-100 rounded-md border border-slate-200 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                      >
                        <Edit3 className="w-3 h-3 text-neutral-700" />
                        <span>Edit Section</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Full Legal Name</span>
                        <strong className="text-neutral-900">
                          {firstName} {middleName} {lastName} {extensionName}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Sex</span>
                        <strong className="text-neutral-900">{sex}</strong>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Date of Birth</span>
                        <strong className="font-mono text-neutral-900">{birthDate}</strong>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Mother Tongue</span>
                        <strong className="text-neutral-900">{motherTongue}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Residential Address</span>
                        <span className="text-neutral-700">{currentAddress}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Socio-Demographic Clusters</span>
                        <span className="text-neutral-700">
                          {is4Ps ? `4Ps Beneficiary (${fourPsId || 'Pending ID'})` : 'Non-4Ps'} • {isIP ? `IP: ${ipGroup}` : 'Non-IP'} • {isLSEN ? 'Special Needs Tagged' : 'General Education'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SUMMARY CARD 3: ACADEMIC CREDENTIALS & UNDERTAKING */}
                  <div className="border border-slate-200 rounded-xl p-4.5 bg-white shadow-2xs hover:border-slate-300 transition-colors space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-neutral-800" />
                        <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                          Section 3: Credentials & DepEd Order No. 03, s. 2018
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleJumpToStep(3)}
                        className="px-3 py-1 text-xs font-bold text-neutral-800 hover:text-neutral-900 hover:bg-slate-100 rounded-md border border-slate-200 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                      >
                        <Edit3 className="w-3 h-3 text-neutral-700" />
                        <span>Edit Section</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Form 138 / SF9 Report Card</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {sf9FileName ? (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span className="truncate">{sf9FileName}</span>
                            </span>
                          ) : (
                            <span className="text-amber-800 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Missing — Covered by Undertaking</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">PSA Birth Certificate</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {hasPSABirthCert ? (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>{psaFileName || 'Verified Available'}</span>
                            </span>
                          ) : (
                            <span className="text-amber-800 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Missing — Covered by Undertaking</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Admission Type</span>
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-0.5 ${
                          !hasSF9ReportCard || !hasPSABirthCert || !sf9FileName
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {!hasSF9ReportCard || !hasPSABirthCert || !sf9FileName
                            ? 'Temporary Enrollment (DO 03, s. 2018)'
                            : 'Verified Complete'}
                        </span>
                      </div>
                    </div>

                    {(!hasSF9ReportCard || !hasPSABirthCert || !sf9FileName) && (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                        <span>
                          <strong>Affidavit of Undertaking:</strong> {affidavitPayload ? 'Digitally Signed by Parent' : 'Execution will be prompted upon submit'}
                        </span>
                        <span className="font-semibold text-[11px]">
                          Deadline: October 31, 2026
                        </span>
                      </div>
                    )}
                  </div>

                  {/* SUMMARY CARD 4: PARENT / GUARDIAN PORTAL ACCOUNT */}
                  <div className="border border-slate-200 rounded-xl p-4.5 bg-white shadow-2xs hover:border-slate-300 transition-colors space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-neutral-800" />
                        <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                          Section 4: Parent / Guardian Account & Privacy Consent
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleJumpToStep(4)}
                        className="px-3 py-1 text-xs font-bold text-neutral-800 hover:text-neutral-900 hover:bg-slate-100 rounded-md border border-slate-200 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                      >
                        <Edit3 className="w-3 h-3 text-neutral-700" />
                        <span>Edit Section</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Parent/Guardian Full Name</span>
                        <strong className="text-neutral-900">{parentName || 'Parent / Legal Guardian'}</strong>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Portal Username (Email)</span>
                        <strong className="font-mono text-neutral-900">{parentEmail}</strong>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Mobile Alert Number</span>
                        <strong className="font-mono text-neutral-900">{parentMobile}</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-neutral-600">
                      <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                        <BadgeCheck className="w-4 h-4 text-emerald-600" />
                        <span>Data Privacy Act of 2012 (RA 10173) Explicit Consent Granted</span>
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Auto-login token generated upon submit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 6: POST-SUBMISSION RECEIPT & LIVE HAND-OFF           */}
            {/* ========================================================= */}
            {currentStep === 6 && submissionResult && (
              <div className="space-y-5 animate-in zoom-in-95 py-2">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">
                    Account Created & Admission Submitted!
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto">
                    Your student portal account credentials have been provisioned and your admission intake is recorded in the DepEd registration ledger.
                  </p>
                </div>

                {/* Receipt Grid */}
                <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-neutral-400 block text-[11px] font-semibold uppercase">Application Ref</span>
                      <strong className="font-mono text-neutral-900">{submissionResult.applicationId}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[11px] font-semibold uppercase">Learner Identifier</span>
                      <strong className="font-mono text-neutral-900">{boundIdentifierDisplay}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[11px] font-semibold uppercase">Portal Username (Email)</span>
                      <strong className="font-mono text-neutral-900">{parentEmail}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[11px] font-semibold uppercase">Enrollment Status</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-900 uppercase">
                        {submissionResult.roadmap?.status || 'SUBMITTED'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulated Verification Sent Notice */}
                <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4 flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900 space-y-0.5">
                    <strong>Verification Email & SMS Dispatched</strong>
                    <p>
                      A verification SMS OTP code (<code>{submissionResult.verification?.smsCode}</code>) was sent to {parentMobile}, and an account confirmation link was delivered to {parentEmail}.
                    </p>
                  </div>
                </div>

                {/* Prominent Direct Hand-off CTA */}
                <div className="pt-2">
                  <button
                    onClick={handleProceedToRoadmap}
                    className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <span>Proceed Directly to Student Portal Enrollment Roadmap</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls (Steps 1 to 5) */}
          {currentStep <= 5 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-neutral-700 hover:bg-white disabled:opacity-40 uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>{currentStep === 4 ? 'Review Application →' : 'Continue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                /* Step 5: Final Review & Confirmation Submit */
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  <span>{isSubmitting ? 'Submitting & Provisioning Account...' : 'Confirm & Submit Application'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Affidavit of Undertaking Modal */}
      <AffidavitOfUndertakingModal
        isOpen={isAffidavitModalOpen}
        onClose={() => setIsAffidavitModalOpen(false)}
        studentName={`${firstName} ${lastName}`.trim() || 'Learner Applicant'}
        parentName={parentName || 'Parent / Legal Guardian'}
        missingDocs={[
          ...(!hasPSABirthCert ? ['PSA Birth Certificate'] : []),
          ...(!hasSF9ReportCard ? ['SF9 (Learner Progress Report Card / Form 138)'] : []),
        ]}
        onSignedComplete={(payload: AffidavitPayload) => {
          setAffidavitPayload(payload);
          setIsAffidavitModalOpen(false);
        }}
      />
    </>
  );
};
