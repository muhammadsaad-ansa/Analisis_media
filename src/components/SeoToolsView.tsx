/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { TrackedLink } from '../types';
import { Share2, Globe, Image as ImageIcon, Sparkles, CheckCircle2, Link2, ExternalLink, MessageCircle, Twitter, Facebook, Linkedin, Copy } from 'lucide-react';

export const SeoToolsView: React.FC = () => {
  const { links, updateLinkOgTags } = useAnalytics();
  
  const [selectedLinkId, setSelectedLinkId] = useState<string>(links[0]?.id || '');
  const selectedLink = links.find((l) => l.id === selectedLinkId) || links[0];

  const [ogTitle, setOgTitle] = useState(selectedLink?.ogTitle || selectedLink?.title || '');
  const [ogDescription, setOgDescription] = useState(selectedLink?.ogDescription || `Akses tautan eksklusif dari ${selectedLink?.platform || 'Media Sosial'} untuk mendapatkan penawaran spesial.`);
  const [ogImageUrl, setOgImageUrl] = useState(selectedLink?.ogImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80');
  const [previewPlatform, setPreviewPlatform] = useState<'whatsapp' | 'facebook' | 'twitter' | 'linkedin'>('whatsapp');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // When selected link changes, update form states
  const handleSelectLink = (linkId: string) => {
    setSelectedLinkId(linkId);
    const link = links.find((l) => l.id === linkId);
    if (link) {
      setOgTitle(link.ogTitle || link.title);
      setOgDescription(link.ogDescription || `Akses tautan eksklusif dari ${link.platform} untuk mendapatkan penawaran spesial.`);
      setOgImageUrl(link.ogImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80');
    }
  };

  const handleSaveOgTags = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLink) return;

    updateLinkOgTags(selectedLink.id, {
      ogTitle,
      ogDescription,
      ogImageUrl,
    });

    setSavedNotice('Tag Open Graph (OG) berhasil disimpan dan diterapkan pada tautan!');
    setTimeout(() => {
      setSavedNotice(null);
    }, 3500);
  };

  const handleApplyAiPreset = (type: 'viral' | 'urgency' | 'discount') => {
    if (type === 'viral') {
      setOgTitle(`🔥 [Viral 2026] ${selectedLink?.title || 'Penawaran Spesial'} - Wajib Nonton!`);
      setOgDescription(`Ribuan orang telah mengakses tautan ini hari ini. Jangan sampai kehabisan diskon eksklusifnya!`);
    } else if (type === 'urgency') {
      setOgTitle(`⏰ [TERBATAS HARI INI] ${selectedLink?.title || 'Promo Khusus'}`);
      setOgDescription(`Promo spesial ini hanya berlaku dalam 24 jam ke depan. Klik sekarang sebelum kuota habis!`);
    } else {
      setOgTitle(`💰 Diskon Spesial 50% - ${selectedLink?.title || 'Produk Pilihan'}`);
      setOgDescription(`Dapatkan harga termurah langsung dari produsen resmi. Garansi 100% original!`);
    }
  };

  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://pulsetrack.io';
  const fullShareUrl = `${currentDomain}/r/${selectedLink?.slug || 'promo'}`;

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-indigo-950 to-slate-900 border border-violet-800/50 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold uppercase tracking-wider border border-violet-400/30 flex items-center gap-1">
                <Globe className="w-3 h-3 text-violet-400" />
                <span>Pusat SEO & OpenGraph</span>
              </span>
              <span className="text-xs text-violet-300 font-mono">Social Share Preview</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">SEO Tools & Open Graph Tag Manager</h2>
            <p className="text-xs text-violet-200 mt-1 max-w-2xl">
              Kustomisasi tag meta Open Graph (`og:title`, `og:description`, `og:image`) untuk setiap tautan pelacak Anda agar tampil memukau saat dibagikan di WhatsApp, Facebook, X (Twitter), dan LinkedIn.
            </p>
          </div>
        </div>
      </div>

      {savedNotice && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-200 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold">{savedNotice}</span>
        </div>
      )}

      {/* Main Grid: Form Editor & Live Social Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Link Selector & OG Editor Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pilih & Edit Tautan Target</h3>
              <p className="text-xs text-slate-500">Pilih tautan pelacak yang ingin dioptimalkan tag SEO-nya</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg font-semibold">
              {links.length} Tautan Aktif
            </span>
          </div>

          {/* Link Selector Dropdown */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-xs text-slate-700 dark:text-slate-300">
              Pilih Tautan Pelacak
            </label>
            <select
              value={selectedLinkId}
              onChange={(e) => handleSelectLink(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-violet-500"
            >
              {links.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title} (/r/{l.slug} · {l.platform})
                </option>
              ))}
            </select>
          </div>

          {/* AI Copy Generator Quick Helpers */}
          <div className="p-3 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/60 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-violet-900 dark:text-violet-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                <span>Preset AI Optimasi Copywriting</span>
              </span>
              <span className="text-[10px] text-violet-500 font-normal">Klik untuk isi otomatis</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleApplyAiPreset('viral')}
                className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors cursor-pointer"
              >
                🔥 Gaya Viral 2026
              </button>
              <button
                type="button"
                onClick={() => handleApplyAiPreset('urgency')}
                className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors cursor-pointer"
              >
                ⏰ Urgensi 24 Jam
              </button>
              <button
                type="button"
                onClick={() => handleApplyAiPreset('discount')}
                className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors cursor-pointer"
              >
                💰 Diskon Eksklusif
              </button>
            </div>
          </div>

          {/* OG Form */}
          <form onSubmit={handleSaveOgTags} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Open Graph Title (<code className="text-violet-600 dark:text-violet-400">og:title</code>)
                </label>
                <span className="text-[11px] font-mono text-slate-400">{ogTitle.length}/60 karakter</span>
              </div>
              <input
                type="text"
                value={ogTitle}
                onChange={(e) => setOgTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-violet-500"
                placeholder="Judul menarik untuk kartu media sosial"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Open Graph Description (<code className="text-violet-600 dark:text-violet-400">og:description</code>)
                </label>
                <span className="text-[11px] font-mono text-slate-400">{ogDescription.length}/160 karakter</span>
              </div>
              <textarea
                value={ogDescription}
                onChange={(e) => setOgDescription(e.target.value)}
                rows={3}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-violet-500"
                placeholder="Deskripsi singkat yang menggugah rasa ingin tahu audiens"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Open Graph Image URL (<code className="text-violet-600 dark:text-violet-400">og:image</code>)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={ogImageUrl}
                  onChange={(e) => setOgImageUrl(e.target.value)}
                  required
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono text-[11px] focus:outline-none focus:border-violet-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <p className="text-[11px] text-slate-400">Rekomendasi rasio gambar 1.91:1 (1200 x 630 piksel) untuk hasil terbaik.</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Tag Open Graph Tautan</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Social Share Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pratinjau Bagikan (Social Preview)</h3>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setPreviewPlatform('whatsapp')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${previewPlatform === 'whatsapp' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500 hover:text-white'}`}
                  title="WhatsApp Preview"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewPlatform('facebook')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${previewPlatform === 'facebook' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-white'}`}
                  title="Facebook Preview"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewPlatform('twitter')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${previewPlatform === 'twitter' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-500 hover:text-white'}`}
                  title="X (Twitter) Preview"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewPlatform('linkedin')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${previewPlatform === 'linkedin' ? 'bg-sky-700 text-white shadow-xs' : 'text-slate-500 hover:text-white'}`}
                  title="LinkedIn Preview"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* WhatsApp Card Simulator */}
            {previewPlatform === 'whatsapp' && (
              <div className="bg-[#efeae2] dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pratinjau WhatsApp Chat</div>
                <div className="bg-[#d9fdd3] dark:bg-emerald-950/80 p-3 rounded-2xl rounded-tr-sm max-w-[90%] ml-auto shadow-sm space-y-2">
                  <div className="bg-white/80 dark:bg-slate-900 rounded-xl overflow-hidden border border-emerald-900/10">
                    <div className="h-32 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                      <img
                        src={ogImageUrl}
                        alt="OG Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                    <div className="p-2.5 space-y-1">
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{currentDomain.replace('https://', '')}</div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{ogTitle}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{ogDescription}</p>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-800 dark:text-slate-200 font-medium">
                    Cek penawaran terbaik di sini ya! 👇<br />
                    <span className="text-indigo-600 dark:text-indigo-400 underline font-mono text-[10px]">{fullShareUrl}</span>
                  </div>
                  <div className="text-[9px] text-right text-slate-400 font-mono">08.42 ✓✓</div>
                </div>
              </div>
            )}

            {/* Facebook / LinkedIn Card Simulator */}
            {(previewPlatform === 'facebook' || previewPlatform === 'linkedin') && (
              <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pratinjau Feed {previewPlatform === 'facebook' ? 'Facebook' : 'LinkedIn'}</div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="h-40 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={ogImageUrl}
                      alt="OG Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/80 space-y-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">{currentDomain.replace('https://', '')}</div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{ogTitle}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{ogDescription}</p>
                  </div>
                </div>
              </div>
            )}

            {/* X / Twitter Card Simulator */}
            {previewPlatform === 'twitter' && (
              <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pratinjau X (Twitter) Card</div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="h-36 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={ogImageUrl}
                      alt="OG Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{ogTitle}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{ogDescription}</p>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1 pt-1">
                      <Globe className="w-3 h-3" />
                      <span>{currentDomain.replace('https://', '')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Copy Meta Tags Snippet */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Generated HTML Meta Tags</span>
                <button
                  onClick={() => {
                    const snippet = `<meta property="og:title" content="${ogTitle}" />\n<meta property="og:description" content="${ogDescription}" />\n<meta property="og:image" content="${ogImageUrl}" />\n<meta property="og:url" content="${fullShareUrl}" />`;
                    navigator.clipboard.writeText(snippet);
                    alert('HTML Meta Tags berhasil disalin ke clipboard!');
                  }}
                  className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Salin HTML</span>
                </button>
              </div>
              <pre className="p-2.5 bg-slate-900 text-emerald-400 rounded-xl text-[10px] font-mono overflow-x-auto">
{`<meta property="og:title" content="${ogTitle}" />
<meta property="og:description" content="${ogDescription}" />
<meta property="og:image" content="${ogImageUrl}" />
<meta property="og:url" content="${fullShareUrl}" />`}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
