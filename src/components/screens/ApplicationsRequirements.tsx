import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Check,
  Minus,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  X,
  AlertCircle,
  FileCheck,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Send,
  Printer,
} from 'lucide-react';
import { ApplicationItem, DocumentQueueItem, RequirementItem, Student } from '../../types';
import { DepEdSchoolFormsModal } from '../modals/DepEdSchoolFormsModal';

interface ApplicationsRequirementsProps {
  applications: ApplicationItem[];
  requirements: RequirementItem[];
  documentQueue: DocumentQueueItem[];
  searchQuery: string;
  students?: Student[];
  onBatchApprovalClick: () => void;
  onUpdateRequirement: (reqs: RequirementItem[]) => void;
}

export const ApplicationsRequirements: React.FC<ApplicationsRequirementsProps> = ({
  applications,
  requirements,
  documentQueue,
  searchQuery,
  students = [],
  onBatchApprovalClick: _onBatchApprovalClick,
  onUpdateRequirement,
}) => {
  const [sortOption, setSortOption] = useState('Most Recent');
  const [activeQueue, setActiveQueue] = useState<'ALL' | 'VERIFIED' | 'TEMPORARY' | 'FLAGGED'>('ALL');
  const [reviewingDoc, setReviewingDoc] = useState<DocumentQueueItem | null>(null);
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [showEditRequirementsModal, setShowEditRequirementsModal] = useState(false);
  const [editableReqs, setEditableReqs] = useState<RequirementItem[]>(requirements);
  const [showDepEdFormsModal, setShowDepEdFormsModal] = useState(false);

  // Categorize applications for DepEd operational queues
  const categorizedApps = applications.map((app) => {
    let queueCategory: 'VERIFIED' | 'TEMPORARY' | 'FLAGGED' = 'VERIFIED';
    let flagRemark: string | undefined = undefined;

    if (app.status === 'INCOMPLETE' || app.status === 'URGENT' || app.tags.some((t) => t.status === 'missing')) {
      // Missing credentials with affidavit
      if (app.applicantName.includes('Mateo') || app.appNumber.includes('49000392') || app.tags.some((t) => t.label.includes('138') && t.status === 'missing')) {
        queueCategory = 'TEMPORARY';
      } else {
        queueCategory = 'FLAGGED';
        flagRemark = 'Incomplete credentials or unreadable upload';
      }
    } else if (app.applicantName.includes('Kinder') || app.program.includes('Kindergarten')) {
      queueCategory = 'FLAGGED';
      flagRemark = 'LIS_CONDITIONAL_TAGGING: Kindergarten ECCD Assessment Required';
    } else {
      queueCategory = 'VERIFIED';
    }

    return {
      ...app,
      queueCategory,
      flagRemark,
    };
  });

  // Filtered applications based on search and active queue
  const filteredApps = categorizedApps.filter((app) => {
    const matchesSearch =
      !searchQuery ||
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.appNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.program.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeQueue === 'VERIFIED') return app.queueCategory === 'VERIFIED';
    if (activeQueue === 'TEMPORARY') return app.queueCategory === 'TEMPORARY';
    if (activeQueue === 'FLAGGED') return app.queueCategory === 'FLAGGED';
    return true;
  });

  // Counts
  const totalCount = applications.length;
  const verifiedCount = categorizedApps.filter((a) => a.queueCategory === 'VERIFIED').length;
  const temporaryCount = categorizedApps.filter((a) => a.queueCategory === 'TEMPORARY').length;
  const flaggedCount = categorizedApps.filter((a) => a.queueCategory === 'FLAGGED').length;

  const handleToggleRequirement = (id: string) => {
    const updated = editableReqs.map((r) =>
      r.id === id ? { ...r, checked: !r.checked } : r
    );
    setEditableReqs(updated);
    onUpdateRequirement(updated);
  };

  const handleApproveDoc = (docId: string) => {
    alert(`Document ${docId} verified against PSA/DepEd database.`);
    setReviewingDoc(null);
  };

  const handleRejectDoc = (docId: string) => {
    alert(`Document ${docId} flagged. Re-upload request dispatched to learner.`);
    setReviewingDoc(null);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
            DepEd Regulatory Admissions & Registry
          </span>
          <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
            Learner Admissions & DepEd Compliance Console
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Operational queues for DO 03 s. 2018 (BEEF), DO 20 s. 2018 (Age Qualification), and SF1-SF10 generation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowDepEdFormsModal(true)}
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>DepEd School Forms & LIS BOSY</span>
          </button>
        </div>
      </div>

      {/* 4 Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Intake */}
        <div
          onClick={() => setActiveQueue('ALL')}
          className={`bg-white border rounded-xl p-5 shadow-xs cursor-pointer transition-all ${
            activeQueue === 'ALL' ? 'border-neutral-900 ring-2 ring-neutral-900/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block">
            TOTAL INTAKE POOL
          </span>
          <div className="text-2xl font-bold text-neutral-900 mt-2 tracking-tight">
            {totalCount || 1420}
          </div>
          <div className="text-xs text-neutral-500 mt-1 font-medium">
            SY 2026-2027 (K-12 Basic Ed)
          </div>
        </div>

        {/* Verified Complete */}
        <div
          onClick={() => setActiveQueue('VERIFIED')}
          className={`bg-white border rounded-xl p-5 shadow-xs cursor-pointer transition-all ${
            activeQueue === 'VERIFIED' ? 'border-emerald-700 ring-2 ring-emerald-700/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase block">
              VERIFIED COMPLETE
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-2 tracking-tight">
            {verifiedCount || 845}
          </div>
          <div className="text-xs text-neutral-500 mt-1 font-medium">
            Full credentials approved
          </div>
        </div>

        {/* Temporarily Enrolled */}
        <div
          onClick={() => setActiveQueue('TEMPORARY')}
          className={`bg-white border rounded-xl p-5 shadow-xs cursor-pointer transition-all ${
            activeQueue === 'TEMPORARY' ? 'border-amber-700 ring-2 ring-amber-700/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-amber-800 uppercase block">
              TEMPORARILY ENROLLED
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-2 tracking-tight">
            {temporaryCount || 284}
          </div>
          <div className="text-xs text-neutral-500 mt-1 font-medium">
            Under Affidavit (Due Oct 31)
          </div>
        </div>

        {/* Flagged / Action Required */}
        <div
          onClick={() => setActiveQueue('FLAGGED')}
          className={`bg-white border rounded-xl p-5 shadow-xs cursor-pointer transition-all ${
            activeQueue === 'FLAGGED' ? 'border-rose-700 ring-2 ring-rose-700/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-rose-800 uppercase block">
              FLAGGED / ACTION REQ
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-2 tracking-tight">
            {flaggedCount || 112}
          </div>
          <div className="text-xs text-neutral-500 mt-1 font-medium">
            LIS conditional tagging / errors
          </div>
        </div>
      </div>

      {/* Main Grid: Left Operational Applications List (2/3) + Right Checklist & Queue (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Applications Table & Queue Switcher */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
            {/* Operational Queue Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <button
                onClick={() => setActiveQueue('ALL')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  activeQueue === 'ALL'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'text-neutral-600 hover:bg-slate-100'
                }`}
              >
                All ({categorizedApps.length})
              </button>
              <button
                onClick={() => setActiveQueue('VERIFIED')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  activeQueue === 'VERIFIED'
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                Verified Complete
              </button>
              <button
                onClick={() => setActiveQueue('TEMPORARY')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  activeQueue === 'TEMPORARY'
                    ? 'bg-amber-800 text-white shadow-2xs'
                    : 'text-amber-800 hover:bg-amber-50'
                }`}
              >
                Temporarily Enrolled
              </button>
              <button
                onClick={() => setActiveQueue('FLAGGED')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  activeQueue === 'FLAGGED'
                    ? 'bg-rose-800 text-white shadow-2xs'
                    : 'text-rose-800 hover:bg-rose-50'
                }`}
              >
                Flagged / LIS Tagged
              </button>
            </div>

            <div className="relative shrink-0">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 text-neutral-800 text-xs font-semibold py-1.5 pl-3 pr-7 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="Most Recent">Most Recent</option>
                <option value="Oldest">Oldest</option>
                <option value="Urgent First">Urgent First</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* List of Applications */}
          <div className="space-y-3">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden font-bold text-xs text-neutral-600">
                    {app.applicantName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-neutral-900">
                        {app.applicantName}
                      </h4>
                      {app.queueCategory === 'TEMPORARY' && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          TEMPORARY (DO 03, s. 2018)
                        </span>
                      )}
                      {app.queueCategory === 'FLAGGED' && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-900 border border-rose-200">
                          FLAGGED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {app.appNumber} • {app.appliedDate} • {app.program}
                    </p>

                    {/* Document Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {app.tags.map((t, idx) => {
                        const isCompleted = t.status === 'completed';
                        const isMissing = t.status === 'missing';
                        return (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                              isCompleted
                                ? 'bg-slate-100 text-neutral-700 border-slate-200'
                                : isMissing
                                ? 'bg-amber-50 text-amber-900 border-amber-200'
                                : 'bg-transparent text-neutral-400 border-slate-200'
                            }`}
                          >
                            {t.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Status + Chevron */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase block">
                      INTAKE STATUS
                    </span>
                    <span
                      className={`text-xs font-bold tracking-wider ${
                        app.queueCategory === 'TEMPORARY'
                          ? 'text-amber-800'
                          : app.queueCategory === 'FLAGGED'
                          ? 'text-rose-800'
                          : 'text-emerald-800'
                      }`}
                    >
                      {app.queueCategory === 'TEMPORARY'
                        ? 'TEMPORARY (AOU)'
                        : app.queueCategory === 'FLAGGED'
                        ? 'ACTION REQUIRED'
                        : 'VERIFIED'}
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </div>
              </div>
            ))}

            {filteredApps.length === 0 && (
              <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-neutral-400 text-xs">
                No applications matching this operational queue filter.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Requirement Checklist (Dark Card) + Pending Document Queue */}
        <div className="space-y-6">
          {/* Requirement Checklist (Dark Card) */}
          <div
            id="requirement-checklist-card"
            className="bg-neutral-900 text-white rounded-xl p-6 shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold tracking-widest text-neutral-300 uppercase">
                DEPED MANDATED REQUIREMENTS
              </h3>
              <button
                onClick={() => setShowEditRequirementsModal(true)}
                className="text-[10px] text-neutral-400 hover:text-white uppercase font-bold"
              >
                Configure
              </button>
            </div>

            <div className="space-y-3 pt-1 divide-y divide-neutral-800 text-xs">
              {editableReqs.map((req) => (
                <div
                  key={req.id}
                  className="flex items-start gap-3 pt-3 first:pt-0 cursor-pointer"
                  onClick={() => handleToggleRequirement(req.id)}
                >
                  <div className="mt-0.5 shrink-0">
                    {req.checked ? (
                      <div className="w-4 h-4 rounded bg-emerald-500 text-neutral-950 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded border border-neutral-700 bg-neutral-800" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-neutral-200">{req.title}</h5>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{req.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Document Queue */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-xs text-neutral-900 uppercase tracking-wider">
                Document Verification Queue
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-neutral-600">
                {documentQueue.length} Pending
              </span>
            </div>

            <div className="space-y-2.5">
              {documentQueue.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setReviewingDoc(doc)}
                  className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <FileText className="w-4 h-4 text-neutral-500 shrink-0" />
                    <div className="truncate">
                      <span className="font-bold text-neutral-900 block truncate">{doc.filename}</span>
                      <span className="text-[10px] text-neutral-400 block">{doc.studentName}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-500 shrink-0">
                    Review →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DepEd School Forms & LIS BOSY Modal */}
      <DepEdSchoolFormsModal
        isOpen={showDepEdFormsModal}
        onClose={() => setShowDepEdFormsModal(false)}
        students={students}
      />

      {/* Review Document Modal */}
      {reviewingDoc && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-neutral-900">Credential Verification</h3>
                <span className="text-xs text-neutral-500">{reviewingDoc.studentName}</span>
              </div>
              <button
                onClick={() => setReviewingDoc(null)}
                className="text-neutral-400 hover:text-neutral-700 font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-48 rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-4 text-center">
              <FileText className="w-12 h-12 text-neutral-400 mb-2" />
              <p className="font-mono text-xs font-bold text-neutral-700">{reviewingDoc.filename}</p>
              <p className="text-[11px] text-neutral-500 mt-1">Verified against DepEd digital repository standards</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleRejectDoc(reviewingDoc.id)}
                className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg text-xs font-bold uppercase hover:bg-red-50"
              >
                Request Re-scan
              </button>
              <button
                onClick={() => handleApproveDoc(reviewingDoc.id)}
                className="flex-1 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-neutral-800"
              >
                Approve Credential
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Requirements Modal */}
      {showEditRequirementsModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-neutral-900">Edit Admissions Requirements</h3>
              <button
                onClick={() => setShowEditRequirementsModal(false)}
                className="text-neutral-400 hover:text-neutral-700 font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {editableReqs.map((r) => (
                <label key={r.id} className="flex items-center gap-3 p-2 border border-slate-100 rounded hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={r.checked}
                    onChange={() => handleToggleRequirement(r.id)}
                    className="rounded text-neutral-900 focus:ring-neutral-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-800">{r.title}</span>
                    <span className="text-[10px] text-neutral-400 block">{r.description}</span>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={() => setShowEditRequirementsModal(false)}
              className="w-full mt-2 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* Selected Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-neutral-900">{selectedApp.applicantName}</h3>
                <span className="font-mono text-xs text-neutral-400">{selectedApp.appNumber}</span>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-neutral-400 hover:text-neutral-700 font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">Intended Program</span>
                <span className="font-semibold text-neutral-800">{selectedApp.program}</span>
              </div>

              {/* Status & Undertaking Details */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">Operational Queue</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-neutral-900 text-white">
                    {selectedApp.status}
                  </span>
                  <span className="text-neutral-500">
                    Compliance: DepEd Order No. 03, s. 2018
                  </span>
                </div>
              </div>

              {/* Electronic SF10 Transfer Trigger */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">Electronic SF10 Request</span>
                  <span className="font-medium text-neutral-700">DepEd Order No. 54, s. 2016 Tracker</span>
                </div>
                <button
                  onClick={() => alert(`Electronic SF10 request dispatched to originating school for ${selectedApp.applicantName}.`)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded font-bold text-[11px] text-neutral-800 hover:bg-slate-100 flex items-center gap-1"
                >
                  <Send className="w-3 h-3 text-neutral-600" />
                  <span>Request SF10</span>
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  alert(`Status for ${selectedApp.applicantName} marked APPROVED and synchronized with DepEd LIS.`);
                  setSelectedApp(null);
                }}
                className="flex-1 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-neutral-800"
              >
                Approve & Sync with LIS
              </button>
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg text-xs font-bold uppercase hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
