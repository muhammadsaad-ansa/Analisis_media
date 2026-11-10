import React, { useState, useEffect } from 'react';
import { useAuth, ADMIN_PASSWORD } from '../context/AuthContext';
import { useAnalytics } from '../context/AnalyticsContext';
import { AdminUserAnalytics } from './AdminUserAnalytics';
import { SystemHealthWidget } from './SystemHealthWidget';
import { generateLiveAppHtml } from '../utils/dynamicHtmlGenerator';
import { 
  ShieldCheck, 
  Crown, 
  User, 
  CreditCard, 
  Sparkles, 
  Check, 
  Copy, 
  PlusCircle, 
  ArrowUpRight, 
  Users, 
  Wallet, 
  Save, 
  Edit3,
  CheckCircle2,
  Lock,
  Zap,
  TrendingUp,
  Share2,
  Eye,
  EyeOff,
  Key,
  Code,
  FileCode,
  Download,
  X,
  RefreshCw
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { 
    user, 
    updateProfile, 
    addCommission, 
    simulateNewAffiliateReferral, 
    requestWithdrawal, 
    withdrawals, 
    referrals 
  } = useAuth();
  const { links, stats, setActiveTab } = useAnalytics();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [adminName, setAdminName] = useState(user?.name || 'Nisa Ad');
  const [adminBrand, setAdminBrand] = useState(user?.brandName || 'Nisa Studio Official (@nisastudio)');
  const [bankName, setBankName] = useState(user?.bankAccount?.bankName || 'BSI (Bank Syariah Indonesia)');
  const [accountNumber, setAccountNumber] = useState(user?.bankAccount?.accountNumber || '7373448995');
  const [accountHolder, setAccountHolder] = useState(user?.bankAccount?.accountHolder || 'Nisa Ad');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Fungsi regenerasi kode HTML live yang otomatis mengikuti upgrade / perubahan aplikasi
  const regenerateLatestHtml = () => {
    setIsSyncing(true);
    const joinedMembers = (() => {
      try {
        const saved = localStorage.getItem('pulsetrack_joined_users');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    })();

    const dynamicHtml = generateLiveAppHtml({
      user: {
        ...(user || {}),
        name: adminName,
        brandName: adminBrand,
        bankAccount: {
          bankName,
          accountNumber,
          accountHolder,
        },
      },
      links,
      members: joinedMembers,
      version: '2.5 (Auto-Synced Live)',
    });

    setHtmlCode(dynamicHtml);
    setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');
    setTimeout(() => setIsSyncing(false), 300);
  };

  const handleOpenHtmlModal = () => {
    regenerateLatestHtml();
    setIsHtmlModalOpen(true);
  };

  const handleCopyHtmlCode = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2500);
  };

  const handleDownloadHtmlFile = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pulsetrack_app_${new Date().toISOString().slice(0, 10)}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: adminName,
      brandName: adminBrand,
      bankAccount: {
        bankName,
        accountNumber,
        accountHolder,
      },
    });
    setIsEditingProfile(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };



  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Portal Super Admin Pribadi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Kontrol Admin Utama</span>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs">
              GRATIS SEUMUR HIDUP
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Selamat datang, <strong className="text-slate-800 dark:text-slate-200">{user?.name}</strong> ({user?.email}). Akun admin Anda aktif secara permanen tanpa biaya langganan bulanan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenHtmlModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Buka & Salin Seluruh Kode HTML Aplikasi"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Salin / Unduh Kode HTML</span>
          </button>

          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingProfile ? 'Batal Edit' : 'Edit Profil Admin'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Profil admin dan nomor rekening berhasil diperbarui serta tersimpan di perangkat Anda.</span>
        </div>
      )}

      {/* Hero Privileges Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-violet-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-violet-800/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/30 border border-violet-400/40 text-violet-200 text-xs font-bold">
              <Crown className="w-4 h-4 text-amber-300" />
              <span>SUPER ADMINISTRATOR PRIVILEGE</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-600/50 px-3 py-1 rounded-full">
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Status: 100% Bebas Biaya (Gratis Permanen)</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Hak Akses Penuh Sistem & Master Analytics
            </h2>
            <p className="text-xs sm:text-sm text-violet-200/80 max-w-2xl mt-1 leading-relaxed">
              Sebagai Super Admin pribadi, Anda memiliki hak penuh untuk mengelola analitik, mencatat keuangan pribadi, membaca grafik saham, menerima pembayaran ke rekening BSI Anda (<strong>7373448995</strong>), dan menarik komisi afiliasi juara tanpa batas.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <div className="text-[11px] text-violet-200">Peran Akun</div>
              <div className="text-sm font-bold text-white mt-0.5">Super Admin</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <div className="text-[11px] text-violet-200">Biaya Langganan</div>
              <div className="text-sm font-bold text-emerald-300 mt-0.5">Rp 0 (Gratis)</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <div className="text-[11px] text-violet-200">Masa Berlaku</div>
              <div className="text-sm font-bold text-amber-300 mt-0.5">Seumur Hidup</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <div className="text-[11px] text-violet-200">Kode Afiliasi</div>
              <div className="text-sm font-bold text-white mt-0.5 font-mono">{user?.affiliateCode || 'ref-nisa'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form if open */}
      {isEditingProfile && (
        <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sesuaikan Identitas Akun Admin Pribadi</h3>
            </div>
            <span className="text-[11px] text-slate-400">Data tersimpan langsung di browser Anda</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap Admin
              </label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Brand / Studio Medsos
              </label>
              <input
                type="text"
                required
                value={adminBrand}
                onChange={(e) => setAdminBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bank Penerima Pencairan
              </label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nomor Rekening Pencairan
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Pemilik Rekening
              </label>
              <input
                type="text"
                required
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan Admin</span>
            </button>
          </div>
        </form>
      )}

      {/* Admin Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Rekening Pembayaran Resmi */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rekening Resmi Admin Pribadi</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold">
              AKTIF
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Bank Tujuan:</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {user?.bankAccount?.bankName || 'BSI (Bank Syariah Indonesia)'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Nomor Rekening:</span>
              <span className="text-base font-mono font-black text-indigo-600 dark:text-indigo-400 tracking-wider">
                {user?.bankAccount?.accountNumber || '7373448995'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Atas Nama:</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {user?.bankAccount?.accountHolder || user?.name || 'Nisa Ad'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleCopy(user?.bankAccount?.accountNumber || '7373448995', 'rekening')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              {copiedText === 'rekening' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText === 'rekening' ? 'Tersalin!' : 'Salin Nomor Rekening'}</span>
            </button>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="py-2 px-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
            >
              Ganti Rekening
            </button>
          </div>
        </div>

        {/* Kontrol Komisi Afiliasi */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Saldo Komisi & Penarikan</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
              100% DAPAT DITARIK
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-tr from-indigo-50 to-emerald-50 dark:from-indigo-950/40 dark:to-emerald-950/40 border border-indigo-100 dark:border-indigo-900/50">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Saldo Afiliasi Siap Dicairkan:</div>
            <div className="text-2xl font-mono font-black text-slate-900 dark:text-white mt-1">
              Rp {(user?.affiliateBalance || 0).toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              Total Referral Terkonversi: {user?.referredConversions || 15} member
            </div>
          </div>


        </div>
      </div>

      {/* System Health Widget: Server Latency & Memory Usage */}
      <SystemHealthWidget />

      {/* Fitur Analisis Siapa Saja yang Bergabung & Grafik Interaktif */}
      <AdminUserAnalytics />

      {/* Keamanan & Sandi Akses Khusus Admin */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-800/50 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600/50 border border-violet-400/40 flex items-center justify-center text-white">
              <Key className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Proteksi Kata Sandi Akun Super Admin</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  TERKUNCI AMAN
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Hanya Anda (Nisa Ad) yang dapat mengakses akun ini. Orang lain tidak dapat masuk tanpa sandi ini.
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Email: <strong className="text-white">nisaad1526@gmail.com</strong>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-slate-400">Kata Sandi Resmi Akun Admin:</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-mono font-black text-amber-300 tracking-wider">
                {showAdminPassword ? ADMIN_PASSWORD : '••••••••••'}
              </span>
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-white/10 transition-colors cursor-pointer"
                title={showAdminPassword ? 'Sembunyikan' : 'Tampilkan sandi'}
              >
                {showAdminPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(ADMIN_PASSWORD, 'password')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {copiedText === 'password' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText === 'password' ? 'Sandi Disalin!' : 'Salin Kata Sandi'}</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Sistem secara otomatis memverifikasi kata sandi <strong>Ansa152026</strong> pada setiap upaya masuk. Pendaftaran akun baru dengan email ini juga telah diblokir.</span>
        </div>
      </div>

      {/* Navigasi Cepat Seluruh Modul */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Akses Cepat Modul PulseTrack Super Admin</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <button
            onClick={() => setActiveTab('finance')}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer group"
          >
            <Wallet className="w-4 h-4 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900 dark:text-white">Uang Pribadi</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Catat Pemasukan & PDF</div>
          </button>

          <button
            onClick={() => setActiveTab('stocks')}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer group"
          >
            <TrendingUp className="w-4 h-4 text-cyan-500 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900 dark:text-white">Analis Saham</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Grafik IHSG & Global</div>
          </button>

          <button
            onClick={() => setActiveTab('affiliate')}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer group"
          >
            <Share2 className="w-4 h-4 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900 dark:text-white">Afiliasi Juara</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Komisi Rp 10rb/member</div>
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer group"
          >
            <Crown className="w-4 h-4 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900 dark:text-white">Tautan Medsos</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Link Bio & Tracking</div>
          </button>
        </div>
      </div>

      {/* Modal Salin / Unduh Kode HTML Lengkap */}
      {isHtmlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative flex flex-col text-left space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Kode HTML Aplikasi Lengkap (Standalone Single-File)</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      LIVE AUTO-SYNC
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kode HTML berubah otomatis setiap kali Anda meng-upgrade fitur atau mengubah data aplikasi.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsHtmlModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Auto-Sync Live Banner */}
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shrink-0">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span><strong>Sinkronisasi Otomatis Aktif:</strong> Berkas HTML ini selalu menghasilkan versi terbaru lengkap dengan data akun admin, tautan, dan member terkini.</span>
              </div>
              {lastSyncTime && (
                <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 shrink-0 font-semibold">
                  Tersinkron: {lastSyncTime}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-600 dark:text-slate-300">
                ✅ <strong>100% Mandiri:</strong> Berisi seluruh antarmuka PulseTrack, Tailwind, React, Lucide, dan Panel Super Admin Anda.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={regenerateLatestHtml}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                  title="Sinkronkan ulang kode HTML dengan data terbaru"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Menyinkronkan...' : 'Perbarui HTML'}</span>
                </button>

                <button
                  onClick={handleCopyHtmlCode}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  {copiedHtml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHtml ? 'Kode HTML Tersalin!' : 'Salin Semua Kode HTML'}</span>
                </button>

                <button
                  onClick={handleDownloadHtmlFile}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File .html</span>
                </button>

                <a
                  href="/pulsetrack_app.html"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Buka Tab Baru</span>
                </a>
              </div>
            </div>

            <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-200 font-mono text-[11px] p-4 relative">
              <textarea
                readOnly
                value={htmlCode || 'Memuat kode HTML aplikasi...'}
                className="w-full h-72 sm:h-80 bg-transparent text-slate-200 resize-none outline-none font-mono leading-relaxed selection:bg-indigo-600 selection:text-white"
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
            </div>

            <div className="text-[11px] text-slate-500 shrink-0">
              💡 <strong>Cara Pakai:</strong> Buka text editor (Notepad, VS Code, TextEdit), paste kode ini, simpan dengan nama <code>index.html</code>, lalu klik dua kali untuk membuka aplikasi di browser Anda.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
