import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { ClickEvent, SocialPlatform } from '../types';
import { 
  Activity, 
  Search, 
  Filter, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Play, 
  Radio, 
  Clock, 
  MapPin, 
  ExternalLink,
  ShieldCheck,
  Video,
  ArrowUpRight
} from 'lucide-react';

export const LiveClickStreamView: React.FC = () => {
  const { 
    clickEvents, 
    isSimulatingLiveTraffic, 
    toggleLiveSimulation, 
    simulateInstantClick,
    links
  } = useAnalytics();

  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<ClickEvent | null>(null);
  const [, setTick] = useState(0);

  // Force tick every 5 seconds to update relative times
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  const getRelativeTime = (isoString: string) => {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 5) return 'Baru saja';
    if (diff < 60) return `${diff} dtk lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
  };

  const filteredEvents = clickEvents.filter((event) => {
    if (platformFilter !== 'all' && event.platform.toLowerCase() !== platformFilter.toLowerCase()) {
      return false;
    }
    if (deviceFilter !== 'all' && event.device.toLowerCase() !== deviceFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCity = event.city.toLowerCase().includes(q);
      const matchSlug = event.linkSlug.toLowerCase().includes(q);
      const matchTitle = event.linkTitle.toLowerCase().includes(q);
      const matchIP = event.ipSnippet.toLowerCase().includes(q);
      if (!matchCity && !matchSlug && !matchTitle && !matchIP) return false;
    }
    return true;
  });

  const getPlatformBadgeStyle = (platform: SocialPlatform) => {
    switch (platform) {
      case 'Instagram':
        return 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-900/50';
      case 'TikTok':
        return 'bg-slate-900 text-cyan-400 border border-slate-700';
      case 'WhatsApp':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50';
      case 'YouTube':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50';
      case 'X (Twitter)':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device === 'Desktop') return <Laptop className="w-3.5 h-3.5" />;
    if (device === 'Tablet') return <Tablet className="w-3.5 h-3.5" />;
    return <Smartphone className="w-3.5 h-3.5" />;
  };

  return (
    <div className="space-y-5 text-left">
      {/* Header and Live Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              Streaming Pengunjung Nyata
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Siapa Saja yang Menekan Tautan Medsos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Log pengunjung individual seketika saat mereka mengklik tautan di bio, story, atau video medsos Anda.
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => simulateInstantClick()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Kirim Klik Uji Coba</span>
          </button>

          <button
            onClick={toggleLiveSimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
              isSimulatingLiveTraffic
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isSimulatingLiveTraffic ? 'animate-pulse text-emerald-500' : ''}`} />
            <span>{isSimulatingLiveTraffic ? 'Jeda Stream' : 'Lanjutkan Stream'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan kota, tautan slug, IP, atau nama kampanye..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 whitespace-nowrap"
          >
            <option value="all">Semua Medsos</option>
            <option value="Instagram">Instagram</option>
            <option value="TikTok">TikTok</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="YouTube">YouTube</option>
            <option value="X (Twitter)">X (Twitter)</option>
          </select>

          <select
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 whitespace-nowrap"
          >
            <option value="all">Semua Perangkat</option>
            <option value="Mobile">Mobile (HP)</option>
            <option value="Desktop">Desktop (PC/Laptop)</option>
            <option value="Tablet">Tablet</option>
          </select>
        </div>
      </div>

      {/* Live Stream List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80">
        <div className="p-3 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between text-xs text-slate-500 font-medium px-4">
          <span>Menampilkan {filteredEvents.length} entri klik terbaru</span>
          <span className="font-mono tabular-nums text-slate-400">Pembaruan otomatis tiap 7 dtk</span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Tidak ada klik yang sesuai dengan filter pencarian.
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => setSelectedEvent(evt)}
              className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left cursor-pointer group"
            >
              {/* Left Column: Social source, Visitor City & Device */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold ${getPlatformBadgeStyle(evt.platform)}`}>
                    {evt.platform}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {evt.city}, {evt.country}
                    </span>
                    <span className="text-slate-400 text-xs">·</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {getDeviceIcon(evt.device)}
                      <span>{evt.os}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span className="truncate max-w-[200px]">{evt.browser}</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums text-slate-400">{evt.ipSnippet}</span>
                    {evt.videoTitle && (
                      <>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-[220px]">
                          <Video className="w-3 h-3" />
                          <span>{evt.videoTitle}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Destination Link & Relative Time */}
              <div className="flex items-center justify-between sm:justify-end gap-4 text-right pl-11 sm:pl-0">
                <div>
                  <div className="flex items-center sm:justify-end gap-1.5 text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400">
                    <span>/r/{evt.linkSlug}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Kampanye: {evt.utmCampaign || 'organic'}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-300">
                    {getRelativeTime(evt.timestamp)}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {new Date(evt.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Visitor Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-left relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${getPlatformBadgeStyle(selectedEvent.platform)}`}>
                  {selectedEvent.platform}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {selectedEvent.ipSnippet}
                </span>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Tutup
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-400">Tautan yang Ditekan:</span>
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                  {selectedEvent.linkTitle} (/r/{selectedEvent.linkSlug})
                </p>
              </div>

              <div>
                <span className="text-slate-400">URL Tujuan Akhir:</span>
                <p className="font-mono text-indigo-600 dark:text-indigo-400 break-all mt-0.5">
                  {selectedEvent.destinationUrl}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400">Lokasi Pengunjung</span>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                    {selectedEvent.city}, {selectedEvent.country}
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400">Perangkat & OS</span>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                    {selectedEvent.device} ({selectedEvent.os})
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-slate-400">Browser / User Agent</span>
                <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedEvent.browser}
                </p>
              </div>

              {selectedEvent.videoTitle && (
                <div className="p-2.5 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">Asal Konten Vidio</span>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                    {selectedEvent.videoTitle}
                  </p>
                </div>
              )}

              <div className="text-[11px] font-mono text-slate-400 pt-1">
                Dicatat pada: {new Date(selectedEvent.timestamp).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
