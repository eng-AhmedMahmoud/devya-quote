import { sora, amiri } from './fonts';
import '../styles/globals.css';

export const metadata = {
  title: 'Devya · Quote / عرض سعر',
  description: 'Interactive quote builder — pick your services and see the monthly invoice live.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${amiri.variable}`}>
      <body className="antialiased font-sora bg-brand-ink text-zinc-100 min-h-screen">{children}</body>
    </html>
  );
}
