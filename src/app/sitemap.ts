import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo';
import { categories } from '@/lib/data';
import { dbGetAllProducts } from '@/lib/db-helpers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, '');
  const now = new Date();

  // Statik sayfalar
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/tumurunler`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/hakkimizda`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/iletisim`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/sss`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/teslimat`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/iade-iptal`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/mesafeli-satis`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/gizlilik`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/kvkk`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/cerez`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/uyelik-sozlesmesi`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Kategoriler + alt kategoriler
  const categoryRoutes: MetadataRoute.Sitemap = [];
  for (const cat of categories) {
    categoryRoutes.push({
      url: `${base}/kategori/${cat.slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    });
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        categoryRoutes.push({
          url: `${base}/kategori/${sub.slug}`,
          lastModified: now,
          changeFrequency: 'daily',
          priority: 0.7,
        });
      }
    }
  }

  // Ürünler (DB'den)
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await dbGetAllProducts();
    productRoutes = products.map(p => ({
      url: `${base}/urun/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    // DB hatası — boş bırak, statik sayfalar yine sunulsun
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
