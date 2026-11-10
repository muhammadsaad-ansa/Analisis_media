import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAnalytics } from '../context/AnalyticsContext';
import { useTrafficAlert } from '../context/TrafficAlertContext';
import { useLanguage } from '../context/LanguageContext';
import { ActiveTab } from '../types';
import { 
  BarChart3, 
  Link2, 
  Video, 
  Activity, 
  Play, 
  LogOut, 
  Sun, 
  Moon, 
  ChevronDown,
  User as UserIcon,
  Radio,
  Crown,
  Share2,
  Wallet,
  TrendingUp,
  ShieldCheck,
  Bell,
  Target,
  Package,
  BarChart2,
  Flame,
  RotateCcw,
  Globe
} from 'lucide-react';

interface NavbarProps {
  onOpenCreateLink: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateLink, isDarkMode, toggleDarkMode, onOpenProfileModal }) => {
  const { user, isAuthenticated, isMember, isAdmin, logout, openLoginModal, openRegisterModal, openPaymentModal } = useAuth();
  const { activeTab, setActiveTab, isSimulatingLiveTraffic, toggleLiveSimulation, stats, openResetModal } = useAnalytics();
  const { openAlertModal, unreadIncidentsCount } = useTrafficAlert();
  const { language, setLanguage } = useLanguage();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Ringkasan', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'links', label: 'Tautan Medsos', icon: <Link2 className="w-4 h-4" /> },
    { id: 'videos', label: 'Analitik Vidio', icon: <Video className="w-4 h-4" /> },
    { id: 'trending', label: 'Tren Populer', icon: <Flame className="w-4 h-4 text-rose-500" />, badge: 'Viral' },
    { id: 'marketing', label: 'Pemasaran', icon: <Target className="w-4 h-4 text-violet-500" />, badge: 'ROAS' },
    { id: 'inventory', label: 'Produk & Stok', icon: <Package className="w-4 h-4 text-emerald-500" /> },
    { id: 'behavior', label: 'Perilaku & Konversi', icon: <BarChart2 className="w-4 h-4 text-rose-500" />, badge: 'Funnel' },
    { id: 'realtime', label: 'Siapa yang Klik', icon: <Activity className="w-4 h-4" />, badge: `${stats.activeNow} aktif` },
    { id: 'finance', label: 'Uang Pribadi', icon: <Wallet className="w-4 h-4 text-emerald-500" />, badge: 'Baru' },
    { id: 'stocks', label: 'Analis Saham', icon: <TrendingUp className="w-4 h-4 text-cyan-500" />, badge: 'Grafik' },
    { id: 'membership', label: 'Mode Member', icon: <Crown className="w-4 h-4 text-amber-500" /> },
    { id: 'affiliate', label: 'Afiliasi Juara', icon: <Share2 className="w-4 h-4 text-emerald-500" />, badge: 'Rp 10rb' },
    { id: 'seo', label: 'SEO & OpenGraph', icon: <Globe className="w-4 h-4 text-violet-500" />, badge: 'OG' },
    ...(isAdmin ? [{ id: 'admin' as ActiveTab, label: 'Panel Admin', icon: <ShieldCheck className="w-4 h-4 text-violet-500" />, badge: 'VIP' }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
                <Activity className="w-5 h-5 transition-transform group-hover:scale-110" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                Pulse<span className="text-indigo-600 dark:text-indigo-400">Track</span>
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Clean single-line text links with horizontal overflow scroll) */}
          <nav className="hidden md:flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 max-w-[55vw] text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[11px] font-mono tabular-nums px-1.5 py-0.2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 rounded-sm">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary action & User profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Live traffic simulator status toggle */}
            <button
              onClick={toggleLiveSimulation}
              title={isSimulatingLiveTraffic ? 'Simulasi streaming aktif' : 'Simulasi streaming jeda'}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                isSimulatingLiveTraffic
                  ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isSimulatingLiveTraffic ? 'animate-pulse text-emerald-500' : ''}`} />
              <span className="tabular-nums">Live Feed</span>
            </button>

            {/* Alert Bell Button for Traffic Spikes */}
            <button
              onClick={() => openAlertModal('rules')}
              className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Ambang Batas & Notifikasi Lonjakan Trafik"
              aria-label="Notifikasi Lonjakan Trafik"
            >
              <Bell className="w-4 h-4" />
              {unreadIncidentsCount > 0 ? (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold font-mono text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {unreadIncidentsCount}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>

            {/* Reset Analytics Button (/reset) */}
            <button
              onClick={openResetModal}
              className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset & Pulihkan Data Analitik (/reset)"
              aria-label="Reset Analitik"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setLanguage('id')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${language === 'id' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
                title="Bahasa Indonesia"
              >
                ID
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${language === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('zh')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${language === 'zh' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
                title="中文 (Chinese)"
              >
                中文
              </button>
            </div>

            {/* Dark mode switch */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Logo Member VIP / Super Admin */}
                {isAdmin ? (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-violet-600/20 hover:from-violet-600/30 hover:to-indigo-600/30 border border-violet-500/70 dark:border-violet-500/60 shadow-xs cursor-pointer group transition-all shrink-0"
                    title="Akun Super Admin Pribadi (Gratis Seumur Hidup) - Klik untuk Panel Admin"
                  >
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-violet-600 via-indigo-600 to-amber-400 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <div className="text-left hidden sm:block">
                      <span className="text-[11px] font-black text-violet-800 dark:text-violet-300 font-mono tracking-wider block leading-none">
                        SUPER ADMIN
                      </span>
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold leading-none block mt-0.5">
                        GRATIS SEUMUR HIDUP
                      </span>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('membership')}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-400/25 border border-amber-400/70 dark:border-amber-500/60 shadow-xs cursor-pointer group transition-all shrink-0"
                    title="Status Member VIP Aktif (Rp 60.000/bln) - Klik untuk detail keanggotaan"
                  >
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 flex items-center justify-center text-amber-950 shadow-xs group-hover:scale-105 transition-transform">
                      <Crown className="w-3.5 h-3.5 fill-amber-950 stroke-[2.5]" />
                    </div>
                    <div className="text-left hidden sm:block">
                      <span className="text-[11px] font-black text-amber-800 dark:text-amber-300 font-mono tracking-wider block leading-none">
                        MEMBER VIP
                      </span>
                      <span className="text-[9px] text-amber-600 dark:text-amber-400 font-medium leading-none block mt-0.5">
                        Rp 60.000 / bln
                      </span>
                    </div>
                  </button>
                )}

                {/* Profile menu dropdown */}
                <div ref={profileMenuRef} className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-violet-500 dark:ring-violet-400"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                          {user?.name.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-xs">
                        <ShieldCheck className="w-2.5 h-2.5 fill-current" />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[110px] truncate hidden sm:inline-block">
                      {user?.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-[140px]">{user?.brandName}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isAdmin 
                              ? 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300' 
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                          }`}>
                            {isAdmin ? 'SUPER ADMIN (GRATIS)' : 'MEMBER VIP'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => {
                            onOpenProfileModal();
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 rounded-lg text-left mb-1"
                        >
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Pengaturan Profil & Foto</span>
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                            Galeri
                          </span>
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setActiveTab('admin');
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-violet-700 dark:text-violet-300 bg-violet-50/70 dark:bg-violet-950/40 hover:bg-violet-100 rounded-lg text-left mb-1"
                          >
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
                              <span>Panel Super Admin</span>
                            </div>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-violet-200 dark:bg-violet-900 text-violet-800 dark:text-violet-200">
                              GRATIS
                            </span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setActiveTab('membership');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Crown className="w-3.5 h-3.5 text-amber-500" />
                            <span>Status Member (Rp 60rb)</span>
                          </div>
                          {!isMember && (
                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">Upgrade</span>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('affiliate');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                            <div>
                              <span>Afiliasi Juara</span>
                              <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Dapat ditarik semua 100%</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-emerald-600">
                            Rp {(user?.affiliateBalance || 0).toLocaleString('id-ID')}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('finance');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Pencatatan Uang Pribadi</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Arus Kas</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('stocks');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                        >
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
                            <span>Analis Saham & Grafik Pasar</span>
                          </div>
                          <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400">Grafik</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('links');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                        >
                          <Link2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>Daftar Tautan Saya</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('videos');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                        >
                          <Video className="w-3.5 h-3.5 text-slate-400" />
                          <span>Analitik Vidio Medsos</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('marketing');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Target className="w-3.5 h-3.5 text-violet-500" />
                            <span>Analisis Pemasaran (Atribusi)</span>
                          </div>
                          <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">ROAS</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('inventory');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Package className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Analisis Produk & Stok</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">SKU</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('behavior');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                        >
                          <div className="flex items-center gap-2">
                            <BarChart2 className="w-3.5 h-3.5 text-rose-500" />
                            <span>Perilaku & Corong Konversi</span>
                          </div>
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">Funnel</span>
                        </button>
                        <button
                          onClick={() => {
                            openAlertModal('rules');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Bell className="w-3.5 h-3.5 text-rose-500" />
                            <span>Ambang Batas & Notifikasi</span>
                          </div>
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                            {unreadIncidentsCount > 0 ? `${unreadIncidentsCount} Baru` : 'Radar'}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('trending');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Flame className="w-3.5 h-3.5 text-rose-500" />
                            <span>Tren Produk & Vidio</span>
                          </div>
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">Viral</span>
                        </button>
                        <button
                          onClick={() => {
                            openResetModal();
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                        >
                          <div className="flex items-center gap-2">
                            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                            <span>Reset Data Analitik</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">/reset</span>
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg text-left font-medium mt-1 border-t border-slate-100 dark:border-slate-800"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Keluar Akun</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openLoginModal}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Masuk
                </button>
                <button
                  onClick={openRegisterModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 gap-1 scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 ${
                activeTab === item.id
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
