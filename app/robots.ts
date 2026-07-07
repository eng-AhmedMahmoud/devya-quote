import type { MetadataRoute } from 'next';

// The quote builder is a public lead tool; the live-preview and API routes are
// working surfaces, not content — keep them out of the index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/preview', '/api/'],
    },
    sitemap: 'https://quote.devya.dev/sitemap.xml',
  };
}
