import { SocialPlatform } from '../types';

export interface DomainTagRule {
  pattern: RegExp;
  domainName: string;
  tags: string[];
}

/**
 * Domain Pattern Rules:
 * Maps URL domains to specialized categorical tags.
 * e.g., 'instagram.com' -> 'social-ig', 'tiktok.com' -> 'video-platform'
 */
export const DOMAIN_TAG_RULES: DomainTagRule[] = [
  {
    pattern: /instagram\.com/i,
    domainName: 'instagram.com',
    tags: ['social-ig'],
  },
  {
    pattern: /tiktok\.com/i,
    domainName: 'tiktok.com',
    tags: ['video-platform'],
  },
  {
    pattern: /(youtube\.com|youtu\.be)/i,
    domainName: 'youtube.com',
    tags: ['video-platform', 'video-yt'],
  },
  {
    pattern: /(twitter\.com|x\.com)/i,
    domainName: 'x.com',
    tags: ['social-x', 'microblog'],
  },
  {
    pattern: /(facebook\.com|fb\.com|fb\.watch)/i,
    domainName: 'facebook.com',
    tags: ['social-fb', 'meta'],
  },
  {
    pattern: /threads\.net/i,
    domainName: 'threads.net',
    tags: ['social-threads'],
  },
  {
    pattern: /linkedin\.com/i,
    domainName: 'linkedin.com',
    tags: ['professional-network'],
  },
  {
    pattern: /(whatsapp\.com|wa\.me)/i,
    domainName: 'whatsapp.com',
    tags: ['chat-messaging', 'direct-order'],
  },
  {
    pattern: /(t\.me|telegram\.org)/i,
    domainName: 'telegram.org',
    tags: ['chat-messaging'],
  },
  {
    pattern: /(shopee\.co\.id|shopee\.com)/i,
    domainName: 'shopee.co.id',
    tags: ['marketplace-shopee', 'e-commerce'],
  },
  {
    pattern: /tokopedia\.com/i,
    domainName: 'tokopedia.com',
    tags: ['marketplace-tokopedia', 'e-commerce'],
  },
  {
    pattern: /(lazada\.co\.id|lazada\.com)/i,
    domainName: 'lazada.com',
    tags: ['marketplace-lazada', 'e-commerce'],
  },
  {
    pattern: /(blibli\.com)/i,
    domainName: 'blibli.com',
    tags: ['marketplace-blibli', 'e-commerce'],
  },
  {
    pattern: /spotify\.com/i,
    domainName: 'spotify.com',
    tags: ['audio-streaming'],
  },
  {
    pattern: /github\.com/i,
    domainName: 'github.com',
    tags: ['dev-repository'],
  },
];

/**
 * Detect domain-based tags from any destination URL
 */
export function detectDomainTags(url: string): { matchedDomain?: string; tags: string[] } {
  if (!url || typeof url !== 'string') return { tags: [] };

  const matchedTags: string[] = [];
  let matchedDomain: string | undefined;

  for (const rule of DOMAIN_TAG_RULES) {
    if (rule.pattern.test(url)) {
      matchedDomain = rule.domainName;
      rule.tags.forEach((t) => {
        if (!matchedTags.includes(t)) {
          matchedTags.push(t);
        }
      });
    }
  }

  // Fallback domain extraction if no preset rule matched
  if (!matchedDomain && url.startsWith('http')) {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '');
      if (host && host.includes('.')) {
        matchedDomain = host;
        // Generic domain classification
        if (host.includes('store') || host.includes('shop') || host.includes('katalog')) {
          if (!matchedTags.includes('e-commerce')) matchedTags.push('e-commerce');
          if (!matchedTags.includes('catalog-store')) matchedTags.push('catalog-store');
        }
      }
    } catch {
      // ignore invalid URL during typing
    }
  }

  return { matchedDomain, tags: matchedTags };
}

/**
 * Intelligent Auto-Tagging Engine
 * Automatically generates normalized tags based on platform, placement,
 * destination URL domain pattern, video linking, and title intent.
 */
