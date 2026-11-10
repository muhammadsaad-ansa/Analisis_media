/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Gmail Service for sending payment and affiliate withdrawal verification emails.
 */

function encodeEmail(to: string, subject: string, body: string): string {
  const utf8Subject = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const emailLines = [
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    btoa(unescape(encodeURIComponent(body)))
  ];
  const email = emailLines.join('\r\n');
  return btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function sendGmailVerification(
  accessToken: string,
  toEmail: string,
  subject: string,
  messageBody: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const rawMessage = encodeEmail(toEmail, subject, messageBody);
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: rawMessage,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return { success: false, error: errData.error?.message || `Gmail API error (${response.status})` };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Failed to send Gmail verification:', error);
    return { success: false, error: error.message || 'Network error sending email' };
  }
}
