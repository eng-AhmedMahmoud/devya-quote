/**
 * docx builders for the quote export.
 *
 * Conventions mirror devya-contracts/app/api/export-docx/route.ts exactly:
 *   - Color palette in COLORS (ink / paper / zinc tones / divider / highlight)
 *   - Font: Inter for Latin, Amiri for Arabic, both passed as
 *     { name, hint: 'eastAsia' } so Word respects the font in RTL runs.
 *   - RTL: `bidirectional: isAr` on every Paragraph; right-align for AR,
 *     left-align for EN.
 *   - Tables: 1pt #E4E4E7 borders, zebra body rows (F4F4F5 / FFFFFF),
 *     headers on ink with FAFAF9 text. 140/180 padding for body cells.
 */

import {
  AlignmentType,
  BorderStyle,
  Footer,
  Header,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';

import { COLORS, FONT_AR, FONT_LATIN } from './colors';
import { DEVYA_PARTY } from '@/lib/devya-party';
import { calc, PRICE, type QuoteState } from '@/lib/pricing';

/* ----------------------------------------------------------------- */
/* Small util helpers                                                 */
/* ----------------------------------------------------------------- */

export function tableBorders(color: string) {
  const b = { style: BorderStyle.SINGLE, size: 4, color }; // size 4 = 1pt
  return {
    top: b,
    bottom: b,
    left: b,
    right: b,
    insideHorizontal: b,
    insideVertical: b,
  };
}

function noBorders() {
  const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  return {
    top: none,
    bottom: none,
    left: none,
    right: none,
    insideHorizontal: none,
    insideVertical: none,
  };
}

const fontFor = (isAr: boolean) => (isAr ? FONT_AR : FONT_LATIN);
const alignFor = (isAr: boolean) =>
  isAr ? AlignmentType.RIGHT : AlignmentType.LEFT;

const fontOpt = (isAr: boolean) =>
  ({ name: fontFor(isAr), hint: 'eastAsia' as const });

// Cairo / Arabic-comma friendly money formatter (no locale magic needed).
function fmtMoney(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

/* ----------------------------------------------------------------- */
/* Local mini-dictionary (mirrors quote-app/lib/messages.ts payRows)  */
/* ----------------------------------------------------------------- */

type PayRow = {
  when: { en: string; ar: string };
  wtag: { en: string; ar: string };
  desc: { en: string; ar: string };
};

const PAY_ROWS: PayRow[] = [
  {
    when: { en: 'On signing', ar: 'عند التوقيع' },
    wtag: { en: '30%', ar: '30٪' },
    desc: {
      en: 'Kicks off the engagement — kickoff call, brand & asset handover, sprint 1 setup.',
      ar: 'بدء التكليف — اجتماع البداية، تسليم العلامة والأصول، تجهيز السبرنت الأول.',
    },
  },
  {
    when: { en: 'On first review', ar: 'عند المراجعة الأولى' },
    wtag: { en: '25%', ar: '25٪' },
    desc: {
      en: 'After the first round of designs / first content batch is delivered for review.',
      ar: 'بعد تسليم الجولة الأولى من التصاميم أو الدفعة الأولى من المحتوى للمراجعة.',
    },
  },
  {
    when: { en: 'Mid-campaign', ar: 'منتصف الحملة' },
    wtag: { en: '20%', ar: '20٪' },
    desc: {
      en: 'Roughly halfway through the agreed scope — most assets in flight or approved.',
      ar: 'في منتصف نطاق العمل المتفق عليه — معظم الأصول قيد التنفيذ أو معتمدة.',
    },
  },
  {
    when: { en: 'On final delivery', ar: 'عند التسليم النهائي' },
    wtag: { en: '20%', ar: '20٪' },
    desc: {
      en: 'All deliverables shipped, source files handed over, ad accounts configured.',
      ar: 'تسليم كل المخرجات، تسليم الملفات المصدرية، وضبط حسابات الإعلانات.',
    },
  },
  {
    when: { en: 'Post-launch handover', ar: 'تسليم ما بعد الإطلاق' },
    wtag: { en: '5%', ar: '5٪' },
    desc: {
      en: 'Final QA, performance handover note, retainer / next-phase scoping.',
      ar: 'المراجعة النهائية، تقرير الأداء، وتحديد نطاق المرحلة القادمة.',
    },
  },
];

/* ----------------------------------------------------------------- */
/* Header strip — ink bar on every page                              */
/* ----------------------------------------------------------------- */

export function makeHeaderStrip(isAr: boolean): Header {
  return new Header({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          ...noBorders(),
          bottom: { style: BorderStyle.SINGLE, size: 8, color: COLORS.ink },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                shading: { type: ShadingType.SOLID, color: COLORS.ink, fill: COLORS.ink },
                margins: { top: 100, bottom: 100, left: 200, right: 200 },
                borders: noBorders(),
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        font: fontOpt(isAr),
                        size: 16,
                        color: COLORS.paper,
                        bold: true,
                        text: 'DEVYA',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                shading: { type: ShadingType.SOLID, color: COLORS.ink, fill: COLORS.ink },
                margins: { top: 100, bottom: 100, left: 200, right: 200 },
                borders: noBorders(),
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({
                        font: fontOpt(isAr),
                        size: 16,
                        color: COLORS.zinc300,
                        text: isAr ? 'QUOTE  /  عرض سعر' : 'QUOTE  /  عرض سعر',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/* ----------------------------------------------------------------- */
/* Footer strip — contact information                                 */
/* ----------------------------------------------------------------- */

export function makeFooterStrip(isAr: boolean): Footer {
  const line1 = `contact@devya.dev  ·  devya.dev`;
  const line2 = `booking.devya.dev  ·  portfolio.devya.dev  ·  quote.devya.dev`;

  return new Footer({
    children: [
      new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: COLORS.divider } },
        spacing: { before: 80, after: 20 },
        alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
        bidirectional: isAr,
        children: [
          new TextRun({
            font: fontOpt(isAr),
            size: 14,
            color: COLORS.zinc500,
            text: line1,
          }),
        ],
      }),
      new Paragraph({
        alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
        bidirectional: isAr,
        spacing: { after: 60 },
        children: [
          new TextRun({
            font: fontOpt(isAr),
            size: 14,
            color: COLORS.zinc500,
            text: line2,
          }),
        ],
      }),
    ],
  });
}

/* ----------------------------------------------------------------- */
/* Cover block — title + client + date                                */
/* ----------------------------------------------------------------- */

export function makeCover(
  isAr: boolean,
  today: string,
): Paragraph[] {
  const align = alignFor(isAr);
  const font = fontOpt(isAr);

  const kicker = new Paragraph({
    alignment: align,
    bidirectional: isAr,
    spacing: { before: 0, after: 60 },
    children: [
      new TextRun({
        font,
        size: 16,
        color: COLORS.zinc500,
        text: (isAr ? 'عرض سعر  /  QUOTE' : 'QUOTE  /  عرض سعر').toUpperCase(),
        rightToLeft: isAr,
      }),
    ],
  });

  const title = new Paragraph({
    alignment: align,
    bidirectional: isAr,
    spacing: { before: 0, after: 120 },
    children: [
      new TextRun({
        font,
        bold: true,
        size: 72,
        color: COLORS.ink,
        text: isAr ? 'عرض سعر' : 'Project quote',
        rightToLeft: isAr,
      }),
    ],
  });

  const sub = new Paragraph({
    alignment: align,
    bidirectional: isAr,
    spacing: { before: 0, after: 240 },
    children: [
      new TextRun({
        font,
        size: 22,
        color: COLORS.zinc600,
        text: isAr
          ? 'مقترح مبدئي قابل للنقاش — ساري لمدة ثلاثين يومًا من تاريخ الإصدار.'
          : 'Indicative proposal, open for discussion — valid for thirty days from issue date.',
        rightToLeft: isAr,
      }),
    ],
  });

  const dateLine = new Paragraph({
    alignment: align,
    bidirectional: isAr,
    spacing: { before: 160, after: 240 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.divider },
    },
    children: [
      new TextRun({
        font,
        size: 18,
        color: COLORS.zinc600,
        text: `${isAr ? 'تاريخ الإصدار' : 'Issued'} · ${today}`,
        rightToLeft: isAr,
      }),
    ],
  });

  return [kicker, title, sub, dateLine];
}

/* ----------------------------------------------------------------- */
/* Party block — Devya identity                                       */
/* ----------------------------------------------------------------- */

export function makeParty(isAr: boolean): Paragraph[] {
  const align = alignFor(isAr);
  const font = fontOpt(isAr);

  const sectionLabel = new Paragraph({
    alignment: align,
    bidirectional: isAr,
    spacing: { before: 200, after: 40 },
    children: [
      new TextRun({
        font,
        size: 14,
        color: COLORS.zinc500,
        text: (isAr ? 'من' : 'From').toUpperCase(),
      }),
    ],
  });

  const nameLine = new Paragraph({
    alignment: align,
    bidirectional: isAr,
    spacing: { before: 0, after: 60 },
    children: [
      new TextRun({
        font,
        bold: true,
        size: 24,
        color: COLORS.ink,
        rightToLeft: isAr,
        text: isAr ? DEVYA_PARTY.nameAr : DEVYA_PARTY.nameEn,
      }),
    ],
  });

  const repLine = new Paragraph({
    alignment: align,
    bidirectional: isAr,
    spacing: { before: 0, after: 60 },
    children: [
      new TextRun({
        font,
        size: 20,
        color: COLORS.zinc700,
        rightToLeft: isAr,
        text: `${isAr ? 'ويمثلها' : 'Represented by'}: ${
          isAr ? DEVYA_PARTY.representativeAr : DEVYA_PARTY.representativeEn
        }`,
      }),
    ],
  });

  const addressLine = new Paragraph({
    alignment: align,
    bidirectional: isAr,
    spacing: { before: 0, after: 60 },
    children: [
      new TextRun({
        font,
        size: 18,
        color: COLORS.zinc600,
        rightToLeft: isAr,
        text: isAr ? DEVYA_PARTY.addressAr : DEVYA_PARTY.addressEn,
      }),
    ],
  });

  const contactLine = new Paragraph({
    alignment: align,
    bidirectional: isAr,
    spacing: { before: 0, after: 160 },
    children: [
      new TextRun({
        font,
        size: 18,
        color: COLORS.zinc600,
        rightToLeft: isAr,
        text: `${DEVYA_PARTY.email}  ·  ${DEVYA_PARTY.phone}  ·  ${DEVYA_PARTY.website}`,
      }),
    ],
  });

  return [sectionLabel, nameLine, repLine, addressLine, contactLine];
}

/* ----------------------------------------------------------------- */
/* Services table — columns: Service / Qty / Unit / Line              */
/* ----------------------------------------------------------------- */

type ServiceRow = {
  label: string;
  qty: string;
  unit: string; // formatted unit price (e.g. "1,500 EGP")
  line: string; // formatted line total
  note?: string; // small caption shown under the label
};

function headerCell(text: string, width: number, isAr: boolean): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.SOLID, color: COLORS.ink, fill: COLORS.ink },
    margins: { top: 140, bottom: 140, left: 180, right: 180 },
    borders: tableBorders('27272A'),
    children: [
      new Paragraph({
        alignment: alignFor(isAr),
        bidirectional: isAr,
        children: [
          new TextRun({
            font: fontOpt(isAr),
            bold: true,
            size: 16,
            color: COLORS.paper,
            text: text.toUpperCase(),
          }),
        ],
      }),
    ],
  });
}

