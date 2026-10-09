import React, { useState, useEffect } from 'react';
import { Transaction, LanguageCode } from '../types';
import { numberToIndianWords, speakHindi, speakEnglish } from '../utils/speech';

interface VoicePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: Transaction) => void;
  language?: LanguageCode;
  isUpiFrozen: boolean;
}

export const VoicePaymentModal: React.FC<VoicePaymentModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  language = 'hi',
  isUpiFrozen,
}) => {
  const [step, setStep] = useState<'listening' | 'parsed' | 'pin' | 'success'>('listening');
  const [transcript, setTranscript] = useState('');
  const [isMicActive, setIsMicActive] = useState(false);
  const [recipient, setRecipient] = useState('Suresh Kumar');
  const [vpa, setVpa] = useState('suresh.kumar@okhdfcbank');
  const [amount, setAmount] = useState(500);
  const [category, setCategory] = useState<'groceries' | 'healthcare' | 'utilities' | 'family'>('groceries');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [txId, setTxId] = useState('');

  // Pre-configured voice samples for easy 1-click test
  const quickSamples = [
    { label: '🥦 Pay ₹500 to Suresh Kumar (Groceries)', text: 'Pay 500 rupees to Suresh Kumar for fresh vegetables', rec: 'Suresh Kumar', vpa: 'suresh.kumar@okhdfcbank', amt: 500, cat: 'groceries' },
    { label: '💊 Pay ₹720 to Apollo Pharmacy (Meds)', text: 'Pay 720 rupees to Apollo Pharmacy for blood pressure medicines', rec: 'Apollo Pharmacy', vpa: 'apollo.health@icici', amt: 720, cat: 'healthcare' },
    { label: '⚡ Pay ₹1,820 Electricity Bill (Verified Discom)', text: 'Pay 1820 rupees to BSES Rajdhani Electricity', rec: 'BSES Rajdhani Discom', vpa: 'bses.delhi@billpay', amt: 1820, cat: 'utilities' },
    { label: '👨‍👦 Send ₹2,000 to Son Rajesh', text: 'Send 2000 rupees to Rajesh Kumar', rec: 'Rajesh Kumar (Son)', vpa: 'rajesh.devi@icici', amt: 2000, cat: 'family' },
  ];

  useEffect(() => {
    if (isOpen) {
      setStep('listening');
      setTranscript('');
      setPin('');
      setPinError(false);
      startSpeechRecognition();
    } else {
      stopSpeechRecognition();
    }
  }, [isOpen]);

  const parseVoiceInput = (raw: string) => {
    setTranscript(raw);
    const text = raw.toLowerCase();

    // Check amount
    const numbers = text.match(/\d+/g);
    let extractedAmount = 500;
    if (numbers && numbers.length > 0) {
      extractedAmount = parseInt(numbers[0], 10);
    } else if (text.includes('हज़ार') || text.includes('thousand')) {
      extractedAmount = 1000;
    } else if (text.includes('पाँच सौ') || text.includes('five hundred')) {
      extractedAmount = 500;
    } else if (text.includes('सात सौ') || text.includes('seven hundred')) {
      extractedAmount = 700;
    }
    setAmount(extractedAmount);

    // Check recipient & category
    if (text.includes('apollo') || text.includes('दवा') || text.includes('medicine') || text.includes('chemist')) {
      setRecipient('Apollo Pharmacy');
      setVpa('apollo.health@icici');
      setCategory('healthcare');
    } else if (text.includes('बिजली') || text.includes('electricity') || text.includes('power') || text.includes('bill')) {
      setRecipient('BSES Rajdhani Discom');
      setVpa('bses.delhi@billpay');
      setCategory('utilities');
    } else if (text.includes('rajesh') || text.includes('राजेश') || text.includes('son') || text.includes('बेटा')) {
      setRecipient('Rajesh Kumar (Son)');
      setVpa('rajesh.devi@icici');
      setCategory('family');
    } else {
      setRecipient('Suresh Kumar');
      setVpa('suresh.kumar@okhdfcbank');
      setCategory('groceries');
    }

    setStep('parsed');

    // Announce verbally in voice
    setTimeout(() => {
      if (language === 'hi') {
        speakHindi(`भुगतान तैयार है: ${recipient} को ${extractedAmount} रुपये। पुष्टि करने के लिए बटन दबाएं।`);
      } else {
        speakEnglish(`Payment prepared: ${extractedAmount} rupees to ${recipient}. Please verify.`);
      }
    }, 400);
  };

  const startSpeechRecognition = () => {
    setIsMicActive(true);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const spoken = event.results[0][0].transcript;
          if (spoken) {
            parseVoiceInput(spoken);
          }
          setIsMicActive(false);
        };

        recognition.onerror = () => {
          setIsMicActive(false);
        };

        recognition.start();
      } catch {
        setIsMicActive(false);
      }
    }
  };

  const stopSpeechRecognition = () => {
    setIsMicActive(false);
  };

  const handleApplySample = (sample: typeof quickSamples[0]) => {
    setRecipient(sample.rec);
    setVpa(sample.vpa);
    setAmount(sample.amt);
    setCategory(sample.cat as any);
    setTranscript(sample.text);
    setStep('parsed');

    if (language === 'hi') {
      speakHindi(`सत्यापित मर्चेंट ${sample.rec} को ${sample.amt} रुपये का भुगतान तैयार है।`);
    } else {
      speakEnglish(`Verified: ${sample.amt} rupees to ${sample.rec} prepared.`);
    }
  };

  const handleConfirmToPin = () => {
    if (isUpiFrozen) {
      alert('UPI is currently frozen for emergency safety. Please unfreeze before completing payments.');
      return;
    }
    setStep('pin');
    setPin('');
  };

  const handlePinInput = (num: string) => {
    if (pin.length < 4) {
      const next = pin + num;
      setPin(next);
      if (next.length === 4) {
        // Complete transaction
        setTimeout(() => {
          handleExecutePayment();
        }, 300);
      }
    }
  };

  const handlePinBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleExecutePayment = () => {
    const generatedId = `UPI${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    setTxId(generatedId);

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      recipientName: recipient,
      recipientVpa: vpa,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount,
      type: 'debit',
      category,
      status: 'completed',
      threatLevel: 'safe',
      riskScore: 2,
      source: 'UPI Direct',
      verifiedBadge: true,
    };

    onAddTransaction(newTx);
    setStep('success');

    // Chime & voice confirmation
    if (language === 'hi') {
      speakHindi(`सफल भुगतान! ${recipient} को ${amount} रुपये का भुगतान सफलतापूर्वक पूरा हुआ। संदर्भ संख्या ${generatedId.slice(-4)}।`);
    } else {
      speakEnglish(`Payment successful! ${amount} rupees sent to ${recipient}.`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#131b2e] border-2 border-teal-500/50 rounded-3xl shadow-[0_0_50px_rgba(79,219,200,0.25)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#1E293B] bg-[#0b1326] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <span className="material-symbols-outlined text-[24px]">keyboard_voice</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>SafeUPI Voice Payment Guard</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  NPCI 2.0
                </span>
              </h3>
              <p className="text-xs text-slate-400">Speak naturally in Hindi or English to transfer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1E293B] text-slate-400 hover:text-white hover:bg-[#334155] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content based on Step */}
        <div className="p-6 flex flex-col items-center">
          {/* STEP 1: LISTENING */}
          {step === 'listening' && (
            <div className="flex flex-col items-center text-center w-full">
              {/* Animated Giant Mic */}
              <div className="relative my-4">
                <div
                  className={`w-28 h-28 rounded-full bg-gradient-to-tr from-teal-500 to-teal-300 flex items-center justify-center text-slate-950 shadow-[0_0_35px_rgba(79,219,200,0.6)] cursor-pointer active:scale-95 transition-all ${
                    isMicActive ? 'ring-8 ring-teal-400/30 animate-pulse' : ''
                  }`}
                  onClick={startSpeechRecognition}
                >
                  <span className="material-symbols-outlined text-[54px] font-extrabold">mic</span>
                </div>
                {isMicActive && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
                    Listening...
                  </span>
                )}
              </div>

              <h4 className="text-xl font-extrabold text-white mt-2">
                {language === 'hi' ? 'बोलिए (Speak now)' : 'Speak Your Payment Command'}
              </h4>
              <p className="text-xs text-slate-300 max-w-sm mt-1">
                {language === 'hi'
                  ? 'जैसे: "सुरेश कुमार को 500 रुपये भेजो" या "बिजली का बिल भरो"'
                  : 'Example: "Pay 500 rupees to Suresh Kumar" or "Pay electricity bill"'}
              </p>

              {transcript && (
                <div className="mt-3 p-3 rounded-xl bg-[#060e20] border border-teal-500/40 text-teal-300 text-xs font-semibold w-full">
                  "{transcript}"
                </div>
              )}

              {/* 1-Tap Quick Voice Simulation Cards */}
              <div className="w-full mt-6 pt-4 border-t border-[#1E293B]">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-left">
                  Or Tap a Sample Payment Command:
                </span>
                <div className="flex flex-col gap-2 w-full text-left">
                  {quickSamples.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplySample(s)}
                      className="p-3 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] hover:border-teal-400 text-xs text-slate-200 transition-all flex items-center justify-between group"
                    >
                      <span className="font-semibold text-white group-hover:text-teal-300">{s.label}</span>
                      <span className="material-symbols-outlined text-[18px] text-teal-400">chevron_right</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PARSED & VERIFIED INTENT */}
          {step === 'parsed' && (
            <div className="flex flex-col w-full gap-4">
              <div className="p-4 rounded-2xl bg-[#060e20] border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <span className="material-symbols-outlined text-[28px]">verified</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      NPCI Verified Beneficiary
                    </span>
                    <h4 className="text-lg font-bold text-white">{recipient}</h4>
                    <span className="text-xs text-slate-400 font-mono">{vpa}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Trust Score</span>
                  <span className="text-xl font-extrabold text-emerald-400">98/100</span>
                </div>
              </div>

              {/* Amount Display with Verbal Guard */}
              <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] text-center flex flex-col items-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Payment Amount
                </span>
                <p className="text-4xl font-extrabold text-white mt-1 tracking-tight">
                  ₹{amount.toLocaleString()}
                </p>
                <div className="mt-2 px-3 py-1 rounded-full bg-[#060e20] border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                  <span>{numberToIndianWords(amount)}</span>
                </div>
              </div>

              {/* Security Confirmation Notice */}
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">security</span>
                <span>Protected by Elder Rupee Shield. Bank UPI PIN pad required next.</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => setStep('listening')}
                  className="flex-1 h-12 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-slate-300 font-bold text-xs transition-all"
                >
                  Re-speak Command
                </button>
                <button
                  onClick={handleConfirmToPin}
                  className="flex-1 h-12 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-sm shadow-lg flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Authorize &amp; Enter PIN</span>
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: AUTHENTIC BANK UPI PIN PAD */}
          {step === 'pin' && (
            <div className="flex flex-col items-center w-full">
              <div className="text-center mb-4">
                <span className="text-xs text-slate-400">State Bank of India •••• 4018</span>
                <h4 className="text-lg font-bold text-white mt-0.5">Enter 4-Digit UPI PIN</h4>
                <p className="text-xs text-slate-300">
                  Authorizing transfer of <strong className="text-teal-400 font-bold">₹{amount.toLocaleString()}</strong> to {recipient}
                </p>
              </div>

              {/* PIN Dots */}
              <div className="flex items-center gap-4 my-3">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      pin.length > idx
                        ? 'bg-teal-400 border-teal-400 shadow-[0_0_10px_rgba(79,219,200,0.8)]'
                        : 'border-[#334155] bg-[#060e20]'
                    }`}
                  ></div>
                ))}
              </div>

              {/* PIN Keypad Grid */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs mt-3">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'].map((key, i) => {
                  if (key === '') return <div key={i}></div>;
                  if (key === 'backspace') {
                    return (
                      <button
                        key={i}
                        onClick={handlePinBackspace}
                        className="h-14 rounded-2xl bg-[#1E293B] hover:bg-[#334155] text-slate-300 flex items-center justify-center transition-colors active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[24px]">backspace</span>
                      </button>
                    );
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handlePinInput(key)}
                      className="h-14 rounded-2xl bg-[#1E293B] hover:bg-[#334155] text-white font-extrabold text-xl flex items-center justify-center transition-colors active:scale-95 border border-[#334155]"
                    >
                      {key}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep('parsed')}
                className="mt-4 text-xs text-slate-400 hover:text-white underline"
              >
                Back to Details
              </button>
            </div>
          )}

          {/* STEP 4: SUCCESS RECEIPT */}
          {step === 'success' && (
            <div className="flex flex-col items-center text-center w-full py-2">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(74,225,118,0.4)] my-2 animate-bounce">
                <span className="material-symbols-outlined text-[48px] font-extrabold">check</span>
              </div>

              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mt-2">
                Transaction Successful
              </span>
              <h3 className="text-3xl font-extrabold text-white mt-1">₹{amount.toLocaleString()}</h3>
              <p className="text-sm text-slate-200 mt-1">Sent to {recipient}</p>

              {/* Receipt Card */}
              <div className="w-full p-4 rounded-2xl bg-[#060e20] border border-[#1E293B] text-xs space-y-2 text-left my-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">UPI Ref ID:</span>
                  <span className="text-white font-mono font-bold">{txId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">To VPA:</span>
                  <span className="text-white font-mono">{vpa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Paid from:</span>
                  <span className="text-white">State Bank of India (••4018)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verbal Guard:</span>
                  <span className="text-teal-400 font-semibold">{numberToIndianWords(amount)}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full h-12 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm shadow-md transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
