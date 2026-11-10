import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { VideoAnalyticsItem } from '../types';
import { 
  Video, 
  Play, 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle, 
  MousePointerClick, 
  TrendingUp, 
  Clock, 
  Plus, 
  ExternalLink,
  Sparkles,
  CheckCircle2,
  X,
  Trash2
} from 'lucide-react';

export const VideoAnalyticsView: React.FC = () => {
  const { videos, links, stats, simulateInstantClick, addVideo, deleteVideo } = useAnalytics();
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form states for new video
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState<VideoAnalyticsItem['platform']>('TikTok');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newCreatorName, setNewCreatorName] = useState('');
  const [newCreatorHandle, setNewCreatorHandle] = useState('');
  const [newViews, setNewViews] = useState('150000');
  const [newDuration, setNewDuration] = useState('45');
  const [newPeakSecond, setNewPeakSecond] = useState('15');
  const [selectedLinkId, setSelectedLinkId] = useState(links[0]?.id || '');

  const filteredVideos = videos.filter((v) => {
    if (platformFilter === 'all') return true;
    return v.platform.toLowerCase().includes(platformFilter.toLowerCase());
  });

  const handleSimulateVideoClick = (video: VideoAnalyticsItem) => {
    const platformName = video.platform.includes('TikTok')
      ? 'TikTok'
      : video.platform.includes('Instagram')
      ? 'Instagram'
      : 'YouTube';

    simulateInstantClick({
      platform: platformName as any,
      videoId: video.id,
      linkId: video.trackedLinkId,
    });

    setNotification(`Klik baru dari vidio "${video.title.slice(0, 32)}..." berhasil dicatat!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteVideo = (video: VideoAnalyticsItem) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus video "${video.title}" secara manual dari analitik?`)) {
      deleteVideo(video.id);
      setNotification(`Video "${video.title.slice(0, 30)}..." berhasil dihapus.`);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newVideoUrl || !newCreatorHandle) return;

    addVideo({
      title: newTitle,
      platform: newPlatform,
      videoUrl: newVideoUrl,
      creatorName: newCreatorName || newCreatorHandle.replace('@', ''),
      creatorHandle: newCreatorHandle.startsWith('@') ? newCreatorHandle : `@${newCreatorHandle}`,
      thumbnailGradient: 'from-fuchsia-600 to-indigo-600',
      views: parseInt(newViews, 10) || 50000,
      likes: Math.round((parseInt(newViews, 10) || 50000) * 0.08),
      shares: Math.round((parseInt(newViews, 10) || 50000) * 0.015),
      comments: Math.round((parseInt(newViews, 10) || 50000) * 0.005),
      peakClickTimestamp: `00:${newPeakSecond.padStart(2, '0')}`,
      durationSeconds: parseInt(newDuration, 10) || 30,
      dropOffRate: 20,
      trackedLinkId: selectedLinkId || links[0]?.id || 'link-1',
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewVideoUrl('');
    setNewCreatorHandle('');
    setNotification('Vidio baru berhasil ditambahkan ke pemantau analitik!');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl shadow-lg animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-rose-500 uppercase tracking-wide">
              Video Attribution & Conversion
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Analitik Vidio Medsos (Reels, TikTok & Shorts)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pantau performa tayangan, waktu puncak penonton mengklik tautan, dan konversi dari setiap konten vidio.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Vidio untuk Dipantau</span>
        </button>
      </div>

      {/* Video KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Total Tayangan Vidio</span>
            <Eye className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {(stats.totalVideoViews / 1000).toFixed(1)}k
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              +18.4% bln ini
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Dari {videos.length} konten video aktif</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Total Klik dari Vidio</span>
            <MousePointerClick className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {stats.totalVideoClicks.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Real-time
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pengunjung menekan link bio/sticker</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Rata-rata CTR Vidio</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {stats.avgVideoCTR}%
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Target &gt; 2.0%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Rasio klik per 100 tayangan</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Detik Puncak Klik</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              00:18
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              rata-rata
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Saat Call to Action / Spill produk</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {[
          { id: 'all', label: 'Semua Platform' },
          { id: 'tiktok', label: 'TikTok' },
          { id: 'reels', label: 'Instagram Reels' },
          { id: 'shorts', label: 'YouTube Shorts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPlatformFilter(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              platformFilter === tab.id
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredVideos.map((video) => {
          const associatedLink = links.find((l) => l.id === video.trackedLinkId);
          const maxSpike = Math.max(...video.clickSpikes.map((s) => s.clicks), 1);

          return (
            <div
              key={video.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row: Platform and Creator */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        video.platform.includes('TikTok')
                          ? 'bg-black text-cyan-400'
                          : video.platform.includes('Instagram')
                          ? 'bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400'
                          : 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {video.platform}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      oleh {video.creatorHandle}
                    </span>
                  </div>

                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                    title="Buka Vidio Asli"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Video Title */}
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2 line-clamp-2">
                  {video.title}
                </h3>

                {/* Social Engagement Counters */}
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1 font-mono tabular-nums">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    {(video.views / 1000).toFixed(1)}k tayangan
                  </span>
                  <span className="flex items-center gap-1 font-mono tabular-nums">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    {(video.likes / 1000).toFixed(1)}k
                  </span>
                  <span className="flex items-center gap-1 font-mono tabular-nums">
                    <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                    {video.shares}
                  </span>
                  <span className="flex items-center gap-1 font-mono tabular-nums">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    {video.comments}
                  </span>
                </div>

                {/* Conversion & Click Performance */}
                <div className="grid grid-cols-3 gap-2 mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                  <div>
                    <div className="text-[11px] text-slate-400">Klik Tautan</div>
                    <div className="text-base font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                      {video.linkClicks.toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Rasio CTR</div>
                    <div className="text-base font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                      {video.clickThroughRate}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Puncak Klik</div>
                    <div className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      {video.peakClickTimestamp}
                    </div>
                  </div>
                </div>

                {/* Visual Timeline: Click Spikes across Video Duration */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span>Distribusi Klik Sepanjang Durasi Vidio (00:00 - 00:{video.durationSeconds})</span>
                    <span className="text-indigo-500 font-medium">Puncak: {video.peakClickTimestamp}</span>
                  </div>
                  <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg p-1.5 flex items-end gap-1.5">
                    {video.clickSpikes.map((spike, idx) => {
                      const heightPercent = Math.max((spike.clicks / maxSpike) * 100, 15);
                      const isPeak = spike.clicks === maxSpike;

                      return (
                        <div
                          key={idx}
                          className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                        >
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-xs transition-all ${
                              isPeak
                                ? 'bg-indigo-600 dark:bg-indigo-500'
                                : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-indigo-400'
                            }`}
                          />
                          {/* Tooltip on hover */}
                          <div className="absolute -top-7 hidden group-hover:flex px-1.5 py-0.5 bg-slate-900 text-white text-[10px] rounded-sm whitespace-nowrap z-10 pointer-events-none">
                            Detik {spike.second}s: {spike.clicks} klik
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Linked Tracking Link */}
                {associatedLink && (
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="truncate max-w-[200px]">
                      Tautan: <strong className="text-slate-700 dark:text-slate-300 font-mono">/r/{associatedLink.slug}</strong>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Penempatan: {associatedLink.placement}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button: Delete & Simulate Click */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleDeleteVideo(video)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg transition-colors cursor-pointer"
                  title="Hapus video ini secara manual"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Vidio</span>
                </button>

                <button
                  onClick={() => handleSimulateVideoClick(video)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Uji Klik Vidio</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Tambah Vidio Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div 
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Tambah Konten Vidio Medsos
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Pantau konversi klik dari konten TikTok, Instagram Reels, atau YouTube Shorts Anda.
              </p>
            </div>

            <form onSubmit={handleCreateVideo} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Judul Vidio / Konten
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Racun Skincare Glowing 7 Hari Pemakaian"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Platform Vidio
                  </label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="TikTok">TikTok</option>
                    <option value="Instagram Reels">Instagram Reels</option>
                    <option value="YouTube Shorts">YouTube Shorts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Username Creator
                  </label>
                  <input
                    type="text"
                    required
                    value={newCreatorHandle}
                    onChange={(e) => setNewCreatorHandle(e.target.value)}
                    placeholder="@username.id"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tautan Video (URL)
                </label>
                <input
                  type="url"
                  required
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://tiktok.com/@creator/video/123456"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Estimasi Tayangan
                  </label>
                  <input
                    type="number"
                    value={newViews}
                    onChange={(e) => setNewViews(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Durasi (Detik)
                  </label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Detik Spill CTA
                  </label>
                  <input
                    type="number"
                    value={newPeakSecond}
                    onChange={(e) => setNewPeakSecond(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Hubungkan dengan Tautan Pendek
                </label>
                <select
                  value={selectedLinkId}
                  onChange={(e) => setSelectedLinkId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                >
                  {links.map((l) => (
                    <option key={l.id} value={l.id}>
                      /r/{l.slug} - {l.title} ({l.platform})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Simpan & Pantau
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
