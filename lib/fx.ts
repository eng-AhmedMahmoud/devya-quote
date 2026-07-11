import { FALLBACK_USD_EGP } from '@/lib/pricing';

export type FxResult = {
  rate: number;
  /** true when the rate came from a live provider, false when the fallback constant was used */
  live: boolean;
  /** ISO date of the provider's last update, when known */
  updated: string | null;
  source: 'er-api' | 'currency-api' | 'fallback';
};

// Providers are keyless public APIs that publish daily USD reference rates.
// Next's fetch cache (revalidate) keeps us at ~1 upstream call per window,
// so the daily rate is effectively cached app-wide.
const REVALIDATE_SECONDS = 21_600; // 6h — provider updates daily; 4 checks/day absorbs late pushes

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
  const rate = data?.rates?.EGP;
  if (data?.result !== 'success' || typeof rate !== 'number' || !(rate > 0)) return null;
  return {
    rate,
    live: true,
    updated: data.time_last_update_utc ?? null,
    source: 'er-api',
  };
}

async function fromCurrencyApi(): Promise<FxResult | null> {
  const res = await fetch(
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.min.json',
    { next: { revalidate: REVALIDATE_SECONDS } },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { date?: string; usd?: Record<string, number> };
  const rate = data?.usd?.egp;
  if (typeof rate !== 'number' || !(rate > 0)) return null;
  return { rate, live: true, updated: data.date ?? null, source: 'currency-api' };
}

/** USD→EGP daily rate: primary provider, then mirror, then hardcoded fallback. */
export async function getUsdEgpRate(): Promise<FxResult> {
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
  return { rate: FALLBACK_USD_EGP, live: false, updated: null, source: 'fallback' };
}
