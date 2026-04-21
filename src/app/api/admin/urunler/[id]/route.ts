import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET — tek ürün
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  return NextResponse.json(product);
}

// PUT — güncelle
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      brand: body.brand,
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
      stock: body.stock,
      isNew: body.isNew ?? false,
      isBestseller: body.isBestseller ?? false,
      isFeatured: body.isFeatured ?? false,
    },
  });

  return NextResponse.json(product);
}

// DELETE — sil
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
