import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  FileCheck2,
  Home,
} from 'lucide-react';

interface ContactSectionProps {
  onNavigateTab?: (tab: string) => void;
  onOpenAdmission?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onNavigateTab,
  onOpenAdmission,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('K-12 Admission Inquiries');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setFullName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section id="contact" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-neutral-800 uppercase tracking-wider shadow-2xs">
            <PhoneCall className="w-3.5 h-3.5 text-neutral-900" />
            <span>Admissions & Registrar Helpdesk</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Contact School Admissions & Registrar Office
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Have questions about DepEd Form 138 (SF9), 12-digit LRN verification, ESC / Senior High School vouchers, or enrollment schedules?
            Reach out to our registrar coordinators or visit our on-campus registrar windows.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Details & Office Hours (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-xs space-y-6">
              <h3 className="font-bold text-base text-neutral-900">
                School Office Information
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-neutral-800 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">Campus Location</span>
                    <span className="text-neutral-500 leading-snug block mt-0.5">
                      Ground Floor, Administration Building, E-ENROLL Academy Campus, Manila, Philippines (1004)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-neutral-800 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">Official Inquiries</span>
                    <span className="text-neutral-500 block mt-0.5 font-mono text-xs">
                      admissions@e-enroll.edu.ph
                    </span>
                    <span className="text-neutral-400 block font-mono text-xs">
                      registrar@e-enroll.edu.ph
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-neutral-800 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">Hotline & Phone</span>
                    <span className="text-neutral-500 block mt-0.5 font-mono text-xs">
                      +63 (02) 8888-3676 / Loc. 102 (Registrar)
                    </span>
                    <span className="text-neutral-400 block font-mono text-xs">
                      +63 917 555 0199 (Mobile Support)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-neutral-800 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">Window Service Hours</span>
                    <span className="text-neutral-500 block mt-0.5">
                      Monday to Friday: 8:00 AM – 5:00 PM (PHT)
                    </span>
                    <span className="text-neutral-400 block text-xs">
                      Saturday: 8:00 AM – 12:00 PM (Document Drop-off only)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Reminder Box */}
            <div className="p-5 bg-neutral-900 text-white rounded-2xl shadow-md space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-neutral-300 block">
                DepEd Hard Copy Credentials Submissions:
              </span>
              <p className="text-neutral-400 leading-relaxed">
                Bring original Form 138 (SF9), PSA Birth Certificate, and Certificate of Good Moral Character to Registrar Window 2 during standard campus hours.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Contact / Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
              <h3 className="font-bold text-lg text-neutral-900 mb-1">
                Send an Enrollment Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 mb-6">
                Our admissions helpdesk team responds to parent and learner tickets within 24 business hours.
              </p>

              {submitted ? (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4 animate-in fade-in">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">Message Dispatched Successfully</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      Thank you! A registrar officer has received your ticket and will follow up at your provided email.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                        Parent or Learner Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Roberto Tabulo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. roberto.tabulo@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white text-xs"
                    >
                      <option value="K-12 Admission Inquiries">K-12 Basic Education Enrollment (Kindergarten - G12)</option>
                      <option value="DepEd Form 138 & LRN Verification">DepEd Form 138 (SF9) & 12-Digit LRN Verification</option>
                      <option value="Senior High School Voucher & ESC Subsidies">Senior High School Voucher & ESC Subsidies</option>
                      <option value="Tuition & Downpayment Schedule">Tuition, PTA Dues & Payment Methods</option>
                      <option value="Portal Access Support">Learner & Parent Portal Login Assistance</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Please include your learner's LRN (if available), grade level, and your specific question..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white text-xs resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Quick jump to other panels */}
        {onNavigateTab && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
                <span>Return to Other Panels</span>
              </div>
              <h4 className="text-lg font-bold text-neutral-900">
                Explore Portal Modules
              </h4>
              <p className="text-xs text-neutral-500">
                Switch back to the Home launchpad or start your official K-12 learner enrollment.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('home')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <Home className="w-4 h-4 text-neutral-700" />
                <span>Home Panel</span>
              </button>
              <button
                onClick={() => onNavigateTab('admission')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <FileCheck2 className="w-4 h-4 text-neutral-700" />
                <span>Admission Roadmap</span>
              </button>
              {onOpenAdmission && (
                <button
                  onClick={onOpenAdmission}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
                >
                  <span>Enroll Learner Now</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
