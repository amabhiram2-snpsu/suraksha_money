import React, { useState } from 'react';
import { ViewMode, ExpenseItem } from '../types';

interface EmergencyFundViewProps {
  onNavigate: (view: ViewMode) => void;
  expenses: ExpenseItem[];
}

export const EmergencyFundView: React.FC<EmergencyFundViewProps> = ({
  onNavigate,
  expenses,
}) => {
  const [monthsOfCoverage, setMonthsOfCoverage] = useState(3);
  const [currentSaved, setCurrentSaved] = useState(20000);
  const [monthlyContribution, setMonthlyContribution] = useState(4000);
  const [toast, setToast] = useState<string | null>(null);

  // Compute essential monthly expenses
  const monthlyEssential = expenses
    .filter((e) => e.type === 'essential')
    .reduce((acc, curr) => acc + curr.amount, 0) || 21900;

  const targetAmount = monthlyEssential * monthsOfCoverage;
  const remainingNeeded = Math.max(0, targetAmount - currentSaved);
  const monthsToTarget = monthlyContribution > 0 ? Math.ceil(remainingNeeded / monthlyContribution) : 0;
  const percentageFunded = Math.min(100, Math.round((currentSaved / targetAmount) * 100));

  const handleDepositSimulate = () => {
    setCurrentSaved((prev) => prev + 2000);
    setToast('Deposited ₹2,000 into ICICI Liquid Medical Vault. New balance: ₹' + (currentSaved + 2000).toLocaleString());
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-16">
      {/* Header */}
      <div className="bg-[#131b2e] border border-[#1E293B] p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20">
              Capital Preservation Vault
            </span>
            <span className="text-xs text-slate-400">Specification 6.5</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Medical &amp; Household Emergency Fund Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Calibrated exclusively against your essential living and elder healthcare costs.
          </p>
        </div>
        <button
          onClick={handleDepositSimulate}
          className="px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Add ₹2,000 to Vault</span>
        </button>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          {toast}
        </div>
      )}

      {/* Main Coverage Interactive Slider & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Slider & Math (7 cols) */}
        <div className="lg:col-span-7 bg-[#131b2e] border border-[#1E293B] rounded-2xl p-6 shadow-lg flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Months of Essential Living Coverage
              </span>
              <span className="text-xl font-extrabold text-teal-400 bg-[#1E293B] px-3 py-1 rounded-xl border border-[#334155]">
                {monthsOfCoverage} Months
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="12"
              value={monthsOfCoverage}
              onChange={(e) => setMonthsOfCoverage(parseInt(e.target.value, 10))}
              className="w-full h-3 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
              <span>1 Month (₹{monthlyEssential.toLocaleString()})</span>
              <span>3 Mos (Recommended)</span>
              <span>6 Mos (Standard)</span>
              <span>12 Mos (Ironclad)</span>
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              <div className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155]">
                <span className="text-[11px] text-slate-400 block">Essential Monthly Burn</span>
                <span className="text-lg font-bold text-white mt-1 block">
                  ₹{monthlyEssential.toLocaleString()}
                </span>
                <span className="text-[10px] text-teal-400 font-mono">Calculated</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155]">
                <span className="text-[11px] text-slate-400 block">Recommended Target</span>
                <span className="text-lg font-extrabold text-teal-300 mt-1 block">
                  ₹{targetAmount.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">({monthsOfCoverage}x burn)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155]">
                <span className="text-[11px] text-slate-400 block">Existing Reserves</span>
                <span className="text-lg font-bold text-emerald-400 mt-1 block">
                  ₹{currentSaved.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-300 font-semibold">{percentageFunded}% Funded</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Vault Progress</span>
              <span className="text-teal-400 font-bold">{percentageFunded}% complete</span>
            </div>
            <div className="w-full bg-[#1E293B] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#334155]">
              <div
                className="bg-teal-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(79,219,200,0.6)]"
                style={{ width: `${percentageFunded}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
              <span>₹{currentSaved.toLocaleString()} saved in ICICI Liquid Vault</span>
              <span>Remaining gap: ₹{remainingNeeded.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right: Timeline Estimator & Discipline Rules (5 cols) */}
        <div className="lg:col-span-5 bg-[#131b2e] border border-[#1E293B] rounded-2xl p-6 shadow-lg flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-400 text-[20px]">
                schedule
              </span>
              Contribution &amp; Target Horizon
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Adjust monthly transfer pace from available balance
            </p>

            <div className="mt-4 p-4 rounded-xl bg-[#1E293B] border border-[#334155] flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Monthly Contribution:</span>
                <span className="font-extrabold text-white text-base">
                  ₹{monthlyContribution.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#060e20] rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
              <div className="p-3 bg-[#060e20] rounded-lg border border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-400">Estimated Milestone Date:</span>
                <span className="text-emerald-400 font-bold">
                  {monthsToTarget > 0 ? `${monthsToTarget} Months (July 2025)` : 'Goal Reached!'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/30 text-xs text-slate-300 flex flex-col gap-1.5 leading-relaxed">
            <span className="font-bold text-teal-300 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              Capital Preservation Principle (Rule #6.5)
            </span>
            <p className="text-[11px] text-slate-400">
              Emergency funds should prioritize zero capital loss and same-day liquidity over market
              returns. Funds reside in RBI-regulated overnight liquid debt accounts or bank sweep
              deposits with senior guardian lock.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
