import React, { useState } from 'react';
import {
  GraduationCap,
  ArrowRight,
  User,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenAdmission: () => void;
  onNavigateSection: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenAdmission,
  onNavigateSection,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'admission', label: 'Admission' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group min-w-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-xs group-hover:bg-neutral-800 transition-colors shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-sm sm:text-base tracking-wider text-neutral-900 leading-tight">
              E-ENROLL
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-wider text-neutral-400 font-semibold uppercase truncate">
              ADMISSIONS & REGISTRAR
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 text-xs lg:text-sm transition-colors cursor-pointer ${
                  isActive
                    ? 'font-bold text-neutral-900 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-neutral-900'
                    : 'font-medium text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons: [LOG IN] [APPLY / ENROLL NOW] */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            id="btn-homepage-login"
            onClick={onOpenLogin}
            className="px-3 sm:px-4 py-1.5 sm:py-2 border border-slate-300 rounded-lg text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-neutral-700" />
            <span>LOG IN</span>
          </button>

          <button
            id="btn-homepage-admission"
            onClick={onOpenAdmission}
            className="hidden sm:flex px-4 lg:px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <span>APPLY / ENROLL NOW</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Hamburger for small screens */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 sm:px-6 py-4 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20">
                    Active
                  </span>
                )}
              </button>
            );
          })}

          {/* Mobile Apply Button inside dropdown */}
          <div className="pt-2 border-t border-slate-100 sm:hidden">
            <button
              onClick={() => {
                onOpenAdmission();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>APPLY / ENROLL NOW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
