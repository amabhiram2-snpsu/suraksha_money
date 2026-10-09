import React, { useState } from 'react';
import { ViewMode, Transaction } from '../types';

interface ScamSafetyViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenScamSimulator: () => void;
  transactions: Transaction[];
}

export const ScamSafetyView: React.FC<ScamSafetyViewProps> = ({
  onNavigate,
  onOpenScamSimulator,
  transactions,
}) => {
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [riskThreshold, setRiskThreshold] = useState(80);
  const [toast, setToast] = useState<string | null>(null);

  const flaggedTransactions = transactions.filter((t) => t.threatLevel === 'high' || t.threatLevel === 'critical');

  const handleExportEvidence = (tx: Transaction) => {
    const evidenceData = {
      incidentId: `INC-${tx.id.toUpperCase()}`,
      exportedAt: new Date().toISOString(),
      portalDestination: 'National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in)',
      transactionHash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      recipientVpa: tx.recipientVpa,
      recipientName: tx.recipientName,
      threatScore: tx.riskScore,
      threatCategory: tx.category,
      amountRupees: tx.amount,
      riskReason: tx.riskReason || 'Heuristic threat pattern detected',
      deviceTelemetry: {
        guardianNotified: 'Rajesh Kumar (+91 98401 22319)',
        appState: 'SafeShield Auto-Halt Active',
      },
    };

    const blob = new Blob([JSON.stringify(evidenceData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cybercrime-Dossier-${tx.id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setToast(`Forensic Evidence Dossier exported for ${tx.recipientName}. Ready for 1930 upload.`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-16">
      {/* Header */}
      <div className="bg-[#131b2e] border border-red-500/40 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-red-400 bg-red-950/60 px-2.5 py-0.5 rounded border border-red-500/40">
              National Cyber Defense Sync
            </span>
            <span className="text-xs text-slate-400">Sections 11, 12 &amp; 13</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Scam Safety Center &amp; Evidence Dossier
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Real-time fraud telemetry and verified evidence export for bank disputes and 1930 reporting.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="tel:1930"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
            <span>Dial 1930 Helpline</span>
          </a>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          {toast}
        </div>
      )}

      {/* Flagged Incidents & Evidence Export */}
      <div className="bg-[#131b2e] border border-[#1E293B] rounded-2xl p-6 shadow-lg flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Preserved Incident Evidence Registry</h2>
            <p className="text-xs text-slate-400">
              Cryptographically timestamped audit logs for official police complaints
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-red-950 border border-red-500/40 text-red-300 font-bold">
            {flaggedTransactions.length} Interceptions Recorded
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {flaggedTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 rounded-xl bg-[#1E293B] border border-red-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-500 text-red-400 flex items-center justify-center font-bold flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">gshield</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{tx.recipientName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-red-600 text-white">
                      Risk {tx.riskScore}/100
                    </span>
                  </div>
                  <span className="text-xs font-mono text-red-300 mt-0.5">{tx.recipientVpa}</span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{tx.riskReason}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center">
                <button
                  onClick={() => handleExportEvidence(tx)}
                  className="px-3.5 py-2 rounded-xl bg-[#334155] hover:bg-slate-600 border border-slate-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[16px] text-teal-400">
                    download
                  </span>
                  <span>Export Evidence (JSON)</span>
                </button>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-600 text-red-200 text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1"
                >
                  <span>File at 1930 Portal</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automatic SMS Alerts Setup (Section 12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 bg-[#131b2e] border border-[#1E293B] rounded-2xl p-6 shadow-lg flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-400 text-[22px]">sms</span>
                <h3 className="text-base font-bold text-white">Automated Guardian SMS Alerts</h3>
              </div>
              <input
                type="checkbox"
                checked={smsAlertsEnabled}
                onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                className="w-5 h-5 text-teal-400 rounded focus:ring-0"
              />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When a transaction exceeds your safety risk threshold, Suraksha Money immediately
              dispatches a verified SMS alert to registered guardians.
            </p>

            <div className="mt-5 p-4 rounded-xl bg-[#1E293B] border border-[#334155] flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Trigger Alert Threshold:</span>
                <span className="font-extrabold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                  Risk Score &ge; {riskThreshold}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={riskThreshold}
                onChange={(e) => setRiskThreshold(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#060e20] rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>50 (Cautious)</span>
                <span>80 (Recommended High Risk)</span>
                <span>95 (Critical Only)</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#060e20] rounded-xl border border-slate-700 text-xs flex items-center justify-between">
            <span className="text-slate-400">Recipient Phone:</span>
            <span className="text-white font-mono font-bold">+91 98401 22319 (Son Rajesh Kumar)</span>
          </div>
        </div>

        {/* Official SMS Template Card (Section 12) */}
        <div className="lg:col-span-6 bg-[#131b2e] border border-[#1E293B] rounded-2xl p-6 shadow-lg flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                Official SMS Alert Template
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                Section 12 Spec
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Format verified with telecom DLT template norms (India):
            </p>

            <div className="mt-3 p-4 rounded-xl bg-[#060e20] border border-slate-700 text-xs font-mono text-slate-200 leading-relaxed select-all">
              "SAFETY ALERT: The account holder has made a payment of ₹2,500 to lottery-claims-rbi@okaxis
              on 09 Oct 2026 12:45 PM. Payment reference: UPI-984102. Risk reason: Advance lottery
              processing fee pattern match. Please contact the account holder and help verify this
              transaction. Preserve transaction details if fraud is suspected. For cybercrime
              assistance in India, contact official helpline 1930 or visit cybercrime.gov.in. This
              alert does not by itself confirm fraud."
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Rate limit: Max 2 alerts/hr to prevent flooding</span>
            <button
              onClick={onOpenScamSimulator}
              className="text-teal-400 font-bold hover:underline"
            >
              Run 60-Sec Family Test →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
