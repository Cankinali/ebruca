import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['iyzipay'],
  outputFileTracingIncludes: {
    '/api/odeme/**': ['./node_modules/iyzipay/**/*'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
