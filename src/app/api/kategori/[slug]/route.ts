import { NextRequest, NextResponse } from 'next/server';
import { dbGetProductsByCategory } from '@/lib/db-helpers';

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await dbGetProductsByCategory(slug);
  return NextResponse.json(products);
}
