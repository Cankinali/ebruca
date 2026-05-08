import type { Metadata } from 'next';
import { dbGetAllProducts } from '@/lib/db-helpers';
import { absoluteUrl } from '@/lib/seo';
import AllProductsView from './AllProductsView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tüm Ürünler',
  description:
    'Ebruca koleksiyonundaki tüm ürünleri keşfedin: Elbise, takım, alt-üst giyim ve daha fazlası. Filtre ve sıralama seçenekleriyle aradığınızı kolayca bulun.',
  alternates: { canonical: absoluteUrl('/tumurunler') },
  openGraph: {
    title: 'Tüm Ürünler — Ebruca',
    description: 'Ebruca koleksiyonundaki tüm ürünler.',
    url: absoluteUrl('/tumurunler'),
  },
};

export default async function AllProductsPage() {
  const products = await dbGetAllProducts();
  return <AllProductsView initialProducts={products} />;
}
