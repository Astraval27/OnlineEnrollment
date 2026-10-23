import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { Student } from '../../types';
import { DepEdSchoolFormsModal } from '../modals/DepEdSchoolFormsModal';

interface StudentDirectoryProps {
  students: Student[];
  searchQuery: string;
  onAddStudentClick: () => void;
  onSelectStudent?: (student: Student) => void;
}

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({
  students,
  searchQuery,
  onAddStudentClick: _onAddStudentClick,
  onSelectStudent,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('All Academic Levels');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [showDepEdFormsModal, setShowDepEdFormsModal] = useState(false);

  // K-12 Academic Levels
  const departments = [
    'All Academic Levels',
    'Kindergarten',
    'Elementary School',
    'Junior High School',
    'Senior High School',
  ];

  // Statuses
  const statuses = ['All', 'ENROLLED', 'PENDING', 'REVIEWING', 'INCOMPLETE'];

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.lrn && s.lrn.includes(searchQuery)) ||
        s.program.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept =
        selectedDept === 'All Academic Levels' || s.department === selectedDept;

      const matchStatus =
        selectedStatus === 'All' || s.status === selectedStatus;

      return matchSearch && matchDept && matchStatus;
    });
  }, [students, searchQuery, selectedDept, selectedStatus]);

  const toggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Name', 'Email', 'Program', 'Department', 'Status'];
    const rows = filteredStudents.map((s) => [
      s.studentId,
      s.name,
      s.email,
      s.program,
      s.department,
      s.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `students_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'ENROLLED':
        return (
          <span className="inline-block px-3 py-1 bg-neutral-900 text-white rounded text-[11px] font-bold tracking-wider">
            ENROLLED
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-block px-3 py-1 border border-neutral-300 bg-white text-neutral-800 rounded text-[11px] font-bold tracking-wider">
            PENDING
          </span>
        );
      case 'REVIEWING':
        return (
          <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 rounded text-[11px] font-bold tracking-wider border border-slate-200">
            REVIEWING
          </span>
        );
      case 'INCOMPLETE':
        return (
          <span className="inline-block px-3 py-1 bg-neutral-50 text-neutral-400 rounded text-[11px] font-bold tracking-wider border border-slate-200">
            INCOMPLETE
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Filters bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Dept dropdown */}
          <div className="relative">
            <select
              id="filter-department"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-neutral-800 text-xs font-semibold py-2 pl-3.5 pr-8 rounded-lg focus:outline-none focus:border-neutral-900 cursor-pointer shadow-2xs"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status dropdown */}
          <div className="relative">
            <select
              id="filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-neutral-800 text-xs font-semibold py-2 pl-3.5 pr-8 rounded-lg focus:outline-none focus:border-neutral-900 cursor-pointer shadow-2xs"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'Enrollment Status' : s}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* More filters */}
          <button
            id="btn-more-filters"
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-neutral-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
            <span>More Filters</span>
          </button>

          {/* DepEd School Forms & LIS BOSY Export */}
          <button
            onClick={() => setShowDepEdFormsModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 border border-neutral-900 text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>DepEd School Forms (SF1/SF10/LIS)</span>
          </button>
        </div>

        {/* Count */}
        <div className="text-xs text-neutral-500 font-medium">
          Showing <span className="font-bold text-neutral-900">124</span> total students
        </div>
      </div>

      {/* Main Students Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table id="student-directory-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="py-3.5 pl-6 pr-3 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredStudents.length > 0 &&
                      selectedStudentIds.length === filteredStudents.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  LEARNER NAME
                </th>
                <th className="py-3.5 px-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  DEPED LRN / ID
                </th>
                <th className="py-3.5 px-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  GRADE & SECTION
                </th>
                <th className="py-3.5 pr-6 pl-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider text-right">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.map((student) => {
                const isSelected = selectedStudentIds.includes(student.id);
                return (
                  <tr
                    key={student.id}
                    onClick={() => {
                      setViewingStudent(student);
                      onSelectStudent?.(student);
                    }}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      isSelected ? 'bg-neutral-50/60' : ''
                    }`}
                  >
                    <td className="py-4 pl-6 pr-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(student.id)}
                        className="rounded border-slate-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                      />
                    </td>

                    {/* Student Name & Avatar */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-neutral-700 font-bold text-xs shrink-0 overflow-hidden">
                          <svg
                            className="w-7 h-7 text-neutral-600 translate-y-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900 text-sm">
                            {student.name}
                          </div>
                          <div className="text-xs text-neutral-400">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Student ID */}
                    <td className="py-4 px-4 font-mono text-xs font-semibold text-neutral-700">
                      {student.studentId}
                    </td>

                    {/* Program / Dept */}
                    <td className="py-4 px-4">
                      <div className="font-medium text-neutral-900 text-xs">
                        {student.program}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {student.department}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 pr-6 pl-4 text-right">
                      {renderStatusBadge(student.status)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Pagination */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between text-xs">
          <span className="text-neutral-500 font-medium">
            Page {currentPage} of 12
          </span>
          <div className="flex items-center gap-2">
            <button
              id="btn-page-prev"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-200 rounded text-neutral-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold uppercase tracking-wider text-[10px] flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>PREVIOUS</span>
            </button>
            <button
              id="btn-page-next"
              onClick={() => setCurrentPage((p) => Math.min(12, p + 1))}
              disabled={currentPage === 12}
              className="px-4 py-1.5 bg-neutral-900 text-white rounded hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold uppercase tracking-wider text-[10px] flex items-center gap-1"
            >
              <span>NEXT</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Bulk Actions + Export CSV */}
      <div
        id="bulk-actions-bar"
        className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs"
      >
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-neutral-500 uppercase tracking-wider mr-1">
            BULK ACTIONS:
          </span>
          <button
            onClick={() => alert(`Emailing ${selectedStudentIds.length} selected students`)}
            className="text-neutral-800 hover:underline font-medium hover:text-neutral-900"
          >
            Email Selected
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => alert(`Updating status for ${selectedStudentIds.length} students`)}
            className="text-neutral-800 hover:underline font-medium hover:text-neutral-900"
          >
            Update Status
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => alert(`Archiving ${selectedStudentIds.length} students`)}
            className="text-neutral-800 hover:underline font-medium hover:text-neutral-900"
          >
            Move to Archive
          </button>
        </div>

        <button
          id="btn-export-csv"
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-neutral-800 hover:bg-slate-50 transition-colors uppercase tracking-wider shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-neutral-700" />
          <span>EXPORT CSV</span>
        </button>
      </div>

      {/* Student Details Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-neutral-900">Student Profile</h3>
              <button
                onClick={() => setViewingStudent(null)}
                className="text-neutral-400 hover:text-neutral-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-neutral-800 font-bold text-base">
                  {viewingStudent.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-base text-neutral-900">{viewingStudent.name}</h4>
                  <p className="text-xs text-neutral-500">{viewingStudent.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-neutral-400 uppercase font-bold text-[10px] block">DepEd LRN / ID</span>
                  <span className="font-mono font-bold text-neutral-800">{viewingStudent.lrn || viewingStudent.studentId}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-neutral-400 uppercase font-bold text-[10px] block">Status</span>
                  <span className="font-bold text-neutral-800">{viewingStudent.status}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-neutral-400 uppercase font-bold text-[10px] block">Grade & Section</span>
                  <span className="font-semibold text-neutral-800">{viewingStudent.section || viewingStudent.program}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-neutral-400 uppercase font-bold text-[10px] block">Department</span>
                  <span className="font-semibold text-neutral-800">{viewingStudent.department}</span>
                </div>
                {viewingStudent.parentGuardian && (
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 col-span-2">
                    <span className="text-neutral-400 uppercase font-bold text-[10px] block">Parent / Guardian Contact</span>
                    <span className="font-semibold text-neutral-800">{viewingStudent.parentGuardian}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setViewingStudent(null)}
              className="w-full mt-4 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* DepEd School Forms & LIS BOSY Modal */}
      <DepEdSchoolFormsModal
        isOpen={showDepEdFormsModal}
        onClose={() => setShowDepEdFormsModal(false)}
        students={students}
      />
    </div>
  );
};
