import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Users,
  UserPlus,
  Crown,
  Search,
  Filter,
  Download,
  Calendar,
  Sparkles,
  ArrowUpRight,
  MapPin,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  Share2,
  RefreshCw,
  Eye,
  X,
  TrendingUp,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';

export interface JoinedMember {
  id: string;
  name: string;
  email: string;
  brandHandle: string;
  joinedAt: string;
  plan: 'member' | 'free';
  source: 'Instagram' | 'TikTok' | 'Afiliasi Juara' | 'Direct Web' | 'WhatsApp';
  city: string;
  device: 'Android' | 'iPhone (iOS)' | 'Windows PC' | 'macOS';
  status: 'active' | 'new' | 'trial';
  linksCount: number;
  totalClicks: number;
  lastActive: string;
}

const INITIAL_JOINED_MEMBERS: JoinedMember[] = [
  {
    id: 'usr-join-01',
    name: 'Clarissa Maharani',
    email: 'clarissa.beauty@gmail.com',
    brandHandle: '@clarissabeauty',
    joinedAt: '2026-11-02T08:30:00Z',
    plan: 'member',
    source: 'Instagram',
    city: 'Jakarta Selatan',
    device: 'iPhone (iOS)',
    status: 'new',
    linksCount: 8,
    totalClicks: 1420,
    lastActive: '10 menit lalu',
  },
  {
    id: 'usr-join-02',
    name: 'Rizky Fadilah',
    email: 'rizky.store@outlook.com',
    brandHandle: '@rizkystore.id',
    joinedAt: '2026-11-02T07:15:00Z',
    plan: 'member',
    source: 'TikTok',
    city: 'Surabaya',
    device: 'Android',
    status: 'new',
    linksCount: 12,
    totalClicks: 3850,
    lastActive: '35 menit lalu',
  },
  {
    id: 'usr-join-03',
    name: 'Dinda Permata',
    email: 'dindamakeup.id@gmail.com',
    brandHandle: '@dindamakeup',
    joinedAt: '2026-11-01T21:40:00Z',
    plan: 'member',
    source: 'Afiliasi Juara',
    city: 'Bandung',
    device: 'iPhone (iOS)',
    status: 'active',
    linksCount: 5,
    totalClicks: 980,
    lastActive: '2 jam lalu',
  },
  {
    id: 'usr-join-04',
    name: 'Fajar Nugraha',
    email: 'fajarnugraha@gmail.com',
    brandHandle: '@fajarcreative',
    joinedAt: '2026-11-01T15:20:00Z',
    plan: 'free',
    source: 'Direct Web',
    city: 'Yogyakarta',
    device: 'Windows PC',
    status: 'trial',
    linksCount: 2,
    totalClicks: 210,
    lastActive: '5 jam lalu',
  },
  {
    id: 'usr-join-05',
    name: 'Siti Rahmawati',
    email: 'siti.hijabstyle@gmail.com',
    brandHandle: '@sitistyle.hijab',
    joinedAt: '2026-10-31T18:45:00Z',
    plan: 'member',
    source: 'Instagram',
    city: 'Semarang',
    device: 'Android',
    status: 'active',
    linksCount: 14,
    totalClicks: 4120,
    lastActive: '1 hari lalu',
  },
  {
    id: 'usr-join-06',
    name: 'Kevin Pratama',
    email: 'kevin.techreview@gmail.com',
    brandHandle: '@kevinpratama',
    joinedAt: '2026-10-31T11:10:00Z',
    plan: 'member',
    source: 'TikTok',
    city: 'Jakarta Barat',
    device: 'iPhone (iOS)',
    status: 'active',
    linksCount: 9,
    totalClicks: 5230,
    lastActive: '4 jam lalu',
  },
  {
    id: 'usr-join-07',
    name: 'Toko Hijab Surabaya',
    email: 'admin@hijabsurabaya.com',
    brandHandle: '@tokohijabsby',
    joinedAt: '2026-10-30T16:30:00Z',
    plan: 'member',
    source: 'Afiliasi Juara',
    city: 'Surabaya',
    device: 'macOS',
    status: 'active',
    linksCount: 19,
    totalClicks: 8940,
    lastActive: '1 jam lalu',
  },
  {
    id: 'usr-join-08',
    name: 'Dimas Prasetyo',
    email: 'dimas.sneakers@gmail.com',
    brandHandle: '@dimassneakers',
    joinedAt: '2026-10-30T09:20:00Z',
    plan: 'free',
    source: 'WhatsApp',
    city: 'Medan',
    device: 'Android',
    status: 'trial',
    linksCount: 3,
    totalClicks: 430,
    lastActive: '2 hari lalu',
  },
  {
    id: 'usr-join-09',
    name: 'Nabila Putri',
    email: 'nabila.fashionhub@gmail.com',
    brandHandle: '@nabilafashion',
    joinedAt: '2026-10-29T14:10:00Z',
    plan: 'member',
    source: 'Instagram',
    city: 'Bandung',
    device: 'iPhone (iOS)',
    status: 'active',
    linksCount: 7,
    totalClicks: 2340,
    lastActive: '3 jam lalu',
  },
  {
    id: 'usr-join-10',
    name: 'Budi Santoso',
    email: 'budi.elektronik@gmail.com',
    brandHandle: '@budigadget',
    joinedAt: '2026-10-28T19:00:00Z',
    plan: 'free',
    source: 'Direct Web',
    city: 'Denpasar, Bali',
    device: 'Windows PC',
    status: 'trial',
    linksCount: 1,
    totalClicks: 95,
    lastActive: '3 hari lalu',
  },
  {
    id: 'usr-join-11',
    name: 'Maya Anggraini',
    email: 'maya.skincare@gmail.com',
    brandHandle: '@mayaglow.id',
    joinedAt: '2026-10-27T10:15:00Z',
    plan: 'member',
    source: 'TikTok',
    city: 'Makassar',
    device: 'Android',
    status: 'active',
    linksCount: 11,
    totalClicks: 3110,
    lastActive: '6 jam lalu',
  },
  {
    id: 'usr-join-12',
    name: 'Hendra Wijaya',
    email: 'hendra.coffee@gmail.com',
    brandHandle: '@kopihendra',
    joinedAt: '2026-10-26T13:40:00Z',
    plan: 'member',
    source: 'Afiliasi Juara',
    city: 'Malang',
    device: 'Android',
    status: 'active',
    linksCount: 6,
    totalClicks: 1820,
    lastActive: '1 hari lalu',
  },
];

