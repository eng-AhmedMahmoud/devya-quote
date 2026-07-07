import { sora, amiri } from './fonts';
import '../styles/globals.css';

export const metadata = {
  metadataBase: new URL('https://quote.devya.dev'),
  title: 'Devya · Quote / عرض سعر',
  description: 'Interactive quote builder — pick your services and see the monthly invoice live.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Devya · Quote / عرض سعر',
    description: 'Interactive quote builder — pick your services and see the monthly invoice live.',
    url: 'https://quote.devya.dev/',
    siteName: 'Devya Solutions',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${amiri.variable}`}>
      <body className="antialiased font-sora bg-brand-ink text-zinc-100 min-h-screen">{children}</body>
    </html>
  );
}
