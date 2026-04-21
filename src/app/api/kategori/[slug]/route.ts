import { NextRequest, NextResponse } from 'next/server';
import { dbGetProductsByCategory, dbGetAllProducts } from '@/lib/db-helpers';
import { getProductsByCategory, products as mockProducts } from '@/lib/data';

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let products = await dbGetProductsByCategory(slug);

  // Veritabanı boşsa mock veriye dön
  if (products.length === 0) {
    const mock = getProductsByCategory(slug);
    products = mock.length > 0 ? mock : mockProducts;
  }

  return NextResponse.json(products);
}
