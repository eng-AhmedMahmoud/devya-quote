import { headers } from 'next/headers';
import { QuoteBuilder } from '@/components/builder/quote-builder';
import { resolveRegion } from '@/lib/region';

// Region is resolved per-request from the Host header (quote / quote-gulf /
// quote-global), so this page renders dynamically instead of as a static shell.
export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; s?: string; lang?: string }>;
}) {
  const h = await headers();
  const { region: override, s, lang } = await searchParams;
  const region = resolveRegion(h.get('host'), override);
  return <QuoteBuilder region={region} initialStateB64={s ?? null} initialLang={lang ?? null} />;
}
