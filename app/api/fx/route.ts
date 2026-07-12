import { NextResponse } from 'next/server';
import { getUsdRates } from '@/lib/fx';

// The upstream fetches inside getUsdRates carry their own revalidate window;
// mark the route dynamic so a failed lookup isn't frozen into the static shell
// at build time — the fetch cache still keeps upstream calls to ~4/day.
export const dynamic = 'force-dynamic';

export async function GET() {
  const fx = await getUsdRates();
  return NextResponse.json(fx, {
    headers: {
      // Let browsers/CDN reuse the answer for an hour; SWR for a day.
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
