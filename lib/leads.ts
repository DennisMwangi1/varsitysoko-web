import { BRAND } from '../constants';

export type LeadKind = 'waitlist' | 'business' | 'campus_university' | 'campus_org';

export type LeadPayload = {
  kind: LeadKind;
  email: string;
  [key: string]: string | boolean | undefined;
};

export type LeadResult = { ok: true; via: 'endpoint' | 'mailto' } | { ok: false; error: string };

/**
 * Submit a marketing lead.
 * Prefer `VITE_LEAD_FORM_URL` (Formspree / Getform / custom JSON endpoint).
 * Without it, opens a mailto to the support inbox so nothing is silently dropped.
 */
export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const endpoint = (import.meta.env.VITE_LEAD_FORM_URL as string | undefined)?.trim();

  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          _subject: `VarsitySoko — ${payload.kind}`,
          site: BRAND.siteUrl,
        }),
      });
      if (!res.ok) {
        return { ok: false, error: 'Could not send right now. Email us or try again.' };
      }
      return { ok: true, via: 'endpoint' };
    } catch {
      return { ok: false, error: 'Network error. Check your connection or email us.' };
    }
  }

  const lines = Object.entries(payload)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}: ${v}`);
  const subject = encodeURIComponent(`[VarsitySoko] ${payload.kind}`);
  const body = encodeURIComponent(lines.join('\n'));
  window.location.href = `mailto:${BRAND.supportEmail}?subject=${subject}&body=${body}`;
  return { ok: true, via: 'mailto' };
}
