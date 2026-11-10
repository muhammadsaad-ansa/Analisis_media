/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { TrendingProductItem, TrendingVideoItem, TrendingCommercialType } from '../types';
import { INITIAL_TRENDING_PRODUCTS, INITIAL_TRENDING_VIDEOS } from '../data/trendingData';
import { useAnalytics } from '../context/AnalyticsContext';
import {
  Flame,
  Video,
  Package,
  TrendingUp,
  Share2,
  ExternalLink,
  Copy,
  Check,
  Search,
  Filter,
  DollarSign,
  Play,
  Sparkles,
  Crown,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  Music,
  ShoppingBag,
  CheckCircle2,
  Zap,
  ArrowUpRight
} from 'lucide-react';

interface TrendingRadarViewProps {
  onOpenCreateLinkWithData?: (data: { title: string; destinationUrl: string; platform: string }) => void;
}

export const TrendingRadarView: React.FC<TrendingRadarViewProps> = ({
  onOpenCreateLinkWithData,
}) => {
  const { addLink, setActiveTab } = useAnalytics();

  const [activeSubTab, setActiveSubTab] = useState<'products' | 'videos'>('products');
  const [commercialType, setCommercialType] = useState<TrendingCommercialType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [linkCreatedNotice, setLinkCreatedNotice] = useState<string | null>(null);

  const categories = useMemo(() => {
    return Array.from(new Set(INITIAL_TRENDING_PRODUCTS.map((p) => p.category)));
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return INITIAL_TRENDING_PRODUCTS.filter((p) => {
      if (commercialType !== 'all' && p.type !== commercialType) return false;
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [commercialType, categoryFilter, searchQuery]);

  // Filtered Videos
  const filteredVideos = useMemo(() => {
    return INITIAL_TRENDING_VIDEOS.filter((v) => {
      if (commercialType !== 'all' && v.type !== commercialType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          v.title.toLowerCase().includes(q) ||
          v.creatorName.toLowerCase().includes(q) ||
          v.creatorHandle.toLowerCase().includes(q) ||
          v.associatedProductName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [commercialType, searchQuery]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleQuickTrackProduct = (prod: TrendingProductItem) => {
    const slug = `${prod.name.slice(0, 15).toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
    const platform = prod.topPlatform.includes('TikTok') ? 'TikTok' : prod.topPlatform.includes('Instagram') ? 'Instagram' : 'WhatsApp';
    
    addLink({
      title: prod.name,
      slug,
      destinationUrl: prod.affiliateLinkSample,
      platform: platform as any,
      placement: prod.type === 'affiliate' ? 'Keranjang Kuning / Bio Afiliasi' : 'Toko Direct Link',
      utmCampaign: `trending_${prod.type}_${Date.now().toString().slice(-4)}`,
      utmMedium: 'social_trending',
      tags: ['trending', prod.type, prod.category.toLowerCase().split(' ')[0]],
    });

    setLinkCreatedNotice(`✓ Tautan pelacak PulseTrack berhasil dibuat untuk "${prod.name}" (/r/${slug})! Klik telah siap dipantau.`);
    setTimeout(() => setLinkCreatedNotice(null), 4500);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-amber-950 to-slate-900 text-white rounded-2xl p-5 border border-rose-800/40 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider bg-rose-900/60 px-2 py-0.5 rounded-full border border-rose-700/60 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                Live Trending Commerce Radar
              </span>
              <span className="text-xs text-rose-300">·</span>
              <span className="text-xs text-rose-200">
                Pembaruan Setiap Jam
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Radar Produk & Vidio yang Sedang Tren (Trending)
            </h2>
            <p className="text-xs text-rose-200 max-w-2xl leading-relaxed">
              Temukan produk dan video media sosial yang sedang viral dengan konversi tertinggi. Bandingkan peluang <strong>Produk Afiliasi (Cuan Komisi)</strong> dan <strong>Produk Non-Afiliasi (Brand/Direct Toko Sendiri)</strong>, lalu mulai lacak kliknya dalam 1 klik!
            </p>
          </div>

          {/* Quick Metrics Header Pill */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-rose-700/50 rounded-xl p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Top Viral Product</span>
              <span className="text-xs sm:text-sm font-bold text-rose-400 truncate block max-w-[100px]">
                Serum 10% Niacinamide
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Komisi Tertinggi</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                Rp 41.880 / unit
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Pertumbuhan 24h</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-amber-400">
                +340% Lonjakan
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Top Video CTR</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-cyan-400">
                4.8% CTR
              </span>
            </div>
          </div>
        </div>
      </div>

      {linkCreatedNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-2 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold">{linkCreatedNotice}</span>
          </div>
          <button
            onClick={() => setActiveTab('links')}
            className="text-[11px] underline font-bold hover:text-emerald-950 dark:hover:text-white"
          >
            Lihat di Daftar Tautan &rarr;
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs & Filtering Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          {/* Sub-tabs switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveSubTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'products'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>🔥 Produk Trending ({filteredProducts.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('videos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'videos'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>🎬 Vidio Trending ({filteredVideos.length})</span>
            </button>
          </div>

          {/* Commercial Type Filter (Affiliate vs Non-Affiliate) */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <span className="text-slate-400 px-2 font-medium hidden md:inline">Model:</span>
            <button
              onClick={() => setCommercialType('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                commercialType === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setCommercialType('affiliate')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                commercialType === 'affiliate'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Afiliasi (Komisi)</span>
            </button>
            <button
              onClick={() => setCommercialType('non_affiliate')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                commercialType === 'non_affiliate'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-indigo-700 dark:text-indigo-400 hover:text-indigo-900'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Non-Afiliasi (Brand/Direct)</span>
            </button>
          </div>
        </div>

        {/* Search & Category Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                categoryFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Semua Kategori
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari produk, kreator, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs w-full sm:w-60"
            />
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: TRENDING PRODUCTS */}
      {activeSubTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-rose-500/50 transition-all group"
            >
              <div className="space-y-3">
                {/* Header: Rank, Viral Score & Type */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-rose-500 text-white font-mono font-black text-xs flex items-center justify-center shadow-xs">
                      #{prod.trendingRank}
                    </span>
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 font-mono bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Skor Viral: {prod.viralScore}/100
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      prod.type === 'affiliate'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                    }`}
                  >
                    {prod.type === 'affiliate' ? 'Afiliasi Komisi' : 'Brand Sendiri / Direct'}
                  </span>
                </div>

                {/* Product Name & Brand */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {prod.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{prod.brandName}</span>
                    <span>·</span>
                    <span>{prod.category}</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {prod.badges.map((b) => (
                    <span
                      key={b}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {/* Price & Commission / Margin Box */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Harga Jual</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                        Rp {prod.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    {prod.originalPrice > prod.price && (
                      <span className="text-[11px] text-slate-400 line-through font-mono">
                        Rp {prod.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    {prod.type === 'affiliate' ? (
                      <>
                        <span className="text-slate-500">Komisi Kreator:</span>
                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block text-xs">
                            Rp {prod.commissionAmount.toLocaleString('id-ID')} ({prod.commissionRate}%)
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-500">Margin Laba Toko:</span>
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                          {prod.grossMarginPercent}% Margin Bersih
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Terjual 24 Jam:</span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                      {prod.unitsSold24h.toLocaleString('id-ID')} unit (+{prod.growth24h}%)
                    </span>
                  </div>
                </div>

                {/* Viral Hook Tip */}
                <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-amber-800 dark:text-amber-300">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ide Hook Video Viral:</span>
                  </div>
                  <p className="italic leading-relaxed">
                    "{prod.hookStrategy}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => handleQuickTrackProduct(prod)}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  title="Buat pelacak link langsung di PulseTrack"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>⚡ Lacak di PulseTrack</span>
                </button>

                <button
                  onClick={() => handleCopy(prod.id, prod.affiliateLinkSample)}
                  className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Salin Link Produk"
                >
                  {copiedId === prod.id ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 2: TRENDING VIDEOS */}
      {activeSubTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((vid) => (
            <div
              key={vid.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between hover:border-pink-500/50 transition-all group"
            >
              {/* Thumbnail Simulated Banner */}
              <div className={`h-36 bg-gradient-to-tr ${vid.thumbnailGradient} p-4 text-white flex flex-col justify-between relative`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
                    {vid.platform}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                    {vid.type === 'affiliate' ? 'Keranjang Afiliasi' : 'Brand Video'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold bg-rose-600 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                      <Flame className="w-3 h-3 text-white" />
                      {vid.viralVelocity}
                    </span>
                    <span className="text-[11px] font-mono font-bold bg-black/50 px-2 py-0.5 rounded-md">
                      CTR: {vid.ctr}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Video Details */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {vid.title}
                  </h4>

                  {/* Creator Info */}
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        {vid.creatorName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {vid.creatorHandle} · {vid.creatorFollowers} followers
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {vid.publishedHoursAgo} jam lalu
                    </span>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-4 gap-2 text-center text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Tayangan</span>
                      <span className="font-bold text-slate-900 dark:text-white text-xs">
                        {(vid.viewsCount / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Likes</span>
                      <span className="font-bold text-rose-500 text-xs">
                        {(vid.likesCount / 1000).toFixed(0)}k
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Klik Link</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                        {(vid.linkClicks / 1000).toFixed(1)}k
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Estimasi</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        Rp {(vid.estimatedEarnings / 1000000).toFixed(0)}Jt
                      </span>
                    </div>
                  </div>

                  {/* Sound Info */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Music className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <span className="truncate">{vid.soundViral}</span>
                  </div>

                  {/* Hook Text */}
                  <div className="p-2.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-[11px] text-rose-950 dark:text-rose-200">
                    <span className="font-bold block mb-0.5 text-rose-700 dark:text-rose-300">
                      🎯 Hook Pembuka 3 Detik:
                    </span>
                    <p className="italic">"{vid.hookText}"</p>
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <a
                    href={vid.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Tonton Video & Analisis</span>
                  </a>

                  <button
                    onClick={() => handleCopy(vid.id, vid.videoUrl)}
                    className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Salin Tautan Video"
                  >
                    {copiedId === vid.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
