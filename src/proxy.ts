import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin login sayfasını koru değil
  if (pathname === '/admin/giris') return NextResponse.next();

  // /admin altındaki tüm sayfaları koru
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;
    const secret = process.env.ADMIN_SECRET ?? 'supersecretkey_change_this_in_production';

    if (token !== secret) {
      const loginUrl = new URL('/admin/giris', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
