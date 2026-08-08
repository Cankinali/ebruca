import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import {
  hashPassword,
  createSession,
  normalizeEmail,
  isValidEmail,
  validatePassword,
} from '@/lib/auth';

interface Body {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  kvkk?: boolean;
  terms?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    // Toplu sahte hesap açılmasını sınırla: saatte 5 kayıt.
    const limit = rateLimit(`kayit:${clientIp(req)}`, 5, 60 * 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla kayıt denemesi. Lütfen bir süre sonra tekrar deneyin.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      );
    }

    const body = (await req.json()) as Body;

    const firstName = (body.firstName || '').trim();
    const lastName = (body.lastName || '').trim();
    const email = normalizeEmail(body.email || '');
    const password = body.password || '';

    if (!firstName) {
      return NextResponse.json({ error: 'Ad zorunludur.' }, { status: 400 });
    }
    if (!lastName) {
      return NextResponse.json({ error: 'Soyad zorunludur.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta giriniz.' }, { status: 400 });
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }
    if (!body.kvkk || !body.terms) {
      return NextResponse.json(
        { error: 'KVKK ve üyelik sözleşmesi onayı gereklidir.' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Bu e-posta ile zaten bir hesap var. Giriş yapmayı deneyin.' },
        { status: 409 }
      );
    }

    const now = new Date();
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
        firstName,
        lastName,
        kvkkAcceptedAt: now,
        termsAcceptedAt: now,
      },
    });

    // NOT: Geçmiş misafir siparişleri bilerek otomatik bağlanmıyor. E-posta
    // doğrulaması olmadığı için, biri başkasının adresiyle kayıt olup o kişinin
    // sipariş geçmişini (ad, adres, telefon) görebilirdi. E-posta doğrulaması
    // eklendiğinde bu bağlama güvenle yapılabilir.

    await createSession(user.id);

    return NextResponse.json({
      user: { id: user.id, email: user.email, firstName: user.firstName },
    });
  } catch (err) {
    console.error('[POST /api/auth/kayit]', err);
    return NextResponse.json({ error: 'Kayıt oluşturulamadı.' }, { status: 500 });
  }
}
