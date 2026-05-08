import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Native/runtime modülleri bundle etme — Vercel'de derleme problemi yaşamamak için
  serverExternalPackages: [
    '@libsql/client',
    '@prisma/adapter-libsql',
    '@prisma/adapter-better-sqlite3',
    'better-sqlite3',
    '@prisma/client',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