function bodyCell(
  paragraphs: Paragraph[],
  width: number,
  fill: string,
): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.SOLID, color: fill, fill },
    margins: { top: 140, bottom: 140, left: 180, right: 180 },
    borders: tableBorders(COLORS.divider),
    verticalAlign: VerticalAlign.CENTER,
    children: paragraphs,
  });
}

function textP(
  isAr: boolean,
  text: string,
  opts: { bold?: boolean; size?: number; color?: string; align?: (typeof AlignmentType)[keyof typeof AlignmentType] } = {},
): Paragraph {
  return new Paragraph({
    alignment: opts.align ?? alignFor(isAr),
    bidirectional: isAr,
    children: [
      new TextRun({
        font: fontOpt(isAr),
        bold: opts.bold,
        size: opts.size ?? 20,
        color: opts.color ?? '18181B',
        rightToLeft: isAr,
        text,
      }),
    ],
  });
}

export function makeServicesTable(
  isAr: boolean,
  state: QuoteState,
  c: ReturnType<typeof calc>,
): Table {
  const lbl = isAr
    ? {
        col: { service: 'الخدمة', qty: 'الكمية', unit: 'سعر الوحدة', line: 'الإجمالي' },
        designs: 'تصاميم ثابتة',
        designsNote: 'بوستات ثابتة بصيغ متعددة للمنصات الاجتماعية.',
        videos: 'فيديوهات قصيرة',
        videosNote: 'ريلز / تيك توك (10–30 ثانية).',
        content: 'كتابة محتوى',
        contentNote: 'كابشن / سكربت / إيميل / مقالة.',
        ads: 'إدارة إعلانات',
        adsNote: 'إعداد الحملة، الإستراتيجية، التتبع، التحسين الأسبوعي.',
        unitPiece: 'قطعة',
        unitMonth: 'شهر',
        webHeading: 'تطوير الويب',
        webNote:
          'حسب الطلب — يتم تسعيرها بشكل منفصل بعد جلسة استكشاف. غير مدرجة في الإجمالي.',
        egp: 'جنيه',
      }
    : {
        col: { service: 'Service', qty: 'Qty', unit: 'Unit', line: 'Line' },
        designs: 'Static designs',
        designsNote: 'Static posts in multi-platform aspect ratios.',
        videos: 'Short-form videos',
        videosNote: 'Reels / TikTok cuts (10–30 seconds).',
        content: 'Content writing',
        contentNote: 'Captions, scripts, emails, articles.',
        ads: 'Ads management',
        adsNote: 'Campaign setup, strategy, tracking, weekly optimisation.',
        unitPiece: 'each',
        unitMonth: 'mo',
        webHeading: 'Web development',
        webNote:
          'On demand — priced separately after a discovery call. Not included in totals below.',
        egp: 'EGP',
      };

  const rows: ServiceRow[] = [];

  if (state.designs > 0) {
    rows.push({
      label: lbl.designs,
      qty: String(state.designs),
      unit: `${fmtMoney(c.dUnit)} ${lbl.egp} / ${lbl.unitPiece}`,
      line: `${fmtMoney(c.designs)} ${lbl.egp}`,
      note: lbl.designsNote,
    });
  }

  if (state.videos > 0) {
    rows.push({
      label: lbl.videos,
      qty: String(state.videos),
      unit: `${fmtMoney(PRICE.video)} ${lbl.egp} / ${lbl.unitPiece}`,
      line: `${fmtMoney(c.videos)} ${lbl.egp}`,
      note: lbl.videosNote,
    });
  }

  if (state.content) {
    rows.push({
      label: lbl.content,
      qty: '1',
      unit: `${fmtMoney(PRICE.content)} ${lbl.egp} / ${lbl.unitMonth}`,
      line: `${fmtMoney(c.content)} ${lbl.egp}`,
      note: lbl.contentNote,
    });
  }

  if (state.adsOn) {
    rows.push({
      label: lbl.ads,
      qty: '1',
      unit: `${fmtMoney(c.adEff)} ${lbl.egp} / ${lbl.unitMonth}`,
      line: `${fmtMoney(c.adEff)} ${lbl.egp}`,
      note: lbl.adsNote,
    });
  }

  const tableRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        headerCell(lbl.col.service, 46, isAr),
        headerCell(lbl.col.qty, 12, isAr),
        headerCell(lbl.col.unit, 21, isAr),
        headerCell(lbl.col.line, 21, isAr),
      ],
    }),
  ];

  rows.forEach((row, i) => {
    const zebra = i % 2 === 1 ? 'F4F4F5' : 'FFFFFF';
    const labelChildren: Paragraph[] = [
      textP(isAr, row.label, { bold: true, size: 22, color: COLORS.ink }),
    ];
    if (row.note) {
      labelChildren.push(
        textP(isAr, row.note, { size: 16, color: COLORS.zinc600 }),
      );
    }
    tableRows.push(
      new TableRow({
        children: [
          bodyCell(labelChildren, 46, zebra),
          bodyCell([textP(isAr, row.qty, { size: 20 })], 12, zebra),
          bodyCell([textP(isAr, row.unit, { size: 18, color: COLORS.zinc700 })], 21, zebra),
          bodyCell(
            [textP(isAr, row.line, { bold: true, size: 22, color: COLORS.ink })],
            21,
            zebra,
          ),
        ],
      }),
    );
  });

  // Web add-on — always quoted as a note line ("on demand"), never priced.
  // We render it as a single full-width cell that spans all four columns by
  // re-using the table grid: label cell gets the heading + note, the three
  // numeric cells get an em-dash placeholder so the row stays visually clean.
  if (state.web) {
    const zebra = rows.length % 2 === 1 ? 'F4F4F5' : 'FFFFFF';
    tableRows.push(
      new TableRow({
        children: [
          bodyCell(
            [
              textP(isAr, lbl.webHeading, {
                bold: true,
                size: 22,
                color: COLORS.ink,
              }),
              textP(isAr, lbl.webNote, { size: 16, color: COLORS.zinc600 }),
            ],
            46,
            zebra,
          ),
          bodyCell([textP(isAr, '—', { size: 20, color: COLORS.zinc500 })], 12, zebra),
          bodyCell([textP(isAr, '—', { size: 18, color: COLORS.zinc500 })], 21, zebra),
          bodyCell([textP(isAr, '—', { size: 18, color: COLORS.zinc500 })], 21, zebra),
        ],
      }),
    );
  }

  // Empty-state safety: if nothing is selected, render a single info row so
  // the document still produces a valid Word table (docx throws on empty rows).
  if (rows.length === 0 && !state.web) {
    tableRows.push(
      new TableRow({
        children: [
          bodyCell(
            [
              textP(
                isAr,
                isAr
                  ? 'لم يتم اختيار خدمات بعد — يرجى تحديد عناصر العرض في المنشئ.'
                  : 'No services selected yet — pick line items in the builder.',
                { size: 18, color: COLORS.zinc600 },
              ),
            ],
            46,
            'FFFFFF',
          ),
          bodyCell([textP(isAr, '—', { size: 20, color: COLORS.zinc500 })], 12, 'FFFFFF'),
          bodyCell([textP(isAr, '—', { size: 18, color: COLORS.zinc500 })], 21, 'FFFFFF'),
          bodyCell([textP(isAr, '—', { size: 18, color: COLORS.zinc500 })], 21, 'FFFFFF'),
        ],
      }),
    );
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders(COLORS.divider),
    rows: tableRows,
  });
}

