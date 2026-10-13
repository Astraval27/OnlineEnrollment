import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { AdmissionGuideSection } from './AdmissionGuideSection';
import { AboutSection } from './AboutSection';
import { ServicesSection } from './ServicesSection';
import { ContactSection } from './ContactSection';
import { LoginModal } from './LoginModal';
import { AdmissionModal } from './AdmissionModal';
import { HomepageAdmissionGate } from './HomepageAdmissionGate';
import {
  GraduationCap,
  ArrowUpRight,
  ArrowRight,
  Home,
  Info,
  Layers,
  FileCheck2,
  PhoneCall,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { UserRole, Student } from '../../types';

interface HomepageProps {
  onEnterPortal: (role: UserRole, initialScreen?: string, applicantData?: Partial<Student>) => void;
  onEnrollmentComplete: (newStudent: Partial<Student>) => void;
}

export type PublicPanel = 'home' | 'about' | 'services' | 'admission' | 'contact';

export const Homepage: React.FC<HomepageProps> = ({
  onEnterPortal,
  onEnrollmentComplete,
}) => {
  const [activeSection, setActiveSection] = useState<PublicPanel>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [admissionPathway, setAdmissionPathway] = useState<'new_student' | 'transferee'>('new_student');

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId as PublicPanel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPathway = (pathway: 'new_student' | 'transferee') => {
    setAdmissionPathway(pathway);
    setIsAdmissionModalOpen(true);
  };

  const handleLoginSuccess = (role: UserRole) => {
    onEnterPortal(role);
  };

  const handleAdmissionComplete = (student: Partial<Student>) => {
    onEnrollmentComplete(student);
    onEnterPortal('student', 'applicant_home', student);
  };

  const panelMeta: Record<PublicPanel, { label: string; icon: React.FC<{ className?: string }>; description: string }> = {
    home: {
      label: 'Home Portal',
      icon: Home,
      description: 'Central admissions launchpad & enrollment overview',
    },
    about: {
      label: 'About Us',
      icon: Info,
      description: 'Institutional K-12 governance, DepEd alignment & role architecture',
    },
    services: {
      label: 'Academic Services',
      icon: Layers,
      description: 'K-12 admissions, SF9 review, section allocation & subsidies',
    },
    admission: {
      label: 'Admission & Steps',
      icon: FileCheck2,
      description: '11-step roadmap, required credentials & LRN checklist',
    },
    contact: {
      label: 'Contact Registrar',
      icon: PhoneCall,
      description: 'Campus address, admissions hotlines & inquiry ticketing',
    },
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white flex flex-col">
      {/* Top Sticky Navigation matching reference screenshot */}
      <Navbar
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenAdmission={() => setIsAdmissionModalOpen(true)}
        onNavigateSection={handleNavigateSection}
        activeSection={activeSection}
      />

      {/* Main Content Area - Separated Panels */}
      <main className="flex-1">
        {/* PANEL 1: HOME */}
        {activeSection === 'home' && (
          <div className="animate-in fade-in duration-200">
            {/* Hero Banner with Picture Switcher */}
            <HeroSection
              onOpenAdmission={() => {
                setAdmissionPathway('new_student');
                setIsAdmissionModalOpen(true);
              }}
              onOpenLogin={() => setIsLoginModalOpen(true)}
              onScrollToSection={handleNavigateSection}
            />

            {/* Public-Facing Admission Gate (Scenario 2: Guest Admission & Account Creation) */}
            <section className="bg-slate-50 border-b border-slate-200 py-6">
              <div className="max-w-7xl mx-auto px-6">
                <HomepageAdmissionGate onSelectPathway={handleSelectPathway} />
              </div>
            </section>

            {/* Quick Panel Directory Hub */}
            <section className="py-16 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-6 space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
                    <span>Modular School Ecosystem</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                    Explore Dedicated Portal Panels
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    Access dedicated panels for school background, basic education services, step-by-step admissions, and direct registrar inquiries.
                  </p>
                </div>

                {/* 4 Interactive Feature Cards to Navigate to Panels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1: About Us Panel */}
                  <div
                    onClick={() => handleNavigateSection('about')}
                    className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-neutral-900 hover:bg-white hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-neutral-900 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors shadow-2xs">
                        <Info className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                        PANEL 1 • GOVERNANCE
                      </span>
                      <h3 className="text-base font-bold text-neutral-900 group-hover:text-neutral-900">
                        About Our School
                      </h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Discover our DepEd-aligned K-12 mission, institutional values, and role-based portal security.
                      </p>
                    </div>
                    <div className="pt-5 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-neutral-900">
                      <span>View About Panel</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 2: Services Panel */}
                  <div
                    onClick={() => handleNavigateSection('services')}
                    className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-neutral-900 hover:bg-white hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-neutral-900 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors shadow-2xs">
                        <Layers className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                        PANEL 2 • ACADEMICS
                      </span>
                      <h3 className="text-base font-bold text-neutral-900 group-hover:text-neutral-900">
                        K-12 Services & Offerings
                      </h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Kindergarten to Senior High School strands (STEM, ABM, HUMSS, TVL), ESC discounts, and LIS sync.
                      </p>
                    </div>
                    <div className="pt-5 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-neutral-900">
                      <span>Explore Services</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 3: Admission Guide Panel */}
                  <div
                    onClick={() => handleNavigateSection('admission')}
                    className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-neutral-900 hover:bg-white hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-neutral-900 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors shadow-2xs">
                        <FileCheck2 className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                        PANEL 3 • ENROLLMENT
                      </span>
                      <h3 className="text-base font-bold text-neutral-900 group-hover:text-neutral-900">
                        11-Step Admission Roadmap
                      </h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Step-by-step guidance on DepEd Form 138 (SF9), PSA requirements, and registrar review checkpoints.
                      </p>
                    </div>
                    <div className="pt-5 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-neutral-900">
                      <span>View Roadmap</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 4: Contact Panel */}
                  <div
                    onClick={() => handleNavigateSection('contact')}
                    className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-neutral-900 hover:bg-white hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-neutral-900 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors shadow-2xs">
                        <PhoneCall className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                        PANEL 4 • HELPDESK
                      </span>
                      <h3 className="text-base font-bold text-neutral-900 group-hover:text-neutral-900">
                        Registrar Office Helpdesk
                      </h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Inquiry ticket submission, on-campus window operating hours, hotlines, and registrar location.
                      </p>
                    </div>
                    <div className="pt-5 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-neutral-900">
                      <span>Contact Helpdesk</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Basic Education Highlights */}
                <div className="p-8 rounded-2xl bg-neutral-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Official DepEd K-12 Accreditation</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white">
                      Enrollment for School Year 2026-2027 is Ongoing
                    </h3>
                    <p className="text-xs text-neutral-400 max-w-xl">
                      Accepting new learners, transferees, and returning students across Kindergarten, Elementary, JHS, and Senior High School.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setIsAdmissionModalOpen(true)}
                      className="px-6 py-3 bg-white text-neutral-900 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors shadow-xs"
                    >
                      Enroll Learner Now
                    </button>
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="px-5 py-3 border border-neutral-700 text-neutral-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                    >
                      Portal Login
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* PANEL 2: ABOUT US */}
        {activeSection === 'about' && (
          <div className="animate-in fade-in duration-200">
            <AboutSection
              onNavigateTab={handleNavigateSection}
              onOpenAdmission={() => setIsAdmissionModalOpen(true)}
            />
          </div>
        )}

        {/* PANEL 3: SERVICES */}
        {activeSection === 'services' && (
          <div className="animate-in fade-in duration-200">
            <ServicesSection
              onOpenAdmission={() => setIsAdmissionModalOpen(true)}
              onOpenLogin={() => setIsLoginModalOpen(true)}
              onNavigateTab={handleNavigateSection}
            />
          </div>
        )}

        {/* PANEL 4: ADMISSION GUIDE & REQUIREMENTS */}
        {activeSection === 'admission' && (
          <div className="animate-in fade-in duration-200">
            <AdmissionGuideSection
              onStartAdmission={() => setIsAdmissionModalOpen(true)}
              onOpenLogin={() => setIsLoginModalOpen(true)}
              onNavigateTab={handleNavigateSection}
            />
          </div>
        )}

        {/* PANEL 5: CONTACT */}
        {activeSection === 'contact' && (
          <div className="animate-in fade-in duration-200">
            <ContactSection
              onNavigateTab={handleNavigateSection}
              onOpenAdmission={() => setIsAdmissionModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white border-t border-neutral-800 py-14">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand */}
            <div className="space-y-4 md:col-span-2">
              <div
                onClick={() => handleNavigateSection('home')}
                className="flex items-center gap-3 cursor-pointer group w-fit"
              >
                <div className="w-9 h-9 rounded-lg bg-white text-neutral-900 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xl tracking-widest text-white">
                  E-ENROLL
                </span>
              </div>
              <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
                Institutional digital admissions, credential verification, and academic registrar portal for K-12 Basic Education. Providing transparent, 11-step paperless learner onboarding.
              </p>
              <div className="text-[11px] text-neutral-500">
                DepEd K-12 Enhanced Basic Education System • Manila, Philippines
              </div>
            </div>

            {/* Col 2: Separate Panels Quick Navigation */}
            <div className="space-y-3 text-xs">
              <span className="font-bold text-neutral-300 uppercase tracking-wider block text-[10px]">
                Separate Panels
              </span>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <button
                    onClick={() => handleNavigateSection('home')}
                    className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                      activeSection === 'home' ? 'text-white font-bold' : ''
                    }`}
                  >
                    <span>Home Panel</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigateSection('about')}
                    className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                      activeSection === 'about' ? 'text-white font-bold' : ''
                    }`}
                  >
                    <span>About Us Panel</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigateSection('services')}
                    className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                      activeSection === 'services' ? 'text-white font-bold' : ''
                    }`}
                  >
                    <span>Services Panel</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigateSection('admission')}
                    className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                      activeSection === 'admission' ? 'text-white font-bold' : ''
                    }`}
                  >
                    <span>Admission Roadmap Panel</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigateSection('contact')}
                    className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                      activeSection === 'contact' ? 'text-white font-bold' : ''
                    }`}
                  >
                    <span>Contact Helpdesk Panel</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Portal Access */}
            <div className="space-y-3 text-xs">
              <span className="font-bold text-neutral-300 uppercase tracking-wider block text-[10px]">
                System Access
              </span>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Already registered or managing institutional rosters?
              </p>
              <button
                id="footer-btn-open-login"
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full py-2.5 px-4 bg-white text-neutral-900 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Portal Log In</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsAdmissionModalOpen(true)}
                className="w-full py-2 px-4 border border-neutral-700 text-neutral-300 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors block text-center"
              >
                Apply for Admission
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
            <p>© 2026 E-ENROLL Academic System. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="hover:text-neutral-300 cursor-pointer">Terms of Enrollment</span>
              <span className="hover:text-neutral-300 cursor-pointer">DepEd LIS Data Privacy</span>
              <span className="hover:text-neutral-300 cursor-pointer">Security Compliance</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenAdmission={() => {
          setIsLoginModalOpen(false);
          setIsAdmissionModalOpen(true);
        }}
      />

      {/* Step-by-Step Admission Wizard Modal */}
      <AdmissionModal
        isOpen={isAdmissionModalOpen}
        onClose={() => setIsAdmissionModalOpen(false)}
        onEnrollmentComplete={handleAdmissionComplete}
        initialPathway={admissionPathway}
      />
    </div>
  );
};
