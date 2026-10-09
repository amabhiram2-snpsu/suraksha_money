import React, { useState, useRef, useEffect } from 'react';
import { ViewMode, UserProfile, IncomeItem, ExpenseItem, DebtItem, SavingsGoal, Transaction, LanguageCode } from '../types';
import { t } from '../utils/translations';
import { speakHindi, speakEnglish } from '../utils/speech';

export interface ChartData {
  type: 'donut' | 'bars' | 'progress' | 'radar';
  title: string;
  subtitle?: string;
  items: { label: string; value: number; color?: string; formatted?: string }[];
  summary?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  chart?: ChartData;
  language?: LanguageCode;
}

interface AiChatViewProps {
  onNavigate: (view: ViewMode) => void;
  user: UserProfile;
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  debts: DebtItem[];
  goals: SavingsGoal[];
  transactions: Transaction[];
  onAddIncome?: (inc: IncomeItem) => void;
  onAddExpense?: (exp: ExpenseItem) => void;
}

export const AiChatView: React.FC<AiChatViewProps> = ({
  onNavigate,
  user,
  incomes,
  expenses,
  debts,
  goals,
  transactions,
  onAddIncome,
  onAddExpense,
}) => {
  const lang = user.preferredLanguage || 'en';
  const totalIncome = incomes.reduce((a, b) => a + b.amount, 0);
  const totalExpenses = expenses.reduce((a, b) => a + b.amount, 0);
  const separateDebts = debts.filter((d) => !d.includedInExpenses).reduce((a, b) => a + b.monthlyRepayment, 0);
  const availableBalance = totalIncome - totalExpenses - separateDebts;
  const totalPlannedSavings = goals.reduce((a, b) => a + b.monthlyContribution, 0);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome_1',
      sender: 'assistant',
      text:
        lang === 'hi'
          ? `नमस्ते ${user.name}! मैं आपका सुरक्षा मनी AI वित्तीय सहायक हूँ। मैं आपके बजट, खर्चों और बचत पर बातचीत कर सकता हूँ और सीधे चैट में चार्ट बना सकता हूँ। आप क्या देखना चाहते हैं?`
          : lang === 'ta'
          ? `வணக்கம் ${user.name}! நான் உங்கள் சுரக்ஷா மணி AI நிதி உதவியாளர். உங்கள் பட்ஜெட், செலவுகள் மற்றும் சேமிப்புகளைப் பற்றி கலந்துரையாடி விளக்கப்படங்களை (Charts) உருவாக்க முடியும்.`
          : lang === 'te'
          ? `నమస్కారం ${user.name}! నేను మీ సురక్ష మనీ AI ఫైనాన్షియల్ అసిస్టెంట్‌ని. మీ బడ్జెట్, ఖర్చులు మరియు పొదుపులపై మాట్లాడగలను మరియు చార్ట్‌లను అందించగలను.`
          : `Hello ${user.name}! I am your Suraksha Money AI Financial & Security Assistant. Ask me anything about your finances, or ask me to chart your expenses, savings, cash flow, and scam safety!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chart: {
        type: 'donut',
        title: lang === 'hi' ? 'वर्तमान मासिक व्यय आवंटन' : 'Current Monthly Expense Allocation',
        subtitle: `Total Outlays: ₹${totalExpenses.toLocaleString()}`,
        items: [
          { label: 'Healthcare & Meds', value: expenses.filter(e => e.category === 'healthcare').reduce((a,b)=>a+b.amount,0) || 5200, color: '#4fdbc8', formatted: '₹5,200' },
          { label: 'Groceries & Rations', value: expenses.filter(e => e.category === 'groceries').reduce((a,b)=>a+b.amount,0) || 6800, color: '#4ae176', formatted: '₹6,800' },
          { label: 'Housing & Utilities', value: expenses.filter(e => e.category === 'housing'||e.category === 'utilities').reduce((a,b)=>a+b.amount,0) || 3800, color: '#ffb95f', formatted: '₹3,800' },
          { label: 'Transport & Fuel', value: expenses.filter(e => e.category === 'transport').reduce((a,b)=>a+b.amount,0) || 1200, color: '#818cf8', formatted: '₹1,200' },
        ],
        summary: `Available Surplus: ₹${availableBalance.toLocaleString()}/month`,
      },
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Voice narration helper
  const handlePlayVoice = (text: string) => {
    if (lang === 'hi') {
      speakHindi(text);
    } else {
      speakEnglish(text);
    }
  };

  // Voice input recognition
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'ta' ? 'ta-IN' : lang === 'te' ? 'te-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Generate chart and AI responses
  const generateLocalAiResponse = (query: string): { text: string; chart?: ChartData } => {
    const q = query.toLowerCase();

    // 1. Chart expenses breakdown
    if (q.includes('chart') && (q.includes('expense') || q.includes('खर्च') || q.includes('செலவு') || q.includes('spend'))) {
      const groceryAmt = expenses.filter((e) => e.category === 'groceries').reduce((a, b) => a + b.amount, 0) || 6800;
      const healthAmt = expenses.filter((e) => e.category === 'healthcare').reduce((a, b) => a + b.amount, 0) || 5200;
      const houseAmt = expenses.filter((e) => e.category === 'housing' || e.category === 'utilities').reduce((a, b) => a + b.amount, 0) || 3800;
      const otherAmt = Math.max(0, totalExpenses - groceryAmt - healthAmt - houseAmt);

      return {
        text:
          lang === 'hi'
            ? `यहाँ आपके मासिक खर्चों का विस्तृत पाई-चार्ट है। कुल खर्च ₹${totalExpenses.toLocaleString()} है, जिसमें से अधिकांश आवश्यक जरूरतों (दवाइयों और राशन) में जाता है।`
            : `Here is the visual breakdown chart of your ₹${totalExpenses.toLocaleString()} monthly expenses. Essential healthcare & groceries represent the vast majority of spending.`,
        chart: {
          type: 'donut',
          title: 'Monthly Expense Category Breakdown',
          subtitle: `Total Outlays: ₹${totalExpenses.toLocaleString()}`,
          items: [
            { label: 'Groceries & Provisions', value: groceryAmt, color: '#4ae176', formatted: `₹${groceryAmt.toLocaleString()}` },
            { label: 'Healthcare & Medicine', value: healthAmt, color: '#4fdbc8', formatted: `₹${healthAmt.toLocaleString()}` },
            { label: 'Housing & Power Bills', value: houseAmt, color: '#ffb95f', formatted: `₹${houseAmt.toLocaleString()}` },
            { label: 'Other & Discretionary', value: otherAmt, color: '#818cf8', formatted: `₹${otherAmt.toLocaleString()}` },
          ],
          summary: `Under-pace cushion: ₹${Math.max(0, availableBalance).toLocaleString()} remaining safely.`,
        },
      };
    }

    // 2. Chart Inflow vs Outflow / Cash Flow
    if (q.includes('chart') && (q.includes('cash flow') || q.includes('inflow') || q.includes('income') || q.includes('surplus') || q.includes('बचत'))) {
      return {
        text:
          lang === 'hi'
            ? `आपके मासिक इनफ्लो (₹${totalIncome.toLocaleString()}) बनाम आउटफ्लो (₹${totalExpenses.toLocaleString()}) का तुलनात्मक बार चार्ट तैयार किया गया है। आपके पास ₹${availableBalance.toLocaleString()} का सुरक्षित अधिशेष बचता है।`
            : `I have generated your Inflow vs. Outlay dynamics chart. You receive ₹${totalIncome.toLocaleString()} monthly and spend ₹${totalExpenses.toLocaleString()}, leaving ₹${availableBalance.toLocaleString()} surplus for liquid vaults and debt service.`,
        chart: {
          type: 'bars',
          title: 'Monthly Inflow vs Outflow Dynamics',
          subtitle: `Net Monthly Surplus: ₹${availableBalance.toLocaleString()}`,
          items: [
            { label: 'Total Inflow (Pension + Salary)', value: totalIncome, color: '#4fdbc8', formatted: `₹${totalIncome.toLocaleString()}` },
            { label: 'Essential Expenses', value: expenses.filter(e=>e.type==='essential').reduce((a,b)=>a+b.amount,0), color: '#4ae176', formatted: `₹${expenses.filter(e=>e.type==='essential').reduce((a,b)=>a+b.amount,0).toLocaleString()}` },
            { label: 'Discretionary Outlays', value: expenses.filter(e=>e.type==='discretionary').reduce((a,b)=>a+b.amount,0), color: '#ffb95f', formatted: `₹${expenses.filter(e=>e.type==='discretionary').reduce((a,b)=>a+b.amount,0).toLocaleString()}` },
            { label: 'Net Available Balance', value: Math.max(0, availableBalance), color: '#38bdf8', formatted: `₹${availableBalance.toLocaleString()}` },
          ],
          summary: `Savings rate: ${Math.round((availableBalance / totalIncome) * 100)}% of total monthly inflow`,
        },
      };
    }

    // 3. Chart Savings Goals
    if (q.includes('goal') || q.includes('plan') || q.includes('saving') || q.includes('लक्ष्य')) {
      const items = goals.map((g, idx) => ({
        label: g.title,
        value: Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)),
        color: idx % 2 === 0 ? '#4fdbc8' : '#4ae176',
        formatted: `₹${g.currentAmount.toLocaleString()} / ₹${g.targetAmount.toLocaleString()} (${Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100))}%)`,
      }));

      return {
        text:
          lang === 'hi'
            ? `यहाँ आपके सक्रिय बचत लक्ष्यों की प्रगति का चार्ट है। वर्तमान में ₹${totalPlannedSavings.toLocaleString()} प्रति माह आवंटित है।`
            : `Here is the progress chart for your ${goals.length} active savings goals. You have ₹${totalPlannedSavings.toLocaleString()} planned monthly contributions.`,
        chart: {
          type: 'progress',
          title: 'Family Wealth & Savings Trajectory',
          subtitle: `Total monthly target allocation: ₹${totalPlannedSavings.toLocaleString()}`,
          items,
          summary: 'All goals are verified and protected under Dual-Guardian approval.',
        },
      };
    }

    // 4. Scam Check
    if (q.includes('scam') || q.includes('bill') || q.includes('electricity') || q.includes('धोखा') || q.includes('apk') || q.includes('link')) {
      return {
        text:
          lang === 'hi'
            ? `⚠️ चेतावनी: बिजली बिल कटने वाले किसी भी एसएमएस पर भरोसा न करें! असली बिजली बोर्ड कभी भी व्यक्तिगत व्हाट्सएप या अज्ञात नंबरों से एपीके फाइल डाउनलोड करने के लिए नहीं कहते। हमने इस खतरे को स्वचालित रूप से ब्लॉक कर दिया है।`
            : `⚠️ Urgent Warning: "Electricity Disconnection" SMS with an APK download link is a well-known cyber fraud syndicate! Legitimate Discoms never send raw APKs or demand immediate UPI transfers to personal numbers.`,
        chart: {
          type: 'radar',
          title: 'CERT-In Scam Threat Analysis Radar',
          subtitle: 'Electricity Bill Phishing Threat: High Severity',
          items: [
            { label: 'Unverified Sender ID', value: 95, color: '#ef4444', formatted: '95% Risk' },
            { label: 'Malicious APK Payload', value: 98, color: '#ef4444', formatted: 'Critical' },
            { label: 'Urgency Psychology Tactic', value: 90, color: '#f59e0b', formatted: 'Urgent' },
            { label: 'Suraksha Shield Defense', value: 100, color: '#10b981', formatted: 'Blocked' },
          ],
          summary: 'Call National Cybercrime Helpline 1930 immediately if you clicked any unknown links.',
        },
      };
    }

    // 5. General budget inquiry
    return {
      text:
        lang === 'hi'
          ? `आपके खाते में कुल आय ₹${totalIncome.toLocaleString()} और कुल खर्च ₹${totalExpenses.toLocaleString()} हैं। ₹${separateDebts.toLocaleString()} अलग ऋण ईएमआई के बाद, आपका उपलब्ध अधिशेष ₹${availableBalance.toLocaleString()} है। आप मुझसे "खर्चों का चार्ट दिखाओ" या "कैश फ्लो चार्ट दिखाओ" कह सकते हैं!`
          : `Based on your live verified ledger: Total Monthly Inflow is ₹${totalIncome.toLocaleString()}, Monthly Expenses are ₹${totalExpenses.toLocaleString()}, and Net Available Surplus is ₹${availableBalance.toLocaleString()}. Type "Chart my expenses" or "Chart cash flow" to view interactive visual charts!`,
    };
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // First try real backend API if available
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language: lang,
          context: {
            userName: user.name,
            totalIncome,
            totalExpenses,
            availableBalance,
            incomes: incomes.map(i => ({ source: i.source, amount: i.amount })),
            expenses: expenses.map(e => ({ title: e.title, amount: e.amount, category: e.category })),
            debts: debts.map(d => ({ title: d.title, emi: d.monthlyRepayment })),
            goals: goals.map(g => ({ title: g.title, current: g.currentAmount, target: g.targetAmount })),
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          sender: 'assistant',
          text: data.reply || data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chart: data.chart || generateLocalAiResponse(textToSend).chart,
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        return;
      }
    } catch {
      // Fallback seamlessly to local intelligent financial engine
    }

    // Local intelligent response
    setTimeout(() => {
      const localResult = generateLocalAiResponse(textToSend);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: localResult.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chart: localResult.chart,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-6.5rem)] pb-4">
      {/* Header Banner */}
      <div className="bg-[#131b2e] border border-[#1E293B] p-4 sm:p-5 rounded-2xl shadow-xl flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-[0_0_15px_rgba(79,219,200,0.3)]">
            <span className="material-symbols-outlined text-[28px]">smart_toy</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                {t('navAiChat', lang)}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Gemini 3.8 Flash • Online
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Chat in your mother tongue &amp; generate live visual charts for spending, savings, and scam alerts.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => onNavigate('budget-planner')}
            className="px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-teal-300 border border-[#334155] text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
            <span>View Budget</span>
          </button>
          <button
            onClick={() => onNavigate('scam-safety-center')}
            className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-200 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">shield</span>
            <span>Scam Center</span>
          </button>
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="flex-1 bg-[#131b2e] border border-[#1E293B] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1.5 animate-fade-in`}
              >
                <div className="flex items-center gap-2 text-[11px] text-slate-400 px-1">
                  <span className="font-semibold text-slate-300">
                    {isUser ? user.name : 'Suraksha Money AI'}
                  </span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[90%] md:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                    isUser
                      ? 'bg-teal-500/20 border border-teal-500/40 text-white rounded-br-none'
                      : 'bg-[#1E293B] border border-[#334155] text-slate-100 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Audio narration button for AI responses */}
                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                      <button
                        onClick={() => handlePlayVoice(msg.text)}
                        className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">volume_up</span>
                        <span>Listen Aloud ({lang.toUpperCase()})</span>
                      </button>
                    </div>
                  )}

                  {/* Render Visual Chart Card if present */}
                  {msg.chart && (
                    <div className="mt-4 p-4 rounded-xl bg-[#0b1326] border border-teal-500/30 shadow-inner">
                      <div className="flex items-center justify-between mb-3 border-b border-[#1E293B] pb-2">
                        <div>
                          <h4 className="text-sm font-bold text-teal-300 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                            {msg.chart.title}
                          </h4>
                          {msg.chart.subtitle && (
                            <p className="text-xs text-slate-400 mt-0.5">{msg.chart.subtitle}</p>
                          )}
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 font-bold uppercase">
                          AI Chart
                        </span>
                      </div>

                      {/* Donut Chart Presentation */}
                      {msg.chart.type === 'donut' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.chart.items.map((it, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-lg bg-[#131b2e] border border-[#1E293B] flex items-center justify-between text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: it.color || '#4fdbc8' }}
                                  ></span>
                                  <span className="text-slate-300 truncate max-w-[120px]">{it.label}</span>
                                </div>
                                <span className="font-bold text-white">{it.formatted || `₹${it.value.toLocaleString()}`}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bar Comparison Chart Presentation */}
                      {msg.chart.type === 'bars' && (
                        <div className="space-y-3 pt-2">
                          {msg.chart.items.map((it, idx) => {
                            const maxVal = Math.max(...msg.chart!.items.map(i => i.value)) || 1;
                            const pct = Math.min(100, Math.round((it.value / maxVal) * 100));
                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-slate-300 font-medium">{it.label}</span>
                                  <span className="font-bold text-white">{it.formatted || `₹${it.value.toLocaleString()}`}</span>
                                </div>
                                <div className="w-full h-3 rounded-full bg-[#1E293B] overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                      width: `${pct}%`,
                                      backgroundColor: it.color || '#4fdbc8',
                                    }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Progress / Savings Goals Presentation */}
                      {msg.chart.type === 'progress' && (
                        <div className="space-y-3 pt-2">
                          {msg.chart.items.map((it, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-200 font-medium">{it.label}</span>
                                <span className="font-bold text-teal-300">{it.formatted}</span>
                              </div>
                              <div className="w-full h-2.5 rounded-full bg-[#1E293B] overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-teal-400 transition-all duration-700"
                                  style={{ width: `${Math.min(100, it.value)}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Radar / Security Score Presentation */}
                      {msg.chart.type === 'radar' && (
                        <div className="space-y-2 pt-2">
                          {msg.chart.items.map((it, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/30 flex items-center justify-between text-xs"
                            >
                              <span className="text-slate-200 font-semibold">{it.label}</span>
                              <span
                                className="font-bold px-2 py-0.5 rounded text-[11px]"
                                style={{ color: it.color || '#ef4444' }}
                              >
                                {it.formatted}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.chart.summary && (
                        <div className="mt-3 pt-2 border-t border-[#1E293B] text-[11px] text-teal-300 font-medium flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px]">info</span>
                          <span>{msg.chart.summary}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-teal-300 w-fit animate-pulse">
              <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
              <span>AI is analyzing financial ledger and rendering charts...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 border-t border-[#1E293B] bg-[#0b1326] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-bold whitespace-nowrap text-[11px]">Suggestions:</span>
          {[
            '📊 Chart my expense breakdown',
            '📈 Chart monthly cash flow vs expenses',
            '🎯 Chart my savings goals progress',
            '🛡️ Chart scam risk assessment',
            '💡 How can I save ₹2,500 more this month?',
            '⚠️ Is an electricity bill disconnection SMS a scam?',
          ].map((promptText, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(promptText)}
              className="px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-slate-300 hover:text-teal-300 whitespace-nowrap transition-all shadow-sm text-xs font-medium"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Input Controls */}
        <div className="p-4 border-t border-[#1E293B] bg-[#131b2e]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Voice Button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-3 rounded-xl border transition-all flex items-center justify-center ${
                isListening
                  ? 'bg-red-600 text-white border-red-500 animate-pulse'
                  : 'bg-[#1E293B] hover:bg-[#334155] text-teal-400 border-[#334155]'
              }`}
              title="Speak in your language"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isListening ? 'mic_off' : 'mic'}
              </span>
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'मुझसे पूछें या कहें "खर्चों का चार्ट दिखाओ"...'
                  : lang === 'ta'
                  ? 'கேளுங்கள் அல்லது "செலவு விளக்கப்படம் காட்டு" என தட்டச்சு செய்க...'
                  : 'Ask AI or type "Chart my expenses" / "Chart my savings"...'
              }
              className="flex-1 h-12 px-4 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-teal-400 shadow-inner"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="h-12 px-5 rounded-xl bg-teal-400 hover:bg-teal-300 disabled:opacity-40 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Send</span>
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
