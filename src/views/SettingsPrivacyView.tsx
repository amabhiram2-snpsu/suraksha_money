import React, { useState } from 'react';
import { ViewMode, UserProfile, LanguageCode } from '../types';
import { INDIAN_LANGUAGES } from '../data/mockData';

interface SettingsPrivacyViewProps {
  onNavigate: (view: ViewMode) => void;
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onOpenLanguageModal: () => void;
}

export const SettingsPrivacyView: React.FC<SettingsPrivacyViewProps> = ({
  onNavigate,
  user,
  onUpdateUser,
  onOpenLanguageModal,
}) => {
  const [largeText, setLargeText] = useState(user.highContrast);
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [dailyCap, setDailyCap] = useState(user.upiDailyCap.toString());
  const [toast, setToast] = useState<string | null>(null);

  const currentLang = INDIAN_LANGUAGES.find((l) => l.code === user.preferredLanguage) || INDIAN_LANGUAGES[0];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      upiDailyCap: parseInt(dailyCap, 10) || 5000,
      highContrast: largeText,
    });
    setToast('Settings and accessibility preferences saved.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-16">
      {/* Header */}
      <div className="bg-[#131b2e] border border-[#1E293B] p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20">
              System &amp; Consent Center
            </span>
            <span className="text-xs text-slate-400">DPDP Act (India) Compliance</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Settings, Privacy &amp; Accessibility</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Configure language, senior assist parameters, and cryptographic consent logs.
          </p>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          {toast}
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-[#131b2e] border border-[#1E293B] rounded-2xl p-6 shadow-lg flex flex-col gap-4 text-xs">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-400 text-[20px]">person</span>
            Linked Family Profile
          </h3>

          <div>
            <label className="text-slate-400 block mb-1">Account Holder / Caregiver</label>
            <input
              type="text"
              value={user.name}
              disabled
              className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white opacity-80"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Protected Elder / Parent</label>
            <input
              type="text"
              value={user.elderlyName || 'Kamala Devi'}
              disabled
              className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white opacity-80"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Linked Bank</label>
              <input
                type="text"
                value={user.bankName}
                disabled
                className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white opacity-80"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Masked Account</label>
              <input
                type="text"
                value={user.accountNumberMasked}
                disabled
                className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white font-mono opacity-80"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Daily Senior UPI Debit Cap (₹)</label>
            <input
              type="number"
              value={dailyCap}
              onChange={(e) => setDailyCap(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white font-bold"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Transactions above this threshold require designated guardian 1-tap co-approval.
            </span>
          </div>
        </div>

        {/* Accessibility & Language */}
        <div className="bg-[#131b2e] border border-[#1E293B] rounded-2xl p-6 shadow-lg flex flex-col justify-between gap-4 text-xs">
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-400 text-[20px]">
                accessibility_new
              </span>
              Accessibility &amp; Mother Tongue
            </h3>

            {/* Language Box */}
            <div className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px]">Active Language</span>
                <span className="font-bold text-white text-sm">
                  {currentLang.nativeName} ({currentLang.name})
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenLanguageModal}
                className="px-3 py-1.5 rounded-lg bg-[#334155] hover:bg-slate-600 text-teal-300 font-bold text-xs"
              >
                Change Language
              </button>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#1E293B] border border-[#334155] cursor-pointer">
                <div>
                  <span className="font-bold text-white block">18pt+ High-Contrast Text Mode</span>
                  <span className="text-[11px] text-slate-400">
                    Enlarged typography tailored for senior eyes and reading comfort.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={largeText}
                  onChange={(e) => setLargeText(e.target.checked)}
                  className="w-5 h-5 text-teal-400 rounded focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#1E293B] border border-[#334155] cursor-pointer">
                <div>
                  <span className="font-bold text-white block">Verbal Audio Guidance</span>
                  <span className="text-[11px] text-slate-400">
                    Read numbers and payment alerts aloud in native dialect.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={voiceGuidance}
                  onChange={(e) => setVoiceGuidance(e.target.checked)}
                  className="w-5 h-5 text-teal-400 rounded focus:ring-0"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#1E293B]">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Privacy & Consent Audit Log (Section 23) */}
        <div className="lg:col-span-2 bg-[#131b2e] border border-[#1E293B] rounded-2xl p-6 shadow-lg flex flex-col gap-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-400 text-[20px]">
                verified_user
              </span>
              DPDP Act (India) Consent &amp; Audit Trail
            </h3>
            <span className="text-slate-400 text-[11px]">SHA-256 Verified State</span>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-white">Guardian Consent: Rajesh Kumar</span>
                <span className="text-slate-400 text-[11px]">
                  Granted permission to receive high-risk scam SMS alerts and 1-tap co-approval.
                </span>
              </div>
              <span className="text-emerald-400 font-bold">Active • Verified 01 Jan 2025</span>
            </div>

            <div className="p-3 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-white">Data Retention Policy</span>
                <span className="text-slate-400 text-[11px]">
                  PINs, OTPs, and biometric data are never stored or logged on server.
                </span>
              </div>
              <span className="text-teal-300 font-bold">Compliant</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#1E293B]">
            <span className="text-slate-400">
              Need to wipe all stored financial records and reset device?
            </span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Delete all stored financial records and reset Suraksha Money account?')) {
                  alert('Account data purged in compliance with DPDP Right to Erasure.');
                }
              }}
              className="text-red-400 hover:text-red-300 font-bold"
            >
              Purge All Data (Right to Erasure)
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
