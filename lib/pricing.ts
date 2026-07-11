export const PRICE = {
  video: 350,
  content: 2500,
  adMin: 30000,
  mgmt: 0.2,
} as const;

/**
 * Web-development tiers. Priced in USD; the EGP equivalent is converted
 * live via /api/fx (daily rate) — never hardcode an EGP figure for these.
 * usdMax === null means an open-ended "from $min" tier.
 */
export type WebTierId =
  | 'personal'
  | 'blog'
  | 'company'
  | 'storeBasic'
  | 'storeMid'
  | 'storeAdvanced'
  | 'customSystem';

export type WebTier = { id: WebTierId; usdMin: number; usdMax: number | null };

export const WEB_TIERS: WebTier[] = [
  { id: 'personal', usdMin: 200, usdMax: 300 },
  { id: 'blog', usdMin: 250, usdMax: 400 },
  { id: 'company', usdMin: 300, usdMax: 550 },
  { id: 'storeBasic', usdMin: 350, usdMax: 650 },
  { id: 'storeMid', usdMin: 550, usdMax: 1050 },
  { id: 'storeAdvanced', usdMin: 1050, usdMax: null },
  { id: 'customSystem', usdMin: 2000, usdMax: null },
];

export function getWebTier(id: WebTierId | null | undefined): WebTier | null {
  if (!id) return null;
  return WEB_TIERS.find((t) => t.id === id) ?? null;
}

/** Last-resort rate when the FX API is unreachable; live rate always wins. */
export const FALLBACK_USD_EGP = 48.17;

export function usdToEgp(usd: number, rate: number): number {
  return Math.round(usd * rate);
}

export function tierUsdLabel(t: WebTier, fromWord: string): string {
  return t.usdMax === null
    ? `${fromWord} $${fmt(t.usdMin)}`
    : `$${fmt(t.usdMin)} – $${fmt(t.usdMax)}`;
}

export function tierEgpLabel(t: WebTier, rate: number, fromWord: string, egp: string): string {
  const min = fmt(usdToEgp(t.usdMin, rate));
  return t.usdMax === null
    ? `${fromWord} ${min} ${egp}`
    : `${min} – ${fmt(usdToEgp(t.usdMax, rate))} ${egp}`;
}

export type QuoteState = {
  designs: number;
  videos: number;
  content: boolean;
  adsOn: boolean;
  adBudget: number;
  web: boolean;
  /** Selected web tier; null = scoped on a call. Absent in old saved links. */
  webTier?: WebTierId | null;
};

export type QuoteCalc = {
  dUnit: number;
  designs: number;
  videos: number;
  content: number;
  adEff: number;
  subtotal: number;
  mgmt: number;
  total: number;
};

/**
 * Per-design unit price (EGP).
 * Tiered: <=0 -> 0; 1..15 -> 200; 16+ -> 170.
 * 30+ is technically "negotiated rate" but the calculator
 * keeps the 170 baseline (matches reference HTML).
 */
export function designUnit(q: number): number {
  if (q <= 0) return 0;
  if (q <= 15) return 200;
  return 170;
}

export function calc(state: QuoteState): QuoteCalc {
  const dUnit = designUnit(state.designs);
  const designs = state.designs * dUnit;
  const videos = state.videos * PRICE.video;
  const content = state.content ? PRICE.content : 0;
  const adEff = state.adsOn ? Math.max(state.adBudget || 0, PRICE.adMin) : 0;
  const subtotal = designs + videos + content + adEff;
  const mgmt = subtotal * PRICE.mgmt;
  const total = subtotal + mgmt;
  return { dUnit, designs, videos, content, adEff, subtotal, mgmt, total };
}

export function fmt(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}
