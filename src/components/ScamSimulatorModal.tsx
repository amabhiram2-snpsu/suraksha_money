import React, { useState } from 'react';

interface ScamSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Scenario {
  id: number;
  title: string;
  source: string;
  message: string;
  threatDetails: string;
  options: {
    label: string;
    isSafe: boolean;
    explanation: string;
  }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: 'Threat #104: Midnight Power Cut SMS',
    source: 'SMS from unknown sender "VM-BSES-ALERT"',
    message: '“Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM due to un-updated previous month bill. Immediately call power officer at 9811234567 or download our support app http://power-update-pay.apk to avoid blackout.”',
    threatDetails: 'Classic APK Trojan lure. Electricity boards NEVER send raw APK download links via private SMS.',
    options: [
      {
        label: 'Click the link to download the app and pay the bill immediately',
        isSafe: false,
        explanation: 'DANGEROUS! The .apk file is a remote-access Trojan that grants scammers screen-sharing access to intercept your OTP and steal money.',
      },
      {
        label: 'Call the mobile number mentioned in the SMS to clarify',
        isSafe: false,
        explanation: 'RISKY! The phone number belongs to the scam syndicate who will speak authoritatively to panic you into installing AnyDesk or making a rush UPI payment.',
      },
      {
        label: 'Ignore the link, check official electricity portal directly, and alert SafePaisa',
        isSafe: true,
        explanation: 'CORRECT! Always verify via your official electricity board utility app or bill receipt. SafePaisa intercepts these APK downloads in 40ms.',
      },
    ],
  },
  {
    id: 2,
    title: 'Threat #218: Reserve Bank of India Lottery Award',
    source: 'WhatsApp letterhead with fake national emblem',
    message: '“Congratulations! Under PM Digital Bharat scheme, your mobile number won ₹25,00,000 cash award. To release funds, transfer ₹2,500 refundable stamp registration fee to lottery-claims-rbi@okaxis.”',
    threatDetails: 'Advance-fee fraud. The Reserve Bank of India NEVER conducts prize lotteries or requests public fees.',
    options: [
      {
        label: 'Send ₹2,500 advance fee since ₹25 Lakhs is a huge prize',
        isSafe: false,
        explanation: 'DANGEROUS! You will lose the ₹2,500 and scammers will demand even larger "clearance fees". Lotteries asking for advance money are 100% fake.',
      },
      {
        label: 'Block sender immediately, never pay upfront fees, and report to 1930',
        isSafe: true,
        explanation: 'CORRECT! Legitimate prizes or government payouts NEVER require you to send advance money or processing fees.',
      },
    ],
  },
  {
    id: 3,
    title: 'Threat #312: Urgent SBI KYC Expiry Phone Call',
    source: 'Caller claiming to be SBI Branch Manager',
    message: '“Sir/Madam, your ATM card and NetBanking are blocked due to pending PAN KYC. I am sending an OTP right now. Read out the 6-digit OTP over the phone so I can reactivate your account.”',
    threatDetails: 'Vishing (Voice phishing). Bank employees NEVER ask for OTPs or PINs over phone calls.',
    options: [
      {
        label: 'Read out the OTP quickly so your account isn\'t blocked',
        isSafe: false,
        explanation: 'DANGEROUS! The OTP is for an unauthorized transaction initiated by the scammer. Reading it allows them to drain your bank balance.',
      },
      {
        label: 'Refuse to share OTP, disconnect call, and visit your local branch',
        isSafe: true,
        explanation: 'CORRECT! No bank manager, police officer, or government official will ever ask for your OTP. This is the #1 Golden Rule of Indian digital safety.',
      },
    ],
  },
];

