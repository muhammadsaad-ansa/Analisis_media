import React from 'react';
import { StockProfile } from '../../types';
import { formatStockPrice } from '../../services/stockData';
import { 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Compass, 
  CheckCircle2, 
  AlertTriangle,
  Layers
} from 'lucide-react';

interface StockSignalCardProps {
  stock: StockProfile;
}

export const StockSignalCard: React.FC<StockSignalCardProps> = ({ stock }) => {
  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'Sangat Beli':
        return {
          bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-500',
          desc: 'Indikator teknikal & fundamental menunjukkan momentum akumulasi sangat kuat.'
        };
      case 'Beli':
        return {
          bg: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
          dot: 'bg-teal-500',
          desc: 'Rasio valuasi wajar dengan peluang kenaikan menuju level resistensi berikutnya.'
        };
      case 'Netral':
        return {
          bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
          dot: 'bg-amber-500',
          desc: 'Pergerakan sideways atau konsolidasi, disarankan menunggu konfirmasi breakout.'
        };
      case 'Jual':
        return {
          bg: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
          dot: 'bg-rose-500',
          desc: 'Indikator overbought atau tekanan jual tinggi, pertimbangkan ambil untung.'
        };
      default:
        return {
          bg: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
          dot: 'bg-slate-500',
          desc: 'Dalam pengamatan pasar.'
        };
    }
  };

  const badgeConfig = getRatingBadge(stock.analystRating);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header with Title and Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Sinyal Analis & Algoritma
            </h3>
            <p className="text-xs text-slate-500">Evaluasi multi-faktor teknis & konsensus</p>
          </div>
        </div>

        {/* Rating Badge */}
        <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-2 ${badgeConfig.bg}`}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${badgeConfig.dot}`} />
          <span>{stock.analystRating.toUpperCase()}</span>
        </div>
      </div>

      {/* Score Meter */}
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-medium mb-1.5">
          <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            Skor Konsensus Sekuritas
          </span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">
            {stock.analystScore} / 5.0
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${(stock.analystScore / 5) * 100}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          {stock.summaryReason}
        </p>
      </div>

      {/* Support and Resistance Pivot Levels */}
      <div>
        <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          Level Kunci Pivot (Support & Resistance)
        </h4>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Support levels */}
          <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Level Support</span>
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Support 1 (Kuat)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatStockPrice(stock.supportLevels[0], stock.currency)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Support 2 (Batas)</span>
                <span>{formatStockPrice(stock.supportLevels[1], stock.currency)}</span>
              </div>
            </div>
          </div>

          {/* Resistance levels */}
          <div className="bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 rounded-xl p-2.5">
            <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-semibold mb-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Level Resistance</span>
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Resistance 1</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {formatStockPrice(stock.resistanceLevels[0], stock.currency)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Resistance 2 (Breakout)</span>
                <span>{formatStockPrice(stock.resistanceLevels[1], stock.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rationale Checklist */}
      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
          <span>Moving Average: Posisi harga relatif terhadap SMA 20 dan SMA 50 mengindikasikan struktur tren yang sehat.</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
          <span>Volume akumulasi institusi stabil di atas rata-rata 30 hari perdagangan terakhir.</span>
        </div>
      </div>
    </div>
  );
};
