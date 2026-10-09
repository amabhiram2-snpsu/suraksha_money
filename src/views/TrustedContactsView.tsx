import React, { useState } from 'react';
import { ViewMode, TrustedContact } from '../types';

interface TrustedContactsViewProps {
  onNavigate: (view: ViewMode) => void;
  contacts: TrustedContact[];
  onAddContact: (contact: TrustedContact) => void;
  onUpdateContact: (contact: TrustedContact) => void;
}

export const TrustedContactsView: React.FC<TrustedContactsViewProps> = ({
  onNavigate,
  contacts,
  onAddContact,
  onUpdateContact,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState<TrustedContact['relationship']>('Son');
  const [otpStep, setOtpStep] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const handleStartVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setOtpStep(true);
    setToast(`Consent SMS with 6-digit OTP sent to ${phone}.`);
  };

  const handleCompleteOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const newContact: TrustedContact = {
      id: `tc_${Date.now()}`,
      name,
      phone,
      relationship,
      verified: true,
      device: 'Android Smartphone',
      deviceSecurity: 'Safe',
      suspiciousSms48h: 0,
      dailyTransferCap: 10000,
      permissions: {
        viewTransactions: true,
        receiveAlerts: true,
        requireCoApproval: true,
      },
    };
    onAddContact(newContact);
    setShowAddModal(false);
    setOtpStep(false);
    setName('');
    setPhone('');
    setOtpInput('');
    setToast(`Trusted Guardian "${name}" verified & activated.`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-16">
      {/* Header */}
      <div className="bg-[#131b2e] border border-[#1E293B] p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20">
              Family Protection Protocol
            </span>
            <span className="text-xs text-slate-400">Section 5 • Consent Scoped</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Trusted Guardians &amp; Family Co-Approval</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Explicitly authorized family contacts who receive high-risk scam alerts and provide 1-tap co-approval.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Add Trusted Guardian</span>
        </button>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          {toast}
        </div>
      )}

      {/* Philosophy Banner (Rule 5) */}
      <div className="p-4 rounded-xl bg-[#131b2e] border border-[#334155] text-xs text-slate-300 leading-relaxed flex items-start gap-3">
        <span className="material-symbols-outlined text-teal-400 text-[20px] flex-shrink-0 mt-0.5">
          privacy_tip
        </span>
        <p>
          <strong className="text-white">Dignity &amp; Autonomy Rule (Spec 5):</strong> The trusted
          contact exists strictly for safety assistance and emergency halts, never for secret monitoring
          or restricting a competent adult. The account holder retains full authority and can revoke
          guardian permissions at any time.
        </p>
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="bg-[#131b2e] border border-[#1E293B] rounded-2xl p-6 shadow-lg flex flex-col justify-between gap-5"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-base">
                    {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">{c.name}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                        {c.relationship}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono mt-0.5">{c.phone}</span>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Verified
                </span>
              </div>

              {/* Security Telemetry */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-[#1E293B] rounded-xl border border-[#334155] text-xs my-4">
                <div>
                  <span className="text-slate-400 text-[10px] block">Device Security</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[13px]">security</span> Safe
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Suspicious SMS</span>
                  <span className="font-bold text-white mt-0.5 block">{c.suspiciousSms48h} Detected</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Daily Co-Cap</span>
                  <span className="font-bold text-teal-300 mt-0.5 block">₹{c.dailyTransferCap.toLocaleString()}</span>
                </div>
              </div>

              {/* Scoped Permissions */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">Active Guardian Scopes:</span>
                <div className="flex flex-col gap-1.5 text-xs text-slate-400">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={c.permissions.receiveAlerts}
                      onChange={(e) => {
                        const updated = {
                          ...c,
                          permissions: { ...c.permissions, receiveAlerts: e.target.checked },
                        };
                        onUpdateContact(updated);
                      }}
                      className="w-4 h-4 text-teal-400 rounded"
                    />
                    <span>Receive High-Risk Scam SMS Alerts</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={c.permissions.requireCoApproval}
                      onChange={(e) => {
                        const updated = {
                          ...c,
                          permissions: { ...c.permissions, requireCoApproval: e.target.checked },
                        };
                        onUpdateContact(updated);
                      }}
                      className="w-4 h-4 text-teal-400 rounded"
                    />
                    <span>1-Tap Co-Approval for Payments Above Daily Cap</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={c.permissions.viewTransactions}
                      onChange={(e) => {
                        const updated = {
                          ...c,
                          permissions: { ...c.permissions, viewTransactions: e.target.checked },
                        };
                        onUpdateContact(updated);
                      }}
                      className="w-4 h-4 text-teal-400 rounded"
                    />
                    <span>View Redacted Transaction Ledger</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs">
              <span className="text-slate-400">Consent logged on 01 Jan 2025</span>
              <button
                onClick={() => {
                  if (window.confirm(`Revoke guardian access for ${c.name}?`)) {
                    setToast(`Permissions for ${c.name} have been revoked.`);
                  }
                }}
                className="text-red-400 hover:text-red-300 font-bold"
              >
                Revoke Access
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Guardian Modal with Simulated Consent OTP */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#131b2e] border border-[#334155] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-xs">
            <h3 className="text-base font-bold text-white">Add Trusted Guardian with Consent OTP</h3>
            {!otpStep ? (
              <form onSubmit={handleStartVerification} className="flex flex-col gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Guardian Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rohan Kumar, Priya Devi"
                    className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Mobile Number (with +91)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98401 22319"
                    className="w-full h-10 px-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as any)}
                    className="w-full h-10 px-2 rounded-lg bg-[#1E293B] border border-[#334155] text-white"
                  >
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Caregiver">Caregiver</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="p-3 bg-[#060e20] rounded-xl border border-slate-700 text-slate-300 text-[11px] leading-relaxed">
                  Rule 5: We will send an SMS consent verification link to this phone. Guardians only
                  receive alert notifications once they verify their identity.
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg bg-[#1E293B] text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-teal-400 text-slate-950 font-bold"
                  >
                    Send Consent OTP
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCompleteOtp} className="flex flex-col gap-3">
                <p className="text-slate-300 text-xs">
                  Enter the 6-digit OTP received on <span className="text-white font-mono">{phone}</span>:
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="e.g. 849201"
                  className="w-full h-12 text-center text-xl font-mono tracking-widest rounded-lg bg-[#1E293B] border border-teal-400 text-teal-300"
                  required
                />
                <span className="text-[11px] text-teal-400 text-center">
                  Demo hint: enter any 6 digits (e.g. 123456)
                </span>
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setOtpStep(false)}
                    className="px-4 py-2 rounded-lg bg-[#1E293B] text-slate-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold"
                  >
                    Verify &amp; Activate Guardian
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
