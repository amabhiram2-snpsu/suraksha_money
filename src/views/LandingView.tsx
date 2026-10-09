import React, { useState } from 'react';
import { ViewMode } from '../types';

interface LandingViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenScamSimulator: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  onOpenScamSimulator,
}) => {
  const [liveEngineTab, setLiveEngineTab] = useState<'finance' | 'shield'>('finance');

  return (
    <div className="w-full min-h-screen bg-[#0b1326] text-white">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-12 pt-8 pb-16 lg:pb-24">
        {/* Ambient Defensive Glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-48 right-4 w-[420px] h-[420px] bg-teal-400/10 rounded-full blur-2xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Shield Verification Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1E293B] border border-[#334155] rounded-full shadow-lg mb-6">
            <span
              className="material-symbols-outlined text-teal-400 text-base"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            <span className="text-xs text-teal-400 uppercase tracking-wide font-bold">
              Next-Gen UPI Safety &amp; Wealth Protection for India
            </span>
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse ml-1"></span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white max-w-4xl tracking-tight leading-tight">
            Your Money. Your Safety. <br className="hidden sm:inline" />
            <span className="text-teal-400">Your Peace of Mind.</span>
          </h1>

          {/* Supporting Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mt-4 mb-8 leading-relaxed">
            The premier AI-powered personal finance management platform engineered for
            regular-income earners, with intelligent rupee protection and dedicated senior-friendly
            safety guards for parents and grandparents.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto h-14 px-8 bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-base rounded-xl shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started (Free Account)</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
            <button
              onClick={() => onNavigate('senior-friendly-mode')}
              className="w-full sm:w-auto h-14 px-8 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-teal-400 font-bold text-base rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">play_circle</span>
              <span>Explore Senior-Friendly Mode</span>
            </button>
          </div>

          {/* Trust Badges Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl py-4 px-6 bg-[#131b2e] border border-[#1E293B] rounded-2xl shadow-xl text-left mb-12">
            <div className="flex items-center gap-3 p-1">
              <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
                <span className="material-symbols-outlined text-xl">groups</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">45,000+ Families</p>
                <p className="text-xs text-slate-400">Actively Protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-1">
              <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
                <span className="material-symbols-outlined text-xl">currency_rupee</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">₹12.4 Cr Safeguarded</p>
                <p className="text-xs text-slate-400">Zero Fraud Incidents</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-1">
              <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
                <span className="material-symbols-outlined text-xl">enhanced_encryption</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">256-bit AES Vault</p>
                <p className="text-xs text-slate-400">RBI Compliant Norms</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-1">
              <div className="p-2.5 bg-red-950/60 border border-red-500/40 rounded-xl text-red-400">
                <span className="material-symbols-outlined text-xl">call</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">1930 Helpline Sync</p>
                <p className="text-xs text-slate-400">National Cyber Portal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Perspective Showcase Hero Card */}
        <div className="max-w-6xl mx-auto bg-[#131b2e] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-teal-400 animate-ping"></div>
              <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold">
                Live System Console
              </span>
              <span className="px-2.5 py-0.5 bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs rounded-full font-medium">
                Suraksha DualShield Engine
              </span>
            </div>
            <div className="flex items-center gap-1 bg-[#1E293B] border border-[#334155] p-1 rounded-lg">
              <button
                onClick={() => setLiveEngineTab('finance')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  liveEngineTab === 'finance'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Smart Finance Engine
              </button>
              <button
                onClick={() => setLiveEngineTab('shield')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  liveEngineTab === 'shield'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Elder Rupee Shield
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-6">
            {/* Perspective 1: Smart Finance Engine */}
            <div className="lg:col-span-6 bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-[#334155] text-teal-400 border border-slate-600 rounded-lg material-symbols-outlined text-lg">
                      account_balance_wallet
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-white">Smart Finance Engine</h3>
                      <p className="text-xs text-slate-400">Monthly Household Run-Rate</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-teal-500/15 text-teal-300 border border-teal-500/30 rounded-full text-xs font-semibold">
                    Healthy 74%
                  </span>
                </div>

                {/* Financial Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-[#060e20] border border-[#1E293B] p-3 rounded-lg">
                    <p className="text-xs text-slate-400">Net Income</p>
                    <p className="text-lg font-extrabold text-white mt-1">₹35,000</p>
                    <span className="text-[11px] text-teal-400 font-medium">Verified credited</span>
                  </div>
                  <div className="bg-[#060e20] border border-[#1E293B] p-3 rounded-lg">
                    <p className="text-xs text-slate-400">Disbursed</p>
                    <p className="text-lg font-extrabold text-slate-300 mt-1">₹24,000</p>
                    <span className="text-[11px] text-slate-400">Rent, Groceries</span>
                  </div>
                  <div className="bg-[#060e20] border border-[#1E293B] p-3 rounded-lg">
                    <p className="text-xs text-teal-400 font-semibold">Auto-Saved</p>
                    <p className="text-lg font-extrabold text-teal-400 mt-1">₹8,000</p>
                    <span className="text-[11px] text-teal-400 font-medium">Gold / RD Lock</span>
                  </div>
                </div>

                {/* Sparkline Visual Component */}
                <div className="bg-[#060e20] border border-[#1E293B] p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400">90-Day Expenditure Smoothness</span>
                    <span className="text-xs text-teal-400 font-semibold">+14.2% Saved</span>
                  </div>
                  <svg className="w-full h-14 overflow-visible text-teal-400" fill="none" viewBox="0 0 320 60">
                    <path
                      d="M0,45 Q40,48 80,35 T160,20 T240,28 T320,10"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M0,45 Q40,48 80,35 T160,20 T240,28 T320,10 L320,60 L0,60 Z"
                      fill="currentColor"
                      fillOpacity="0.12"
                    />
                    <circle cx="320" cy="10" fill="currentColor" r="4" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between text-slate-300 pt-3 border-t border-[#334155]">
                <span className="text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-teal-400">check_circle</span>{' '}
                  Zero Discretionary Leakage
                </span>
                <span className="text-xs font-semibold text-white">₹3,000 buffer liquid</span>
              </div>
            </div>

            {/* Perspective 2: Real-time Elder Rupee Shield */}
            <div className="lg:col-span-6 bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-500/20 border border-teal-500/30 text-teal-400 rounded-lg">
                      <span
                        className="material-symbols-outlined text-lg"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        shield
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Elder Rupee Shield</h3>
                      <p className="text-xs text-slate-400">Active Defense: Grandparent Guard</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-teal-400 text-slate-950 font-bold px-3 py-1 rounded-full text-xs">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span>100% ARMOR</span>
                  </div>
                </div>

                {/* Intercept Alert Module */}
                <div className="bg-[#060e20] border border-red-500/40 p-4 rounded-xl shadow-sm mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-950 text-red-400 rounded-full shrink-0">
                      <span className="material-symbols-outlined text-lg">warning</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-red-400 font-bold">
                          Fake Electricity Bill APK Intercepted
                        </p>
                        <span className="text-[11px] text-slate-400">Just now</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        Malicious SMS detected claiming power cut. Instant protective sandbox
                        blocked screen-share permission.
                      </p>
                    </div>
                  </div>

                  {/* Family Dispatch Status */}
                  <div className="mt-3 p-2.5 bg-[#131b2e] border border-[#1E293B] rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-teal-400 text-sm">
                        family_restroom
                      </span>
                      <span className="text-xs text-white">
                        Alert dispatched to Son (Rohan Kumar)
                      </span>
                    </div>
                    <span className="text-[10px] bg-teal-500/15 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded font-medium">
                      Safe Intercept
                    </span>
                  </div>
                </div>

                {/* Multilingual Voice Banner */}
                <div className="bg-[#060e20] border border-[#1E293B] p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-[#334155] text-teal-400 rounded-full material-symbols-outlined text-base">
                      mic
                    </span>
                    <div>
                      <p className="text-xs text-white font-semibold">
                        23 Indian Languages Voice Guard
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Hindi • Tamil • Telugu • Bengali • Marathi
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-teal-400">record_voice_over</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#334155]">
                <span className="text-xs text-slate-400">Scam Defense Engine Version 4.1</span>
                <button
                  onClick={onOpenScamSimulator}
                  className="text-xs text-teal-400 font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Test Simulator</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Story Section: Guarding Generations */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-16 bg-[#060e20] border-y border-[#1E293B]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <span className="text-xs text-teal-400 uppercase font-bold tracking-wider">
                Human-Centric Security
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4 leading-snug">
                Bridging technology with genuine filial care.
              </h2>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Millions of Indian senior citizens are embracing digital UPI transactions daily.
                Suraksha Money acts as an omnipresent, caring guardian sitting quietly behind every
                click, preventing coercion and digital exploitation.
              </p>
              <div className="p-4 bg-[#131b2e] border border-[#334155] rounded-xl shadow-lg">
                <p className="text-2xl font-extrabold text-teal-400">100%</p>
                <p className="text-sm text-white font-semibold mt-1">
                  Peace of mind for families working far from home.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="rounded-2xl overflow-hidden shadow-xl bg-[#131b2e] border border-[#1E293B] flex flex-col">
                <div className="h-64 overflow-hidden relative">
                  <img
                    className="w-full h-full object-cover"
                    alt="Indian grandfather reading financial alert with daughter"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTU_dNcPNCUPQLeFU181yGHVl3Ztd-4DSd7h0vSyxlA2OL3ccUicnDZbJLE7uwFRQiLOi98jCzSvTnfi5euCWPeaTj4-oNZcpGOQqVJ_6oDFVNZBXj65EIH4qnB77M8oJZSBPgz-Yu31r7eFOghIoenXldhIEcF_wbkgIG48cZZYzB0V72TNGa6o1EWEU7nb706UZYmNOl3EqB2xToVwsU2_EEgQo6Op6YWOSxiRyQEc7ktpqN1QWz"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/85 border border-[#334155] backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-semibold">
                    Senior Clarity View
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-base font-bold text-white">Zero Technical Jargon</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Transactions translated into intuitive verbal audio alerts in local regional
                    mother tongues.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="rounded-2xl overflow-hidden shadow-xl bg-[#131b2e] border border-[#1E293B] flex flex-col">
                <div className="h-64 overflow-hidden relative">
                  <img
                    className="w-full h-full object-cover"
                    alt="Young Indian professional monitoring safe payment ping"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOZX58b_Yk32_3UEfr-VLKOjvJPHelIog1tOoOyTKoCvq1K2tdR-ODBrZHc2EBNsOwlN0Szb1_8GX8lFGpK4DtrExkBeoc8wgxsjIe-WStViW2eCbd3tn81eDk3WlGCNLeIE_v_iDbzG3NURyt136sbw9rJ7kzeLyek-tJIBw-CQ2gDPv5f8zFr0Ww9uBc9PnbGNfsWc06LoO_3lexUvNl2kezIK0nbedXeyIKuO1vvHSQeRL5YuSV"
                  />
                  <div className="absolute bottom-3 left-3 bg-teal-400/90 border border-teal-500/30 backdrop-blur-sm text-slate-950 font-bold px-3 py-1 rounded-lg text-xs">
                    Remote Family Shield
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-base font-bold text-white">Instant Co-Approval</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    High-value or unverified payee transactions require a seamless second
                    confirmation from designated family members.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Grid: Built for Bharat */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-20 bg-[#0b1326]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs text-teal-400 uppercase font-bold tracking-widest">
              Built For Bharat
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Engineered for Regular Incomes. Fortified against Cyber Scams.
            </h2>
            <p className="text-base text-slate-300 mt-3 leading-relaxed">
              Four interconnected intelligence pillars that make everyday rupees stretch further
              while keeping fraudsters completely locked out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div
              onClick={() => onNavigate('budget-planner')}
              className="bg-[#131b2e] border border-[#1E293B] p-6 rounded-2xl shadow-lg hover:border-teal-400/60 transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">analytics</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">01 // AUTOMATION</span>
                <h3 className="text-base font-bold text-white mt-1 mb-2">
                  Expense &amp; Cashflow Intelligence
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Automatic categorisation, recurring utility bill detection, and zero budget
                  leakage warnings before salary runs out.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs text-teal-400 font-bold group-hover:underline">
                <span>Smart categorisation</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div
              onClick={() => onNavigate('ai-financial-assistant')}
              className="bg-[#131b2e] border border-[#1E293B] p-6 rounded-2xl shadow-lg hover:border-teal-400/60 transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">psychology</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">02 // ADVISORY</span>
                <h3 className="text-base font-bold text-white mt-1 mb-2">AI Financial Advisor</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Personalized budgeting suggestions calibrated for monthly earners of ₹20k–₹70k with
                  plain-language Rupee tips on gold and safe funds.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs text-teal-400 font-bold group-hover:underline">
                <span>Personalized algorithms</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div
              onClick={() => onNavigate('senior-friendly-mode')}
              className="bg-[#131b2e] border border-[#1E293B] p-6 rounded-2xl shadow-lg hover:border-teal-400/60 transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">translate</span>
                </div>
                <span className="text-xs text-teal-400 font-mono">03 // INCLUSIVITY</span>
                <h3 className="text-base font-bold text-white mt-1 mb-2">
                  Multilingual Voice Assistant
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Speak naturally in Hindi, Tamil, Telugu, Bengali, Kannada, Marathi &amp; 17 more
                  native languages. No complicated forms or English jargon.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs text-teal-400 font-bold group-hover:underline">
                <span>23 Indian dialects</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div
              onClick={() => onNavigate('payment-assistant')}
              className="bg-[#131b2e] border border-[#1E293B] p-6 rounded-2xl shadow-lg hover:border-red-500/60 transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    security
                  </span>
                </div>
                <span className="text-xs text-red-400 font-mono">04 // GUARDIAN</span>
                <h3 className="text-base font-bold text-white mt-1 mb-2">
                  Scam &amp; Payment Guardian
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Live heuristic detection of fake KYC calls, malicious screen-share APKs, social
                  engineering pressure tactics, and fraudulent VPAs.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs text-red-400 font-bold group-hover:underline">
                <span>Real-time interception</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Senior-Friendly Mode Spotlight Section */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-20 bg-[#060e20] border-y border-[#1E293B]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#131b2e] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Spotlight Details */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/15 border border-teal-500/30 text-teal-300 rounded-full mb-4 text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">elderly</span>
                    <span>DEDICATED SENIOR SAFETY SUITE</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
                    Senior-Friendly Mode: Effortless, Legible, Fear-Free.
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
                    We re-engineered the digital financial interface specifically for parents and
                    elders. No confusing nested menus, no fine print, and maximum accessibility
                    certified to WCAG 2.2 AAA guidelines.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#1E293B] border border-[#334155] rounded-xl text-teal-400 shrink-0">
                        <span className="material-symbols-outlined text-xl">format_size</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">18pt+ High-Contrast Type</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Crisp, uncompressed lettering for effortless reading without reading glasses.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#1E293B] border border-[#334155] rounded-xl text-teal-400 shrink-0">
                        <span className="material-symbols-outlined text-xl">touch_app</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Single-Tap Big Targets</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Every button is at least 56px high to prevent unintended double-clicks or slips.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-950/70 border border-red-500/40 rounded-xl text-red-400 shrink-0">
                        <span className="material-symbols-outlined text-xl">sos</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">One-Touch SOS Family Alert</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Instant screen panic button that freezes payments and dials family emergency contacts.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-teal-500/15 border border-teal-500/30 rounded-xl text-teal-400 shrink-0">
                        <span className="material-symbols-outlined text-xl">mic</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Large Microphone Voice UI</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Simply tap the prominent mic and say 'Show my pension' or 'Pay milk vendor'.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-[#1E293B]">
                  <button
                    onClick={() => onNavigate('senior-friendly-mode')}
                    className="h-14 px-8 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">visibility</span>
                    <span>Experience Senior Mode Preview</span>
                  </button>
                </div>
              </div>

              {/* Interactive Mockup Canvas */}
              <div className="lg:col-span-5 bg-[#0b1326] border-t lg:border-t-0 lg:border-l border-[#334155] p-6 sm:p-8 flex items-center justify-center">
                <div className="w-full max-w-sm bg-[#060e20] border-2 border-[#334155] rounded-3xl shadow-2xl p-5">
                  {/* Mock Mobile Header */}
                  <div className="flex justify-between items-center pb-3 border-b border-[#1E293B]">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-teal-400 animate-pulse"></span>
                      <span className="text-xs font-bold text-white">Elder SafeView ON</span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">4:30 PM</span>
                  </div>

                  {/* Huge Balance Display */}
                  <div className="p-5 bg-[#131b2e] border border-[#1E293B] rounded-2xl text-center my-4">
                    <p className="text-xs text-slate-400">Your Available Bank Balance</p>
                    <p className="text-3xl font-extrabold text-white my-1">₹42,850</p>
                    <p className="text-xs text-teal-400 font-semibold">• State Bank of India • Safe</p>
                  </div>

                  {/* High Contrast Large Touch Action Cards */}
                  <div className="space-y-3 mb-4">
                    <button
                      onClick={() => onNavigate('payment-assistant')}
                      className="w-full h-14 bg-[#1E293B] border border-[#334155] text-white font-bold text-sm rounded-xl flex items-center justify-between px-4 hover:border-teal-400 transition-colors shadow"
                    >
                      <span className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-2xl text-teal-400">
                          qr_code_scanner
                        </span>
                        <span>Scan &amp; Pay Safely</span>
                      </span>
                      <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                    </button>
                    <button
                      onClick={() => onNavigate('trusted-contacts')}
                      className="w-full h-14 bg-teal-400 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-between px-4 hover:bg-teal-300 transition-colors shadow"
                    >
                      <span className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-2xl">call</span>
                        <span>Pay Family / Contacts</span>
                      </span>
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                    {/* SOS Emergency Halt Action */}
                    <button
                      onClick={() => alert('SOS Triggered: Pausing UPI & contacting Rajesh')}
                      className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        emergency
                      </span>
                      <span>Emergency Block (SOS 1930)</span>
                    </button>
                  </div>

                  {/* Microphone Circle */}
                  <div className="flex flex-col items-center justify-center pt-2">
                    <div
                      onClick={() => onNavigate('senior-friendly-mode')}
                      className="w-16 h-16 rounded-full bg-teal-500/20 border-2 border-teal-400 text-teal-400 flex items-center justify-center shadow-lg active:scale-95 cursor-pointer hover:bg-teal-500/30 transition-all"
                    >
                      <span className="material-symbols-outlined text-3xl">mic</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 font-medium">
                      Tap to Speak in Hindi / Tamil / Telugu
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Scam Defense Simulator Teaser */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-20 bg-[#0b1326]">
        <div className="max-w-5xl mx-auto bg-[#131b2e] border border-[#334155] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/15 border border-teal-500/30 text-teal-300 rounded-full mb-3 text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">security_update_warning</span>
                <span>Zero-Cost Community Defense</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Would your parents fall for the latest electricity bill scam?
              </h3>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Test your family’s cyber awareness using our 60-second interactive simulator.
                Discover how Suraksha Money detects spoofed APKs and fake bank representatives in real
                time.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={onOpenScamSimulator}
                  className="h-12 px-6 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm rounded-xl transition-colors shadow-md flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">play_arrow</span>
                  <span>Run Free 60-Sec Family Test</span>
                </button>
                <span className="text-xs text-slate-400">No app install required</span>
              </div>
            </div>

            <div className="w-full md:w-80 bg-[#060e20] border border-[#1E293B] rounded-xl p-5 shadow-xl shrink-0">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold mb-2">
                <span className="material-symbols-outlined text-base">emergency_home</span>
                <span>Simulated Threat #104</span>
              </div>
              <p className="text-xs text-white font-semibold mb-1">
                "Dear Sir, your electricity connection will be cut tonight at 9:30 PM..."
              </p>
              <p className="text-[11px] text-slate-400 mb-3">
                Fake APK installer hidden in SMS link.
              </p>
              <div className="p-2.5 bg-teal-500/15 border border-teal-500/30 rounded-lg text-center">
                <p className="text-xs text-teal-300 font-bold">
                  Suraksha Money Action: Intercepted in 40ms
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-Trust Footer */}
      <footer className="w-full bg-[#030712] border-t border-[#1E293B] text-white pt-16 pb-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-[#131b2e] border border-[#334155] text-teal-400 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    shield
                  </span>
                </div>
                <div>
                  <span className="text-xl font-extrabold text-white tracking-tight">
                    Suraksha<span className="text-teal-400">Money</span>
                  </span>
                  <p className="text-xs text-slate-400">Protective Wealth Tech for India</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
                Suraksha Money AI bridges everyday financial prosperity with uncompromising elder
                payment defense. Built for India’s next billion digital users.
              </p>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <span className="material-symbols-outlined text-teal-400 text-sm">verified</span>
                <span>Empaneled with National Cyber Safety Standards</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs text-white font-bold uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => onNavigate('budget-planner')} className="hover:text-teal-400">
                    Smart Expense Engine
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('payment-assistant')} className="hover:text-teal-400">
                    Elder Rupee Shield
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('senior-friendly-mode')} className="hover:text-teal-400">
                    23-Language Voice UI
                  </button>
                </li>
                <li>
                  <a href="tel:1930" className="hover:text-teal-400">
                    Emergency SOS 1930 Link
                  </a>
                </li>
                <li>
                  <button onClick={() => onNavigate('trusted-contacts')} className="hover:text-teal-400">
                    Family Guardian Dashboard
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs text-white font-bold uppercase tracking-wider mb-4">
                Safety &amp; Regulatory
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <span className="hover:text-teal-400 cursor-default">RBI Digital Payment Guidelines</span>
                </li>
                <li>
                  <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="hover:text-teal-400">
                    India Cyber Crime Portal (1930)
                  </a>
                </li>
                <li>
                  <span className="hover:text-teal-400 cursor-default">Accessibility Policy (WCAG 2.2 AAA)</span>
                </li>
                <li>
                  <span className="hover:text-teal-400 cursor-default">256-bit AES Encryption Audit</span>
                </li>
                <li>
                  <span className="hover:text-teal-400 cursor-default">DPDP Act (India) Compliance</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs text-white font-bold uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => onNavigate('scam-safety-center')} className="hover:text-teal-400">
                    Help Center &amp; FAQs
                  </button>
                </li>
                <li>
                  <a href="tel:1930" className="hover:text-teal-400">
                    Senior Citizen Helpline 1930
                  </a>
                </li>
                <li>
                  <button onClick={() => onNavigate('settings-and-privacy')} className="hover:text-teal-400">
                    Privacy Policy &amp; Consent Log
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('settings-and-privacy')} className="hover:text-teal-400">
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#1E293B] flex flex-col md:flex-row items-center justify-between text-slate-500 text-xs gap-4">
            <p>© 2025 Suraksha Money AI Technologies Private Limited. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-teal-400 text-sm">lock</span>
                <span>Bank-Grade Encryption</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-teal-400 text-sm">accessibility</span>
                <span>WCAG 2.2 AAA Certified</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
