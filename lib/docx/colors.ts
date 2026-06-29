// Color + font constants for the Word/.docx export.
// Mirrored exactly from devya-contracts/app/api/export-docx/route.ts
// so every Devya artefact (contract, quote, brief, proposal) reads as one
// surface across documents.

export const COLORS = {
  ink: '020202',
  paper: 'FAFAF9',
  zinc300: 'D4D4D8',
  zinc500: '71717A',
  zinc600: '52525B',
  zinc700: '3F3F46',
  divider: 'E4E4E7',
  cream: 'FFFFFF',
  highlight: 'FEF3C7',
} as const;

export const FONT_LATIN = 'Inter';
export const FONT_AR = 'Amiri';

export type ColorKey = keyof typeof COLORS;
