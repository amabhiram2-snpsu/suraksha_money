import React, { useState } from 'react';
import { ViewMode, Transaction, LanguageCode } from '../types';
import { speakHindi, speakEnglish } from '../utils/speech';
import { VoicePaymentModal } from '../components/VoicePaymentModal';

interface SeniorModeViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenEmergencyModal: () => void;
  onAddTransaction?: (tx: Transaction) => void;
  isUpiFrozen?: boolean;
  language?: LanguageCode;
}

export const SeniorModeView: React.FC<SeniorModeViewProps> = ({
  onNavigate,
  onOpenEmergencyModal,
  onAddTransaction,
  isUpiFrozen = false,
  language = 'hi',
}) => {
  const [isVoicePaymentOpen, setIsVoicePaymentOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [listeningMic, setListeningMic] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [selectedActionModal, setSelectedActionModal] = useState<string | null>(null);

  const handleHearInHindi = () => {
    setIsSpeaking(true);
    const text =
      'नमस्ते कमला जी। आपके स्टेट बैंक खाते में अठारह हज़ार पाँच सौ रुपये सुरक्षित हैं। आज कोई भी संदिग्ध संदेश या कॉल नहीं आई है। यदि कोई भी आपसे ओटीपी मांगे, तो कभी न दें और तुरंत राजेश को कॉल करें।';
    speakHindi(text, () => setIsSpeaking(false));
  };

  const handleMicTap = () => {
    setListeningMic(true);
    setVoiceTranscript('Listening... बोलिए (Speak now)');

    if (
      typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    ) {
      try {
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'hi-IN';
        recognition.start();

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setVoiceTranscript(`आपने पूछा: "${transcript}"`);
          setTimeout(() => {
            if (transcript.includes('पैसा') || transcript.includes('balance') || transcript.includes('money')) {
              speakHindi('कमला जी, आपके स्टेट बैंक खाते में अठारह हज़ार पाँच सौ रुपये हैं।');
            } else if (transcript.includes('बिल') || transcript.includes('bill')) {
              speakHindi('आपका इस महीने का बिजली बिल एक हज़ार आठ सौ बीस रुपये अदा हो चुका है।');
            } else {
              speakHindi('जी कमला जी, आपका संदेश दर्ज कर लिया गया है और सुरक्षित है।');
            }
            setListeningMic(false);
          }, 1000);
        };

        recognition.onerror = () => {
          setVoiceTranscript('Voice simulated: "How much money do I have?"');
          setTimeout(() => {
            speakHindi('कमला जी, आपके खाते में अठारह हज़ार पाँच सौ रुपये सुरक्षित हैं।');
            setListeningMic(false);
          }, 1500);
        };
      } catch (err) {
        setVoiceTranscript('Voice simulated: "How much money do I have?"');
        speakHindi('कमला जी, आपके खाते में अठारह हज़ार पाँच सौ रुपये सुरक्षित हैं।');
        setListeningMic(false);
      }
    } else {
      setVoiceTranscript('Voice query: "मेरा बैलेंस कितना है?"');
      setTimeout(() => {
        speakHindi('कमला जी, आपके खाते में अठारह हज़ार पाँच सौ रुपये सुरक्षित हैं।');
        setListeningMic(false);
      }, 1200);
    }
  };

  const handleSpeakItem = (text: string) => {
    speakHindi(text);
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Top Banner: Greeting Kamala Ji */}
      <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#060e20] via-[#131b2e] to-[#0B132B] border-2 border-[#334155] text-white shadow-2xl p-6 lg:p-8 mb-8">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative flex-shrink-0">
              <img
                alt="Kamala Devi"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-teal-400/60 shadow-xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhlygeecBFoCUuc4I8Jor4rkv-eLblUBHGC5hcQE-tX4uOWmHRuUdbt6zfiruyNmCDwhjh-Lg0WOk0KToaP6YzeJxPyzF882zC6JvHYnkaZhZqC4O2-Ql69Q1Sz1K234FxdfhBN4s2OA0YG-l-djZdsHSlC6ffz0XaR7HZKcPMrSxx9KWJ3E6EeXBhvForSEInfEen5DOW7NhDqpx_c3vPkQEwtoLjKjt4LCeDtjEl6lkpto82dPbK"
              />
              <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-teal-400 flex items-center justify-center text-slate-950 shadow-md">
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs text-teal-300 bg-teal-500/20 border border-teal-500/40 px-3 py-0.5 rounded-full font-bold tracking-wide uppercase">
                  Senior Protection Active
                </span>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400"></span>
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1.5">
                नमस्ते Kamala Ji!
              </h1>
              <p className="text-base sm:text-lg text-slate-300 mt-1">
                How can we assist you with your money today?
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleHearInHindi}
              className={`h-16 px-6 rounded-2xl bg-[#1E293B] border-2 transition-all flex items-center gap-3.5 shadow-xl active:scale-95 group ${
                isSpeaking
                  ? 'border-teal-400 ring-4 ring-teal-400/30 bg-teal-950/40'
                  : 'border-[#334155] hover:border-teal-400'
              }`}
            >
              <span className="w-11 h-11 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">
                  {isSpeaking ? 'graphic_eq' : 'volume_up'}
                </span>
              </span>
              <div className="flex flex-col text-left">
                <span className="text-base font-bold text-white leading-tight">Hear in Hindi</span>
                <span className="text-xs text-teal-300 font-medium">हिंदी में सुनें</span>
              </div>
            </button>

            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#1E293B]/80 border border-[#334155] backdrop-blur-sm">
              <span
                className="material-symbols-outlined text-teal-400 text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                family_restroom
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Son Linked
                </span>
                <span className="text-sm font-bold text-white">Rajesh Kumar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Large Microphone Voice Guidance Banner */}
      <div className="w-full rounded-3xl bg-[#131b2e] border-2 border-[#334155] shadow-xl p-6 lg:p-8 mb-10 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <button
              onClick={handleMicTap}
              className={`relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-teal-500 to-teal-300 text-slate-950 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(79,219,200,0.5)] hover:shadow-[0_0_40px_rgba(79,219,200,0.7)] transition-all active:scale-95 group ${
                listeningMic ? 'scale-105 ring-8 ring-teal-400/40' : ''
              }`}
            >
              <span className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-30"></span>
              <span className="material-symbols-outlined text-[48px] text-slate-950 font-extrabold group-hover:scale-110 transition-transform">
                mic
              </span>
              <span className="text-[11px] font-extrabold text-slate-950 uppercase mt-0.5 tracking-wider">
                Tap &amp; Speak
              </span>
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(79,219,200,0.8)]"></span>
                <span className="text-xs text-teal-300 font-bold tracking-wide uppercase">
                  AI Voice Guidance Always Ready
                </span>
              </div>
              <p className="text-lg sm:text-xl text-white font-extrabold mt-1">
                Press the green mic and simply ask in your voice:
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <button
                  onClick={() => speakEnglish('You currently have eighteen thousand five hundred rupees in your State Bank account.')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1E293B] border border-[#334155] text-sm text-slate-200 font-semibold hover:border-teal-400"
                >
                  “How much money do I have?”
                </button>
                <span className="text-slate-400 font-bold text-xs">or</span>
                <button
                  onClick={() => speakHindi('आपका बिजली बिल एक हज़ार आठ सौ बीस रुपये है जो पूरा भर दिया गया है।')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1E293B] border border-[#334155] text-sm text-slate-200 font-semibold hover:border-teal-400"
                >
                  “मेरा बिजली बिल कितना है?”
                </button>
                <span className="text-slate-400 font-bold text-xs">or</span>
                <button
                  onClick={() => setIsVoicePaymentOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-500/20 border border-teal-500/50 text-sm text-teal-300 font-bold hover:bg-teal-500/30 flex items-center gap-1.5 shadow-[0_0_12px_rgba(79,219,200,0.3)] animate-pulse"
                >
                  <span className="material-symbols-outlined text-[18px]">mic</span>
                  <span>🎙️ “सुरेश कुमार को 500 रुपये भेजो” (Voice Payment)</span>
                </button>
              </div>
              {voiceTranscript && (
                <p className="text-sm font-semibold text-teal-300 mt-2 bg-[#060e20] px-3 py-1.5 rounded-lg border border-teal-500/40 w-fit">
                  {voiceTranscript}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 justify-center lg:min-w-[240px]">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1E293B] border border-[#334155]">
              <span className="material-symbols-outlined text-teal-400 text-[24px]">translate</span>
              <span className="text-xs text-slate-200 font-semibold">
                Supports Hindi, Tamil, Bengali &amp; English
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1E293B] border border-[#334155]">
              <span className="material-symbols-outlined text-teal-400 text-[24px]">speed</span>
              <span className="text-xs text-slate-200 font-semibold">
                Reads numbers slowly and clearly
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Daily Actions (Large 20px Cards) */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Main Daily Actions
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Simple, large cards designed for effortless touch
            </p>
          </div>
          <span className="text-xs bg-[#334155] border border-slate-500 text-white px-3 py-1 rounded-full font-bold">
            Large Text Mode 20px
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Check My Money */}
          <div
            onClick={() => handleSpeakItem('कमला जी, आपके खाते में कुल अठारह हज़ार पाँच सौ रुपये हैं।')}
            className="group cursor-pointer rounded-2xl bg-[#131b2e] border-2 border-[#334155] p-6 shadow-xl hover:border-teal-400 hover:shadow-[0_0_25px_rgba(79,219,200,0.2)] transition-all flex flex-col justify-between min-h-[240px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                  <span
                    className="material-symbols-outlined text-[36px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    account_balance_wallet
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  Safe &amp; Verified
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">1. Check My Money</h3>
              <p className="text-base text-teal-300 font-bold mt-1">मेरा पैसा देखें</p>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Current safe balance:{' '}
                <strong className="text-white text-lg font-extrabold">₹18,500</strong> in State
                Bank of India account.
              </p>
            </div>
            <button className="mt-4 w-full h-14 rounded-xl bg-[#1E293B] text-white border border-[#334155] text-base font-bold flex items-center justify-center gap-2 group-hover:bg-teal-400 group-hover:text-slate-950 group-hover:border-teal-400 transition-all">
              <span>View Account Details</span>
              <span className="material-symbols-outlined text-[24px]">chevron_right</span>
            </button>
          </div>

          {/* Card 2: My Recent Expenses */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="group cursor-pointer rounded-2xl bg-[#131b2e] border-2 border-[#334155] p-6 shadow-xl hover:border-teal-400 hover:shadow-[0_0_25px_rgba(79,219,200,0.2)] transition-all flex flex-col justify-between min-h-[240px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                  <span
                    className="material-symbols-outlined text-[36px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    receipt_long
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#1E293B] border border-[#334155] text-slate-400 text-xs font-bold">
                  Updated Today
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">2. My Recent Expenses</h3>
              <p className="text-base text-teal-300 font-bold mt-1">मेरे खर्च</p>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                See simple plain-text list of groceries, medicines, and household utility bills.
              </p>
            </div>
            <button className="mt-4 w-full h-14 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-base font-bold flex items-center justify-center gap-2 hover:bg-[#334155] transition-colors">
              <span>Read Bill History</span>
              <span className="material-symbols-outlined text-[24px]">chevron_right</span>
            </button>
          </div>

          {/* Card 3: Help Me Pay Safely */}
          <div
            onClick={() => onNavigate('payment-assistant')}
            className="group cursor-pointer rounded-2xl bg-[#131b2e] border-2 border-[#334155] p-6 shadow-xl hover:border-teal-400 hover:shadow-[0_0_25px_rgba(79,219,200,0.2)] transition-all flex flex-col justify-between min-h-[240px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <span
                    className="material-symbols-outlined text-[36px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified_user
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  AI Dual-Check
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">3. Help Me Pay Safely</h3>
              <p className="text-base text-teal-300 font-bold mt-1">सुरक्षित भुगतान</p>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Verify electricity, milkman, or chemist UPI ID before any payment leaves.
              </p>
            </div>
            <button
              onClick={() => setIsVoicePaymentOpen(true)}
              className="mt-4 w-full h-14 rounded-xl bg-teal-400 text-slate-950 text-base font-extrabold flex items-center justify-center gap-2 hover:bg-teal-300 shadow-[0_0_16px_rgba(79,219,200,0.3)] transition-all cursor-pointer"
            >
              <span>🎙️ Pay with Voice / बोलकर भुगतान करें</span>
              <span className="material-symbols-outlined text-[24px]">mic</span>
            </button>
          </div>

          {/* Card 4: Talk to SafePaisa */}
          <div
            onClick={() => {
              speakHindi('नमस्ते कमला जी। मैं आपका सुरक्षा सहायक हूँ। आप पेंशन या बैंक के बारे में कुछ भी पूछ सकती हैं।');
            }}
            className="group cursor-pointer rounded-2xl bg-[#131b2e] border-2 border-[#334155] p-6 shadow-xl hover:border-teal-400 hover:shadow-[0_0_25px_rgba(79,219,200,0.2)] transition-all flex flex-col justify-between min-h-[240px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                  <span
                    className="material-symbols-outlined text-[36px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    support_agent
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
                  Friendly AI
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">4. Talk to SafePaisa</h3>
              <p className="text-base text-teal-300 font-bold mt-1">सहायक से बात करें</p>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Ask anything about pensions, FD interest, or bank rules in your spoken language.
              </p>
            </div>
            <button className="mt-4 w-full h-14 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-base font-bold flex items-center justify-center gap-2 hover:border-teal-400 hover:text-teal-300 transition-all">
              <span>Start Friendly Chat</span>
              <span className="material-symbols-outlined text-[24px]">chat</span>
            </button>
          </div>

          {/* Card 5: Scam & Fraud Safety */}
          <div
            onClick={() => onNavigate('scam-safety-center')}
            className="group cursor-pointer rounded-2xl bg-[#131b2e] border-2 border-[#334155] p-6 shadow-xl hover:border-teal-400 hover:shadow-[0_0_25px_rgba(79,219,200,0.2)] transition-all flex flex-col justify-between min-h-[240px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
                  <span
                    className="material-symbols-outlined text-[36px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    shield
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  Zero Fraud Alert
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">5. Scam &amp; Fraud Safety</h3>
              <p className="text-base text-teal-300 font-bold mt-1">धोखाधड़ी से सुरक्षा</p>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                All incoming phone calls and text messages are clean. No suspicious links detected.
              </p>
            </div>
            <button className="mt-4 w-full h-14 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-base font-bold flex items-center justify-center gap-2 hover:bg-[#334155] transition-colors">
              <span>Check Security Status</span>
              <span className="material-symbols-outlined text-[24px]">security</span>
            </button>
          </div>

          {/* Card 6: Contact My Family */}
          <div
            onClick={() => alert('Calling son Rajesh Kumar directly on mobile (+91 98401 22319)...')}
            className="group cursor-pointer rounded-2xl bg-[#131b2e] border-2 border-[#334155] p-6 shadow-xl hover:border-teal-400 hover:shadow-[0_0_25px_rgba(79,219,200,0.2)] transition-all flex flex-col justify-between min-h-[240px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                  <span
                    className="material-symbols-outlined text-[36px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    ring_volume
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
                  Direct Line
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">6. Contact My Family</h3>
              <p className="text-base text-teal-300 font-bold mt-1">परिवार से संपर्क करें</p>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                One-touch phone call or notification alert to son Rajesh Kumar (+91 98401 22319).
              </p>
            </div>
            <button className="mt-4 w-full h-14 rounded-xl bg-teal-400 text-slate-950 text-base font-extrabold flex items-center justify-center gap-2 hover:bg-teal-300 shadow-[0_0_16px_rgba(79,219,200,0.3)] transition-all">
              <span>Call Rajesh Now</span>
              <span className="material-symbols-outlined text-[24px]">call</span>
            </button>
          </div>
        </div>
      </div>

      {/* Golden Safety Rule Banner */}
      <div className="w-full rounded-3xl bg-[#131b2e] border-2 border-red-500/70 p-6 sm:p-8 shadow-2xl mb-10 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-red-600/10 blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
              <span className="material-symbols-outlined text-[40px] animate-pulse">
                lock_person
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider">
                  Golden Safety Rule
                </span>
                <span className="text-xs sm:text-sm text-red-300 font-bold">
                  Unsure about any SMS, Call or OTP?
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                NEVER Share Bank OTP or PIN with Anyone!
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Bank managers, police, or Suraksha Money will <strong className="text-white">never</strong>{' '}
                ask for your PIN or OTP. If someone is rushing you, stop and press this button.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
            <button
              onClick={() => alert('Dialing son Rajesh Kumar priority emergency hotline...')}
              className="h-16 px-8 rounded-xl bg-red-600 text-white font-extrabold text-base shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:bg-red-500 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <span className="material-symbols-outlined text-[28px]">phone_in_talk</span>
              <span>Speak with Rajesh Immediately</span>
            </button>
            <a
              href="tel:1930"
              className="h-14 px-6 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-sm font-bold shadow hover:bg-[#334155] transition-all flex items-center justify-center gap-2 text-center"
            >
              <span className="material-symbols-outlined text-teal-400 text-[24px]">call</span>
              <span>Dial Helpline 1930 (Govt. of India)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Recent Simple Activity with Read Aloud */}
      <div className="w-full mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Recent Simple Activity
            </h2>
            <p className="text-sm text-slate-300">
              Clean records written clearly so you can double-check with ease
            </p>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-sm font-semibold hover:border-teal-400 transition-colors flex items-center gap-1.5"
          >
            <span>View Full Passbook</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        <div className="space-y-4">
          {/* Row 1: Pension Received */}
          <div className="rounded-2xl bg-[#131b2e] border border-[#334155] p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <span
                  className="material-symbols-outlined text-[30px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  savings
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">Monthly Pension Received</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                    Credited
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Central Govt Pension • Direct SBI Deposit • Today, 10:15 AM
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-6">
              <div className="text-right">
                <span className="text-xl font-extrabold text-emerald-400">+₹18,500</span>
                <p className="text-xs text-slate-400">New Balance: ₹18,500</p>
              </div>
              <button
                onClick={() =>
                  handleSpeakItem('आज सुबह दस बज कर पंद्रह मिनट पर आपकी अठारह हज़ार पाँच सौ रुपये की मासिक पेंशन स्टेट बैंक में जमा हो गई है।')
                }
                className="w-12 h-12 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-white hover:border-teal-400 hover:text-teal-300 transition-colors"
                title="Hear Details"
              >
                <span className="material-symbols-outlined text-[24px]">volume_up</span>
              </button>
            </div>
          </div>

          {/* Row 2: Apollo Pharmacy */}
          <div className="rounded-2xl bg-[#131b2e] border border-[#334155] p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-teal-400 flex-shrink-0">
                <span
                  className="material-symbols-outlined text-[30px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  medication
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">Apollo Pharmacy Chemist</span>
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
                    Family Verified by Rajesh
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  BP &amp; Diabetes Monthly Medicines • Yesterday, 4:30 PM
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-6">
              <div className="text-right">
                <span className="text-xl font-extrabold text-white">-₹850</span>
                <p className="text-xs text-slate-400">Paid via UPI SafeCheck</p>
              </div>
              <button
                onClick={() =>
                  handleSpeakItem('कल शाम को अपोलो फार्मेसी को आठ सौ पचास रुपये की दवाई का भुगतान सफलतापूर्वक किया गया था।')
                }
                className="w-12 h-12 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-white hover:border-teal-400 hover:text-teal-300 transition-colors"
                title="Hear Details"
              >
                <span className="material-symbols-outlined text-[24px]">volume_up</span>
              </button>
            </div>
          </div>

          {/* Row 3: Monthly Milk Delivery */}
          <div className="rounded-2xl bg-[#131b2e] border border-[#334155] p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-teal-400 flex-shrink-0">
                <span
                  className="material-symbols-outlined text-[30px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  water_drop
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">Monthly Milk Delivery</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#1E293B] border border-[#334155] text-slate-400 text-xs font-bold">
                    Regular Vendor
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Shri Krishna Dairy (30 Days Pack) • 01 Oct, 08:20 AM
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-6">
              <div className="text-right">
                <span className="text-xl font-extrabold text-white">-₹1,200</span>
                <p className="text-xs text-slate-400">Auto-reconciled bill</p>
              </div>
              <button
                onClick={() =>
                  handleSpeakItem('श्री कृष्णा डेयरी को दूध का एक महीने का बिल एक हज़ार दो सौ रुपये का भुगतान किया गया।')
                }
                className="w-12 h-12 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-white hover:border-teal-400 hover:text-teal-300 transition-colors"
                title="Hear Details"
              >
                <span className="material-symbols-outlined text-[24px]">volume_up</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Call My Phone Strip */}
      <div className="p-6 rounded-3xl bg-[#131b2e] border border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-teal-400 text-[36px]">hearing</span>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white">
              Prefer spoken instructions on phone call?
            </span>
            <span className="text-sm text-slate-300">
              We can call your landline or mobile right now to read this out in Hindi.
            </span>
          </div>
        </div>
        <button
          onClick={() =>
            alert('Initiating outbound automated Hindi voice call to registered number +91 98*** 4210...')
          }
          className="h-14 px-6 rounded-2xl bg-[#1E293B] border border-[#334155] text-white text-base font-bold shadow hover:border-teal-400 hover:text-teal-300 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[24px] text-teal-400">
            phone_forwarded
          </span>
          <span>Call My Phone</span>
        </button>
      </div>

      {/* Voice Payment Guard Modal */}
      <VoicePaymentModal
        isOpen={isVoicePaymentOpen}
        onClose={() => setIsVoicePaymentOpen(false)}
        onAddTransaction={onAddTransaction || (() => {})}
        language={language}
        isUpiFrozen={isUpiFrozen}
      />
    </div>
  );
};
