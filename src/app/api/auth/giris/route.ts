import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  verifyPassword,
  createSession,
  normalizeEmail,
  registerFailedLogin,
  clearFailedLogins,
  lockRemainingMinutes,
} from '@/lib/auth';

interface Body {
  email?: string;
  password?: string;
}

/** Hesabın var olup olmadığını sızdırmamak için tek ve aynı mesaj. */
const GENERIC_ERROR = 'E-posta veya şifre hatalı.';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const email = normalizeEmail(body.email || '');
    const password = body.password || '';

    if (!email || !password) {
      return NextResponse.json({ error: 'E-posta ve şifre zorunludur.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
    }

    const lockMinutes = lockRemainingMinutes(user.lockedUntil);
    if (lockMinutes > 0) {
      return NextResponse.json(
        {
          error: `Çok fazla hatalı deneme yapıldı. Hesabınız ${lockMinutes} dakika boyunca kilitli. Dilerseniz "Şifremi Unuttum" ile sıfırlayabilirsiniz.`,
        },
        { status: 429 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      await registerFailedLogin(user.id, user.failedLoginCount);
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
    }

    if (user.failedLoginCount > 0 || user.lockedUntil) {
      await clearFailedLogins(user.id);
    }

    await createSession(user.id);

    return NextResponse.json({
      user: { id: user.id, email: user.email, firstName: user.firstName },
    });
  } catch (err) {
    console.error('[POST /api/auth/giris]', err);
    return NextResponse.json({ error: 'Giriş yapılamadı.' }, { status: 500 });
  }
}
