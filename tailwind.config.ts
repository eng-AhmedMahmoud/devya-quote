import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    container: { center: true, padding: '1.5rem', screens: { '2xl': '1400px' } },
    extend: {
      fontFamily: {
        sora: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        amiri: ['var(--font-amiri)', 'Times New Roman', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: '#ffffff',
          ink: '#020202',
          paper: '#fafaf9',
          zinc: '#a1a1aa',
        },
      },
      borderRadius: { lg: '14px', md: '10px', sm: '8px' },
    },
  },
  plugins: [],
};
export default config;
