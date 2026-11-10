import React, { useState } from 'react';
import { StockProfile } from '../../types';
import { formatStockPrice } from '../../services/stockData';
import { Activity, Compass, TrendingUp, TrendingDown, Target, Shield, ArrowUpRight } from 'lucide-react';

interface StockTechnicalPivotPanelProps {
  stock: StockProfile;
}

export const StockTechnicalPivotPanel: React.FC<StockTechnicalPivotPanelProps> = ({ stock }) => {
  const [pivotMode, setPivotMode] = useState<'classical' | 'fibonacci'>('classical');

  const signals = stock.technicalSignals || [];
  const pivots = stock.pivotPoints;

  // Signal breakdown count
  const buyCount = signals.filter(s => s.signal === 'Beli' || s.signal === 'Sangat Beli').length;
  const neutralCount = signals.filter(s => s.signal === 'Netral').length;
  const sellCount = signals.filter(s => s.signal === 'Jual' || s.signal === 'Sangat Jual').length;

  const activePivots = pivots ? (pivotMode === 'classical' ? pivots.classical : pivots.fibonacci) : null;

  return (
    <div className="space-y-6">
      {/* Top Technical Summary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Evaluasi Algoritma Teknis
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Konsensus Indikator Teknikal & Moving Averages
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Analisis matematis dari momentum tren, overbought/oversold, dan volatilitas harga
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium block">BELI</span>
              <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">{buyCount}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium block">NETRAL</span>
              <span className="text-base font-black font-mono text-amber-600 dark:text-amber-400">{neutralCount}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
              <span className="text-[10px] text-rose-700 dark:text-rose-400 font-medium block">JUAL</span>
              <span className="text-base font-black font-mono text-rose-600 dark:text-rose-400">{sellCount}</span>
            </div>
          </div>
        </div>

        {/* Signals Table */}
        <div className="overflow-x-auto pt-3">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Nama Indikator</th>
                <th className="py-2.5 px-3 text-right">Nilai / Level</th>
                <th className="py-2.5 px-3 text-center">Sinyal</th>
                <th className="py-2.5 px-3">Interpretasi Pasar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {signals.map((sig, idx) => {
                const isBuy = sig.signal === 'Beli' || sig.signal === 'Sangat Beli';
                const isSell = sig.signal === 'Jual' || sig.signal === 'Sangat Jual';

                return (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-800 dark:text-slate-200">
                      {sig.indicator}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white font-bold">
                      {sig.value}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold border ${isBuy ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : isSell ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'}`}>
                        {sig.signal}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-500 dark:text-slate-400 text-[11px]">
                      {sig.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pivot Points Level Table (Classical & Fibonacci) */}
      {activePivots && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-500" />
                Level Titik Balik (Pivot Points, Support & Resistance)
              </h4>
              <p className="text-xs text-slate-500">
                Level acuan pasang order beli, take profit (TP), dan cut loss (SL)
              </p>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-medium self-start sm:self-auto">
              <button
                onClick={() => setPivotMode('classical')}
                className={`px-3 py-1.5 rounded-lg transition-all ${pivotMode === 'classical' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              >
                Klasik (Standard)
              </button>
              <button
                onClick={() => setPivotMode('fibonacci')}
                className={`px-3 py-1.5 rounded-lg transition-all ${pivotMode === 'fibonacci' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              >
                Fibonacci
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
            {/* S3 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block">Support 3</span>
              <span className="text-xs font-mono font-bold text-rose-500 mt-1 block">
                {formatStockPrice(activePivots.s3, stock.currency)}
              </span>
            </div>

            {/* S2 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block">Support 2</span>
              <span className="text-xs font-mono font-bold text-rose-400 mt-1 block">
                {formatStockPrice(activePivots.s2, stock.currency)}
              </span>
            </div>

            {/* S1 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block">Support 1</span>
              <span className="text-xs font-mono font-bold text-emerald-500 mt-1 block">
                {formatStockPrice(activePivots.s1, stock.currency)}
              </span>
            </div>

            {/* Pivot */}
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block">PIVOT (P)</span>
              <span className="text-xs font-mono font-black text-indigo-700 dark:text-indigo-300 mt-1 block">
                {formatStockPrice(activePivots.pivot, stock.currency)}
              </span>
            </div>

            {/* R1 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block">Resistance 1</span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                {formatStockPrice(activePivots.r1, stock.currency)}
              </span>
            </div>

            {/* R2 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block">Resistance 2</span>
              <span className="text-xs font-mono font-bold text-teal-500 mt-1 block">
                {formatStockPrice(activePivots.r2, stock.currency)}
              </span>
            </div>

            {/* R3 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block">Resistance 3</span>
              <span className="text-xs font-mono font-bold text-cyan-500 mt-1 block">
                {formatStockPrice(activePivots.r3, stock.currency)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
