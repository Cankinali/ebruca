import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login sayfası açık olsun
  if (pathname === '/admin/giris') return NextResponse.next();

  // /admin altındaki her şeyi koru
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;
    const secret = process.env.ADMIN_SECRET;

    // SECRET tanımlı değilse — daima reddet (yanlışlıkla açık kalmasın)
    if (!secret || !token || token.length < 32 || token !== secret) {
      const loginUrl = new URL('/admin/giris', request.url);
      // Eski oturum varsa çerezi de temizle
      const res = NextResponse.redirect(loginUrl);
      res.cookies.set('admin_token', '', { maxAge: 0, path: '/' });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
