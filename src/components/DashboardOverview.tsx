import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { InteractiveChart } from './InteractiveChart';
import { GlobalDistributionMap } from './GlobalDistributionMap';
import { ExportAnalyticsModal } from './ExportAnalyticsModal';
import { TrafficSpikeWidget } from './TrafficSpikeWidget';
import { 
  MousePointerClick, 
  Users, 
  Share2, 
  TrendingUp, 
  Smartphone, 
  MapPin, 
  Video, 
  ArrowRight, 
  Radio, 
  Play,
  ArrowUpRight,
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Plus,
  Crown,
  ArrowDownToLine,
  Wallet,
  Target,
  Package,
  BarChart2,
  Sparkles,
  Flame,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

interface DashboardOverviewProps {
  onOpenCreateLink: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenCreateLink,
  onNavigateToTab,
}) => {
  const {
    links,
    stats,
    platformBreakdown,
    deviceBreakdown,
    cityBreakdown,
    timeRange,
    setTimeRange,
    recentClicks,
    simulateInstantClick,
    videos,
    openResetModal,
  } = useAnalytics();
  const { user } = useAuth();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [defaultExportFormat, setDefaultExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleDirectExport = (format: 'csv' | 'pdf') => {
    const payload = {
      links,
      stats,
      platformBreakdown,
      deviceBreakdown,
      cityBreakdown,
      videos,
      recentClicks,
      user,
      timeRange,
    };
    try {
      if (format === 'csv') {
        exportToCSV(payload);
        setExportNotice('Berkas CSV berhasil diunduh! Seluruh data metrik analitik telah tersimpan.');
      } else {
        exportToPDF(payload);
        setExportNotice('Laporan resmi PDF eksekutif berhasil dibuat dan siap dicetak/disimpan.');
      }
    } catch (err) {
      console.error('Export error:', err);
    }
    setTimeout(() => {
      setExportNotice(null);
    }, 4500);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Real-time Status Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-sm border border-indigo-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                Live Traffic Radar Aktif
              </span>
              <span className="text-xs text-indigo-300">·</span>
              <span className="text-xs text-indigo-200 font-mono tabular-nums">
                {stats.activeNow} pengunjung online saat ini
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Pemantauan Klik Media Sosial & Video Real-Time
            </h2>
            <p className="text-xs text-indigo-200 mt-1 max-w-2xl">
              Setiap kali seseorang menekan link di Instagram Bio, TikTok, Reels, atau WhatsApp, lokasi dan perangkat mereka langsung tercatat di sini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Tombol Tambah Tautan (ditempatkan di posisi logo member) */}
            <button
              onClick={onOpenCreateLink}
              className="flex items-center gap-2.5 px-4 py-2 bg-white text-indigo-950 hover:bg-indigo-50 font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap group active:scale-95 border border-white/80"
              title="Buat Tautan Pelacak Baru (Instagram, TikTok, WhatsApp, Reels)"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <Plus className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block leading-tight">
                  Pelacak Medsos
                </span>
                <span className="text-xs font-black text-slate-900 leading-tight">
                  + Tambah Tautan
                </span>
              </div>
            </button>

            {/* Komisi Afiliasi (Dapat Ditarik Semua) */}
            <button
              onClick={() => onNavigateToTab('affiliate')}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap text-left group"
              title="Komisi Afiliasi - Dapat Ditarik Semua 100%"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xs font-bold group-hover:scale-105 transition-transform">
                <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 font-semibold block leading-tight">
                  Komisi Dapat Ditarik Semua
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  Rp {(user?.affiliateBalance ?? 0).toLocaleString('id-ID')}
                </span>
              </div>
            </button>

            {/* Quick Access: Uang Pribadi */}
            <button
              onClick={() => onNavigateToTab('finance')}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-700/60 hover:bg-indigo-700 border border-indigo-400/40 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap text-left group"
              title="Pencatatan Uang Pribadi, Pemasukan, Pengeluaran & Arus Kas"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-indigo-200 font-semibold block leading-tight">
                  Uang Pribadi
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  Catatan Arus Kas
                </span>
              </div>
            </button>

            {/* Quick Access: Analis Saham & Grafik */}
            <button
              onClick={() => onNavigateToTab('stocks')}
              className="flex items-center gap-2 px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap text-left group"
              title="Sistem Analis Saham Interaktif dengan Grafik Pasar"
            >
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-cyan-300 font-semibold block leading-tight">
                  Analis Saham
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  Grafik Pasar & IHSG
                </span>
              </div>
            </button>

            {/* Export CSV / PDF button & quick triggers */}
            <div className="flex items-center gap-1.5 bg-indigo-950/80 p-1 rounded-xl border border-indigo-700/60 shadow-xs">
              <button
                onClick={() => handleDirectExport('csv')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:text-white hover:bg-emerald-600/30 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                title="Unduh instan seluruh data sebagai CSV (Excel/Sheets)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => handleDirectExport('pdf')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-600/30 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                title="Cetak & unduh instan laporan resmi PDF eksekutif"
              >
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => {
                  setDefaultExportFormat('csv');
                  setIsExportModalOpen(true);
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-200 hover:text-white hover:bg-indigo-800/60 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                title="Buka panel ekspor laporan analitik lengkap"
              >
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">Ekspor</span>
              </button>
            </div>

            {/* Quick Access: Tren Populer (Affiliate & Non-Affiliate) */}
            <button
              onClick={() => onNavigateToTab('trending')}
              className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/50 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap text-left group"
              title="Produk & Vidio yang Sedang Tren (Afiliasi & Non-Afiliasi)"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Flame className="w-4 h-4 fill-white" />
              </div>
              <div>
                <span className="text-[10px] text-rose-300 font-semibold block leading-tight">
                  Tren Populer
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  Produk & Vidio
                </span>
              </div>
            </button>

            {/* Reset Data Analitik (/reset) */}
            <button
              onClick={openResetModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 rounded-xl transition-all cursor-pointer whitespace-nowrap"
              title="Reset data klik atau pulihkan data awal (/reset)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>/reset</span>
            </button>

            <button
              onClick={() => simulateInstantClick()}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
              <span>Kirim Klik Uji Coba</span>
            </button>
            <button
              onClick={() => onNavigateToTab('realtime')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-200 hover:text-white bg-indigo-800/50 hover:bg-indigo-800 rounded-xl transition-colors whitespace-nowrap"
            >
              <span>Lihat Log Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Traffic Spike & Threshold Alert Widget */}
      <TrafficSpikeWidget />

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Clicks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Total Klik Masuk</span>
            <MousePointerClick className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {stats.totalClicks.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Akumulasi seluruh tautan medsos</p>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Pengunjung Unik</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {stats.uniqueVisitors.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              81.4% rasio unik
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Perangkat dan IP unik</p>
        </div>

        {/* Top Social Platform */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Platform Medsos Teratas</span>
            <Share2 className="w-4 h-4 text-pink-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white truncate">
              {stats.topPlatform.platform}
            </span>
            <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
              {stats.topPlatform.percentage}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Penyumbang rujukan terbesar</p>
        </div>

        {/* Video Attribution CTR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Konversi Vidio (CTR)</span>
            <Video className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {stats.avgVideoCTR}%
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {stats.totalVideoClicks.toLocaleString('id-ID')} klik
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Dari Reels, TikTok & Shorts</p>
        </div>
      </div>

      {/* Toast Notice for Direct Export */}
      {exportNotice && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-800 dark:text-emerald-200 shadow-sm animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{exportNotice}</span>
          </div>
          <button
            onClick={() => setExportNotice(null)}
            className="text-[11px] underline hover:text-emerald-950 dark:hover:text-white cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Feature Section: Pusat Laporan & Ekspor Analitik (CSV & PDF) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-indigo-800/50 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-400/30 flex items-center gap-1">
                <FileSpreadsheet className="w-3 h-3 text-indigo-400" />
                <span>Pelaporan Pengguna</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-wider border border-emerald-400/30">
                100% Seluruh Data Analitik
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Ekspor Data Analitik Laporan Kinerja (CSV & PDF)
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Dapatkan laporan lengkap berisi ringkasan metrik KPI, performa detail {links.length} tautan medsos, sebaran platform, perangkat, {cityBreakdown.length} kota, pelacak video ({videos.length} video), dan log {recentClicks.length} aktivitas klik terkini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Download CSV */}
            <button
              onClick={() => handleDirectExport('csv')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-95 group"
              title="Unduh seluruh data analitik dalam format CSV untuk Excel atau Google Sheets"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-900 group-hover:scale-110 transition-transform" />
              <span>Unduh CSV (Excel)</span>
            </button>

            {/* Download PDF */}
            <button
              onClick={() => handleDirectExport('pdf')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-95 group"
              title="Cetak dan unduh laporan resmi dalam format PDF eksekutif"
            >
              <FileText className="w-4 h-4 text-rose-200 group-hover:scale-110 transition-transform" />
              <span>Unduh PDF (Resmi)</span>
            </button>

            {/* Customize / Select sections */}
            <button
              onClick={() => {
                setDefaultExportFormat('csv');
                setIsExportModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-100 hover:text-white bg-indigo-800/60 hover:bg-indigo-700/80 border border-indigo-600/50 rounded-xl transition-all cursor-pointer whitespace-nowrap"
              title="Kustomisasi bagian laporan dan pilih modul yang ingin disertakan"
            >
              <Download className="w-3.5 h-3.5 text-indigo-300" />
              <span>Opsi Lengkap</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Business Intelligence Suites */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Pusat Analisis Lanjutan & E-Commerce</span>
            </h3>
            <p className="text-xs text-slate-500">
              Optimalisasi pemasaran multi-sentuhan, kecepatan perputaran stok, dan corong konversi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Marketing Attribution */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-violet-500/50 transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-xs">
                  <Target className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-800">
                  ROAS 8.82x
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Analisis Pemasaran (Attribution)
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Bandingkan 5 model atribusi (First/Last Touch, Linear, Time-Decay, U-Shaped) untuk mengukur ROAS nyata TikTok, IG, WA, dan Afiliasi.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Omzet Teratribusi:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Rp 287.000.000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Biaya Akuisisi (CAC):</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">Rp 22.666</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab('marketing')}
              className="mt-4 w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <span>Buka Analisis Pemasaran</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Product & Inventory */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-emerald-500/50 transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                  <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                  2 SKU Kritis
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Analisis Produk & Manajemen Stok
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Pantau kecepatan perputaran (*sell-through rate*), klasifikasi Pareto ABC, dan rekomendasi otomatis restock pemesanan ulang (EOQ).
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Nilai Stok Fisik:</span>
                  <span className="font-bold text-slate-900 dark:text-white">Rp 48.500.000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Rata-rata Margin:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">64.6%</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab('inventory')}
              className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <span>Buka Analisis Produk & Stok</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Conversion & Behavior */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-rose-500/50 transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-xs">
                  <BarChart2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Konversi 8.78%
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Analisis Perilaku & Corong Konversi
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Visualisasi 6 tahap corong dari klik tautan ke keranjang hingga pembayaran, diagnosis kebocoran, dan kohor retensi mingguan.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Total Pembeli:</span>
                  <span className="font-bold text-slate-900 dark:text-white">1.620 Transaksi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Abandonment Keranjang:</span>
                  <span className="font-bold text-amber-500">58.7%</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab('behavior')}
              className="mt-4 w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <span>Buka Corong & Perilaku</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Time-series Chart */}
      <InteractiveChart timeRange={timeRange} onTimeRangeChange={setTimeRange} />

      {/* D3 Geographical Distribution Map */}
      <GlobalDistributionMap />

      {/* Two Column Grid: Platform Distribution & Geographical Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Rujukan Platform Media Sosial
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Perbandingan volume klik antar platform media sosial
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('links')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Lihat Tautan
            </button>
          </div>

          <div className="space-y-3.5 mt-4">
            {platformBreakdown.slice(0, 5).map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono tabular-nums text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.count.toLocaleString('id-ID')} klik
                    </span>
                    <span className="text-slate-400">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <span>Dominasi Perangkat:</span>
            </span>
            <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
              {stats.mobileShare}% Pengguna Ponsel (HP)
            </span>
          </div>
        </div>

        {/* Top Cities in Indonesia */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Lokasi Pengunjung Teratas
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sebaran geografis audiens yang menekan tautan Anda
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              Kota & Wilayah
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {cityBreakdown.map((item, index) => (
              <div
                key={item.city}
                className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 text-center font-mono text-[11px] font-bold text-slate-400">
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {item.city}
                    </span>
                    <span className="text-slate-400 text-[11px] ml-1.5">
                      ({item.country})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-20 sm:w-28 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                    <div
                      style={{ width: `${item.percentage * 2}%` }}
                      className="h-full bg-indigo-500 rounded-full"
                    />
                  </div>
                  <span className="font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-300">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Cakupan:</span>
            </span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              34 Provinsi Indonesia + Regional ASEAN
            </span>
          </div>
        </div>
      </div>

      {/* Recent Live Feed Preview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Siapa yang Menekan Tautan Baru Saja?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Aliran rekaman langsung aktivitas pengunjung dari media sosial
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('realtime')}
            className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            <span>Buka Streaming Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-1">
          {recentClicks.slice(0, 5).map((evt) => (
            <div
              key={evt.id}
              className="py-3 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {evt.platform}
                </span>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{evt.city}, {evt.country}</span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="font-normal text-slate-500">{evt.device} ({evt.os})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-[280px]">
                    /r/{evt.linkSlug} {evt.videoTitle ? `· 🎬 ${evt.videoTitle}` : ''}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                  {evt.ipSnippet}
                </span>
                <div className="text-[10px] text-slate-400">
                  {new Date(evt.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export CSV / PDF Modal */}
      <ExportAnalyticsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        defaultFormat={defaultExportFormat}
      />
    </div>
  );
};
