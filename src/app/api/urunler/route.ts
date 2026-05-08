import { NextResponse } from 'next/server';
import { dbGetAllProducts } from '@/lib/db-helpers';

export async function GET() {
  const products = await dbGetAllProducts();
  return NextResponse.json(products);
}
