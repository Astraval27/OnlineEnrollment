import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
  Mail,
  GraduationCap,
  Sparkles,
  Info,
  CheckCircle2,
  CalendarDays,
  ListFilter,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Student, ScreenId, SchedulePeriod, DaySchedule } from '../../types';
import {
  SECTIONS_SCHEDULE_DATA,
  ENROLLED_SUBJECTS_LIST,
  EnrolledSubjectSummary,
} from '../../data/mockSchedule';

interface StudentClassScheduleScreenProps {
  activeStudent?: Partial<Student>;
  onSelectScreen?: (screen: ScreenId) => void;
}

type ViewMode = 'grid' | 'agenda' | 'directory';
type SemesterMode = 'sem1' | 'sem2';

export const StudentClassScheduleScreen: React.FC<StudentClassScheduleScreenProps> = ({
  activeStudent,
  onSelectScreen,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [semester, setSemester] = useState<SemesterMode>('sem1');
  const [selectedDayId, setSelectedDayId] = useState<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI'>('MON');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<EnrolledSubjectSummary | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<SchedulePeriod | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const studentName = activeStudent?.name || 'Johnny Tabulo';
  const lrn = activeStudent?.lrn || '109283746512';
  const gradeLevel = activeStudent?.gradeLevel || 'Grade 11';
  const section = activeStudent?.section || 'STEM - Newton';
  const activeSectionData = SECTIONS_SCHEDULE_DATA['stem-11-newton'];
  const sectionInfo = activeSectionData.info;
  const currentWeekSchedule: DaySchedule[] = activeSectionData.semesters[semester];

  // Selected Day Schedule
  const activeDaySchedule = useMemo(() => {
    return currentWeekSchedule.find((d) => d.dayId === selectedDayId) || currentWeekSchedule[0];
  }, [currentWeekSchedule, selectedDayId]);

  // Unique time slots for weekly grid header
  const timeSlots = [
    { start: '07:00', end: '07:30', label: '07:00 - 07:30 AM', isCeremony: true },
    { start: '07:30', end: '09:00', label: '07:30 - 09:00 AM' },
    { start: '09:00', end: '09:30', label: '09:00 - 09:30 AM', isBreak: true },
    { start: '09:30', end: '11:00', label: '09:30 - 11:00 AM' },
    { start: '11:00', end: '12:00', label: '11:00 - 12:00 PM' },
    { start: '12:00', end: '01:00', label: '12:00 - 01:00 PM', isLunch: true },
    { start: '01:00', end: '02:30', label: '01:00 - 02:30 PM' },
    { start: '02:30', end: '04:00', label: '02:30 - 04:00 PM' },
  ];

  // Helper to find period in a day by start time
  const findPeriodBySlot = (day: DaySchedule, slotStart: string) => {
    return day.periods.find((p) => p.startTime === slotStart);
  };

  // Filtered Subject directory
  const filteredSubjects = useMemo(() => {
    if (!searchFilter.trim()) return ENROLLED_SUBJECTS_LIST;
    const query = searchFilter.toLowerCase();
    return ENROLLED_SUBJECTS_LIST.filter(
      (s) =>
        s.code.toLowerCase().includes(query) ||
        s.title.toLowerCase().includes(query) ||
        s.instructorName.toLowerCase().includes(query) ||
        s.room.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
    );
  }, [searchFilter]);

  // Handle open details modal from period
  const handleOpenPeriodModal = (period: SchedulePeriod) => {
    if (period.isBreak) return;
    setSelectedPeriod(period);
    // Also find matching full subject info
    const matched = ENROLLED_SUBJECTS_LIST.find((s) => s.code === period.subjectCode);
    if (matched) {
      setSelectedSubject(matched);
    } else {
      setSelectedSubject({
        code: period.subjectCode,
        title: period.subjectTitle,
        category: period.colorTheme.tag,
        weeklyHours: '4.0 Hours / Week',
        scheduleSummary: period.timeLabel,
        units: period.units,
        instructorName: period.instructorName,
        instructorTitle: period.instructorTitle,
        instructorEmail: period.instructorEmail,
        officeHours: period.instructorConsultation,
        room: period.room,
        building: period.building,
        learningCompetencies: [
          'Applies core competency principles aligned with the DepEd K-12 MELCs curriculum guide.',
          'Demonstrates analytical thinking and problem-solving through practical outputs.',
          'Adheres to academic standards and collaborative classroom engagement guidelines.',
        ],
      });
    }
  };

  // Official DepEd Schedule Slip Download
  const handleDownloadScheduleSlip = () => {
    const semLabel = semester === 'sem1' ? '1st Semester (Aug - Dec 2026)' : '2nd Semester (Jan - May 2027)';
    const textSlip = `================================================================================
DEPARTMENT OF EDUCATION • REGION VII
CENTRAL VISAYAS BASIC EDUCATION REGISTRY
OFFICIAL CERTIFICATE OF CLASS SCHEDULE & ENROLMENT (FORM 138-S)
School Year: 2026-2027 • ${semLabel}
================================================================================

LEARNER INFORMATION:
--------------------------------------------------------------------------------
Learner Name     : ${studentName.toUpperCase()}
12-Digit LRN     : ${lrn}
Grade & Section  : ${sectionInfo.sectionName}
Track & Strand   : ${sectionInfo.strandTrack}
Class Adviser    : ${sectionInfo.adviserName} (${sectionInfo.adviserTitle})
Official Homeroom: ${sectionInfo.roomNumber} (${sectionInfo.building})
Date of Issuance : ${new Date().toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}

ENROLLED SUBJECTS & TIME ALLOCATIONS:
--------------------------------------------------------------------------------
${ENROLLED_SUBJECTS_LIST.map(
  (s, idx) =>
    `[${idx + 1}] ${s.code.padEnd(10)} | ${s.title.padEnd(42)} | Units: ${s.units}
    Instructor : ${s.instructorName} (${s.instructorEmail})
    Room/Hall  : ${s.room} • ${s.building}
    Schedule   : ${s.scheduleSummary}
`
).join('\n')}

WEEKLY CONTACT SUMMARY:
--------------------------------------------------------------------------------
Total Academic Units : 26 Units
Total Contact Hours  : 31.0 Hours / Week
Adviser Consultation : Monday 04:00 PM - 05:00 PM (Room 304)

AUTHENTICATION:
Office of the School Registrar • DepEd School ID: 300481
System Barcode ID: DEPED-SCHED-${Date.now().toString(36).toUpperCase()}
Verified under DepEd Order No. 03, s. 2018 Policy on Learner Enrolment.
================================================================================`;

    const blob = new Blob([textSlip], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DEPED_Class_Schedule_${lrn}_${semester}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Official DepEd Class Schedule Slip downloaded successfully.');
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

      {/* TOP DECK: Academic Profile & Official Class Section Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 lg:p-7 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
              Active Official Enrolment
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded bg-neutral-900 text-white">
              {sectionInfo.schoolYear}
            </span>
            <span className="text-[10px] font-bold text-neutral-500">
              • Form 138-S DepEd Registry
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mt-2">
            Class Schedule & Academic Timetable
          </h1>

          <p className="text-neutral-500 text-xs sm:text-sm mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              Learner: <strong className="text-neutral-900">{studentName}</strong>
            </span>
            <span>·</span>
            <span>
              LRN: <strong className="font-mono text-neutral-800">{lrn}</strong>
            </span>
            <span>·</span>
            <span>
              Section: <strong className="text-neutral-900">{sectionInfo.sectionName}</strong>
            </span>
            <span>·</span>
            <span>
              Adviser: <strong className="text-neutral-900">{sectionInfo.adviserName}</strong>
            </span>
          </p>
        </div>

        {/* Action Controls & Official Download */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-3.5 py-2 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-neutral-800 text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs"
            title="Open printable official certificate"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-600" />
            <span>Print View</span>
          </button>

          <button
            onClick={handleDownloadScheduleSlip}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Schedule Slip</span>
          </button>
        </div>
      </div>

      {/* CONTROL BAR: View Mode Segmented Controls, Semester Switcher, & Day Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Segmented View Mode Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all shrink-0 ${
                viewMode === 'grid'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Weekly Timetable Grid</span>
            </button>

            <button
              onClick={() => setViewMode('agenda')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all shrink-0 ${
                viewMode === 'agenda'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Daily Agenda</span>
            </button>

            <button
              onClick={() => setViewMode('directory')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all shrink-0 ${
                viewMode === 'directory'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Enrolled Subjects & Faculty ({ENROLLED_SUBJECTS_LIST.length})</span>
            </button>
          </div>

          {/* Semester Selector & Section Details */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                onClick={() => {
                  setSemester('sem1');
                  showToast('Viewing Semester 1 timetable (Aug - Dec 2026).');
                }}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  semester === 'sem1'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                1st Semester (Active)
              </button>
              <button
                onClick={() => {
                  setSemester('sem2');
                  showToast('Viewing Semester 2 advance curriculum (Jan - May 2027).');
                }}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  semester === 'sem2'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                2nd Semester (Preview)
              </button>
            </div>
          </div>
        </div>

        {/* Informational Sub-Bar: Room, Homeroom Adviser & Summary Stats */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-neutral-600 gap-y-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-500" />
              <span>Homeroom: <strong>{sectionInfo.roomNumber}</strong> ({sectionInfo.building})</span>
            </span>
            <span className="text-neutral-300">|</span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-neutral-500" />
              <span>Adviser: <strong>{sectionInfo.adviserName}</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-neutral-500">
            <span><strong>31</strong> Contact Hours / Week</span>
            <span>•</span>
            <span><strong>8</strong> Enrolled Subjects</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">100% DepEd Compliant</span>
          </div>
        </div>
      </div>

      {/* VIEW 1: WEEKLY TIMETABLE GRID */}
      {viewMode === 'grid' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <span>Weekly Schedule Matrix (Monday to Friday)</span>
                <span className="text-[10px] font-bold text-neutral-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {semester === 'sem1' ? '1st Semester' : '2nd Semester'}
                </span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Click any subject card to view room assignment, competencies, and teacher consultation hours.
              </p>
            </div>

            {/* Subject Tag Legend */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-neutral-600">
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                <span>Core Academic</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
                <span>STEM Specialized</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
                <span>Applied Subject</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                <span>PE & Health</span>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-3.5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider w-36 border-r border-slate-200">
                    Time Period
                  </th>
                  {currentWeekSchedule.map((d) => (
                    <th
                      key={d.dayId}
                      className="py-3 px-3.5 text-xs font-bold text-neutral-800 uppercase tracking-wider text-center border-r last:border-r-0 border-slate-200 w-1/5"
                    >
                      <div className="font-bold">{d.dayName}</div>
                      <div className="text-[10px] font-normal text-neutral-400 capitalize">
                        {d.periods.filter((p) => !p.isBreak).length} Subjects
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {timeSlots.map((slot) => {
                  return (
                    <tr
                      key={slot.start}
                      className={`transition-colors ${
                        slot.isBreak || slot.isLunch ? 'bg-amber-50/20' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      {/* Time slot column */}
                      <td className="py-3 px-3.5 border-r border-slate-200 bg-slate-50/50 align-top">
                        <div className="font-mono text-xs font-semibold text-neutral-800">
                          {slot.start} - {slot.end}
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">
                          {slot.isCeremony
                            ? 'Morning Assembly'
                            : slot.isBreak
                            ? 'Nutrition Break'
                            : slot.isLunch
                            ? 'Noon Break'
                            : 'Academic Period'}
                        </div>
                      </td>

                      {/* Monday through Friday cells */}
                      {currentWeekSchedule.map((day) => {
                        const period = findPeriodBySlot(day, slot.start);
                        if (!period) {
                          return (
                            <td
                              key={day.dayId + slot.start}
                              className="py-2.5 px-3 border-r last:border-r-0 border-slate-200 align-top text-center text-xs text-neutral-300 italic"
                            >
                              —
                            </td>
                          );
                        }

                        if (period.isBreak) {
                          return (
                            <td
                              key={day.dayId + slot.start}
                              className="py-2 px-3 border-r last:border-r-0 border-slate-200 align-middle bg-amber-50/40 text-center"
                            >
                              <div className="text-[11px] font-bold text-amber-900 tracking-wide">
                                ☕ {period.breakLabel || 'Break'}
                              </div>
                              <div className="text-[10px] text-amber-700 font-mono">
                                {period.timeLabel}
                              </div>
                            </td>
                          );
                        }

                        return (
                          <td
                            key={day.dayId + slot.start}
                            className="p-2 border-r last:border-r-0 border-slate-200 align-top"
                          >
                            <div
                              onClick={() => handleOpenPeriodModal(period)}
                              className={`p-2.5 rounded-lg border transition-all hover:shadow-xs cursor-pointer ${period.colorTheme.bg} ${period.colorTheme.border} group`}
                            >
                              <div className="flex items-start justify-between gap-1">
                                <span className="font-mono font-bold text-xs text-neutral-900">
                                  {period.subjectCode}
                                </span>
                                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-white/80 text-neutral-700 border border-black/5">
                                  {period.colorTheme.tag}
                                </span>
                              </div>

                              <div className="text-xs font-semibold text-neutral-900 mt-1 line-clamp-2 leading-tight group-hover:text-emerald-950">
                                {period.subjectTitle}
                              </div>

                              <div className="mt-2 pt-1.5 border-t border-black/5 text-[11px] text-neutral-600 flex flex-col gap-0.5">
                                <span className="flex items-center gap-1 text-neutral-700 font-medium truncate">
                                  <User className="w-3 h-3 text-neutral-400 shrink-0" />
                                  <span className="truncate">{period.instructorName}</span>
                                </span>
                                <span className="flex items-center gap-1 text-neutral-500 truncate">
                                  <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                                  <span className="truncate">{period.room}</span>
                                </span>
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: DAILY AGENDA LIST VIEW */}
      {viewMode === 'agenda' && (
        <div className="space-y-4">
          {/* Day selection tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {currentWeekSchedule.map((d) => {
              const isActive = d.dayId === selectedDayId;
              return (
                <button
                  key={d.dayId}
                  onClick={() => setSelectedDayId(d.dayId)}
                  className={`flex-1 min-w-[120px] p-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-neutral-700 border-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold uppercase tracking-wider opacity-80">
                    {d.dayName}
                  </div>
                  <div className="text-sm font-extrabold mt-0.5">
                    {d.periods.filter((p) => !p.isBreak).length} Classes
                  </div>
                  <div className={`text-[10px] mt-1 ${isActive ? 'text-neutral-300' : 'text-neutral-400'}`}>
                    07:00 AM - 04:00 PM
                  </div>
                </button>
              );
            })}
          </div>

          {/* Agenda Chronological Timeline */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  {activeDaySchedule.dayName} Agenda
                </h3>
                <p className="text-xs text-neutral-500">
                  {activeDaySchedule.periods.filter((p) => !p.isBreak).length} scheduled instructional periods
                </p>
              </div>

              <span className="text-xs font-semibold text-neutral-600 bg-slate-100 px-3 py-1 rounded-full">
                {sectionInfo.sectionName}
              </span>
            </div>

            <div className="space-y-3">
              {activeDaySchedule.periods.map((period, index) => {
                if (period.isBreak) {
                  return (
                    <div
                      key={period.id}
                      className="p-3 rounded-lg bg-amber-50/50 border border-amber-200/60 flex items-center justify-between text-xs text-amber-900"
                    >
                      <div className="flex items-center gap-2 font-semibold">
                        <span>☕</span>
                        <span>{period.subjectTitle}</span>
                      </div>
                      <span className="font-mono text-[11px] text-amber-700 font-bold">
                        {period.timeLabel}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={period.id}
                    onClick={() => handleOpenPeriodModal(period)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Period Time block */}
                      <div className="w-32 shrink-0">
                        <div className="font-mono text-xs font-bold text-neutral-900">
                          {period.startTime} - {period.endTime}
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">
                          Period {index + 1}
                        </div>
                        <span className="mt-1 inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-neutral-700">
                          {period.colorTheme.tag}
                        </span>
                      </div>

                      {/* Subject Information */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-neutral-500">
                            {period.subjectCode}
                          </span>
                          <span className="text-sm font-bold text-neutral-900 group-hover:text-emerald-950">
                            {period.subjectTitle}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600">
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{period.instructorName}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{period.room} ({period.building})</span>
                          </span>
                          <span>•</span>
                          <span className="text-neutral-500">{period.units} Units</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPeriodModal(period);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-neutral-900 hover:text-white text-neutral-700 text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SUBJECT & FACULTY DIRECTORY */}
      {viewMode === 'directory' && (
        <div className="space-y-4">
          {/* Search filter input */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search subject code, title, teacher, room..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="text-xs text-neutral-500">
              Showing <strong>{filteredSubjects.length}</strong> of {ENROLLED_SUBJECTS_LIST.length} Enrolled Curriculum Subjects
            </div>
          </div>

          {/* Subject cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSubjects.map((sub) => (
              <div
                key={sub.code}
                onClick={() => setSelectedSubject(sub)}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-extrabold text-neutral-400 uppercase tracking-wider">
                        {sub.code}
                      </span>
                      <h4 className="text-base font-bold text-neutral-900 group-hover:text-emerald-950 mt-0.5">
                        {sub.title}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-neutral-800 shrink-0">
                      {sub.category}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-neutral-700">
                      <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="font-medium">{sub.scheduleSummary}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-600">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{sub.room} • {sub.building}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {sub.instructorName
                        .split(' ')
                        .filter((w) => !w.startsWith('Mr') && !w.startsWith('Mrs') && !w.startsWith('Dr') && !w.startsWith('Engr') && !w.startsWith('Prof') && !w.startsWith('Coach'))
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2) || 'TC'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-neutral-900 truncate">
                        {sub.instructorName}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate">
                        {sub.instructorEmail}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-neutral-500">
                  <span>Consultation: <strong>{sub.officeHours.split('•')[0]}</strong></span>
                  <span className="text-neutral-900 font-semibold group-hover:underline flex items-center gap-1">
                    <span>View Syllabus</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: SUBJECT & INSTRUCTOR DETAILS */}
      {selectedSubject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-neutral-500 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedSubject.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedSubject.category}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    {selectedSubject.units} Academic Units
                  </span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mt-2">
                  {selectedSubject.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedSubject(null)}
                className="w-8 h-8 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs text-neutral-700">
              {/* Schedule and Classroom Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Weekly Meeting Times
                  </span>
                  <div className="font-semibold text-neutral-900 text-sm">
                    {selectedSubject.scheduleSummary}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {selectedSubject.weeklyHours}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Classroom Assignment
                  </span>
                  <div className="font-semibold text-neutral-900 text-sm">
                    {selectedSubject.room}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {selectedSubject.building}
                  </div>
                </div>
              </div>

              {/* Instructor Information & Consultation */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Subject Faculty & Consultation Hours
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {selectedSubject.instructorName.slice(0, 2)}
                  </div>
                  <div>
                    <h5 className="font-bold text-neutral-900 text-sm">
                      {selectedSubject.instructorName}
                    </h5>
                    <p className="text-neutral-500 text-[11px]">
                      {selectedSubject.instructorTitle}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="flex items-center gap-1.5 text-neutral-600">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-mono">{selectedSubject.instructorEmail}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Office: {selectedSubject.officeHours}</span>
                  </span>
                </div>
              </div>

              {/* Core Learning Competencies (MELCs) */}
              <div className="space-y-2">
                <h5 className="font-bold text-neutral-900 uppercase text-[11px] tracking-wider">
                  DepEd Most Essential Learning Competencies (MELCs):
                </h5>
                <ul className="space-y-2">
                  {selectedSubject.learningCompetencies.map((comp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-neutral-700 leading-relaxed">{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">
                Official syllabus certified by DepEd Bureau of Curriculum Development
              </span>
              <button
                onClick={() => setSelectedSubject(null)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINTABLE OFFICIAL SCHEDULE SLIP */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-neutral-900">
                  Official DepEd Certificate of Matriculation & Class Schedule
                </h3>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="w-8 h-8 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Slip Layout Preview */}
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-neutral-800 space-y-4 leading-relaxed">
              <div className="text-center space-y-0.5 pb-4 border-b border-slate-300">
                <div className="font-bold text-sm tracking-wider">REPUBLIC OF THE PHILIPPINES</div>
                <div className="font-semibold text-xs">DEPARTMENT OF EDUCATION • REGION VII</div>
                <div className="text-[11px] text-neutral-600">CENTRAL VISAYAS BASIC EDUCATION REGISTRY • SCHOOL ID: 300481</div>
                <div className="text-xs font-bold pt-2 uppercase tracking-wide">
                  OFFICIAL ENROLMENT & CLASS SCHEDULE SLIP (FORM 138-S)
                </div>
                <div className="text-[11px] text-neutral-500">
                  School Year 2026-2027 • {semester === 'sem1' ? '1st Semester' : '2nd Semester'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>LEARNER: <strong>{studentName.toUpperCase()}</strong></div>
                <div>LRN: <strong>{lrn}</strong></div>
                <div>GRADE & SECTION: <strong>{sectionInfo.sectionName}</strong></div>
                <div>STRAND: <strong>STEM</strong></div>
                <div>CLASS ADVISER: <strong>{sectionInfo.adviserName}</strong></div>
                <div>HOMEROOM: <strong>{sectionInfo.roomNumber} ({sectionInfo.building})</strong></div>
              </div>

              <div className="pt-2 border-t border-slate-300">
                <div className="font-bold text-[11px] mb-2 uppercase">Official Subject Enrollments:</div>
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="py-1">CODE</th>
                      <th className="py-1">TITLE</th>
                      <th className="py-1">ROOM</th>
                      <th className="py-1">SCHEDULE</th>
                      <th className="py-1 text-right">UNITS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {ENROLLED_SUBJECTS_LIST.map((s) => (
                      <tr key={s.code}>
                        <td className="py-1 font-bold">{s.code}</td>
                        <td className="py-1">{s.title}</td>
                        <td className="py-1">{s.room}</td>
                        <td className="py-1">{s.scheduleSummary}</td>
                        <td className="py-1 text-right font-bold">{s.units}.0</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[10px] text-neutral-500">
                <div>BARCODE: DEPED-RO7-SCHED-{Date.now().toString(36).toUpperCase()}</div>
                <div>REGISTRAR STAMP: VERIFIED & SEALED</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-neutral-500">
                Print or export document for DepEd or school identification requirements.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleDownloadScheduleSlip();
                    setIsPrintModalOpen(false);
                  }}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Slip File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
