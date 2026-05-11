/**
 * SEO sabitleri ve yardımcı fonksiyonlar.
 * NEXT_PUBLIC_SITE_URL env değişkeni canlıda set edilir; yoksa localhost.
 */

export const SITE = {
  name: 'Ebruca',
  fullName: 'Ebruca | Modern Kadın Giyim',
  description:
    'Ebruca ile modern kadın giyiminde şıklığı keşfedin. Elbise, takım, alt-üst giyim ve daha fazlası. Hızlı kargo ve güvenli ödeme.',
  shortDescription: 'Modern kadın giyimde şıklığın adresi',
  keywords: [
    'kadın giyim', 'elbise', 'takım', 'tesettür giyim',
    'online kadın giyim', 'butik elbise', 'şal', 'kemer',
    'pantolonlu takım', 'etek', 'pantolon', 'gömlek', 'bluz',
    'ebruca', 'ebrucabutik', 'biga butik',
  ],
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  locale: 'tr_TR',
  defaultOgImage: '/opengraph-image',
  twitterHandle: '@ebrucabutik17',
};

/** Ürün başlığı + site adı formatı */
export const titleTemplate = (title: string) => `${title} | ${SITE.name}`;

/** Tam URL üret */
export const absoluteUrl = (path: string) =>
  `${SITE.url.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
