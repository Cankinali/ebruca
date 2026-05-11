import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/lib/data';
import { dbGetProductsByCategory } from '@/lib/db-helpers';
import { absoluteUrl, SITE } from '@/lib/seo';
import CategoryView from './CategoryView';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const name = category?.name ?? slug.replace(/-/g, ' ');

  const title = `${name} Modelleri`;
  const description = `${name} koleksiyonumuzu keşfedin. Modern kesim, kaliteli kumaş, uygun fiyat. Ebruca güvencesiyle hızlı kargo ve güvenli ödeme.`;
  const url = absoluteUrl(`/kategori/${slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: category?.image
        ? [{ url: category.image.startsWith('http') ? category.image : absoluteUrl(category.image), alt: name }]
        : undefined,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const initialProducts = await dbGetProductsByCategory(slug);

  // Geçersiz slug + boş kategori → 404
  if (!category && initialProducts.length === 0) notFound();

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Anasayfa', item: SITE.url },
      {
        '@type': 'ListItem',
        position: 2,
        name: category?.name ?? slug,
        item: absoluteUrl(`/kategori/${slug}`),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <CategoryView slug={slug} category={category} initialProducts={initialProducts} />
    </>
  );
}
