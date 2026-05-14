import { prisma } from './prisma';
import { Product } from './types';

function mapProduct(p: {
  id: string; slug: string; name: string; brand: string; code: string;
  price: number; originalPrice: number | null; images: string; category: string;
  subcategory: string | null; sizes: string; colors: string; description: string;
  measurements: string | null; stock: string; sizeStock: string;
  colorImages: string;
  colorSizes: string;
  colorSizeStock: string;
  isNew: boolean; isBestseller: boolean; isFeatured: boolean;
  createdAt: Date; updatedAt: Date;
}): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    code: p.code,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    images: JSON.parse(p.images) as string[],
    category: p.category,
    subcategory: p.subcategory ?? undefined,
    sizes: JSON.parse(p.sizes) as string[],
    colors: JSON.parse(p.colors) as string[],
    description: p.description,
    measurements: p.measurements ?? undefined,
    stock: p.stock as Product['stock'],
    sizeStock: JSON.parse(p.sizeStock || '{}') as Record<string, number>,
    colorImages: JSON.parse(p.colorImages || '{}') as Record<string, string[]>,
    colorSizes: JSON.parse(p.colorSizes || '{}') as Record<string, string[]>,
    colorSizeStock: JSON.parse(p.colorSizeStock || '{}') as Record<string, Record<string, number>>,
    isNew: p.isNew,
    isBestseller: p.isBestseller,
    isFeatured: p.isFeatured,
  };
}

export async function dbGetAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  return rows.map(mapProduct);
}

// Üst kategori → alt kategori slug'ları
const CATEGORY_CHILDREN: Record<string, string[]> = {
  'alt-giyim': ['etek', 'pantolon'],
  'takim':     ['etekli-takim', 'pantolonlu-takim'],
};

export async function dbGetProductsByCategory(category: string): Promise<Product[]> {
  const children = CATEGORY_CHILDREN[category] ?? [];
  const allSlugs = [category, ...children];

  const rows = await prisma.product.findMany({
    where: {
      OR: allSlugs.flatMap(slug => [
        { category: slug },
        { subcategory: slug },
      ]),
    },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(mapProduct);
}

export async function dbGetProductBySlug(slug: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { slug } });
  return row ? mapProduct(row) : null;
}

export async function dbGetNewArrivals(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { isNew: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });
  return rows.map(mapProduct);
}

export async function dbGetBestsellers(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { isBestseller: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });
  return rows.map(mapProduct);
}
