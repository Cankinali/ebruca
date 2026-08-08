import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  consumeResetToken,
  hashPassword,
  validatePassword,
  destroyAllSessions,
  createSession,
} from '@/lib/auth';

interface Body {
  token?: string;
  password?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const token = body.token || '';
    const password = body.password || '';

    if (!token) {
      return NextResponse.json({ error: 'Geçersiz sıfırlama bağlantısı.' }, { status: 400 });
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const userId = await consumeResetToken(token);
    if (!userId) {
      return NextResponse.json(
        { error: 'Bu bağlantı geçersiz veya süresi dolmuş. Lütfen yeni bir sıfırlama isteği oluşturun.' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: await hashPassword(password),
        failedLoginCount: 0,
        lockedUntil: null,
      },
    });

    // Şifre değişti — açık kalmış tüm oturumları kapat, sonra yenisini aç.
    await destroyAllSessions(userId);
    await createSession(userId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/auth/sifre-yenile]', err);
    return NextResponse.json({ error: 'Şifre güncellenemedi.' }, { status: 500 });
  }
}
