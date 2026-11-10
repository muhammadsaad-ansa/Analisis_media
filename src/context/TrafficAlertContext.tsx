/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { TrafficAlertRule, SpikeIncident, EmailAlertData, TrackedLink } from '../types';
import { useAnalytics } from './AnalyticsContext';
import { useAuth } from './AuthContext';
import {
  playSpikeChime,
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
  sendBrowserPushNotification,
} from '../utils/notificationUtils';

interface TrafficAlertContextType {
  rules: TrafficAlertRule[];
  incidents: SpikeIncident[];
  unreadIncidentsCount: number;
  activeToast: SpikeIncident | null;
  browserPermission: NotificationPermission;
  soundEnabled: boolean;
  isAlertModalOpen: boolean;
  emailPreviewData: EmailAlertData | null;
  activeModalTab: 'rules' | 'channels' | 'history';
  setActiveModalTab: (tab: 'rules' | 'channels' | 'history') => void;
  // Actions
  addRule: (rule: Omit<TrafficAlertRule, 'id' | 'createdAt'>) => TrafficAlertRule;
  updateRule: (id: string, updates: Partial<TrafficAlertRule>) => void;
  deleteRule: (id: string) => void;
  toggleRule: (id: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  openAlertModal: (initialTab?: 'rules' | 'channels' | 'history') => void;
  closeAlertModal: () => void;
  dismissToast: () => void;
  markAllAsRead: () => void;
  clearIncidents: () => void;
  requestPermission: () => Promise<NotificationPermission>;
  triggerTestPushNotification: () => boolean;
  triggerTestEmailAlert: (customEmail?: string) => void;
  closeEmailPreview: () => void;
  simulateSpikeBurst: (targetLinkId?: string, burstCount?: number) => void;
}

const DEFAULT_USER_EMAIL = 'nisaad1526@gmail.com';

const INITIAL_RULES: TrafficAlertRule[] = [
  {
    id: 'rule-surge-fast',
    name: 'Lonjakan Kilat (5 Menit)',
    linkId: 'all',
    thresholdClicks: 15,
    timeWindowMinutes: 5,
    enableBrowserPush: true,
    enableEmail: true,
    recipientEmail: DEFAULT_USER_EMAIL,
    cooldownMinutes: 10,
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'rule-surge-viral',
    name: 'Trafik Viral Video (15 Menit)',
    linkId: 'all',
    thresholdClicks: 40,
    timeWindowMinutes: 15,
    enableBrowserPush: true,
    enableEmail: true,
    recipientEmail: DEFAULT_USER_EMAIL,
    cooldownMinutes: 15,
    isActive: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'rule-surge-hourly',
    name: 'Puncak Jam Sibuk (1 Jam)',
    linkId: 'all',
    thresholdClicks: 100,
    timeWindowMinutes: 60,
    enableBrowserPush: true,
    enableEmail: true,
    recipientEmail: DEFAULT_USER_EMAIL,
    cooldownMinutes: 30,
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

const INITIAL_INCIDENTS: SpikeIncident[] = [
  {
    id: 'inc-sample-1',
    ruleId: 'rule-surge-fast',
    ruleName: 'Lonjakan Kilat (5 Menit)',
    linkId: 'link-1',
    linkTitle: 'PROMO MERDEKA DISKON 50%',
    linkSlug: 'promo-merdeka',
    clickCount: 22,
    thresholdClicks: 15,
    timeWindowMinutes: 5,
    triggeredAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    channelsNotified: ['browser', 'email'],
    recipientEmail: DEFAULT_USER_EMAIL,
    isRead: false,
    surgeVelocity: '+180% vs normal',
  },
  {
    id: 'inc-sample-2',
    ruleId: 'rule-surge-viral',
    ruleName: 'Trafik Viral Video (15 Menit)',
    linkId: 'link-2',
    linkTitle: 'Grup Sinyal Cuan VIP',
    linkSlug: 'sinyal-cuan',
    clickCount: 47,
    thresholdClicks: 40,
    timeWindowMinutes: 15,
    triggeredAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    channelsNotified: ['browser', 'email'],
    recipientEmail: DEFAULT_USER_EMAIL,
    isRead: true,
    surgeVelocity: '+240% vs normal',
  },
];

const TrafficAlertContext = createContext<TrafficAlertContextType | undefined>(undefined);

export const TrafficAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { clickEvents, links, simulateInstantClick } = useAnalytics();
  const { user } = useAuth();

  const userEmail = user?.email || DEFAULT_USER_EMAIL;

  const [rules, setRules] = useState<TrafficAlertRule[]>(() => {
    try {
      const saved = localStorage.getItem('pulsetrack_alert_rules');
      if (saved) return JSON.parse(saved);
      return INITIAL_RULES;
    } catch {
      return INITIAL_RULES;
    }
  });

  const [incidents, setIncidents] = useState<SpikeIncident[]>(() => {
    try {
      const saved = localStorage.getItem('pulsetrack_alert_incidents');
      if (saved) return JSON.parse(saved);
      return INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pulsetrack_alert_sound');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(() => {
    return getBrowserNotificationPermission();
  });

  const [activeToast, setActiveToast] = useState<SpikeIncident | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [activeModalTab, setActiveModalTab] = useState<'rules' | 'channels' | 'history'>('rules');
  const [emailPreviewData, setEmailPreviewData] = useState<EmailAlertData | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('pulsetrack_alert_rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('pulsetrack_alert_incidents', JSON.stringify(incidents));
  }, [incidents]);

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem('pulsetrack_alert_sound', String(enabled));
  };

  const unreadIncidentsCount = incidents.filter((i) => !i.isRead).length;

  const requestPermission = async (): Promise<NotificationPermission> => {
    const res = await requestBrowserNotificationPermission();
    setBrowserPermission(res);
    return res;
  };

  const openAlertModal = (initialTab: 'rules' | 'channels' | 'history' = 'rules') => {
    setActiveModalTab(initialTab);
    setIsAlertModalOpen(true);
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  const dismissToast = () => {
    setActiveToast(null);
  };

  const markAllAsRead = () => {
    setIncidents((prev) => prev.map((inc) => ({ ...inc, isRead: true })));
  };

  const clearIncidents = () => {
    setIncidents([]);
  };

  const addRule = (newRuleData: Omit<TrafficAlertRule, 'id' | 'createdAt'>): TrafficAlertRule => {
    const targetLink = links.find((l) => l.id === newRuleData.linkId);
    const newRule: TrafficAlertRule = {
      ...newRuleData,
      id: `rule-${Date.now()}`,
      linkTitle: newRuleData.linkId === 'all' ? 'Semua Tautan' : targetLink?.title || 'Tautan Terpilih',
      createdAt: new Date().toISOString(),
    };
    setRules((prev) => [newRule, ...prev]);
    return newRule;
  };

  const updateRule = (id: string, updates: Partial<TrafficAlertRule>) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, ...updates };
          if (updates.linkId) {
            updated.linkTitle =
              updates.linkId === 'all'
                ? 'Semua Tautan'
                : links.find((l) => l.id === updates.linkId)?.title || 'Tautan Terpilih';
          }
          return updated;
        }
        return r;
      })
    );
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  /**
   * Internal dispatcher for Spike Incidents
   */
  const dispatchSpikeAlert = useCallback(
    (rule: TrafficAlertRule, targetLink: TrackedLink, currentClicks: number) => {
      const channelsNotified: ('browser' | 'email')[] = [];

      // 1. Browser Push Notification
      if (rule.enableBrowserPush) {
        channelsNotified.push('browser');
        const notifTitle = `🚨 Lonjakan Trafik: ${targetLink.title}`;
        const notifBody = `Tautan /r/${targetLink.slug} baru saja menerima ${currentClicks} klik dalam ${rule.timeWindowMinutes} menit (melebihi ambang batas > ${rule.thresholdClicks})!`;
        sendBrowserPushNotification(notifTitle, {
          body: notifBody,
          tag: `spike-${targetLink.id}`,
        });
      }

      // 2. Email Notification channel
      if (rule.enableEmail) {
        channelsNotified.push('email');
      }

      // 3. Audio Chime
      if (soundEnabled) {
        playSpikeChime();
      }

      const newIncident: SpikeIncident = {
        id: `inc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ruleId: rule.id,
        ruleName: rule.name,
        linkId: targetLink.id,
        linkTitle: targetLink.title,
        linkSlug: targetLink.slug,
        clickCount: currentClicks,
        thresholdClicks: rule.thresholdClicks,
        timeWindowMinutes: rule.timeWindowMinutes,
        triggeredAt: new Date().toISOString(),
        channelsNotified,
        recipientEmail: rule.recipientEmail || userEmail,
        isRead: false,
        surgeVelocity: `+${Math.round(((currentClicks - rule.thresholdClicks) / rule.thresholdClicks) * 100 + 100)}% lonjakan`,
      };

      setIncidents((prev) => [newIncident, ...prev.slice(0, 99)]);
      setActiveToast(newIncident);

      // Auto dismiss toast after 9 seconds
      setTimeout(() => {
        setActiveToast((current) => (current?.id === newIncident.id ? null : current));
      }, 9000);

      // Update rule lastTriggeredAt
      setRules((prev) =>
        prev.map((r) =>
          r.id === rule.id ? { ...r, lastTriggeredAt: new Date().toISOString() } : r
        )
      );
    },
    [soundEnabled, userEmail]
  );

  // Evaluate active rules against clicks
  const evaluatingRef = useRef(false);
  useEffect(() => {
    if (evaluatingRef.current) return;
    evaluatingRef.current = true;

    try {
      const now = Date.now();
      const activeRules = rules.filter((r) => r.isActive);

      activeRules.forEach((rule) => {
        // Cooldown check
        if (rule.lastTriggeredAt) {
          const lastTriggeredTime = new Date(rule.lastTriggeredAt).getTime();
          const cooldownMs = rule.cooldownMinutes * 60 * 1000;
          if (now - lastTriggeredTime < cooldownMs) {
            return; // within cooldown
          }
        }

        const windowStartMs = now - rule.timeWindowMinutes * 60 * 1000;

        // Targets to inspect
        const targetLinks =
          rule.linkId === 'all'
            ? links.filter((l) => l.isActive)
            : links.filter((l) => l.id === rule.linkId && l.isActive);

        targetLinks.forEach((link) => {
          // Count clicks for this link within the window
          const clicksInWindow = clickEvents.filter((c) => {
            if (c.linkId !== link.id && c.linkSlug !== link.slug) return false;
            const clickTime = new Date(c.timestamp).getTime();
            return clickTime >= windowStartMs;
          }).length;

          if (clicksInWindow >= rule.thresholdClicks) {
            dispatchSpikeAlert(rule, link, clicksInWindow);
          }
        });
      });
    } finally {
      evaluatingRef.current = false;
    }
  }, [clickEvents, rules, links, dispatchSpikeAlert]);

  /**
   * Quick Test: Send immediate Browser Push Notification
   */
  const triggerTestPushNotification = (): boolean => {
    if (soundEnabled) {
      playSpikeChime();
    }
    const sampleLink = links[0] || { title: 'Tautan Sampel', slug: 'demo-link' };
    const sent = sendBrowserPushNotification('🚨 Uji Notifikasi Lonjakan Trafik PulseTrack', {
      body: `Pengujian berhasil! Tautan /r/${sampleLink.slug} siap memberikan pemberitahuan seketika saat terjadi lonjakan trafik pengunjung.`,
    });

    // Also trigger in-app toast for visibility
    const testIncident: SpikeIncident = {
      id: `test-push-${Date.now()}`,
      ruleId: 'test-rule',
      ruleName: 'Pengujian Notifikasi Browser',
      linkId: sampleLink.id || 'test',
      linkTitle: sampleLink.title,
      linkSlug: sampleLink.slug,
      clickCount: 28,
      thresholdClicks: 20,
      timeWindowMinutes: 5,
      triggeredAt: new Date().toISOString(),
      channelsNotified: ['browser'],
      isRead: false,
      surgeVelocity: '+140% lonjakan uji coba',
    };
    setActiveToast(testIncident);

    return sent;
  };

  /**
   * Quick Test: Trigger Email Alert Preview Modal
   */
  const triggerTestEmailAlert = (customEmail?: string) => {
    if (soundEnabled) {
      playSpikeChime();
    }
    const sampleLink = links[0] || {
      id: 'demo-id',
      title: 'PROMO MERDEKA DISKON 50%',
      slug: 'promo-merdeka',
      destinationUrl: 'https://tokopedia.com/promo-merdeka',
    };

    const targetEmail = customEmail || userEmail;
    const emailData: EmailAlertData = {
      recipient: targetEmail,
      subject: `🚨 [PulseTrack Alert] Lonjakan Trafik Tinggi pada "${sampleLink.title}"`,
      linkTitle: sampleLink.title,
      linkSlug: sampleLink.slug,
      destinationUrl: sampleLink.destinationUrl || 'https://example.com',
      clickCount: 42,
      thresholdClicks: 25,
      timeWindowMinutes: 5,
      triggeredAt: new Date().toISOString(),
      ruleName: 'Lonjakan Kilat (5 Menit)',
      topPlatform: 'TikTok & Instagram Reels',
      topLocation: 'Jakarta & Surabaya, ID',
    };

    setEmailPreviewData(emailData);

    // Also add to incidents log
    const testIncident: SpikeIncident = {
      id: `test-email-${Date.now()}`,
      ruleId: 'test-rule',
      ruleName: 'Pengujian Notifikasi Email',
      linkId: sampleLink.id,
      linkTitle: sampleLink.title,
      linkSlug: sampleLink.slug,
      clickCount: 42,
      thresholdClicks: 25,
      timeWindowMinutes: 5,
      triggeredAt: new Date().toISOString(),
      channelsNotified: ['email'],
      recipientEmail: targetEmail,
      isRead: false,
      surgeVelocity: '+168% lonjakan uji coba',
    };
    setIncidents((prev) => [testIncident, ...prev.slice(0, 99)]);
  };

  const closeEmailPreview = () => {
    setEmailPreviewData(null);
  };

  /**
   * Simulate a burst of high-traffic clicks on a link instantly!
   */
  const simulateSpikeBurst = (targetLinkId?: string, burstCount = 20) => {
    const link = targetLinkId ? links.find((l) => l.id === targetLinkId) : links[0];
    if (!link) return;

    // Trigger instant clicks
    for (let i = 0; i < burstCount; i++) {
      simulateInstantClick({ linkId: link.id });
    }

    if (soundEnabled) {
      playSpikeChime();
    }
  };

  return (
    <TrafficAlertContext.Provider
      value={{
        rules,
        incidents,
        unreadIncidentsCount,
        activeToast,
        browserPermission,
        soundEnabled,
        isAlertModalOpen,
        emailPreviewData,
        activeModalTab,
        setActiveModalTab,
        addRule,
        updateRule,
        deleteRule,
        toggleRule,
        setSoundEnabled,
        openAlertModal,
        closeAlertModal,
        dismissToast,
        markAllAsRead,
        clearIncidents,
        requestPermission,
        triggerTestPushNotification,
        triggerTestEmailAlert,
        closeEmailPreview,
        simulateSpikeBurst,
      }}
    >
      {children}
    </TrafficAlertContext.Provider>
  );
};

export const useTrafficAlert = () => {
  const context = useContext(TrafficAlertContext);
  if (!context) {
    throw new Error('useTrafficAlert must be used within a TrafficAlertProvider');
  }
  return context;
};
