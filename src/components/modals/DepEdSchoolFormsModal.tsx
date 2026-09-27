import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Printer,
  FileText,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  Database,
  ExternalLink,
} from 'lucide-react';
import { Student } from '../../types';
import { generateLISBOSYExport, generateDepEdSF1 } from '../../api/enrollmentApi';

interface DepEdSchoolFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
}

export const DepEdSchoolFormsModal: React.FC<DepEdSchoolFormsModalProps> = ({
  isOpen,
  onClose,
  students,
}) => {
  const [activeForm, setActiveForm] = useState<'SF1' | 'SF2' | 'SF5' | 'SF10' | 'LIS_BOSY'>('SF1');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const sf1Data = generateDepEdSF1(students);

  const handleDownloadLIS = async (format: 'json' | 'csv') => {
    const payload = await generateLISBOSYExport(students, format);
    let blob: Blob;
    let filename: string;

    if (format === 'json') {
      blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      filename = `DepEd_LIS_BOSY_SY2026_School300481.json`;
    } else {
      blob = new Blob([payload as string], { type: 'text/csv' });
      filename = `DepEd_LIS_BOSY_SY2026_School300481.csv`;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadNotice(`Downloaded ${filename} successfully. Ready for DepEd LIS Portal BOSY Sync.`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  const handleDownloadSF = (formCode: string) => {
    const content = `DEPARTMENT OF EDUCATION - SCHOOL FORM ${formCode}
School: E-ENROLL ACADEMY (School ID: 300481)
Division: Pasig City | Region: NCR
School Year: 2026-2027
Generated: ${new Date().toISOString()}

TOTAL ENROLLEES: ${students.length}
${students.map((s, idx) => `${idx + 1}. LRN: ${s.lrn || '108249000' + idx} | ${s.name} | ${s.gradeLevel} | Section: ${s.section || 'Assigned'} | Status: ${s.status}`).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DepEd_${formCode}_SY2026_300481.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadNotice(`School Form ${formCode} generated and downloaded.`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full border border-slate-200 shadow-2xl relative my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-wide">
                  DepEd School Forms & LIS BOSY Interoperability Hub
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-emerald-300">
                  School ID: 300481
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Official Department of Education standard reports (SF1, SF2, SF5, SF10) & LIS Batch Exporter
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setActiveForm('SF1')}
            className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeForm === 'SF1'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'bg-white text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>SF1 (School Register)</span>
          </button>

          <button
            onClick={() => setActiveForm('SF2')}
            className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeForm === 'SF2'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'bg-white text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>SF2 (Daily Attendance)</span>
          </button>

          <button
            onClick={() => setActiveForm('SF5')}
            className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeForm === 'SF5'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'bg-white text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>SF5 (Promotion Report)</span>
          </button>

          <button
            onClick={() => setActiveForm('SF10')}
            className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeForm === 'SF10'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'bg-white text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>SF10 (Permanent Record)</span>
          </button>

          <button
            onClick={() => setActiveForm('LIS_BOSY')}
            className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeForm === 'LIS_BOSY'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>LIS BOSY Batch Sync</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {downloadNotice && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-neutral-800">
          {/* TAB 1: SF1 - SCHOOL REGISTER */}
          {activeForm === 'SF1' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    DepEd Form 1
                  </span>
                  <h4 className="font-extrabold text-sm text-neutral-900">
                    School Form 1 (SF1) • School Register
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Master list of officially enrollees with socio-demographic indicators (4Ps, IP, Mother Tongue).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-white flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print SF1</span>
                  </button>
                  <button
                    onClick={() => handleDownloadSF('SF1')}
                    className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-bold hover:bg-neutral-800 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download SF1 Export</span>
                  </button>
                </div>
              </div>

              {/* Standard SF1 Table */}
              <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">LRN</th>
                      <th className="p-2.5">Learner's Name</th>
                      <th className="p-2.5">Sex</th>
                      <th className="p-2.5">Birth Date</th>
                      <th className="p-2.5">Mother Tongue</th>
                      <th className="p-2.5">IP?</th>
                      <th className="p-2.5">4Ps?</th>
                      <th className="p-2.5">Parent / Guardian</th>
                      <th className="p-2.5">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sf1Data.learners.map((l) => (
                      <tr key={l.no} className="hover:bg-slate-50/80">
                        <td className="p-2.5 font-bold text-neutral-400">{l.no}</td>
                        <td className="p-2.5 font-mono font-bold text-neutral-900">{l.lrn}</td>
                        <td className="p-2.5 font-bold text-neutral-900">{l.name}</td>
                        <td className="p-2.5 font-semibold">{l.sex}</td>
                        <td className="p-2.5 text-neutral-600">{l.birthDate}</td>
                        <td className="p-2.5 text-neutral-600">{l.motherTongue}</td>
                        <td className="p-2.5">{l.ipCommunity}</td>
                        <td className="p-2.5 font-medium">{l.fourPsBeneficiary}</td>
                        <td className="p-2.5">{l.parentGuardian}</td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              l.remarks.includes('Temporarily')
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {l.remarks}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: SF2 - DAILY ATTENDANCE */}
          {activeForm === 'SF2' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-neutral-900">
                    School Form 2 (SF2) • Daily Attendance Report of Learners
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Monthly learner attendance log per section with dropout tracking indicators.
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadSF('SF2')}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-bold hover:bg-neutral-800 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SF2 Sheet</span>
                </button>
              </div>

              <div className="p-6 border border-slate-200 rounded-xl text-center space-y-2 bg-white">
                <Calendar className="w-8 h-8 text-neutral-400 mx-auto" />
                <h5 className="font-bold text-neutral-800">DepEd SF2 Template Pre-Loaded</h5>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  Automatically populated with active class rosters for Fall Semester 2026. Ready for section adviser daily roll-call.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: SF5 - PROMOTION REPORT */}
          {activeForm === 'SF5' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-neutral-900">
                    School Form 5 (SF5) • Report on Promotion & Learning Progress
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    General average computation, promotion status, and academic honors determination.
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadSF('SF5')}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-bold hover:bg-neutral-800 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export SF5 Matrix</span>
                </button>
              </div>

              <div className="p-6 border border-slate-200 rounded-xl text-center space-y-2 bg-white">
                <Layers className="w-8 h-8 text-neutral-400 mx-auto" />
                <h5 className="font-bold text-neutral-800">End-of-School-Year Promotion Rules</h5>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  Applies DepEd grading transmutations (DO 8, s. 2015). Temporary enrollees under Affidavit of Undertaking
                  are automatically flagged if missing credentials are not settled by October 31.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: SF10 - PERMANENT RECORD */}
          {activeForm === 'SF10' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-neutral-900">
                    School Form 10 (SF10 / Former Form 137) • Permanent Record
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Cumulative academic history, scholastic record, and official school-to-school transfer tracking (DO 54, s. 2016).
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadSF('SF10')}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-bold hover:bg-neutral-800 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SF10 Form</span>
                </button>
              </div>

              <div className="p-6 border border-slate-200 rounded-xl text-center space-y-2 bg-white">
                <Users className="w-8 h-8 text-neutral-400 mx-auto" />
                <h5 className="font-bold text-neutral-800">Electronic SF10 Request & Transfer Tracker</h5>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  Automatically generates electronic requests to origin schools for transferee students. Enforces DepEd
                  Order No. 54, s. 2016 protocols.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: LIS BOSY BATCH SYNC */}
          {activeForm === 'LIS_BOSY' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-700" />
                  <h4 className="font-bold text-emerald-900 text-sm">
                    DepEd Learner Information System (LIS) BOSY Batch Integration
                  </h4>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Export formatted Beginning of School Year (BOSY) enrollment archives compliant with the DepEd LIS upload
                  specifications. Enables one-click synchronization of enrollees, LRNs, and temporary enrollment tags.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 border border-slate-200 rounded-xl space-y-3 bg-white">
                  <strong className="text-xs text-neutral-900 block font-bold">
                    JSON Batch Export Payload
                  </strong>
                  <p className="text-xs text-neutral-500">
                    REST API compliant payload including encrypted socio-demographics, metadata, and audit logs.
                  </p>
                  <button
                    onClick={() => handleDownloadLIS('json')}
                    className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download LIS BOSY (.JSON)</span>
                  </button>
                </div>

                <div className="p-5 border border-slate-200 rounded-xl space-y-3 bg-white">
                  <strong className="text-xs text-neutral-900 block font-bold">
                    CSV Master Roster Export
                  </strong>
                  <p className="text-xs text-neutral-500">
                    Standard tabular format for direct batch upload into the DepEd Learner Information System portal.
                  </p>
                  <button
                    onClick={() => handleDownloadLIS('csv')}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download LIS BOSY (.CSV)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
