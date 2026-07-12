import {
  CURRENCIES,
  FALLBACK_USD_RATES,
  type CurrencyCode,
} from '@/lib/pricing';

export type FxResult = {
  /** USD → currency rates for every supported display currency */
  rates: Record<CurrencyCode, number>;
  /** true when the rates came from a live provider, false when the fallback constants were used */
  live: boolean;
  /** ISO date of the provider's last update, when known */
  updated: string | null;
  source: 'er-api' | 'currency-api' | 'fallback';
};

// Providers are keyless public APIs that publish daily USD reference rates.
// Next's fetch cache (revalidate) keeps us at ~1 upstream call per window,
// so the daily rates are effectively cached app-wide.
const REVALIDATE_SECONDS = 21_600; // 6h — providers update daily; 4 checks/day absorbs late pushes

/** Pick supported codes out of a provider's full rate map; fallback fills gaps. */
function pickRates(all: Record<string, number | undefined>): Record<CurrencyCode, number> | null {
  const rates = {} as Record<CurrencyCode, number>;
  let liveCount = 0;
  for (const { code } of CURRENCIES) {
    const v = all[code];
    if (typeof v === 'number' && v > 0) {
      rates[code] = v;
      liveCount += 1;
    } else {
      rates[code] = FALLBACK_USD_RATES[code];
    }
  }
  // A provider that can't even price the majors is not a usable answer.
  return liveCount >= CURRENCIES.length - 2 ? rates : null;
}

async function fromErApi(): Promise<FxResult | null> {
  const res = await fetch('https://open.er-api.com/v6/latest/USD', {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    result?: string;
    rates?: Record<string, number>;
    time_last_update_utc?: string;
  };
  if (data?.result !== 'success' || !data.rates) return null;
  const rates = pickRates(data.rates);
  if (!rates) return null;
  return { rates, live: true, updated: data.time_last_update_utc ?? null, source: 'er-api' };
}

async function fromCurrencyApi(): Promise<FxResult | null> {
  const res = await fetch(
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.min.json',
    { next: { revalidate: REVALIDATE_SECONDS } },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { date?: string; usd?: Record<string, number> };
  if (!data?.usd) return null;
  // This provider keys currencies in lowercase.
  const upper: Record<string, number> = {};
  for (const [k, v] of Object.entries(data.usd)) upper[k.toUpperCase()] = v;
  const rates = pickRates(upper);
  if (!rates) return null;
  return { rates, live: true, updated: data.date ?? null, source: 'currency-api' };
}

/** Daily USD→(MENA/Gulf/EUR) rates: primary provider, then mirror, then hardcoded fallbacks. */
export async function getUsdRates(): Promise<FxResult> {
  try {
    const primary = await fromErApi();
    if (primary) return primary;
  } catch {
    /* fall through */
  }
  try {
    const secondary = await fromCurrencyApi();
    if (secondary) return secondary;
  } catch {
    /* fall through */
  }
  return { rates: { ...FALLBACK_USD_RATES }, live: false, updated: null, source: 'fallback' };
}
