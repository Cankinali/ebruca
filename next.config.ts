import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['iyzipay', 'postman-request'],
  outputFileTracingIncludes: {
    '/api/odeme/**': [
      './node_modules/iyzipay/**/*',
      './node_modules/postman-request/**/*',
      './node_modules/forever-agent/**/*',
      './node_modules/extend/**/*',
      './node_modules/oauth-sign/**/*',
      './node_modules/qs/**/*',
      './node_modules/aws-sign2/**/*',
      './node_modules/aws4/**/*',
      './node_modules/caseless/**/*',
      './node_modules/combined-stream/**/*',
      './node_modules/form-data/**/*',
      './node_modules/har-validator/**/*',
      './node_modules/http-signature/**/*',
      './node_modules/is-typedarray/**/*',
      './node_modules/isstream/**/*',
      './node_modules/json-stringify-safe/**/*',
      './node_modules/mime-types/**/*',
      './node_modules/performance-now/**/*',
      './node_modules/safe-buffer/**/*',
      './node_modules/tough-cookie/**/*',
      './node_modules/tunnel-agent/**/*',
      './node_modules/uuid/**/*',
    ],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
