import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/sepet',
          '/odeme',
          '/giris',
          '/kayit',
          '/siparis-tamamlandi',
          '/siparis-sorgula',
        ],
      },
    ],
    sitemap: `${SITE.url.replace(/\/$/, '')}/sitemap.xml`,
    host: SITE.url,
  };
}
