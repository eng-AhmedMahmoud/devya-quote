import type { MetadataRoute } from 'next';

const baseUrl = 'https://quote.devya.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date('2026-07-07'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
