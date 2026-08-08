import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/auth/cikis]', err);
    return NextResponse.json({ error: 'Çıkış yapılamadı.' }, { status: 500 });
  }
}
