/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['vpspanel.io.vn'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: (process.env.NEXT_PUBLIC_API_URL || 'https://vpspanel.io.vn/api') + '/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
