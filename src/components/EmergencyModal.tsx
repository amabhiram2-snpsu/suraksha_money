import React, { useState } from 'react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFreezeUpi: () => void;
  isUpiFrozen: boolean;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onFreezeUpi,
  isUpiFrozen,
}) => {
  const [alertSent, setAlertSent] = useState(false);

  if (!isOpen) return null;

  const handleNotifyFamily = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#131b2e] border-2 border-red-500/70 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.3)] overflow-hidden">
        {/* Top Warning Stripe */}
        <div className="h-2 w-full bg-red-600 animate-pulse"></div>

        <div className="p-6 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-950 border border-red-500/60 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                <span className="material-symbols-outlined text-[32px]">emergency</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-900/60 border border-red-600 text-red-200">
                  Critical Response Protocol
                </span>
                <h2 className="text-xl font-extrabold text-white mt-1">
                  Emergency Financial Defense
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#1E293B] text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            If you suspect a fraudulent call, fake OTP request, or unauthorized debit, act immediately.
            These controls bypass standard delays.
          </p>

          {/* Action List */}
          <div className="flex flex-col gap-3">
            {/* Action 1: Instant UPI Freeze */}
            <div className="p-4 rounded-xl bg-[#0b1326] border border-red-500/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-400 text-[28px]">
                  lock_clock
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isUpiFrozen ? 'Instant UPI Frozen' : 'Instant Freeze All UPI'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isUpiFrozen
                      ? 'Outbound debits are blocked across all linked bank VPAs.'
                      : 'Halt all outgoing digital debits immediately.'}
                  </p>
                </div>
              </div>
              <button
                onClick={onFreezeUpi}
                className={`px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-md ${
                  isUpiFrozen
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                }`}
              >
                {isUpiFrozen ? 'Unfreeze' : 'Freeze Now'}
              </button>
            </div>

            {/* Action 2: Dial 1930 */}
            <a
              href="tel:1930"
              className="p-4 rounded-xl bg-[#0b1326] border border-slate-700 hover:border-red-500/60 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-400 text-[28px]">
                  phone_in_talk
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">Dial 1930 Helpline</h4>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-200 border border-amber-500/40 font-bold">
                      24x7 India
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Direct line to Ministry of Home Affairs National Cyber Crime Portal.
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-amber-400 text-[22px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </a>

            {/* Action 3: Notify Family Guardian */}
            <div className="p-4 rounded-xl bg-[#0b1326] border border-slate-700 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-teal-400 text-[28px]">
                  contact_phone
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Alert Son Rajesh Kumar</h4>
                  <p className="text-xs text-slate-400">
                    Dispatches high-priority SMS &amp; screen alarm to registered guardian (+91 98401 22319).
                  </p>
                </div>
              </div>
              <button
                onClick={handleNotifyFamily}
                disabled={alertSent}
                className="px-4 py-2.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap"
              >
                {alertSent ? 'Alarm Sent!' : 'Alert Son'}
              </button>
            </div>
          </div>

          {alertSent && (
            <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Emergency SMS alert delivered to Rajesh Kumar. He has been prompted to call you.
            </div>
          )}

          {/* Footer note */}
          <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between text-xs text-slate-400">
            <span>Golden Rule: Never share OTP or PIN with any caller.</span>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#1E293B] text-slate-300 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
