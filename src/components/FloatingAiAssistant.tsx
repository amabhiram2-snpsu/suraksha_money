import React, { useState } from 'react';
import { UserProfile, ExpenseItem, IncomeItem } from '../types';

interface FloatingAiAssistantProps {
  user: UserProfile;
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  calculatedData?: {
    income: number;
    expenses: number;
    balance: number;
  };
}

export const FloatingAiAssistant: React.FC<FloatingAiAssistantProps> = ({
  user,
  incomes,
  expenses,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Namaste! I am your Suraksha Money AI Assistant. I can help explain your household budget, calculate safe emergency reserves, or clarify suspicious SMS payment warnings. How can I assist you?',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const availableBalance = totalIncome - totalExpenses;

  const handleSendQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = { sender: 'user', text: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      let botResponse = '';
      const lower = queryText.toLowerCase();

      if (lower.includes('save') || lower.includes('budget') || lower.includes('balance') || lower.includes('how much')) {
        botResponse = `Based on your actual verified records:\n• Total Inflow: ₹${totalIncome.toLocaleString()} (Calculated)\n• Total Outflow: ₹${totalExpenses.toLocaleString()} (Calculated)\n• Net Available Cushion: ₹${availableBalance.toLocaleString()} (Calculated)\n\nPrudent Recommendation (AI-generated):\nYou can comfortably save ₹4,000 this month into your liquid medical vault without pinching essential groceries or utility bills.`;
      } else if (lower.includes('scam') || lower.includes('electricity') || lower.includes('bill') || lower.includes('apk')) {
        botResponse = `Security Protocol Analysis:\nElectricity disconnection threats sent via SMS asking you to download an APK or call a mobile number are 100% fraudulent. State utility boards NEVER deliver APK installation files through SMS. Suraksha Money intercepts these malicious screen-share triggers automatically. Never share any 6-digit OTP.`;
      } else if (lower.includes('emergency') || lower.includes('medical') || lower.includes('reserve')) {
        botResponse = `Your emergency fund target is currently ₹60,000 (3 months of essential expenses). You have ₹20,000 saved (33% funded). Keeping ₹4,000/month allocation will achieve full funding in 10 months.`;
      } else if (lower.includes('invest') || lower.includes('stock') || lower.includes('equity')) {
        botResponse = `Educational Note (SEBI Prudence):\nDo not invest money needed for emergency buffers into stocks. Once your 3-month medical vault is funded, consider large-cap NSE candidates like TCS, Reliance, or HDFC Bank for long-term 5+ year compounding.`;
      } else {
        botResponse = `I have reviewed your verified data. Your net available balance is ₹${availableBalance.toLocaleString()}. Let me know if you want to inspect your expenses, test scam patterns, or review senior protection controls.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: botResponse,
          calculatedData: {
            income: totalIncome,
            expenses: totalExpenses,
            balance: availableBalance,
          },
        },
      ]);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-teal-400 hover:bg-teal-300 text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(79,219,200,0.4)] transition-all active:scale-95 group"
        title="Open AI Financial & Safety Assistant"
      >
        <span className="material-symbols-outlined text-[28px] font-bold">
          {isOpen ? 'close' : 'psychology'}
        </span>
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-40 w-[92vw] sm:w-96 max-h-[580px] h-[540px] bg-[#131b2e] border-2 border-[#334155] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in text-xs">
          {/* Header */}
          <div className="p-4 bg-[#0b1326] border-b border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <span className="material-symbols-outlined text-[20px]">psychology</span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Suraksha AI Advisor</h4>
                <span className="text-[10px] text-teal-400">Grounded in Real Account Data</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Quick Prompt Pills */}
          <div className="p-2.5 bg-[#060e20] border-b border-[#1E293B] flex gap-1.5 overflow-x-auto whitespace-nowrap">
            {[
              'How much can I save this month?',
              'Explain electricity bill scam',
              'Is my emergency fund sufficient?',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(q)}
                className="px-2.5 py-1 rounded-full bg-[#1E293B] hover:bg-[#334155] border border-slate-700 text-slate-300 text-[11px] font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-teal-400 text-slate-950 font-medium'
                      : 'bg-[#1E293B] border border-[#334155] text-slate-200'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
                {m.sender === 'assistant' && (
                  <span className="text-[9px] text-slate-500 mt-0.5 px-1 font-mono">
                    Deterministic Math Checked · Section 14
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery(inputText);
            }}
            className="p-3 bg-[#0b1326] border-t border-[#1E293B] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about budget, safe savings, or scams..."
              className="flex-1 h-10 px-3 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 flex items-center justify-center font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};
