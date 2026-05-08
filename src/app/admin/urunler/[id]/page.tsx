import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AdminNav from '@/components/admin/AdminNav';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return notFound();

  const initial = {
    id: product.id,
    name: product.name,
    brand: product.brand,
    code: product.code,
    price: String(product.price),
    originalPrice: product.originalPrice ? String(product.originalPrice) : '',
    images: JSON.parse(product.images) as string[],
    category: product.category,
    subcategory: product.subcategory ?? '',
    sizes: JSON.parse(product.sizes) as string[],
    colors: JSON.parse(product.colors) as string[],
    description: product.description,
    measurements: product.measurements ?? '',
    stock: product.stock,
    sizeStock: JSON.parse(product.sizeStock || '{}') as Record<string, number>,
    isNew: product.isNew,
    isBestseller: product.isBestseller,
    isFeatured: product.isFeatured,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/admin/urunler" className="hover:text-black">Ürünler</Link>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </nav>
        <h1 className="text-xl font-bold mb-8">Ürünü Düzenle</h1>
        <ProductForm mode="edit" initial={initial} />
      </div>
    </div>
  );
}
