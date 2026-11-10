/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTrafficAlert } from '../context/TrafficAlertContext';
import { generateEmailHtmlTemplate } from '../utils/notificationUtils';
import { Mail, Send, CheckCircle2, Copy, X, ExternalLink, ShieldCheck } from 'lucide-react';

export const EmailAlertPreviewModal: React.FC = () => {
  const { emailPreviewData, closeEmailPreview } = useTrafficAlert();
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!emailPreviewData) return null;

  const htmlContent = generateEmailHtmlTemplate(emailPreviewData);

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResend = () => {
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pratinjau Pengiriman Email Lonjakan Trafik
              </h3>
              <p className="text-xs text-slate-500">
                Format email otomatis yang dikirimkan ke kotak masuk pengguna
              </p>
            </div>
          </div>
          <button
            onClick={closeEmailPreview}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Metadata */}
        <div className="p-4 bg-slate-100/70 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-xs space-y-1.5 font-sans">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 w-16">Kepada:</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
              {emailPreviewData.recipient}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium ml-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 w-16">Subjek:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {emailPreviewData.subject}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 w-16">Pengirim:</span>
            <span className="text-slate-600 dark:text-slate-400">
              PulseTrack Spike Dispatcher &lt;alerts@pulsetrack.io&gt;
            </span>
          </div>
        </div>

        {/* Rendered Email Body in Iframe */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950">
          <iframe
            title="Email Preview"
            srcDoc={htmlContent}
            className="w-full h-96 rounded-xl border border-slate-800 bg-slate-900 shadow-inner"
          />
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyHtml}
            className="px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>HTML Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Template HTML</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResend}
              className="px-4 py-2 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              {sentSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Email Berhasil Dikirimkan!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Ulang Notifikasi Email</span>
                </>
              )}
            </button>

            <button
              onClick={closeEmailPreview}
              className="px-4 py-2 text-xs font-medium bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
