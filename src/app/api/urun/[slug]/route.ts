import { NextRequest, NextResponse } from 'next/server';
import { dbGetProductBySlug } from '@/lib/db-helpers';
import { getProductBySlug } from '@/lib/data';

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let product = await dbGetProductBySlug(slug);
  if (!product) {
    // Mock veriye dön
    const mock = getProductBySlug(slug);
    if (!mock) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
    product = mock;
  }

  return NextResponse.json(product);
}
