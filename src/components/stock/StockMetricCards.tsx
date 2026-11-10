import React from 'react';
import { StockProfile } from '../../types';
import { formatStockPrice, formatLargeNumber } from '../../services/stockData';
import { Target, Award, PieChart, Percent, ArrowUpRight, ShieldCheck, Scale } from 'lucide-react';

interface StockMetricCardsProps {
  stock: StockProfile;
}

export const StockMetricCards: React.FC<StockMetricCardsProps> = ({ stock }) => {
  // Calculate position in 52-week range
  const range52w = stock.week52High - stock.week52Low;
  const position52w = range52w > 0 
    ? Math.min(100, Math.max(0, ((stock.currentPrice - stock.week52Low) / range52w) * 100))
    : 50;

  // Potential upside to consensus target
  const upsidePercent = ((stock.consensusTarget - stock.currentPrice) / stock.currentPrice) * 100;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* P/E Ratio */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
          <span className="text-xs font-medium">P/E Ratio</span>
          <Scale className="w-3.5 h-3.5 text-indigo-500" />
        </div>
        <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">
          {stock.peRatio > 0 ? `${stock.peRatio.toFixed(1)}x` : 'N/A'}
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {stock.peRatio > 0 && stock.peRatio < 15 ? 'Valuasi Murah' : stock.peRatio < 30 ? 'Valuasi Wajar' : 'Valuasi Premium'}
        </p>
      </div>

      {/* PBV Ratio */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
          <span className="text-xs font-medium">PBV Ratio</span>
          <PieChart className="w-3.5 h-3.5 text-cyan-500" />
        </div>
        <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">
          {stock.pbvRatio.toFixed(1)}x
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Price to Book Value
        </p>
      </div>

      {/* Dividend Yield */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
          <span className="text-xs font-medium">Dividen Yield</span>
          <Percent className="w-3.5 h-3.5 text-emerald-500" />
        </div>
        <div className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
          {stock.dividendYield > 0 ? `${stock.dividendYield.toFixed(1)}%` : '0%'}
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {stock.dividendYield >= 5 ? 'Dividen Tinggi 🔥' : stock.dividendYield > 0 ? 'Dividen Rutin' : 'Reinvestasi Laba'}
        </p>
      </div>

      {/* ROE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
          <span className="text-xs font-medium">ROE (Return On Eq.)</span>
          <Award className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">
          {stock.roe.toFixed(1)}%
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {stock.roe >= 18 ? 'Profitabilitas Sangat Kuat' : 'Profitabilitas Moderat'}
        </p>
      </div>

      {/* 52-Week Range */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
          <span className="text-xs font-medium">Rentang 52 Minggu</span>
          <span className="text-[10px] text-slate-400 font-mono">{position52w.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden my-1 relative">
          <div
            className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 rounded-full"
            style={{ width: `${position52w}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
          <span>{formatStockPrice(stock.week52Low, stock.currency)}</span>
          <span>{formatStockPrice(stock.week52High, stock.currency)}</span>
        </div>
      </div>

      {/* Consensus Target */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
          <span className="text-xs font-medium">Target Konsensus</span>
          <Target className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">
          {formatStockPrice(stock.consensusTarget, stock.currency)}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
          <ArrowUpRight className="w-3 h-3" />
          <span>Potensi +{upsidePercent.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};
