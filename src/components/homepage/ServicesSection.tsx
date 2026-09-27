import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  CreditCard,
  UserCheck,
  CheckCircle,
  FolderCheck,
  ArrowRight,
  Layers,
  Sparkles,
  PhoneCall,
  FileCheck2,
} from 'lucide-react';

interface ServicesSectionProps {
  onOpenAdmission: () => void;
  onOpenLogin: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenAdmission,
  onOpenLogin,
  onNavigateTab,
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Admissions' | 'Academics' | 'Financial'>('All');

  const services = [
    {
      icon: UserCheck,
      category: 'Admissions',
      title: 'K-12 Basic Education Admissions',
      desc: 'Seamless admissions for Kindergarten, Elementary (Grades 1-6), Junior High (Grades 7-10), and Senior High School (STEM, ABM, HUMSS, TVL).',
      action: 'Enroll Now',
      onClick: onOpenAdmission,
    },
    {
      icon: FolderCheck,
      category: 'Admissions',
      title: 'DepEd Form 138 (SF9) & LRN Verification',
      desc: 'Automated ingestion and secure registrar review of official DepEd Form 138 report cards, PSA birth certificates, and 12-digit Learner Reference Numbers.',
      action: 'View Checklist',
      onClick: onNavigateTab ? () => onNavigateTab('admission') : onOpenAdmission,
    },
    {
      icon: BookOpen,
      category: 'Academics',
      title: 'K-12 Subject Offerings & Sectioning',
      desc: 'Real-time class scheduling, classroom capacity tracking, licensed teacher assignments, and DepEd-compliant section load balancing.',
      action: 'Access Catalog',
      onClick: onOpenLogin,
    },
    {
      icon: CreditCard,
      category: 'Financial',
      title: 'Tuition, ESC & SHS Voucher Assessment',
      desc: 'Transparent tuition invoicing with automatic PEAC / ESC subsidy discounts and DepEd Senior High School voucher deductions.',
      action: 'Check Payments',
      onClick: onOpenLogin,
    },
    {
      icon: FileText,
      category: 'Academics',
      title: 'DepEd LIS Learner Directory & Records',
      desc: 'Centralized school registrar database tracking learner enrollment progress, academic standing, grade levels, and Form 137/SF10 historical files.',
      action: 'Learner Directory',
      onClick: onOpenLogin,
    },
    {
      icon: CheckCircle,
      category: 'Admissions',
      title: 'Certificate of Enrollment (COE)',
      desc: 'Instant generation of verified Certificates of Enrollment (COE) and official learner school ID credentials upon registrar approval.',
      action: 'Check Status',
      onClick: onOpenLogin,
    },
  ];

  const filteredServices = services.filter((s) => {
    if (activeCategory === 'All') return true;
    return s.category === activeCategory;
  });

  return (
    <section id="services" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 border border-slate-200 rounded-full text-xs font-bold text-neutral-800 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-neutral-900" />
            <span>Core Institutional Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Comprehensive Digital Academic Services
          </h2>
          <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
            From initial learner intake to LIS DepEd synchronization and voucher credits, E-ENROLL provides a complete, modern service suite for our entire campus community.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {(['All', 'Admissions', 'Academics', 'Financial'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-slate-100 text-neutral-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'All' ? 'All Services' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl p-7 shadow-xs hover:border-neutral-900 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-neutral-900 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-neutral-600 border border-slate-200">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <button
                    onClick={item.onClick}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-neutral-600 uppercase tracking-wider group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>{item.action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cross-panel navigation banner */}
        {onNavigateTab && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
                <span>Admission Roadmap & Inquiries</span>
              </div>
              <h4 className="text-lg font-bold text-neutral-900">
                Need Help with Requirements or Vouchers?
              </h4>
              <p className="text-xs text-neutral-500">
                Check our complete 11-step admission roadmap or get in touch with the Registrar Helpdesk.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('admission')}
                className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-2xs"
              >
                <FileCheck2 className="w-4 h-4 text-neutral-700" />
                <span>Admission Guide</span>
              </button>
              <button
                onClick={() => onNavigateTab('contact')}
                className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-2xs"
              >
                <PhoneCall className="w-4 h-4 text-neutral-700" />
                <span>Contact Registrar</span>
              </button>
              <button
                onClick={onOpenAdmission}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>Enroll Learner Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