/* ----------------------------------------------------------------- */
/* Totals block — subtotal / management 20% / total                   */
/* ----------------------------------------------------------------- */

export function makeTotalsBlock(
  isAr: boolean,
  c: ReturnType<typeof calc>,
): Table {
  const lbl = isAr
    ? {
        subtotal: 'المجموع الفرعي',
        mgmt: 'إدارة المشروع (20٪)',
        total: 'الإجمالي',
        egp: 'جنيه',
      }
    : {
        subtotal: 'Subtotal',
        mgmt: 'Project management (20%)',
        total: 'Total',
        egp: 'EGP',
      };

  const row = (
    label: string,
    value: string,
    opts: { bold?: boolean; size?: number; fill?: string; color?: string } = {},
  ) =>
    new TableRow({
      children: [
        new TableCell({
          width: { size: 65, type: WidthType.PERCENTAGE },
          shading: {
            type: ShadingType.SOLID,
            color: opts.fill ?? 'FFFFFF',
            fill: opts.fill ?? 'FFFFFF',
          },
          margins: { top: 140, bottom: 140, left: 180, right: 180 },
          borders: tableBorders(COLORS.divider),
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              alignment: alignFor(isAr),
              bidirectional: isAr,
              children: [
                new TextRun({
                  font: fontOpt(isAr),
                  bold: opts.bold,
                  size: opts.size ?? 20,
                  color: opts.color ?? COLORS.zinc700,
                  rightToLeft: isAr,
                  text: label,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          shading: {
            type: ShadingType.SOLID,
            color: opts.fill ?? 'FFFFFF',
            fill: opts.fill ?? 'FFFFFF',
          },
          margins: { top: 140, bottom: 140, left: 180, right: 180 },
          borders: tableBorders(COLORS.divider),
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              alignment: isAr ? AlignmentType.LEFT : AlignmentType.RIGHT,
              bidirectional: isAr,
              children: [
                new TextRun({
                  font: fontOpt(isAr),
                  bold: opts.bold ?? true,
                  size: opts.size ?? 22,
                  color: opts.color ?? COLORS.ink,
                  rightToLeft: isAr,
                  text: value,
                }),
              ],
            }),
          ],
        }),
      ],
    });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders(COLORS.divider),
    rows: [
      row(lbl.subtotal, `${fmtMoney(c.subtotal)} ${lbl.egp}`),
      row(lbl.mgmt, `${fmtMoney(c.mgmt)} ${lbl.egp}`, { fill: 'F4F4F5' }),
      row(lbl.total, `${fmtMoney(c.total)} ${lbl.egp}`, {
        bold: true,
        size: 28,
        fill: COLORS.ink,
        color: 'FFFFFF',
      }),
    ],
  });
}

