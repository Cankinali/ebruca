import { NextResponse } from 'next/server';
import { dbGetBestsellers } from '@/lib/db-helpers';
import { getBestsellers } from '@/lib/data';

export async function GET() {
  let products = await dbGetBestsellers();
  if (products.length === 0) products = getBestsellers();
  return NextResponse.json(products);
}
