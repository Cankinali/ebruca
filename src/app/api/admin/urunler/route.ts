import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// GET — tüm ürünler
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(products);
}

// POST — yeni ürün ekle
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const baseSlug = slugify(body.name);
    let slug = baseSlug;
    let attempt = 0;
    while (await prisma.product.findUnique({ where: { slug } })) {
      attempt++;
      slug = `${baseSlug}-${attempt}`;
    }

    const product = await prisma.product.create({
      data: {
        slug,
        name: body.name,
        brand: body.brand ?? 'Ebruca',
        code: body.code,
        price: Number(body.price),
        originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
        images: JSON.stringify(body.images ?? []),
        category: body.category,
        subcategory: body.subcategory ?? null,
        sizes: JSON.stringify(body.sizes ?? []),
        colors: JSON.stringify(body.colors ?? []),
        description: body.description ?? '',
        measurements: body.measurements ?? null,
        stock: body.stock ?? 'in_stock',
        sizeStock: JSON.stringify(body.sizeStock ?? {}),
        isNew: body.isNew ?? true,
        isBestseller: body.isBestseller ?? false,
        isFeatured: body.isFeatured ?? false,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/urunler]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
