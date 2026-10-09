/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewMode, UserProfile, IncomeItem, ExpenseItem, DebtItem, SavingsGoal, Transaction, TrustedContact, LanguageCode } from './types';
import {
  INITIAL_USER,
  INITIAL_INCOMES,
  INITIAL_EXPENSES,
  INITIAL_DEBTS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_TRANSACTIONS,
  INITIAL_TRUSTED_CONTACTS,
} from './data/mockData';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LanguageModal } from './components/LanguageModal';
import { EmergencyModal } from './components/EmergencyModal';
import { ScamSimulatorModal } from './components/ScamSimulatorModal';
import { FloatingAiAssistant } from './components/FloatingAiAssistant';

// Views
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { PaymentAssistantView } from './views/PaymentAssistantView';
import { SeniorModeView } from './views/SeniorModeView';
import { BudgetPlannerView } from './views/BudgetPlannerView';
import { EmergencyFundView } from './views/EmergencyFundView';
import { SavingsGoalsView } from './views/SavingsGoalsView';
import { StockResearchView } from './views/StockResearchView';
import { ScamSafetyView } from './views/ScamSafetyView';
import { TrustedContactsView } from './views/TrustedContactsView';
import { SettingsPrivacyView } from './views/SettingsPrivacyView';
import { AiChatView } from './views/AiChatView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [incomes, setIncomes] = useState<IncomeItem[]>(INITIAL_INCOMES);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [debts, setDebts] = useState<DebtItem[]>(INITIAL_DEBTS);
  const [goals, setGoals] = useState<SavingsGoal[]>(INITIAL_SAVINGS_GOALS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [contacts, setContacts] = useState<TrustedContact[]>(INITIAL_TRUSTED_CONTACTS);

  // System states
  const [isUpiFrozen, setIsUpiFrozen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light' | 'high-contrast'>('dark');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isScamSimulatorOpen, setIsScamSimulatorOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync theme and language to root html element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'high-contrast');
    root.classList.add(theme);
    root.lang = user.preferredLanguage || 'en';
  }, [theme, user.preferredLanguage]);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'high-contrast';
      return 'dark';
    });
  };

  const handleSelectLanguage = (code: LanguageCode) => {
    setUser((prev) => ({ ...prev, preferredLanguage: code }));
  };

  const handleToggleFreezeUpi = () => {
    setIsUpiFrozen((prev) => !prev);
  };

  const handleAddIncome = (inc: IncomeItem) => {
    setIncomes((prev) => [inc, ...prev]);
  };

  const handleUpdateIncome = (inc: IncomeItem) => {
    setIncomes((prev) => prev.map((item) => (item.id === inc.id ? inc : item)));
  };

  const handleDeleteIncome = (id: string) => {
    setIncomes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddExpense = (exp: ExpenseItem) => {
    setExpenses((prev) => [exp, ...prev]);
  };

  const handleUpdateExpense = (exp: ExpenseItem) => {
    setExpenses((prev) => prev.map((item) => (item.id === exp.id ? exp : item)));
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddDebt = (debt: DebtItem) => {
    setDebts((prev) => [debt, ...prev]);
  };

  const handleUpdateDebt = (debt: DebtItem) => {
    setDebts((prev) => prev.map((item) => (item.id === debt.id ? debt : item)));
  };

  const handleDeleteDebt = (id: string) => {
    setDebts((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddGoal = (goal: SavingsGoal) => {
    setGoals((prev) => [...prev, goal]);
  };

  const handleUpdateGoal = (goal: SavingsGoal) => {
    setGoals((prev) => prev.map((item) => (item.id === goal.id ? goal : item)));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((item) => item.id !== id));
  };

  const handleConfirmSavingsMonth = (goalId: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g))
    );
  };

  const handleAddContact = (contact: TrustedContact) => {
    setContacts((prev) => [...prev, contact]);
  };

  const handleUpdateContact = (updated: TrustedContact) => {
    setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleAddTransaction = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  const isLandingView = currentView === 'landing';

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-[#f8fafc] text-[#0f172a]' : 'bg-[#0b1326] text-[#F8FAFC]'}`}>
      {/* Top Header */}
      <Header
        user={user}
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onToggleTheme={handleToggleTheme}
        theme={theme}
        isUpiFrozen={isUpiFrozen}
      />

      {/* Main Container Layout */}
      {isLandingView ? (
        <div className="pt-20">
          <LandingView
            onNavigate={setCurrentView}
            onOpenScamSimulator={() => setIsScamSimulatorOpen(true)}
          />
        </div>
      ) : (
        <div className="flex">
          {/* Left Navigation Sidebar */}
          <Sidebar
            currentView={currentView}
            onNavigate={setCurrentView}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            language={user.preferredLanguage}
          />

          {/* Mobile Sidebar Hamburger Toggle Button */}
          <div className="lg:hidden fixed bottom-6 left-6 z-40">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="w-12 h-12 rounded-full bg-[#131b2e] border border-[#334155] text-teal-400 flex items-center justify-center shadow-2xl"
              title="Open Navigation"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 lg:pl-72 pt-20 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="max-w-7xl mx-auto py-6">
              {currentView === 'dashboard' && (
                <DashboardView
                  onNavigate={setCurrentView}
                  transactions={transactions}
                  incomes={incomes}
                  expenses={expenses}
                  debts={debts}
                  goals={goals}
                  isUpiFrozen={isUpiFrozen}
                  onToggleFreezeUpi={handleToggleFreezeUpi}
                  language={user.preferredLanguage}
                />
              )}

              {currentView === 'payment-assistant' && (
                <PaymentAssistantView
                  onNavigate={setCurrentView}
                  transactions={transactions}
                  onAddTransaction={handleAddTransaction}
                  isUpiFrozen={isUpiFrozen}
                  language={user.preferredLanguage}
                />
              )}

              {(currentView === 'senior-friendly-mode' || currentView === 'voice-assistant') && (
                <SeniorModeView
                  onNavigate={setCurrentView}
                  onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
                  onAddTransaction={handleAddTransaction}
                  isUpiFrozen={isUpiFrozen}
                  language={user.preferredLanguage}
                />
              )}

              {(currentView === 'budget-planner' || currentView === 'income-and-expenses') && (
                <BudgetPlannerView
                  onNavigate={setCurrentView}
                  incomes={incomes}
                  expenses={expenses}
                  debts={debts}
                  goals={goals}
                  onAddIncome={handleAddIncome}
                  onUpdateIncome={handleUpdateIncome}
                  onDeleteIncome={handleDeleteIncome}
                  onAddExpense={handleAddExpense}
                  onUpdateExpense={handleUpdateExpense}
                  onDeleteExpense={handleDeleteExpense}
                  onAddDebt={handleAddDebt}
                  onUpdateDebt={handleUpdateDebt}
                  onDeleteDebt={handleDeleteDebt}
                  onAddGoal={handleAddGoal}
                  onUpdateGoal={handleUpdateGoal}
                  onDeleteGoal={handleDeleteGoal}
                />
              )}

              {currentView === 'emergency-fund' && (
                <EmergencyFundView onNavigate={setCurrentView} expenses={expenses} />
              )}

              {currentView === 'savings-goals' && (
                <SavingsGoalsView
                  onNavigate={setCurrentView}
                  goals={goals}
                  onAddGoal={handleAddGoal}
                  onUpdateGoal={handleUpdateGoal}
                  onDeleteGoal={handleDeleteGoal}
                  onConfirmSavingsMonth={handleConfirmSavingsMonth}
                />
              )}

              {currentView === 'stock-research' && (
                <StockResearchView onNavigate={setCurrentView} />
              )}

              {(currentView === 'scam-safety-center' || currentView === 'sms-safety-alerts') && (
                <ScamSafetyView
                  onNavigate={setCurrentView}
                  onOpenScamSimulator={() => setIsScamSimulatorOpen(true)}
                  transactions={transactions}
                />
              )}

              {currentView === 'trusted-contacts' && (
                <TrustedContactsView
                  onNavigate={setCurrentView}
                  contacts={contacts}
                  onAddContact={handleAddContact}
                  onUpdateContact={handleUpdateContact}
                />
              )}

              {(currentView === 'settings-and-privacy' || currentView === 'notifications') && (
                <SettingsPrivacyView
                  onNavigate={setCurrentView}
                  user={user}
                  onUpdateUser={(up) => setUser((prev) => ({ ...prev, ...up }))}
                  onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
                />
              )}

              {currentView === 'ai-financial-assistant' && (
                <AiChatView
                  onNavigate={setCurrentView}
                  user={user}
                  incomes={incomes}
                  expenses={expenses}
                  debts={debts}
                  goals={goals}
                  transactions={transactions}
                  onAddIncome={handleAddIncome}
                  onAddExpense={handleAddExpense}
                />
              )}
            </div>
          </main>
        </div>
      )}

      {/* Floating Grounded AI Assistant */}
      <FloatingAiAssistant user={user} incomes={incomes} expenses={expenses} />

      {/* Modals */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={user.preferredLanguage}
        onSelectLanguage={handleSelectLanguage}
      />

      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onFreezeUpi={handleToggleFreezeUpi}
        isUpiFrozen={isUpiFrozen}
      />

      <ScamSimulatorModal
        isOpen={isScamSimulatorOpen}
        onClose={() => setIsScamSimulatorOpen(false)}
      />
    </div>
  );
}
