import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Clock,
  Lock,
  Maximize2,
} from 'lucide-react';
import depedEnrollmentDeskImage from '../../assets/images/deped_enrollment_desk_1791879026220.jpg';
import { PhotoFullscreenModal } from '../modals/PhotoFullscreenModal';

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
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

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
                className="px-6 py-3.5 bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Apply / Enroll Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-btn-login-panel"
                onClick={onOpenLogin}
                className="px-6 py-3.5 bg-white border border-slate-300 text-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center gap-2 shadow-2xs cursor-pointer"
              >
                <span>Access Learner / Faculty Portal</span>
              </button>

              <button
                id="hero-btn-view-steps"
                onClick={() => onScrollToSection('admission')}
                className="text-xs font-bold text-neutral-500 hover:text-neutral-900 underline tracking-wider uppercase ml-1 cursor-pointer"
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

          {/* Right Column (Hero Photo Frame with Fullscreen Button) */}
          <div className="lg:col-span-5">
            <div
              id="hero-display-frame"
              className="relative w-full bg-slate-900 rounded-2xl overflow-hidden shadow-xl flex flex-col group border border-slate-200"
            >
              <div className="relative w-full h-[380px] sm:h-[400px] flex items-center justify-center p-2 bg-neutral-950">
                <img
                  src={depedEnrollmentDeskImage}
                  alt="DepEd E-Enroll Online Registration & Admissions Desk"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
                  onClick={() => setIsFullscreenOpen(true)}
                />

                {/* Top-Right Action: Fullscreen Button Kept */}
                <div className="absolute top-4 right-4 flex items-center">
                  <button
                    id="hero-btn-fullscreen"
                    onClick={() => setIsFullscreenOpen(true)}
                    className="p-2 bg-neutral-900/80 hover:bg-neutral-900 text-white rounded-lg backdrop-blur-xs transition-colors shadow-sm cursor-pointer"
                    title="View Fullscreen"
                    aria-label="View Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Fullscreen Photo Modal */}
      <PhotoFullscreenModal
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        imageSrc={depedEnrollmentDeskImage}
        imageAlt="DepEd E-Enroll Online Registration & Admissions Desk"
        title="DepEd Basic Education E-Enroll Online Registration & Admissions Desk"
      />
    </section>
  );
};
