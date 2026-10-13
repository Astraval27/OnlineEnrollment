import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Clock,
  Lock,
  Maximize2,
  FileText,
  ShieldCheck,
  Camera,
} from 'lucide-react';
import depedEnrollmentDeskImage from '../../assets/images/deped_enrollment_desk_1791879026220.jpg';
import systemOverviewImage from '../../assets/images/system_overview_1789936634754.jpg';
import systemShowcaseImage from '../../assets/images/system_showcase_capture_1789941510863.jpg';
import { SystemCaptureModal } from '../modals/SystemCaptureModal';

interface HeroSectionProps {
  onOpenAdmission: () => void;
  onOpenLogin: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenAdmission,
  onOpenLogin,
  onScrollToSection,
}) => {
  // View mode defaults to 'display' showing the DepEd admissions desk photo on the frame
  const [viewMode, setViewMode] = useState<'display' | 'card' | 'system'>('display');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="home" className="pt-12 pb-20 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (Text & CTAs) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-neutral-800">
              <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
              <span>SY 2026-2027 K-12 Basic Education Enrollment Now Open</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.15]">
              Streamlined K-12 Basic Education Enrollment.
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
              Experience a modern, DepEd-aligned enrollment system for Kindergarten, Elementary,
              Junior High, and Senior High School. Register your 12-digit LRN, upload Form 138 (SF9),
              apply for ESC / SHS vouchers, and verify section assignments seamlessly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-btn-start-admission"
                onClick={onOpenAdmission}
                className="px-6 py-3.5 bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Apply / Enroll Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-btn-login-panel"
                onClick={onOpenLogin}
                className="px-6 py-3.5 bg-white border border-slate-300 text-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center gap-2 shadow-2xs"
              >
                <span>Access Learner / Faculty Portal</span>
              </button>

              <button
                id="hero-btn-view-steps"
                onClick={() => onScrollToSection('admission')}
                className="text-xs font-bold text-neutral-500 hover:text-neutral-900 underline tracking-wider uppercase ml-1"
              >
                View Requirements
              </button>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-xs">
              <div className="flex items-center gap-2 text-neutral-600">
                <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0" />
                <span className="font-medium">100% Digital Document Upload</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Lock className="w-4 h-4 text-neutral-900 shrink-0" />
                <span className="font-medium">End-to-End Encrypted Records</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Clock className="w-4 h-4 text-neutral-900 shrink-0" />
                <span className="font-medium">Real-Time Step Verification</span>
              </div>
            </div>
          </div>

          {/* Right Column (Hero Visual Frame with View Mode Switcher) */}
          <div className="lg:col-span-5 space-y-3">
            {/* View Selector Tabs */}
            <div className="flex items-center justify-between px-1">
              <div className="inline-flex p-1 bg-slate-200/80 rounded-xl text-xs font-semibold text-neutral-600">
                <button
                  id="tab-display"
                  onClick={() => setViewMode('display')}
                  className={`px-3 py-1.5 rounded-lg transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 ${
                    viewMode === 'display'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                  title="Interactive System Display"
                >
                  <img
                    src={systemShowcaseImage}
                    alt="Display Icon"
                    className="w-4 h-4 rounded-full object-cover border border-slate-300 shadow-2xs shrink-0"
                  />
                  <span>DISPLAY</span>
                </button>
                <button
                  id="tab-original-card"
                  onClick={() => setViewMode('card')}
                  className={`px-3 py-1.5 rounded-lg transition-all text-[11px] font-bold uppercase tracking-wider ${
                    viewMode === 'card'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Original Card
                </button>
                <button
                  id="tab-system-picture"
                  onClick={() => setViewMode('system')}
                  className={`px-3 py-1.5 rounded-lg transition-all text-[11px] font-bold uppercase tracking-wider ${
                    viewMode === 'system'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  System Picture
                </button>
              </div>
            </div>

            {/* VIEW 1: DISPLAY PHOTO FRAME (DEPED ENROLLMENT DESK PHOTO) */}
            {viewMode === 'display' && (
              <div
                id="hero-display-frame"
                className="relative w-full min-h-[420px] bg-slate-900 rounded-2xl overflow-hidden shadow-xl flex flex-col group border border-slate-200"
              >
                <div className="relative w-full h-[375px] sm:h-[390px] flex items-center justify-center p-2 bg-neutral-950">
                  <img
                    src={depedEnrollmentDeskImage}
                    alt="DepEd E-Enroll Online Registration & Admissions Desk"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-xl cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
                    onClick={() => setIsModalOpen(true)}
                  />

                  {/* Top-Right Quick Action: Fullscreen Only */}
                  <div className="absolute top-4 right-4 flex items-center">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="p-1.5 bg-neutral-900/80 hover:bg-neutral-900 text-white rounded-lg backdrop-blur-xs transition-colors shadow-sm"
                      title="View Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bottom-left badge with SECOND PHOTO replacing the icon */}
                  <div className="absolute bottom-3 left-3 bg-neutral-900/90 text-white backdrop-blur-xs py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-neutral-700 flex items-center gap-2 shadow-sm">
                    <img
                      src={systemShowcaseImage}
                      alt="System Icon"
                      className="w-4 h-4 rounded-full object-cover border border-emerald-400 shrink-0"
                    />
                    <span className="text-neutral-100 font-semibold">DepEd Admissions Desk • 1376 × 768 px (16:9)</span>
                  </div>
                </div>

                {/* Sub-bar below image */}
                <div className="px-4 py-2.5 bg-neutral-900 text-white flex items-center justify-between text-xs border-t border-neutral-800">
                  <div className="flex items-center gap-2">
                    <img
                      src={systemShowcaseImage}
                      alt="Thumbnail icon"
                      className="w-4 h-4 rounded-full object-cover border border-slate-500"
                    />
                    <span className="font-semibold text-neutral-200 text-[11px] sm:text-xs">
                      DepEd Basic Education E-Enroll Online Registration & Admissions Desk
                    </span>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-[10px] uppercase font-bold text-neutral-400 hover:text-white transition-colors"
                  >
                    Click to enlarge →
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 2: ORIGINAL APPLICANT CARD (Johnny Tabulo) */}
            {viewMode === 'card' && (
              <div
                id="hero-applicant-card"
                className="relative bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5"
              >
                {/* Top Card Preview Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-sm text-neutral-800">
                      JT
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">Johnny Tabulo</h4>
                      <span className="text-[11px] text-neutral-400">Applicant • B.A. Communication</span>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded border border-neutral-300 text-[10px] font-bold uppercase tracking-wider text-neutral-800">
                    Step 5 of 11
                  </div>
                </div>

                {/* Progress Bar Snippet */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-neutral-400 mb-2">
                    <span>ENROLLMENT ROADMAP</span>
                    <span className="text-neutral-900">45% COMPLETED</span>
                  </div>
                  <div className="grid grid-cols-11 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((step) => (
                      <div
                        key={step}
                        className={`h-2 rounded-full ${
                          step <= 5 ? 'bg-neutral-900' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Active Verification Item */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                      <FileText className="w-4 h-4 text-neutral-700" />
                      <span>Academic Transcript</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase bg-neutral-900 text-white px-2 py-0.5 rounded">
                      Active Task
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Certified Copy of High School Form 138 or Collegiate Transfer Credentials.
                  </p>
                </div>

                {/* Security Pill Card */}
                <div className="flex items-center gap-3 p-3 bg-neutral-900 text-white rounded-xl text-xs">
                  <ShieldCheck className="w-5 h-5 text-neutral-300 shrink-0" />
                  <div className="text-[11px] leading-tight">
                    <span className="font-bold block text-white">Encrypted Admissions Portal</span>
                    <span className="text-neutral-400">Optimized for smartphones, tablets & desktops</span>
                  </div>
                </div>

                {/* Quick Login Shortcut */}
                <button
                  onClick={onOpenLogin}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-neutral-800 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-center block"
                >
                  Log In to Continue Application →
                </button>
              </div>
            )}

            {/* VIEW 3: SYSTEM ARCHITECTURE PICTURE */}
            {viewMode === 'system' && (
              <div
                id="hero-system-picture-card"
                className="relative w-full min-h-[420px] bg-slate-900 rounded-2xl overflow-hidden shadow-xl flex flex-col group border border-slate-800"
              >
                <div className="relative w-full h-[370px] flex items-center justify-center p-2 bg-neutral-950">
                  <img
                    src={systemShowcaseImage}
                    alt="E-ENROLL Whole System Capture"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-xl cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
                    onClick={() => setIsModalOpen(true)}
                  />
                  <div className="absolute top-4 right-4 flex items-center">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="p-1.5 bg-neutral-900/80 hover:bg-neutral-900 text-white rounded-lg backdrop-blur-xs transition-colors shadow-sm"
                      title="View Full Resolution & Live Snapshot"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-neutral-900/85 text-white backdrop-blur-xs py-1 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-neutral-700 flex items-center gap-1.5">
                    <Camera className="w-3 h-3 text-emerald-400" />
                    <span>Whole System Captured</span>
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-neutral-900 text-white flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-200">E-ENROLL Whole System Multi-View Capture</span>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-[10px] uppercase font-bold text-neutral-400 hover:text-white transition-colors"
                  >
                    Click to expand & snap →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen High-Resolution Picture & System Snapshot Modal */}
      <SystemCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetElementId="home"
        currentScreenName="E-ENROLL System Home"
      />
    </section>
  );
};
