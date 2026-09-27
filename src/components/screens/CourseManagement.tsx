import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  User,
  Clock,
  AlertCircle,
  Plus,
  MoreHorizontal,
  X,
  CheckCircle2,
} from 'lucide-react';
import { Course } from '../../types';

interface CourseManagementProps {
  courses: Course[];
  searchQuery: string;
  onAddNewCourse: (newCourse: Partial<Course>) => void;
}

export const CourseManagement: React.FC<CourseManagementProps> = ({
  courses,
  searchQuery,
  onAddNewCourse,
}) => {
  const [activeTab, setActiveTab] = useState<'Active Subjects' | 'Archived' | 'K-12 Curriculum'>('Active Subjects');
  const [selectedSemester, setSelectedSemester] = useState('SY 2026-2027 (Full Year)');
  const [selectedDept, setSelectedDept] = useState('Level: All');
  const [managingCourse, setManagingCourse] = useState<Course | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New section form state
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Senior High School');
  const [newInstructor, setNewInstructor] = useState('');
  const [newCapacity, setNewCapacity] = useState('45');
  const [newSchedule, setNewSchedule] = useState('MON-THU 08:00 AM - 09:30 AM');

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        searchQuery === '' ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept =
        selectedDept === 'Level: All' ||
        c.department.toLowerCase().includes(selectedDept.replace('Level: ', '').toLowerCase());

      if (activeTab === 'Archived') {
        return c.status === 'ARCHIVED' && matchSearch;
      }
      return matchSearch && matchDept;
    });
  }, [courses, searchQuery, selectedDept, activeTab]);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newTitle) return;

    onAddNewCourse({
      id: `c_${Date.now()}`,
      code: newCode,
      title: newTitle,
      department: newDept,
      gradeLevel: newDept === 'Senior High School' ? 'Grade 11 (SHS)' : 'Grade Level',
      instructor: newInstructor || 'Assigned Teacher, LPT',
      enrolled: 0,
      capacity: parseInt(newCapacity, 10) || 45,
      schedule: newSchedule,
      status: 'ACTIVE',
      semester: selectedSemester,
    });

    setShowAddModal(false);
    setNewCode('');
    setNewTitle('');
    setNewInstructor('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Filter and Tab Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        {/* Left Tabs */}
        <div className="flex items-center gap-6 text-sm">
          {(['Active Subjects', 'Archived', 'K-12 Curriculum'] as const).map((tab) => (
            <button
              key={tab}
              id={`tab-course-${tab.toLowerCase().replace(' ', '-')}`}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-bold tracking-tight transition-colors border-b-2 -mb-[10px] ${
                activeTab === tab
                  ? 'text-neutral-900 border-neutral-900'
                  : 'text-neutral-400 border-transparent hover:text-neutral-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right Selectors */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-neutral-800 text-xs font-semibold py-2 pl-3.5 pr-8 rounded-lg focus:outline-none focus:border-neutral-900 cursor-pointer shadow-2xs"
            >
              <option value="SY 2026-2027 (Full Year)">SY 2026-2027 (Full Year)</option>
              <option value="Semester 1 • SY 2026-2027">Semester 1 • SY 2026-2027 (SHS)</option>
              <option value="Semester 2 • SY 2026-2027">Semester 2 • SY 2026-2027 (SHS)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-neutral-800 text-xs font-semibold py-2 pl-3.5 pr-8 rounded-lg focus:outline-none focus:border-neutral-900 cursor-pointer shadow-2xs"
            >
              <option value="Level: All">Academic Level: All</option>
              <option value="Senior High School">Senior High School (G11-12)</option>
              <option value="Junior High School">Junior High School (G7-10)</option>
              <option value="Elementary School">Elementary School (G1-6)</option>
              <option value="Kindergarten">Kindergarten</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid of Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isFull = course.enrolled >= course.capacity;
          const fillPercentage = Math.min(100, Math.round((course.enrolled / course.capacity) * 100));

          return (
            <div
              key={course.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                {/* Header: Course code + 3 dots */}
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono font-semibold mb-2">
                  <span>{course.code}</span>
                  <button
                    onClick={() => setManagingCourse(course)}
                    className="p-1 hover:text-neutral-900 rounded hover:bg-slate-100"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Course Title & Dept */}
                <h3 className="font-bold text-neutral-900 text-base leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {course.department}
                </p>

                {/* Instructor */}
                <div className="flex items-center gap-2 mt-4 text-xs text-neutral-600 font-medium">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{course.instructor}</span>
                </div>

                {/* Enrollment Capacity Progress */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-neutral-400 uppercase tracking-wider">
                      ENROLLMENT CAPACITY
                    </span>
                    <span className="text-neutral-800 font-mono">
                      {course.enrolled} / {course.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isFull ? 'bg-neutral-900' : 'bg-neutral-800'
                      }`}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom bar: Schedule / Status + Manage */}
              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                {isFull ? (
                  <div className="flex items-center gap-1.5 text-neutral-900 font-bold uppercase tracking-wider text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5 text-neutral-900" />
                    <span>FULL CAPACITY</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-neutral-500 font-medium text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{course.schedule}</span>
                  </div>
                )}

                <button
                  id={`btn-manage-course-${course.id}`}
                  onClick={() => setManagingCourse(course)}
                  className="font-bold text-neutral-900 hover:underline uppercase tracking-wider text-[11px]"
                >
                  Manage
                </button>
              </div>
            </div>
          );
        })}

        {/* Create New Section Card */}
        <button
          id="btn-create-section-card"
          onClick={() => setShowAddModal(true)}
          className="min-h-[220px] rounded-xl border-2 border-dashed border-slate-200 hover:border-neutral-900 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col items-center justify-center p-6 text-center group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full border border-slate-300 group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center text-neutral-500 transition-colors mb-3">
            <Plus className="w-5 h-5" />
          </div>
          <span className="font-bold text-xs tracking-wider text-neutral-800 uppercase block">
            CREATE NEW SECTION
          </span>
          <span className="text-xs text-neutral-400 mt-1">
            Add a new schedule for 2026 Fall
          </span>
        </button>
      </div>

      {/* Bottom KPI Metrics Bar */}
      <div
        id="course-management-metrics"
        className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        <div>
          <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block">
            TOTAL K-12 SUBJECTS
          </span>
          <span className="text-2xl font-bold text-neutral-900 mt-1 block">
            36
          </span>
        </div>

        <div>
          <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block">
            ACTIVE CLASS SECTIONS
          </span>
          <span className="text-2xl font-bold text-neutral-900 mt-1 block">
            28
          </span>
        </div>

        <div>
          <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block">
            ENROLLED LEARNERS
          </span>
          <span className="text-2xl font-bold text-neutral-900 mt-1 block">
            840
          </span>
        </div>

        <div>
          <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block">
            DEPED CAPACITY RATE
          </span>
          <span className="text-2xl font-bold text-neutral-900 mt-1 block">
            91%
          </span>
        </div>
      </div>

      {/* Create Course / Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-neutral-900">Add K-12 Subject / Class Section</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-700 font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3 mt-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                  Subject Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. SCI-10 or MATH-11"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                  Subject / Learning Area Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Earth & Life Science / General Mathematics"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                  Academic Level / Department
                </label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Senior High School">Senior High School (G11-12)</option>
                  <option value="Junior High School">Junior High School (G7-10)</option>
                  <option value="Elementary School">Elementary School (G1-6)</option>
                  <option value="Kindergarten">Kindergarten</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                    Subject Teacher
                  </label>
                  <input
                    type="text"
                    placeholder="Teacher Name, LPT"
                    value={newInstructor}
                    onChange={(e) => setNewInstructor(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                  Schedule
                </label>
                <input
                  type="text"
                  placeholder="e.g. TUE/THU 10:00 AM"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-neutral-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-semibold"
                >
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Course Modal */}
      {managingCourse && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs text-neutral-500 font-bold">{managingCourse.code}</span>
                <h3 className="font-bold text-base text-neutral-900">{managingCourse.title}</h3>
              </div>
              <button
                onClick={() => setManagingCourse(null)}
                className="text-neutral-400 hover:text-neutral-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <p className="font-bold text-neutral-800">Enrollment Status</p>
                <p className="text-neutral-600 mt-1">
                  Currently {managingCourse.enrolled} students enrolled out of {managingCourse.capacity} max seats.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    alert('Course schedule updated');
                    setManagingCourse(null);
                  }}
                  className="flex-1 py-2 bg-neutral-900 text-white rounded text-xs font-bold uppercase tracking-wider"
                >
                  Modify Schedule
                </button>
                <button
                  onClick={() => {
                    alert('Class roster exported');
                    setManagingCourse(null);
                  }}
                  className="flex-1 py-2 border border-slate-300 text-neutral-800 rounded text-xs font-bold uppercase tracking-wider"
                >
                  View Roster
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
