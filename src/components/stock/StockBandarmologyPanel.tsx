import React from 'react';
import { StockProfile } from '../../types';
import { formatStockPrice } from '../../services/stockData';
import { 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Globe2, 
  ShieldCheck, 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  Percent,
  Layers,
  HelpCircle
} from 'lucide-react';

interface StockBandarmologyPanelProps {
  stock: StockProfile;
}

export const StockBandarmologyPanel: React.FC<StockBandarmologyPanelProps> = ({ stock }) => {
  const bandar = stock.bandarmology;
  if (!bandar) return null;

  const isIdr = stock.currency === 'IDR';

  // Format currency helper for billions/millions
  const formatFlow = (val: number) => {
    const isPos = val >= 0;
    const prefix = isPos ? '+' : '-';
    const abs = Math.abs(val);
    if (isIdr) {
      return `${prefix}Rp ${abs.toLocaleString('id-ID')} Miliar`;
    }
    return `${prefix}$${abs.toFixed(1)} Juta`;
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Akumulasi Masif':
        return {
          bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-500',
          desc: 'Big player (smart money & asing) mengumpulkan barang dalam jumlah sangat besar secara konsisten.'
        };
      case 'Akumulasi Normal':
        return {
          bg: 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/30',
          dot: 'bg-teal-500',
          desc: 'Terlihat arus masuk dana institusi melampaui tekanan jual pasar ritel.'
        };
      case 'Distribusi Normal':
        return {
          bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
          dot: 'bg-amber-500',
          desc: 'Tekanan jual institusi mulai terlihat, disarankan waspada dan pasang trailing stop.'
        };
      case 'Distribusi Masif':
        return {
          bg: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
          dot: 'bg-rose-500',
          desc: 'Pelepasan barang dalam jumlah besar oleh broker penggerak pasar utama.'
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30',
          dot: 'bg-slate-500',
          desc: 'Volume transaksi berimbang, transaksi didominasi oleh pergerakan normal.'
        };
    }
  };

  const phaseConfig = getPhaseColor(bandar.phase);

  return (
    <div className="space-y-6">
      {/* Top Banner: Bandarmology Overview & Whale Meter */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Arus Modal & Smart Money
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${phaseConfig.bg}`}>
                <span className={`w-2 h-2 rounded-full ${phaseConfig.dot} animate-pulse`} />
                {bandar.phase}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Analisa Bandarmologi & Arus Dana Asing (Foreign Flow)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
              {phaseConfig.desc}
            </p>
          </div>

          {/* Whale Participation Score */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800 flex items-center gap-4 min-w-[240px]">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-600 dark:text-slate-300">Smart Money / Whale</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">{bandar.whaleParticipationPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-1.5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full" 
                  style={{ width: `${bandar.whaleParticipationPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Dominasi transaksi institusi & asing
              </span>
            </div>
          </div>
        </div>

        {/* Foreign Flow Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {/* Hari Ini */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              Net Asing Hari Ini
            </span>
            <div className={`text-base font-bold font-mono tabular-nums ${bandar.netForeignToday >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {formatFlow(bandar.netForeignToday)}
            </div>
            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              {bandar.netForeignToday >= 0 ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownRight className="w-3 h-3 text-rose-500" />}
              {bandar.netForeignToday >= 0 ? 'Net Foreign Buy' : 'Net Foreign Sell'}
            </span>
          </div>

          {/* 5 Hari Terakhir */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              Net Asing 5 Hari
            </span>
            <div className={`text-base font-bold font-mono tabular-nums ${bandar.netForeign5D >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {formatFlow(bandar.netForeign5D)}
            </div>
            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              Akumulasi mingguan
            </span>
          </div>

          {/* 20 Hari Terakhir */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              Net Asing 20 Hari (1 Bulan)
            </span>
            <div className={`text-base font-bold font-mono tabular-nums ${bandar.netForeign20D >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {formatFlow(bandar.netForeign20D)}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Tren bulanan jangka menengah
            </span>
          </div>

          {/* Total Kepemilikan Asing */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              Porsi Kepemilikan Asing
            </span>
            <div className="text-base font-bold font-mono text-cyan-600 dark:text-cyan-400 tabular-nums">
              {bandar.foreignOwnershipPercent}%
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Dari total lembar saham beredar
            </span>
          </div>
        </div>

        {/* Foreign Flow History Bar Timeline */}
        {bandar.foreignFlowHistory && bandar.foreignFlowHistory.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Arus Masuk/Keluar Asing 5 Sesi Terakhir
              </span>
              <span>Satuan: Miliar Rupiah</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {bandar.foreignFlowHistory.map((item, idx) => {
                const isPos = item.netForeign >= 0;
                return (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                      {item.date}
                    </span>
                    <span className={`text-xs font-bold font-mono block mt-1 tabular-nums ${isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {isPos ? `+${item.netForeign}` : item.netForeign}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 mt-0.5 block tabular-nums">
                      {formatStockPrice(item.price, stock.currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Broker Summary (Top 5 Buyers vs Top 5 Sellers) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              Broker Summary (Broker Net Buy vs Net Sell)
            </h4>
            <p className="text-xs text-slate-500">
              Analisa konsentrasi transaksi broker penggerak pasar sesi hari ini
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-mono text-[11px]">
              Top 3 Buyer: {bandar.buyerConcentration}%
            </span>
            <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 font-mono text-[11px]">
              Top 3 Seller: {bandar.sellerConcentration}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top 5 Buyers */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                TOP 5 PEMBELI BERSIH (NET BUY)
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Akumulasi</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {bandar.topBuyers.map((b, idx) => (
                <div key={idx} className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs flex items-center justify-center">
                      {b.code}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span>{b.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${b.type === 'Asing' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          {b.type}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Rata-rata: {formatStockPrice(b.avgPrice, stock.currency)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block tabular-nums">
                      {b.lots.toLocaleString('id-ID')} Lot
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                      Rp {(b.value / 1000).toFixed(1)} M
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 Sellers */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-rose-50 dark:bg-rose-950/20 px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5" />
                TOP 5 PENJUAL BERSIH (NET SELL)
              </span>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">Distribusi</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {bandar.topSellers.map((s, idx) => (
                <div key={idx} className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300 font-mono font-bold text-xs flex items-center justify-center">
                      {s.code}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span>{s.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${s.type === 'Asing' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          {s.type}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Rata-rata: {formatStockPrice(s.avgPrice, stock.currency)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400 block tabular-nums">
                      {s.lots.toLocaleString('id-ID')} Lot
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                      Rp {(s.value / 1000).toFixed(1)} M
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insight Box */}
        <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Cara Membaca Bandarmologi:</span>
            <p className="text-[11px] leading-relaxed text-indigo-800 dark:text-indigo-300">
              Jika pembeli (Buyers) didominasi oleh broker institusi/asing berkode <strong>BK, ZP, CC, AK, YU</strong> dengan konsentrasi tinggi (&gt;60%), sedangkan pihak penjual (Sellers) tersebar ke broker ritel (PD, XC, YP), ini merupakan indikasi kuat bahwa <em>Smart Money sedang melakukan akumulasi</em> saham sebelum fase mark-up kenaikan harga.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
