import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createResetToken, normalizeEmail } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { SITE } from '@/lib/seo';

interface Body {
  email?: string;
}

/**
 * Şifre sıfırlama bağlantısı ister.
 * Hesabın varlığını sızdırmamak için yanıt her durumda aynıdır.
 */
export async function POST(req: NextRequest) {
  const successResponse = NextResponse.json({
    ok: true,
    message:
      'Eğer bu e-posta ile kayıtlı bir hesap varsa, şifre sıfırlama bağlantısı gönderildi. Gelen kutunuzu (ve spam klasörünü) kontrol edin.',
  });

  try {
    // Bir kişiye e-posta bombardımanı yapılmasını ve Resend kotasının
    // tüketilmesini engelle: saatte 5 sıfırlama isteği.
    const limit = rateLimit(`sifre-sifirla:${clientIp(req)}`, 5, 60 * 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla sıfırlama isteği gönderildi. Lütfen bir süre sonra tekrar deneyin.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      );
    }

    const body = (await req.json()) as Body;
    const email = normalizeEmail(body.email || '');
    if (!email) {
      return NextResponse.json({ error: 'E-posta zorunludur.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return successResponse;

    const token = await createResetToken(user.id);
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || SITE.url).replace(/\/$/, '');
    const resetUrl = `${siteUrl}/sifre-yenile?token=${encodeURIComponent(token)}`;

    await sendPasswordResetEmail({
      email: user.email,
      firstName: user.firstName,
      resetUrl,
    });

    return successResponse;
  } catch (err) {
    console.error('[POST /api/auth/sifre-sifirla]', err);
    // Hata detayını da sızdırma — kullanıcıya aynı nötr yanıt döner.
    return successResponse;
  }
}
