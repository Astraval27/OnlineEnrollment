import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';
import { ROLE_CONFIGS } from '../../data/roles';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole) => void;
  onOpenAdmission?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenAdmission,
}) => {
  const [activeTab, setActiveTab] = useState<'student' | 'registrar' | 'admin'>('student');
  const [emailOrId, setEmailOrId] = useState(ROLE_CONFIGS.student.email);
  const [password, setPassword] = useState('••••••••••••');
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const handleTabChange = (role: 'student' | 'registrar' | 'admin') => {
    setActiveTab(role);
    setEmailOrId(ROLE_CONFIGS[role].email);
    setForgotSent(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(activeTab);
    onClose();
  };

  const handleGoogleSignIn = () => {
    onLoginSuccess(activeTab);
    onClose();
  };

  const handleForgotClick = () => {
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      {/* Modal Container: Clean, modern, minimal with light mode and soft drop shadow */}
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 border border-slate-200/90 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close login modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
            Welcome to
          </span>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            E-ENROLL Portal
          </h2>
          <p className="text-xs text-neutral-500">
            Sign in to access your learner records, admissions, or administrative tools.
          </p>
        </div>

        {/* Subtle Role Selector Toggle with Three Tabs: 'Learner', 'Registrar', and 'Principal' */}
        <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1 border border-slate-200/60">
          <button
            type="button"
            onClick={() => handleTabChange('student')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center ${
              activeTab === 'student'
                ? 'bg-white text-neutral-900 shadow-xs font-bold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Learner
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('registrar')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center ${
              activeTab === 'registrar'
                ? 'bg-white text-neutral-900 shadow-xs font-bold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Registrar
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center ${
              activeTab === 'admin'
                ? 'bg-white text-neutral-900 shadow-xs font-bold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Principal
          </button>
        </div>

        {/* Forgot Password Inline Feedback (replaces window.alert) */}
        {forgotSent && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs text-neutral-700 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Password recovery link sent to <strong>{emailOrId}</strong></span>
          </div>
        )}

        {/* Clean Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Field 1: Account Email or ID */}
          <div>
            <label className="text-[11px] font-bold text-neutral-700 block mb-1.5">
              Account Email or ID
            </label>
            <input
              type="text"
              required
              value={emailOrId}
              onChange={(e) => setEmailOrId(e.target.value)}
              placeholder="e.g. learner@e-enroll.edu or LRN"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-neutral-900 focus:bg-white text-xs font-medium text-neutral-900 placeholder:text-neutral-400 transition-colors"
            />
          </div>

          {/* Field 2: Password with 'Forgot?' link on the right */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-bold text-neutral-700">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotClick}
                className="text-[11px] text-neutral-500 hover:text-neutral-900 hover:underline font-medium transition-colors"
              >
                Forgot?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-neutral-900 focus:bg-white text-xs font-medium text-neutral-900 placeholder:text-neutral-400 transition-colors"
            />
          </div>

          {/* Solid Dark Full-Width Primary Button: 'Log In to Portal' */}
          <button
            type="submit"
            id="btn-submit-modal-login"
            className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <span>Log In to Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Thin Horizontal Line Divider with the word 'OR' */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-semibold text-neutral-400 uppercase tracking-widest absolute">
            OR
          </span>
        </div>

        {/* White Full-Width Secondary Button with Border and Colorful Google 'G' Icon */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-neutral-800 transition-colors flex items-center justify-center gap-3 shadow-2xs cursor-pointer"
        >
          {/* Colorful Google 'G' Icon */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Quick Demo Selector Chips for seamless prototype evaluation */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Instant demo sign in:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                onLoginSuccess('student');
                onClose();
              }}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-neutral-700 font-medium transition-colors"
            >
              Learner
            </button>
            <button
              type="button"
              onClick={() => {
                onLoginSuccess('registrar');
                onClose();
              }}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-neutral-700 font-medium transition-colors"
            >
              Registrar
            </button>
            <button
              type="button"
              onClick={() => {
                onLoginSuccess('admin');
                onClose();
              }}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-neutral-700 font-medium transition-colors"
            >
              Principal
            </button>
          </div>
        </div>

        {/* Link to DepEd Enrollment / Admission */}
        {onOpenAdmission && (
          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-xs text-neutral-500">
              New learner or need to submit intake credentials?{' '}
              <button
                type="button"
                onClick={onOpenAdmission}
                className="font-bold text-neutral-900 underline hover:text-neutral-700 transition-colors"
              >
                Apply for DepEd Admission →
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