export const ScamSimulatorModal: React.FC<ScamSimulatorModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (!isOpen) return null;

  const currentScenario = SCENARIOS[currentStep];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (currentScenario.options[idx].isSafe) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentStep < SCENARIOS.length - 1) {
      setCurrentStep((s) => s + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#131b2e] border border-teal-500/40 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#1E293B] bg-[#0b1326] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <span className="material-symbols-outlined text-[24px]">shield</span>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                Community Defense Simulator
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                60-Second Family Cyber Awareness Test
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1E293B] text-slate-400 hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {!quizCompleted ? (
            <div className="flex flex-col gap-5">
              {/* Progress */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Scenario {currentStep + 1} of {SCENARIOS.length}
                </span>
                <span>Current Defense Score: {score} safe answers</span>
              </div>
              <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-400 h-full transition-all"
                  style={{ width: `${((currentStep + 1) / SCENARIOS.length) * 100}%` }}
                ></div>
              </div>

              {/* Threat Box */}
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-red-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[20px] text-red-400">
                      warning
                    </span>
                    {currentScenario.title}
                  </span>
                  <span className="text-xs text-red-400/80">{currentScenario.source}</span>
                </div>
                <p className="text-sm italic font-medium leading-relaxed bg-[#0b1326]/60 p-3 rounded-lg border border-red-900/40 text-white">
                  {currentScenario.message}
                </p>
              </div>

              {/* Question */}
              <p className="text-sm font-bold text-white">
                How should your parent or family member respond to this?
              </p>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {currentScenario.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  let cardStyle =
                    'bg-[#1E293B] border-[#334155] text-slate-200 hover:border-teal-500/60';
                  if (selectedOption !== null) {
                    if (option.isSafe) {
                      cardStyle = 'bg-emerald-950/70 border-emerald-500 text-white font-medium';
                    } else if (isSelected) {
                      cardStyle = 'bg-red-950/70 border-red-500 text-red-100 font-medium';
                    } else {
                      cardStyle = 'bg-[#1E293B]/40 border-slate-800 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={selectedOption !== null}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${cardStyle}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{option.label}</span>
                        {selectedOption !== null && (
                          <span className="material-symbols-outlined text-[20px] flex-shrink-0 ml-2">
                            {option.isSafe ? 'check_circle' : 'cancel'}
                          </span>
                        )}
                      </div>
                      {selectedOption !== null && (
                        <p
                          className={`text-xs mt-1 leading-relaxed ${
                            option.isSafe ? 'text-emerald-300' : 'text-red-300'
                          }`}
                        >
                          {option.explanation}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg"
                  >
                    <span>
                      {currentStep < SCENARIOS.length - 1 ? 'Next Scenario' : 'View Results'}
                    </span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Results Screen */
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-20 h-20 rounded-2xl bg-teal-500/20 border border-teal-500/50 flex items-center justify-center text-teal-400 shadow-[0_0_30px_rgba(79,219,200,0.3)]">
                <span className="material-symbols-outlined text-[48px]">verified_user</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Family Cyber Readiness:{' '}
                <span className="text-teal-400">
                  {score === SCENARIOS.length ? '100% Armor' : `${Math.round((score / SCENARIOS.length) * 100)}% Protected`}
                </span>
              </h3>
              <p className="text-sm text-slate-300 max-w-md leading-relaxed">
                {score === SCENARIOS.length
                  ? 'Outstanding! You correctly recognized the spoofed APK link, advance lottery trap, and phone KYC lure. Keep SafePaisa AI active to safeguard joint family accounts.'
                  : 'Good effort! Remember the primary rule: Banks and utility companies never ask for urgent payments or OTPs through unofficial APK links or phone calls.'}
              </p>

              <div className="p-4 rounded-xl bg-[#0b1326] border border-slate-700 w-full text-left flex items-center justify-between mt-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Official Support Contacts
                  </h4>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    Cybercrime Helpline: 1930 · cybercrime.gov.in
                  </p>
                </div>
                <span className="text-xs text-teal-400 font-bold">24x7 India</span>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white font-semibold text-sm"
                >
                  Retake Test
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm shadow-md"
                >
                  Return to Suraksha Money
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
