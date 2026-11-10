import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { TrackedLink, ClickEvent } from '../types';
import { ExternalLink, CheckCircle2, ArrowRight, Activity, ShieldCheck } from 'lucide-react';

interface LinkRedirectViewProps {
  slug: string;
  onReturnToDashboard: () => void;
}

export const LinkRedirectView: React.FC<LinkRedirectViewProps> = ({ slug, onReturnToDashboard }) => {
  const { links, recordClick } = useAnalytics();
  const [countdown, setCountdown] = useState(3);
  const [recordedEvent, setRecordedEvent] = useState<ClickEvent | null>(null);

  const targetLink = links.find((l) => l.slug.toLowerCase() === slug.toLowerCase()) || links[0];
  const hasRecordedRef = React.useRef(false);

  useEffect(() => {
    // Record real visitor click once on mount
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
  }, [slug]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 sm:p-8 text-center">
        {/* Animated Radar Pulse */}
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4 relative">
          <Activity className="w-8 h-8 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Klik Berhasil Dicatat Real-Time</span>
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          Mengarahkan Anda ke Tujuan...
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Tautan ini dipantau oleh PulseTrack Analytics untuk {targetLink?.platform}.
        </p>

        {/* Link Details Card */}
        <div className="my-5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-left border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
          <div>
            <span className="text-slate-400 text-[11px]">Judul Tautan:</span>
            <div className="font-semibold text-slate-900 dark:text-white">{targetLink?.title}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[11px]">Tujuan:</span>
            <div className="font-mono text-indigo-600 dark:text-indigo-400 truncate font-medium">
              {targetLink?.destinationUrl}
            </div>
          </div>
          {recordedEvent && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>Perangkat Anda: <strong>{recordedEvent.device} ({recordedEvent.os})</strong></span>
              <span className="font-mono">{recordedEvent.ipSnippet}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <a
            href={targetLink?.destinationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            <span>Buka Website Tujuan ({countdown > 0 ? `${countdown}s` : 'Sekarang'})</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={onReturnToDashboard}
            className="w-full py-2.5 px-4 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Kembali ke Dashboard & Lihat Log Klik Anda
          </button>
        </div>
      </div>
    </div>
  );
};
