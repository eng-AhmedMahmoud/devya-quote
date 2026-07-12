'use client';

import { useEffect, useState } from 'react';
import { FALLBACK_USD_RATES, type CurrencyCode } from '@/lib/pricing';

export type FxState = {
  /** USD → currency rates for every supported display currency */
  rates: Record<CurrencyCode, number>;
  /** false until /api/fx confirms live provider rates */
  live: boolean;
  /** true once the fetch settled (success or failure) — lets callers wait before printing */
  settled: boolean;
};

/** Daily USD→currency rates from /api/fx; renders with fallbacks until live rates land. */
export function useUsdRates(): FxState {
  const [fx, setFx] = useState<FxState>({
    rates: { ...FALLBACK_USD_RATES },
    live: false,
    settled: false,
  });

  useEffect(() => {
    let cancelled = false;
    // ?v=2 busts browser caches of the pre-multi-currency response shape
    // (old body had a single `rate` field and max-age=3600).
    fetch('/api/fx?v=2')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { rates?: Record<string, number>; live?: boolean } | null) => {
        if (cancelled) return;
        if (d?.rates && typeof d.rates === 'object') {
          setFx((s) => ({
            rates: { ...s.rates, ...(d.rates as Record<CurrencyCode, number>) },
            live: d.live === true,
            settled: true,
          }));
        } else {
          setFx((s) => ({ ...s, settled: true }));
        }
      })
      .catch(() => {
        if (!cancelled) setFx((s) => ({ ...s, settled: true }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return fx;
}
