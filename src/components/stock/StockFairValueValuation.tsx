import React, { useState } from 'react';
import { StockProfile } from '../../types';
import { formatStockPrice } from '../../services/stockData';
import { 
  Calculator, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  HelpCircle, 
  Sliders, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';

interface StockFairValueValuationProps {
  stock: StockProfile;
}

export const StockFairValueValuation: React.FC<StockFairValueValuationProps> = ({ stock }) => {
  const valuation = stock.valuation;
  const ratios = stock.detailedRatios;

  // Interactive DCF assumption adjustments
  const [growthRate, setGrowthRate] = useState<number>(valuation?.assumptions.growthRate || 10);
  const [discountRate, setDiscountRate] = useState<number>(valuation?.assumptions.discountRate || 9);

  if (!valuation || !ratios) return null;

  // Dynamically recalculate DCF fair value based on slider
  const baseDcf = valuation.dcfFairValue;
  const defaultGrowth = valuation.assumptions.growthRate || 10;
  const defaultDiscount = valuation.assumptions.discountRate || 9;

  // Sensitivity factor
  const sensitivity = 1 + (growthRate - defaultGrowth) * 0.035 - (discountRate - defaultDiscount) * 0.055;
  const adjustedDcf = Math.round(baseDcf * Math.max(0.6, sensitivity) * (stock.currency === 'IDR' ? 1 : 100)) / (stock.currency === 'IDR' ? 1 : 100);

  // Graham Number calculation
  const eps = ratios.roe > 0 ? (stock.currentPrice / stock.peRatio) : 100;
  const bvps = ratios.bvps || (stock.currentPrice / stock.pbvRatio);
  const calculatedGraham = Math.round(Math.sqrt(Math.max(1, 22.5 * Math.max(1, eps) * Math.max(1, bvps))));

  // Average of 4 models
  const models = [
    { name: 'Discounted Cash Flow (DCF)', value: adjustedDcf, desc: 'Nilai kini dari seluruh arus kas bebas masa depan' },
    { name: 'Graham Number (Benjamin Graham)', value: calculatedGraham, desc: 'Batas harga wajar konservatif dari EPS dan Nilai Buku' },
    { name: 'Historical P/E Band Mean (5Y)', value: valuation.peBandMean, desc: 'Harga bila dihargai sesuai rerata P/E 5 tahun' },
    { name: 'Historical PBV Band Mean (5Y)', value: valuation.pbvBandMean, desc: 'Harga bila dihargai sesuai rerata PBV 5 tahun' }
  ];

  const averageFairValue = Math.round(models.reduce((acc, m) => acc + m.value, 0) / models.length);
  const marginOfSafety = ((averageFairValue - stock.currentPrice) / averageFairValue) * 100;
  const isUndervalued = marginOfSafety > 0;

  return (
    <div className="space-y-6">
      {/* Top Banner: Composite Fair Value & Margin of Safety */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Konsensus 4 Model Valuasi
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${isUndervalued ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'}`}>
                {isUndervalued ? 'UNDERVALUED (TERDISKON)' : 'OVERVALUED (PREMIUM)'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Valuasi Harga Wajar (Fair Value Analysis)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Perpaduan model DCF, Graham Number, Historical P/E Multiple, dan Historical PBV Multiple.
            </p>
          </div>

          {/* Fair Value Price Callout */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Rerata Harga Wajar</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
              {formatStockPrice(averageFairValue, stock.currency)}
            </div>
            <span className={`text-xs font-bold font-mono flex items-center justify-end gap-1 mt-0.5 ${isUndervalued ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {isUndervalued ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              Margin of Safety: {marginOfSafety >= 0 ? `+${marginOfSafety.toFixed(1)}%` : `${marginOfSafety.toFixed(1)}%`}
            </span>
          </div>
        </div>

        {/* Comparison Bar Visual */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-600 dark:text-slate-300">
              Harga Pasar Saat Ini: <strong className="font-mono text-slate-900 dark:text-white">{formatStockPrice(stock.currentPrice, stock.currency)}</strong>
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              Harga Wajar: <strong className="font-mono text-indigo-600 dark:text-indigo-400">{formatStockPrice(averageFairValue, stock.currency)}</strong>
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden relative">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isUndervalued ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-rose-500'}`}
              style={{ width: `${Math.min(100, (stock.currentPrice / averageFairValue) * 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>Diskon 50%</span>
            <span>Nilai Wajar 100%</span>
            <span>Premium 150%</span>
          </div>
        </div>
      </div>

      {/* 4 Models Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {models.map((m, idx) => {
          const diff = ((m.value - stock.currentPrice) / stock.currentPrice) * 100;
          const pos = diff >= 0;

          return (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                  {m.name}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                  {m.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
                  {formatStockPrice(m.value, stock.currency)}
                </div>
                <div className={`text-xs font-mono font-bold mt-0.5 flex items-center gap-1 ${pos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {pos ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`} vs harga pasar
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive DCF Assumption Simulator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Simulator Asumsi DCF Interaktif
            </h4>
            <p className="text-xs text-slate-500">Ubah asumsi laju pertumbuhan laba & tingkat diskonto</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Growth Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Asumsi Pertumbuhan Laba (Growth Rate):</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{growthRate}%</span>
            </div>
            <input 
              type="range"
              min={3}
              max={25}
              step={0.5}
              value={growthRate}
              onChange={(e) => setGrowthRate(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Konservatif (3%)</span>
              <span>Moderat (10%)</span>
              <span>Agresif (25%)</span>
            </div>
          </div>

          {/* Discount Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Tingkat Diskonto (WACC / Required Return):</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{discountRate}%</span>
            </div>
            <input 
              type="range"
              min={6}
              max={16}
              step={0.5}
              value={discountRate}
              onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Rendah (6%)</span>
              <span>Standar BI-Rate (9%)</span>
              <span>Tinggi (16%)</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
          <span className="text-slate-600 dark:text-slate-400">
            Hasil Fair Value DCF Terkalkulasi:
          </span>
          <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm">
            {formatStockPrice(adjustedDcf, stock.currency)}
          </span>
        </div>
      </div>
    </div>
  );
};
