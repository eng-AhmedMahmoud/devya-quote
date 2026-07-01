'use client';

import { DEVYA_PARTY } from '@/lib/devya-party';
import { DevyaMark } from '@/components/ui/devya-logo';
import { MESSAGES, type Lang } from '@/lib/messages';
import { calc, fmt, type QuoteState } from '@/lib/pricing';

const dict = {
  en: {
    badge: 'QUOTE',
    eyebrow: 'Quote · Proposal',
    h1: 'Monthly Quote',
    sub: 'Transparent, itemised pricing. You pay for the actual deliverables — design, video, content, ads — then a single 20% management layer covers strategy, brand, media buying and consulting.',
    email: 'Email',
    phone: 'Phone',
    website: 'Web',
    portfolio: 'Portfolio',
    booking: 'Book a call',
    quoteLink: 'Quote',
    date: 'Date',
    confidential: 'Confidential',
    section: 'Section',
    page: 'Page',
    of: 'of',
    sec1: 'Services & volumes',
    sec2: 'Investment summary',
    sec3: 'Payment plan',
    sec4: 'Terms & notes',
    services: 'Services',
    qty: 'Qty',
    unit: 'Unit price',
    line: 'Monthly total',
    designs: 'Design & creative',
    designsNote: 'Social posts, ad creative, and visuals. Tiered pricing by volume.',
    videos: 'Video editing',
    videosNote: 'Reels and ad cuts. Larger batches get a custom rate.',
    content: 'Content — scripts & plan',
    contentNote: 'Monthly content plan and scripts. Flat fee.',
    ads: 'Ad budget',
    adsNote: 'Goes 100% to Meta / Google. We never mark it up.',
    web: 'Websites & systems',
    webNote: 'Stores, custom development, dashboards. Custom-priced after a scoping call. Not part of the monthly bundle.',
    subtotal: 'Subtotal',
    mgmt: 'Management (20%)',
    mgmtNote: 'Strategy, brand, media buying, consulting — calculated on the month\'s total spend.',
    total: 'Monthly total',
    designsUnit: 'EGP / design',
    videosUnit: 'EGP / video',
    contentUnit: 'EGP / month',
    adsUnit: 'EGP / month',
    perMonth: '/ month',
    notesTitle: 'Notes',
    notes: [
      'No hidden fees. The number you see above is the number you pay.',
      '100% of the ad budget goes to platforms (Meta, Google, etc.).',
      'Management is one flat 20% layer on top of all spend.',
      'Numbers are an estimate based on the volumes selected. Final figures confirmed on a call.',
    ],
    payRows: [
      { tag: 'When available', sub: 'Preferably start of month', name: 'Ad budget (100%)', desc: 'Paid as available, ideally at the start of the month so campaigns run uninterrupted. Sent directly to Meta / Google. Minimum 30,000 EGP/month. The full amount is yours — we never mark it up.' },
      { tag: 'Every 2 weeks', sub: 'Or start of month', name: 'Content plan & scripts', desc: 'Paid bi-weekly or at the start of the month — whichever fits your cycle. Flat 2,500 EGP/month for the content plan and scripts.' },
      { tag: 'Weekly', sub: 'End of each week', name: 'Designs & videos', desc: 'Billed weekly against what was actually delivered — you pay for work in your hand, not upfront.' },
      { tag: 'With monthly invoice', sub: '20%', name: 'Management, brand, media buying & consulting', desc: '20% calculated on the month\'s total payments (ad budget included). One clean number — we own the outcomes end-to-end.' },
      { tag: 'Project milestones', sub: 'If required', name: 'Websites, apps & systems', desc: 'Priced and paid separately in milestone tranches (e.g. 50% kickoff / 50% on delivery), scoped on a discovery call. Not part of the monthly retainer.' },
    ],
  },
  ar: {
    badge: 'عرض سعر',
    eyebrow: 'عرض سعر · مقترح',
    h1: 'عرض السعر الشهري',
    sub: 'تسعير شفّاف ومبوّب: بتدفع مقابل الشغل الفعلي — تصميم وفيديو ومحتوى وإعلانات — وبعدين طبقة إدارة واحدة 20% بتغطّي الاستراتيجية والعلامة والميديا باينج والاستشارات.',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    website: 'الموقع',
    portfolio: 'أعمالنا',
    booking: 'احجز مكالمة',
    quoteLink: 'عرض السعر',
    date: 'التاريخ',
    confidential: 'سري',
    section: 'القسم',
    page: 'صفحة',
    of: 'من',
    sec1: 'الخدمات والكميات',
    sec2: 'ملخّص العرض المالي',
    sec3: 'خطة الدفع',
    sec4: 'ملاحظات وبنود',
    services: 'الخدمة',
    qty: 'الكمية',
    unit: 'سعر الوحدة',
    line: 'الإجمالي الشهري',
    designs: 'التصميمات والكرييتيف',
    designsNote: 'بوستات سوشيال وإعلانات وفيجوال — السعر بالتدرّج حسب الكمية.',
    videos: 'مونتاج الفيديو',
    videosNote: 'مونتاج ريلز وإعلانات. الكميات الكبيرة بسعر خاص.',
    content: 'المحتوى — سكريبتات وخطة',
    contentNote: 'خطة محتوى شهرية وسكريبتات. مبلغ ثابت.',
    ads: 'ميزانية الإعلانات',
    adsNote: 'بتروح للمنصات (ميتا/جوجل) 100% — وعمرنا ما بنزوّد عليها.',
    web: 'مواقع وتطبيقات وأنظمة',
    webNote: 'بنائها وتطويرها بسعر خاص بعد اجتماع نطاق. مش جزء من الباقة الشهرية.',
    subtotal: 'الإجمالي الفرعي',
    mgmt: 'الإدارة (20%)',
    mgmtNote: 'استراتيجية وعلامة وميديا باينج واستشارات — محسوبة على إجمالي مدفوعات الشهر.',
    total: 'الإجمالي الشهري',
    designsUnit: 'ج.م / تصميم',
    videosUnit: 'ج.م / فيديو',
    contentUnit: 'ج.م / شهر',
    adsUnit: 'ج.م / شهر',
    perMonth: '/ شهر',
    notesTitle: 'ملاحظات',
    notes: [
      'مفيش رسوم مخفية. الرقم اللي فوق هو اللي بتدفعه.',
      'ميزانية الإعلانات 100% بتاعتكم — بتروح للمنصات مباشرة.',
      'الإدارة طبقة واحدة 20% فوق كل المدفوعات.',
      'الأرقام تقديرية بناءً على الكميات المختارة. بنأكّد القيم النهائية في اجتماع.',
    ],
    payRows: [
      { tag: 'حسب توفّرها', sub: 'يفضّل أول الشهر', name: 'ميزانية الإعلانات (100%)', desc: 'بتتدفع حسب توفّرها، ويُفضّل تكون أول الشهر عشان الحملات تشتغل من غير توقف. بتروح للمنصات (ميتا/جوجل) مباشرة. الحد الأدنى ٣٠٬٠٠٠ ج.م/شهر، والمبلغ بالكامل بتاعكم وعمرنا ما بنزوّد عليه.' },
      { tag: 'كل أسبوعين', sub: 'أو أول الشهر', name: 'خطة المحتوى والسكريبتات', desc: 'بتتدفع كل أسبوعين، أو في بداية الشهر — زي ما يناسبكم. القيمة ٢٬٥٠٠ ج.م شهريًا مقابل خطة المحتوى والسكريبتات.' },
      { tag: 'أسبوعيًا', sub: 'آخر كل أسبوع', name: 'التصميمات والفيديوهات', desc: 'فوترة أسبوعية حسب اللي اتسلّم فعليًا خلال الأسبوع — بتدفع مقابل شغل خلص وبين إيديك، مش مقدّمًا.' },
      { tag: 'مع فاتورة الشهر', sub: '20%', name: 'الإدارة والعلامة والميديا باينج والاستشارات', desc: 'نسبة ٢٠٪ محسوبة على إجمالي مدفوعات الشهر (بما فيها ميزانية الإعلانات) — رقم واحد واضح، وإحنا مسؤولين تمامًا عن النتايج.' },
      { tag: 'دفعات المشروع', sub: 'لو مطلوب', name: 'المواقع والتطبيقات والأنظمة', desc: 'بتتسعّر وتتدفع لوحدها على دفعات حسب مراحل المشروع (مثلًا ٥٠٪ مقدّم / ٥٠٪ عند التسليم) — بعد اجتماع نحدّد فيه النطاق. مش جزء من الاشتراك الشهري.' },
    ],
  },
} as const;

