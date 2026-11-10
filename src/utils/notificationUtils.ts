/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EmailAlertData } from '../types';

/**
 * Play a crisp two-tone alert chime using standard Web Audio API
 * No external sound files or assets required; zero network overhead.
 */
export function playSpikeChime(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Check if context is suspended (browser policy on un-interacted tabs)
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency sweep: 880Hz (A5) ascending to 1318.5Hz (E6)
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1318.5, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.45);
  } catch {
    // Gracefully ignore if audio device is locked or unavailable
  }
}

/**
 * Get current browser notification permission status
 */
export function getBrowserNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Request permission from user to send Web Push Notifications
 */
export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return 'denied';
  }
}

/**
 * Dispatches a native browser push notification
 * Returns boolean indicating whether native notification was sent
 */
export function sendBrowserPushNotification(
  title: string,
  options?: NotificationOptions
): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
        badge: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&auto=format&fit=crop&q=80',
        requireInteraction: false,
        silent: false,
        ...options,
      });

      // Auto close after 7 seconds if supported
      setTimeout(() => {
        try {
          notif.close();
        } catch {
          // ignore
        }
      }, 7000);

      return true;
    } catch (e) {
      console.warn('Native Notification constructor failed (e.g., iframe sandbox):', e);
      return false;
    }
  }

  return false;
}

/**
 * Generate formatted HTML template string for Spike Email Notification
 */
export function generateEmailHtmlTemplate(data: EmailAlertData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${data.subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #f8fafc;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);">
    <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 24px; text-align: left;">
      <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); color: #ffffff; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
        PulseTrack Spike Radar
      </span>
      <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0; line-height: 1.3;">
        🚨 Peringatan: Lonjakan Trafik Tinggi Terdeteksi!
      </h1>
    </div>
    
    <div style="padding: 24px;">
      <p style="font-size: 14px; color: #cbd5e1; margin-top: 0; line-height: 1.6;">
        Halo Kreator / Admin <strong>PulseTrack</strong>, sistem pemantau mendeteksi lonjakan klik mendadak pada salah satu tautan Anda yang melampaui batas ambang aturan:
      </p>

      <div style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 18px; margin: 18px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="color: #94a3b8; padding: 6px 0; width: 140px;">Tautan:</td>
            <td style="color: #ffffff; font-weight: 600; padding: 6px 0;">${data.linkTitle}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 6px 0;">Short URL:</td>
            <td style="color: #818cf8; font-family: monospace; font-size: 12px; padding: 6px 0;">/r/${data.linkSlug}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 6px 0;">Jumlah Klik:</td>
            <td style="color: #34d399; font-weight: 700; font-size: 15px; padding: 6px 0;">
              ${data.clickCount} klik <span style="font-size: 12px; color: #94a3b8; font-weight: 400;">(Ambang: &gt; ${data.thresholdClicks})</span>
            </td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 6px 0;">Jendela Waktu:</td>
            <td style="color: #e2e8f0; padding: 6px 0;">${data.timeWindowMinutes} Menit Terakhir</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 6px 0;">Waktu Kejadian:</td>
            <td style="color: #e2e8f0; padding: 6px 0;">${new Date(data.triggeredAt).toLocaleString('id-ID')}</td>
          </tr>
          ${data.topPlatform ? `
          <tr>
            <td style="color: #94a3b8; padding: 6px 0;">Platform Terbanyak:</td>
            <td style="color: #e2e8f0; padding: 6px 0;">${data.topPlatform}</td>
          </tr>` : ''}
          ${data.topLocation ? `
          <tr>
            <td style="color: #94a3b8; padding: 6px 0;">Lokasi Puncak:</td>
            <td style="color: #e2e8f0; padding: 6px 0;">${data.topLocation}</td>
          </tr>` : ''}
        </table>
      </div>

      <div style="text-align: center; margin: 24px 0 16px 0;">
        <a href="${data.destinationUrl}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
          Buka Tautan Tujuan &rarr;
        </a>
      </div>

      <p style="font-size: 11px; color: #64748b; line-height: 1.5; border-top: 1px solid #334155; padding-top: 14px; margin-bottom: 0;">
        Notifikasi ini dikirim secara otomatis ke <strong>${data.recipient}</strong> berdasarkan aturan <em>${data.ruleName}</em> di PulseTrack Analytics. Anda dapat mengubah ambang batas atau menonaktifkan notifikasi melalui Dashboard &gt; Pengaturan Lonjakan Trafik.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
