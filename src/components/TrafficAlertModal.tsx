/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTrafficAlert } from '../context/TrafficAlertContext';
import { useAnalytics } from '../context/AnalyticsContext';
import { useAuth } from '../context/AuthContext';
import { SpikeWindowMinutes, TrafficAlertRule } from '../types';
import { playSpikeChime } from '../utils/notificationUtils';
import {
  Bell,
  Mail,
  Zap,
  Sliders,
  History,
  ShieldCheck,
  AlertTriangle,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  ExternalLink,
  Flame,
  ArrowUpRight,
  Send,
  RotateCcw,
  Clock,
  Sparkles
} from 'lucide-react';

export const TrafficAlertModal: React.FC = () => {
  const {
    isAlertModalOpen,
    closeAlertModal,
    rules,
    incidents,
    unreadIncidentsCount,
    browserPermission,
    soundEnabled,
    setSoundEnabled,
    activeModalTab,
    setActiveModalTab,
    addRule,
    deleteRule,
    toggleRule,
    requestPermission,
    triggerTestPushNotification,
    triggerTestEmailAlert,
    markAllAsRead,
    clearIncidents,
    simulateSpikeBurst,
  } = useTrafficAlert();

  const { links } = useAnalytics();
  const { user } = useAuth();

  // Create rule form states
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [selectedLinkId, setSelectedLinkId] = useState<string>('all');
  const [thresholdClicks, setThresholdClicks] = useState<number>(25);
  const [timeWindow, setTimeWindow] = useState<SpikeWindowMinutes>(5);
  const [enableBrowserPush, setEnableBrowserPush] = useState<boolean>(true);
  const [enableEmail, setEnableEmail] = useState<boolean>(true);
  const [recipientEmail, setRecipientEmail] = useState<string>(
    user?.email || 'nisaad1526@gmail.com'
  );
  const [cooldownMinutes, setCooldownMinutes] = useState<number>(15);

  // Testing burst state
  const [testLinkId, setTestLinkId] = useState<string>('all');
  const [burstSuccessNotice, setBurstSuccessNotice] = useState<string | null>(null);

  if (!isAlertModalOpen) return null;

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    addRule({
      name: ruleName.trim(),
      linkId: selectedLinkId,
      thresholdClicks: Number(thresholdClicks) || 20,
      timeWindowMinutes: timeWindow,
      enableBrowserPush,
      enableEmail,
      recipientEmail: recipientEmail.trim() || 'nisaad1526@gmail.com',
      cooldownMinutes: Number(cooldownMinutes) || 15,
      isActive: true,
    });

    setIsAddingRule(false);
    setRuleName('');
    setThresholdClicks(25);
  };

  const handleSimulateBurst = () => {
    const targetId = testLinkId === 'all' ? (links[0]?.id || '') : testLinkId;
    simulateSpikeBurst(targetId, 25);
    const linkObj = links.find((l) => l.id === targetId) || links[0];
    setBurstSuccessNotice(`⚡ Berhasil menyimulasikan +25 klik lonjakan cepat pada "${linkObj?.title || 'Tautan'}"! Ambang batas sedang dievaluasi.`);
    setTimeout(() => setBurstSuccessNotice(null), 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Pengaturan Ambang Batas Lonjakan Trafik
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  Radar Otomatis
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kirim pemberitahuan instan via Web Browser Push & Email saat klik melampaui batas normal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playSpikeChime();
              }}
              title={soundEnabled ? 'Matikan suara chime' : 'Hidupkan suara chime'}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>
            <button
              onClick={closeAlertModal}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Testing Bar */}
        <div className="px-5 py-3 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border-b border-amber-200/40 dark:border-amber-900/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 animate-bounce" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Uji Coba Cepat Sistem Ambang Batas:
            </span>
            <select
              value={testLinkId}
              onChange={(e) => setTestLinkId(e.target.value)}
              className="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200"
            >
              <option value="all">Semua Tautan (Acak)</option>
              {links.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title} (/r/{l.slug})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateBurst}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ Simulasikan Lonjakan (+25 Klik)</span>
            </button>
          </div>
        </div>

        {burstSuccessNotice && (
          <div className="mx-5 mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{burstSuccessNotice}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveModalTab('rules')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeModalTab === 'rules'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Aturan Ambang Batas ({rules.length})</span>
          </button>

          <button
            onClick={() => setActiveModalTab('channels')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeModalTab === 'channels'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Saluran Notifikasi (Browser & Email)</span>
          </button>

          <button
            onClick={() => setActiveModalTab('history')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeModalTab === 'history'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Riwayat Lonjakan ({incidents.length})</span>
            {unreadIncidentsCount > 0 && (
              <span className="bg-rose-500 text-white font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {unreadIncidentsCount}
              </span>
            )}
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: RULES */}
          {activeModalTab === 'rules' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Daftar Aturan Pemantau Lonjakan Klik
                  </h4>
                  <p className="text-xs text-slate-500">
                    Sistem akan secara berkala menganalisis klik real-time dan menembakkan notifikasi saat melampaui batas
                  </p>
                </div>
                {!isAddingRule && (
                  <button
                    onClick={() => setIsAddingRule(true)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Aturan Baru</span>
                  </button>
                )}
              </div>

              {/* Add Rule Form */}
              {isAddingRule && (
                <form
                  onSubmit={handleCreateRule}
                  className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 space-y-4 animate-in fade-in duration-150"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                      Konfigurasi Ambang Batas Baru
                    </h5>
                    <button
                      type="button"
                      onClick={() => setIsAddingRule(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Nama Aturan Peringatan:
                      </label>
                      <input
                        type="text"
                        required
                        value={ruleName}
                        onChange={(e) => setRuleName(e.target.value)}
                        placeholder="Contoh: Lonjakan Flash Sale Instagram"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Tautan yang Dipantau:
                      </label>
                      <select
                        value={selectedLinkId}
                        onChange={(e) => setSelectedLinkId(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                      >
                        <option value="all">🌐 Semua Tautan (Global Monitoring)</option>
                        {links.map((link) => (
                          <option key={link.id} value={link.id}>
                            {link.title} ({link.platform} · /r/{link.slug})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Batas Ambang Klik (Threshold):
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-bold">&gt;</span>
                        <input
                          type="number"
                          min="3"
                          max="5000"
                          required
                          value={thresholdClicks}
                          onChange={(e) => setThresholdClicks(Number(e.target.value))}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                        />
                        <span className="text-slate-500 font-medium whitespace-nowrap">Klik</span>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Jendela Waktu Deteksi:
                      </label>
                      <select
                        value={timeWindow}
                        onChange={(e) => setTimeWindow(Number(e.target.value) as SpikeWindowMinutes)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                      >
                        <option value={1}>1 Menit Terakhir (Deteksi Instan / Ultra Kilat)</option>
                        <option value={5}>5 Menit Terakhir (Direkomendasikan untuk Flash Sale)</option>
                        <option value={15}>15 Menit Terakhir (Video Viral & Tren)</option>
                        <option value={30}>30 Menit Terakhir (Trafik Jam Sibuk)</option>
                        <option value={60}>1 Jam Terakhir (Volume Harian)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email Penerima Notifikasi:
                      </label>
                      <input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="nisaad1526@gmail.com"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Jeda Cooldown Antar Notifikasi:
                      </label>
                      <select
                        value={cooldownMinutes}
                        onChange={(e) => setCooldownMinutes(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                      >
                        <option value={5}>5 Menit (Cepat)</option>
                        <option value={10}>10 Menit</option>
                        <option value={15}>15 Menit (Direkomendasikan)</option>
                        <option value={30}>30 Menit</option>
                        <option value={60}>60 Menit</option>
                      </select>
                    </div>
                  </div>

                  {/* Channel toggles in form */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enableBrowserPush}
                          onChange={(e) => setEnableBrowserPush(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <Bell className="w-3.5 h-3.5 text-indigo-500" />
                          Web Browser Push
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enableEmail}
                          onChange={(e) => setEnableEmail(e.target.checked)}
                          className="rounded text-violet-600 focus:ring-violet-500 w-4 h-4"
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-violet-500" />
                          Email Notification
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingRule(false)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        Simpan Aturan
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Rules List */}
              <div className="space-y-2.5">
                {rules.map((rule) => {
                  const targetLink =
                    rule.linkId === 'all'
                      ? null
                      : links.find((l) => l.id === rule.linkId);

                  return (
                    <div
                      key={rule.id}
                      className={`p-4 rounded-xl border transition-all ${
                        rule.isActive
                          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/60 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                rule.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                              }`}
                            />
                            <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                              {rule.name}
                            </h5>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {rule.linkId === 'all' ? '🌐 Semua Tautan' : `🔗 ${targetLink?.title || 'Tautan Spesifik'}`}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                              &gt; {rule.thresholdClicks} klik / {rule.timeWindowMinutes} menit
                            </span>
                            <span>·</span>
                            <span>Cooldown: {rule.cooldownMinutes}m</span>
                            <span>·</span>
                            <div className="flex items-center gap-1.5">
                              {rule.enableBrowserPush && (
                                <span className="inline-flex items-center gap-1 text-[11px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded">
                                  <Bell className="w-3 h-3" /> Push
                                </span>
                              )}
                              {rule.enableEmail && (
                                <span className="inline-flex items-center gap-1 text-[11px] bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 px-1.5 py-0.2 rounded">
                                  <Mail className="w-3 h-3" /> {rule.recipientEmail}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleRule(rule.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              rule.isActive
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {rule.isActive ? 'Aktif' : 'Nonaktif'}
                          </button>

                          <button
                            onClick={() => deleteRule(rule.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Hapus Aturan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CHANNELS */}
          {activeModalTab === 'channels' && (
            <div className="space-y-5">
              {/* Channel 1: Browser Web Push Notifications */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Web Browser Push Notifications
                      </h4>
                      <p className="text-xs text-slate-500">
                        Notifikasi melayang langsung di pojok layar sistem operasi/browser Anda saat lonjakan klik terjadi
                      </p>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        browserPermission === 'granted'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : browserPermission === 'denied'
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                      }`}
                    >
                      {browserPermission === 'granted'
                        ? '✓ Izin Diaktifkan'
                        : browserPermission === 'denied'
                        ? '✕ Izin Ditolak Browser'
                        : 'Belum Diberikan Izin'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-slate-500">
                    {browserPermission === 'granted' ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        Browser sudah siap menerima push notification secara native.
                      </span>
                    ) : (
                      <span>
                        Klik tombol izin untuk mengizinkan Chrome / Safari / Firefox mengirimkan notifikasi.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {browserPermission !== 'granted' && (
                      <button
                        onClick={() => requestPermission()}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors"
                      >
                        Izinkan Notifikasi Browser
                      </button>
                    )}
                    <button
                      onClick={() => triggerTestPushNotification()}
                      className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 font-medium transition-colors"
                    >
                      Uji Kirim Push Notif
                    </button>
                  </div>
                </div>
              </div>

              {/* Channel 2: Email Notifications */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Email Spike Alert Dispatcher
                      </h4>
                      <p className="text-xs text-slate-500">
                        Pemberitahuan resmi terformat HTML dengan ringkasan klik, platform dominan, dan tautan tujuan
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-800">
                    Otomatis Aktif
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Email Sasaran Pengiriman:</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                      {user?.email || 'nisaad1526@gmail.com'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Format Template:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      PulseTrack Responsive Executive HTML Alert
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-500">
                    Dilengkapi proteksi anti-spam cooldown otomatis agar inbox Anda tetap rapi.
                  </span>
                  <button
                    onClick={() => triggerTestEmailAlert()}
                    className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Lihat & Uji Kirim Email</span>
                  </button>
                </div>
              </div>

              {/* Sound & Chime Options */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Nada Peringatan Audio Chime (Web Audio Synthesizer)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Membunyikan nada ping berfrekuensi dua-nada (880Hz → 1318Hz) saat ambang batas terlampaui
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playSpikeChime()}
                    className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Tes Bunyi
                  </button>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      soundEnabled
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {soundEnabled ? 'Aktif' : 'Mati'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INCIDENTS HISTORY */}
          {activeModalTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Catatan Insiden Lonjakan Trafik
                  </h4>
                  <p className="text-xs text-slate-500">
                    Daftar lonjakan klik yang pernah memicu aturan ambang batas
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {unreadIncidentsCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 font-medium"
                    >
                      Tandai Dibaca
                    </button>
                  )}
                  {incidents.length > 0 && (
                    <button
                      onClick={clearIncidents}
                      className="px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg font-medium transition-colors"
                    >
                      Bersihkan Riwayat
                    </button>
                  )}
                </div>
              </div>

              {incidents.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <Flame className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Belum ada insiden lonjakan trafik yang tercatat
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Gunakan tombol "Simulasikan Lonjakan (+25 Klik)" di atas untuk menguji coba
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {incidents.map((inc) => (
                    <div
                      key={inc.id}
                      className={`p-3.5 rounded-xl border transition-colors ${
                        !inc.isRead
                          ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                              {inc.linkTitle}
                            </h5>
                            <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                              /r/{inc.linkSlug}
                            </span>
                            {inc.surgeVelocity && (
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.2 rounded">
                                {inc.surgeVelocity}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                              {inc.clickCount} klik dalam {inc.timeWindowMinutes}m
                            </span>
                            <span>(Ambang: &gt;{inc.thresholdClicks})</span>
                            <span>·</span>
                            <span>Aturan: {inc.ruleName}</span>
                            <span>·</span>
                            <span>
                              {new Date(inc.triggeredAt).toLocaleString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-[11px]">
                            {inc.channelsNotified.includes('browser') && (
                              <span className="p-1 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400" title="Browser Push Terkirim">
                                <Bell className="w-3.5 h-3.5" />
                              </span>
                            )}
                            {inc.channelsNotified.includes('email') && (
                              <span className="p-1 rounded bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400" title={`Email ke ${inc.recipientEmail}`}>
                                <Mail className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>

                          <a
                            href={`/r/${inc.linkSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg"
                            title="Buka Tautan"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Semua konfigurasi tersimpan aman di peramban pengguna</span>
          </div>

          <button
            onClick={closeAlertModal}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
