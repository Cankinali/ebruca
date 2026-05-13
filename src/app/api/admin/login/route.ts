import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Basit in-memory rate limit (Vercel function instance başına)
const attempts = new Map<string, { count: number; until: number }>();

function ipFrom(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0] ||
         req.headers.get('x-real-ip') || 'unknown';
}

// Timing-safe string compare — yan kanal saldırılarına karşı
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function POST(req: NextRequest) {
  const ip = ipFrom(req);
  const now = Date.now();
  const rec = attempts.get(ip);

  // Rate limit: 5 başarısız denemeden sonra 5 dk kilit
  if (rec && rec.until > now) {
    return NextResponse.json(
      { error: 'Çok fazla deneme. 5 dakika sonra tekrar deneyin.' },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({ password: '' }));
  const password = typeof body?.password === 'string' ? body.password : '';
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET;

  if (!adminPassword || !secret) {
    console.error('ADMIN_PASSWORD veya ADMIN_SECRET env eksik');
    return NextResponse.json({ error: 'Sunucu yapılandırma hatası.' }, { status: 500 });
  }

  if (!password || !safeEqual(password, adminPassword)) {
    const count = (rec?.count ?? 0) + 1;
    attempts.set(ip, {
      count,
      until: count >= 5 ? now + 5 * 60 * 1000 : 0,
    });
    return NextResponse.json({ error: 'Şifre hatalı.' }, { status: 401 });
  }

  attempts.delete(ip);

  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_token', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
