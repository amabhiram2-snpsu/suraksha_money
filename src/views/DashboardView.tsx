import React, { useState } from 'react';
import { ViewMode, Transaction, IncomeItem, ExpenseItem, DebtItem, SavingsGoal, LanguageCode } from '../types';
import { speakHindi } from '../utils/speech';
import { t } from '../utils/translations';

interface DashboardViewProps {
  onNavigate: (view: ViewMode) => void;
  transactions: Transaction[];
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  debts: DebtItem[];
  goals: SavingsGoal[];
  isUpiFrozen: boolean;
  onToggleFreezeUpi: () => void;
  language?: LanguageCode;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  transactions,
  incomes,
  expenses,
  debts,
  goals,
  isUpiFrozen,
  onToggleFreezeUpi,
  language = 'en',
}) => {
  const [autoSaveActive, setAutoSaveActive] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Mar');

  // Dynamic calculations from user data
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const separateDebtObligations = debts
    .filter((d) => !d.includedInExpenses)
    .reduce((acc, curr) => acc + curr.monthlyRepayment, 0);
  const remainingBudget = totalIncome - totalExpenses - separateDebtObligations;
  const totalMonthlySavingsTarget = goals.reduce((acc, curr) => acc + curr.monthlyContribution, 0);

  // Dynamic category sums for the Donut chart
  const groceriesSum = expenses.filter((e) => e.category === 'groceries').reduce((a, b) => a + b.amount, 0);
  const housingSum = expenses.filter((e) => e.category === 'housing' || e.category === 'utilities').reduce((a, b) => a + b.amount, 0);
  const healthSum = expenses.filter((e) => e.category === 'healthcare').reduce((a, b) => a + b.amount, 0);
  const transportSum = expenses.filter((e) => e.category === 'transport').reduce((a, b) => a + b.amount, 0);
  const discretionarySum = expenses.filter((e) => e.category === 'discretionary' || e.category === 'shopping').reduce((a, b) => a + b.amount, 0);

  // Safe percentage of budget
  const expenseLimitTarget = totalIncome * 0.72;
  const expensePacePercent = totalIncome > 0 ? Math.min(100, Math.round((totalExpenses / totalIncome) * 100)) : 0;
  const underPaceAmount = Math.max(0, Math.round(expenseLimitTarget - totalExpenses));

  const handleVoiceQuickAssist = () => {
    speakHindi(
      `नमस्ते राजेश। आपका वर्तमान शुद्ध शेष ${remainingBudget.toLocaleString()} रुपये सुरक्षित गति में है। कुल मासिक आय ${totalIncome.toLocaleString()} रुपये और खर्च ${totalExpenses.toLocaleString()} रुपये है।`
    );
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* Top Greeting & Real-time Shield Status Bar */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#131b2e] border border-[#1E293B] p-6 lg:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-teal-500/10 pointer-events-none blur-3xl"></div>
        <div className="flex flex-col gap-2 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-teal-400 font-bold">
              Financial Health • March 2025
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1E293B] border border-[#334155] text-slate-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#4ae176]"></span>
              Day 17 of 31
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good morning, Rajesh! Let’s make your money work smarter.
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Your monthly safety shield is actively safeguarding joint UPI buffers and verified
            medical emergency reserves.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <button
              onClick={() => onNavigate('ai-financial-assistant')}
              className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              <span>{t('navAiChat', language)}</span>
            </button>
            <button
              onClick={() => onNavigate('payment-assistant')}
              className="px-3.5 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-teal-300 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">mic</span>
              <span>🎙️ Voice Payment Guard</span>
            </button>
          </div>
        </div>

        {/* Shield Status Pill Box */}
        <div className="flex items-center gap-4 bg-[#1E293B] border border-[#334155] px-5 py-3.5 rounded-xl z-10 self-start lg:self-center shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(74,225,118,0.25)] flex-shrink-0">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Shield Active</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                Family Protected
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Kamala Devi (Mother)’s phone &amp; accounts linked
            </p>
          </div>
        </div>
      </section>

      {/* KPI Metric Row (Dynamically calculated from user data!) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Income */}
        <div className="flex flex-col p-5 bg-[#131b2e] border border-[#1E293B] rounded-2xl shadow-lg hover:border-teal-400/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold">{t('totalInflow', language)}</span>
            <div className="w-9 h-9 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-teal-400">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              ₹{totalIncome.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-bold flex items-center">
              <span className="material-symbols-outlined text-[16px]">trending_up</span> +8.5%
            </span>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between text-slate-400 text-xs border-t border-[#1E293B]">
            <span>{incomes.length} Source(s) active</span>
            <button
              onClick={() => onNavigate('budget-planner')}
              className="text-teal-400 hover:underline font-semibold"
            >
              Change / Edit &rarr;
            </button>
          </div>
        </div>

        {/* Card 2: Expenses */}
        <div className="flex flex-col p-5 bg-[#131b2e] border border-[#1E293B] rounded-2xl shadow-lg hover:border-teal-400/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold">{t('monthlyExpenses', language)}</span>
            <div className="w-9 h-9 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-teal-400">
              <span className="material-symbols-outlined text-[20px]">credit_card</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              ₹{totalExpenses.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-medium">{expensePacePercent}% of inflow</span>
          </div>
          <div className="w-full bg-[#1E293B] h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-teal-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(79,219,200,0.6)]"
              style={{ width: `${expensePacePercent}%` }}
            ></div>
          </div>
          <div className="mt-2 flex items-center justify-between text-slate-400 text-xs">
            <span className="text-emerald-400 font-bold">
              {underPaceAmount > 0 ? `₹${underPaceAmount.toLocaleString()} safe margin` : 'Balanced'}
            </span>
            <button
              onClick={() => onNavigate('budget-planner')}
              className="text-teal-400 hover:underline font-semibold"
            >
              Change / Edit &rarr;
            </button>
          </div>
        </div>

        {/* Card 3: Remaining Budget */}
        <div className="flex flex-col p-5 bg-[#131b2e] border border-[#1E293B] rounded-2xl shadow-lg hover:border-teal-400/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold">{t('remainingBudget', language)}</span>
            <div className="w-9 h-9 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold tracking-tight ${
                remainingBudget >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              ₹{remainingBudget.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
              Safe Pace
            </span>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between text-slate-400 text-xs border-t border-[#1E293B]">
            <span>Available to spend safely</span>
            <span className="font-semibold text-white">
              ₹{Math.max(0, Math.round(remainingBudget / 14)).toLocaleString()} / day
            </span>
          </div>
        </div>

        {/* Card 4: Monthly Savings */}
        <div className="flex flex-col p-5 bg-[#131b2e] border border-[#1E293B] rounded-2xl shadow-lg hover:border-teal-400/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold">{t('plannedSavings', language)}</span>
            <div className="w-9 h-9 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined text-[20px]">savings</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              ₹{totalMonthlySavingsTarget.toLocaleString()}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span> {goals.length} Goals
            </span>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between text-slate-400 text-xs border-t border-[#1E293B]">
            <span>Across Active Vaults</span>
            <button
              onClick={() => onNavigate('savings-goals')}
              className="font-bold text-teal-400 hover:underline"
            >
              Manage Plans &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Visualizations Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cash Flow Dual Bar / Line Chart (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col p-6 bg-[#131b2e] border border-[#1E293B] rounded-2xl shadow-lg justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Cash Flow &amp; Expense Dynamics</h2>
              <p className="text-xs text-slate-400">Past 6 months: Income deposits vs. Total outlays</p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-teal-400 shadow-[0_0_6px_rgba(79,219,200,0.4)]"></span>
                <span>Income</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(74,225,118,0.5)]"></span>
                <span>Actual Outflow</span>
              </div>
            </div>
          </div>

          {/* SVG Cash Flow Graph */}
          <div className="w-full h-64 relative flex items-end justify-between pt-6 pb-6 px-2">
            <svg
              className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 600 240"
            >
              <line className="text-slate-800" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="600" y1="40" y2="40" />
              <line className="text-slate-800" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="600" y1="100" y2="100" />
              <line className="text-slate-800" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="600" y1="160" y2="160" />
              <line className="text-slate-700" stroke="currentColor" strokeWidth="1" x1="0" x2="600" y1="210" y2="210" />
              {/* Outflow Polyline Graph */}
              <polyline
                fill="none"
                points="50,150 150,135 250,120 350,142 450,125 550,118"
                stroke="#4ae176"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />
              <circle cx="50" cy="150" fill="#4ae176" r="4.5" />
              <circle cx="150" cy="135" fill="#4ae176" r="4.5" />
              <circle cx="250" cy="120" fill="#4ae176" r="4.5" />
              <circle cx="350" cy="142" fill="#4ae176" r="4.5" />
              <circle cx="450" cy="125" fill="#4ae176" r="4.5" />
              <circle cx="550" cy="118" fill="#0b1326" r="5.5" stroke="#4ae176" strokeWidth="2.5" />
            </svg>

            {/* Dynamic Bars */}
            {[
              { m: 'Oct', v: '₹32k', h: 120 },
              { m: 'Nov', v: '₹32k', h: 120 },
              { m: 'Dec', v: '₹34k', h: 135 },
              { m: 'Jan', v: '₹33k', h: 128 },
              { m: 'Feb', v: '₹33.5k', h: 130 },
              { m: 'Mar', v: `₹${Math.round(totalIncome / 1000)}k`, h: 145, active: true },
            ].map((col) => (
              <div
                key={col.m}
                onClick={() => setSelectedMonth(col.m)}
                className="flex-1 flex flex-col items-center justify-end h-full z-10 group cursor-pointer"
              >
                <div
                  className={`text-[11px] mb-1 font-bold ${
                    col.active ? 'text-teal-300 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'
                  } transition-opacity`}
                >
                  {col.v}
                </div>
                <div
                  className={`w-7 sm:w-10 rounded-t-md transition-all ${
                    col.active
                      ? 'bg-teal-400 shadow-[0_0_12px_rgba(79,219,200,0.5)] border border-teal-300'
                      : 'bg-teal-500/20 group-hover:bg-teal-500/40 border border-teal-500/40'
                  }`}
                  style={{ height: `${col.h}px` }}
                ></div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    col.active ? 'text-teal-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  {col.m}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 bg-[#1E293B] border border-[#1E293B] px-4 py-2.5 rounded-xl mt-2 text-xs">
            <span className="flex items-center gap-2 text-slate-200 font-semibold">
              <span className="material-symbols-outlined text-[18px] text-teal-400">insights</span>
              Net surplus: ₹{remainingBudget.toLocaleString()} in {selectedMonth}
            </span>
            <button
              onClick={() => onNavigate('budget-planner')}
              className="text-teal-400 font-bold hover:underline flex items-center gap-0.5"
            >
              Modify Ledger &rarr;
            </button>
          </div>
        </div>

        {/* Expense Breakdown Donut & Category Allocation (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col p-6 bg-[#131b2e] border border-[#1E293B] rounded-2xl shadow-lg justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Expense Breakdown</h2>
              <p className="text-xs text-slate-400">₹{totalExpenses.toLocaleString()} distributed across categories</p>
            </div>
            <button
              onClick={() => onNavigate('budget-planner')}
              className="text-xs bg-[#1E293B] hover:bg-[#334155] border border-[#334155] px-2.5 py-1 rounded-lg text-teal-400 font-semibold"
            >
              Edit Outlays
            </button>
          </div>

          {/* Donut Visual + Category Summary Split */}
          <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="transparent" r="38" stroke="#1e293b" strokeWidth="14" />
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="#4fdbc8"
                  strokeDasharray="81.6 238.76"
                  strokeDashoffset="0"
                  strokeWidth="14"
                />
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="#4ae176"
                  strokeDasharray="74.6 238.76"
                  strokeDashoffset="-81.6"
                  strokeWidth="14"
                />
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="#ffb95f"
                  strokeDasharray="37.7 238.76"
                  strokeDashoffset="-156.2"
                  strokeWidth="14"
                />
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="#818cf8"
                  strokeDasharray="23.8 238.76"
                  strokeDashoffset="-193.9"
                  strokeWidth="14"
                />
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="#2dd4bf"
                  strokeDasharray="20.9 238.76"
                  strokeDashoffset="-217.7"
                  strokeWidth="14"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  Total
                </span>
                <span className="text-xl font-extrabold text-white leading-none">
                  ₹{Math.round(totalExpenses / 1000)}k
                </span>
              </div>
            </div>

            {/* Quick Stack Highlights */}
            <div className="flex flex-col gap-2 w-full text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4fdbc8] shadow-[0_0_6px_#4fdbc8]"></span>
                  <span>Groceries &amp; Food</span>
                </span>
                <span className="font-bold text-white">₹{groceriesSum.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4ae176] shadow-[0_0_6px_#4ae176]"></span>
                  <span>Housing &amp; Utilities</span>
                </span>
                <span className="font-bold text-white">₹{housingSum.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffb95f] shadow-[0_0_6px_#ffb95f]"></span>
                  <span>Elder Healthcare</span>
                </span>
                <span className="font-bold text-white">₹{healthSum.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                  <span>Transport &amp; Fuel</span>
                </span>
                <span className="font-bold text-white">₹{transportSum.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                  <span>Discretionary Shopping</span>
                </span>
                <span className="font-bold text-white">₹{discretionarySum.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#1E293B] border border-[#334155] rounded-xl flex items-center justify-between text-xs mt-2">
            <span className="text-slate-400 font-medium">
              Elder Healthcare is protected under Verified Rupee cap
            </span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified</span> Verified
            </span>
          </div>
        </div>
      </section>

      {/* Savings Goals & AI Recommendations */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Trackers (6 cols) */}
        <div className="lg:col-span-6 flex flex-col p-6 bg-[#131b2e] border border-[#1E293B] rounded-2xl shadow-lg justify-between gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                Protected Savings &amp; Emergency Reserves
              </h2>
              <p className="text-xs text-slate-400">Secured vault accounts with senior guardian locks</p>
            </div>
            <button
              onClick={() => onNavigate('savings-goals')}
              className="px-3.5 py-1.5 rounded-lg bg-[#1E293B] border border-[#334155] text-white text-xs hover:bg-[#334155] transition-colors font-semibold"
            >
              + Add / Edit Goals
            </button>
          </div>

          {/* Goal 1 */}
          {goals[0] && (
            <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <span className="material-symbols-outlined text-[20px]">health_and_safety</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{goals[0].title}</p>
                    <p className="text-[11px] text-slate-400">{goals[0].category}</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 px-2.5 py-0.5 rounded font-bold">
                  {Math.min(100, Math.round((goals[0].currentAmount / goals[0].targetAmount) * 100))}% Funded
                </span>
              </div>
              <div className="w-full bg-[#0b1326] h-2.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(74,225,118,0.5)]"
                  style={{
                    width: `${Math.min(100, Math.round((goals[0].currentAmount / goals[0].targetAmount) * 100))}%`,
                  }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white">₹{goals[0].currentAmount.toLocaleString()} saved</span>
                <span>Target: ₹{goals[0].targetAmount.toLocaleString()} ({goals[0].targetDate})</span>
              </div>
            </div>
          )}

          {/* Goal 2 */}
          {goals[1] && (
            <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                    <span className="material-symbols-outlined text-[20px]">school</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{goals[1].title}</p>
                    <p className="text-[11px] text-slate-400">{goals[1].category}</p>
                  </div>
                </div>
                <span className="text-xs bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold px-2.5 py-0.5 rounded">
                  {Math.min(100, Math.round((goals[1].currentAmount / goals[1].targetAmount) * 100))}% Complete
                </span>
              </div>
              <div className="w-full bg-[#0b1326] h-2.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-teal-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(79,219,200,0.5)]"
                  style={{
                    width: `${Math.min(100, Math.round((goals[1].currentAmount / goals[1].targetAmount) * 100))}%`,
                  }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white">₹{goals[1].currentAmount.toLocaleString()} saved</span>
                <span>Target: ₹{goals[1].targetAmount.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actionable AI Insight Card */}
        <div className="lg:col-span-6 flex flex-col justify-between p-6 bg-gradient-to-br from-[#10233b] via-[#0d1c31] to-[#0b1326] border border-teal-500/40 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-teal-500/20 blur-3xl pointer-events-none"></div>
          <div className="flex flex-col gap-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold w-fit">
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                <span>AI Budget Predictive Intelligence</span>
              </div>
              <span className="text-slate-400 text-xs font-medium">Auto-Optimized</span>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight leading-snug">
                You’re on track to save an extra ₹2,500 this month!
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mt-2">
                Reducing discretionary weekend dining by just 25% over the next two Saturdays will
                enable you to reach your 3-month Emergency Fund milestone{' '}
                <strong className="text-teal-400 font-bold">18 days faster</strong>.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#1E293B]/90 border border-[#334155] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">AI Recommended Action</span>
                <span className="text-xs text-slate-300">
                  Auto-divert ₹625/week directly into ICICI Liquid Vault
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 z-10">
            <button
              onClick={() => setAutoSaveActive(!autoSaveActive)}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                autoSaveActive
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(74,225,118,0.4)]'
                  : 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-[0_0_20px_rgba(79,219,200,0.3)]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {autoSaveActive ? 'check_circle' : 'arrow_forward'}
              </span>
              <span>{autoSaveActive ? 'Auto-Save Enabled (₹625/wk)' : 'Apply Auto-Save'}</span>
            </button>
            <button
              onClick={() => onNavigate('emergency-fund')}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-transparent text-slate-400 hover:text-white text-xs font-semibold transition-colors"
            >
              Adjust Parameters
            </button>
          </div>
        </div>
      </section>

      {/* Recent Transactions & Safety Module */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Transactions Table (8 cols) */}
        <div className="lg:col-span-8 flex flex-col p-6 bg-[#131b2e] border border-[#1E293B] rounded-2xl shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Recent Verified Transactions</h2>
              <p className="text-xs text-slate-400">Live audit trail with fraud prevention scoring</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('payment-assistant')}
                className="px-3 py-1.5 rounded-lg bg-[#1E293B] border border-[#334155] text-slate-300 text-xs font-semibold hover:text-white transition-colors"
              >
                Filter: All
              </button>
              <button
                onClick={() => alert('Downloading encrypted financial audit statement (PDF)...')}
                className="px-3 py-1.5 rounded-lg bg-[#1E293B] border border-[#334155] text-slate-300 text-xs font-semibold hover:text-white transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[#1E293B] transition-colors border border-transparent hover:border-[#334155]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      tx.type === 'credit'
                        ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400'
                        : tx.threatLevel === 'critical'
                        ? 'bg-red-950/80 border border-red-500/40 text-red-400'
                        : 'bg-[#1E293B] border border-[#334155] text-teal-400'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {tx.type === 'credit'
                        ? 'account_balance'
                        : tx.category === 'Healthcare'
                        ? 'medical_services'
                        : tx.category === 'Utilities'
                        ? 'electric_bolt'
                        : 'shopping_cart'}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-white truncate">
                      {tx.recipientName}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <span>
                        {tx.date} • {tx.time}
                      </span>
                      {tx.verifiedBadge && (
                        <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold text-[11px]">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>{' '}
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 pl-4">
                  <span
                    className={`text-base font-extrabold tracking-tight ${
                      tx.type === 'credit' ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    {tx.type === 'credit' ? `+₹${tx.amount.toLocaleString()}` : `-₹${tx.amount.toLocaleString()}`}
                  </span>
                  <p className="text-xs text-slate-400">
                    {tx.type === 'credit' ? 'Credit • Auto-credited' : `Debit • ${tx.source}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Quick Status & Senior Shield Module (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-6 bg-[#131b2e] border border-[#1E293B] rounded-2xl shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Trusted Contacts</h2>
              <span className="text-xs text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                Active Shield
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-sm">
                  KD
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">Mother Kamala Devi</span>
                  <span className="text-[11px] text-slate-400">
                    Samsung Galaxy M33 • +91 98*** 4210
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 pt-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Device Security:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">security</span> Safe
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Suspicious SMS (48h):</span>
                  <span className="text-emerald-400 font-bold">0 Detected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">UPI Daily Transfer Cap:</span>
                  <span className="text-white font-semibold">₹5,000 Lock Active</span>
                </div>
              </div>
            </div>

            {/* Electricity Scam Alert Banner */}
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-700/50 text-red-200 flex items-start gap-3">
              <span className="material-symbols-outlined text-red-400 text-[22px] flex-shrink-0 mt-0.5">
                gshield
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-red-200">Electricity Bill Scam Alert</span>
                <p className="text-xs text-red-300/90 leading-tight">
                  Scammers sending fake SMS asking to update TNEB meters via APK downloads.
                  Suraksha Money automatically blocks malicious download triggers.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('senior-friendly-mode')}
              className="w-full py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-xs hover:bg-[#334155] transition-colors font-bold flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px] text-teal-400">verified</span>
              <span>Open Senior Safety Center</span>
            </button>
          </div>

          {/* Quick Protection Controls */}
          <div className="p-5 bg-[#131b2e] border border-[#1E293B] rounded-2xl shadow-lg flex flex-col gap-2">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Quick Protection Controls
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onToggleFreezeUpi}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  isUpiFrozen
                    ? 'bg-red-950/80 border-red-500/60 text-red-200'
                    : 'bg-[#1E293B] hover:bg-[#334155] border-[#334155]'
                }`}
              >
                <span className="material-symbols-outlined text-teal-400 text-[20px]">
                  {isUpiFrozen ? 'lock' : 'lock_clock'}
                </span>
                <span className="text-xs font-bold text-white">
                  {isUpiFrozen ? 'Unfreeze UPI' : 'Freeze UPI'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isUpiFrozen ? 'Resume debits' : 'Pause instant debit'}
                </span>
              </button>
              <button
                onClick={handleVoiceQuickAssist}
                className="p-3 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-left flex flex-col gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-emerald-400 text-[20px]">
                  record_voice_over
                </span>
                <span className="text-xs font-bold text-white">Voice Assist</span>
                <span className="text-[10px] text-slate-400">Speak in Hindi / Tamil</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
