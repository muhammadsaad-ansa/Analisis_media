/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { AttributionModelType, MarketingCampaign } from '../types';
import { INITIAL_MARKETING_CAMPAIGNS, INITIAL_TOUCHPOINT_JOURNEYS } from '../data/analyticsExtendedData';
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  Sliders, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Zap, 
  Share2, 
  Info, 
  RotateCcw,
  BarChart3,
  MousePointerClick
} from 'lucide-react';

export const MarketingAttributionView: React.FC = () => {
  const [attributionModel, setAttributionModel] = useState<AttributionModelType>('position_based');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSimulatorApplied, setIsSimulatorApplied] = useState<boolean>(false);
  const [budgetShiftPercent, setBudgetShiftPercent] = useState<number>(20);

  // Model explanations
  const modelInfo: Record<AttributionModelType, { label: string; desc: string; icon: string }> = {
    first_touch: {
      label: 'First-Touch (Sentuhan Pertama)',
      desc: '100% kredit konversi diberikan ke saluran pertama yang mengenalkan brand kepada audiens.',
      icon: '🌱',
    },
    last_touch: {
      label: 'Last-Touch (Sentuhan Terakhir)',
      desc: '100% kredit konversi diberikan ke saluran terakhir sesaat sebelum transaksi terjadi.',
      icon: '🎯',
    },
    linear: {
      label: 'Linear (Bagi Rata)',
      desc: 'Kredit konversi dibagi sama rata ke semua saluran touchpoint yang dilalui pembeli.',
      icon: '⚖️',
    },
    time_decay: {
      label: 'Time-Decay (Penyusutan Waktu)',
      desc: 'Sentuhan yang terjadi mendekati waktu transaksi mendapatkan bobot kredit eksponensial lebih besar.',
      icon: '⏳',
    },
    position_based: {
      label: 'Position-Based (U-Shaped 40/20/40)',
      desc: '40% kredit untuk sentuhan pertama, 40% untuk sentuhan penutup, dan 20% dibagi di tengah perjalanan.',
      icon: '👑',
    },
  };

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return INITIAL_MARKETING_CAMPAIGNS.filter((c) => {
      if (platformFilter !== 'all' && c.platform !== platformFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.utmCampaign.toLowerCase().includes(q) ||
          c.utmSource.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [platformFilter, searchQuery]);

  // Totals based on selected attribution model
  const totals = useMemo(() => {
    const totalSpend = INITIAL_MARKETING_CAMPAIGNS.reduce((acc, c) => acc + c.spend, 0);
    const totalImpressions = INITIAL_MARKETING_CAMPAIGNS.reduce((acc, c) => acc + c.impressions, 0);
    const totalClicks = INITIAL_MARKETING_CAMPAIGNS.reduce((acc, c) => acc + c.clicks, 0);
    const totalConversions = INITIAL_MARKETING_CAMPAIGNS.reduce(
      (acc, c) => acc + c.attribution[attributionModel].conversions,
      0
    );
    const totalRevenue = INITIAL_MARKETING_CAMPAIGNS.reduce(
      (acc, c) => acc + c.attribution[attributionModel].revenue,
      0
    );
    const blendedRoas = totalSpend > 0 ? Number((totalRevenue / totalSpend).toFixed(2)) : 0;
    const blendedCac = totalConversions > 0 ? Math.round(totalSpend / totalConversions) : 0;
    const netProfit = totalRevenue - totalSpend;

    return {
      totalSpend,
      totalImpressions,
      totalClicks,
      totalConversions,
      totalRevenue,
      blendedRoas,
      blendedCac,
      netProfit,
    };
  }, [attributionModel]);

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-indigo-800/40 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider bg-violet-900/60 px-2 py-0.5 rounded-full border border-violet-700/60 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-violet-400" />
                Multi-Touch Marketing Attribution
              </span>
              <span className="text-xs text-indigo-300">·</span>
              <span className="text-xs text-indigo-200">
                Model: <strong>{modelInfo[attributionModel].label}</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Analisis Pemasaran & Efisiensi Kampanye
            </h2>
            <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed">
              Ketahui saluran pemasaran mana yang sesungguhnya mendorong omzet. Bandingkan kontribusi TikTok, Instagram, WhatsApp, Meta Ads, hingga Afiliasi menggunakan 5 model atribusi multi-sentuhan.
            </p>
          </div>

          {/* Quick Metrics Header Pill */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-indigo-700/50 rounded-xl p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Total Belanja Iklan</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-200">
                Rp {(totals.totalSpend / 1000000).toFixed(1)} Jt
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Omzet Teratribusi</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                Rp {(totals.totalRevenue / 1000000).toFixed(1)} Jt
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Blended ROAS</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-amber-400">
                {totals.blendedRoas}x
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Blended CAC</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-cyan-400">
                Rp {totals.blendedCac.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Attribution Model Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Pilih Model Atribusi Pemasaran
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Peralihan model otomatis menghitung ulang pembagian omzet dan CAC per kanal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {(['position_based', 'first_touch', 'last_touch', 'linear', 'time_decay'] as AttributionModelType[]).map((m) => {
            const isSelected = attributionModel === m;
            const item = modelInfo[m];

            return (
              <button
                key={m}
                onClick={() => setAttributionModel(m)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 shadow-xs ring-1 ring-indigo-500/50'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-xs font-bold truncate">{item.label.split(' ')[0]}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>
            <strong>Model Terpilih ({modelInfo[attributionModel].label}):</strong> {modelInfo[attributionModel].desc}
          </span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Belanja Pemasaran</span>
            <DollarSign className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            Rp {totals.totalSpend.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>{totals.totalClicks.toLocaleString('id-ID')} total klik didapatkan</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Omzet Teratribusi</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            Rp {totals.totalRevenue.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <span>Laba Bersih Pemasaran: Rp {totals.netProfit.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Efektivitas ROAS Blended</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {totals.blendedRoas}x Return
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>Setiap Rp 1 iklan menghasilkan Rp {(totals.blendedRoas).toFixed(1)} omzet</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Biaya Akuisisi (CAC)</span>
            <Target className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
            Rp {totals.blendedCac.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>Dari {totals.totalConversions.toLocaleString('id-ID')} pembeli terkonfirmasi</span>
          </div>
        </div>
      </div>

      {/* Main Campaign Performance Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Kinerja Kampanye & Saluran Pemasaran Teratribusi
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filteredCampaigns.length} Kampanye
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kampanye..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs w-40 sm:w-52"
              />
            </div>

            {/* Platform filter */}
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            >
              <option value="all">Semua Saluran</option>
              <option value="TikTok Ads">TikTok Ads</option>
              <option value="Instagram">Instagram</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Meta Ads">Meta Ads</option>
              <option value="Google Search">Google Search</option>
              <option value="Affiliate Collab">Afiliasi Kreator</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4 font-semibold">Kampanye & Saluran</th>
                <th className="py-3 px-3 font-semibold text-right">Biaya Iklan</th>
                <th className="py-3 px-3 font-semibold text-right">Klik & CPC</th>
                <th className="py-3 px-3 font-semibold text-right">Konversi</th>
                <th className="py-3 px-3 font-semibold text-right">Omzet Atribusi</th>
                <th className="py-3 px-3 font-semibold text-right">ROAS</th>
                <th className="py-3 px-3 font-semibold text-right">CAC</th>
                <th className="py-3 px-4 font-semibold text-center">Status & Rekomendasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredCampaigns.map((camp) => {
                const attr = camp.attribution[attributionModel];

                return (
                  <tr
                    key={camp.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Campaign name */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {camp.name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {camp.platform}
                        </span>
                        <span>·</span>
                        <span className="font-mono">{camp.utmCampaign}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-xs">
                        {camp.targetAudience}
                      </div>
                    </td>

                    {/* Spend */}
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-900 dark:text-white font-medium">
                      Rp {camp.spend.toLocaleString('id-ID')}
                    </td>

                    {/* Clicks & CPC */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {camp.clicks.toLocaleString('id-ID')} klik
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        CPC: Rp {camp.cpc.toLocaleString('id-ID')}
                      </div>
                    </td>

                    {/* Conversions */}
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums font-bold text-indigo-600 dark:text-indigo-400">
                      {attr.conversions} tx
                    </td>

                    {/* Attributed Revenue */}
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      Rp {attr.revenue.toLocaleString('id-ID')}
                    </td>

                    {/* ROAS */}
                    <td className="py-3.5 px-3 text-right">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          attr.roas >= 10
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                            : attr.roas >= 5
                            ? 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300'
                            : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {attr.roas.toFixed(2)}x
                      </span>
                    </td>

                    {/* CAC */}
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      Rp {attr.cac.toLocaleString('id-ID')}
                    </td>

                    {/* Status & Recommendation */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                          camp.recommendation.includes('Scale Up')
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : camp.recommendation.includes('Optimal')
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                        }`}
                      >
                        {camp.recommendation}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Touchpoint Customer Journeys Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Multi-Touch Journeys */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Rute Perjalanan Konversi (Customer Journey Paths)
              </h3>
            </div>
            <span className="text-xs text-slate-400">Rata-rata 2.4 sentuhan</span>
          </div>

          <div className="space-y-3">
            {INITIAL_TOUCHPOINT_JOURNEYS.map((journey, idx) => (
              <div
                key={journey.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 text-xs space-y-2"
              >
                <div className="flex flex-wrap items-center gap-1.5 font-medium">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                    #{idx + 1}
                  </span>
                  {journey.path.map((step, sIdx) => (
                    <React.Fragment key={sIdx}>
                      <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-slate-800 dark:text-slate-200 font-semibold shadow-2xs">
                        {step}
                      </span>
                      {sIdx < journey.path.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  <span>
                    <strong>{journey.conversionsCount} Transaksi</strong> ({journey.percentageOfTotal}%)
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    Rp {journey.totalRevenue.toLocaleString('id-ID')}
                  </span>
                  <span>Waktu Konversi: {journey.avgDaysToConvert} hari</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Reallocation Simulator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Simulator Optimasi Anggaran Iklan (AI Budget Reallocator)
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pindahkan porsi anggaran dari kampanye dengan CAC tinggi ke saluran berefisiensi tinggi (TikTok Ads & Afiliasi) untuk memaksimalkan omzet tanpa menambah total biaya.
            </p>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  <span>Porsi Anggaran yang Dialihkan ke Saluran Top-ROAS:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                    {budgetShiftPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={budgetShiftPercent}
                  onChange={(e) => {
                    setBudgetShiftPercent(Number(e.target.value));
                    setIsSimulatorApplied(true);
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Proyeksi Kenaikan Omzet</span>
                  <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +Rp {(18500000 * (budgetShiftPercent / 20)).toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Proyeksi Peningkatan ROAS</span>
                  <span className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400">
                    +{(0.95 * (budgetShiftPercent / 20)).toFixed(2)}x
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Rekomendasi Strategis:
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-indigo-800 dark:text-indigo-300">
                <li>Naikkan budget <strong>TikTok Mega Viral</strong> sebesar +Rp 2.000.000/bln</li>
                <li>Tingkatkan komisi kreator <strong>Micro Influencer Affiliate</strong> dari 10% ke 15%</li>
                <li>Fokuskan Meta Ads khusus untuk <em>Retargeting Abandoned Cart</em></li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setBudgetShiftPercent(20);
                setIsSimulatorApplied(!isSimulatorApplied);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Simulasi</span>
            </button>

            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Simulasi Real-time Siap Diekspor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
