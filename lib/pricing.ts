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

/**
 * Display currencies for web-tier conversion — MENA/Gulf + Egypt + EUR.
 * USD is the pricing base and is always shown; these are the equivalents.
 */
export type CurrencyCode =
  | 'EGP' | 'SAR' | 'AED' | 'QAR' | 'KWD' | 'BHD' | 'OMR' | 'JOD' | 'EUR';

export type Currency = { code: CurrencyCode; en: string; ar: string };

export const CURRENCIES: Currency[] = [
  { code: 'EGP', en: 'EGP', ar: 'ج.م' },
  { code: 'SAR', en: 'SAR', ar: 'ر.س' },
  { code: 'AED', en: 'AED', ar: 'د.إ' },
  { code: 'QAR', en: 'QAR', ar: 'ر.ق' },
  { code: 'KWD', en: 'KWD', ar: 'د.ك' },
  { code: 'BHD', en: 'BHD', ar: 'د.ب' },
  { code: 'OMR', en: 'OMR', ar: 'ر.ع' },
  { code: 'JOD', en: 'JOD', ar: 'د.أ' },
  { code: 'EUR', en: 'EUR', ar: 'يورو' },
];

export const DEFAULT_CURRENCY: CurrencyCode = 'EGP';

export function currencySymbol(code: CurrencyCode, isAr: boolean): string {
  const c = CURRENCIES.find((x) => x.code === code);
  return c ? (isAr ? c.ar : c.en) : code;
}

/**
 * Last-resort rates when the FX API is unreachable; the live daily rate
 * always wins. Gulf currencies are USD-pegged so these barely drift;
 * EGP/EUR floats are refreshed by /api/fx anyway.
 */
export const FALLBACK_USD_RATES: Record<CurrencyCode, number> = {
  EGP: 48.17,
  SAR: 3.75,
  AED: 3.6725,
  QAR: 3.64,
  KWD: 0.306,
  BHD: 0.376,
  OMR: 0.3845,
  JOD: 0.709,
  EUR: 0.86,
};

/** KWD/BHD/OMR are strong units — whole-number rounding would eat real money on small ranges. */
export function convertUsd(usd: number, rate: number): number {
  const v = usd * rate;
  return rate < 2 ? Math.round(v * 100) / 100 : Math.round(v);
}

export function fmtFx(n: number): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

/**
 * Convert an EGP-native amount (the monthly retainer prices) into a display
 * currency via the USD cross rate. EGP passes through untouched.
 */
export function egpTo(
  amountEgp: number,
  rates: Record<CurrencyCode, number>,
  code: CurrencyCode,
): number {
  if (code === 'EGP') return amountEgp;
  const v = amountEgp * (rates[code] / rates.EGP);
  // Small unit prices (per-design in KWD etc.) need cents; totals round clean.
  return v < 100 ? Math.round(v * 100) / 100 : Math.round(v);
}

export function tierUsdLabel(t: WebTier, fromWord: string): string {
  return t.usdMax === null
    ? `${fromWord} $${fmt(t.usdMin)}`
    : `$${fmt(t.usdMin)} – $${fmt(t.usdMax)}`;
}

export function tierFxLabel(t: WebTier, rate: number, fromWord: string, symbol: string): string {
  const min = fmtFx(convertUsd(t.usdMin, rate));
  return t.usdMax === null
    ? `${fromWord} ${min} ${symbol}`
    : `${min} – ${fmtFx(convertUsd(t.usdMax, rate))} ${symbol}`;
}

/** Like tierFxLabel but without the currency mark — UI appends a CurrencyGlyph instead. */
export function tierFxAmount(t: WebTier, rate: number, fromWord: string): string {
  const min = fmtFx(convertUsd(t.usdMin, rate));
  return t.usdMax === null
    ? `${fromWord} ${min}`
    : `${min} – ${fmtFx(convertUsd(t.usdMax, rate))}`;
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
  /** Display currency for web-tier conversion. Absent in old saved links → EGP. */
  currency?: CurrencyCode;
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
