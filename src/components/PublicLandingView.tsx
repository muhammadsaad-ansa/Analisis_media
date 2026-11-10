import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  ArrowRight, 
  Sparkles, 
  Share2, 
  Video, 
  Smartphone, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2,
  MousePointerClick
} from 'lucide-react';

export const PublicLandingView: React.FC = () => {
  const { openRegisterModal, openLoginModal } = useAuth();

  return (
    <div className="space-y-16 py-8 text-center">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Platform Analitik Tautan Media Sosial #1 Real-Time</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight text-balance">
          Ketahui Persis <span className="text-indigo-600 dark:text-indigo-400">Siapa Saja yang Menekan</span> Tautan di Medsos Anda
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Pantau trafik pengunjung dari Instagram Bio, TikTok Video, WhatsApp, YouTube Shorts, dan X secara real-time. Deteksi kota asal, jenis HP, dan konten video mana yang paling banyak menghasilkan penjualan.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={openLoginModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <span>Masuk ke Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={openRegisterModal}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            Daftar Akun Member (Rp 60.000/bln)
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Pembaruan Real-Time &lt; 1 Detik</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Analitik Khusus Reels & TikTok</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Deteksi Kota & Provider Akurat</span>
          </span>
        </div>
      </div>

      {/* Feature Bento Grid */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/50 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4">
            <Share2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Pelacak Rujukan Medsos
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Ketahui apakah pengunjung datang dari Instagram In-App Browser, TikTok Bio, WhatsApp Chat, atau Thread di X secara presisi tanpa kehilangan data rujukan.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Analitik Vidio Medsos
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Hubungkan tautan ke video TikTok atau Reels. Lihat detik ke berapa penonton mengklik tautan Anda, rasio konversi klik-tayang (CTR), dan performa affiliate.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Live Stream Pengunjung
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Lihat kartu pengunjung muncul seketika di layar Anda lengkap dengan kota asal (Jakarta, Surabaya, Bandung, dll), sistem operasi (iOS/Android), dan browser.
          </p>
        </div>
      </div>

      {/* Member Mode & Affiliate Program Showcase */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border border-amber-300 dark:border-amber-700/60 rounded-3xl p-6 sm:p-8 text-left">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full border border-amber-300 dark:border-amber-700">
                  Mode Member VIP: Rp 60.000 / Bulan
                </span>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-700">
                  Komisi Afiliasi: Rp 10.000 / Member
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Dapatkan Penghasilan Tambahan Lewat Program Afiliasi Juara
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                Nikmati fitur analitik profesional tanpa batas dan raih komisi tunai <strong>Rp 10.000</strong> langsung masuk ke saldo Anda untuk setiap member baru yang mendaftar dan membayar langganan. Pembayaran mudah via rekening resmi <strong>Bank BSI (7373448995)</strong> atau transfer antar-bank mana saja di Indonesia.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={openRegisterModal}
                className="px-5 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                Daftar & Gabung Afiliasi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
