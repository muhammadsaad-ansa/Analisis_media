/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { useTrafficAlert } from '../context/TrafficAlertContext';
import { 
  RotateCcw, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Database, 
  MousePointerClick, 
  Link2, 
  Video, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface ResetAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetAnalyticsModal: React.FC<ResetAnalyticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { links, videos, clickEvents, resetAnalytics } = useAnalytics();
  const { clearIncidents } = useTrafficAlert();

  const [selectedMode, setSelectedMode] = useState<'clicks_only' | 'restore_defaults' | 'all'>('clicks_only');
  const [confirmInput, setConfirmInput] = useState('');
  const [resetDoneNotice, setResetDoneNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecuteReset = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedMode === 'all' && confirmInput.trim().toUpperCase() !== 'RESET') {
      return;
    }

    if (selectedMode === 'clicks_only') {
      resetAnalytics('clicks_only');
      clearIncidents();
      setResetDoneNotice('Semua catatan klik analitik berhasil dikosongkan! Tautan Anda kini bersih dari 0 klik.');
    } else if (selectedMode === 'restore_defaults') {
      resetAnalytics('restore_defaults');
      setResetDoneNotice('Data bawaan demo berhasil dipulihkan lengkap dengan tautan, video, dan klik contoh.');
    } else if (selectedMode === 'all') {
      resetAnalytics('all');
      clearIncidents();
      setResetDoneNotice('Pembersihan total berhasil dilakukan.');
    }

    setTimeout(() => {
      setResetDoneNotice(null);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reset & Pulihkan Data Analitik
              </h3>
              <p className="text-xs text-slate-500">
                Pilih metode reset untuk membersihkan atau memulihkan data platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Storage Summary */}
        <div className="p-4 bg-slate-100/70 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px]">Tautan Tersimpan</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
              {links.length} Tautan
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px]">Vidio Terlacak</span>
            <span className="font-mono font-bold text-pink-600 dark:text-pink-400 text-sm">
              {videos.length} Vidio
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px]">Log Event Klik</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {clickEvents.length} Event
            </span>
          </div>
        </div>

        {/* Form Options */}
        <form onSubmit={handleExecuteReset} className="p-5 space-y-4">
          <div className="space-y-2.5">
            {/* Mode 1: Clicks Only */}
            <label
              className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedMode === 'clicks_only'
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="resetMode"
                  checked={selectedMode === 'clicks_only'}
                  onChange={() => setSelectedMode('clicks_only')}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MousePointerClick className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Kosongkan Log Klik Saja (Mulai dari Nol)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Mereset hitungan total klik dan pengunjung unik ke 0, tetapi tautan dan video yang sudah Anda buat tetap aman.
                  </p>
                </div>
              </div>
            </label>

            {/* Mode 2: Restore Defaults */}
            <label
              className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedMode === 'restore_defaults'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="resetMode"
                  checked={selectedMode === 'restore_defaults'}
                  onChange={() => setSelectedMode('restore_defaults')}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Pulihkan Data Contoh Bawaan (Restore Sample Defaults)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Mengembalikan seluruh tautan medsos, video contoh, dan data analitik demo awal untuk simulasi presentasi.
                  </p>
                </div>
              </div>
            </label>

            {/* Mode 3: Factory Reset All */}
            <label
              className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedMode === 'all'
                  ? 'border-rose-600 bg-rose-50/70 dark:bg-rose-950/40 ring-1 ring-rose-500'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="resetMode"
                  checked={selectedMode === 'all'}
                  onChange={() => setSelectedMode('all')}
                  className="mt-0.5 text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <div className="text-xs font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Pembersihan Total Pabrik (Factory Clean)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Menghapus seluruh penyimpanan cache browser. Semua riwayat, insiden, dan klik akan diatur ulang.
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Confirmation input if mode === all */}
          {selectedMode === 'all' && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 space-y-1.5 text-xs">
              <span className="font-bold text-rose-900 dark:text-rose-200 block">
                Konfirmasi Keamanan:
              </span>
              <p className="text-[11px] text-rose-700 dark:text-rose-300">
                Ketik kata <strong>RESET</strong> di bawah ini untuk melanjutkan pembersihan total:
              </p>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="Ketik RESET"
                className="w-full bg-white dark:bg-slate-900 border border-rose-400 dark:border-rose-700 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>
          )}

          {resetDoneNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{resetDoneNotice}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={selectedMode === 'all' && confirmInput.trim().toUpperCase() !== 'RESET'}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Jalankan Reset Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
