import React, { useState } from 'react';
import { StockProfile, FinancialYearData } from '../../types';
import { formatStockPrice, formatLargeNumber } from '../../services/stockData';
import { 
  Building2, 
  BarChart3, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Scale, 
  PieChart, 
  Award,
  Layers,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface StockFundamentalDeepDiveProps {
  stock: StockProfile;
}

export const StockFundamentalDeepDive: React.FC<StockFundamentalDeepDiveProps> = ({ stock }) => {
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'netProfit' | 'eps'>('netProfit');
  
  const ratios = stock.detailedRatios;
  const history = stock.financialHistory || [];

  if (!ratios) return null;

  // Maximum value for bar scaling
  const maxMetricVal = history.length > 0 
    ? Math.max(...history.map(h => (selectedMetric === 'eps' ? h.eps : (selectedMetric === 'revenue' ? h.revenue : h.netProfit))))
    : 100;

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'revenue': return 'Pendapatan Usaha (Revenue)';
      case 'netProfit': return 'Laba Bersih Tahun Berjalan (Net Profit)';
      case 'eps': return 'Laba Per Lembar Saham (EPS)';
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Health Scores: Piotroski F-Score & Altman Z-Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Piotroski F-Score Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Piotroski F-Score
                </h4>
                <p className="text-xs text-slate-500">Kualitas fundamental 9 parameter Stanford</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                {ratios.piotroskiFScore} <span className="text-xs text-slate-400 font-normal">/ 9</span>
              </span>
            </div>
          </div>

          <div className="mt-3.5 space-y-2">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500 rounded-full"
                style={{ width: `${(ratios.piotroskiFScore / 9) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>0 (Lemah)</span>
              <span>4-6 (Moderat)</span>
              <span>7-9 (Sangat Kuat)</span>
            </div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
              {ratios.piotroskiAssessment}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Skor {ratios.piotroskiFScore}/9 mencerminkan profitabilitas tinggi, arus kas operasi positif yang melampaui laba akuntansi, dan efisiensi pengelolaan modal kerja.
            </p>
          </div>
        </div>

        {/* Altman Z-Score Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Altman Z-Score (Solvabilitas)
                </h4>
                <p className="text-xs text-slate-500">Prediksi kesehatan & risiko gagal bayar</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {ratios.altmanZScore.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-3.5 space-y-2">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
              <div className="h-full bg-rose-500" style={{ width: '30%' }} title="Distress < 1.8" />
              <div className="h-full bg-amber-400" style={{ width: '30%' }} title="Grey 1.8 - 2.99" />
              <div className="h-full bg-emerald-500" style={{ width: '40%' }} title="Safe > 2.99" />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span className="text-rose-500">Distress (&lt;1.8)</span>
              <span className="text-amber-500">Grey (1.8 - 3.0)</span>
              <span className="text-emerald-500">Safe (&gt;3.0)</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                {ratios.altmanZone}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Z-Score {ratios.altmanZScore.toFixed(2)} berada di zona aman, membuktikan emiten memiliki ketahanan likuiditas dan solvabilitas yang sangat prima.
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Year Financial Performance Trend */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-500" />
                Tren Kinerja Keuangan Multi-Tahun
              </h4>
              <p className="text-xs text-slate-500">Pertumbuhan pendapatan, laba bersih, dan EPS dari tahun ke tahun</p>
            </div>

            {/* Toggle Metric View */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-medium self-start sm:self-auto">
              <button
                onClick={() => setSelectedMetric('netProfit')}
                className={`px-3 py-1.5 rounded-lg transition-all ${selectedMetric === 'netProfit' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              >
                Laba Bersih
              </button>
              <button
                onClick={() => setSelectedMetric('revenue')}
                className={`px-3 py-1.5 rounded-lg transition-all ${selectedMetric === 'revenue' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              >
                Pendapatan
              </button>
              <button
                onClick={() => setSelectedMetric('eps')}
                className={`px-3 py-1.5 rounded-lg transition-all ${selectedMetric === 'eps' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              >
                EPS
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {history.map((h, idx) => {
              const val = selectedMetric === 'eps' ? h.eps : (selectedMetric === 'revenue' ? h.revenue : h.netProfit);
              const heightPercent = maxMetricVal > 0 ? Math.max(15, (val / maxMetricVal) * 100) : 50;

              return (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <div className="text-center pb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      {h.period}
                    </span>
                    <span className="text-sm font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1 block">
                      {selectedMetric === 'eps' 
                        ? (stock.currency === 'IDR' ? `Rp ${val}` : `$${val}`)
                        : (stock.currency === 'IDR' ? `Rp ${val.toFixed(1)} T` : `$${val.toFixed(1)} B`)}
                    </span>
                  </div>

                  <div className="h-24 flex items-end justify-center py-1">
                    <div 
                      className="w-10 rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all duration-500 shadow-xs"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700/60 pt-2 text-[10px] space-y-0.5 text-slate-500 dark:text-slate-400">
                    <div className="flex justify-between font-mono">
                      <span>Laba:</span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {stock.currency === 'IDR' ? `Rp ${h.netProfit} T` : `$${h.netProfit} B`}
                      </span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span>Kas Ops:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {stock.currency === 'IDR' ? `Rp ${h.operatingCashFlow} T` : `$${h.operatingCashFlow} B`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Periode</th>
                  <th className="py-2.5 px-3 text-right">Pendapatan</th>
                  <th className="py-2.5 px-3 text-right">Laba Kotor</th>
                  <th className="py-2.5 px-3 text-right">Laba Bersih</th>
                  <th className="py-2.5 px-3 text-right">EPS</th>
                  <th className="py-2.5 px-3 text-right">Total Aset</th>
                  <th className="py-2.5 px-3 text-right">Total Ekuitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {history.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-800 dark:text-slate-200">{row.period}</td>
                    <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                      {stock.currency === 'IDR' ? `Rp ${row.revenue} T` : `$${row.revenue} B`}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                      {stock.currency === 'IDR' ? `Rp ${row.grossProfit} T` : `$${row.grossProfit} B`}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {stock.currency === 'IDR' ? `Rp ${row.netProfit} T` : `$${row.netProfit} B`}
                    </td>
                    <td className="py-2.5 px-3 text-right text-indigo-600 dark:text-indigo-400">
                      {stock.currency === 'IDR' ? `Rp ${row.eps}` : `$${row.eps}`}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      {stock.currency === 'IDR' ? `Rp ${row.totalAssets} T` : `$${row.totalAssets} B`}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      {stock.currency === 'IDR' ? `Rp ${row.totalEquity} T` : `$${row.totalEquity} B`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Complete Financial Ratios Matrix & Sector Benchmarks */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-500" />
            Matriks Rasio Finansial Lengkap & Benchmark Sektor
          </h4>
          <p className="text-xs text-slate-500">
            Perbandingan metrik emiten terhadap rata-rata industri ({stock.sector})
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Group 1: Profitabilitas */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-3">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              1. Profitabilitas & Margin
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Return on Equity (ROE):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{ratios.roe.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400 pl-2">
                <span>Rata-rata Sektor ROE:</span>
                <span className="font-mono">{ratios.sectorRoeAverage}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Return on Assets (ROA):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{ratios.roa.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Net Profit Margin (NPM):</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{ratios.npm.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Operating Margin (OPM):</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{ratios.opm.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Gross Profit Margin (GPM):</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{ratios.gpm.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Group 2: Solvabilitas & Likuiditas */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-3">
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
              2. Kesehatan Utang & Solvabilitas
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Debt to Equity (DER):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{ratios.der.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Current Ratio:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{ratios.currentRatio.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Quick Ratio:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{ratios.quickRatio.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Interest Coverage Ratio:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{ratios.interestCoverage.toFixed(1)}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Book Value Per Share:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatStockPrice(ratios.bvps, stock.currency)}</span>
              </div>
            </div>
          </div>

          {/* Group 3: Valuasi Saham */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-3">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              3. Kelipatan Valuasi (Multiples)
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Price to Earnings (P/E):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{ratios.peRatio.toFixed(1)}x</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400 pl-2">
                <span>Rata-rata Sektor P/E:</span>
                <span className="font-mono">{ratios.sectorPeAverage}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Price to Book Value (PBV):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{ratios.pbvRatio.toFixed(1)}x</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400 pl-2">
                <span>Rata-rata Sektor PBV:</span>
                <span className="font-mono">{ratios.sectorPbvAverage}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">EV / EBITDA:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{ratios.evEbitda.toFixed(1)}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">PEG Ratio:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{ratios.pegRatio.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
