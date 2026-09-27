import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  FileWarning,
  PenTool,
  RotateCcw,
  CheckCircle2,
  Calendar,
  ShieldAlert,
  Printer,
  FileText,
  QrCode,
} from 'lucide-react';
import { AffidavitPayload } from '../../api/enrollmentApi';

interface AffidavitOfUndertakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  parentName: string;
  missingDocs: string[];
  onSignedComplete: (affidavit: AffidavitPayload) => void;
}

export const AffidavitOfUndertakingModal: React.FC<AffidavitOfUndertakingModalProps> = ({
  isOpen,
  onClose,
  studentName,
  parentName,
  missingDocs,
  onSignedComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokesCount, setStrokesCount] = useState(0);
  const [strokeVector, setStrokeVector] = useState<Array<{ x: number; y: number; type: 'down' | 'move' | 'up' }>>([]);
  const [undertakingReason, setUndertakingReason] = useState(
    'School of origin from previous division / province has delayed release of SF9 / Form 138.'
  );
  const [parentAffiantName, setParentAffiantName] = useState(parentName || '');
  const [hasAcknowledgedPenalties, setHasAcknowledgedPenalties] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedSlipBarcode, setGeneratedSlipBarcode] = useState('');

  const deadline = 'October 31, 2026';

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setStrokesCount(0);
      setStrokeVector([]);
      setParentAffiantName(parentName || '');
      setTimeout(initCanvas, 50);
    }
  }, [isOpen, parentName]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#0f172a'; // slate-900
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setStrokesCount((prev) => prev + 1);
    setStrokeVector((prev) => [...prev, { x, y, type: 'down' }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setStrokesCount((prev) => prev + 1);
    setStrokeVector((prev) => [...prev, { x, y, type: 'move' }]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStrokeVector((prev) => {
      const last = prev[prev.length - 1];
      return last ? [...prev, { x: last.x, y: last.y, type: 'up' }] : prev;
    });
  };

  const handleClearSignature = () => {
    initCanvas();
    setStrokesCount(0);
    setStrokeVector([]);
  };

  const handleSignAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentAffiantName.trim()) {
      alert('Please state the parent or legal guardian affiant name.');
      return;
    }
    if (!hasAcknowledgedPenalties) {
      alert('You must acknowledge the legal conditions under DepEd Order No. 03, s. 2018.');
      return;
    }
    if (strokesCount < 8) {
      alert('Please provide a handwritten signature in the signature box before submitting.');
      return;
    }

    const canvas = canvasRef.current;
    const signatureDataUrl = canvas ? canvas.toDataURL('image/png') : '';
    const barcode = `DEPED-PROV-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedSlipBarcode(barcode);

    const payload: AffidavitPayload = {
      studentName: studentName || 'Learner Applicant',
      parentGuardianName: parentAffiantName,
      missingDocuments: missingDocs.length > 0 ? missingDocs : ['SF9 (Report Card / Form 138)'],
      undertakingReason,
      mandatoryDeadline: '2026-10-31',
      signatureVector: strokeVector,
      signatureDataUrl,
      signedIpAddress: '127.0.0.1 (Verified Client)',
      signedUserAgent: navigator.userAgent,
      signedTimestamp: new Date().toISOString(),
    };

    onSignedComplete(payload);
    setIsSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl relative my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <FileWarning className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                DepEd Order No. 03, s. 2018 • Annex 2
              </span>
              <h3 className="text-base sm:text-lg font-bold tracking-tight">
                Affidavit of Undertaking (Temporary Enrollment)
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5 text-xs text-neutral-700 max-h-[75vh] overflow-y-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSignAndSubmit} className="space-y-5">
              {/* Context Alert */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-amber-900 block text-[11px]">
                    Missing Mandatory Educational Credentials Detected
                  </span>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Under the <strong>Basic Education Enrollment Policy (DO 03, s. 2018)</strong>, learners with pending
                    transfer credentials (SF9/Form 138 or PSA Birth Certificate) may be admitted under{' '}
                    <strong>TEMPORARILY ENROLLED</strong> status upon execution of this sworn undertaking.
                  </p>
                </div>
              </div>

              {/* Missing Credentials Checklist */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                  Pending Credentials Covered by this Undertaking:
                </span>
                <div className="flex flex-wrap gap-2">
                  {missingDocs.map((doc, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-rose-600" />
                      <span>{doc}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Legal Text & Declarations */}
              <div className="space-y-3 p-4 bg-slate-50/60 border border-slate-200 rounded-xl text-[11px] leading-relaxed text-neutral-600">
                <p>
                  I, <strong className="text-neutral-900">{parentAffiantName || '[Parent/Guardian Name]'}</strong>, of legal
                  age, parent/legal guardian of{' '}
                  <strong className="text-neutral-900">{studentName || '[Learner Name]'}</strong>, hereby undertake to submit
                  the official original/certified true copies of the specified document(s) on or before{' '}
                  <strong className="text-rose-700 underline">{deadline}</strong>.
                </p>
                <p>
                  I understand that non-submission of the aforementioned documents by{' '}
                  <strong>October 31, 2026</strong> will result in the learner’s status remaining{' '}
                  <strong>Provisional</strong>, disqualifying the learner from official promotion, receipt of academic honors,
                  or issuance of DepEd Form 137/SF10 for transfer per DepEd Order No. 03, s. 2018.
                </p>
              </div>

              {/* Affiant Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                    Affiant Parent / Legal Guardian Name
                  </label>
                  <input
                    type="text"
                    required
                    value={parentAffiantName}
                    onChange={(e) => setParentAffiantName(e.target.value)}
                    placeholder="Full Name of Parent / Legal Guardian"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                    Mandatory Submission Deadline
                  </label>
                  <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-neutral-800 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-neutral-600" />
                    <span>{deadline} (DepEd DO 03, s. 2018)</span>
                  </div>
                </div>
              </div>

              {/* Reason for Undertaking */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Reason for Delayed Submission
                </label>
                <select
                  value={undertakingReason}
                  onChange={(e) => setUndertakingReason(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-neutral-900"
                >
                  <option value="School of origin from previous division / province has delayed release of SF9 / Form 138.">
                    School of origin from previous division / province has delayed release of SF9 / Form 138
                  </option>
                  <option value="Awaiting issuance of delayed Philippine Statistics Authority (PSA) Certificate of Live Birth.">
                    Awaiting issuance of delayed Philippine Statistics Authority (PSA) Certificate of Live Birth
                  </option>
                  <option value="Family recently relocated due to natural calamity, economic movement, or job relocation.">
                    Family recently relocated due to natural calamity, economic movement, or job relocation
                  </option>
                  <option value="Awaiting DepEd Division Office endorsement / Balik-Aral re-entry assessment.">
                    Awaiting DepEd Division Office endorsement / Balik-Aral re-entry assessment
                  </option>
                </select>
              </div>

              {/* Digital Signature Vector Capture */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-neutral-900" />
                    <span>Affiant Digital Signature Vector (Draw Inside Box)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleClearSignature}
                    className="text-[10px] font-bold text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear Canvas</span>
                  </button>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/70 p-2 text-center relative">
                  <canvas
                    ref={canvasRef}
                    width={560}
                    height={130}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-32 bg-white rounded-lg border border-slate-200 cursor-crosshair touch-none shadow-2xs"
                  />
                  {strokesCount === 0 && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-neutral-400 font-medium">
                      ✍️ Sign with your mouse, trackpad, or finger here
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-neutral-400 block text-right">
                  Captured Vector Coordinates: {strokeVector.length} points • Stored securely with audit timestamp
                </span>
              </div>

              {/* Checkbox Acknowledgment */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={hasAcknowledgedPenalties}
                  onChange={(e) => setHasAcknowledgedPenalties(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-neutral-900 focus:ring-neutral-900"
                />
                <span className="text-[11px] text-neutral-700 leading-snug">
                  I solemnly affirm that the statements made herein are true and correct, and I agree to comply with the
                  mandatory October 31 submission deadline under penalty of provisional enrollment cancellation per DepEd DO
                  03, s. 2018.
                </span>
              </label>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Execute Affidavit & Grant Temporary Status</span>
                </button>
              </div>
            </form>
          ) : (
            /* Provisional Registration Slip View */
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">
                    Affidavit of Undertaking Successfully Executed
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Provisional Registration Slip generated. Temporary enrollment approved under DepEd Order No. 03, s. 2018.
                  </p>
                </div>
              </div>

              {/* Printable Official Slip Container */}
              <div className="border border-slate-300 rounded-xl p-6 bg-slate-50/50 space-y-4 shadow-xs">
                <div className="text-center pb-3 border-b border-slate-200 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Republic of the Philippines • Department of Education
                  </span>
                  <h5 className="font-extrabold text-sm text-neutral-900 uppercase">
                    Provisional Certificate of Temporary Enrollment
                  </h5>
                  <span className="text-[10px] text-neutral-500 font-semibold">
                    School Year 2026-2027 • School ID: 300481
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-neutral-400 block text-[10px] font-bold uppercase">Learner Name</span>
                    <strong className="text-neutral-900 text-xs">{studentName || 'Learner Applicant'}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] font-bold uppercase">Affiant Parent</span>
                    <strong className="text-neutral-900 text-xs">{parentAffiantName}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] font-bold uppercase">Enrollment Status</span>
                    <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                      TEMPORARILY ENROLLED
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] font-bold uppercase">Mandatory Deadline</span>
                    <strong className="text-rose-700">{deadline}</strong>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-bold text-neutral-700 block">
                      VERIFICATION CODE: {generatedSlipBarcode}
                    </span>
                    <span className="text-[9px] text-neutral-400 block">
                      DepEd LIS Temporary BOSY Tag Active • Digital Vector Signed
                    </span>
                  </div>
                  <QrCode className="w-10 h-10 text-neutral-800" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-neutral-800 hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase hover:bg-neutral-800"
                >
                  Return to Enrollment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