interface Props {
  state: QuoteState;
  lang: Lang;
  date?: string; // YYYY-MM-DD
}

function todayLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDateLocal(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(date);
}

export function QuoteDocumentPreview({ state, lang, date }: Props) {
  const isAr = lang === 'ar';
  const d = dict[lang];
  const c = calc(state);
  const today = date || todayLocal();
  const niceDate = formatDateLocal(today, lang);
  const year = today.slice(0, 4);
  const currency = isAr ? 'ج.م' : 'EGP';
  const dash = '—';
  const totalPages = 4; // 01 services, 02 investment, 03 payments, 04 notes

  const sections: { kicker: string; render: () => React.ReactNode }[] = [
    { kicker: d.sec1, render: () => renderServices() },
    { kicker: d.sec2, render: () => renderInvestment() },
    { kicker: d.sec3, render: () => renderPaymentPlan() },
    { kicker: d.sec4, render: () => renderNotes() },
  ];

  function renderServices() {
    return (
      <>
        <h2>{d.sec1}</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
          <thead>
            <tr>
              <th style={th(isAr)}>{d.services}</th>
              <th style={{ ...th(isAr), width: '14%' }}>{d.qty}</th>
              <th style={{ ...th(isAr), width: '24%' }}>{d.unit}</th>
              <th style={{ ...th(isAr), width: '24%' }}>{d.line}</th>
            </tr>
          </thead>
          <tbody>
            {state.designs > 0 && (
              <Row
                isAr={isAr}
                zebra={0}
                name={d.designs}
                note={d.designsNote}
                qty={String(state.designs)}
                unitVal={`${fmt(c.dUnit)} ${d.designsUnit}`}
                lineVal={`${fmt(c.designs)} ${currency}`}
              />
            )}
            {state.videos > 0 && (
              <Row
                isAr={isAr}
                zebra={1}
                name={d.videos}
                note={d.videosNote}
                qty={String(state.videos)}
                unitVal={`350 ${d.videosUnit}`}
                lineVal={`${fmt(c.videos)} ${currency}`}
              />
            )}
            {state.content && (
              <Row
                isAr={isAr}
                zebra={2}
                name={d.content}
                note={d.contentNote}
                qty="1"
                unitVal={`2,500 ${d.contentUnit}`}
                lineVal={`${fmt(c.content)} ${currency}`}
              />
            )}
            {state.adsOn && (
              <Row
                isAr={isAr}
                zebra={3}
                name={d.ads}
                note={d.adsNote}
                qty="1"
                unitVal={`${fmt(c.adEff)} ${d.adsUnit}`}
                lineVal={`${fmt(c.adEff)} ${currency}`}
              />
            )}
            {state.web && (
              <Row
                isAr={isAr}
                zebra={4}
                name={d.web}
                note={d.webNote}
                qty={dash}
                unitVal={dash}
                lineVal={dash}
              />
            )}
          </tbody>
        </table>
      </>
    );
  }

  function renderInvestment() {
    return (
      <>
        <h2>{d.sec2}</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
          <tbody>
            <tr>
              <td style={tdLabel(isAr)}>{d.subtotal}</td>
              <td style={tdVal(isAr)}>{`${fmt(c.subtotal)} ${currency}`}</td>
            </tr>
            <tr style={{ background: '#fafaf9' }}>
              <td style={tdLabel(isAr)}>
                <strong>{d.mgmt}</strong>
                <div style={{ fontSize: '9pt', color: '#71717a', marginTop: 2 }}>{d.mgmtNote}</div>
              </td>
              <td style={tdVal(isAr)}>{`${fmt(c.mgmt)} ${currency}`}</td>
            </tr>
            <tr style={{ background: '#020202', color: '#fafaf9' }}>
              <td style={{ ...tdLabel(isAr), color: '#fafaf9', fontSize: '13pt', padding: '14pt 18pt' }}>
                <strong>{d.total}</strong>
              </td>
              <td style={{ ...tdVal(isAr), color: '#fafaf9', fontSize: '18pt', padding: '14pt 18pt' }}>
                <strong>{`${fmt(c.total)} ${currency}`}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }

  function renderPaymentPlan() {
    return (
      <>
        <h2>{d.sec3}</h2>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {d.payRows.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '160pt 1fr',
                gap: 16,
                padding: '12pt 14pt',
                border: '1px solid #e4e4e7',
                borderRadius: 4,
                background: i % 2 === 1 ? '#fafaf9' : '#ffffff',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '3pt 10pt',
                    borderRadius: 999,
                    background: i % 2 === 0 ? '#020202' : 'transparent',
                    color: i % 2 === 0 ? '#fafaf9' : '#27272a',
                    border: i % 2 === 0 ? 'none' : '1px solid #d4d4d8',
                    fontSize: '9pt',
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  {r.tag}
                </span>
                <div style={{ fontSize: '8.5pt', color: '#71717a', fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
                  {r.sub}
                </div>
              </div>
              <div>
                <strong style={{ fontSize: '11pt' }}>{r.name}</strong>
                <p style={{ fontSize: '10pt', color: '#3f3f46', marginTop: 4, lineHeight: 1.6 }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  function renderNotes() {
    return (
      <>
        <h2>{d.notesTitle}</h2>
        <ul style={{ marginTop: 12, paddingInlineStart: 18 }}>
          {d.notes.map((n, i) => (
            <li key={i} style={{ marginBottom: 8, lineHeight: 1.7 }}>{n}</li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <div className="doc-stage">
      {/* Cover */}
      <div className={`doc-page doc-cover ${isAr ? 'rtl' : ''}`}>
        <div className="doc-cover-inner">
          <div className="doc-cover-top">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fafaf9' }}>
              <DevyaMark size={18} />
              <span style={{ fontWeight: 600, letterSpacing: '0.1em', fontSize: 11 }}>
                {isAr ? DEVYA_PARTY.nameAr : 'DEVYA SOLUTIONS'}
              </span>
            </span>
            <span>{d.badge}</span>
          </div>

          <div className="doc-cover-mid">
            <div style={{ color: '#a1a1aa', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>
              {d.eyebrow}
            </div>
            <h1 style={{ fontFamily: isAr ? "'Amiri', var(--font-amiri), serif" : 'inherit' }}>
              {d.h1}
            </h1>
            <p
              className="cover-sub"
              style={{ fontFamily: isAr ? "'Amiri', var(--font-amiri), serif" : 'inherit' }}
            >
              {d.sub}
            </p>

          </div>

          <div className="doc-cover-bot">
            <div className="cover-meta">
              <span><strong>{d.email}</strong> · {DEVYA_PARTY.email}</span>
              <span><strong>{d.phone}</strong> · {DEVYA_PARTY.phone}</span>
              <span><strong>{d.website}</strong> · {DEVYA_PARTY.website}</span>
              <span><strong>{d.portfolio}</strong> · {DEVYA_PARTY.portfolioLabel}</span>
              <span><strong>{d.booking}</strong> · {DEVYA_PARTY.bookingLabel}</span>
              <span><strong>{d.quoteLink}</strong> · {DEVYA_PARTY.quoteLabel}</span>
              <span><strong>{d.date}</strong> · {niceDate}</span>
            </div>
            <div className="cover-year">{year}</div>
          </div>
        </div>
      </div>

      {/* Section pages */}
      {sections.map((s, idx) => {
        const num = String(idx + 1).padStart(2, '0');
        return (
          <div key={idx} className={`doc-page ${isAr ? 'rtl' : ''}`}>
            <div className="doc-strip">
              <span className="doc-strip-brand">
                <DevyaMark size={14} />
                {isAr ? DEVYA_PARTY.nameAr : 'Devya Solutions'}
              </span>
              <span className="doc-strip-meta">
                {d.h1} · {d.confidential}
              </span>
            </div>

            <div className="doc-body">
              <div style={{ marginBottom: 18 }}>
                <span className="doc-section-kicker">
                  {d.section} {num} — {s.kicker}
                </span>
                <div>
                  <span className="doc-section-num">
                    {num.charAt(0)}
                    <span className="light">{num.charAt(1)}</span>
                  </span>
                </div>
              </div>
              {s.render()}
            </div>

            <div className="doc-footer-strip">
              <span>{niceDate}</span>
              <span>{d.page} {num} {d.of} {String(totalPages).padStart(2, '0')}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function th(isAr: boolean): React.CSSProperties {
  return {
    textAlign: isAr ? 'right' : 'left',
    background: '#020202',
    color: '#fafaf9',
    padding: '9pt 12pt',
    fontSize: '9.5pt',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    border: '1px solid #020202',
  };
}

function tdLabel(isAr: boolean): React.CSSProperties {
  return {
    padding: '10pt 14pt',
    border: '1px solid #e4e4e7',
    textAlign: isAr ? 'right' : 'left',
    verticalAlign: 'top',
  };
}

function tdVal(isAr: boolean): React.CSSProperties {
  return {
    padding: '10pt 14pt',
    border: '1px solid #e4e4e7',
    textAlign: isAr ? 'left' : 'right',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    whiteSpace: 'nowrap',
    width: '34%',
  };
}

function Row({
  isAr, zebra, name, note, qty, unitVal, lineVal,
}: {
  isAr: boolean; zebra: number; name: string; note: string; qty: string; unitVal: string; lineVal: string;
}) {
  const bg = zebra % 2 === 1 ? '#fafaf9' : '#ffffff';
  return (
    <tr style={{ background: bg }}>
      <td style={tdLabel(isAr)}>
        <strong>{name}</strong>
        <div style={{ fontSize: '9pt', color: '#71717a', marginTop: 2 }}>{note}</div>
      </td>
      <td style={{ ...tdVal(isAr), width: '14%' }}>{qty}</td>
      <td style={{ ...tdVal(isAr), width: '24%' }}>{unitVal}</td>
      <td style={{ ...tdVal(isAr), width: '24%', fontWeight: 700 }}>{lineVal}</td>
    </tr>
  );
}
