# Implementation Plan: Structured Class Schedule Panel for Student Portal

## 1. User Intent & Requirements Alignment
Based on user clarifying responses:
- **Display Modes**: Togglable between a **Weekly Timetable Grid** (visual 5-day time blocks from 7:00 AM to 4:30 PM) and a **Daily Agenda View** (period-by-period breakdown for Monday through Friday with active/next period highlighting).
- **Semesters & Section Flexibility**: Semester switcher (1st Semester vs 2nd Semester, SY 2026-2027) with section/strand preview (Grade 11 - STEM A Newton, with ability to explore ABM / HUMSS / JHS schedules).
- **Interactive Actions**:
  - Download / Print official **DepEd Class Schedule Slip (Form 138-S)** with school header, barcode, adviser endorsement, and room allocations.
  - Faculty Directory & Instructor Consultation modal / panel with office hours, room numbers, and contact channels.

---

## 2. UI/UX Design & Architectural Blueprint

### Aesthetics & Typography (Following `frontend-design` & K-12 DepEd Standards)
- **Palette**: Clean institutional neutral slate canvas (`#F8F9FA` / `#FFFFFF`), deep slate borders (`#E2E8F0`), high-contrast text (`#0F172A`), with semantic badge accents for subject classifications:
  - **Core Academic Subjects** (e.g., General Mathematics, Earth & Life Science, Oral Communication)
  - **Applied / Specialized Subjects** (e.g., Pre-Calculus, Empowerment Technologies)
  - **Physical Education & Health / Homeroom** (e.g., PEH 1, Homeroom Guidance)
- **Zero-Pill Discipline**: Clean tabular figures (`font-mono` / `tabular-nums` for time slots `07:30 - 08:30`), hairline dividers, and functional segmented toggle buttons for Day / View switching.
- **Single-Elevation Depth**: No nested card slop; clear visual hierarchy with timetable columns and time axis.

---

## 3. Proposed Changes & Component Architecture

### A. Core Types & Navigation Wiring
1. **`src/types.ts`**:
   - Add `'student_schedule'` to `ScreenId`.
   - Add interfaces `SchedulePeriod`, `ClassScheduleDay`, `InstructorDetail`.
2. **`src/data/roles.ts`**:
   - Add `'student_schedule'` to `ROLE_CONFIGS.student.allowedScreens`.
3. **`src/components/Sidebar.tsx`**:
   - Add a dedicated navigation button under `activeRole === 'student'` for **"Class Schedule"** with `CalendarDays` icon, maintaining active screen highlight.
4. **`src/App.tsx`**:
   - Mount `<StudentClassScheduleScreen />` when `currentScreen === 'student_schedule'`.

### B. New Screen Component: `src/components/screens/StudentClassScheduleScreen.tsx`
Rich, interactive, self-contained student schedule component:
1. **Header & Context Deck**:
   - Learner identity: Johnny Tabulo (LRN `109283746512`)
   - Grade & Strand: Grade 11 - STEM (Section Newton)
   - Academic Year & Semester selector: `Semester 1 (Aug - Dec 2026)` vs `Semester 2 (Jan - May 2027)`
   - Class Adviser: Engr. Ricardo Dalisay, M.S. • Room 304 (Science Wing Building B)
   - Summary metrics: 31 Contact Hours/Week, 8 Subjects, 5 Core, 3 Specialized
2. **View Mode Toggles (Segmented Control)**:
   - **Weekly Grid View**: Monday to Friday columns with 60–90 min time blocks, clear indicators for Flag Ceremony, Morning Recess, Lunch Break, and Dismissal.
   - **Daily Agenda View**: Day tabs (Mon, Tue, Wed, Thu, Fri) with chronological schedule cards showing time, room, instructor avatar/initials, subject type, and lesson/topic scope.
   - **Subject & Faculty List View**: Comprehensive breakdown of all 8 enrolled subjects with instructor consultation hours and syllabus credits.
3. **Interactive Actions & Modals**:
   - **"Download / Print Schedule Slip"**: Generates official formatted DepEd Certificate of Class Enrolment / Schedule with barcode, registrar stamp, and printable layout.
   - **"Instructor Detail Modal"**: Clicking any teacher or subject reveals room location, office hours, email, and course competencies.
   - **Day Selector & "Today" Quick Filter**: Auto-identifies current period or allows one-click jumping to today's schedule.

### C. Student Dashboard Enhancements (`src/components/screens/ApplicantHome.tsx`)
1. In Card 1 ("Class Section & Adviser"), add a functional button: **"View Full Class Schedule →"** which switches `currentScreen` to `'student_schedule'`.
2. Add a **"Today's Schedule Quick Peek"** widget showing the next upcoming class (e.g. `08:00 AM - 09:30 AM • MATH-11 Pre-Calculus • Rm 304`) with a direct launch button.

---

## 4. Verification & Testing Plan
1. **Compilation Check**: Run `compile_applet` to ensure TypeScript and Vite build succeed cleanly with 0 errors.
2. **Lint Validation**: Run `lint_applet` (`tsc --noEmit`) to verify strict type safety across all updated navigation props.
3. **Functional Testing**:
   - Navigate from Sidebar to "Class Schedule".
   - Switch between Weekly Grid, Daily Agenda, and Faculty views.
   - Toggle between Semester 1 and Semester 2.
   - Test "Download Official Schedule Slip" download action.
   - Click instructor details modal.
   - Test entry button from the student Dashboard ("View Full Class Schedule").
