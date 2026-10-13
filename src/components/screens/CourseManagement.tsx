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
  Edit3,
  Trash2,
  Users,
  School,
  Minus,
  Check,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Course } from '../../types';

interface CourseManagementProps {
  courses: Course[];
  searchQuery: string;
  onAddNewCourse: (newCourse: Partial<Course>) => void;
  onUpdateCourse?: (updatedCourse: Course) => void;
  onDeleteCourse?: (courseId: string) => void;
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
  onOpenAddModal?: () => void;
}

export const CourseManagement: React.FC<CourseManagementProps> = ({
  courses,
  searchQuery,
  onAddNewCourse,
  onUpdateCourse,
  onDeleteCourse,
  isAddModalOpen = false,
  onCloseAddModal,
  onOpenAddModal,
}) => {
  const [activeTab, setActiveTab] = useState<'Active Subjects' | 'Archived' | 'K-12 Curriculum'>('Active Subjects');
  const [selectedSemester, setSelectedSemester] = useState('SY 2026-2027 (Full Year)');
  const [selectedDept, setSelectedDept] = useState('Level: All');

  // Internal modal controls
  const [internalAddModalOpen, setInternalAddModalOpen] = useState(false);
  const showAddModal = isAddModalOpen || internalAddModalOpen;

  const handleCloseAddModal = () => {
    setInternalAddModalOpen(false);
    if (onCloseAddModal) onCloseAddModal();
  };

  const handleOpenAddModal = () => {
    setInternalAddModalOpen(true);
    if (onOpenAddModal) onOpenAddModal();
  };

  // State for editing/managing course
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // New Course Form State
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Senior High School');
  const [newGradeLevel, setNewGradeLevel] = useState('Grade 11 (SHS)');
  const [newInstructor, setNewInstructor] = useState('');
  const [newCapacity, setNewCapacity] = useState<number>(45);
  const [newEnrolled, setNewEnrolled] = useState<number>(0);
  const [newSchedule, setNewSchedule] = useState('MON/WED 08:00 AM - 09:30 AM');
  const [newRoom, setNewRoom] = useState('Room 301 - Building A');
  const [newSemester, setNewSemester] = useState('Semester 1 • SY 2026-2027');

  // Edit Course Form State
  const [editForm, setEditForm] = useState<{
    id: string;
    code: string;
    title: string;
    department: string;
    gradeLevel: string;
    instructor: string;
    capacity: number;
    enrolled: number;
    schedule: string;
    room: string;
    semester: string;
    status: 'ACTIVE' | 'ARCHIVED' | 'FULL';
  } | null>(null);

  // When editingCourse is opened, sync editForm
  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setEditForm({
      id: course.id,
      code: course.code,
      title: course.title,
      department: course.department,
      gradeLevel: course.gradeLevel || 'Grade 11 (SHS)',
      instructor: course.instructor,
      capacity: course.capacity,
      enrolled: course.enrolled,
      schedule: course.schedule,
      room: course.room || 'Room 301',
      semester: course.semester || selectedSemester,
      status: course.status,
    });
  };

  const closeEditModal = () => {
    setEditingCourse(null);
    setEditForm(null);
  };

  // Filter courses based on search, dept, and tabs
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
      if (activeTab === 'K-12 Curriculum') {
        return matchSearch && matchDept;
      }
      return c.status !== 'ARCHIVED' && matchSearch && matchDept;
    });
  }, [courses, searchQuery, selectedDept, activeTab]);

  // Aggregate metrics
  const totalSubjects = courses.length;
  const activeSections = courses.filter((c) => c.status === 'ACTIVE').length;
  const totalEnrolled = courses.reduce((sum, c) => sum + (c.enrolled || 0), 0);
  const totalCapacity = courses.reduce((sum, c) => sum + (c.capacity || 0), 0);
  const capacityRate = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  // Handle Create Course
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newTitle.trim()) return;

    const safeCapacity = Math.max(1, newCapacity || 40);
    const safeEnrolled = Math.min(safeCapacity, Math.max(0, newEnrolled || 0));
    const isFull = safeEnrolled >= safeCapacity;

    const created: Course = {
      id: `c_${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      title: newTitle.trim(),
      department: newDept,
      gradeLevel: newGradeLevel,
      instructor: newInstructor.trim() || 'Assigned Teacher, LPT',
      enrolled: safeEnrolled,
      capacity: safeCapacity,
      schedule: newSchedule.trim() || 'TBA',
      status: isFull ? 'FULL' : 'ACTIVE',
      semester: newSemester,
      room: newRoom.trim() || 'Room TBA',
    };

    onAddNewCourse(created);
    handleCloseAddModal();

    // Reset fields
    setNewCode('');
    setNewTitle('');
    setNewInstructor('');
    setNewCapacity(45);
    setNewEnrolled(0);
    setNewRoom('Room 301 - Building A');
  };

  // Handle Save Edited Course
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm || !onUpdateCourse) return;

    const safeCapacity = Math.max(1, editForm.capacity || 40);
    const safeEnrolled = Math.max(0, editForm.enrolled || 0);
    const autoStatus =
      editForm.status === 'ARCHIVED'
        ? 'ARCHIVED'
        : safeEnrolled >= safeCapacity
        ? 'FULL'
        : 'ACTIVE';

    const updated: Course = {
      id: editForm.id,
      code: editForm.code.trim().toUpperCase(),
      title: editForm.title.trim(),
      department: editForm.department,
      gradeLevel: editForm.gradeLevel,
      instructor: editForm.instructor.trim() || 'Teacher Assigned, LPT',
      enrolled: safeEnrolled,
      capacity: safeCapacity,
      schedule: editForm.schedule.trim() || 'TBA',
      status: autoStatus,
      semester: editForm.semester,
      room: editForm.room,
    };

    onUpdateCourse(updated);
    closeEditModal();
  };

  // Preset schedules
  const schedulePresets = [
    'MON/WED 08:00 AM - 09:30 AM',
    'TUE/THU 10:00 AM - 11:30 AM',
    'MON/WED/FRI 01:00 PM - 02:00 PM',
    'MON-THU 09:30 AM - 10:30 AM',
    'TUE/THU 01:30 PM - 03:00 PM',
    'FRI 08:00 AM - 11:00 AM',
  ];

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

        {/* Right Selectors & Add Button */}
        <div className="flex items-center flex-wrap gap-3">
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

          {/* Quick Add Course Button in Toolbar */}
          <button
            id="btn-toolbar-add-course"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Course</span>
          </button>
        </div>
      </div>

      {/* Grid of Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isFull = course.enrolled >= course.capacity;
          const fillPercentage = Math.min(100, Math.round((course.enrolled / course.capacity) * 100));
          const availableSeats = Math.max(0, course.capacity - course.enrolled);

          return (
            <div
              key={course.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors group"
            >
              <div>
                {/* Header: Course code + Status badge + Manage icon */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-neutral-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {course.code}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-500 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200">
                      {course.gradeLevel || course.department}
                    </span>
                  </div>

                  <button
                    onClick={() => openEditModal(course)}
                    title="Modify Course"
                    className="p-1 text-neutral-400 hover:text-neutral-900 rounded hover:bg-slate-100 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Course Title & Dept */}
                <h3 className="font-bold text-neutral-900 text-base leading-snug">
                  {course.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                  <span>{course.department}</span>
                  {course.room && (
                    <>
                      <span>•</span>
                      <span>{course.room}</span>
                    </>
                  )}
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-2 mt-4 text-xs text-neutral-600 font-medium">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{course.instructor}</span>
                </div>

                {/* Enrollment Capacity Progress */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>ENROLLMENT CAPACITY</span>
                      {isFull ? (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-bold">
                          FULL
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                          {availableSeats} spots left
                        </span>
                      )}
                    </span>
                    <span className="text-neutral-800 font-mono font-bold">
                      {course.enrolled} / {course.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFull
                          ? 'bg-amber-600'
                          : fillPercentage > 85
                          ? 'bg-neutral-800'
                          : 'bg-neutral-900'
                      }`}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom bar: Schedule / Status + Modify/Manage Buttons */}
              <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                {isFull ? (
                  <div className="flex items-center gap-1.5 text-neutral-900 font-bold uppercase tracking-wider text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5 text-neutral-900" />
                    <span>FULL CAPACITY</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-neutral-500 font-medium text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="truncate max-w-[170px]">{course.schedule}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    id={`btn-manage-course-${course.id}`}
                    onClick={() => openEditModal(course)}
                    className="font-bold text-neutral-900 hover:text-neutral-700 flex items-center gap-1 uppercase tracking-wider text-[11px] hover:underline"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Modify</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Create New Section Card */}
        <button
          id="btn-create-section-card"
          onClick={handleOpenAddModal}
          className="min-h-[220px] rounded-xl border-2 border-dashed border-slate-200 hover:border-neutral-900 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col items-center justify-center p-6 text-center group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full border border-slate-300 group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center text-neutral-500 transition-colors mb-3">
            <Plus className="w-5 h-5" />
          </div>
          <span className="font-bold text-xs tracking-wider text-neutral-800 uppercase block">
            CREATE NEW SECTION
          </span>
          <span className="text-xs text-neutral-400 mt-1">
            Add a new subject & set capacity limits
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
            {totalSubjects}
          </span>
        </div>

        <div>
          <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block">
            ACTIVE CLASS SECTIONS
          </span>
          <span className="text-2xl font-bold text-neutral-900 mt-1 block">
            {activeSections}
          </span>
        </div>

        <div>
          <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block">
            ENROLLED LEARNERS
          </span>
          <span className="text-2xl font-bold text-neutral-900 mt-1 block">
            {totalEnrolled} <span className="text-xs text-neutral-400 font-normal">/ {totalCapacity} seats</span>
          </span>
        </div>

        <div>
          <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block">
            DEPED CAPACITY RATE
          </span>
          <span className="text-2xl font-bold text-neutral-900 mt-1 block">
            {capacityRate}%
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD NEW COURSE MODAL (WITH COMPLETE STRUCTURE & CAPACITY MANIPULATION) */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-neutral-900">Add New Course / Subject</h3>
                  <p className="text-xs text-neutral-400">Configure curriculum details and seat quota</p>
                </div>
              </div>
              <button
                onClick={handleCloseAddModal}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 mt-4 text-xs">
              {/* Row 1: Code & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MATH-11"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-semibold focus:outline-none focus:border-neutral-900"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {['MATH-12', 'SCI-10', 'ENG-11', 'TVL-11'].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setNewCode(preset)}
                        className="text-[9px] text-neutral-500 bg-slate-100 hover:bg-slate-200 px-1 py-0.5 rounded font-mono"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                    Learning Area / Subject Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. General Mathematics & Functions"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Row 2: Department & Grade Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                    Department / Level
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewDept(val);
                      if (val === 'Senior High School') setNewGradeLevel('Grade 11 (SHS)');
                      else if (val === 'Junior High School') setNewGradeLevel('Grade 7 (JHS)');
                      else if (val === 'Elementary School') setNewGradeLevel('Grade 1');
                      else setNewGradeLevel('Kindergarten');
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-neutral-900 bg-white"
                  >
                    <option value="Senior High School">Senior High School (G11-12)</option>
                    <option value="Junior High School">Junior High School (G7-10)</option>
                    <option value="Elementary School">Elementary School (G1-6)</option>
                    <option value="Kindergarten">Kindergarten</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                    Grade Level / Strand
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Grade 11 - STEM"
                    value={newGradeLevel}
                    onChange={(e) => setNewGradeLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Row 3: Teacher & Room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                    Assigned Teacher / Instructor
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mr. Jonathan Miller, LPT"
                    value={newInstructor}
                    onChange={(e) => setNewInstructor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                    Classroom / Room
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Room 301 - Building A"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Row 4: Schedule */}
              <div>
                <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                  Schedule Time Slot
                </label>
                <input
                  type="text"
                  placeholder="e.g. MON/WED 08:00 AM - 09:30 AM"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-neutral-900"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {schedulePresets.slice(0, 3).map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setNewSchedule(slot)}
                      className="text-[10px] text-neutral-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* ======================================================= */}
              {/* CAPACITY MANIPULATION BOX (USER REQUIREMENT) */}
              {/* ======================================================= */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-neutral-700" />
                    <span className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
                      Enrollment Capacity Controller
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-neutral-700">
                    Quota: {newCapacity} seats
                  </span>
                </div>

                {/* Capacity manipulation controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">
                      Max Student Capacity
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setNewCapacity((prev) => Math.max(5, prev - 5))}
                        className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-neutral-700"
                        title="Minus 5 seats"
                      >
                        -5
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewCapacity((prev) => Math.max(1, prev - 1))}
                        className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-neutral-700"
                        title="Minus 1 seat"
                      >
                        -1
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={newCapacity}
                        onChange={(e) => setNewCapacity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-16 px-2 py-1 border border-slate-300 rounded text-center text-xs font-bold font-mono bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setNewCapacity((prev) => Math.min(120, prev + 1))}
                        className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-neutral-700"
                        title="Plus 1 seat"
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewCapacity((prev) => Math.min(120, prev + 5))}
                        className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-neutral-700"
                        title="Plus 5 seats"
                      >
                        +5
                      </button>
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="text-[10px] text-neutral-400">Presets:</span>
                      {[30, 35, 40, 45, 50].map((preset) => (
                        <button
                          type="button"
                          key={preset}
                          onClick={() => setNewCapacity(preset)}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            newCapacity === preset
                              ? 'bg-neutral-900 text-white font-bold'
                              : 'bg-white border border-slate-200 text-neutral-600 hover:bg-slate-100'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">
                      Initial Enrolled Learners
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setNewEnrolled((prev) => Math.max(0, prev - 1))}
                        className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-neutral-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        max={newCapacity}
                        value={newEnrolled}
                        onChange={(e) => setNewEnrolled(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className="w-16 px-2 py-1 border border-slate-300 rounded text-center text-xs font-bold font-mono bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setNewEnrolled((prev) => Math.min(newCapacity, prev + 1))}
                        className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-neutral-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewEnrolled(0)}
                        className="text-[10px] px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded font-semibold text-neutral-600"
                      >
                        Reset (0)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Real-time live visual capacity progress bar */}
                <div className="pt-2 border-t border-slate-200/60 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-neutral-500 uppercase">Live Capacity Preview</span>
                    <span className="font-mono text-neutral-800">
                      {newEnrolled} / {newCapacity} seats (
                      {Math.min(100, Math.round((newEnrolled / (newCapacity || 1)) * 100))}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        newEnrolled >= newCapacity ? 'bg-amber-600' : 'bg-neutral-900'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.round((newEnrolled / (newCapacity || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-neutral-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Course Section</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODIFY / EDIT COURSE MODAL (WITH FULL CAPACITY MANIPULATION) */}
      {/* ========================================================================= */}
      {editingCourse && editForm && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-500">{editForm.code}</span>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded font-bold uppercase ${
                        editForm.status === 'FULL'
                          ? 'bg-amber-100 text-amber-800'
                          : editForm.status === 'ARCHIVED'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {editForm.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-neutral-900">{editForm.title}</h3>
                </div>
              </div>
              <button
                onClick={closeEditModal}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4 text-xs">
              {/* Row 1: Code & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    value={editForm.code}
                    onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                    Subject Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Row 2: Department & Grade Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                    Department / Level
                  </label>
                  <select
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-neutral-900 bg-white"
                  >
                    <option value="Senior High School">Senior High School (G11-12)</option>
                    <option value="Junior High School">Junior High School (G7-10)</option>
                    <option value="Elementary School">Elementary School (G1-6)</option>
                    <option value="Kindergarten">Kindergarten</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                    Grade Level
                  </label>
                  <input
                    type="text"
                    value={editForm.gradeLevel}
                    onChange={(e) => setEditForm({ ...editForm, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Row 3: Instructor & Room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                    Instructor
                  </label>
                  <input
                    type="text"
                    value={editForm.instructor}
                    onChange={(e) => setEditForm({ ...editForm, instructor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                    Classroom
                  </label>
                  <input
                    type="text"
                    value={editForm.room}
                    onChange={(e) => setEditForm({ ...editForm, room: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Row 4: Schedule */}
              <div>
                <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] block mb-1">
                  Schedule
                </label>
                <input
                  type="text"
                  value={editForm.schedule}
                  onChange={(e) => setEditForm({ ...editForm, schedule: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-neutral-900"
                />
              </div>

              {/* ================================================================= */}
              {/* CAPACITY MANIPULATION PANEL (DIRECT CONTROLS FOR CAPACITY EDIT) */}
              {/* ================================================================= */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-neutral-800" />
                    <span className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
                      Manipulate Capacity & Enrolled Students
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-neutral-700">
                    {editForm.enrolled} / {editForm.capacity} Seats
                  </span>
                </div>

                {/* Capacity stepper and quick buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Total Capacity Manipulator */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-600 uppercase block">
                      Total Seat Quota
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            capacity: Math.max(1, editForm.capacity - 5),
                          })
                        }
                        className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-neutral-700"
                        title="Minus 5 seats"
                      >
                        -5
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            capacity: Math.max(1, editForm.capacity - 1),
                          })
                        }
                        className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-neutral-700"
                        title="Minus 1 seat"
                      >
                        -1
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={editForm.capacity}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            capacity: Math.max(1, parseInt(e.target.value, 10) || 1),
                          })
                        }
                        className="w-16 px-2 py-1 border border-slate-300 rounded text-center text-xs font-bold font-mono bg-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            capacity: Math.min(120, editForm.capacity + 1),
                          })
                        }
                        className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-neutral-700"
                        title="Plus 1 seat"
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            capacity: Math.min(120, editForm.capacity + 5),
                          })
                        }
                        className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-neutral-700"
                        title="Plus 5 seats"
                      >
                        +5
                      </button>
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] text-neutral-400">Presets:</span>
                      {[30, 35, 40, 45, 50, 60].map((preset) => (
                        <button
                          type="button"
                          key={preset}
                          onClick={() => setEditForm({ ...editForm, capacity: preset })}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            editForm.capacity === preset
                              ? 'bg-neutral-900 text-white font-bold'
                              : 'bg-white border border-slate-200 text-neutral-600 hover:bg-slate-100'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Enrolled Students Manipulator */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-600 uppercase block">
                      Enrolled Learners
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            enrolled: Math.max(0, editForm.enrolled - 1),
                          })
                        }
                        className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-neutral-700 flex items-center gap-0.5"
                        title="Drop 1 student"
                      >
                        <Minus className="w-3 h-3" />
                        <span>1</span>
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={editForm.enrolled}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            enrolled: Math.max(0, parseInt(e.target.value, 10) || 0),
                          })
                        }
                        className="w-16 px-2 py-1 border border-slate-300 rounded text-center text-xs font-bold font-mono bg-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            enrolled: editForm.enrolled + 1,
                          })
                        }
                        className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-neutral-700 flex items-center gap-0.5"
                        title="Enroll 1 student"
                      >
                        <Plus className="w-3 h-3" />
                        <span>1</span>
                      </button>
                    </div>

                    {/* Quick enrollment actions */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            enrolled: editForm.capacity,
                            status: 'FULL',
                          })
                        }
                        className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 hover:bg-amber-50 hover:text-amber-800 rounded font-semibold text-neutral-600"
                      >
                        Mark Full
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            enrolled: 0,
                            status: 'ACTIVE',
                          })
                        }
                        className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 hover:bg-slate-100 rounded font-semibold text-neutral-600"
                      >
                        Reset (0)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            capacity: editForm.capacity + 5,
                          })
                        }
                        className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 hover:bg-slate-100 rounded font-semibold text-neutral-600"
                      >
                        +5 Buffer
                      </button>
                    </div>
                  </div>
                </div>

                {/* Warning if enrolled exceeds capacity */}
                {editForm.enrolled > editForm.capacity && (
                  <div className="p-2 rounded bg-amber-50 border border-amber-200 flex items-center gap-2 text-amber-800 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                    <span>
                      Enrolled learners ({editForm.enrolled}) exceed total capacity ({editForm.capacity}). Consider expanding capacity.
                    </span>
                  </div>
                )}

                {/* Progress bar preview */}
                <div className="pt-2 border-t border-slate-200/60 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-neutral-500 uppercase">Capacity Status</span>
                    <span className="font-mono text-neutral-800">
                      {editForm.enrolled} / {editForm.capacity} (
                      {Math.round((editForm.enrolled / (editForm.capacity || 1)) * 100)}%) •{' '}
                      {editForm.enrolled >= editForm.capacity
                        ? 'FULL'
                        : `${editForm.capacity - editForm.enrolled} spots available`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${
                        editForm.enrolled >= editForm.capacity ? 'bg-amber-600' : 'bg-neutral-900'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((editForm.enrolled / (editForm.capacity || 1)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Status Switcher & Delete Option */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-neutral-600 uppercase">Status:</label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        status: e.target.value as 'ACTIVE' | 'ARCHIVED' | 'FULL',
                      })
                    }
                    className="px-2 py-1 border border-slate-200 rounded text-xs font-semibold bg-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="FULL">FULL CAPACITY</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                {onDeleteCourse && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${editForm.code}?`)) {
                        onDeleteCourse(editForm.id);
                        closeEditModal();
                      }
                    }}
                    className="text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Course</span>
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-neutral-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Apply Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
