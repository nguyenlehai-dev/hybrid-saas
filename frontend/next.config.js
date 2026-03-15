/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['vpspanel.io.vn', 'api.vpspanel.io.vn'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: (process.env.NEXT_PUBLIC_API_URL || 'https://api.vpspanel.io.vn') + '/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
