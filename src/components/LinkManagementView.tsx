import React, { useState, useMemo } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { useTrafficAlert } from '../context/TrafficAlertContext';
import { TrackedLink, SocialPlatform } from '../types';
import { exportToCSV } from '../utils/exportUtils';
import { getTagStyle } from '../utils/tagUtils';
import { 
  Link2, 
  Plus, 
  Copy, 
  Check, 
  QrCode, 
  ExternalLink, 
  Trash2, 
  Search, 
  Filter,
  Play,
  ArrowUpRight,
  TrendingUp,
  MousePointerClick,
  Download,
  Tag,
  Sparkles,
  Layers,
  Bell,
  CheckCircle2
} from 'lucide-react';

interface LinkManagementViewProps {
  onOpenCreateModal: () => void;
  onOpenQrModal: (link: TrackedLink) => void;
  onOpenTestRedirect: (slug: string) => void;
}

export const LinkManagementView: React.FC<LinkManagementViewProps> = ({
  onOpenCreateModal,
  onOpenQrModal,
  onOpenTestRedirect,
}) => {
  const { links, deleteLink, toggleLinkStatus, deletionNotice } = useAnalytics();
  const { openAlertModal } = useTrafficAlert();
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/r/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  // Grouping & Tag distribution computation
  const tagStats = useMemo(() => {
    const counts: Record<string, { count: number; clicks: number }> = {};
    links.forEach((l) => {
      (l.tags || []).forEach((t) => {
        if (!counts[t]) counts[t] = { count: 0, clicks: 0 };
        counts[t].count += 1;
        counts[t].clicks += l.totalClicks;
      });
    });

    return Object.entries(counts)
      .map(([tag, data]) => ({ tag, ...data }))
      .sort((a, b) => b.clicks - a.clicks);
  }, [links]);

  const filteredLinks = links.filter((l) => {
    if (platformFilter !== 'all' && l.platform.toLowerCase() !== platformFilter.toLowerCase()) {
      return false;
    }
    if (selectedTagFilter !== 'all' && !(l.tags || []).includes(selectedTagFilter)) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const inTags = (l.tags || []).some((t) => t.toLowerCase().includes(q));
      return (
        l.title.toLowerCase().includes(q) ||
        l.slug.toLowerCase().includes(q) ||
        l.destinationUrl.toLowerCase().includes(q) ||
        inTags
      );
    }
    return true;
  });

  return (
    <div className="space-y-5 text-left">
      {deletionNotice && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-200 shadow-sm animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold">{deletionNotice}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              Pengelompokan Trafik & Pelacak Tautan
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Kelola Tautan & Auto-Tagging Sumber
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Setiap tautan secara otomatis diberi tag berdasarkan platform (Instagram, TikTok, WhatsApp) dan penempatan untuk mempermudah analisis tanpa label manual.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              exportToCSV({
                links,
                stats: {
                  totalClicks: links.reduce((s, l) => s + l.totalClicks, 0),
                  uniqueVisitors: links.reduce((s, l) => s + l.uniqueClicks, 0),
                  activeNow: 12,
                  topPlatform: { platform: 'Instagram', count: 1200, percentage: 45 },
                  mobileShare: 85,
                  totalVideoViews: 1000000,
                  totalVideoClicks: 25000,
                  avgVideoCTR: 2.5,
                },
                platformBreakdown: [],
                cityBreakdown: [],
                user: null,
                timeRange: 'all',
              });
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Tautan Medsos Baru</span>
          </button>
        </div>
      </div>

      {/* Auto-Tagging Feature Highlight Banner */}
      <div className="bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-pink-50/40 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-pink-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Sistem Auto-Tagging Sumber Aktif</span>
              <span className="px-2 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-[10px] font-semibold">
                Otomatis
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Tautan otomatis diidentifikasi dengan tag sumber (misal: <code>#instagram</code>, <code>#tiktok</code>, <code>#bio-link</code>, <code>#reels</code>). Klik salah satu tag di bawah untuk memfilter grup trafik.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">Total Tag Terdeteksi:</span>
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/40 shadow-2xs">
            {tagStats.length} Tag
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari tautan berdasarkan judul, slug, URL, atau #tag..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
        </div>

        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Semua Platform Medsos</option>
          <option value="Instagram">Instagram</option>
          <option value="TikTok">TikTok</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="YouTube">YouTube</option>
          <option value="X (Twitter)">X (Twitter)</option>
        </select>
      </div>

      {/* Tag Source Filter Grouping Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="flex items-center gap-1 font-semibold text-slate-500 shrink-0 text-[11px] mr-1">
          <Tag className="w-3.5 h-3.5 text-indigo-500" />
          <span>Grup Tag:</span>
        </span>

        <button
          onClick={() => setSelectedTagFilter('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
            selectedTagFilter === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-750 hover:bg-slate-50'
          }`}
        >
          Semua Tag ({links.length})
        </button>

        {tagStats.map(({ tag, count, clicks }) => {
          const isSelected = selectedTagFilter === tag;
          const style = getTagStyle(tag);

          return (
            <button
              key={tag}
              onClick={() => setSelectedTagFilter(isSelected ? 'all' : tag)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer border ${
                isSelected
                  ? 'ring-2 ring-indigo-500 ring-offset-1 font-bold shadow-xs ' + style.bg + ' ' + style.text + ' ' + style.border
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              <span>#{tag}</span>
              <span className="text-[10px] text-slate-400 font-sans tabular-nums ml-0.5">
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Links Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Tautan & Auto-Tags</th>
                <th className="py-3 px-3">Platform & Penempatan</th>
                <th className="py-3 px-3 text-right">Total Klik</th>
                <th className="py-3 px-3 text-right">Pengunjung Unik</th>
                <th className="py-3 px-4 text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Tag className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        Tidak ada tautan yang cocok
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Coba bersihkan pencarian atau pilih opsi "Semua Tag".
                      </p>
                      {selectedTagFilter !== 'all' && (
                        <button
                          onClick={() => setSelectedTagFilter('all')}
                          className="px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg hover:underline mt-2 inline-block cursor-pointer"
                        >
                          Tampilkan Semua Tag
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => (
                  <tr
                    key={link.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Title, Short Slug, and Auto-Tags */}
                    <td className="py-3.5 px-4 max-w-[320px]">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">
                        {link.title}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-medium">
                          /r/{link.slug}
                        </span>
                        <button
                          onClick={() => handleCopyLink(link.slug)}
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                          title="Salin tautan"
                        >
                          {copiedSlug === link.slug ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                        {link.destinationUrl}
                      </div>

                      {/* Auto-Tags Badges */}
                      <div className="flex flex-wrap items-center gap-1 mt-2">
                        {(link.tags && link.tags.length > 0 ? link.tags : [link.platform.toLowerCase()]).map((t) => {
                          const style = getTagStyle(t);
                          const isTagActive = selectedTagFilter === t;

                          return (
                            <button
                              key={t}
                              onClick={() => setSelectedTagFilter(isTagActive ? 'all' : t)}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono border transition-all cursor-pointer ${
                                isTagActive 
                                  ? 'ring-1 ring-indigo-500 font-bold shadow-2xs ' + style.bg + ' ' + style.text + ' ' + style.border
                                  : style.bg + ' ' + style.text + ' ' + style.border + ' hover:opacity-80'
                              }`}
                              title={`Klik untuk filter grup #${t}`}
                            >
                              <span className={`w-1 h-1 rounded-full ${style.dot}`} />
                              <span>#{t}</span>
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    {/* Platform & Placement */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {link.platform}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {link.placement}
                      </div>
                      {link.linkedVideoId && (
                        <div className="mt-1 text-[10px] text-pink-600 dark:text-pink-400 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                          <span>Terhubung ke Vidio</span>
                        </div>
                      )}
                    </td>

                    {/* Total Clicks */}
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white text-sm">
                      {link.totalClicks.toLocaleString('id-ID')}
                    </td>

                    {/* Unique Visitors */}
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {link.uniqueClicks.toLocaleString('id-ID')}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Test Real Redirection */}
                        <button
                          onClick={() => onOpenTestRedirect(link.slug)}
                          title="Buka Halaman Pengalihan Asli"
                          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        {/* Traffic Spike Alert Setup */}
                        <button
                          onClick={() => openAlertModal('rules')}
                          title="Atur Ambang Batas & Notifikasi Lonjakan untuk Tautan Ini"
                          className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </button>

                        {/* QR Code */}
                        <button
                          onClick={() => onOpenQrModal(link)}
                          title="Lihat Kode QR"
                          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (confirm(`Hapus tautan "${link.title}"?`)) {
                              deleteLink(link.id);
                            }
                          }}
                          title="Hapus Tautan"
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