export function generateAutoTags(params: {
  platform: SocialPlatform;
  placement?: string;
  destinationUrl?: string;
  title?: string;
  linkedVideoId?: string;
  videoPlatform?: string;
}): string[] {
  const tags = new Set<string>();

  // 1. Parse UTM parameters and keywords from destination URL
  if (params.destinationUrl) {
    const domainResult = detectDomainTags(params.destinationUrl);
    domainResult.tags.forEach((t) => tags.add(t));

    try {
      // If URL has query parameters or UTM tags
      const urlObj = new URL(params.destinationUrl.startsWith('http') ? params.destinationUrl : `https://${params.destinationUrl}`);
      const utmSource = urlObj.searchParams.get('utm_source');
      const utmMedium = urlObj.searchParams.get('utm_medium');
      const utmCampaign = urlObj.searchParams.get('utm_campaign');
      const utmTerm = urlObj.searchParams.get('utm_term');
      const utmContent = urlObj.searchParams.get('utm_content');

      if (utmSource) tags.add(`utm-source:${utmSource.toLowerCase().replace(/[^a-z0-9_-]/g, '')}`);
      if (utmMedium) tags.add(`utm-medium:${utmMedium.toLowerCase().replace(/[^a-z0-9_-]/g, '')}`);
      if (utmCampaign) tags.add(`utm-campaign:${utmCampaign.toLowerCase().replace(/[^a-z0-9_-]/g, '')}`);
      if (utmTerm) tags.add(`utm-term:${utmTerm.toLowerCase().replace(/[^a-z0-9_-]/g, '')}`);
      if (utmContent) tags.add(`utm-content:${utmContent.toLowerCase().replace(/[^a-z0-9_-]/g, '')}`);
    } catch {
      // Fallback regex parsing if URL parsing fails
      const urlStr = params.destinationUrl.toLowerCase();
      const matchSource = urlStr.match(/utm_source=([^&]+)/);
      const matchMedium = urlStr.match(/utm_medium=([^&]+)/);
      const matchCampaign = urlStr.match(/utm_campaign=([^&]+)/);
      if (matchSource) tags.add(`utm-source:${matchSource[1].replace(/[^a-z0-9_-]/g, '')}`);
      if (matchMedium) tags.add(`utm-medium:${matchMedium[1].replace(/[^a-z0-9_-]/g, '')}`);
      if (matchCampaign) tags.add(`utm-campaign:${matchCampaign[1].replace(/[^a-z0-9_-]/g, '')}`);
    }
  }

  // 2. Source Platform Tag
  const platformClean = params.platform.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (platformClean.includes('instagram')) {
    tags.add('instagram');
    tags.add('social-ig');
  } else if (platformClean.includes('tiktok')) {
    tags.add('tiktok');
    tags.add('video-platform');
  } else if (platformClean.includes('whatsapp')) {
    tags.add('whatsapp');
    tags.add('chat-messaging');
  } else if (platformClean.includes('youtube')) {
    tags.add('youtube');
    tags.add('video-platform');
  } else if (platformClean.includes('twitter') || platformClean === 'x') {
    tags.add('x-twitter');
    tags.add('social-x');
  } else if (platformClean.includes('facebook')) {
    tags.add('facebook');
    tags.add('social-fb');
  } else if (platformClean.includes('linkedin')) {
    tags.add('linkedin');
    tags.add('professional-network');
  } else if (platformClean.includes('threads')) {
    tags.add('threads');
    tags.add('social-threads');
  } else {
    tags.add('direct-traffic');
  }

  // 3. Placement / Channel Tag
  const placement = (params.placement || '').toLowerCase();
  if (placement.includes('bio')) {
    tags.add('bio-link');
  } else if (placement.includes('story') || placement.includes('sticker')) {
    tags.add('story-sticker');
  } else if (placement.includes('caption') || placement.includes('post')) {
    tags.add('post-caption');
  } else if (placement.includes('thread') || placement.includes('reply') || placement.includes('komentar')) {
    tags.add('thread-reply');
  } else if (placement.includes('broadcast') || placement.includes('chat') || placement.includes('wa')) {
    tags.add('chat-broadcast');
  } else if (placement.includes('desc') || placement.includes('pinned')) {
    tags.add('video-desc');
  }

  // 4. URL Semantic Keywords
  const dest = (params.destinationUrl || '').toLowerCase();
  if (dest.includes('promo') || dest.includes('diskon') || dest.includes('sale') || dest.includes('deals')) {
    tags.add('promo-campaign');
  }
  if (dest.includes('order') || dest.includes('beli') || dest.includes('checkout')) {
    tags.add('order-intent');
  }

  // 5. Linked Video & Format Tag
  if (params.linkedVideoId) {
    tags.add('video-attribution');
    tags.add('video-platform');
    if (params.videoPlatform?.toLowerCase().includes('reel') || placement.includes('reel')) {
      tags.add('reels');
      tags.add('social-ig');
    } else if (params.videoPlatform?.toLowerCase().includes('tiktok') || tags.has('tiktok')) {
      tags.add('short-video');
    } else if (params.videoPlatform?.toLowerCase().includes('short') || tags.has('youtube')) {
      tags.add('shorts');
    }
  }

  // 6. Title Context Heuristics
  const title = (params.title || '').toLowerCase();
  if (title.includes('giveaway')) tags.add('giveaway');
  if (title.includes('review') || title.includes('spill') || title.includes('unboxing')) tags.add('ugc-review');
  if (title.includes('affiliate') || title.includes('komisi')) tags.add('affiliate');
  if (title.includes('viral')) tags.add('viral-content');
  if (title.includes('serum') || title.includes('skincare') || title.includes('makeup')) tags.add('beauty-care');
  if (title.includes('ootd') || title.includes('fashion') || title.includes('kemeja') || title.includes('baju')) tags.add('fashion');
  if (title.includes('gadget') || title.includes('hp')) tags.add('tech-gadget');

  return Array.from(tags);
}

