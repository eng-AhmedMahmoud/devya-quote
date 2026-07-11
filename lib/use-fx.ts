'use client';

import { useEffect, useState } from 'react';
import { FALLBACK_USD_EGP } from '@/lib/pricing';

export type FxState = {
  rate: number;
  /** false until /api/fx confirms a live provider rate */
  live: boolean;
  /** true once the fetch settled (success or failure) — lets callers wait before printing */
  settled: boolean;
};

/** Daily USD→EGP rate from /api/fx; renders with the fallback until the live rate lands. */
export function useUsdEgp(): FxState {
  const [fx, setFx] = useState<FxState>({ rate: FALLBACK_USD_EGP, live: false, settled: false });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/fx')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { rate?: number; live?: boolean } | null) => {
        if (cancelled) return;
        if (d && typeof d.rate === 'number' && d.rate > 0) {
          setFx({ rate: d.rate, live: d.live === true, settled: true });
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
