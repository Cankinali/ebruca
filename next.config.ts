import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig: NextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
  },
  // sharp'ın Linux ikilisi libvips .so dosyasını dinamik yükler; Next'in dosya
  // izleme adımı bunu göremiyor ve Vercel'de "libvips-cpp.so … cannot open"
  // hatası çıkıyor. Görsel yükleyen route'a açıkça ekleniyor.
  outputFileTracingIncludes: {
    '/api/admin/upload': [
      './node_modules/@img/sharp-linux-x64/**/*',
      './node_modules/@img/sharp-libvips-linux-x64/**/*',
    ],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
    ];
  },
};

export default nextConfig;