/* ----------------------------------------------------------------- */
/* Payment terms table — 5 milestones                                 */
/* ----------------------------------------------------------------- */

/**
 * Returns the payment-plan as [heading-paragraph, table] so the route can
 * spread it inline:  `...makePaymentTermsTable(isAr)`.
 * Spec calls this a "table builder", but Word readability demands the heading
 * sit immediately above the table — bundling both keeps the call site clean.
 */
export function makePaymentTermsTable(isAr: boolean): Array<Paragraph | Table> {
  const lbl = isAr
    ? {
        heading: 'خطة الدفع',
        when: 'المعلم',
        wtag: 'النسبة',
        desc: 'ما الذي يُسلَّم',
      }
    : {
        heading: 'Payment plan',
        when: 'Milestone',
        wtag: 'Share',
        desc: 'What it covers',
      };

  const heading = new Paragraph({
    alignment: alignFor(isAr),
    bidirectional: isAr,
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        font: fontOpt(isAr),
        bold: true,
        size: 28,
        color: COLORS.ink,
        rightToLeft: isAr,
        text: lbl.heading,
      }),
    ],
  });

  const rows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        headerCell(lbl.when, 28, isAr),
        headerCell(lbl.wtag, 14, isAr),
        headerCell(lbl.desc, 58, isAr),
      ],
    }),
  ];

  PAY_ROWS.forEach((r, i) => {
    const zebra = i % 2 === 1 ? 'F4F4F5' : 'FFFFFF';
    rows.push(
      new TableRow({
        children: [
          bodyCell(
            [
              textP(isAr, isAr ? r.when.ar : r.when.en, {
                bold: true,
                size: 20,
                color: COLORS.ink,
              }),
            ],
            28,
            zebra,
          ),
          bodyCell(
            [
              textP(isAr, isAr ? r.wtag.ar : r.wtag.en, {
                bold: true,
                size: 22,
                color: COLORS.ink,
              }),
            ],
            14,
            zebra,
          ),
          bodyCell(
            [
              textP(isAr, isAr ? r.desc.ar : r.desc.en, {
                size: 18,
                color: COLORS.zinc700,
              }),
            ],
            58,
            zebra,
          ),
        ],
      }),
    );
  });

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders(COLORS.divider),
    rows,
  });

  return [heading, table];
}

/* ----------------------------------------------------------------- */
/* Mid-section heading helper (used by route.ts for "Services" /      */
/* "Totals" labels above their respective tables).                    */
/* ----------------------------------------------------------------- */

export function makeSectionHeading(isAr: boolean, text: string): Paragraph {
  return new Paragraph({
    alignment: alignFor(isAr),
    bidirectional: isAr,
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        font: fontOpt(isAr),
        bold: true,
        size: 28,
        color: COLORS.ink,
        rightToLeft: isAr,
        text,
      }),
    ],
  });
}
