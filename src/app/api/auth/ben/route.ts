import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

/** Header gibi istemci bileşenlerinin oturum durumunu öğrendiği uç nokta. */
export async function GET() {
  try {
    const user = await getCurrentUser();
    // Oturuma özel yanıt — CDN/tarayıcı önbelleğine düşmemeli.
    return NextResponse.json(
      { user },
      { headers: { 'Cache-Control': 'private, no-store' } }
    );
  } catch (err) {
    console.error('[GET /api/auth/ben]', err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
