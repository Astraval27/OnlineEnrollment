import React, { useState, useRef } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Upload,
  FileText,
  DollarSign,
  Receipt,
  Search,
  Filter,
  Eye,
  Check,
  ShieldCheck,
  Building,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Info,
  CreditCard,
  FileCheck2,
  X,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';
import { Student, ScreenId, NotificationItem } from '../../types';
import { APPLICANT_NOTIFICATIONS } from '../../data/mockData';

interface StudentNotificationsScreenProps {
  activeStudent?: Partial<Student>;
  onSelectScreen?: (screen: ScreenId) => void;
  onNavigateToUpload?: () => void;
  onNavigateToRoadmap?: () => void;
}

export const StudentNotificationsScreen: React.FC<StudentNotificationsScreenProps> = ({
  activeStudent,
  onSelectScreen,
  onNavigateToUpload,
  onNavigateToRoadmap,
}) => {
  // State for all notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(APPLICANT_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'TRANSACTIONS' | 'REGISTRAR_FOLLOWUPS' | 'ACADEMIC'>('ALL');
  const [filterReadStatus, setFilterReadStatus] = useState<'ALL' | 'UNREAD' | 'ACTION_REQUIRED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [selectedReceiptNotif, setSelectedReceiptNotif] = useState<NotificationItem | null>(null);
  const [uploadingForNotif, setUploadingForNotif] = useState<NotificationItem | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const studentName = activeStudent?.name || 'Johnny Tabulo';
  const lrn = activeStudent?.lrn || '109283746512';
  const gradeLevel = activeStudent?.gradeLevel || 'Grade 11';
  const trackStrand = activeStudent?.trackStrand || 'STEM';
  const section = activeStudent?.section || 'STEM - Newton';
  const parentName = activeStudent?.parentGuardian || 'Roberto Tabulo';

  // Metrics
  const transactionNotifs = notifications.filter((n) => n.type === 'TRANSACTION');
  const registrarFollowupNotifs = notifications.filter((n) => n.type === 'REGISTRAR_FOLLOWUP');
  const academicNotifs = notifications.filter((n) => n.type === 'ACADEMIC_LIS');
  const pendingFollowups = registrarFollowupNotifs.filter((n) => !n.isResolved);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const totalPaidAmount = transactionNotifs.reduce((sum, n) => sum + (n.amount || 0), 0);

  // Filtered notifications
  const filteredNotifications = notifications.filter((notif) => {
    // Type tab
    if (activeTab === 'TRANSACTIONS' && notif.type !== 'TRANSACTION') return false;
    if (activeTab === 'REGISTRAR_FOLLOWUPS' && notif.type !== 'REGISTRAR_FOLLOWUP') return false;
    if (activeTab === 'ACADEMIC' && notif.type !== 'ACADEMIC_LIS') return false;

    // Status filter
    if (filterReadStatus === 'UNREAD' && notif.read) return false;
    if (filterReadStatus === 'ACTION_REQUIRED') {
      if (notif.type !== 'REGISTRAR_FOLLOWUP' || notif.isResolved) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = notif.title.toLowerCase().includes(q);
      const matchDesc = notif.description.toLowerCase().includes(q);
      const matchOr = notif.orNumber?.toLowerCase().includes(q);
      const matchDoc = notif.documentName?.toLowerCase().includes(q);
      const matchSender = notif.sender?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchOr && !matchDoc && !matchSender) return false;
    }

    return true;
  });

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  // Toggle single read status
  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  // Download official receipt file
  const handleDownloadReceipt = (notif: NotificationItem) => {
    const textContent = `=======================================================
DEPARTMENT OF EDUCATION (DepEd) - BASIC EDUCATION
E-ENROLL ACADEMY • OFFICE OF FINANCE & TREASURY
DepEd School ID: 300481 • Taxpayer PIN: 294-812-904-000
=======================================================
OFFICIAL ELECTRONIC RECEIPT (OR)
RECEIPT NO.      : ${notif.orNumber || 'OR-2026-08129'}
TRANSACTION REF  : ${notif.transactionId || 'TRX-99821'}
DATE & TIMESTAMP : ${notif.timestamp}
PAYMENT CHANNEL  : ${notif.paymentMethod || 'GCash Online Settlement'}

LEARNER INFORMATION:
Name             : ${studentName.toUpperCase()}
12-Digit LRN     : ${lrn}
Grade & Section  : ${gradeLevel} - ${section}
Track / Strand   : ${trackStrand}
Parent / Payor   : ${parentName}

FEE BREAKDOWN:
${(notif.feeBreakdown || [
  { item: notif.title, amount: notif.amount || 0 }
])
  .map((item) => `- ${item.item.padEnd(42, ' ')} : ₱${item.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`)
  .join('\n')}
-------------------------------------------------------
TOTAL AMOUNT PAID : ₱${(notif.amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
PAYMENT STATUS    : CONFIRMED & VERIFIED (SUCCESS)
CASHIER / OFFICER : ${notif.cashierName || 'Maria Santos (Cashier/Registrar)'}
-------------------------------------------------------
VALIDATED DIGITAL AUDIT HASH:
SHA256: ${Math.random().toString(36).substring(2, 15).toUpperCase()}-${Date.now().toString(36).toUpperCase()}
* This serves as an official proof of payment for DepEd enrollment clearance.
=======================================================`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Official_Receipt_${notif.orNumber || notif.transactionId || 'PAYMENT'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Official Receipt ${notif.orNumber || ''} downloaded successfully.`);
  };

  // Trigger file upload for follow-up notice
  const handleStartUploadForNotif = (notif: NotificationItem) => {
    setUploadingForNotif(notif);
    setUploadedFile(null);
    setUploadProgress(0);
    setIsSimulatingUpload(false);
  };

  // Perform upload simulation
  const handleConfirmFileUpload = () => {
    if (!uploadedFile || !uploadingForNotif) return;

    setIsSimulatingUpload(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSimulatingUpload(false);
            // Update notification in state
            setNotifications((all) =>
              all.map((n) =>
                n.id === uploadingForNotif.id
                  ? {
                      ...n,
                      isResolved: true,
                      uploadedFileName: uploadedFile.name,
                      read: true,
                      description: `Document submitted by student: ${uploadedFile.name}. Awaiting final registrar stamp.`,
                    }
                  : n
              )
            );
            setUploadingForNotif(null);
            showToast(`Document "${uploadedFile.name}" submitted! Registrar follow-up resolved.`);
          }, 400);
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-xl border border-neutral-800 flex items-center gap-2.5 animate-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Context Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 lg:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                Learner Notifications & Registrar Compliance
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm mt-0.5">
                Official payment transaction receipts and registrar document follow-up requests for {studentName} ({gradeLevel} - {trackStrand}).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs text-neutral-500">
            <span>
              LRN: <strong className="font-mono text-neutral-800">{lrn}</strong>
            </span>
            <span>•</span>
            <span>
              Section: <strong className="text-neutral-800">{section}</strong>
            </span>
            <span>•</span>
            <span>
              Parent: <strong className="text-neutral-800">{parentName}</strong>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-lg text-neutral-700 hover:bg-slate-50 transition-colors disabled:opacity-40 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>

          {onNavigateToUpload && (
            <button
              onClick={onNavigateToUpload}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Go to Upload Center</span>
            </button>
          )}
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Successful Transactions */}
        <div
          onClick={() => setActiveTab('TRANSACTIONS')}
          className={`bg-white border rounded-xl p-5 shadow-xs cursor-pointer transition-all ${
            activeTab === 'TRANSACTIONS' ? 'border-emerald-600 ring-2 ring-emerald-600/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase block">
              SUCCESSFUL TRANSACTIONS
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-2 tracking-tight">
            ₱{totalPaidAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-neutral-500 mt-1 flex items-center justify-between">
            <span>{transactionNotifs.length} Settled Payments</span>
            <span className="font-semibold text-emerald-700">100% Cleared</span>
          </div>
        </div>

        {/* Metric 2: Registrar Follow-ups Needed */}
        <div
          onClick={() => setActiveTab('REGISTRAR_FOLLOWUPS')}
          className={`bg-white border rounded-xl p-5 shadow-xs cursor-pointer transition-all ${
            activeTab === 'REGISTRAR_FOLLOWUPS' ? 'border-amber-600 ring-2 ring-amber-600/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-amber-800 uppercase block">
              REGISTRAR FILE REQUESTS
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-2 tracking-tight">
            {pendingFollowups.length} Action Needed
          </div>
          <div className="text-xs text-neutral-500 mt-1 flex items-center justify-between">
            <span>{registrarFollowupNotifs.length} Total Notices</span>
            <span className="font-semibold text-amber-800">
              {registrarFollowupNotifs.length - pendingFollowups.length} Verified
            </span>
          </div>
        </div>

        {/* Metric 3: DepEd Undertaking Due Date */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-neutral-500 uppercase block">
              UNDERTAKING DEADLINE
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-neutral-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-neutral-900 mt-2 tracking-tight">
            October 31, 2026
          </div>
          <div className="text-xs text-amber-700 font-semibold mt-1">
            DepEd Order No. 03, s. 2018 Mandate
          </div>
        </div>

        {/* Metric 4: Academic Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-neutral-500 uppercase block">
              PORTAL STATUS
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-neutral-900 mt-2 tracking-tight">
            Active / Provisional
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            Class Attendance Authorized
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Main Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
                activeTab === 'ALL'
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'text-neutral-600 hover:bg-slate-100'
              }`}
            >
              All Notifications ({notifications.length})
            </button>

            <button
              onClick={() => setActiveTab('REGISTRAR_FOLLOWUPS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'REGISTRAR_FOLLOWUPS'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-amber-900 hover:bg-amber-50'
              }`}
            >
              <span>Registrar File Requests</span>
              {pendingFollowups.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold ${
                  activeTab === 'REGISTRAR_FOLLOWUPS' ? 'bg-amber-800 text-white' : 'bg-amber-200 text-amber-900'
                }`}>
                  {pendingFollowups.length} Action
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('TRANSACTIONS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'TRANSACTIONS'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              <span>Payment Receipts ({transactionNotifs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ACADEMIC')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
                activeTab === 'ACADEMIC'
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'text-neutral-600 hover:bg-slate-100'
              }`}
            >
              Academic & LIS ({academicNotifs.length})
            </button>
          </div>

          {/* Right Search & Status Filter */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search receipts, OR #, files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-800 focus:outline-none focus:border-neutral-900 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <select
              value={filterReadStatus}
              onChange={(e) => setFilterReadStatus(e.target.value as any)}
              className="appearance-none bg-slate-50 border border-slate-200 text-neutral-700 text-xs font-semibold py-1.5 px-3 rounded-lg focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="UNREAD">Unread Only</option>
              <option value="ACTION_REQUIRED">Action Required Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3.5">
        {filteredNotifications.map((notif) => {
          const isTransaction = notif.type === 'TRANSACTION';
          const isFollowUp = notif.type === 'REGISTRAR_FOLLOWUP';
          const isAcademic = notif.type === 'ACADEMIC_LIS';

          return (
            <div
              key={notif.id}
              className={`bg-white border rounded-xl p-5 shadow-xs transition-all relative ${
                !notif.read ? 'border-l-4 border-l-neutral-900 border-slate-200' : 'border-slate-200'
              } hover:border-slate-300`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Left Content Area */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Category Icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    isTransaction
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : isFollowUp
                      ? notif.isResolved
                        ? 'bg-slate-100 text-neutral-700 border-slate-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {isTransaction ? (
                      <Receipt className="w-5 h-5" />
                    ) : isFollowUp ? (
                      notif.isResolved ? <FileCheck2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <Building className="w-5 h-5" />
                    )}
                  </div>

                  {/* Body Text */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                        isTransaction
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isFollowUp
                          ? notif.isResolved
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                          : 'bg-slate-100 text-neutral-700 border-slate-200'
                      }`}>
                        {notif.category || (isTransaction ? 'Payment Receipt' : 'Registrar Notice')}
                      </span>

                      {notif.priority === 'URGENT' && !notif.isResolved && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-900 border border-rose-300 uppercase">
                          Urgent Follow-up
                        </span>
                      )}

                      {notif.isUnderUndertaking && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          DO 03, s. 2018 Undertaking
                        </span>
                      )}

                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-neutral-900 inline-block" title="Unread" />
                      )}

                      <span className="text-xs text-neutral-400 font-medium ml-auto lg:ml-0">
                        {notif.timestamp}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-900 leading-snug">
                      {notif.title}
                    </h3>

                    <p className="text-xs text-neutral-600 leading-relaxed max-w-3xl">
                      {notif.description}
                    </p>

                    {/* Specific Sub-Panels */}
                    {/* A. If Transaction: Show Receipt Snapshot */}
                    {isTransaction && (
                      <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <div>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase block">OFFICIAL RECEIPT #</span>
                            <span className="font-mono font-bold text-neutral-800">{notif.orNumber}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase block">TRANSACTION REF</span>
                            <span className="font-mono text-neutral-700">{notif.transactionId}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase block">CHANNEL</span>
                            <span className="font-medium text-neutral-700">{notif.paymentMethod}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase block">AMOUNT PAID</span>
                          <span className="text-base font-extrabold text-neutral-900 font-mono">
                            ₱{(notif.amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* B. If Registrar Follow-up: Show Required Document & Status */}
                    {isFollowUp && (
                      <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase">DOCUMENT:</span>
                            <strong className="text-neutral-800">{notif.documentName}</strong>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase">DUE DATE:</span>
                            <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                              notif.isResolved ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                            }`}>
                              {notif.dueDate}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-500 pt-1 border-t border-slate-200/80">
                          <span>Sender: <strong className="text-neutral-700">{notif.sender}</strong></span>
                          {notif.isResolved ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verified: {notif.uploadedFileName || 'Document on File'}</span>
                            </span>
                          ) : (
                            <span className="text-amber-800 font-bold">
                              Status: Pending Student Submission
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2.5 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                  {/* Actions for Transactions */}
                  {isTransaction && (
                    <>
                      <button
                        onClick={() => handleDownloadReceipt(notif)}
                        className="px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Receipt</span>
                      </button>

                      <button
                        onClick={() => setSelectedReceiptNotif(notif)}
                        className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Receipt Slip</span>
                      </button>
                    </>
                  )}

                  {/* Actions for Registrar Follow-ups */}
                  {isFollowUp && (
                    <>
                      {!notif.isResolved ? (
                        <button
                          onClick={() => handleStartUploadForNotif(notif)}
                          className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File Now</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Submitted & Cleared</span>
                        </span>
                      )}

                      {onNavigateToUpload && !notif.isResolved && (
                        <button
                          onClick={onNavigateToUpload}
                          className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Upload Center</span>
                        </button>
                      )}
                    </>
                  )}

                  {/* Actions for Academic updates */}
                  {isAcademic && onNavigateToRoadmap && (
                    <button
                      onClick={onNavigateToRoadmap}
                      className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>View Roadmap</span>
                    </button>
                  )}

                  {/* Toggle Read */}
                  <button
                    onClick={() => handleToggleRead(notif.id)}
                    className="text-[11px] text-neutral-400 hover:text-neutral-700 mt-1"
                  >
                    {notif.read ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredNotifications.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-neutral-400">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-neutral-800">No notifications match your filter</h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              There are no notices or transaction receipts matching your selected tab or search query.
            </p>
            <button
              onClick={() => {
                setActiveTab('ALL');
                setFilterReadStatus('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-neutral-700 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* MODAL 1: ELECTRONIC OFFICIAL RECEIPT PREVIEW MODAL */}
      {selectedReceiptNotif && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-neutral-900">
                    Official Electronic Receipt
                  </h3>
                  <span className="text-xs text-neutral-500 font-mono">
                    {selectedReceiptNotif.orNumber}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceiptNotif(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Slip Content */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60 space-y-4 text-xs font-mono">
              <div className="text-center pb-3 border-b border-slate-200 space-y-0.5 font-sans">
                <h4 className="font-extrabold text-sm text-neutral-900">E-ENROLL ACADEMY</h4>
                <p className="text-[11px] text-neutral-500">Department of Education • School ID: 300481</p>
                <p className="text-[10px] text-neutral-400">Cashier's Office & Student Financial Accounting</p>
              </div>

              {/* Transaction Key Pairs */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-neutral-400 uppercase block text-[9px]">Learner Name:</span>
                  <strong className="text-neutral-900">{studentName}</strong>
                </div>
                <div>
                  <span className="text-neutral-400 uppercase block text-[9px]">Learner Ref No:</span>
                  <span className="text-neutral-800">{lrn}</span>
                </div>
                <div>
                  <span className="text-neutral-400 uppercase block text-[9px]">Receipt Date:</span>
                  <span className="text-neutral-800">{selectedReceiptNotif.timestamp}</span>
                </div>
                <div>
                  <span className="text-neutral-400 uppercase block text-[9px]">Payment Method:</span>
                  <span className="text-neutral-800">{selectedReceiptNotif.paymentMethod}</span>
                </div>
              </div>

              {/* Fee Breakdown Table */}
              <div className="pt-2 border-t border-slate-200 space-y-1.5 font-sans">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  ITEMIZED SETTLEMENT:
                </span>
                <div className="space-y-1">
                  {(selectedReceiptNotif.feeBreakdown || [
                    { item: selectedReceiptNotif.title, amount: selectedReceiptNotif.amount || 0 }
                  ]).map((item, i) => (
                    <div key={i} className="flex justify-between text-xs py-1 border-b border-slate-100 last:border-b-0">
                      <span className="text-neutral-700">{item.item}</span>
                      <strong className="font-mono text-neutral-900">
                        ₱{item.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Row */}
              <div className="pt-3 border-t-2 border-neutral-800 flex justify-between items-center text-sm font-sans">
                <span className="font-bold text-neutral-900">TOTAL AMOUNT:</span>
                <span className="font-mono font-extrabold text-base text-neutral-900">
                  ₱{(selectedReceiptNotif.amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 text-center text-[10px] text-neutral-400 font-sans space-y-0.5">
                <p>Status: <strong className="text-emerald-700 font-bold uppercase">PAID & OFFICIALLY VALIDATED</strong></p>
                <p>Cashier Verification Stamp: {selectedReceiptNotif.cashierName || 'Maria Santos'}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedReceiptNotif(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownloadReceipt(selectedReceiptNotif);
                  setSelectedReceiptNotif(null);
                }}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INSTANT FOLLOW-UP FILE UPLOAD MODAL */}
      {uploadingForNotif && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-neutral-900">
                    Submit Registrar Follow-up File
                  </h3>
                  <span className="text-xs text-neutral-500">
                    {uploadingForNotif.documentName}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setUploadingForNotif(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notice Callout */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Registrar Instruction:</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                {uploadingForNotif.requiredAction || uploadingForNotif.description}
              </p>
              <div className="pt-1 text-[11px] text-amber-700">
                Deadline: <strong>{uploadingForNotif.dueDate}</strong>
              </div>
            </div>

            {/* Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-neutral-900 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadedFile(e.target.files[0]);
                  }
                }}
              />

              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto text-neutral-600 mb-3 shadow-2xs">
                <Upload className="w-6 h-6" />
              </div>

              {uploadedFile ? (
                <div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 inline-block">
                    Selected: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                  </span>
                  <p className="text-[11px] text-neutral-400 mt-2">
                    Click to change file
                  </p>
                </div>
              ) : (
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">
                    Choose file to upload or drag & drop here
                  </span>
                  <span className="text-[11px] text-neutral-500 block mt-1">
                    PDF, JPG, or PNG (DepEd Form scan, max 5MB)
                  </span>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isSimulatingUpload && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-600 font-semibold">
                  <span>Uploading to Registrar Verification Server...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={isSimulatingUpload}
                onClick={() => setUploadingForNotif(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-slate-50 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                disabled={!uploadedFile || isSimulatingUpload}
                onClick={handleConfirmFileUpload}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-40"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSimulatingUpload ? 'Submitting...' : 'Submit Document'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
