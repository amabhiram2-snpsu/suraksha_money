import React, { useState } from 'react';
import { ViewMode, SavingsGoal } from '../types';

interface SavingsGoalsViewProps {
  onNavigate: (view: ViewMode) => void;
  goals: SavingsGoal[];
  onAddGoal: (goal: SavingsGoal) => void;
  onUpdateGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (id: string) => void;
  onConfirmSavingsMonth: (goalId: string, amount: number) => void;
}

export const SavingsGoalsView: React.FC<SavingsGoalsViewProps> = ({
  onNavigate,
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  onConfirmSavingsMonth,
}) => {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [guardianLocked, setGuardianLocked] = useState(true);

  // Manual monthly confirmation prompt state
  const [confirmGoalId, setConfirmGoalId] = useState<string | null>(null);
  const [confirmAmount, setConfirmAmount] = useState('4000');
  const [toast, setToast] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingGoal(null);
    setGoalTitle('');
    setGoalCategory('General Family Target');
    setTargetAmount('');
    setTargetDate('Dec 2026');
    setMonthlyContribution('2500');
    setGuardianLocked(true);
    setShowGoalModal(true);
  };

  const openEditModal = (g: SavingsGoal) => {
    setEditingGoal(g);
    setGoalTitle(g.title);
    setGoalCategory(g.category);
    setTargetAmount(g.targetAmount.toString());
    setTargetDate(g.targetDate);
    setMonthlyContribution(g.monthlyContribution.toString());
    setGuardianLocked(!!g.guardianLocked);
    setShowGoalModal(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !targetAmount) return;
    const targetNum = parseFloat(targetAmount) || 0;
    const monthlyNum = parseFloat(monthlyContribution) || 2000;

    if (editingGoal) {
      onUpdateGoal({
        ...editingGoal,
        title: goalTitle,
        category: goalCategory || 'General Family Target',
        targetAmount: targetNum,
        targetDate: targetDate || '2026',
        monthlyContribution: monthlyNum,
        guardianLocked,
      });
      setToast(`Savings Goal "${goalTitle}" updated.`);
    } else {
      onAddGoal({
        id: `goal_${Date.now()}`,
        title: goalTitle,
        category: goalCategory || 'General Family Target',
        currentAmount: 0,
        targetAmount: targetNum,
        targetDate: targetDate || '2026',
        monthlyContribution: monthlyNum,
        status: 'in-progress',
        guardianLocked,
      });
      setToast(`Savings Goal "${goalTitle}" created successfully.`);
    }

    setShowGoalModal(false);
    setTimeout(() => setToast(null), 3500);
  };

  const handleDelete = (g: SavingsGoal) => {
    if (window.confirm(`Are you sure you want to remove the plan "${g.title}"?`)) {
      onDeleteGoal(g.id);
      setToast(`Plan "${g.title}" has been removed.`);
      setTimeout(() => setToast(null), 3500);
    }
  };

  const handleManualConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmGoalId) return;
    const added = parseFloat(confirmAmount) || 0;
    onConfirmSavingsMonth(confirmGoalId, added);
    setConfirmGoalId(null);
    setToast(`Verified: ₹${added.toLocaleString()} added to monthly goal tally.`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-16">
      {/* Header */}
      <div className="bg-[#131b2e] border border-[#1E293B] p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20">
              Discipline Engine
            </span>
            <span className="text-xs text-slate-400">Specification 6.6</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Dedicated Savings &amp; Family Wealth Goals</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Add, update, or remove wealth targets. Explicit monthly manual confirmation ensures zero false assumptions.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Create New Goal</span>
        </button>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in shadow-lg">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          {toast}
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((g) => {
          const progress = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
          return (
            <div
              key={g.id}
              className="bg-[#131b2e] border border-[#1E293B] hover:border-[#334155] rounded-2xl p-6 shadow-lg flex flex-col justify-between gap-5 transition-all"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                      <span className="material-symbols-outlined text-[22px]">
                        {g.guardianLocked ? 'lock' : 'savings'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{g.title}</h3>
                      <p className="text-xs text-slate-400">{g.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                      {progress}% Funded
                    </span>
                    <button
                      onClick={() => openEditModal(g)}
                      className="p-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-slate-300 hover:text-white transition-colors"
                      title="Edit Goal"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(g)}
                      className="p-1.5 rounded-lg bg-[#1E293B] hover:bg-red-950 text-slate-400 hover:text-red-400 transition-colors"
                      title="Remove Goal"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 my-4">
                  <div className="w-full bg-[#1E293B] h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(79,219,200,0.5)]"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-white">₹{g.currentAmount.toLocaleString()} saved</span>
                    <span>Target: ₹{g.targetAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-[#1E293B] rounded-xl border border-[#334155] text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Monthly Planned</span>
                    <span className="font-bold text-white">₹{g.monthlyContribution.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Milestone Target</span>
                    <span className="font-bold text-teal-300">{g.targetDate}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between">
                <button
                  onClick={() => {
                    setConfirmGoalId(g.id);
                    setConfirmAmount(g.monthlyContribution.toString());
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-teal-400">
                    check_circle
                  </span>
                  <span>Confirm Actual Saved This Month</span>
                </button>
                {progress >= 100 && (
                  <button
                    onClick={() => onNavigate('stock-research')}
                    className="text-xs text-emerald-400 font-bold hover:underline"
                  >
                    Explore Research Candidates →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Monthly Confirmation Modal */}
      {confirmGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleManualConfirmSubmit}
            className="w-full max-w-md bg-[#131b2e] border border-[#334155] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-xs"
          >
            <h3 className="text-base font-bold text-white">Manual Monthly Savings Confirmation</h3>
            <p className="text-slate-300 leading-relaxed">
              Rule 6.6: Suraksha Money never assumes your savings succeeded just because the month ended.
              Confirm the exact rupees you successfully moved into your vault.
            </p>
            <div>
              <label className="text-slate-300 block mb-1">Amount Actually Deposited (₹)</label>
              <input
                type="number"
                value={confirmAmount}
                onChange={(e) => setConfirmAmount(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white text-sm font-bold"
                required
              />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setConfirmGoalId(null)}
                className="px-4 py-2 rounded-lg bg-[#1E293B] text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-teal-400 text-slate-950 font-bold"
              >
                Confirm Deposit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goal Add / Edit Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveGoal}
            className="w-full max-w-md bg-[#131b2e] border border-[#334155] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-xs"
          >
            <h3 className="text-base font-bold text-white">
              {editingGoal ? 'Change / Edit Savings Goal' : 'Create New Savings Goal'}
            </h3>
            <div>
              <label className="text-slate-300 block mb-1">Goal Title</label>
              <input
                type="text"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="e.g. 3-Month Emergency Fund, Daughter Higher Ed, Gold SIP"
                className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Category / Tag</label>
              <input
                type="text"
                value={goalCategory}
                onChange={(e) => setGoalCategory(e.target.value)}
                placeholder="e.g. Healthcare, Education, Liquid Gold, Vehicle"
                className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="100000"
                  className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Monthly Planned (₹)</label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="3000"
                  className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white font-bold"
                />
              </div>
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Target Date</label>
              <input
                type="text"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                placeholder="e.g. March 2026"
                className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white"
              />
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-[#060e20] rounded-xl border border-slate-700">
              <input
                type="checkbox"
                id="guardianLockGoal"
                checked={guardianLocked}
                onChange={(e) => setGuardianLocked(e.target.checked)}
                className="w-4 h-4 text-teal-400 rounded"
              />
              <label htmlFor="guardianLockGoal" className="text-slate-300 text-[11px] cursor-pointer">
                Require guardian co-approval before premature withdrawal
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowGoalModal(false)}
                className="px-4 py-2 rounded-lg bg-[#1E293B] text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-teal-400 text-slate-950 font-bold"
              >
                {editingGoal ? 'Update Goal' : 'Save Goal'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
