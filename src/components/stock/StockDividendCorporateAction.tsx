import React from 'react';
import { StockProfile } from '../../types';
import { formatStockPrice } from '../../services/stockData';
import { Calendar, Percent, Award, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface StockDividendCorporateActionProps {
  stock: StockProfile;
}

export const StockDividendCorporateAction: React.FC<StockDividendCorporateActionProps> = ({ stock }) => {
  const dividends = stock.dividends || [];
  const streak = stock.dividendStreakYears || 5;
  const corporateActions = stock.corporateActions || [];

  return (
    <div className="space-y-6">
      {/* Top Banner: Dividend Profile & Aristocrat Streak */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Imbal Hasil Dividen
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                {streak} Tahun Berturut-turut Bayar Dividen
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Kebijakan Dividen & Kalender Aksi Korporasi
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Historis pembagian laba tunai kepada pemegang saham dan jadwal aksi korporasi emiten
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] text-slate-400 block">Indikasi Yield Saat Ini</span>
              <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5">
                {stock.dividendYield > 0 ? `${stock.dividendYield.toFixed(1)}%` : '0%'}
              </span>
            </div>
          </div>
        </div>

        {/* Historical Dividend Payments Table */}
        <div className="pt-3 space-y-2">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            Riwayat Pembagian Dividen Tunai Terakhir
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Tahun Buku</th>
                  <th className="py-2.5 px-3">Tanggal Cum/Ex Date</th>
                  <th className="py-2.5 px-3">Tanggal Pembayaran</th>
                  <th className="py-2.5 px-3 text-right">Dividen Per Saham (DPS)</th>
                  <th className="py-2.5 px-3 text-right">Dividend Yield</th>
                  <th className="py-2.5 px-3 text-right">Payout Ratio (DPR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {dividends.map((div, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-800 dark:text-slate-200">{div.year}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-600 dark:text-slate-300">{div.exDate}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-600 dark:text-slate-300">{div.paymentDate}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {formatStockPrice(div.dps, stock.currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-800 dark:text-slate-200">
                      {div.yieldPercent.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-indigo-600 dark:text-indigo-400 font-bold">
                      {div.payoutRatio.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upcoming Corporate Actions Calendar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            Jadwal & Agenda Aksi Korporasi Mendatang
          </h4>
          <p className="text-xs text-slate-500">
            Catatan penting tanggal RUPS, Paparan Publik, dan aksi korporasi lainnya
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {corporateActions.map((ca, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 uppercase">
                    {ca.type}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${ca.status === 'Selesai' ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                    {ca.status}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-2">
                  {ca.title}
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {ca.notes}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Tanggal:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">{ca.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
