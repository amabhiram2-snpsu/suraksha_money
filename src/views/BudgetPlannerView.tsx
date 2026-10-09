import React, { useState } from 'react';
import { ViewMode, IncomeItem, ExpenseItem, DebtItem, SavingsGoal } from '../types';

interface BudgetPlannerViewProps {
  onNavigate: (view: ViewMode) => void;
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  debts: DebtItem[];
  goals: SavingsGoal[];
  onAddIncome: (inc: IncomeItem) => void;
  onUpdateIncome: (inc: IncomeItem) => void;
  onDeleteIncome: (id: string) => void;
  onAddExpense: (exp: ExpenseItem) => void;
  onUpdateExpense: (exp: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
  onAddDebt: (debt: DebtItem) => void;
  onUpdateDebt: (debt: DebtItem) => void;
  onDeleteDebt: (id: string) => void;
  onAddGoal: (goal: SavingsGoal) => void;
  onUpdateGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (id: string) => void;
}

export const BudgetPlannerView: React.FC<BudgetPlannerViewProps> = ({
  onNavigate,
  incomes,
  expenses,
  debts,
  goals,
  onAddIncome,
  onUpdateIncome,
  onDeleteIncome,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onAddDebt,
  onUpdateDebt,
  onDeleteDebt,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'incomes' | 'expenses' | 'debts' | 'plans'>('overview');

  // Income modal state
  const [editingIncome, setEditingIncome] = useState<IncomeItem | null>(null);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [incSource, setIncSource] = useState('');
  const [incAmount, setIncAmount] = useState('');
  const [incType, setIncType] = useState<IncomeItem['type']>('salary');

  // Expense modal state
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCat, setExpCat] = useState<ExpenseItem['category']>('groceries');
  const [expType, setExpType] = useState<'essential' | 'discretionary'>('essential');
  const [expRecurring, setExpRecurring] = useState(true);

  // Debt modal state
  const [editingDebt, setEditingDebt] = useState<DebtItem | null>(null);
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [debtTitle, setDebtTitle] = useState('');
  const [debtEmi, setDebtEmi] = useState('');
  const [debtIncluded, setDebtIncluded] = useState(false);
  const [debtBalance, setDebtBalance] = useState('');

  // Plan/Goal modal state
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState('');
  const [goalTargetAmount, setGoalTargetAmount] = useState('');
  const [goalTargetDate, setGoalTargetDate] = useState('');
  const [goalMonthlyContribution, setGoalMonthlyContribution] = useState('');
  const [goalGuardianLocked, setGoalGuardianLocked] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Deterministic calculation from Specification 6.2
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const essentialExpenses = expenses
    .filter((e) => e.type === 'essential')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const discretionaryExpenses = expenses
    .filter((e) => e.type === 'discretionary')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = essentialExpenses + discretionaryExpenses;

  // Separate debt deductions: Only subtract debts where includedInExpenses = false
  const separateDebtObligations = debts
    .filter((d) => !d.includedInExpenses)
    .reduce((acc, curr) => acc + curr.monthlyRepayment, 0);

  const availableBalance = totalIncome - totalExpenses - separateDebtObligations;
  const totalPlannedSavings = goals.reduce((acc, curr) => acc + curr.monthlyContribution, 0);

  // Income Handlers
  const openNewIncomeModal = () => {
    setEditingIncome(null);
    setIncSource('');
    setIncAmount('');
    setIncType('salary');
    setShowIncomeModal(true);
  };

  const openEditIncomeModal = (inc: IncomeItem) => {
    setEditingIncome(inc);
    setIncSource(inc.source);
    setIncAmount(inc.amount.toString());
    setIncType(inc.type);
    setShowIncomeModal(true);
  };

  const handleSaveIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incSource || !incAmount) return;
    const amountNum = parseFloat(incAmount) || 0;

