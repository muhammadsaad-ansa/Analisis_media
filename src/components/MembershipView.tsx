import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Crown, 
  CheckCircle2, 
  Sparkles, 
  CreditCard, 
  Copy, 
  Check, 
  Calendar, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Share2,
  Lock,
  Unlock,
  RefreshCw
} from 'lucide-react';

import { useAnalytics } from '../context/AnalyticsContext';

export const MembershipView: React.FC = () => {
  const { user, isMember, isAdmin, openPaymentModal } = useAuth();
  const { setActiveTab } = useAnalytics();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
              Keanggotaan & Berlangganan
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Status Mode Member & Langganan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola paket langganan Rp 60.000 / bulan dan nikmati fitur analitik profesional serta program afiliasi komisi Rp 10.000.
          </p>
        </div>

        {/* Membership Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={openPaymentModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Instruksi Transfer & Perpanjangan</span>
          </button>
        </div>
      </div>

      {/* Active Membership Status Card */}
      <div className={`p-6 rounded-3xl border shadow-sm transition-all ${
        isAdmin
          ? 'bg-gradient-to-r from-violet-600/15 via-indigo-600/15 to-purple-600/15 border-violet-400 dark:border-violet-600/60'
          : 'bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-rose-500/10 border-amber-300 dark:border-amber-700/60'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
              isAdmin
                ? 'bg-violet-100 dark:bg-violet-950/80 text-violet-800 dark:text-violet-300 border-violet-300 dark:border-violet-700'
                : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
            }`}>
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <span>AKUN SUPER ADMIN (100% GRATIS SEUMUR HIDUP)</span>
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>MEMBER VIP AKTIF (Rp 60.000 / Bulan)</span>
                </>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isAdmin 
                ? 'Hak Akses Super Admin Terbuka Penuh & Bebas Biaya' 
                : 'Seluruh Fitur Profesional & Afiliasi Terbuka Penuh'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {isAdmin
                ? `Akun pribadi Anda (${user?.email}) memiliki lisensi Master Administrator gratis seumur hidup. Seluruh fitur profesional, tautan medsos, analitik vidio, pencatatan uang pribadi, analis saham, dan penarikan komisi ke Bank BSI (7373448995) aktif tanpa jatuh tempo.`
                : 'Langganan Anda aktif. Anda dapat melacak tautan tanpa batas, memantau detik puncak klik vidio Reels/TikTok, ekspor laporan CSV/PDF, dan berhak mendapatkan komisi Rp 10.000 per referral di Program Afiliasi Juara.'}
            </p>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-700 dark:text-slate-300 pt-2">
              <span className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-4 h-4 text-indigo-500" />
                Masa Aktif: <strong>{isAdmin ? 'Permanen / Seumur Hidup (Gratis)' : '30 November 2026'}</strong>
              </span>
              <span className="text-slate-400">·</span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                {isAdmin ? 'Super Admin Terverifikasi' : 'Status Otomatis Diperbarui'}
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-2.5">
            {isAdmin ? (
              <button
                onClick={() => setActiveTab('admin')}
                className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-2xl shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Buka Panel Admin Utama</span>
              </button>
            ) : !isMember ? (
              <button
                onClick={openPaymentModal}
                className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade Member (Rp 60rb/bln)</span>
              </button>
            ) : (
              <button
                onClick={openPaymentModal}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-2xl shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <CreditCard className="w-4 h-4" />
                <span>Lihat Rekening / Perpanjang</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Official Payment Account Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-500" />
              <span>Instruksi Pembayaran Resmi Keanggotaan Member</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pembayaran resmi dapat ditransfer melalui Bank Syariah Indonesia (BSI) atau transfer antarbank dari bank mana saja di Indonesia
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-md">
            Rp 60.000 / bln
          </span>
        </div>

        {/* BSI Official Bank Account */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50/70 via-slate-50 to-indigo-50/50 dark:from-teal-950/40 dark:via-slate-800/60 dark:to-indigo-950/40 border border-teal-200/80 dark:border-teal-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-100/70 dark:bg-teal-950/80 px-2.5 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                Bank Syariah Indonesia (BSI) - Rekening Resmi
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Kode Bank: 451</span>
            </div>
            <div className="text-[11px] text-slate-500">Nomor Rekening Pembayaran Resmi:</div>
            <div className="text-2xl font-mono font-black text-slate-900 dark:text-white tracking-wider flex items-center gap-3">
              <span>7373448995</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Atas Nama: <strong className="text-slate-800 dark:text-slate-200">PulseTrack Official / Rekening Pembayaran</strong>
            </div>
          </div>

          <button
            onClick={() => handleCopy('7373448995', 'bsi')}
            className="self-start sm:self-center flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-teal-700 dark:text-teal-200 bg-white dark:bg-teal-950/80 hover:bg-teal-50 dark:hover:bg-teal-900/50 border border-teal-300 dark:border-teal-700 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            {copiedType === 'bsi' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedType === 'bsi' ? 'Nomor BSI Berhasil Disalin!' : 'Salin Nomor Rekening BSI'}</span>
          </button>
        </div>

        {/* Transfer From Any Bank Note */}
        <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>
            💡 <strong>Bisa transfer dari bank mana saja</strong> (BCA, Mandiri, BRI, BNI, Jago, Seabank) dengan memilih tujuan <strong>Bank BSI (Kode: 451)</strong> lalu masukkan nomor <strong>7373448995</strong>.
          </span>
          <button
            onClick={openPaymentModal}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 ml-3"
          >
            Konfirmasi di Sini →
          </button>
        </div>
      </div>

      {/* Feature Matrix: Free vs Member VIP */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Tabel Perbandingan Fitur Paket
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Fitur Utama</th>
                <th className="py-3 px-4 text-center">Free Tier</th>
                <th className="py-3 px-4 text-center text-indigo-600 dark:text-indigo-400 font-bold">
                  Member VIP (Rp 60.000/bln)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                  Jumlah Tautan Pelacak Medsos
                </td>
                <td className="py-3 px-4 text-center text-slate-500">Maksimal 3 Tautan</td>
                <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                  Tak Terbatas (Unlimited)
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                  Analitik Konten Vidio (TikTok & Reels)
                </td>
                <td className="py-3 px-4 text-center text-slate-500">Terbatas</td>
                <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                  Lengkap + Detik Puncak Klik
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                  Visualisasi Peta Google Maps
                </td>
                <td className="py-3 px-4 text-center text-slate-500">Hanya Domestik</td>
                <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                  Peta Jalan, Satelit & Global
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                  Ekspor Laporan Kinerja CSV & PDF
                </td>
                <td className="py-3 px-4 text-center text-slate-500">1x per bulan</td>
                <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                  Unduh Kapan Saja Tanpa Batas
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                  Hak Akses Program Afiliasi Juara
                </td>
                <td className="py-3 px-4 text-center text-slate-500">Terkunci</td>
                <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                  Aktif (Komisi Rp 10.000 / Member)
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                  Kecepatan Streaming Data
                </td>
                <td className="py-3 px-4 text-center text-slate-500">Standar</td>
                <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                  Ultra Real-Time (&lt; 1 Detik)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
