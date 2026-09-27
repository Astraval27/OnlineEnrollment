import React, { useState } from 'react';
import {
  ChevronDown,
  Building2,
  CreditCard,
  Smartphone,
  ChevronRight,
  Receipt,
  Search,
  Filter,
  ArrowUpRight,
  X,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { Transaction } from '../../types';

interface FinancialBillingProps {
  transactions: Transaction[];
  searchQuery: string;
  onCreateInvoiceClick: () => void;
  onDownloadReport: () => void;
}

export const FinancialBilling: React.FC<FinancialBillingProps> = ({
  transactions,
  searchQuery,
  onCreateInvoiceClick: _onCreateInvoiceClick,
  onDownloadReport: _onDownloadReport,
}) => {
  const [trendRange, setTrendRange] = useState('LAST 6 MONTHS');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);
  const [showFeeStructureModal, setShowFeeStructureModal] = useState(false);
  const [showAllTransactionsModal, setShowAllTransactionsModal] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  // Revenue analytics 6-month data
  const revenueTrendData = [
    { month: 'MAY', collection: 780000, projection: 750000 },
    { month: 'JUN', collection: 890000, projection: 850000 },
    { month: 'JUL', collection: 920000, projection: 950000 },
    { month: 'AUG', collection: 1100000, projection: 1050000 },
    { month: 'SEP', collection: 1180000, projection: 1200000 },
    { month: 'OCT', collection: 1240500, projection: 1210000 },
  ];

  const formatPHP = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const filteredTransactions = transactions.filter((t) => {
    const q = (searchQuery || localSearch).toLowerCase();
    if (!q) return true;
    return (
      t.transactionId.toLowerCase().includes(q) ||
      t.studentName.toLowerCase().includes(q) ||
      t.channel.toLowerCase().includes(q) ||
      t.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div
          id="stat-total-revenue"
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs"
        >
          <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block">
            TOTAL REVENUE (TERM)
          </span>
          <div className="text-2xl font-bold text-neutral-900 mt-2 tracking-tight">
            ₱1,240,500
          </div>
          <div className="text-xs text-neutral-500 mt-1.5 flex items-center gap-1 font-medium">
            <span className="text-neutral-900 font-bold">↑ 12%</span> vs last term
          </div>
        </div>

        {/* Card 2 */}
        <div
          id="stat-pending-payments"
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs"
        >
          <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block">
            PENDING PAYMENTS
          </span>
          <div className="text-2xl font-bold text-neutral-900 mt-2 tracking-tight">
            ₱45,200
          </div>
          <div className="text-xs text-neutral-400 mt-1.5 font-medium">
            156 invoices outstanding
          </div>
        </div>

        {/* Card 3 */}
        <div
          id="stat-overdue-accounts"
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs"
        >
          <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block">
            OVERDUE ACCOUNTS
          </span>
          <div className="text-2xl font-bold text-neutral-900 mt-2 tracking-tight">
            12
          </div>
          <div className="text-xs text-neutral-400 mt-1.5 font-medium">
            Requires immediate action
          </div>
        </div>

        {/* Card 4 */}
        <div
          id="stat-scholarships"
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs"
        >
          <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block">
            DEPED VOUCHERS & ESC SUBSIDIES
          </span>
          <div className="text-2xl font-bold text-neutral-900 mt-2 tracking-tight">
            ₱485,000
          </div>
          <div className="text-xs text-neutral-400 mt-1.5 font-medium">
            Applied to 142 K-12 learners
          </div>
        </div>
      </div>

      {/* Middle Row: Revenue Trend (2/3) + Payment Channels (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left: Revenue Trend */}
        <div
          id="revenue-trend-card"
          className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-neutral-900">
              Revenue Trend
            </h3>
            <div className="relative">
              <select
                value={trendRange}
                onChange={(e) => setTrendRange(e.target.value)}
                className="appearance-none bg-white border border-slate-200 text-neutral-800 text-xs font-semibold py-1.5 pl-3 pr-7 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="LAST 6 MONTHS">LAST 6 MONTHS</option>
                <option value="LAST 12 MONTHS">LAST 12 MONTHS</option>
                <option value="THIS YEAR">THIS YEAR</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Revenue Analytics SVG / Chart */}
          <div className="relative border border-slate-100 rounded-lg p-6 bg-slate-50/40 flex flex-col items-center justify-center min-h-[260px]">
            {/* Header placeholder representation */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 text-neutral-400 mb-1">
                <svg className="w-6 h-6 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 17l6-6 4 4 8-8" />
                </svg>
              </div>
              <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase block">
                REVENUE ANALYTICS VISUALIZATION
              </span>
              <span className="text-[11px] text-neutral-400 mt-0.5 block">
                Monthly collection vs projection
              </span>
            </div>

            {/* Interactive SVG Line & Area graph */}
            <div className="w-full max-w-xl h-36 relative mt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />

                {/* Projection dashed line */}
                <path
                  d="M 20 90 L 110 75 L 200 65 L 290 45 L 380 30 L 470 20"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Actual Collection Line */}
                <path
                  d="M 20 85 L 110 70 L 200 68 L 290 38 L 380 25 L 470 15"
                  fill="none"
                  stroke="#171717"
                  strokeWidth="2.5"
                />

                {/* Data Points */}
                {[
                  { cx: 20, cy: 85, idx: 0 },
                  { cx: 110, cy: 70, idx: 1 },
                  { cx: 200, cy: 68, idx: 2 },
                  { cx: 290, cy: 38, idx: 3 },
                  { cx: 380, cy: 25, idx: 4 },
                  { cx: 470, cy: 15, idx: 5 },
                ].map((pt) => (
                  <circle
                    key={pt.idx}
                    cx={pt.cx}
                    cy={pt.cy}
                    r={hoveredMonth === pt.idx ? 6 : 4}
                    fill="#171717"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredMonth(pt.idx)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  />
                ))}
              </svg>

              {/* Month Labels */}
              <div className="flex justify-between text-[11px] font-bold text-neutral-400 mt-2 px-2">
                {revenueTrendData.map((d, i) => (
                  <span
                    key={d.month}
                    className={`cursor-pointer transition-colors ${
                      hoveredMonth === i ? 'text-neutral-900 underline' : ''
                    }`}
                    onMouseEnter={() => setHoveredMonth(i)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    {d.month}
                  </span>
                ))}
              </div>

              {/* Hover Tooltip */}
              {hoveredMonth !== null && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[11px] py-1 px-3 rounded shadow-lg pointer-events-none whitespace-nowrap">
                  <span className="font-bold">{revenueTrendData[hoveredMonth].month}: </span>
                  <span>Collection: {formatPHP(revenueTrendData[hoveredMonth].collection)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Payment Channels */}
        <div
          id="payment-channels-card"
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-base text-neutral-900 mb-5">
              Payment Channels
            </h3>

            <div className="space-y-4">
              {/* Channel 1 */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center text-neutral-700">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">
                      Bank Transfer
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      42% of total
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>

              {/* Channel 2 */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center text-neutral-700">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">
                      Credit/Debit Card
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      38% of total
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>

              {/* Channel 3 */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center text-neutral-700">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">
                      Online Wallet
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      20% of total
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>
            </div>
          </div>

          <button
            id="btn-manage-fee-structure"
            onClick={() => setShowFeeStructureModal(true)}
            className="w-full mt-6 py-2.5 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-bold text-neutral-800 tracking-wider uppercase transition-colors"
          >
            MANAGE FEE STRUCTURE
          </button>
        </div>
      </div>

      {/* Bottom Table: Recent Transactions */}
      <div
        id="recent-transactions-card"
        className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-base text-neutral-900">
            Recent Transactions
          </h3>

          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-60">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-neutral-900"
              />
            </div>
            <button
              onClick={() => {}}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-neutral-500"
            >
              <Filter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-3">TRANSACTION ID</th>
                <th className="py-3 px-3">STUDENT</th>
                <th className="py-3 px-3">AMOUNT</th>
                <th className="py-3 px-3">DATE</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3 text-right">RECEIPT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-neutral-800">
                    {trx.transactionId}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[10px] text-neutral-600">
                        {trx.studentName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-neutral-900">
                        {trx.studentName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-neutral-800 font-mono">
                    {formatPHP(trx.amount)}
                  </td>
                  <td className="py-3.5 px-3 text-neutral-400 font-medium uppercase text-[11px]">
                    {trx.date}
                  </td>
                  <td className="py-3.5 px-3">
                    {trx.status === 'SUCCESS' ? (
                      <span className="inline-block px-2.5 py-0.5 bg-neutral-900 text-white rounded text-[10px] font-bold tracking-wider">
                        SUCCESS
                      </span>
                    ) : trx.status === 'PENDING' ? (
                      <span className="inline-block px-2.5 py-0.5 border border-neutral-300 text-neutral-800 rounded text-[10px] font-bold tracking-wider">
                        PENDING
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 bg-neutral-100 text-neutral-400 rounded text-[10px] font-bold tracking-wider border border-slate-200">
                        FAILED
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      id={`btn-view-receipt-${trx.transactionId}`}
                      onClick={() => setSelectedReceipt(trx)}
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-slate-100 rounded transition-colors inline-flex items-center justify-center"
                      title="View Official Receipt"
                    >
                      <Receipt className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View All Transactions Link */}
        <div className="text-center pt-2">
          <button
            id="btn-view-all-transactions"
            onClick={() => setShowAllTransactionsModal(true)}
            className="text-xs font-bold text-neutral-900 hover:underline tracking-wider uppercase inline-flex items-center gap-1"
          >
            <span>VIEW ALL TRANSACTIONS</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Official Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-neutral-900" />
                <h3 className="font-bold text-base text-neutral-900">Official Electronic Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-neutral-400 hover:text-neutral-700 font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">RECEIPT NO:</span>
                <span className="font-bold text-neutral-900">{selectedReceipt.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">STUDENT:</span>
                <span className="font-bold text-neutral-900">{selectedReceipt.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">DATE:</span>
                <span className="font-bold text-neutral-900">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">CHANNEL:</span>
                <span className="font-bold text-neutral-900">{selectedReceipt.channel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">PURPOSE:</span>
                <span className="font-bold text-neutral-900">{selectedReceipt.description || 'Tuition & Fees'}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm">
                <span className="font-bold text-neutral-900">TOTAL AMOUNT:</span>
                <span className="font-bold text-neutral-900">{formatPHP(selectedReceipt.amount)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2 border border-slate-300 rounded-lg text-xs font-bold text-neutral-800 flex items-center justify-center gap-2 hover:bg-slate-50"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fee Structure Modal */}
      {showFeeStructureModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-neutral-900">K-12 Basic Education Fee Schedule (SY 2026-2027)</h3>
              <button
                onClick={() => setShowFeeStructureModal(false)}
                className="text-neutral-400 hover:text-neutral-700 font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded">
                <span>Kindergarten & Elementary Tuition (Annual):</span>
                <span className="font-bold">₱18,500.00</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded">
                <span>Junior High School Tuition (Annual):</span>
                <span className="font-bold">₱24,000.00</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded">
                <span>Senior High School Tuition (Gross):</span>
                <span className="font-bold">₱32,500.00</span>
              </div>
              <div className="flex justify-between p-2.5 bg-emerald-50 rounded text-emerald-900 border border-emerald-200">
                <span>DepEd SHS Voucher Subsidy (Deduction):</span>
                <span className="font-bold">-₱17,500.00</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded">
                <span>Science, TLE & Computer Lab Assessment:</span>
                <span className="font-bold">₱1,500.00</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded">
                <span>PTA Dues & Medical/Dental Physical Exam:</span>
                <span className="font-bold">₱650.00</span>
              </div>
            </div>

            <button
              onClick={() => setShowFeeStructureModal(false)}
              className="w-full mt-4 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* All Transactions Modal */}
      {showAllTransactionsModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-neutral-900">All Transactions Ledger</h3>
              <button
                onClick={() => setShowAllTransactionsModal(false)}
                className="text-neutral-400 hover:text-neutral-700 font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 text-xs">
              {transactions.map((t) => (
                <div key={t.id} className="p-3 border border-slate-200 rounded flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-neutral-800">{t.transactionId}</span> - {t.studentName}
                    <div className="text-[11px] text-neutral-400">{t.channel} • {t.date}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono">{formatPHP(t.amount)}</span>
                    <div className="text-[10px] font-bold text-neutral-600">{t.status}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAllTransactionsModal(false)}
              className="w-full py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase"
            >
              Close Ledger
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
