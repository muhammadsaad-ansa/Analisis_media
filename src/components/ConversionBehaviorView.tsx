/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { FunnelStage, BehaviorCohortWeek, DeviceConversionMetric } from '../types';
import {
  INITIAL_FUNNEL_STAGES,
  INITIAL_COHORTS,
  INITIAL_DEVICE_METRICS,
} from '../data/analyticsExtendedData';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Smartphone,
  ShoppingCart,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  Sparkles,
  Clock,
  Layers,
  Filter,
  BarChart2,
  ShieldCheck,
  MousePointerClick
} from 'lucide-react';

export const ConversionBehaviorView: React.FC = () => {
  const [stages, setStages] = useState<FunnelStage[]>(INITIAL_FUNNEL_STAGES);
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [funnelFilterTime, setFunnelFilterTime] = useState<'today' | '7d' | '30d'>('30d');

  // Overall Funnel KPIs
  const overallMetrics = useMemo(() => {
    const totalClicks = stages[0]?.visitorCount || 1;
    const finalPurchasers = stages[stages.length - 1]?.visitorCount || 0;
    const overallConversionRate = Number(((finalPurchasers / totalClicks) * 100).toFixed(2));
    const totalDropOffs = stages.reduce((acc, s) => acc + s.dropOffCount, 0);
    const cartAbandonmentRate = Number(
      (
        ((stages[3].visitorCount - stages[5].visitorCount) / stages[3].visitorCount) *
        100
      ).toFixed(1)
    );

    // Biggest leak stage
    const highestLeak = [...stages]
      .filter((s) => s.stageNumber > 1)
      .sort((a, b) => b.dropOffRate - a.dropOffRate)[0];

    return {
      totalClicks,
      finalPurchasers,
      overallConversionRate,
      totalDropOffs,
      cartAbandonmentRate,
      highestLeak,
    };
  }, [stages]);

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 border border-rose-800/40 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider bg-rose-900/60 px-2 py-0.5 rounded-full border border-rose-700/60 flex items-center gap-1">
                <BarChart2 className="w-3.5 h-3.5 text-rose-400" />
                Conversion Funnel & Behavior Analytics
              </span>
              <span className="text-xs text-rose-300">·</span>
              <span className="text-xs text-rose-200">
                Tingkat Konversi Total: <strong>{overallMetrics.overallConversionRate}%</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Analisis Perilaku & Corong Konversi (Funnel)
            </h2>
            <p className="text-xs text-rose-200 max-w-2xl leading-relaxed">
              Petakan setiap langkah perjalanan audiens dari klik tautan media sosial hingga pembayaran sukses. Temukan titik kebocoran (*leakage*) dan optimasi tingkat konversi transaksi Anda.
            </p>
          </div>

          {/* Quick Metrics Header Pill */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-rose-700/50 rounded-xl p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Klik Awal Corong</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-200">
                {overallMetrics.totalClicks.toLocaleString('id-ID')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Pembeli Berhasil</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                {overallMetrics.finalPurchasers.toLocaleString('id-ID')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Konversi Akhir</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-rose-400">
                {overallMetrics.overallConversionRate}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Abandonment Keranjang</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-amber-400">
                {overallMetrics.cartAbandonmentRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Conversion Funnel Visualization */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Corong Konversi Multi-Tahap (Multi-Stage Funnel)
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi penurunan pengunjung antar tahap dan bandingkan dengan standar tolok ukur industri
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Rentang Waktu:</span>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
              {(['today', '7d', '30d'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFunnelFilterTime(t)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    funnelFilterTime === t
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {t === 'today' ? 'Hari Ini' : t === '7d' ? '7 Hari' : '30 Hari'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Funnel Stages List */}
        <div className="space-y-3">
          {stages.map((stage, idx) => {
            const widthPercent = Math.max(12, (stage.visitorCount / stages[0].visitorCount) * 100);
            const isHighestLeak = stage.id === overallMetrics.highestLeak?.id;

            return (
              <div
                key={stage.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-2.5 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs">
                      {stage.stageNumber}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {stage.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{stage.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Jumlah Pengunjung</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {stage.visitorCount.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Lolos dari Tahap Lalu</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        {stage.conversionRateFromPrevious}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Retensi Kumulatif</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                        {stage.overallConversionRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>

                  {idx > 0 && (
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                        <ArrowDown className="w-3.5 h-3.5" />
                        <span>
                          Kebocoran Drop-off: {stage.dropOffCount.toLocaleString('id-ID')} pengunjung ({stage.dropOffRate}%)
                        </span>
                        {isHighestLeak && (
                          <span className="ml-1 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-1.5 py-0.2 rounded font-bold text-[10px]">
                            Titik Kebocoran Terbesar ⚠️
                          </span>
                        )}
                      </div>

                      <div className="text-slate-400 flex items-center gap-2">
                        <span>Standar Industri: ~{stage.benchmarkRate}%</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Rata-rata {stage.avgTimeOnStageSeconds}s
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leakage Diagnosis & Device Conversion Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leakage Action Plan */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Diagnosa Kebocoran & Solusi Peningkatan Konversi
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-1">
              <div className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                1. Kebocoran Keranjang ke Checkout ({stages[3].dropOffRate}% Drop-off)
              </div>
              <p className="text-rose-800 dark:text-rose-400 leading-relaxed text-[11px]">
                Sebanyak 4.800 pengunjung keluar setelah menekan tombol "Tambah ke Keranjang" tanpa melanjutkan ke checkout.
              </p>
              <div className="mt-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                💡 <strong>Solusi:</strong> Aktifkan <em>One-Click Direct Checkout</em> ke WhatsApp atau sediakan tombol pop-up instan pembayaran QRIS.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1">
              <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                2. Kebocoran Bounce Rate Halaman Mendarat (17.0% Keluar)
              </div>
              <p className="text-amber-800 dark:text-amber-400 leading-relaxed text-[11px]">
                3.140 klik langsung menutup tab dalam waktu &lt; 5 detik karena kecepatan loading atau ketidaksesuaian konten video.
              </p>
              <div className="mt-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                💡 <strong>Solusi:</strong> Kompres gambar produk ke format WebP dan pastikan promo di video Reels cocok dengan judul landing page.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
              <div>
                <span className="block font-bold">Potensi Tambahan Omzet:</span>
                <span className="text-[11px] text-emerald-800 dark:text-emerald-400">
                  Jika kebocoran keranjang berkurang 10%
                </span>
              </div>
              <span className="font-mono font-bold text-base text-emerald-700 dark:text-emerald-300">
                +Rp 42.500.000 / bln
              </span>
            </div>
          </div>
        </div>

        {/* Device Conversion Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Konversi Berdasarkan Perangkat (Device Breakdown)
              </h3>
            </div>
            <span className="text-xs text-slate-400">Performa Perangkat</span>
          </div>

          <div className="space-y-2.5">
            {INITIAL_DEVICE_METRICS.map((dev) => (
              <div
                key={dev.device}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 text-xs flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {dev.device}
                  </h4>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {dev.sessions.toLocaleString('id-ID')} sesi · AOV Rp {(dev.avgOrderValue / 1000).toFixed(0)}rb
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Omzet</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      Rp {(dev.revenue / 1000000).toFixed(1)} Jt
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Konversi</span>
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                        dev.conversionRate >= 10
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : dev.conversionRate >= 6
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {dev.conversionRate}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cohort Retention Table (Weekly Retention Heatmap) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Retensi Pengunjung & Pembelian Berulang (Weekly Cohorts)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Persentase audiens yang kembali dan melakukan pembelian berulang setelah kunjungan pertama
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <th className="py-2.5 px-3 font-semibold">Kohor Pengunjung</th>
                <th className="py-2.5 px-3 font-semibold text-right">Total Audiens</th>
                <th className="py-2.5 px-3 font-semibold text-right">Pembeli Awal</th>
                <th className="py-2.5 px-3 font-semibold text-center">Minggu 0</th>
                <th className="py-2.5 px-3 font-semibold text-center">Minggu 1</th>
                <th className="py-2.5 px-3 font-semibold text-center">Minggu 2</th>
                <th className="py-2.5 px-3 font-semibold text-center">Minggu 3</th>
                <th className="py-2.5 px-3 font-semibold text-center">Minggu 4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono">
              {INITIAL_COHORTS.map((cohort) => (
                <tr key={cohort.cohortDate} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-sans font-bold text-slate-800 dark:text-slate-200">
                    {cohort.cohortDate}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700 dark:text-slate-300">
                    {cohort.totalVisitors.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-indigo-600 dark:text-indigo-400">
                    {cohort.initialPurchasers} tx
                  </td>
                  {cohort.retentionRates.map((rate, rIdx) => {
                    const bgColor =
                      rIdx === 0
                        ? 'bg-indigo-600 text-white'
                        : rate >= 35
                        ? 'bg-indigo-500/80 text-white'
                        : rate >= 25
                        ? 'bg-indigo-500/50 text-indigo-950 dark:text-indigo-100'
                        : rate >= 18
                        ? 'bg-indigo-500/30 text-indigo-900 dark:text-indigo-200'
                        : 'bg-indigo-500/15 text-slate-700 dark:text-slate-300';

                    return (
                      <td key={rIdx} className="py-3 px-3 text-center">
                        <span className={`inline-block w-14 py-1 rounded font-bold text-xs ${bgColor}`}>
                          {rate}%
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
