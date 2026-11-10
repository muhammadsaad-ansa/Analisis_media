import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { useAuth } from '../context/AuthContext';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import { 
  X, 
  FileSpreadsheet, 
  FileText, 
  Download, 
  CheckCircle2, 
  Layers,
  Sparkles,
  BarChart3,
  Video,
  MousePointerClick,
  MapPin,
  Check
} from 'lucide-react';

interface ExportAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFormat?: 'csv' | 'pdf';
}

export const ExportAnalyticsModal: React.FC<ExportAnalyticsModalProps> = ({ 
  isOpen, 
  onClose,
  defaultFormat = 'csv' 
}) => {
  const { 
    links, 
    stats, 
    platformBreakdown, 
    deviceBreakdown, 
    cityBreakdown, 
    videos, 
    recentClicks, 
    timeRange 
  } = useAnalytics();
  const { user } = useAuth();

  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'pdf'>(defaultFormat);
  const [isExporting, setIsExporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modular export selection (All enabled by default as requested: "Tambah kan semua")
  const [includeSections, setIncludeSections] = useState({
    kpis: true,
    links: true,
    platformsDevices: true,
    locations: true,
    videos: true,
    recentLogs: true,
  });

  if (!isOpen) return null;

  const toggleSection = (key: keyof typeof includeSections) => {
    setIncludeSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAllSections = () => {
    setIncludeSections({
      kpis: true,
      links: true,
      platformsDevices: true,
      locations: true,
      videos: true,
      recentLogs: true,
    });
  };

  const handleExecuteExport = (overrideFormat?: 'csv' | 'pdf') => {
    const formatToUse = overrideFormat || selectedFormat;
    setIsExporting(true);
    setSuccessMsg(null);

    const payload = {
      links: includeSections.links ? links : [],
      stats,
      platformBreakdown: includeSections.platformsDevices ? platformBreakdown : [],
      deviceBreakdown: includeSections.platformsDevices ? deviceBreakdown : [],
      cityBreakdown: includeSections.locations ? cityBreakdown : [],
      videos: includeSections.videos ? videos : [],
      recentClicks: includeSections.recentLogs ? recentClicks : [],
      user,
      timeRange,
    };

    try {
      if (formatToUse === 'csv') {
        exportToCSV(payload);
        setSuccessMsg('Berkas CSV berhasil diunduh! Berisi seluruh sheet metrik untuk Excel / Google Sheets.');
      } else {
        exportToPDF(payload);
        setSuccessMsg('Laporan PDF resmi eksekutif berhasil dibuat dan diunduh!');
      }
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
      setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 text-left relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5 pr-8">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Laporan Kinerja Digital Eksekutif
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Ekspor Data Analitik Lengkap
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Unduh seluruh metrik analitik tautan, konversi video medsos, perangkat, kota, dan rekaman lalu lintas untuk pelaporan atau pembukuan.
          </p>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs flex items-center gap-2.5 animate-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Format Selection Cards */}
        <div className="space-y-2 mb-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Pilih Format Berkas:
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* CSV Card */}
            <div
              onClick={() => setSelectedFormat('csv')}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedFormat === 'csv'
                  ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    CSV (Excel)
                  </span>
                </div>
                {selectedFormat === 'csv' && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Data terstruktur lengkap 7 bagian, kompatibel dengan Microsoft Excel & Google Sheets.
              </p>
            </div>

            {/* PDF Card */}
            <div
              onClick={() => setSelectedFormat('pdf')}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedFormat === 'pdf'
                  ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    PDF Resmi
                  </span>
                </div>
                {selectedFormat === 'pdf' && (
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Laporan cetak resmi multi-halaman dengan tabel eksekutif, KPI, dan penomoran dokumen.
              </p>
            </div>
          </div>
        </div>

        {/* Section Checklist ("Tambahkan Semua") */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>Data yang Disertakan dalam Laporan:</span>
            </label>
            <button
              type="button"
              onClick={selectAllSections}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Pilih Semua Data
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* KPI */}
            <label
              onClick={() => toggleSection('kpis')}
              className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                includeSections.kpis
                  ? 'border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/40 dark:bg-indigo-950/20 text-slate-900 dark:text-white font-medium'
                  : 'border-slate-100 dark:border-slate-800 text-slate-400'
              }`}
            >
              <input
                type="checkbox"
                checked={includeSections.kpis}
                onChange={() => {}}
                className="rounded text-indigo-600 w-3.5 h-3.5 pointer-events-none"
              />
              <span className="truncate">Ringkasan KPI Utama</span>
            </label>

            {/* Links */}
            <label
              onClick={() => toggleSection('links')}
              className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                includeSections.links
                  ? 'border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/40 dark:bg-indigo-950/20 text-slate-900 dark:text-white font-medium'
                  : 'border-slate-100 dark:border-slate-800 text-slate-400'
              }`}
            >
              <input
                type="checkbox"
                checked={includeSections.links}
                onChange={() => {}}
                className="rounded text-indigo-600 w-3.5 h-3.5 pointer-events-none"
              />
              <span className="truncate">Tautan Medsos ({links.length})</span>
            </label>

            {/* Platforms & Devices */}
            <label
              onClick={() => toggleSection('platformsDevices')}
              className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                includeSections.platformsDevices
                  ? 'border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/40 dark:bg-indigo-950/20 text-slate-900 dark:text-white font-medium'
                  : 'border-slate-100 dark:border-slate-800 text-slate-400'
              }`}
            >
              <input
                type="checkbox"
                checked={includeSections.platformsDevices}
                onChange={() => {}}
                className="rounded text-indigo-600 w-3.5 h-3.5 pointer-events-none"
              />
              <span className="truncate">Platform & Perangkat</span>
            </label>

            {/* Locations */}
            <label
              onClick={() => toggleSection('locations')}
              className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                includeSections.locations
                  ? 'border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/40 dark:bg-indigo-950/20 text-slate-900 dark:text-white font-medium'
                  : 'border-slate-100 dark:border-slate-800 text-slate-400'
              }`}
            >
              <input
                type="checkbox"
                checked={includeSections.locations}
                onChange={() => {}}
                className="rounded text-indigo-600 w-3.5 h-3.5 pointer-events-none"
              />
              <span className="truncate">Kota Geografis ({cityBreakdown.length})</span>
            </label>

            {/* Videos */}
            <label
              onClick={() => toggleSection('videos')}
              className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                includeSections.videos
                  ? 'border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/40 dark:bg-indigo-950/20 text-slate-900 dark:text-white font-medium'
                  : 'border-slate-100 dark:border-slate-800 text-slate-400'
              }`}
            >
              <input
                type="checkbox"
                checked={includeSections.videos}
                onChange={() => {}}
                className="rounded text-indigo-600 w-3.5 h-3.5 pointer-events-none"
              />
              <span className="truncate">Pelacak Video ({videos.length})</span>
            </label>

            {/* Recent Logs */}
            <label
              onClick={() => toggleSection('recentLogs')}
              className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                includeSections.recentLogs
                  ? 'border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/40 dark:bg-indigo-950/20 text-slate-900 dark:text-white font-medium'
                  : 'border-slate-100 dark:border-slate-800 text-slate-400'
              }`}
            >
              <input
                type="checkbox"
                checked={includeSections.recentLogs}
                onChange={() => {}}
                className="rounded text-indigo-600 w-3.5 h-3.5 pointer-events-none"
              />
              <span className="truncate">Log Riwayat Klik ({recentClicks.length})</span>
            </label>
          </div>
        </div>

        {/* Live Data Summary Preview */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 mb-5 font-mono border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Akun / Brand:</span>
            <strong className="text-slate-900 dark:text-white font-sans">{user?.brandName || 'Pengguna PulseTrack'}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Total Klik Masuk:</span>
            <strong className="text-indigo-600 dark:text-indigo-400">{stats.totalClicks.toLocaleString('id-ID')} Klik</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Pengunjung Unik:</span>
            <strong className="text-emerald-600 dark:text-emerald-400">{stats.uniqueVisitors.toLocaleString('id-ID')} Pengunjung</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Periode Data:</span>
            <strong className="text-slate-900 dark:text-white">
              {timeRange === 'today' ? 'Hari Ini' : timeRange === '7d' ? '7 Hari Terakhir' : '30 Hari Terakhir'}
            </strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleExecuteExport('csv')}
              disabled={isExporting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              title="Unduh langsung sebagai berkas CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Unduh CSV Langsung</span>
            </button>
            <button
              type="button"
              onClick={() => handleExecuteExport('pdf')}
              disabled={isExporting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              title="Unduh langsung sebagai laporan PDF resmi"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Unduh PDF Langsung</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => handleExecuteExport()}
              disabled={isExporting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>
                {isExporting ? 'Memproses Berkas...' : `Unduh ${selectedFormat.toUpperCase()} Lengkap`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
