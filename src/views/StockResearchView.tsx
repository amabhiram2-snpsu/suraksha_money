import React, { useState } from 'react';
import { ViewMode, StockCandidate } from '../types';
import { STOCK_CANDIDATES } from '../data/mockData';

interface StockResearchViewProps {
  onNavigate: (view: ViewMode) => void;
}

export const StockResearchView: React.FC<StockResearchViewProps> = ({ onNavigate }) => {
  const [selectedStock, setSelectedStock] = useState<StockCandidate | null>(STOCK_CANDIDATES[0]);
  const [sectorFilter, setSectorFilter] = useState('all');

  const sectors = ['all', 'IT', 'Banking', 'Conglomerate', 'FMCG', 'Infrastructure', 'Automotive', 'Telecom'];

  const filtered = STOCK_CANDIDATES.filter((s) => {
    if (sectorFilter === 'all') return true;
    return s.sector.toLowerCase().includes(sectorFilter.toLowerCase());
  });

  return (
    <div className="flex flex-col w-full gap-6 pb-16">
      {/* Header */}
      <div className="bg-[#131b2e] border border-[#1E293B] p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20">
              Long-Term Wealth Education
            </span>
            <span className="text-xs text-slate-400">Section 7 • NSE/BSE Research</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Indian Equity &amp; Index Research Candidates
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Strictly educational analysis for long-term household compounding. Not financial advice.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            NSE Verified Feed
          </span>
        </div>
      </div>

      {/* Regulatory Disclaimers Bar (Rule 7) */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3">
        <span className="material-symbols-outlined text-[22px] text-amber-400 flex-shrink-0 mt-0.5">
          warning
        </span>
        <div className="flex flex-col gap-1 leading-relaxed">
          <span className="font-bold">SEBI &amp; Prudence Compliance Notice</span>
          <p className="text-slate-300 text-[11px]">
            Equities carry market risk. Past performance does not guarantee future returns.
            Suraksha Money never recommends allocating funds needed for essential living expenses or
            unfunded emergency reserves into volatile equities. No direct brokerage execution exists
            without authorized independent demat login.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {sectors.map((sec) => (
          <button
            key={sec}
            onClick={() => setSectorFilter(sec)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors capitalize ${
              sectorFilter === sec
                ? 'bg-teal-400 text-slate-950 font-bold shadow-md'
                : 'bg-[#131b2e] border border-[#1E293B] text-slate-400 hover:text-white'
            }`}
          >
            {sec === 'all' ? 'All 10 Candidates' : sec}
          </button>
        ))}
      </div>

      {/* Main Split: Candidate List & Detailed Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Candidates List (5 cols) */}
        <div className="lg:col-span-5 bg-[#131b2e] border border-[#1E293B] rounded-2xl p-4 shadow-lg flex flex-col gap-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E293B] px-2 text-xs text-slate-400 font-semibold">
            <span>Candidate Asset</span>
            <span>Latest Verified Price</span>
          </div>
          {filtered.map((stock) => {
            const isSelected = selectedStock?.ticker === stock.ticker;
            return (
              <div
                key={stock.ticker}
                onClick={() => setSelectedStock(stock)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-teal-950/50 border-teal-400 shadow-[0_0_15px_rgba(79,219,200,0.2)]'
                    : 'bg-[#1E293B] border-[#334155] hover:border-slate-500'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm font-mono">{stock.ticker}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#060e20] text-slate-400 border border-slate-700">
                      {stock.exchange}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 truncate max-w-[200px] mt-0.5">
                    {stock.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white text-sm block">
                    ₹{stock.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-[11px] font-semibold ${
                      stock.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {stock.changePercent >= 0 ? `+${stock.changePercent}%` : `${stock.changePercent}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Dossier (7 cols) */}
        {selectedStock && (
          <div className="lg:col-span-7 bg-[#131b2e] border border-[#334155] rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold text-white font-mono">
                    {selectedStock.ticker}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold">
                    {selectedStock.sector}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-200 mt-0.5">{selectedStock.name}</h2>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-2xl font-extrabold text-white">
                  ₹{selectedStock.price.toFixed(2)}
                </span>
                <span className="block text-[11px] text-slate-400 mt-0.5">
                  {selectedStock.lastUpdated}
                </span>
              </div>
            </div>

            {/* Valuation Metric Pill Grid */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#1E293B] rounded-xl border border-[#334155]">
                <span className="text-slate-400 block text-[11px]">Price / Earnings (P/E)</span>
                <span className="font-bold text-white text-sm mt-0.5 block">
                  {selectedStock.peRatio}x
                </span>
              </div>
              <div className="p-3 bg-[#1E293B] rounded-xl border border-[#334155]">
                <span className="text-slate-400 block text-[11px]">Total Market Cap</span>
                <span className="font-bold text-white text-sm mt-0.5 block">
                  {selectedStock.marketCap}
                </span>
              </div>
              <div className="p-3 bg-[#1E293B] rounded-xl border border-[#334155]">
                <span className="text-slate-400 block text-[11px]">Prudent Time Horizon</span>
                <span className="font-bold text-teal-300 text-xs mt-0.5 block">
                  {selectedStock.suitableHorizon}
                </span>
              </div>
            </div>

            {/* Strengths and Risks (Visual separation as per Rule 7) */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Fundamental Moats &amp; Competitive Strengths</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{selectedStock.strengths}</p>
              </div>

              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-xs flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 font-bold text-red-300">
                  <span className="material-symbols-outlined text-[18px]">gshield</span>
                  <span>Material Headwinds &amp; Valuation Downside Risks</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{selectedStock.risks}</p>
              </div>
            </div>

            {/* Safe Education Card */}
            <div className="p-4 bg-[#060e20] rounded-xl border border-[#1E293B] text-xs text-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-400 text-[20px]">school</span>
                <span>Interested in systematic SIP investing?</span>
              </div>
              <button
                onClick={() => onNavigate('savings-goals')}
                className="text-teal-400 font-bold hover:underline"
              >
                Create Recurring SIP Goal →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
