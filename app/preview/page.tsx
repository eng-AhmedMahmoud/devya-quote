'use client';

import { Suspense, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { QuoteDocumentPreview } from '@/components/preview/quote-document-preview';
import type { Lang } from '@/lib/messages';
import type { QuoteState } from '@/lib/pricing';

const DEFAULT_STATE: QuoteState = {
  designs: 20,
  videos: 8,
  content: true,
  adsOn: true,
  adBudget: 30000,
  web: false,
};

function decode(s: string | null): Partial<QuoteState> | null {
  if (!s) return null;
  try {
    const json = typeof window === 'undefined' ? '' : atob(s);
    return JSON.parse(json) as Partial<QuoteState>;
  } catch {
    return null;
  }
}

function PreviewInner() {
  const params = useSearchParams();
  const lang = (params.get('lang') === 'en' ? 'en' : 'ar') as Lang;
  const clientName = params.get('client') || undefined;
  const auto = params.get('auto') === '1';
  const stateOverride = decode(params.get('s'));

  const state: QuoteState = useMemo(
    () => ({ ...DEFAULT_STATE, ...(stateOverride || {}) }),
    [stateOverride],
  );

  useEffect(() => {
    if (!auto) return;
    // Wait for fonts + layout to settle before opening print dialog.
    const ready = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready;
    const trigger = () => setTimeout(() => window.print(), 600);
    if (ready && typeof (ready as Promise<unknown>).then === 'function') {
      (ready as Promise<unknown>).then(trigger);
    } else {
      trigger();
    }
  }, [auto]);

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      lang={lang}
      className={lang === 'ar' ? 'font-amiri' : 'font-sora'}
    >
      <QuoteDocumentPreview state={state} lang={lang} clientName={clientName} />
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="p-10 text-zinc-400">Loading preview…</div>}>
      <PreviewInner />
    </Suspense>
  );
}
