import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Trash2,
  Eye,
  FileCheck2,
  ShieldCheck,
  Building,
  HelpCircle,
  FileWarning,
  PenTool,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Info,
  Camera,
  RefreshCw,
} from 'lucide-react';
import { Student, ScreenId } from '../../types';
import { AffidavitOfUndertakingModal } from '../modals/AffidavitOfUndertakingModal';
import { AffidavitPayload } from '../../api/enrollmentApi';

interface UploadFormScreenProps {
  activeStudent?: Partial<Student>;
  onSelectScreen?: (screen: ScreenId) => void;
  onNavigateToRoadmap?: () => void;
}

interface UploadedDoc {
  id: string;
  type: string;
  title: string;
  category: 'Mandatory' | 'Alternative' | 'Secondary';
  policyRef: string;
  status: 'VERIFIED' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'UNDERTAKING_ACTIVE';
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  verifiedBy?: string;
  remarks?: string;
}

export const UploadFormScreen: React.FC<UploadFormScreenProps> = ({
  activeStudent,
  onSelectScreen,
  onNavigateToRoadmap,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAffidavitOpen, setIsAffidavitOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<UploadedDoc | null>(null);
  const [isUploadingId, setIsUploadingId] = useState<string | null>(null);

  const sf9InputRef = useRef<HTMLInputElement>(null);
  const psaInputRef = useRef<HTMLInputElement>(null);
  const moralInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const studentName = activeStudent?.name || 'Johnny Tabulo';
  const lrn = activeStudent?.lrn || '109283746512';
  const gradeLevel = activeStudent?.gradeLevel || 'Grade 11';
  const trackStrand = activeStudent?.trackStrand || 'STEM';
  const parentName = activeStudent?.parentGuardian || 'Roberto Tabulo';
  const appId = 'APP-2026-004912';

  const [documents, setDocuments] = useState<UploadedDoc[]>([
    {
      id: 'doc-sf9',
      type: 'SF9_REPORT_CARD',
      title: 'DepEd Form 138 / SF9 (Learner Progress Report Card)',
      category: 'Mandatory',
      policyRef: 'DepEd Order No. 03, s. 2018 Section IV.B',
      status: 'UNDERTAKING_ACTIVE',
      remarks: 'Covered under Affidavit of Undertaking. Physical original due on or before October 31, 2026.',
    },
    {
      id: 'doc-psa',
      type: 'PSA_BIRTH_CERT',
      title: 'PSA Birth Certificate (SECPA / NSO Copy)',
      category: 'Mandatory',
      policyRef: 'DepEd Order No. 03, s. 2018 Section IV.A',
      status: 'VERIFIED',
      fileName: 'PSA_Birth_Certificate_JohnnyTabulo.pdf',
      fileSize: '1.4 MB',
      uploadedAt: 'June 18, 2026 • 10:14 AM',
      verifiedBy: 'Registrar Maria Santos',
      remarks: 'Official SECPA copy verified. 12-Digit LRN matched with DepEd LIS Bosy Records.',
    },
    {
      id: 'doc-good-moral',
      type: 'GOOD_MORAL',
      title: 'Certificate of Good Moral Character',
      category: 'Secondary',
      policyRef: 'DepEd Basic Education Admission Standards',
      status: 'VERIFIED',
      fileName: 'Certificate_GoodMoral_JuniorHigh.pdf',
      fileSize: '820 KB',
      uploadedAt: 'June 19, 2026 • 02:40 PM',
      verifiedBy: 'Guidance Counselor Office',
      remarks: 'Issued with zero disciplinary infraction from Junior High School of origin.',
    },
    {
      id: 'doc-id-photo',
      type: 'ID_PHOTO',
      title: 'Recent 2x2 Colored ID Photo (White Background with Name Tag)',
      category: 'Secondary',
      policyRef: 'Learner Identification & School ID Card Protocol',
      status: 'VERIFIED',
      fileName: 'Johnny_Tabulo_2x2_ID.jpg',
      fileSize: '410 KB',
      uploadedAt: 'June 16, 2026 • 11:30 AM',
      verifiedBy: 'Admissions IT Staff',
      remarks: 'Standard name tag format confirmed for official school ID badge printing.',
    },
    {
      id: 'doc-sf10',
      type: 'SF10_PERMANENT_RECORD',
      title: 'DepEd Form 137 / SF10 (Learner Permanent Record)',
      category: 'Alternative',
      policyRef: 'DepEd Order No. 58, s. 2017 (School-to-School Transfer)',
      status: 'UNDER_REVIEW',
      remarks: 'Official school-to-school transmittal request dispatched via DepEd Division online facility.',
    },
  ]);

  const handleSimulateUpload = (docId: string, file: File) => {
    setIsUploadingId(docId);
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id === docId) {
            return {
              ...doc,
              fileName: file.name,
              fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
              uploadedAt: new Date().toLocaleDateString('en-PH', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              status: 'UNDER_REVIEW',
              remarks: 'Uploaded by learner. Currently queued for Registrar audit.',
            };
          }
          return doc;
        })
      );
      setIsUploadingId(null);
      showToast(`Document "${file.name}" uploaded successfully for Registrar review!`);
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleSimulateUpload(docId, file);
    }
  };

  const handleRemoveDoc = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            fileName: undefined,
            fileSize: undefined,
            uploadedAt: undefined,
            status: doc.id === 'doc-sf9' ? 'UNDERTAKING_ACTIVE' : 'ACTION_REQUIRED',
            remarks: doc.id === 'doc-sf9' ? 'Covered under Affidavit of Undertaking.' : 'Document removed. Please re-upload.',
          };
        }
        return doc;
      })
    );
    showToast('Document removed.');
  };

  const handleAffidavitSigned = (payload: AffidavitPayload) => {
    setIsAffidavitOpen(false);
    showToast('Affidavit of Undertaking legally registered per DepEd Order No. 03, s. 2018.');
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === 'doc-sf9') {
          return {
            ...doc,
            status: 'UNDERTAKING_ACTIVE',
            remarks: `Affidavit digitally executed by ${payload.parentGuardianName || parentName}. Temporary enrollment valid until October 31, 2026.`,
          };
        }
        return doc;
      })
    );
  };

  const handleDownloadProvisionalSlip = () => {
    const textContent = `=======================================================
DEPARTMENT OF EDUCATION (DepEd) - REGION VII
OFFICE OF THE SCHOOL REGISTRAR • BASIC EDUCATION
DOCUMENT SUBMISSION ACKNOWLEDGMENT & PROVISIONAL SLIP
(Issued in compliance with DepEd Order No. 03, s. 2018)
=======================================================

APPLICATION REFERENCE : ${appId}
DATE OF ISSUANCE      : ${new Date().toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
LEARNER NAME          : ${studentName.toUpperCase()}
12-DIGIT LRN          : ${lrn}
GRADE LEVEL & STRAND  : ${gradeLevel} • ${trackStrand}
PARENT / GUARDIAN     : ${parentName}

DOCUMENT AUDIT SUMMARY:
1. PSA Birth Certificate (SECPA) : [VERIFIED - ON FILE]
2. Form 138 / SF9 Report Card   : [TEMPORARY ENROLLMENT / UNDERTAKING]
3. Good Moral Certificate       : [VERIFIED - ON FILE]
4. 2x2 ID Photo                 : [VERIFIED - ON FILE]
5. Form 137 / SF10 Transmittal  : [DISPATCHED TO ORIGIN SCHOOL]

LEGAL STATUS:
Pursuant to DepEd Order No. 03, s. 2018 ("No Refusal Policy"),
no learner shall be denied enrollment due to delayed document release
from former school. Learner is TEMPORARILY ENROLLED.
Deadline for original credentials: OCTOBER 31, 2026.

ISSUED BY:
Office of the School Registrar
E-Enroll Basic Education Academy (DepEd ID: 300481)
Barcode: DEPED-ACK-${Date.now().toString(36).toUpperCase()}
=======================================================`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DepEd_Document_Receipt_${appId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Document Acknowledgment Slip downloaded.');
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

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={sf9InputRef}
        onChange={(e) => handleFileChange(e, 'doc-sf9')}
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
      />
      <input
        type="file"
        ref={psaInputRef}
        onChange={(e) => handleFileChange(e, 'doc-psa')}
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
      />
      <input
        type="file"
        ref={moralInputRef}
        onChange={(e) => handleFileChange(e, 'doc-good-moral')}
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
      />
      <input
        type="file"
        ref={photoInputRef}
        onChange={(e) => handleFileChange(e, 'doc-id-photo')}
        accept=".png,.jpg,.jpeg"
        className="hidden"
      />

      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-neutral-900 text-white uppercase tracking-wider">
              Document Upload Hub
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-900 border border-blue-200 uppercase">
              DepEd Order No. 03, s. 2018 Compliant
            </span>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight mt-2">
            Form 138 (SF9) & Credentials Submission
          </h2>
          <p className="text-neutral-500 text-sm mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              Learner: <strong className="text-neutral-800">{studentName}</strong>
            </span>
            <span>•</span>
            <span>
              LRN: <strong className="font-mono text-neutral-800">{lrn}</strong>
            </span>
            <span>•</span>
            <span>
              Application: <strong className="font-mono text-neutral-800">{appId}</strong>
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            id="btn-upload-slip"
            onClick={handleDownloadProvisionalSlip}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-neutral-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Receipt Slip</span>
          </button>
          <button
            id="btn-upload-goto-roadmap"
            onClick={() => {
              if (onNavigateToRoadmap) onNavigateToRoadmap();
              else if (onSelectScreen) onSelectScreen('enrollment_roadmap');
            }}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View 11-Step Roadmap</span>
          </button>
        </div>
      </div>

      {/* DepEd Regulatory Safeguard Banner (DO 03, s. 2018) */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-amber-950">
                DepEd "No Refusal Policy" & Temporary Enrollment Active
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200 text-amber-900 uppercase">
                DO 03, s. 2018
              </span>
            </div>
            <p className="text-xs text-amber-800 mt-1 max-w-3xl leading-relaxed">
              If your previous school has not yet released your official <strong>DepEd Form 138 / SF9 Report Card</strong>,
              your enrollment remains valid and protected under an Affidavit of Undertaking. You are permitted to attend all classes
              without delay until <strong>October 31, 2026</strong>.
            </p>
          </div>
        </div>

        <button
          id="btn-execute-affidavit-modal"
          onClick={() => setIsAffidavitOpen(true)}
          className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shrink-0 shadow-2xs"
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Execute / Sign Undertaking</span>
        </button>
      </div>

      {/* Document Upload Roster Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold tracking-wider text-neutral-900 uppercase">
              Enrollment Document Verification Roster
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Upload clear scanned copies or high-resolution photos in PDF, JPG, or PNG format (max 15MB each).
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              3 Verified
            </span>
            <span className="px-2.5 py-1 rounded-md font-bold bg-amber-50 text-amber-800 border border-amber-200">
              1 Under Undertaking
            </span>
          </div>
        </div>

        {/* Document Cards */}
        <div className="grid grid-cols-1 gap-4">
          {documents.map((doc) => {
            const isSf9 = doc.id === 'doc-sf9';
            const isPsa = doc.id === 'doc-psa';
            const isGoodMoral = doc.id === 'doc-good-moral';
            const isPhoto = doc.id === 'doc-id-photo';
            const isUploading = isUploadingId === doc.id;

            return (
              <div
                key={doc.id}
                id={`card-${doc.id}`}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Left side: Icon & Info */}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                      doc.status === 'VERIFIED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : doc.status === 'UNDERTAKING_ACTIVE'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : doc.status === 'UNDER_REVIEW'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    {doc.status === 'VERIFIED' ? (
                      <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
                    ) : doc.status === 'UNDERTAKING_ACTIVE' ? (
                      <ShieldCheck className="w-6 h-6 text-amber-600" />
                    ) : (
                      <FileText className="w-6 h-6" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-neutral-900">
                        {doc.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-700 uppercase">
                        {doc.category}
                      </span>
                      {doc.status === 'VERIFIED' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>VERIFIED BY REGISTRAR</span>
                        </span>
                      )}
                      {doc.status === 'UNDERTAKING_ACTIVE' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-700" />
                          <span>TEMPORARILY ENROLLED (DO 03)</span>
                        </span>
                      )}
                      {doc.status === 'UNDER_REVIEW' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>UNDER REGISTRAR AUDIT</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-500 mt-0.5">
                      {doc.policyRef}
                    </p>

                    {/* File Attachment Pill */}
                    {doc.fileName ? (
                      <div className="mt-2.5 inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <FileCheck2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-neutral-800 font-mono">
                          {doc.fileName}
                        </span>
                        <span className="text-neutral-400">•</span>
                        <span className="text-neutral-500">{doc.fileSize}</span>
                        {doc.uploadedAt && (
                          <>
                            <span className="text-neutral-400">•</span>
                            <span className="text-neutral-500">{doc.uploadedAt}</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-800 mt-2 bg-amber-50/80 px-2.5 py-1 rounded border border-amber-200/80">
                        {doc.remarks}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side: Action Controls */}
                <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center shrink-0">
                  {isUploading ? (
                    <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-600 bg-slate-100 rounded-lg animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading document...</span>
                    </div>
                  ) : (
                    <>
                      {doc.fileName && (
                        <button
                          id={`btn-preview-${doc.id}`}
                          onClick={() => setPreviewDoc(doc)}
                          className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-neutral-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Preview</span>
                        </button>
                      )}

                      {/* Upload / Re-upload button */}
                      <button
                        id={`btn-upload-${doc.id}`}
                        onClick={() => {
                          if (isSf9) sf9InputRef.current?.click();
                          else if (isPsa) psaInputRef.current?.click();
                          else if (isGoodMoral) moralInputRef.current?.click();
                          else if (isPhoto) photoInputRef.current?.click();
                        }}
                        className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs ${
                          doc.fileName
                            ? 'border border-slate-300 text-neutral-700 hover:bg-slate-50'
                            : 'bg-neutral-900 text-white hover:bg-neutral-800'
                        }`}
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{doc.fileName ? 'Replace File' : 'Upload File'}</span>
                      </button>

                      {/* If Form 138 missing or covered by undertaking, show Execute Undertaking */}
                      {isSf9 && (
                        <button
                          id="btn-sign-affidavit-inline"
                          onClick={() => setIsAffidavitOpen(true)}
                          className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                          <PenTool className="w-3.5 h-3.5" />
                          <span>Execute Undertaking</span>
                        </button>
                      )}

                      {doc.fileName && (
                        <button
                          id={`btn-delete-${doc.id}`}
                          onClick={() => handleRemoveDoc(doc.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DepEd Legal & Policy Framework Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Philippine Department of Education Regulatory Framework
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="font-bold text-neutral-900 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-neutral-700" />
              <span>DepEd Order No. 03, s. 2018</span>
            </span>
            <p className="text-neutral-500 leading-relaxed">
              Provides the national policy on Basic Education Enrollment. Enforces unconditional admission under Affidavit of Undertaking for learners with delayed records.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="font-bold text-neutral-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-neutral-700" />
              <span>Mandatory Submission Window</span>
            </span>
            <p className="text-neutral-500 leading-relaxed">
              Learners admitted under temporary enrollment have until <strong>October 31, 2026</strong> to submit physical original Form 138 (SF9) without academic forfeiture.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="font-bold text-neutral-900 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-neutral-700" />
              <span>School-to-School SF10 Facility</span>
            </span>
            <p className="text-neutral-500 leading-relaxed">
              The receiving school registrar issues official electronic requests to the origin school for direct transmittal of DepEd Form 137 / SF10 records.
            </p>
          </div>
        </div>
      </div>

      {/* Affidavit of Undertaking Modal */}
      <AffidavitOfUndertakingModal
        isOpen={isAffidavitOpen}
        onClose={() => setIsAffidavitOpen(false)}
        studentName={studentName}
        parentName={parentName}
        missingDocs={['DepEd Form 138 / SF9 (Progress Report Card)']}
        onSignedComplete={handleAffidavitSigned}
      />

      {/* In-App Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    {previewDoc.title}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    File: <span className="font-mono">{previewDoc.fileName}</span> ({previewDoc.fileSize})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Preview Sheet */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-xs text-neutral-800 space-y-4 font-mono">
              <div className="text-center border-b border-slate-200 pb-3">
                <div className="font-bold text-neutral-900 text-sm">REPUBLIC OF THE PHILIPPINES</div>
                <div className="text-[11px] text-neutral-600">DEPARTMENT OF EDUCATION • REGION VII</div>
                <div className="text-[11px] font-bold text-neutral-800 mt-1">OFFICIAL VERIFIED DOCUMENT COPY</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-neutral-500 block">LEARNER NAME:</span>
                  <span className="font-bold text-neutral-900">{studentName.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">12-DIGIT LRN:</span>
                  <span className="font-bold text-neutral-900">{lrn}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">TRACK / GRADE:</span>
                  <span className="font-bold text-neutral-900">{gradeLevel} - {trackStrand}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">APP ID:</span>
                  <span className="font-bold text-neutral-900">{appId}</span>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg text-center space-y-1">
                <div className="text-[11px] text-neutral-500">REGISTRAR VERIFICATION AUDIT</div>
                <div className="text-xs font-bold text-emerald-700">
                  {previewDoc.remarks || 'Document verified against DepEd Learner Information System standards.'}
                </div>
                {previewDoc.verifiedBy && (
                  <div className="text-[10px] text-neutral-400">
                    Verified By: {previewDoc.verifiedBy}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  showToast(`Simulated download of ${previewDoc.fileName}`);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-neutral-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Copy</span>
              </button>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
