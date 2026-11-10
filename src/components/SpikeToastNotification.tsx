/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTrafficAlert } from '../context/TrafficAlertContext';
import { AlertTriangle, Bell, Mail, ExternalLink, X, ArrowUpRight, Flame } from 'lucide-react';

export const SpikeToastNotification: React.FC = () => {
  const { activeToast, dismissToast, openAlertModal } = useTrafficAlert();

  if (!activeToast) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div className="bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-md text-white border-2 border-rose-500/80 rounded-2xl shadow-2xl p-4 overflow-hidden relative">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-500" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shrink-0 shadow-md">
              <Flame className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider bg-rose-950/70 px-2 py-0.5 rounded-full border border-rose-800/60">
                  Lonjakan Trafik Tinggi
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(activeToast.triggeredAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5 line-clamp-1">
                {activeToast.linkTitle}
              </h4>
            </div>
          </div>

          <button
            onClick={dismissToast}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 bg-slate-950/70 rounded-xl p-2.5 border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Trafik Masuk:</span>
            <span className="font-bold text-emerald-400 font-mono">
              {activeToast.clickCount} klik / {activeToast.timeWindowMinutes} menit
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Ambang Batas Aturan:</span>
            <span className="text-slate-300 font-medium">
              &gt; {activeToast.thresholdClicks} klik ({activeToast.ruleName})
            </span>
          </div>
          {activeToast.surgeVelocity && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Kecepatan Lonjakan:</span>
              <span className="text-amber-400 font-semibold">{activeToast.surgeVelocity}</span>
            </div>
          )}
        </div>

        {/* Channels notified */}
        <div className="mt-2.5 flex items-center gap-2 text-[11px]">
          <span className="text-slate-400">Terkirim ke:</span>
          {activeToast.channelsNotified.includes('browser') && (
            <span className="inline-flex items-center gap-1 bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
              <Bell className="w-3 h-3 text-indigo-400" />
              Browser Push
            </span>
          )}
          {activeToast.channelsNotified.includes('email') && (
            <span className="inline-flex items-center gap-1 bg-violet-950 text-violet-300 px-2 py-0.5 rounded border border-violet-800">
              <Mail className="w-3 h-3 text-violet-400" />
              Email Alert
            </span>
          )}
        </div>

        {/* Action footer */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
          <a
            href={`/r/${activeToast.linkSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
          >
            <span>Buka /r/{activeToast.linkSlug}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => {
              dismissToast();
              openAlertModal('history');
            }}
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-lg transition-colors shadow-xs"
          >
            Kelola Ambang Batas
          </button>
        </div>
      </div>
    </div>
  );
};
