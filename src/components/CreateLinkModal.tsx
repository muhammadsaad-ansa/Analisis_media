import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { SocialPlatform } from '../types';
import { generateAutoTags, getTagStyle, detectDomainTags, DOMAIN_TAG_RULES } from '../utils/tagUtils';
import { 
  X, 
  Link2, 
  Share2, 
  Tag, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  RotateCcw, 
  Check, 
  Globe,
  HelpCircle
} from 'lucide-react';

interface CreateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateLinkModal: React.FC<CreateLinkModalProps> = ({ isOpen, onClose }) => {
  const { addLink, videos } = useAnalytics();

  const [destinationUrl, setDestinationUrl] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform>('Instagram');
  const [placement, setPlacement] = useState('Bio Profile');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [linkedVideoId, setLinkedVideoId] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Auto-Tagging state
  const [tags, setTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [isManualTagEdit, setIsManualTagEdit] = useState(false);

  // Active detected domain info
  const domainDetection = detectDomainTags(destinationUrl);

  // Auto-detect and append tags based on domain pattern and other link metadata
  useEffect(() => {
    if (!isOpen) return;

    const selectedVideoPlatform = videos.find((v) => v.id === linkedVideoId)?.platform;

    if (!isManualTagEdit) {
      // Automatic re-generation
      const computed = generateAutoTags({
        platform,
        placement,
        destinationUrl,
        title,
        linkedVideoId: linkedVideoId || undefined,
        videoPlatform: selectedVideoPlatform,
      });

      setTags((prev) => {
        if (prev.length === computed.length && prev.every((t, i) => t === computed[i])) {
          return prev;
        }
        return computed;
      });
    } else {
      // If user had manually customized tags, still append newly detected domain tags
      const domainTags = detectDomainTags(destinationUrl).tags;
      if (domainTags.length > 0) {
        setTags((prev) => {
          const toAdd = domainTags.filter((t) => !prev.includes(t));
          if (toAdd.length > 0) {
            return [...prev, ...toAdd];
          }
          return prev;
        });
      }
    }
  }, [isOpen, platform, placement, destinationUrl, title, linkedVideoId, isManualTagEdit]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 32);
      setSlug(generated);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setIsManualTagEdit(true);
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleAddCustomTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = customTagInput.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    if (clean && !tags.includes(clean)) {
      setIsManualTagEdit(true);
      setTags((prev) => [...prev, clean]);
      setCustomTagInput('');
    }
  };

  const handleResetAutoTags = () => {
    setIsManualTagEdit(false);
    const selectedVid = videos.find((v) => v.id === linkedVideoId);
    const computed = generateAutoTags({
      platform,
      placement,
      destinationUrl,
      title,
      linkedVideoId: linkedVideoId || undefined,
      videoPlatform: selectedVid?.platform,
    });
    setTags(computed);
  };