    if (editingIncome) {
      onUpdateIncome({
        ...editingIncome,
        source: incSource,
        amount: amountNum,
        type: incType,
      });
      showToast(`Income "${incSource}" updated to ₹${amountNum.toLocaleString()}.`);
    } else {
      onAddIncome({
        id: `inc_${Date.now()}`,
        source: incSource,
        amount: amountNum,
        type: incType,
        date: new Date().toISOString().split('T')[0],
        verified: true,
      });
      showToast(`Income source "${incSource}" added (₹${amountNum.toLocaleString()}).`);
    }
    setShowIncomeModal(false);
  };

  const handleDeleteIncome = (inc: IncomeItem) => {
    if (window.confirm(`Are you sure you want to remove income source "${inc.source}"?`)) {
      onDeleteIncome(inc.id);
      showToast(`Income "${inc.source}" removed.`);
    }
  };

  // Expense Handlers
  const openNewExpenseModal = () => {
    setEditingExpense(null);
    setExpTitle('');
    setExpAmount('');
    setExpCat('groceries');
    setExpType('essential');
    setExpRecurring(true);
    setShowExpenseModal(true);
  };

  const openEditExpenseModal = (exp: ExpenseItem) => {
    setEditingExpense(exp);
    setExpTitle(exp.title);
    setExpAmount(exp.amount.toString());
    setExpCat(exp.category);
    setExpType(exp.type);
    setExpRecurring(exp.isRecurring);
    setShowExpenseModal(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;
    const amountNum = parseFloat(expAmount) || 0;

    if (editingExpense) {
      onUpdateExpense({
        ...editingExpense,
        title: expTitle,
        amount: amountNum,
        category: expCat,
        type: expType,
        isRecurring: expRecurring,
      });
      showToast(`Expense "${expTitle}" updated to ₹${amountNum.toLocaleString()}.`);
    } else {
      onAddExpense({
        id: `exp_${Date.now()}`,
        title: expTitle,
        amount: amountNum,
        category: expCat,
        type: expType,
        isRecurring: expRecurring,
        date: new Date().toISOString().split('T')[0],
      });
      showToast(`Expense "${expTitle}" added (₹${amountNum.toLocaleString()}).`);
    }
    setShowExpenseModal(false);
  };

  const handleDeleteExpense = (exp: ExpenseItem) => {
    if (window.confirm(`Are you sure you want to remove expense "${exp.title}"?`)) {
      onDeleteExpense(exp.id);
      showToast(`Expense "${exp.title}" removed.`);
    }
  };

  // Debt Handlers
  const openNewDebtModal = () => {
    setEditingDebt(null);
    setDebtTitle('');
    setDebtEmi('');
    setDebtIncluded(false);
    setDebtBalance('');
    setShowDebtModal(true);
  };

  const openEditDebtModal = (d: DebtItem) => {
    setEditingDebt(d);
    setDebtTitle(d.title);
    setDebtEmi(d.monthlyRepayment.toString());
    setDebtIncluded(d.includedInExpenses);
    setDebtBalance(d.outstandingBalance.toString());
    setShowDebtModal(true);
  };

  const handleSaveDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtTitle || !debtEmi) return;
    const emiNum = parseFloat(debtEmi) || 0;
    const balanceNum = parseFloat(debtBalance) || 0;

    if (editingDebt) {
      onUpdateDebt({
        ...editingDebt,
        title: debtTitle,
        monthlyRepayment: emiNum,
        includedInExpenses: debtIncluded,
        outstandingBalance: balanceNum,
      });
      showToast(`Debt plan "${debtTitle}" updated.`);
    } else {
      onAddDebt({
        id: `debt_${Date.now()}`,
        title: debtTitle,
        monthlyRepayment: emiNum,
        includedInExpenses: debtIncluded,
        outstandingBalance: balanceNum,
      });
      showToast(`Debt plan "${debtTitle}" added.`);
    }
    setShowDebtModal(false);
  };

  const handleDeleteDebt = (d: DebtItem) => {
    if (window.confirm(`Are you sure you want to remove debt plan "${d.title}"?`)) {
      onDeleteDebt(d.id);
      showToast(`Debt plan "${d.title}" removed.`);
    }
  };

  // Goal / Plan Handlers
  const openNewGoalModal = () => {
    setEditingGoal(null);
    setGoalTitle('');
    setGoalCategory('General Family Target');
    setGoalTargetAmount('');
    setGoalTargetDate('Dec 2026');
    setGoalMonthlyContribution('3000');
    setGoalGuardianLocked(true);
    setShowGoalModal(true);
  };

  const openEditGoalModal = (g: SavingsGoal) => {
    setEditingGoal(g);
    setGoalTitle(g.title);
    setGoalCategory(g.category);
    setGoalTargetAmount(g.targetAmount.toString());
    setGoalTargetDate(g.targetDate);
    setGoalMonthlyContribution(g.monthlyContribution.toString());
    setGoalGuardianLocked(!!g.guardianLocked);
    setShowGoalModal(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !goalTargetAmount) return;
    const targetNum = parseFloat(goalTargetAmount) || 0;
    const monthlyNum = parseFloat(goalMonthlyContribution) || 0;

    if (editingGoal) {
      onUpdateGoal({
        ...editingGoal,
        title: goalTitle,
        category: goalCategory,
        targetAmount: targetNum,
        targetDate: goalTargetDate,
        monthlyContribution: monthlyNum,
        guardianLocked: goalGuardianLocked,
      });
      showToast(`Plan "${goalTitle}" updated.`);
    } else {
      onAddGoal({
        id: `goal_${Date.now()}`,
        title: goalTitle,
        category: goalCategory || 'General Family Target',
        currentAmount: 0,
        targetAmount: targetNum,
        targetDate: goalTargetDate || '2026',
        monthlyContribution: monthlyNum,
        status: 'in-progress',
        guardianLocked: goalGuardianLocked,
      });
      showToast(`New savings plan "${goalTitle}" created.`);
    }
    setShowGoalModal(false);
  };

  const handleDeleteGoal = (g: SavingsGoal) => {
    if (window.confirm(`Are you sure you want to remove plan "${g.title}"?`)) {
      onDeleteGoal(g.id);
      showToast(`Plan "${g.title}" removed.`);
    }
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-16">
      {/* Header with Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131b2e] border border-[#1E293B] p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20">
              Interactive Financial Engine
            </span>
            <span className="text-xs text-slate-400">Full Edit &amp; Plan Control</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Manage Income, Expenses &amp; Plans</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Add, edit, or remove any income source, recurring expense, loan EMI, or savings target.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openNewIncomeModal}
            className="px-3 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>+ Add Income</span>
          </button>
          <button
            onClick={openNewExpenseModal}
            className="px-3 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px] text-teal-400">add</span>
            <span>+ Add Expense</span>
          </button>
          <button
            onClick={openNewGoalModal}
            className="px-3 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-400">add</span>
            <span>+ Add Plan / Goal</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in shadow-lg">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          {toastMessage}
        </div>
      )}

      {/* Calculated Metric Strip (Always dynamically recalculated!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#131b2e] border border-[#1E293B] rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Monthly Inflow</span>
            <span className="px-2 py-0.5 bg-slate-800 text-teal-300 rounded font-mono text-[10px]">
              Calculated
            </span>
          </div>
          <p className="text-2xl font-extrabold text-white">₹{totalIncome.toLocaleString()}</p>
          <div className="flex items-center justify-between text-[11px] text-emerald-400 mt-1">
            <span>{incomes.length} Source(s)</span>
            <button
              onClick={() => setActiveTab('incomes')}
              className="text-teal-400 hover:underline font-semibold"
            >
              Manage &rarr;
            </button>
          </div>
        </div>

        <div className="p-5 bg-[#131b2e] border border-[#1E293B] rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Monthly Expenses</span>
            <span className="px-2 py-0.5 bg-slate-800 text-teal-300 rounded font-mono text-[10px]">
              Calculated
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-200">₹{totalExpenses.toLocaleString()}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
            <span>Essential: ₹{essentialExpenses.toLocaleString()}</span>
            <button
              onClick={() => setActiveTab('expenses')}
              className="text-teal-400 hover:underline font-semibold"
            >
              Manage &rarr;
            </button>
          </div>
        </div>

        <div className="p-5 bg-[#131b2e] border border-[#1E293B] rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Separate Debt EMIs</span>
            <span className="px-2 py-0.5 bg-slate-800 text-teal-300 rounded font-mono text-[10px]">
              Calculated
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-200">₹{separateDebtObligations.toLocaleString()}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
            <span>{debts.length} Loan(s)</span>
            <button
              onClick={() => setActiveTab('debts')}
              className="text-teal-400 hover:underline font-semibold"
            >
              Manage &rarr;
            </button>
          </div>
        </div>

        <div className="p-5 bg-[#131b2e] border border-[#1E293B] rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Net Available Balance</span>
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded font-mono text-[10px]">
              Calculated
            </span>
          </div>
          <p
            className={`text-2xl font-extrabold ${
              availableBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            ₹{availableBalance.toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
            <span>Planned Save: ₹{totalPlannedSavings.toLocaleString()}</span>
            <button
              onClick={() => setActiveTab('plans')}
              className="text-teal-400 hover:underline font-semibold"
            >
              Plans &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1E293B] pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'All Items & Summary', icon: 'dashboard' },
          { id: 'incomes', label: `Income Sources (${incomes.length})`, icon: 'payments' },
          { id: 'expenses', label: `Expenses (${expenses.length})`, icon: 'receipt_long' },
          { id: 'debts', label: `Debt & EMIs (${debts.length})`, icon: 'account_balance' },
          { id: 'plans', label: `Savings Plans & Goals (${goals.length})`, icon: 'savings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-teal-400 text-slate-950 font-bold shadow-md'
                : 'bg-[#131b2e] text-slate-400 hover:text-white border border-[#1E293B]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: INCOMES */}
      {(activeTab === 'incomes' || activeTab === 'overview') && (
        <div className="bg-[#131b2e] border border-[#1E293B] rounded-2xl p-5 flex flex-col gap-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-400 text-[20px]">payments</span>
                Income Sources (Total: ₹{totalIncome.toLocaleString()})
              </h3>
              <p className="text-xs text-slate-400">Add salary, pension, freelance, or rental inflows</p>
            </div>
            <button
              onClick={openNewIncomeModal}
              className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-teal-300 text-xs font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Income</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {incomes.map((inc) => (
              <div
                key={inc.id}
                className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      {inc.type === 'pension' ? 'account_balance' : 'wallet'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{inc.source}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 capitalize">
                        {inc.type}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">Credited {inc.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-extrabold text-emerald-400">
                    +₹{inc.amount.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditIncomeModal(inc)}
                      className="p-1.5 rounded-lg bg-[#334155] hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                      title="Edit Income"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteIncome(inc)}
                      className="p-1.5 rounded-lg bg-[#334155] hover:bg-red-900/60 text-slate-300 hover:text-red-400 transition-colors"
                      title="Remove Income"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: EXPENSES */}
      {(activeTab === 'expenses' || activeTab === 'overview') && (
        <div className="bg-[#131b2e] border border-[#1E293B] rounded-2xl p-5 flex flex-col gap-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-400 text-[20px]">receipt_long</span>
                Monthly Expenses (Total: ₹{totalExpenses.toLocaleString()})
              </h3>
              <p className="text-xs text-slate-400">
                Essential: ₹{essentialExpenses.toLocaleString()} · Discretionary: ₹{discretionaryExpenses.toLocaleString()}
              </p>
            </div>
            <button
              onClick={openNewExpenseModal}
              className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-teal-300 text-xs font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Expense</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {expenses.map((exp) => (
              <div
                key={exp.id}
                className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      exp.type === 'essential'
                        ? 'bg-teal-500/20 border border-teal-500/40 text-teal-300'
                        : 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {exp.category === 'healthcare'
                        ? 'medication'
                        : exp.category === 'groceries'
                        ? 'shopping_cart'
                        : exp.category === 'housing'
                        ? 'home'
                        : exp.category === 'transport'
                        ? 'directions_car'
                        : 'local_mall'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{exp.title}</span>
                      <span
                        className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                          exp.type === 'essential'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {exp.type}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5 capitalize">
                      Category: {exp.category} {exp.isRecurring ? '• Recurring' : '• One-off'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-extrabold text-white">
                    ₹{exp.amount.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditExpenseModal(exp)}
                      className="p-1.5 rounded-lg bg-[#334155] hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                      title="Edit Expense"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(exp)}
                      className="p-1.5 rounded-lg bg-[#334155] hover:bg-red-900/60 text-slate-300 hover:text-red-400 transition-colors"
                      title="Remove Expense"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: DEBTS */}
      {(activeTab === 'debts' || activeTab === 'overview') && (
        <div className="bg-[#131b2e] border border-[#1E293B] rounded-2xl p-5 flex flex-col gap-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-[20px]">account_balance</span>
                Debt Obligations &amp; Loans (Total EMI: ₹{debts.reduce((a, b) => a + b.monthlyRepayment, 0).toLocaleString()})
              </h3>
              <p className="text-xs text-slate-400">Double-counting prevention rule enforced</p>
            </div>
            <button
              onClick={openNewDebtModal}
              className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-amber-300 text-xs font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Debt Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {debts.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-between gap-4"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{d.title}</span>
                    {d.includedInExpenses ? (
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-teal-950 text-teal-300 border border-teal-500/40">
                        Merged in Expenses
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">
                        Separate Subtraction
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5">
                    Outstanding Balance: ₹{d.outstandingBalance.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-amber-300 block">
                      ₹{d.monthlyRepayment.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400">/ month</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditDebtModal(d)}
                      className="p-1.5 rounded-lg bg-[#334155] hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                      title="Edit Debt"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteDebt(d)}
                      className="p-1.5 rounded-lg bg-[#334155] hover:bg-red-900/60 text-slate-300 hover:text-red-400 transition-colors"
                      title="Remove Debt"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PLANS & SAVINGS GOALS */}
      {(activeTab === 'plans' || activeTab === 'overview') && (
        <div className="bg-[#131b2e] border border-[#1E293B] rounded-2xl p-5 flex flex-col gap-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[20px]">savings</span>
                Savings Goals &amp; Wealth Plans ({goals.length} Active Plans)
              </h3>
              <p className="text-xs text-slate-400">Monthly target allocation: ₹{totalPlannedSavings.toLocaleString()}</p>
            </div>
            <button
              onClick={openNewGoalModal}
              className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-emerald-300 text-xs font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Create Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((g) => {
              const progress = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
              return (
                <div
                  key={g.id}
                  className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{g.title}</span>
                        {g.guardianLocked && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                            Locked
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 block mt-0.5">{g.category}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditGoalModal(g)}
                        className="p-1.5 rounded-lg bg-[#334155] hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                        title="Edit Plan"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(g)}
                        className="p-1.5 rounded-lg bg-[#334155] hover:bg-red-900/60 text-slate-300 hover:text-red-400 transition-colors"
                        title="Remove Plan"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="w-full bg-[#060e20] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                      <span className="text-white font-bold">₹{g.currentAmount.toLocaleString()} saved</span>
                      <span>Target: ₹{g.targetAmount.toLocaleString()} ({progress}%)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#334155] text-xs">
                    <span className="text-slate-400">Monthly: ₹{g.monthlyContribution.toLocaleString()}</span>
                    <span className="text-teal-300 font-semibold">Target: {g.targetDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD/EDIT INCOME */}
      {showIncomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveIncome}
            className="w-full max-w-md bg-[#131b2e] border border-[#334155] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-xs"
          >
            <h3 className="text-base font-bold text-white">
              {editingIncome ? 'Edit Income Source' : 'Add New Income Source'}
            </h3>
            <div>
              <label className="text-slate-300 block mb-1">Source Name</label>
              <input
                type="text"
                value={incSource}
                onChange={(e) => setIncSource(e.target.value)}
                placeholder="e.g. Primary Salary, Mother Pension, Rental"
                className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Monthly Amount (₹)</label>
              <input
                type="number"
                value={incAmount}
                onChange={(e) => setIncAmount(e.target.value)}
                placeholder="35000"
                className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white font-bold"
                required
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Income Type</label>
              <select
                value={incType}
                onChange={(e) => setIncType(e.target.value as any)}
                className="w-full h-10 px-2 rounded-lg bg-[#1E293B] border border-[#334155] text-white"
              >
                <option value="salary">Salary (Regular)</option>
                <option value="pension">Pension (Senior)</option>
                <option value="freelance">Freelance / Gig</option>
                <option value="investment">Investment / Dividend</option>
                <option value="other">Other Inflow</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowIncomeModal(false)}
                className="px-4 py-2 rounded-lg bg-[#1E293B] text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-teal-400 text-slate-950 font-bold"
              >
                {editingIncome ? 'Update Income' : 'Save Income'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: ADD/EDIT EXPENSE */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveExpense}
            className="w-full max-w-md bg-[#131b2e] border border-[#334155] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-xs"
          >
            <h3 className="text-base font-bold text-white">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h3>
            <div>
              <label className="text-slate-300 block mb-1">Expense Title</label>
              <input
                type="text"
                value={expTitle}
                onChange={(e) => setExpTitle(e.target.value)}
                placeholder="e.g. Groceries & Ration, Electricity Bill"
                className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Monthly Amount (₹)</label>
              <input
                type="number"
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                placeholder="2500"
                className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white font-bold"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">Category</label>
                <select
                  value={expCat}
                  onChange={(e) => setExpCat(e.target.value as any)}
                  className="w-full h-10 px-2 rounded-lg bg-[#1E293B] border border-[#334155] text-white"
                >
                  <option value="groceries">Groceries &amp; Food</option>
                  <option value="housing">Housing, Rent &amp; Utilities</option>
                  <option value="healthcare">Elder Healthcare &amp; Meds</option>
                  <option value="transport">Transport &amp; Fuel</option>
                  <option value="education">Education</option>
                  <option value="discretionary">Discretionary / Leisure</option>
                  <option value="shopping">Shopping</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Type</label>
                <select
                  value={expType}
                  onChange={(e) => setExpType(e.target.value as any)}
                  className="w-full h-10 px-2 rounded-lg bg-[#1E293B] border border-[#334155] text-white"
                >
                  <option value="essential">Essential (Need)</option>
                  <option value="discretionary">Discretionary (Want)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recCheck"
                checked={expRecurring}
                onChange={(e) => setExpRecurring(e.target.checked)}
                className="w-4 h-4 text-teal-400 rounded"
              />
              <label htmlFor="recCheck" className="text-slate-300 cursor-pointer">
                Monthly Recurring Outlay
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowExpenseModal(false)}
                className="px-4 py-2 rounded-lg bg-[#1E293B] text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-teal-400 text-slate-950 font-bold"
              >
                {editingExpense ? 'Update Expense' : 'Save Expense'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: ADD/EDIT DEBT */}
      {showDebtModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveDebt}
            className="w-full max-w-md bg-[#131b2e] border border-[#334155] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-xs"
          >
            <h3 className="text-base font-bold text-white">
              {editingDebt ? 'Edit Debt / Loan Plan' : 'Add Loan / Debt Obligation'}
            </h3>
            <div>
              <label className="text-slate-300 block mb-1">Loan Title</label>
              <input
                type="text"
                value={debtTitle}
                onChange={(e) => setDebtTitle(e.target.value)}
                placeholder="e.g. Scooter EMI, Home Loan"
                className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Monthly Repayment (₹)</label>
              <input
                type="number"
                value={debtEmi}
                onChange={(e) => setDebtEmi(e.target.value)}
                placeholder="2800"
                className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white font-bold"
                required
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Outstanding Principal (₹)</label>
              <input
                type="number"
                value={debtBalance}
                onChange={(e) => setDebtBalance(e.target.value)}
                placeholder="32000"
                className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white"
              />
            </div>
            <div className="p-3 bg-[#060e20] rounded-xl border border-slate-700 flex items-center gap-3">
              <input
                type="checkbox"
                id="editDebtIncluded"
                checked={debtIncluded}
                onChange={(e) => setDebtIncluded(e.target.checked)}
                className="w-4 h-4 text-teal-400 rounded"
              />
              <label htmlFor="editDebtIncluded" className="text-slate-300 text-[11px] cursor-pointer">
                <strong>Already included in essential expenses?</strong> (Prevents double counting
                in available balance)
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowDebtModal(false)}
                className="px-4 py-2 rounded-lg bg-[#1E293B] text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-teal-400 text-slate-950 font-bold"
              >
                {editingDebt ? 'Update Loan' : 'Save Loan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: ADD/EDIT SAVINGS GOAL / PLAN */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveGoal}
            className="w-full max-w-md bg-[#131b2e] border border-[#334155] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-xs"
          >
            <h3 className="text-base font-bold text-white">
              {editingGoal ? 'Edit Savings Plan / Goal' : 'Create New Savings Plan / Goal'}
            </h3>
            <div>
              <label className="text-slate-300 block mb-1">Plan Title</label>
              <input
                type="text"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="e.g. 3-Month Emergency Fund, Daughter Higher Ed"
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
                placeholder="e.g. Healthcare, Education, Liquid Gold"
                className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  value={goalTargetAmount}
                  onChange={(e) => setGoalTargetAmount(e.target.value)}
                  placeholder="60000"
                  className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Monthly Planned (₹)</label>
                <input
                  type="number"
                  value={goalMonthlyContribution}
                  onChange={(e) => setGoalMonthlyContribution(e.target.value)}
                  placeholder="4000"
                  className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white font-bold"
                />
              </div>
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Target Milestone Date</label>
              <input
                type="text"
                value={goalTargetDate}
                onChange={(e) => setGoalTargetDate(e.target.value)}
                placeholder="e.g. July 2025"
                className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white"
              />
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-[#060e20] rounded-xl border border-slate-700">
              <input
                type="checkbox"
                id="editGuardianLock"
                checked={goalGuardianLocked}
                onChange={(e) => setGoalGuardianLocked(e.target.checked)}
                className="w-4 h-4 text-teal-400 rounded"
              />
              <label htmlFor="editGuardianLock" className="text-slate-300 text-[11px] cursor-pointer">
                Require guardian lock for premature liquidation
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
                {editingGoal ? 'Update Plan' : 'Save Plan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
