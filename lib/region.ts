import type { Lang } from '@/lib/messages';
import { WEB_TIERS, type CurrencyCode, type WebTierId } from '@/lib/pricing';

/**
 * Regional editions of the quote app — one codebase, resolved from the
 * request hostname:
 *   quote.devya.dev         → eg     (Egypt: EGP only, no USD anywhere)
 *   quote-gulf.devya.dev    → gulf   (SAR default, KWD focus)
 *   quote-global.devya.dev  → global (English only, USD default)
 * `?region=` overrides for local testing.
 */
export type Region = 'eg' | 'gulf' | 'global';

export type RegionConfig = {
  id: Region;
  /** currencies offered in the picker; first entry is the default */
  currencies: CurrencyCode[];
  langs: Lang[];
  defaultLang: Lang;
  /** show the USD band as a secondary line under regional tier prices */
  showUsdBand: boolean;
  /** USD added to each tier before conversion, keyed by tier id */
  upliftUsd: Record<WebTierId, number>;
};

const NO_UPLIFT = Object.fromEntries(WEB_TIERS.map((t) => [t.id, 0])) as Record<WebTierId, number>;

// +$200 on the smallest project rising linearly to +$2000 on the largest.
const EXPORT_UPLIFT = Object.fromEntries(
  WEB_TIERS.map((t, i) => [t.id, 200 + Math.round((1800 * i) / (WEB_TIERS.length - 1) / 100) * 100]),
) as Record<WebTierId, number>;

export const REGIONS: Record<Region, RegionConfig> = {
  eg: {
    id: 'eg',
    currencies: ['EGP'],
    langs: ['ar', 'en'],
    defaultLang: 'ar',
    showUsdBand: false,
    upliftUsd: NO_UPLIFT,
  },
  gulf: {
    id: 'gulf',
    currencies: ['SAR', 'KWD', 'AED', 'QAR', 'BHD', 'OMR'],
    langs: ['ar', 'en'],
    defaultLang: 'ar',
    showUsdBand: true,
    upliftUsd: EXPORT_UPLIFT,
  },
  global: {
    id: 'global',
    currencies: ['USD', 'EUR', 'AED'],
    langs: ['en'],
    defaultLang: 'en',
    showUsdBand: false,
    upliftUsd: EXPORT_UPLIFT,
  },
};

export function regionFromHost(host: string | null | undefined): Region {
  const h = (host || '').toLowerCase();
  if (h.startsWith('quote-gulf.')) return 'gulf';
  if (h.startsWith('quote-global.')) return 'global';
  return 'eg';
}

export function resolveRegion(host: string | null | undefined, override?: string | null): Region {
  if (override === 'eg' || override === 'gulf' || override === 'global') return override;
  return regionFromHost(host);
}
