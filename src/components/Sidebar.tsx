import React from 'react';
import { ViewMode, LanguageCode } from '../types';
import { t } from '../utils/translations';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  language?: LanguageCode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  language = 'en',
}) => {
  const handleNav = (view: ViewMode) => {
    onNavigate(view);
    onCloseMobile();
  };

  const navItemClass = (view: ViewMode, isSpecialSecondary = false) => {
    const isActive = currentView === view;
    if (isActive) {
      return isSpecialSecondary
        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 font-bold shadow-[0_0_15px_rgba(74,225,118,0.15)]'
        : 'bg-teal-500/15 text-teal-400 border border-teal-500/40 font-bold shadow-[0_0_15px_rgba(79,219,200,0.15)]';
    }
    return 'text-slate-400 hover:bg-[#131b2e] hover:text-white border border-transparent';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-20 bottom-0 w-72 bg-[#060e20] border-r border-[#1E293B] z-40 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.5)] overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex flex-col gap-5 flex-1">
          {/* Section 1: Financial Core */}
          <nav className="flex flex-col gap-1">
            <span className="px-3 text-[11px] text-slate-500 uppercase tracking-wider font-bold mb-1">
              {language === 'hi' ? 'वित्तीय कोर' : language === 'ta' ? 'நிதி மையம்' : 'Financial Core'}
            </span>

            <button
              onClick={() => handleNav('dashboard')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm text-left ${navItemClass(
                'dashboard'
              )}`}
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
              <span>{t('navDashboard', language)}</span>
            </button>

            {/* AI Chat & Charting Highlight Item */}
            <button
              onClick={() => handleNav('ai-financial-assistant')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-sm text-left ${navItemClass(
                'ai-financial-assistant'
              )}`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-teal-400">smart_toy</span>
                <span>{t('navAiChat', language)}</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                Live
              </span>
            </button>

            <button
              onClick={() => handleNav('income-and-expenses')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm text-left ${navItemClass(
                'income-and-expenses'
              )}`}
            >
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
              <span>{t('navIncomeExpenses', language)}</span>
            </button>

            <button
              onClick={() => handleNav('budget-planner')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm text-left ${navItemClass(
                'budget-planner'
              )}`}
            >
              <span className="material-symbols-outlined text-[20px]">calculate</span>
              <span>{t('navBudgetPlanner', language)}</span>
            </button>

            <button
              onClick={() => handleNav('savings-goals')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm text-left ${navItemClass(
                'savings-goals'
              )}`}
            >
              <span className="material-symbols-outlined text-[20px]">savings</span>
              <span>{t('navSavingsGoals', language)}</span>
            </button>

            <button
              onClick={() => handleNav('emergency-fund')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm text-left ${navItemClass(
                'emergency-fund'
              )}`}
            >
              <span className="material-symbols-outlined text-[20px]">health_and_safety</span>
              <span>{t('navEmergencyFund', language)}</span>
            </button>

            <button
              onClick={() => handleNav('stock-research')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm text-left ${navItemClass(
                'stock-research'
              )}`}
            >
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
              <span>{t('navStockResearch', language)}</span>
            </button>
          </nav>

          {/* Section 2: Safety & Family Care */}
          <nav className="flex flex-col gap-1">
            <span className="px-3 text-[11px] text-emerald-400 uppercase tracking-wider font-bold mb-1">
              {language === 'hi' ? 'सुरक्षा और परिवार' : language === 'ta' ? 'பாதுகாப்பு & குடும்பம்' : 'Safety & Family Care'}
            </span>

            <button
              onClick={() => handleNav('senior-friendly-mode')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm text-left ${navItemClass(
                'senior-friendly-mode',
                true
              )}`}
            >
              <span className="material-symbols-outlined text-[20px] text-emerald-400">
                accessibility_new
              </span>
              <span>{t('navSeniorMode', language)}</span>
            </button>

            <button
              onClick={() => handleNav('voice-assistant')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm text-left ${navItemClass(
                'voice-assistant'
              )}`}
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
              <span>{language === 'hi' ? 'आवाज़ सहायक' : 'Voice Assistant'}</span>
            </button>

            <button
              onClick={() => handleNav('payment-assistant')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm text-left ${navItemClass(
                'payment-assistant'
              )}`}
            >
              <span className="material-symbols-outlined text-[20px] text-teal-400">
                verified_user
              </span>
              <span>{t('navPaymentAssistant', language)}</span>
            </button>

            <button
              onClick={() => handleNav('scam-safety-center')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-sm text-left ${navItemClass(
                'scam-safety-center'
              )}`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-red-500">
                  gshield
                </span>
                <span>{t('navScamSafety', language)}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-700/50 text-[11px] font-bold">
                2 Alert
              </span>
            </button>

            <button
              onClick={() => handleNav('trusted-contacts')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm text-left ${navItemClass(
                'trusted-contacts'
              )}`}
            >
              <span className="material-symbols-outlined text-[20px]">supervisor_account</span>
              <span>{t('navTrustedContacts', language)}</span>
            </button>

            <button
              onClick={() => handleNav('sms-safety-alerts')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm text-left ${navItemClass(
                'sms-safety-alerts'
              )}`}
            >
              <span className="material-symbols-outlined text-[20px]">sms</span>
              <span>{language === 'hi' ? 'एसएमएस सुरक्षा अलर्ट' : 'SMS Safety Alerts'}</span>
            </button>
          </nav>

          {/* Section 3: Account & System */}
          <nav className="flex flex-col gap-1">
            <span className="px-3 text-[11px] text-slate-500 uppercase tracking-wider font-bold mb-1">
              {language === 'hi' ? 'खाता और सिस्टम' : 'Account & System'}
            </span>
            <button
              onClick={() => handleNav('notifications')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm text-left ${navItemClass(
                'notifications'
              )}`}
            >
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
              <span>{language === 'hi' ? 'सूचनाएं' : 'Notifications'}</span>
            </button>
            <button
              onClick={() => handleNav('settings-and-privacy')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm text-left ${navItemClass(
                'settings-and-privacy'
              )}`}
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
              <span>{t('navSettings', language)}</span>
            </button>
          </nav>

          {/* Cybercrime Helpline Card */}
          <div className="rounded-xl bg-[#131b2e] p-3.5 flex flex-col gap-1 border border-[#1E293B]">
            <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs">
              <span className="material-symbols-outlined text-[18px]">policy</span>
              <span>{language === 'hi' ? 'साइबर हेल्पलाइन' : 'Cybercrime Helpline'}</span>
            </div>
            <p className="text-xl font-extrabold text-white tracking-tight">Dial 1930</p>
            <p className="text-[11px] text-slate-400 leading-snug">
              {language === 'hi'
                ? 'राष्ट्रीय साइबर धोखाधड़ी रिपोर्टिंग पोर्टल 24x7 भारत सहायता।'
                : 'National cyber fraud reporting portal 24x7 India assistance.'}
            </p>
          </div>
        </div>

        {/* Footer Shield Bar */}
        <div className="p-4 bg-[#030712] border-t border-[#1E293B]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ae176] animate-pulse"></span>
            <span className="text-xs text-white font-semibold">
              {language === 'hi' ? 'सुरक्षा शील्ड सक्रिय' : 'Family Shield Active'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {language === 'hi' ? 'निरंतर 24/7 निगरानी वाली सुरक्षा' : 'Continuous 24/7 Monitored Protection'}
          </p>
        </div>
      </aside>
    </>
  );
};