/**
 * Returns distinct styling classes for specific auto-tags
 */
export function getTagStyle(tag: string): { bg: string; text: string; border: string; dot: string } {
  const t = tag.toLowerCase();

  // Social IG
  if (t === 'social-ig' || t === 'instagram') {
    return {
      bg: 'bg-pink-50 dark:bg-pink-950/60',
      text: 'text-pink-700 dark:text-pink-300',
      border: 'border-pink-200 dark:border-pink-800',
      dot: 'bg-pink-500',
    };
  }

  // Video Platform / TikTok / YouTube
  if (t === 'video-platform' || t === 'tiktok' || t === 'short-video') {
    return {
      bg: 'bg-cyan-50 dark:bg-cyan-950/60',
      text: 'text-cyan-800 dark:text-cyan-300',
      border: 'border-cyan-200 dark:border-cyan-800',
      dot: 'bg-cyan-500',
    };
  }

  // Chat Messaging / WhatsApp
  if (t === 'chat-messaging' || t === 'whatsapp' || t === 'direct-chat' || t === 'chat-broadcast') {
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      dot: 'bg-emerald-500',
    };
  }

  // Video YouTube / Shorts
  if (t === 'video-yt' || t === 'youtube' || t === 'shorts' || t === 'youtube-video') {
    return {
      bg: 'bg-red-50 dark:bg-red-950/60',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800',
      dot: 'bg-red-500',
    };
  }

  // Social X / Twitter
  if (t === 'social-x' || t === 'x-twitter' || t === 'microblog' || t === 'social-threads' || t === 'threads') {
    return {
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-800 dark:text-slate-200',
      border: 'border-slate-300 dark:border-slate-700',
      dot: 'bg-slate-600',
    };
  }

  // Meta / Facebook
  if (t === 'social-fb' || t === 'facebook' || t === 'meta') {
    return {
      bg: 'bg-blue-50 dark:bg-blue-950/60',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      dot: 'bg-blue-600',
    };
  }

  // Bio Link
  if (t === 'bio-link') {
    return {
      bg: 'bg-indigo-50 dark:bg-indigo-950/60',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-200 dark:border-indigo-800',
      dot: 'bg-indigo-500',
    };
  }

  // Reels & Video Attribution
  if (t === 'video-attribution' || t === 'reels') {
    return {
      bg: 'bg-purple-50 dark:bg-purple-950/60',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
      dot: 'bg-purple-500',
    };
  }

  // Marketplace & E-commerce
  if (t.includes('marketplace') || t === 'e-commerce' || t === 'shopee' || t === 'tokopedia' || t === 'promo-campaign') {
    return {
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      dot: 'bg-amber-500',
    };
  }

  // Default fallback style
  return {
    bg: 'bg-slate-50 dark:bg-slate-800/80',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400',
  };
}
