'use client';

import { useState } from 'react';
import { Printer, ExternalLink, FileDown } from 'lucide-react';
import type { Lang } from '@/lib/messages';
import { MESSAGES } from '@/lib/messages';
import {
  DEFAULT_CURRENCY,
  calc,
  currencySymbol,
  fmt,
  getWebTier,
  tierFxLabel,
  tierUsdLabel,
  type CurrencyCode,
  type QuoteState,
} from '@/lib/pricing';

function encodeState(state: QuoteState): string {
  if (typeof window === 'undefined') return '';
  return btoa(JSON.stringify(state));
}

interface Props {
  state: QuoteState;
  lang: Lang;
  defaultAdBudget: number;
  fxRates: Record<CurrencyCode, number>;
}

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || 'https://booking.devya.dev';

function Row({
  name,
  sub,
  val,
  variant,
}: {
  name: string;
  sub?: string;
  val: string;
  variant?: 'normal' | 'sub' | 'mgmt';
}) {
  const isSub = variant === 'sub';
  const isMgmt = variant === 'mgmt';
  return (
    <div
      className={`flex items-baseline justify-between gap-3 py-2.5 border-b border-dashed border-white/5 ${
        isSub ? 'border-b border-solid border-white/10 border-t border-t-white/5 mt-1.5' : ''
      }`}
    >
      <span
        className={`text-[15px] ${
          isSub ? 'text-white font-semibold' : isMgmt ? 'text-zinc-200' : 'text-zinc-400'
        }`}
      >
        {name}
        {sub && <span className="block text-[12px] text-zinc-500 font-mono mt-0.5">{sub}</span>}
      </span>
      <span
        className={`font-mono font-bold text-[16px] whitespace-nowrap ${
          isSub ? 'text-white' : isMgmt ? 'text-zinc-200' : 'text-white'
        }`}
      >
        {val}
      </span>
    </div>
  );
}

export function InvoicePanel({ state, lang, fxRates }: Props) {
  const c = calc(state);
  const t = MESSAGES[lang].invoice;
  const w = MESSAGES[lang].services.web;
  const [saving, setSaving] = useState(false);
  const currency = lang === 'ar' ? 'ج.م' : 'EGP';

  const any = state.designs > 0 || state.videos > 0 || state.content || state.adsOn;
  const webTier = state.web ? getWebTier(state.webTier) : null;
  const displayCurrency = state.currency ?? DEFAULT_CURRENCY;
  const fxRate = fxRates[displayCurrency];
  const fxSymbol = currencySymbol(displayCurrency, lang === 'ar');

  function handlePrintPreview() {
    const qs = new URLSearchParams({
      lang,
      s: encodeState(state),
      auto: '1',
    });
    window.open(`/preview?${qs.toString()}`, '_blank', 'noopener');
  }

  async function handleDownloadDocx() {
    setSaving(true);
    try {
      const res = await fetch('/api/export-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang, state }),
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cd = res.headers.get('content-disposition') || '';
      const m = cd.match(/filename="?([^"]+)"?/i);
      a.download = m?.[1] || `devya-quote-${lang}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      handlePrintPreview();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="surface-strong p-6 shadow-[0_26px_64px_-26px_rgba(0,0,0,0.85)]">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-2">
        <span className="font-sora font-bold text-[19px] text-white">{t.kick}</span>
        <span className="text-[12px] text-zinc-500 font-medium tracking-wide uppercase">{t.mo}</span>
      </div>

      <div>
        {!any && !webTier && (
          <div className="text-center text-[15px] text-zinc-500 py-5">{t.empty}</div>
        )}

        {state.designs > 0 && (
          <Row
            name={t.rowDesigns}
            sub={t.rowDesignsHint(state.designs, c.dUnit, state.designs > 30)}
            val={`${fmt(c.designs)} ${currency}`}
          />
        )}
        {state.videos > 0 && (
          <Row
            name={t.rowVideos}
            sub={t.rowVideosHint(state.videos)}
            val={`${fmt(c.videos)} ${currency}`}
          />
        )}
        {state.content && (
          <Row name={t.rowContent} sub={t.contentFixedHint} val={`${fmt(c.content)} ${currency}`} />
        )}
        {state.adsOn && (
          <Row name={t.rowAds} sub={t.adsPlatformHint} val={`${fmt(c.adEff)} ${currency}`} />
        )}

        {any && (
          <>
            <Row name={t.rowSubtotal} val={`${fmt(c.subtotal)} ${currency}`} variant="sub" />
            <Row name={t.rowMgmt} sub={t.mgmtHint} val={`${fmt(c.mgmt)} ${currency}`} variant="mgmt" />
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t-2 border-white/10">
        <span className="font-sora font-bold text-[17px] text-white">{t.total}</span>
        <span className="font-sora font-extrabold text-[32px] leading-none grad-text tabular-nums">
          {any ? `${fmt(c.total)} ${currency}` : '0'}
        </span>
      </div>

      {/* One-off web project — priced in USD, outside the monthly total */}
      {webTier && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[14px] font-semibold text-zinc-200">{t.webProjectTitle}</span>
            <span className="font-mono font-bold text-[16px] text-white whitespace-nowrap">
              {tierUsdLabel(webTier, w.from)}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-3 mt-1">
            <span className="text-[13px] text-zinc-500">{w.tiers[webTier.id].name}</span>
            <span className="font-mono text-[13px] text-zinc-400 whitespace-nowrap">
              {w.approx} {tierFxLabel(webTier, fxRate, w.from, fxSymbol)}
            </span>
          </div>
          <p className="text-[12px] text-zinc-500 mt-2 leading-relaxed">{t.webProjectNote}</p>
        </div>
      )}

      <div className="text-[13px] text-zinc-500 mt-4 leading-relaxed space-y-1.5">
        {state.web && !webTier && (
          <p>
            <span className="text-zinc-200 font-semibold">{t.footnoteWeb}</span>
          </p>
        )}
        <p>{t.footnoteEstim}</p>
      </div>

      <div className="flex gap-2 mt-5 flex-wrap">
        <button
          type="button"
          onClick={handlePrintPreview}
          className="flex-1 inline-flex items-center justify-center gap-2 font-medium text-[15px] text-zinc-950 bg-white rounded-full px-4 py-3 transition hover:bg-zinc-200 whitespace-nowrap"
        >
          <Printer className="h-4 w-4" />
          {t.save}
        </button>
        <button
          type="button"
          onClick={handleDownloadDocx}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 font-medium text-[15px] text-white bg-transparent border border-white/10 rounded-full px-4 py-3 transition hover:bg-white/5 hover:border-white disabled:opacity-60 whitespace-nowrap"
          aria-label={lang === 'ar' ? 'تحميل Word' : 'Download Word'}
          title={lang === 'ar' ? 'تحميل ‎.docx' : 'Download .docx'}
        >
          <FileDown className="h-4 w-4" />
        </button>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 font-medium text-[15px] text-white bg-transparent border border-white/10 rounded-full px-4 py-3 transition hover:bg-white/5 hover:border-white whitespace-nowrap"
        >
          {t.book}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
