import React, { useState } from 'react';
import { INDIAN_LANGUAGES } from '../data/mockData';
import { LanguageCode } from '../types';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = INDIAN_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.script.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#131b2e] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#1E293B] flex items-center justify-between bg-[#0b1326]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <span className="material-symbols-outlined text-[24px]">translate</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Select Mother Tongue / भाषा चुनें
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold">
                  23 Official Languages
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Suraksha Money supports all 22 Eighth Schedule languages + English with voice narration.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#1E293B] text-slate-400 hover:text-white hover:bg-[#334155] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#1E293B] bg-[#0F172A]">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search language or script (e.g. Hindi, Tamil, বাংলা)..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>

        {/* Language Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-teal-950/60 border-teal-400 shadow-[0_0_15px_rgba(79,219,200,0.2)]'
                    : 'bg-[#1E293B]/70 border-[#334155]/60 hover:bg-[#1E293B] hover:border-teal-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base font-bold text-white tracking-wide">
                    {lang.nativeName}
                  </span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-teal-400 text-[18px]">
                      check_circle
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{lang.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0F172A] text-slate-400">
                    {lang.script}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E293B] bg-[#0b1326] flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-teal-400 font-medium">
            <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
            Voice prompts will automatically synchronize with your selection
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-white font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
