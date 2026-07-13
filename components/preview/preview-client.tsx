'use client';

import { Suspense, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { QuoteDocumentPreview } from '@/components/preview/quote-document-preview';
import type { Lang } from '@/lib/messages';
import type { QuoteState } from '@/lib/pricing';
import { decodeQuoteState } from '@/lib/quote-ref';
import { REGIONS, type Region } from '@/lib/region';
import { useUsdRates } from '@/lib/use-fx';

const DEFAULT_STATE: QuoteState = {
  designs: 20,
  videos: 8,
  content: true,
  adsOn: true,
  adBudget: 30000,
  web: false,
  webTier: null,
  currency: 'EGP',
};

function PreviewInner({ region }: { region: Region }) {
  const params = useSearchParams();
  const cfg = REGIONS[region];
  const langParam = params.get('lang') as Lang | null;
  const lang: Lang =
    langParam && cfg.langs.includes(langParam) ? langParam : cfg.defaultLang;
  const auto = params.get('auto') === '1';
  const stateOverride = decodeQuoteState(params.get('s'));

  const state: QuoteState = useMemo(() => {
    const merged = { ...DEFAULT_STATE, currency: cfg.currencies[0], ...(stateOverride || {}) };
    if (!merged.currency || !cfg.currencies.includes(merged.currency)) {
      merged.currency = cfg.currencies[0];
    }
    return merged;
  }, [stateOverride, cfg]);

  const fx = useUsdRates();
  // Only web-project pricing depends on the live rate — don't hold up the
  // print dialog for it unless a tier is actually shown on the document.
  const fxReady = fx.settled || !(state.web && state.webTier);

  useEffect(() => {
    if (!auto || !fxReady) return;
    // Wait for fonts + layout to settle before opening print dialog.
    const ready = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready;
    const trigger = () => setTimeout(() => window.print(), 600);
    if (ready && typeof (ready as Promise<unknown>).then === 'function') {
      (ready as Promise<unknown>).then(trigger);
    } else {
      trigger();
    }
  }, [auto, fxReady]);

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      lang={lang}
      className={lang === 'ar' ? 'font-amiri' : 'font-sora'}
    >
      <QuoteDocumentPreview state={state} lang={lang} fxRates={fx.rates} region={region} />
    </div>
  );
}

export function PreviewClient({ region }: { region: Region }) {
  return (
    <Suspense fallback={<div className="p-10 text-zinc-400">Loading preview…</div>}>
      <PreviewInner region={region} />
    </Suspense>
  );
}
