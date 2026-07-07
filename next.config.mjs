/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Moved onto the brand domain (quote.devya.dev). The old
  // quote.devya-solutions.com host stays attached but 301s every path to the
  // new domain so link equity + bookmarks consolidate on one canonical host.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'quote.devya-solutions.com' }],
        destination: 'https://quote.devya.dev/:path*',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
