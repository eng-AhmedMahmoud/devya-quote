import type { QuoteState } from '@/lib/pricing';
import type { Lang } from '@/lib/messages';

/**
 * Deterministic short reference for a pricing inquiry — the same selections
 * always produce the same code, so a client can quote "Q-XXXXXX" when booking
 * and the exact configuration can be re-opened from the share link.
 */
export function quoteRef(state: QuoteState): string {
  const key = JSON.stringify([
    state.designs,
    state.videos,
    state.content,
    state.adsOn,
    state.adBudget,
    state.web,
    state.webTier ?? null,
    state.currency ?? null,
  ]);
  let h = 5381;
  for (let i = 0; i < key.length; i++) {
    h = ((h * 33) ^ key.charCodeAt(i)) >>> 0;
  }
  return `Q-${h.toString(36).toUpperCase().padStart(7, '0')}`;
}

export function encodeQuoteState(state: QuoteState): string {
  const json = JSON.stringify(state);
  if (typeof window === 'undefined') return Buffer.from(json).toString('base64');
  return btoa(json);
}

export function decodeQuoteState(s: string | null | undefined): Partial<QuoteState> | null {
  if (!s) return null;
  try {
    const json = typeof window === 'undefined' ? Buffer.from(s, 'base64').toString() : atob(s);
    return JSON.parse(json) as Partial<QuoteState>;
  } catch {
    return null;
  }
}

/** Restorable link to this exact quote on the current edition's domain. */
export function buildShareUrl(state: QuoteState, lang: Lang): string {
  const origin = typeof window === 'undefined' ? '' : window.location.origin;
  return `${origin}/?s=${encodeURIComponent(encodeQuoteState(state))}&lang=${lang}`;
}
