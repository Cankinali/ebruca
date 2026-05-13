/**
 * Admin API'ler için sunucu tarafı yetki kontrolü.
 * Cookie'deki admin_token'ı ADMIN_SECRET ile karşılaştırır.
 */
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function requireAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const secret = process.env.ADMIN_SECRET;

  if (!token || !secret || token !== secret) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }
  return null; // yetki OK
}
