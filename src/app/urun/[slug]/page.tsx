import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { dbGetProductBySlug, dbGetBestsellers } from '@/lib/db-helpers';
import { absoluteUrl, SITE } from '@/lib/seo';
import { COMPANY } from '@/lib/company';
import ProductDetail from './ProductDetail';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await dbGetProductBySlug(slug);
  if (!product) return { title: 'Ürün bulunamadı' };

  const description =
    product.description?.slice(0, 160) ||
    `${product.name} — ${product.brand}. Ebruca güvencesiyle hızlı kargo, 14 gün koşulsuz iade.`;

  const url = absoluteUrl(`/urun/${product.slug}`);
  const image = product.images[0]?.startsWith('http')
    ? product.images[0]
    : absoluteUrl(product.images[0] || SITE.defaultOgImage);

  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: product.name,
      description,
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await dbGetProductBySlug(slug);
  if (!product) notFound();

  const allBestsellers = await dbGetBestsellers();
  const bestsellers = allBestsellers.filter(p => p.slug !== slug).slice(0, 4);

  // Product JSON-LD (schema.org)
  const url = absoluteUrl(`/urun/${product.slug}`);
  const image = product.images[0]?.startsWith('http')
    ? product.images[0]
    : absoluteUrl(product.images[0] || SITE.defaultOgImage);

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map(img =>
      img.startsWith('http') ? img : absoluteUrl(img)
    ),
    description: product.description || `${product.name} — ${product.brand}`,
    sku: product.code,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'TRY',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stock === 'out_of_stock'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: COMPANY.brand },
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Anasayfa', item: SITE.url },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.category.replace(/-/g, ' '),
        item: absoluteUrl(`/kategori/${product.category}`),
      },
      { '@type': 'ListItem', position: 3, name: product.name, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProductDetail product={product} bestsellers={bestsellers} />
    </>
  );
}
