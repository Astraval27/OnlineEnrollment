import React, { useState } from 'react';
import { X, CheckCircle2, UserPlus, Plus, Download, AlertCircle } from 'lucide-react';
import { Student, Transaction } from '../../types';
import { formatPhilippineMobile, formatDateOfBirthMask } from '../../utils/inputMasking';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: Partial<Student>) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [program, setProgram] = useState('Grade 11 - STEM');
  const [department, setDepartment] = useState('Senior High School');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    onAddStudent({
      id: `s_${Date.now()}`,
      name,
      email,
      studentId: `ST-2026-${Math.floor(100 + Math.random() * 900)}`,
      program,
      department,
      parentGuardian: phone ? `Guardian Contact (${phone})` : undefined,
      currentStep: 1,
      totalSteps: 11,
      status: 'PENDING',
      enrollmentDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });

    setName('');
    setEmail('');
    setPhone('');
    setDob('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-neutral-900" />
            <h3 className="font-bold text-base text-neutral-900">Add New Student</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jonathan Reyes"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. j.reyes@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                Phone (+63 9XX-XXX-XXXX)
              </label>
              <input
                type="tel"
                maxLength={16}
                placeholder="+63 917-555-0199"
                value={phone}
                onChange={(e) => setPhone(formatPhilippineMobile(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
              />
              <span className="text-[9px] text-neutral-400 mt-0.5 block">Format: +63 9XX-XXX-XXXX</span>
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                Date of Birth (YYYY-MM-DD)
              </label>
              <input
                type="text"
                maxLength={10}
                placeholder="2010-08-15"
                value={dob}
                onChange={(e) => setDob(formatDateOfBirthMask(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
              />
              <span className="text-[9px] text-neutral-400 mt-0.5 block">Format: YYYY-MM-DD</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
              Program / Grade & Strand
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Grade 11 - STEM"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs"
            >
              <option value="Engineering Dept">Engineering Dept</option>
              <option value="Arts & Sciences">Arts & Sciences</option>
              <option value="Business Dept">Business Dept</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-neutral-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-semibold uppercase tracking-wider"
            >
              Enroll Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvoice: (invoice: Partial<Transaction>) => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  onCreateInvoice,
}) => {
  const [studentName, setStudentName] = useState('');
  const [amount, setAmount] = useState('2450.00');
  const [channel, setChannel] = useState<'Bank Transfer' | 'Credit/Debit Card' | 'Online Wallet'>('Bank Transfer');
  const [description, setDescription] = useState('Tuition & Laboratory Assessment');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !amount) return;

    onCreateInvoice({
      id: `t_${Date.now()}`,
      transactionId: `TRX-${Math.floor(90000 + Math.random() * 9999)}`,
      studentName,
      studentId: `ST-2026-${Math.floor(100 + Math.random() * 900)}`,
      amount: parseFloat(amount) || 2450,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
      status: 'PENDING',
      channel,
      description,
    });

    setStudentName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-neutral-900" />
            <h3 className="font-bold text-base text-neutral-900">Create Academic Invoice</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
              Student Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alice Henderson"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
              Billing Amount (PHP ₱)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
              Payment Method Channel
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as any)}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs"
            >
              <option value="Bank Transfer">Bank Transfer (42%)</option>
              <option value="Credit/Debit Card">Credit/Debit Card (38%)</option>
              <option value="Online Wallet">Online Wallet (20%)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
              Description / Assessment Note
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-neutral-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-semibold uppercase tracking-wider"
            >
              Issue Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface BatchApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApproveAll: () => void;
}

export const BatchApprovalModal: React.FC<BatchApprovalModalProps> = ({
  isOpen,
  onClose,
  onApproveAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-neutral-900" />
          <h3 className="font-bold text-base text-neutral-900">Batch Applications Approval</h3>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed">
          You are about to batch approve all <strong>284</strong> applications currently categorized under &apos;Ready for Review&apos; that satisfy all certified document requirements.
        </p>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-neutral-500">Verified Birth Certificates:</span>
            <span className="font-bold text-neutral-900">284 / 284</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Academic Transcripts Validated:</span>
            <span className="font-bold text-neutral-900">284 / 284</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onApproveAll();
              onClose();
            }}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
          >
            Confirm Batch Approval
          </button>
        </div>
      </div>
    </div>
  );
};
