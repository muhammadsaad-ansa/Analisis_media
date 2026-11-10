/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTrafficAlert } from '../context/TrafficAlertContext';
import { useAnalytics } from '../context/AnalyticsContext';
import {
  Bell,
  Mail,
  Zap,
  Flame,
  Sliders,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  Volume2
} from 'lucide-react';

export const TrafficSpikeWidget: React.FC = () => {
  const {
    rules,
    incidents,
    unreadIncidentsCount,
    browserPermission,
    soundEnabled,
    openAlertModal,
    simulateSpikeBurst,
  } = useTrafficAlert();
  const { links } = useAnalytics();

  const activeRulesCount = rules.filter((r) => r.isActive).length;
  const latestIncident = incidents[0];

  const handleSimulateQuickSpike = () => {
    simulateSpikeBurst(links[0]?.id, 25);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden transition-all">
      {/* Top background accent */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-rose-500/10 via-amber-500/5 to-transparent pointer-events-none rounded-bl-full" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left summary */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-600 via-amber-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-rose-500/20">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pemantau Lonjakan Trafik & Ambang Batas Notifikasi
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Aktif Memantau
              </span>
            </div>

            <p className="text-xs text-slate-500 max-w-xl">
              Terima notifikasi seketika via <strong>Web Browser Push</strong> dan <strong>Email</strong> saat tautan medsos Anda mengalami lonjakan klik tidak wajar atau mendadak viral.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-semibold">{activeRulesCount} Aturan Aktif</span>
              </div>

              <span>·</span>

              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-indigo-500" />
                <span
                  className={`text-[11px] font-semibold ${
                    browserPermission === 'granted'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  Browser Push: {browserPermission === 'granted' ? 'Siap' : 'Perlu Izin'}
                </span>
              </div>

              <span>·</span>

              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Mail className="w-3.5 h-3.5 text-violet-500" />
                <span className="text-[11px] font-mono">Email Alert: Aktif</span>
              </div>

              {soundEnabled && (
                <>
                  <span>·</span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Volume2 className="w-3 h-3 text-emerald-500" />
                    <span>Chime Suara</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleSimulateQuickSpike}
            className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Simulasikan +25 klik mendadak dalam 1 menit"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>⚡ Uji Lonjakan Trafik</span>
          </button>

          <button
            onClick={() => openAlertModal('rules')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Atur Ambang Batas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Latest Incident Banner if available */}
      {latestIncident && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span className="text-slate-500">Insiden Lonjakan Terbaru:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-xs">
              {latestIncident.linkTitle}
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              ({latestIncident.clickCount} klik / {latestIncident.timeWindowMinutes}m)
            </span>
          </div>

          <button
            onClick={() => openAlertModal('history')}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 shrink-0"
          >
            <span>Lihat Riwayat & Notifikasi ({incidents.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