export const AdminUserAnalytics: React.FC = () => {
  const [members, setMembers] = useState<JoinedMember[]>(() => {
    try {
      const saved = localStorage.getItem('pulsetrack_joined_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const seenIds = new Set<string>();
          return parsed.map((m: any, idx: number) => {
            let id = m.id && typeof m.id === 'string' ? m.id : `usr-join-${Date.now()}-${idx}`;
            if (seenIds.has(id)) {
              id = `${id}-${idx}-${Math.random().toString(36).slice(2, 7)}`;
            }
            seenIds.add(id);
            return { ...m, id };
          });
        }
      }
      return INITIAL_JOINED_MEMBERS;
    } catch {
      return INITIAL_JOINED_MEMBERS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'all' | 'member' | 'free'>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMemberModal, setSelectedMemberModal] = useState<JoinedMember | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeChartTab, setActiveChartTab] = useState<'trend' | 'channel' | 'city'>('trend');

  useEffect(() => {
    localStorage.setItem('pulsetrack_joined_users', JSON.stringify(members));
  }, [members]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.brandHandle.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q);

      const matchPlan = selectedPlan === 'all' || m.plan === selectedPlan;
      const matchSource = selectedSource === 'all' || m.source === selectedSource;
      const matchStatus = selectedStatus === 'all' || m.status === selectedStatus;

      return matchSearch && matchPlan && matchSource && matchStatus;
    });
  }, [members, searchQuery, selectedPlan, selectedSource, selectedStatus]);

  // Key Metrics
  const metrics = useMemo(() => {
    const total = members.length;
    const vipCount = members.filter((m) => m.plan === 'member').length;
    const freeCount = total - vipCount;
    const conversionRate = total > 0 ? ((vipCount / total) * 100).toFixed(1) : '0';
    const totalTrafficGenerated = members.reduce((acc, m) => acc + m.totalClicks, 0);
    const estSubscriptionMonthly = vipCount * 60000;

    return {
      total,
      vipCount,
      freeCount,
      conversionRate,
      totalTrafficGenerated,
      estSubscriptionMonthly,
    };
  }, [members]);

  // Chart Data: Growth Trend (Last 7 Days)
  const growthTrendData = useMemo(() => {
    const days = [
      { date: '27 Okt', total: 6, vip: 4, free: 2 },
      { date: '28 Okt', total: 7, vip: 5, free: 2 },
      { date: '29 Okt', total: 8, vip: 6, free: 2 },
      { date: '30 Okt', total: 10, vip: 7, free: 3 },
      { date: '31 Okt', total: 11, vip: 8, free: 3 },
      { date: '01 Nov', total: 12, vip: 9, free: 3 },
      { date: '02 Nov (Hari Ini)', total: members.length, vip: metrics.vipCount, free: metrics.freeCount },
    ];
    return days;
  }, [members.length, metrics.vipCount, metrics.freeCount]);

  // Chart Data: Acquisition Sources
  const channelData = useMemo(() => {
    const counts: Record<string, number> = {};
    members.forEach((m) => {
      counts[m.source] = (counts[m.source] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      jumlah: count,
      persen: Math.round((count / members.length) * 100),
    }));
  }, [members]);

  // Chart Data: Top Cities
  const cityData = useMemo(() => {
    const counts: Record<string, number> = {};
    members.forEach((m) => {
      const cityKey = m.city.split(',')[0].replace(' Selatan', '').replace(' Barat', '');
      counts[cityKey] = (counts[cityKey] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, jumlah]) => ({ name, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah)
      .slice(0, 6);
  }, [members]);



  // Export filtered members to CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Nama Lengkap',
      'Email',
      'Akun Medsos / Brand',
      'Tanggal Bergabung (WIB)',
      'Paket',
      'Saluran Masuk',
      'Kota',
      'Perangkat',
      'Status Akun',
      'Jumlah Tautan',
      'Total Klik Trafik',
    ];

    const rows = filteredMembers.map((m) => [
      m.id,
      `"${m.name.replace(/"/g, '""')}"`,
      m.email,
      `"${m.brandHandle}"`,
      new Date(m.joinedAt).toLocaleString('id-ID'),
      m.plan === 'member' ? 'Member VIP (Rp 60rb)' : 'Free Tier',
      m.source,
      `"${m.city}"`,
      m.device,
      m.status,
      m.linksCount,
      m.totalClicks,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pulsetrack_daftar_pengguna_bergabung_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Berkas CSV anggota berhasil diunduh!');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl border border-slate-700 dark:border-slate-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Section Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                Master User & Member Analytics
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-bold">
                Eksklusif Super Admin
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Analisis Siapa Saja yang Bergabung di Website Ini
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Pantau seluruh pengguna yang mendaftar, asal saluran masuk (Instagram, TikTok, Afiliasi Juara), paket langganan, wilayah pendaftar, dan grafik tren pertumbuhan secara real-time.
            </p>
          </div>



          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-5">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Total Pendaftar</span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-mono font-black text-slate-900 dark:text-white">
              {metrics.total}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+100% Akun Terverifikasi</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50">
            <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 mb-1">
              <span className="text-xs font-semibold">Member VIP Aktif</span>
              <Crown className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-mono font-black text-amber-900 dark:text-amber-200">
              {metrics.vipCount}
            </div>
            <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium mt-1">
              Konversi: <strong>{metrics.conversionRate}%</strong> dari total pengguna
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/50">
            <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-400 mb-1">
              <span className="text-xs font-semibold">Pengguna Free Tier</span>
              <Activity className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-mono font-black text-indigo-900 dark:text-indigo-200">
              {metrics.freeCount}
            </div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">
              Potensi upgrade ke VIP
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50">
            <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 mb-1">
              <span className="text-xs font-semibold">Total Nilai Langganan</span>
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-mono font-black text-emerald-900 dark:text-emerald-200">
              Rp {metrics.estSubscriptionMonthly.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              Estimasi / bulan dari VIP
            </div>
          </div>
        </div>
      </div>

      {/* GRAFIK ANALISIS PENGGUNA BERGABUNG */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <span>Grafik Analisis Anggota & Pengguna Website</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Visualisasi tren bergabung, saluran rujukan, dan sebaran demografi kota di Indonesia.
            </p>
          </div>

          {/* Chart Segmented Switch */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveChartTab('trend')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeChartTab === 'trend'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tren Pertumbuhan
            </button>
            <button
              onClick={() => setActiveChartTab('channel')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeChartTab === 'channel'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Saluran Masuk
            </button>
            <button
              onClick={() => setActiveChartTab('city')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeChartTab === 'city'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Kota Terbanyak
            </button>
          </div>
        </div>

        {/* Chart View 1: Trend Pertumbuhan (AreaChart) */}
        {activeChartTab === 'trend' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Pertumbuhan Pengguna Terdaftar & Member VIP 7 Hari Terakhir</span>
              <span className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Total Pendaftar
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-amber-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Member VIP
                </span>
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradientTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradientVip" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Total Pendaftar"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#gradientTotal)"
                  />
                  <Area
                    type="monotone"
                    dataKey="vip"
                    name="Member VIP"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#gradientVip)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart View 2: Saluran Masuk (BarChart) */}
        {activeChartTab === 'channel' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Distribusi Saluran Asal Pendaftar (Rujukan Medsos & Web)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Instagram & TikTok mendominasi 70%+</span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                    formatter={(val: any) => [`${val} Pengguna`, 'Jumlah Pendaftar']}
                  />
                  <Bar dataKey="jumlah" fill="#8b5cf6" radius={[8, 8, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart View 3: Kota Terbanyak (BarChart) */}
        {activeChartTab === 'city' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Kota Asal Pengguna Bergabung Terbanyak di Indonesia</span>
              <span className="text-slate-400 font-mono">Berdasarkan geolokasi registrasi</span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                    formatter={(val: any) => [`${val} Pengguna`, 'Total Pendaftar']}
                  />
                  <Bar dataKey="jumlah" fill="#06b6d4" radius={[0, 8, 8, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* TABEL ANALISIS SIAPA SAJA YANG BERGABUNG */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Daftar Rinci Pengguna yang Telah Bergabung</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan {filteredMembers.length} dari {members.length} pengguna terdaftar di website
            </p>
          </div>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, email, medsos, kota..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            />
          </div>

          {/* Plan Filter */}
          <div>
            <select
              value={selectedPlan}
              onChange={(e: any) => setSelectedPlan(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            >
              <option value="all">Semua Paket (VIP & Free)</option>
              <option value="member">Hanya Member VIP (Rp 60rb)</option>
              <option value="free">Hanya Free Tier</option>
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            >
              <option value="all">Semua Saluran Masuk</option>
              <option value="Instagram">Instagram Bio</option>
              <option value="TikTok">TikTok Creator</option>
              <option value="Afiliasi Juara">Afiliasi Juara</option>
              <option value="Direct Web">Direct Web</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
          </div>

          {/* Reset button */}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedPlan('all');
              setSelectedSource('all');
              setSelectedStatus('all');
            }}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        </div>

        {/* Member Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <th className="py-3 px-3.5">Pengguna & Brand</th>
                <th className="py-3 px-3.5">Tanggal Bergabung</th>
                <th className="py-3 px-3.5">Paket</th>
                <th className="py-3 px-3.5">Saluran Masuk</th>
                <th className="py-3 px-3.5">Kota / Lokasi</th>
                <th className="py-3 px-3.5 text-right">Tautan & Trafik</th>
                <th className="py-3 px-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Tidak ditemukan pengguna yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m, index) => (
                  <tr
                    key={`${m.id}-${index}`}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    onClick={() => setSelectedMemberModal(m)}
                  >
                    {/* User & Brand */}
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          {m.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                            <span>{m.name}</span>
                            {m.status === 'new' && (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                BARU
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                            <span>{m.brandHandle}</span>
                            <span>·</span>
                            <span>{m.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      <div className="font-medium">
                        {new Date(m.joinedAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(m.joinedAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })} WIB
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      {m.plan === 'member' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                          <Crown className="w-3 h-3 text-amber-600" />
                          <span>Member VIP</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          <span>Free Tier</span>
                        </span>
                      )}
                    </td>

                    {/* Source */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                        m.source === 'Instagram'
                          ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                          : m.source === 'TikTok'
                          ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300'
                          : m.source === 'Afiliasi Juara'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {m.source}
                      </span>
                    </td>

                    {/* City */}
                    <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{m.city}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 pl-4">{m.device}</div>
                    </td>

                    {/* Links & Traffic */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {m.totalClicks.toLocaleString('id-ID')} klik
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {m.linksCount} tautan aktif
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMemberModal(m);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Lihat Detail Pengguna"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP MODAL: DETAIL PENGGUNA BERGABUNG */}
      {selectedMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative text-left space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMemberModal(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header Profile */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                {selectedMemberModal.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedMemberModal.name}
                  </h3>
                  {selectedMemberModal.plan === 'member' ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      VIP MEMBER
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600">
                      FREE TIER
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{selectedMemberModal.brandHandle} · {selectedMemberModal.email}</p>
              </div>
            </div>

            {/* Detail Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="text-slate-500 block text-[11px]">Waktu Bergabung:</span>
                <span className="font-semibold text-slate-900 dark:text-white block mt-0.5">
                  {new Date(selectedMemberModal.joinedAt).toLocaleString('id-ID')} WIB
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="text-slate-500 block text-[11px]">Saluran Pendaftaran:</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 block mt-0.5">
                  {selectedMemberModal.source}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="text-slate-500 block text-[11px]">Kota Asal:</span>
                <span className="font-semibold text-slate-900 dark:text-white block mt-0.5">
                  {selectedMemberModal.city}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="text-slate-500 block text-[11px]">Perangkat Digunakan:</span>
                <span className="font-semibold text-slate-900 dark:text-white block mt-0.5">
                  {selectedMemberModal.device}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="text-slate-500 block text-[11px]">Tautan yang Dibuat:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white block mt-0.5">
                  {selectedMemberModal.linksCount} tautan
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="text-slate-500 block text-[11px]">Total Klik Trafik:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  {selectedMemberModal.totalClicks.toLocaleString('id-ID')} klik
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-600 dark:text-slate-300">
              💡 <strong>Catatan Admin:</strong> Pengguna ini aktif mengalirkan trafik media sosial dan terdaftar aman di database PulseTrack.
            </div>

            <div className="pt-1 flex justify-end">
              <button
                onClick={() => setSelectedMemberModal(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
