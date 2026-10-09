import React, { useState } from 'react';
import { ViewMode, Transaction, LanguageCode } from '../types';
import { numberToIndianWords, speakHindi, speakEnglish } from '../utils/speech';
import { VoicePaymentModal } from '../components/VoicePaymentModal';
import { t } from '../utils/translations';

interface PaymentAssistantViewProps {
  onNavigate: (view: ViewMode) => void;
  transactions: Transaction[];
  onAddTransaction: (tx: Transaction) => void;
  isUpiFrozen: boolean;
  language?: LanguageCode;
}

export const PaymentAssistantView: React.FC<PaymentAssistantViewProps> = ({
  onNavigate,
  transactions,
  onAddTransaction,
  isUpiFrozen,
  language = 'hi',
}) => {
  // State for interactive demo
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isScamDemo, setIsScamDemo] = useState(true);
  const [recipientVpa, setRecipientVpa] = useState('lottery-claims-rbi@okaxis');
  const [amount, setAmount] = useState('2500');
  const [category, setCategory] = useState<'meds' | 'groceries' | 'family' | 'fees'>('fees');
  const [paymentNote, setPaymentNote] = useState('Advance registration fee for gold coin lottery claim');
  const [auditTab, setAuditTab] = useState<'all' | 'prevented' | 'successful' | 'pending'>('prevented');
  const [showPatternModal, setShowPatternModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; isError?: boolean } | null>(null);

  const amountNumeric = parseInt(amount.replace(/,/g, ''), 10) || 0;
  const verbalAmount = numberToIndianWords(amountNumeric);

  const showToast = (title: string, desc: string, isError = false) => {
    setToastMessage({ title, desc, isError });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleToggleDemoState = () => {
    if (isScamDemo) {
      // Switch to verified merchant Suresh Kumar
      setIsScamDemo(false);
      setRecipientVpa('suresh.kumar@okhdfcbank');
      setAmount('750');
      setCategory('groceries');
      setPaymentNote('Weekly organic vegetables ration');
      showToast(
        'Verified Merchant Active',
        'Loaded Suresh Kumar (Verified Green Tick, HDFC Bank, 6+ yrs). Safe to proceed.'
      );
    } else {
      // Switch back to high-risk scam demo
      setIsScamDemo(true);
      setRecipientVpa('lottery-claims-rbi@okaxis');
      setAmount('2500');
      setCategory('fees');
      setPaymentNote('Advance registration fee for gold coin lottery claim');
      showToast(
        'Scam Demo Mode Loaded',
        'Loaded Screen 15: Urgent Warning pattern with 92/100 threat score.',
        true
      );
    }
  };

  const handleSpeakWords = () => {
    speakEnglish(verbalAmount);
  };

  const handlePlayVoiceAlert = () => {
    if (isScamDemo) {
      speakHindi(
        'सावधान! यह यूपीआई आईडी फर्जी है और लॉटरी ठगी के लिए रिपोर्ट की गई है। कोई भी सरकारी संस्था पुरस्कार देने के लिए अग्रिम शुल्क नहीं मांगती। कृपया भुगतान रद्द करें।'
      );
    } else {
      speakHindi(
        'सत्यापित मर्चेंट। सुरेश कुमार के खाते में सात सौ पचास रुपये का भुगतान सुरक्षित है। आप अपना पिन दर्ज कर सकते हैं।'
      );
    }
  };

  const handleCancelAndReport = () => {
    showToast(
      'Payment Aborted & Reported',
      'Scam VPA recorded in 1930 Cyber Cell log. ₹2,500 remains secure in your account.'
    );
  };

  const handleSendToSon = () => {
    showToast(
      'Alert Sent to Son Rajesh',
      'WhatsApp & SMS co-approval link sent to Rajesh (+91 98401 22319). Transfer paused.'
    );
  };

  const handleOverride = (e: React.MouseEvent) => {
    e.preventDefault();
    const confirmed = window.confirm(
      'SURAKSHA SHIELD CRITICAL WARNING:\n\nThis payment has a 92% probability of fraud. Are you sure you wish to bypass this protection? Your family guardian (Rajesh) will be immediately alerted with location & device telemetry.'
    );
    if (confirmed) {
      showToast(
        'Guardian Alarm Triggered',
        'Senior Override initiated. SMS token required before PIN entry.',
        true
      );
    }
  };

  const handleProceedSafePayment = () => {
    if (isUpiFrozen) {
      showToast('UPI Blocked', 'Cannot transfer while UPI Freeze is active. Unfreeze in top bar.', true);
      return;
    }
    showToast('Secure UPI Gateway', `Launching authentic bank UPI PIN pad overlay for ₹${amountNumeric}.`);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Banner & Live Shield Ticker */}
      <div className="relative overflow-hidden rounded-2xl bg-[#131b2e] border border-[#334155] text-white p-6 shadow-xl mb-6">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.35)] flex-shrink-0">
              <span className="material-symbols-outlined text-[32px]">shield_with_heart</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase tracking-wider bg-teal-500/20 border border-teal-500/40 text-teal-300 px-2.5 py-0.5 rounded-full font-bold shadow-[0_0_8px_rgba(20,184,166,0.25)]">
                  SafeUPI Guard v4.2
                </span>
                <span className="text-xs text-slate-400">Dual-Guardian Verification Linked</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">Smart UPI Payment Shield</h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-0.5 leading-relaxed">
                Real-time heuristics analysis comparing recipient VPA metadata against 4.8M flagged
                cybercrime cases and NPCI spoof databases.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#1E293B]/70 border border-[#334155] backdrop-blur-md p-3.5 rounded-xl">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400">Prevented Scams This Month</span>
              <span className="text-lg font-bold text-emerald-400">
                ₹48,500 <span className="text-xs font-normal text-slate-400">(3 Traps Blocked)</span>
              </span>
            </div>
            <div className="h-10 w-px bg-slate-700"></div>
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-xs shadow-[0_0_20px_rgba(79,219,200,0.5)] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
              <span>🎙️ Pay with Voice (बोलकर भुगतान)</span>
            </button>
            <button
              onClick={handlePlayVoiceAlert}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#334155] hover:bg-slate-600 border border-slate-500 text-white transition-all text-xs font-bold shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] text-teal-400">
                record_voice_over
              </span>
              <span>Awaaz Sahayak (Hindi/मराठी)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Split: Form (Left) vs Risk Review (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Initiate Safe Transfer (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#131b2e] border border-[#1E293B] rounded-2xl p-6 shadow-lg flex flex-col gap-5">
            {/* Header & Mode Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 font-bold text-xs">
                  01
                </span>
                <h2 className="text-lg font-bold text-white">Initiate Safe Transfer</h2>
              </div>
              <div className="flex items-center gap-1 bg-[#1E293B] p-1 rounded-xl border border-[#334155]">
                <button className="px-3 py-1 rounded-lg bg-[#334155] border border-slate-600 text-white text-xs font-bold shadow-sm">
                  Standard UPI
                </button>
                <button className="px-3 py-1 rounded-lg text-slate-400 hover:text-white text-xs transition-colors">
                  IMPS / Bank
                </button>
              </div>
            </div>

            {/* Recipient Input & Toggle */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1">
                  <span>Recipient UPI ID or 10-Digit Mobile Number</span>
                  <span className="text-red-500">*</span>
                </label>
                <button
                  onClick={handleToggleDemoState}
                  className="text-xs text-teal-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">shuffle</span>
                  <span>{isScamDemo ? 'Switch to Verified Merchant' : 'Switch to Scam Demo'}</span>
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-[22px]">alternate_email</span>
                </div>
                <input
                  type="text"
                  value={recipientVpa}
                  onChange={(e) => setRecipientVpa(e.target.value)}
                  placeholder="e.g. suresh.kumar@okhdfcbank or 9820198201"
                  className="w-full h-14 pl-11 pr-24 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-base font-semibold focus:outline-none focus:border-teal-400 transition-all font-mono"
                />
                <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                  <button
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="p-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 flex items-center gap-1 text-xs font-bold"
                    title="Pay with Voice"
                  >
                    <span className="material-symbols-outlined text-[18px]">mic</span>
                    <span className="hidden sm:inline">Voice</span>
                  </button>
                  <button
                    onClick={() => alert('Camera QR scanner ready for UPI merchant codes.')}
                    className="p-2 rounded-lg bg-[#334155] hover:bg-slate-600 border border-slate-500 text-white flex items-center gap-1 text-xs font-semibold"
                  >
                    <span className="material-symbols-outlined text-[18px] text-teal-400">
                      qr_code_scanner
                    </span>
                    <span className="hidden sm:inline">Scan QR</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Verification Result Strip */}
              {isScamDemo ? (
                <div className="mt-1 p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-white flex items-start justify-between gap-4 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[24px] text-red-500 flex-shrink-0 mt-0.5">
                      warning
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-red-300">
                          Unverified Claim Handler
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white shadow-sm">
                          UNVERIFIED VPA
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        VPA created today (2 hrs ago). High similarity to banned banking fraud
                        clusters. 14 user reports recorded on 1930 Cyber Cell.
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[11px] block text-slate-400">Trust Score</span>
                    <span className="text-xl font-extrabold text-red-400">8/100</span>
                  </div>
                </div>
              ) : (
                <div className="mt-1 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-white flex items-start justify-between gap-4 transition-all shadow-[0_0_15px_rgba(74,225,118,0.15)]">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[24px] text-emerald-400 flex-shrink-0 mt-0.5">
                      verified
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-emerald-300">Suresh Kumar</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 shadow-sm">
                          VERIFIED MERCHANT (Green Tick)
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Registered merchant with HDFC Bank for 6+ years. 12,400+ safe verified
                        transactions without dispute.
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[11px] block text-slate-400">Trust Score</span>
                    <span className="text-xl font-extrabold text-emerald-400">98/100</span>
                  </div>
                </div>
              )}
            </div>

            {/* Transfer Amount Field with Accidental Zero Prevention */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white">Transfer Amount (INR)</label>
                <span className="text-xs text-slate-400">Daily Senior Limit: ₹50,000</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-teal-400 font-extrabold text-2xl">
                  ₹
                </div>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-16 pl-11 pr-4 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-2xl font-extrabold focus:outline-none focus:border-teal-400 tracking-tight"
                />
              </div>

              {/* Verbal Guard Indian Words Banner */}
              <div className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-teal-400">
                    spellcheck
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                      Amount in Words (Verbal Guard)
                    </span>
                    <span className="text-xs sm:text-sm text-white font-bold">{verbalAmount}</span>
                  </div>
                </div>
                <button
                  onClick={handleSpeakWords}
                  className="w-9 h-9 rounded-full bg-[#334155] hover:bg-slate-600 border border-slate-500 flex items-center justify-center text-teal-400 transition-colors shadow-sm"
                  title="Read aloud amount"
                >
                  <span className="material-symbols-outlined text-[18px]">volume_up</span>
                </button>
              </div>
            </div>

            {/* Payment Category Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white">Payment Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'meds', label: 'Medicines', icon: 'medication' },
                  { id: 'groceries', label: 'Groceries', icon: 'shopping_cart' },
                  { id: 'family', label: 'Family Aid', icon: 'family_restroom' },
                  { id: 'fees', label: 'Fees / Claims', icon: 'monetization_on' },
                ].map((cat) => {
                  const isSelected = category === cat.id;
                  const isScamCat = cat.id === 'fees';
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id as any)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                        isSelected
                          ? isScamCat
                            ? 'bg-red-950/80 border-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                            : 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_12px_rgba(79,219,200,0.25)]'
                          : 'bg-[#1E293B] border-[#334155] hover:border-slate-500 text-slate-300'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[22px] ${
                          isSelected && isScamCat ? 'text-red-400' : 'text-teal-400'
                        }`}
                      >
                        {cat.icon}
                      </span>
                      <span className="text-xs font-semibold">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
              {category === 'fees' && isScamDemo && (
                <span className="text-xs text-red-400 bg-red-950/50 border border-red-500/40 px-3 py-1.5 rounded-lg mt-1">
                  ⚠️ Category "Fees / Claims" paired with brand new VPAs is an 89% correlated scam
                  vector.
                </span>
              )}
            </div>

            {/* Note & Reason */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white">Payment Note / Reason</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="flex-1 h-12 px-4 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-xs focus:outline-none focus:border-teal-400"
                />
                <button
                  onClick={() => alert('Listening to voice memo... (e.g. "Payment for monthly groceries")')}
                  className="h-12 px-3.5 rounded-xl bg-[#334155] border border-slate-500 text-white hover:bg-slate-600 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-teal-400">mic</span>
                  <span>Voice Note</span>
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (isScamDemo) {
                    showToast(
                      'Heuristic Scan Complete',
                      'Screen 15: Critical Scam Pattern confirmed for advance lottery registration.',
                      true
                    );
                  } else {
                    handleProceedSafePayment();
                  }
                }}
                className={`w-full sm:flex-1 h-14 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isScamDemo
                    ? 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-[0_0_20px_rgba(79,219,200,0.35)]'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(74,225,118,0.35)]'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">
                  {isScamDemo ? 'policy' : 'lock'}
                </span>
                <span>
                  {isScamDemo ? 'Run SafeCheck & Review Risks' : 'Proceed to UPI PIN Entry (Safe)'}
                </span>
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto h-14 px-6 rounded-xl bg-[#1E293B] border border-[#334155] text-slate-300 hover:text-white hover:bg-[#334155] text-xs font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Pre-Approved Safe Beneficiaries */}
          <div className="bg-[#131b2e] border border-[#1E293B] rounded-2xl p-6 shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-emerald-400">
                  verified_user
                </span>
                <h3 className="text-base font-bold text-white">Pre-Approved Safe Beneficiaries</h3>
              </div>
              <span className="text-xs text-slate-400">Zero-Risk Guaranteed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Contact 1: Rajesh */}
              <div
                onClick={() => {
                  setRecipientVpa('rajesh.devi@icici');
                  setAmount('5000');
                  setCategory('family');
                  setPaymentNote('Monthly household contingency allocation');
                  setIsScamDemo(false);
                  showToast('Selected: Rajesh Kumar', 'Primary Family Guardian selected. Zero-risk transfer.');
                }}
                className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-teal-400/50 transition-all cursor-pointer flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    alt="Son Rajesh"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/50"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe85N1dTgGML6CgQPl_uWvd9CnUhPteOY0G4Bf0Rs5M8WR7-hR7YSTb_eBsvMe_THX93k1NTyK4RDwvhBMAx3jGnS1TF5i3E7ozIyMyB9i8QFYUZyf5K0iIPUizTZCVXeUuXKzSCp4xbbdinA8qxBh4dQzNZ_4Gf5bXJuS_XPvR3M7DIRlcREpDquC5-TBu8YTX-Sw49oB1iP4zWr3B11c1eUqfWo5go2iTbp_FfbEvUEgzrSPVaVR"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate">Rajesh (Son)</span>
                    <span className="text-[11px] text-slate-400 truncate">rajesh.devi@icici</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded font-bold w-fit">
                  Primary Guardian
                </span>
              </div>

              {/* Contact 2: Apollo Pharmacy */}
              <div
                onClick={() => {
                  setRecipientVpa('apollomed.mumbai@upi');
                  setAmount('850');
                  setCategory('meds');
                  setPaymentNote('BP and Diabetes tablets month refill');
                  setIsScamDemo(false);
                  showToast('Selected: Apollo Pharmacy', 'Whitelisted neighborhood merchant. Safe to pay.');
                }}
                className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-teal-400/50 transition-all cursor-pointer flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    alt="Apollo Chemist"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-400/40"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvNye3mKVQY20coH9ntLA8LsTGpbkc4d7JfO3IQT4Ql8aPpEEEDuYDbF1rMhnTS0tJbiqzTQcjDf4akV1cc3p6mHE7Xg6Pw9sJnpKXAuw0CE5n3jTXvd24EEUoY6DATe5XyBeh9kRPWyYKGTJfDO7xLzJX70RjGYjImrIy9JjX7Umcynxyo2ni97NofbQR1P8TrJZbpvRdNPu8e_I6It-xeJ-wBykBFVX2016jmUH8bpiAKo6ryHMh"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate">Apollo Pharmacy</span>
                    <span className="text-[11px] text-slate-400 truncate">apollomed.mumbai@upi</span>
                  </div>
                </div>
                <span className="text-[10px] bg-[#334155] border border-slate-600 text-teal-300 px-2 py-0.5 rounded font-semibold w-fit">
                  Whitelisted Merchant
                </span>
              </div>

              {/* Contact 3: Electricity Board */}
              <div
                onClick={() => {
                  setRecipientVpa('billdesk.msedcl@sbi');
                  setAmount('1820');
                  setCategory('meds');
                  setPaymentNote('Official electricity consumer bill #482910');
                  setIsScamDemo(false);
                  showToast('Selected: MSEDCL Official', 'Authorized government utility BBPS portal.');
                }}
                className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-teal-400/50 transition-all cursor-pointer flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(74,225,118,0.4)]">
                    MH
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate">MSEDCL Electricity</span>
                    <span className="text-[11px] text-slate-400 truncate">billdesk.msedcl@sbi</span>
                  </div>
                </div>
                <span className="text-[10px] bg-[#334155] border border-slate-600 text-teal-300 px-2 py-0.5 rounded font-semibold w-fit">
                  Official Utility
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Screen 15: Urgent Warning Review Showcase (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {isScamDemo ? (
            /* High-Risk Screen 15 Warning Drawer */
            <div className="bg-[#131b2e] border-2 border-red-500/60 rounded-2xl p-6 shadow-[0_0_35px_rgba(239,68,68,0.25)] flex flex-col gap-4 relative overflow-hidden animate-fade-in">
              <div className="h-1.5 w-full bg-red-600 shadow-[0_0_10px_#EF4444] absolute top-0 left-0"></div>

              {/* Top Warning Badge */}
              <div className="flex items-start gap-4 pt-2">
                <div className="w-14 h-14 rounded-2xl bg-red-950 border border-red-500/60 text-red-400 flex items-center justify-center flex-shrink-0 animate-bounce shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                  <span className="material-symbols-outlined text-[34px]">gshield</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
                      Screen 15: Urgent Warning
                    </span>
                    <span className="text-[11px] text-red-400 font-bold">High Severity</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-red-400 leading-snug mt-1">
                    ⚠️ Please Review This Payment Before Proceeding
                  </h2>
                </div>
              </div>

              {/* Context Box */}
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-white flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-red-400">
                  <span className="material-symbols-outlined text-[18px]">report</span>
                  <span>Critical Threat Intelligence Match</span>
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-200">
                  Recipient UPI ID{' '}
                  <strong className="bg-[#060e20] border border-red-500/40 px-1.5 py-0.5 rounded font-mono text-red-400">
                    lottery-claims-rbi@okaxis
                  </strong>{' '}
                  was created just <strong>2 hours ago</strong> and is flagged by <strong>14 users</strong>{' '}
                  for impersonation scams.
                </p>
              </div>

              {/* Fraud Gauge */}
              <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Fraud Risk Level
                  </span>
                  <span className="text-lg font-extrabold text-red-500">HIGH RISK</span>
                  <span className="text-xs text-slate-300">Pattern: Fake Reward Fee Trap</span>
                </div>
                <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-700"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-red-500"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="92, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-base font-bold text-red-500 leading-none">92</span>
                    <span className="text-[8px] text-slate-400 font-bold">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Simple Words Explanation */}
              <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Explanation in Simple Words</span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    “This recipient claims you won a prize and asks you to send ₹2,500 first.{' '}
                    <strong className="text-white font-semibold">
                      Genuine government bodies, banks, or lotteries NEVER charge advance processing
                      fees
                    </strong>{' '}
                    to credit funds into your account. If you send this, you cannot recover it.”
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  onClick={handleCancelAndReport}
                  className="w-full h-14 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                >
                  <span className="material-symbols-outlined text-[24px]">block</span>
                  <span>Cancel Payment &amp; Report Scam</span>
                </button>
                <button
                  onClick={handleSendToSon}
                  className="w-full h-12 rounded-xl bg-[#334155] border border-slate-500 text-white hover:border-teal-400 hover:bg-slate-600 transition-all text-xs font-bold flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px] text-teal-400">
                    supervisor_account
                  </span>
                  <span>Send to Son Rajesh for 1-Tap Verification</span>
                </button>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={() => setShowPatternModal(true)}
                    className="h-11 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-teal-400">
                      troubleshoot
                    </span>
                    <span>View Pattern</span>
                  </button>
                  <a
                    href="tel:1930"
                    className="h-11 rounded-xl bg-[#1E293B] hover:bg-red-950/80 border border-[#334155] hover:border-red-500 text-red-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors text-center"
                  >
                    <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
                    <span>Dial 1930 Helpline</span>
                  </a>
                </div>
              </div>

              {/* Bypass Link */}
              <div className="pt-2 text-center">
                <button
                  onClick={handleOverride}
                  className="text-[11px] text-slate-400 hover:text-red-400 underline transition-colors"
                >
                  I understand the risk and want to enter UPI PIN anyway (Senior Safety Bypass PIN
                  required)
                </button>
              </div>
            </div>
          ) : (
            /* Safe Clear Drawer */
            <div className="bg-[#131b2e] border-2 border-emerald-500/60 rounded-2xl p-6 shadow-[0_0_35px_rgba(74,225,118,0.2)] flex flex-col gap-4 relative overflow-hidden animate-fade-in">
              <div className="h-1.5 w-full bg-emerald-400 shadow-[0_0_10px_#4ae176] absolute top-0 left-0"></div>
              <div className="flex items-start gap-4 pt-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(74,225,118,0.3)]">
                  <span className="material-symbols-outlined text-[34px]">verified_user</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wide">
                      Screen 14: All Clear
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold">Safe Transfer</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-white leading-snug mt-1">
                    Recipient Identity Fully Verified
                  </h2>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#1E293B] border border-emerald-500/30 text-white flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-400">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Zero Cybercrime Flags Found</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Recipient <strong className="font-mono text-emerald-400">suresh.kumar@okhdfcbank</strong>{' '}
                  is tied to an active, verified commercial merchant license. Safe to enter UPI PIN.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  onClick={handleProceedSafePayment}
                  className="w-full h-14 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(74,225,118,0.35)] transition-all"
                >
                  <span className="material-symbols-outlined text-[22px]">lock</span>
                  <span>Proceed to UPI PIN Entry (Safe)</span>
                </button>
                <button
                  onClick={handleToggleDemoState}
                  className="w-full h-12 rounded-xl bg-[#1E293B] border border-[#334155] text-slate-300 hover:text-white hover:bg-[#334155] text-xs font-bold transition-all"
                >
                  Return to High-Risk Scam Demo (Screen 15)
                </button>
              </div>
            </div>
          )}

          {/* Regional Audio Player Strip */}
          <div className="rounded-xl bg-[#131b2e] border border-[#1E293B] p-4 flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">hearing</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Need someone to read this?</span>
                <span className="text-[11px] text-slate-400">
                  Suraksha Money speaks alerts in 7 regional Indian languages
                </span>
              </div>
            </div>
            <button
              onClick={handlePlayVoiceAlert}
              className="px-3.5 py-2 rounded-xl bg-teal-400 text-slate-950 text-xs font-bold hover:bg-teal-300 flex items-center gap-1 flex-shrink-0 shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              <span>Play Hindi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Payment Audit & Threat Registry */}
      <div className="mt-12 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ae176]"></span>
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                Forensic Transparency
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              Payment Audit &amp; Threat Registry
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Continuous logs with verified cryptographic hashes for bank dispute evidence.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-[#131b2e] border border-[#1E293B] p-1.5 rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
            {[
              { id: 'all', label: 'All Transfers (48)' },
              { id: 'prevented', label: 'Flagged & Prevented (3)', dot: true },
              { id: 'successful', label: 'Successful (43)' },
              { id: 'pending', label: 'Pending Verification (2)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAuditTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  auditTab === tab.id
                    ? 'bg-[#334155] border border-slate-500 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.dot && <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_#EF4444]"></span>}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="rounded-2xl bg-[#131b2e] border border-[#334155] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-400 shadow-[0_0_10px_#4ae176]"></div>
          <div className="flex items-center gap-4 pl-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(74,225,118,0.3)]">
              <span className="material-symbols-outlined text-[28px]">savings</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wide">
                Recent Landmark Intervention
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                ₹15,000 saved from Fake Electricity Bill Disconnection Scam
              </h3>
              <p className="text-xs text-slate-400">
                Prevented last Tuesday at 7:14 PM • Impersonator claimed power cut within 30 minutes.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('scam-safety-center')}
            className="px-4 py-2 rounded-xl bg-[#334155] border border-slate-500 text-white hover:border-teal-400 text-xs font-bold shadow-sm transition-all flex items-center gap-2 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[18px] text-teal-400">
              assignment_turned_in
            </span>
            <span>View Police Report Dossier</span>
          </button>
        </div>

        {/* Audit Table */}
        <div className="bg-[#131b2e] border border-[#1E293B] rounded-2xl shadow-lg overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1E293B] border-b border-[#334155] text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6">Recipient &amp; Entity</th>
                  <th className="py-4 px-6">Date &amp; Time</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Threat Assessment</th>
                  <th className="py-4 px-6">Safety Outcome</th>
                  <th className="py-4 px-6 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B] text-white text-xs">
                {/* Row 1: Prevented electricity scam */}
                <tr className="hover:bg-[#1E293B]/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/50 text-red-400 flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[20px]">electric_bolt</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white">electricity-bill-urgent@axis</span>
                        <span className="text-[11px] text-slate-400">Spoofed "BSES Maharashtra Officer"</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-400">Last Tuesday, 7:14 PM</td>
                  <td className="py-4 px-6 font-extrabold text-red-400 text-sm">₹15,000</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-500/50 text-red-300 text-[10px] font-bold">
                      <span className="material-symbols-outlined text-[14px]">dangerous</span>
                      <span>Risk Score 96 (Threat)</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-red-400">Auto-Blocked by SafeShield</span>
                      <span className="text-[11px] text-slate-400">Son Rajesh alerted via SMS</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setShowPatternModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-xs font-semibold text-white transition-colors"
                    >
                      Details &amp; Audit Trail
                    </button>
                  </td>
                </tr>

                {/* Row 2: Lottery claims */}
                <tr className="hover:bg-[#1E293B]/60 transition-colors bg-red-950/10">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/50 text-red-400 flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[20px]">card_giftcard</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white">lottery-claims-rbi@okaxis</span>
                        <span className="text-[11px] text-slate-400">Fake RBI prize release fee</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-400">Just now (In Review)</td>
                  <td className="py-4 px-6 font-extrabold text-red-400 text-sm">₹2,500</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                      <span className="material-symbols-outlined text-[14px]">gshield</span>
                      <span>Risk Score 92 (Critical)</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-amber-400">Payment Frozen on Screen 15</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={handleCancelAndReport}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
                    >
                      Block VPA Now
                    </button>
                  </td>
                </tr>

                {/* Row 3: Apollo Pharmacy */}
                <tr className="hover:bg-[#1E293B]/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[20px]">local_pharmacy</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white">Apollo Pharmacy Powai</span>
                        <span className="text-[11px] text-slate-400">apollomed.mumbai@upi</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-400">24 Oct 2024, 11:30 AM</td>
                  <td className="py-4 px-6 font-bold text-white text-sm">₹1,840</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      <span>Safe (Score 2)</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-emerald-400">Completed • Verified Merchant</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => alert('Opening verified digital receipt #RCP-849102...')}
                      className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-xs font-semibold text-white transition-colors"
                    >
                      Receipt
                    </button>
                  </td>
                </tr>

                {/* Row 4: Rajesh Kumar Son */}
                <tr className="hover:bg-[#1E293B]/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white">Rajesh Kumar (Son)</span>
                        <span className="text-[11px] text-slate-400">rajesh.devi@icici</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-400">19 Oct 2024, 09:12 AM</td>
                  <td className="py-4 px-6 font-bold text-white text-sm">₹10,000</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                      <span className="material-symbols-outlined text-[14px]">family_star</span>
                      <span>Family Guardian</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-emerald-400">Completed • Biometric OK</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => alert('Opening verified digital receipt #RCP-192837...')}
                      className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-xs font-semibold text-white transition-colors"
                    >
                      Receipt
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Security Signature */}
          <div className="bg-[#1E293B] border-t border-[#334155] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-teal-400">verified</span>
              <span>End-to-End NPCI Encrypted Audit Trail with SHA-256 State Signatures</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Showing 4 of 48 records</span>
              <button
                onClick={() => alert('Generating formal annual tax & payment audit certificate (PDF)...')}
                className="text-teal-400 font-bold hover:underline"
              >
                Download Annual Tax &amp; Safety Statement
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Scam Pattern Modal Overlay */}
      {showPatternModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#131b2e] border border-[#334155] max-w-xl w-full rounded-2xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-500/50 text-red-400 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[24px]">troubleshoot</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Scam Signature Analysis</h3>
                  <span className="text-xs text-red-400 font-semibold">
                    C-DOT CERT-In Threat Vector #4910
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowPatternModal(false)}
                className="w-8 h-8 rounded-full bg-[#1E293B] hover:bg-[#334155] border border-[#334155] flex items-center justify-center text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] flex flex-col gap-1">
                <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                  Identified Modus Operandi
                </span>
                <h4 className="text-sm font-bold text-white">Advance Fee Fraud &amp; Fake Lotteries</h4>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  Perpetrators impersonate reputable organizations (RBI, KBC, Tata Trust) sending
                  fake letters or WhatsApp claims. They request small upfront payments (₹2,500 -
                  ₹5,000) disguised as 'stamp duty', 'clearance fees', or 'GST' to claim a prize of
                  ₹25,00,000.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-white font-bold uppercase tracking-wider">
                  Why Suraksha Money Triggered Screen 15:
                </span>
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#1E293B] border border-[#334155]">
                  <span className="material-symbols-outlined text-red-400 text-[18px]">
                    history_toggle_off
                  </span>
                  <span className="text-slate-300">
                    <strong className="text-white">Fresh Account:</strong> UPI handle created less
                    than 120 minutes ago.
                  </span>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#1E293B] border border-[#334155]">
                  <span className="material-symbols-outlined text-red-400 text-[18px]">
                    group_remove
                  </span>
                  <span className="text-slate-300">
                    <strong className="text-white">Crowd Intelligence:</strong> 14 separate numbers
                    reported phishing SMS from this handle today.
                  </span>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#1E293B] border border-[#334155]">
                  <span className="material-symbols-outlined text-red-400 text-[18px]">
                    spellcheck
                  </span>
                  <span className="text-slate-300">
                    <strong className="text-white">Keyword Anomaly:</strong> Note contains
                    "registration fee" and "lottery claim", a classic trigger word set.
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1E293B] border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-400 block">Official Advisory</span>
                  <span className="text-slate-300">
                    Reserve Bank of India Never Issues Prizes to Public
                  </span>
                </div>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
                >
                  cybercrime.gov.in
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowPatternModal(false)}
              className="w-full h-12 rounded-xl bg-teal-400 text-slate-950 font-bold text-sm hover:bg-teal-300 transition-all"
            >
              Understood, Return to Safety Screen
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 max-w-md bg-[#1E293B] border border-[#334155] text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              toastMessage.isError
                ? 'bg-red-950 border border-red-500/50 text-red-400'
                : 'bg-teal-500/20 border border-teal-500/40 text-teal-400'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {toastMessage.isError ? 'error' : 'check_circle'}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold truncate">{toastMessage.title}</span>
            <span className="text-[11px] text-slate-300 leading-tight">
              {toastMessage.desc}
            </span>
          </div>
        </div>
      )}

      {/* Voice Payment Guard Modal */}
      <VoicePaymentModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onAddTransaction={onAddTransaction}
        language={language}
        isUpiFrozen={isUpiFrozen}
      />
    </div>
  );
};
