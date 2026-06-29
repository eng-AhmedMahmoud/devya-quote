export const PRICE = {
  video: 350,
  content: 2500,
  adMin: 30000,
  mgmt: 0.2,
} as const;

export type QuoteState = {
  designs: number;
  videos: number;
  content: boolean;
  adsOn: boolean;
  adBudget: number;
  web: boolean;
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