  // Quick preset loader to test domain pattern detection easily
  const handleLoadDomainSample = (url: string, suggestedTitle: string, suggestedPlatform: SocialPlatform) => {
    setDestinationUrl(url);
    if (!title) {
      setTitle(suggestedTitle);
      handleTitleChange(suggestedTitle);
    }
    setPlatform(suggestedPlatform);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalUrl = destinationUrl.trim();
    if (!finalUrl) {
      setError('Harap masukkan URL tujuan.');
      return;
    }

    // Auto prepend https:// if missing
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    // Auto-generate title if empty
    const finalTitle = title.trim() || `${platform} - ${placement} (${new Date().toLocaleDateString('id-ID')})`;

    // Auto-generate slug if empty
    let finalSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!finalSlug) {
      finalSlug = (title || platform)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 24) || `link-${Date.now().toString(36)}`;
    }

    // Always ensure domain tags are included
    const domainTags = domainDetection.tags;
    const finalTagsSet = new Set([...tags, ...domainTags]);
    if (finalTagsSet.size === 0) {
      finalTagsSet.add(platform.toLowerCase().replace(/[^a-z0-9]/g, ''));
    }

    addLink({
      title: finalTitle,
      slug: finalSlug,
      destinationUrl: finalUrl,
      platform,
      placement,
      utmCampaign: utmCampaign || finalSlug,
      utmMedium: 'social',
      linkedVideoId: linkedVideoId || undefined,
      tags: Array.from(finalTagsSet),
    });

    // Reset state
    setDestinationUrl('');
    setTitle('');
    setSlug('');
    setTags([]);
    setIsManualTagEdit(false);
    setError(null);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative text-left my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              Generator Tautan Cerdas & Auto-Tagging Domain
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Buat Tautan Medsos Baru
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem otomatis mendeteksi pola domain URL tujuan (contoh: <code>instagram.com</code> ➔ <code>#social-ig</code>, <code>tiktok.com</code> ➔ <code>#video-platform</code>).
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-xs bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Destination URL Input & Domain Pattern Feedback */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                URL Tujuan Akhir (Website, Toko Online, atau Video)
              </label>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>Auto-Detect Domain</span>
              </span>
            </div>

            <input
              type="text"
              required
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="instagram.com/reel/123 atau https://tiktok.com/@creator/video/456"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />

            {/* Instant Real-Time Domain Detection Feedback */}
            {domainDetection.matchedDomain ? (
              <div className="mt-1.5 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Pola Domain: <strong>{domainDetection.matchedDomain}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Tag Otomatis:</span>
                  {domainDetection.tags.map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.2 rounded font-mono font-bold text-[10px] bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ) : destinationUrl.length > 5 ? (
              <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-slate-400" />
                <span>Ketik URL dengan domain (misal: instagram.com, tiktok.com, shopee.co.id) untuk deteksi instan.</span>
              </div>
            ) : null}

            {/* Fast Test Samples */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-400 text-[10px]">Uji cepat domain:</span>
              <button
                type="button"
                onClick={() => handleLoadDomainSample('https://www.instagram.com/reel/Cz89Xy12a', 'Reels Outfit Spill 90rb', 'Instagram')}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-pink-50 dark:bg-slate-800 dark:hover:bg-pink-950/40 text-slate-600 dark:text-slate-300 hover:text-pink-600 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                + instagram.com (#social-ig)
              </button>
              <button
                type="button"
                onClick={() => handleLoadDomainSample('https://www.tiktok.com/@dindamakeup/video/729482910', 'TikTok Serum Viral Review', 'TikTok')}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-cyan-50 dark:bg-slate-800 dark:hover:bg-cyan-950/40 text-slate-600 dark:text-slate-300 hover:text-cyan-600 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                + tiktok.com (#video-platform)
              </button>
              <button
                type="button"
                onClick={() => handleLoadDomainSample('https://shopee.co.id/brand-official/promo-11', 'Flash Sale Shopee 11.11', 'Instagram')}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-amber-950/40 text-slate-600 dark:text-slate-300 hover:text-amber-600 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                + shopee.co.id (#marketplace-shopee)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Judul Tautan (Label Internal)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Link di Bio Instagram Utama @brand.id"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Platform Media Sosial
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="YouTube">YouTube</option>
                <option value="X (Twitter)">X (Twitter)</option>
                <option value="Facebook">Facebook</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Threads">Threads</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Penempatan Tautan
              </label>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Bio Profile">Bio Profil Utama</option>
                <option value="Story Swipe / Sticker">Story Sticker Link</option>
                <option value="Post Caption">Keterangan / Caption Post</option>
                <option value="Thread Reply">Balasan Thread / Komentar</option>
                <option value="WA Broadcast">Pesan Siaran / Chat WA</option>
                <option value="Video Description">Deskripsi / Pinned Vidio</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Slug Tautan Pendek (URL Custom)
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-xl text-slate-500 font-mono">
                /r/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="promo-ramadhan"
                className="w-full px-3 py-2 text-xs rounded-r-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Hubungkan ke Konten Vidio (Opsional)
            </label>
            <select
              value={linkedVideoId}
              onChange={(e) => setLinkedVideoId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Tidak Terhubung ke Vidio Spesifik --</option>
              {videos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title} ({v.platform})
                </option>
              ))}
            </select>
          </div>

          {/* Auto-Tagging System Interactive Box */}
          <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Sistem Auto-Tagging Sumber & Domain
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Auto-Detect Aktif
                </span>
              </div>

              {isManualTagEdit && (
                <button
                  type="button"
                  onClick={handleResetAutoTags}
                  className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  title="Kembalikan ke tag otomatis default"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Otomatis</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Tag ditambahkan secara otomatis berdasarkan pola domain URL tujuan (contoh: <strong>#social-ig</strong> untuk Instagram, <strong>#video-platform</strong> untuk TikTok/YouTube) serta kanal medsos.
            </p>

            {/* Generated Tag Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {tags.map((tag) => {
                const style = getTagStyle(tag);
                const isDomainDetectedTag = domainDetection.tags.includes(tag);

                return (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-lg border transition-all ${style.bg} ${style.text} ${style.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    <span>#{tag}</span>
                    {isDomainDetectedTag && (
                      <span className="text-[9px] uppercase tracking-wide font-sans bg-white/70 dark:bg-slate-900/60 px-1 py-0.2 rounded font-bold">
                        Domain
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-0.5 rounded-full p-0.5 cursor-pointer"
                      title={`Hapus tag #${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}

              {tags.length === 0 && (
                <span className="text-xs text-slate-400 italic">
                  Belum ada tag yang dipilih
                </span>
              )}
            </div>

            {/* Add Custom Tag Form */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTag();
                  }
                }}
                placeholder="+ Tambah tag kustom..."
                className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                disabled={!customTagInput.trim()}
                className="px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 disabled:opacity-40 rounded-lg cursor-pointer shrink-0"
              >
                + Tambah
              </button>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <span className="text-slate-400 block text-[11px] mb-1">Pratinjau Tautan yang Dibuat:</span>
            <div className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold break-all">
              {window.location.origin}/r/{slug || 'nama-tautan'}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm cursor-pointer"
            >
              <span>Simpan & Aktifkan Tautan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
