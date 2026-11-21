/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { useAuth } from '../context/AuthContext';
import { TrackedLink, ClickEvent } from '../types';
import { ExternalLink, CheckCircle2, ArrowRight, Activity, ShieldCheck, CreditCard, Wallet } from 'lucide-react';

interface LinkRedirectViewProps {
  slug: string;
  onReturnToDashboard: () => void;
}

export const LinkRedirectView: React.FC<LinkRedirectViewProps> = ({ slug, onReturnToDashboard }) => {
  const { links, recordClick } = useAnalytics();
  const { openPaymentModal } = useAuth();
  const [recordedEvent, setRecordedEvent] = useState<ClickEvent | null>(null);

  const targetLink = links.find((l) => l.slug.toLowerCase() === slug.toLowerCase()) || links[0];
  const hasRecordedRef = React.useRef(false);

  useEffect(() => {
    if (hasRecordedRef.current) return;
    if (!targetLink) return;

    hasRecordedRef.current = true;
    const isMobile = window.innerWidth <= 768;
    const userAgent = navigator.userAgent;
    const os = userAgent.includes('iPhone') || userAgent.includes('iPad')
      ? 'iOS'
      : userAgent.includes('Android')
      ? 'Android'
      : userAgent.includes('Mac')
      ? 'macOS'
      : 'Windows';

    const browser = userAgent.includes('Instagram')
      ? 'Instagram In-App Browser'
      : userAgent.includes('TikTok')
      ? 'TikTok In-App Browser'
      : userAgent.includes('Safari') && !userAgent.includes('Chrome')
      ? 'Safari Mobile'
      : 'Chrome';

    const evt = recordClick(targetLink.slug, {
      platform: targetLink.platform,
      device: isMobile ? 'Mobile' : 'Desktop',
      os,
      browser,
      city: 'Jakarta',
      country: 'Indonesia',
      countryCode: 'ID',
    });

    if (evt) {
      setRecordedEvent(evt);
    }

    // Automatically open payment dashboard modal when link is clicked!
    const timer = setTimeout(() => {
      openPaymentModal();
    }, 500);
    return () => clearTimeout(timer);
  }, [slug]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto relative">
          <CreditCard className="w-8 h-8 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Tautan Diterima & Terverifikasi Real-Time</span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Mengalihkan ke Dasbor Pembayaran & Aktivasi Member...
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Anda mengklik tautan dari <strong className="text-slate-800 dark:text-slate-200">{targetLink?.platform}</strong> ({targetLink?.title}). Silakan lanjutkan ke dasbor pembayaran resmi.
          </p>
        </div>

        {/* Link Info Box */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-left border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">Tujuan Kampanye:</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">/r/{targetLink?.slug}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">Biaya Langganan VIP:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Rp 60.000 / bln</span>
          </div>
          {recordedEvent && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>{recordedEvent.device} ({recordedEvent.os})</span>
              <span>{recordedEvent.ipSnippet}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={openPaymentModal}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            <span>Buka Dasbor Pembayaran Sekarang</span>
          </button>

          <button
            onClick={onReturnToDashboard}
            className="w-full py-2.5 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Kembali ke Beranda / Dashboard Utama
          </button>
        </div>
      </div>
    </div>
  );
};
