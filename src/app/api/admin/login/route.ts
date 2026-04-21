import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'ebruca2025';
  const secret = process.env.ADMIN_SECRET ?? 'supersecretkey_change_this_in_production';

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Şifre hatalı.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_token', secret, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 gün
  });
  return res;
}
