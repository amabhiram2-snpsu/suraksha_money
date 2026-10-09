import React, { useState } from 'react';
import { UserProfile, ViewMode, LanguageCode } from '../types';
import { INDIAN_LANGUAGES } from '../data/mockData';
import { t } from '../utils/translations';

interface HeaderProps {
  user: UserProfile;
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onOpenLanguageModal: () => void;
  onOpenEmergencyModal: () => void;
  onToggleTheme: () => void;
  theme: 'dark' | 'light' | 'high-contrast';
  isUpiFrozen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentView,
  onNavigate,
  onOpenLanguageModal,
  onOpenEmergencyModal,
  onToggleTheme,
  theme,
  isUpiFrozen,
}) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const currentLang = INDIAN_LANGUAGES.find((l) => l.code === user.preferredLanguage) || INDIAN_LANGUAGES[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.toLowerCase().includes('upi') || searchQuery.toLowerCase().includes('pay')) {
      onNavigate('payment-assistant');
    } else if (searchQuery.toLowerCase().includes('senior') || searchQuery.toLowerCase().includes('kamala')) {
      onNavigate('senior-friendly-mode');
    } else if (searchQuery.toLowerCase().includes('scam') || searchQuery.toLowerCase().includes('alert')) {
      onNavigate('scam-safety-center');
    } else if (searchQuery.toLowerCase().includes('stock') || searchQuery.toLowerCase().includes('invest')) {
      onNavigate('stock-research');
    } else if (searchQuery.toLowerCase().includes('budget') || searchQuery.toLowerCase().includes('expense')) {
      onNavigate('budget-planner');
    } else {
      onNavigate('dashboard');
    }
    setShowSearchDropdown(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-[#060e20]/95 backdrop-blur-md border-b border-[#1E293B] shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-50">
      <div className="w-full h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 text-left focus:outline-none group"
            title="Suraksha Money Home"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-[0_0_15px_rgba(79,219,200,0.25)] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[26px]">shield_locked</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-white leading-tight tracking-tight">
                  Suraksha<span className="text-teal-400">Money</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-teal-400 bg-teal-500/10 border border-teal-500/20 px-1.5 py-0.5 rounded leading-none w-fit font-semibold mt-0.5">
                {t('tagline', user.preferredLanguage)}
              </span>
            </div>
          </button>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-xl mx-4 hidden xl:block relative">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <span className="material-symbols-outlined absolute left-3.5 text-slate-400 pointer-events-none text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(e.target.value.length > 0);
              }}
              onFocus={() => searchQuery && setShowSearchDropdown(true)}
              placeholder={t('searchPlaceholder', user.preferredLanguage)}
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#131b2e] text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-400/60 border border-[#1E293B] shadow-inner transition-all"
            />
          </form>

          {showSearchDropdown && (
            <div className="absolute top-12 left-0 right-0 bg-[#131b2e] border border-[#334155] rounded-xl shadow-2xl p-2 z-50 animate-fade-in">
              <div className="text-xs text-slate-400 px-3 py-1 font-semibold uppercase">
                Quick Shortcuts
              </div>
              <button
                onClick={() => {
                  onNavigate('ai-financial-assistant');
                  setShowSearchDropdown(false);
                }}
                className="w-full p-2.5 rounded-lg text-left text-sm text-slate-200 hover:bg-[#1E293B] hover:text-teal-300 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-teal-400 text-[18px]">
                  smart_toy
                </span>
                Chat &amp; Chart with AI (Interactive Charts)
              </button>
              <button
                onClick={() => {
                  onNavigate('payment-assistant');
                  setShowSearchDropdown(false);
                }}
                className="w-full p-2.5 rounded-lg text-left text-sm text-slate-200 hover:bg-[#1E293B] hover:text-teal-300 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-teal-400 text-[18px]">
                  verified_user
                </span>
                Voice Payment &amp; SafeUPI Guard
              </button>
              <button
                onClick={() => {
                  onNavigate('senior-friendly-mode');
                  setShowSearchDropdown(false);
                }}
                className="w-full p-2.5 rounded-lg text-left text-sm text-slate-200 hover:bg-[#1E293B] hover:text-teal-300 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-teal-400 text-[18px]">
                  accessibility_new
                </span>
                Switch to Senior Mode (Large 20px Cards)
              </button>
              <button
                onClick={() => {
                  onNavigate('scam-safety-center');
                  setShowSearchDropdown(false);
                }}
                className="w-full p-2.5 rounded-lg text-left text-sm text-slate-200 hover:bg-[#1E293B] hover:text-red-400 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-red-400 text-[18px]">
                  gshield
                </span>
                Scam Safety Center (Electricity Bill Alert)
              </button>
            </div>
          )}
        </div>

        {/* Right: Actions, Language, Theme, Emergency */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
          {/* Language Switcher */}
          <button
            onClick={onOpenLanguageModal}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#131b2e] hover:bg-[#1E293B] border border-teal-500/40 text-white transition-all text-xs font-semibold shadow-sm"
            title={`Active Language: ${currentLang.nativeName} (${currentLang.name}). Click to change.`}
          >
            <span className="material-symbols-outlined text-[18px] text-teal-400">translate</span>
            <span className="font-bold text-teal-300">{currentLang.nativeName}</span>
            <span className="hidden sm:inline text-slate-300 text-[11px]">({currentLang.name})</span>
            <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded-full font-bold border border-teal-500/30">
              {currentLang.code.toUpperCase()}
            </span>
          </button>

          {/* High Contrast / Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#131b2e] border border-[#1E293B] text-slate-300 hover:bg-[#1E293B] transition-colors"
            title={`Current theme: ${theme}. Click to toggle.`}
          >
            <span className="material-symbols-outlined text-[18px] text-teal-400">contrast</span>
            <div className="flex flex-col text-left hidden lg:flex">
              <span className="text-xs font-bold text-white leading-tight">
                {theme === 'high-contrast' ? 'High Contrast' : theme === 'light' ? 'Light Mode' : 'Obsidian Dark'}
              </span>
              <span className="text-[10px] text-slate-400 leading-none">Senior Assist</span>
            </div>
            {/* Toggle visual pill */}
            <div className="w-8 h-4 rounded-full bg-[#2d3449] p-0.5 relative ml-1 border border-slate-700">
              <div
                className={`w-3 h-3 rounded-full bg-teal-400 shadow-sm transition-transform ${
                  theme !== 'light' ? 'translate-x-4' : 'translate-x-0'
                }`}
              ></div>
            </div>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-300 hover:bg-[#131b2e] hover:text-white transition-colors"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-[#131b2e] border border-[#334155] rounded-xl shadow-2xl p-3 z-50 animate-fade-in text-left">
                <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Safety &amp; Account Alerts
                  </span>
                  <span className="text-[10px] text-teal-400 font-semibold">3 Unread</span>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40 text-xs">
                    <p className="font-bold text-red-300">Fake Electricity Bill Intercepted</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Malicious APK link blocked on Kamala Devi's phone.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1E293B] border border-slate-700 text-xs">
                    <p className="font-bold text-emerald-400">Pension Credited: ₹18,500</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Direct SBI Deposit verified in Protected Vault.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1E293B] border border-slate-700 text-xs">
                    <p className="font-bold text-teal-300">AI Savings Tip Ready</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Save ₹2,500 extra by reducing dining this weekend.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Help Button */}
          <button
            onClick={onOpenEmergencyModal}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-red-950/70 border border-red-600/60 text-red-200 hover:bg-red-900 hover:text-white transition-all text-xs font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse"
          >
            <span className="material-symbols-outlined text-[18px] text-red-400">emergency</span>
            <span className="hidden sm:inline">{t('emergencyHelp', user.preferredLanguage)}</span>
          </button>

          {/* User Profile Pill */}
          <div
            onClick={() => onNavigate('settings-and-privacy')}
            className="flex items-center gap-2 pl-1 py-1 cursor-pointer group"
            title="User Profile & Shield Settings"
          >
            <div className="relative">
              <img
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-teal-400/40 group-hover:ring-teal-400 transition-all"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WWstmt2m3MwfPEfRrAWJLiR8nHEtWzRjb0qShYP-qT1p20CBLiOpBzJacD-B5Kj6arwGhx22P3n1bCQHJGFa7iZ7igWhIROQhazadjVRuoEPlEp62q8mjtpJq7cKkrF8VrbnzTcqY0t1M6xlF74pEoKauSZh9meqdnR8vdsTqu-RhCxbr8gWumoANGSyqIPNiXeoUsVdHcCM2QJgF2NrQgFoQ879DPKv-cgGQLCxFEsPYcnAcZmsc1FldEB1vjdoZtCn0GgwwRpg"
              />
              {isUpiFrozen && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-red-600 border border-slate-900 flex items-center justify-center text-[10px] text-white font-bold" title="UPI Frozen">
                  🔒
                </span>
              )}
            </div>
            <div className="flex flex-col text-left hidden 2xl:flex">
              <span className="text-xs font-bold text-white leading-tight">
                Rajesh &amp; Kamala Devi
              </span>
              <span className="text-[11px] text-teal-400 leading-tight">
                Senior Shield Linked
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
