import { NextRequest, NextResponse } from 'next/server';
import { sendContactMessage } from '@/lib/email';
import { isValidEmail, normalizeEmail } from '@/lib/auth';
import { rateLimit, clientIp } from '@/lib/rate-limit';

interface Body {
  ad?: string;
  email?: string;
  konu?: string;
  mesaj?: string;
  kvkk?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    // Form spam'ini sınırla: saatte 5 mesaj.
    const limit = rateLimit(`iletisim:${clientIp(req)}`, 5, 60 * 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla mesaj gönderdiniz. Lütfen bir süre sonra tekrar deneyin.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      );
    }

    const body = (await req.json()) as Body;
    const ad = (body.ad || '').trim();
    const email = normalizeEmail(body.email || '');
    const konu = (body.konu || '').trim();
    const mesaj = (body.mesaj || '').trim();

    if (!ad) return NextResponse.json({ error: 'Adınızı giriniz.' }, { status: 400 });
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta giriniz.' }, { status: 400 });
    }
    if (mesaj.length < 10) {
      return NextResponse.json({ error: 'Mesajınız en az 10 karakter olmalı.' }, { status: 400 });
    }
    if (mesaj.length > 5000) {
      return NextResponse.json({ error: 'Mesajınız çok uzun.' }, { status: 400 });
    }
    if (!body.kvkk) {
      return NextResponse.json({ error: 'KVKK onayı gereklidir.' }, { status: 400 });
    }

    const gonderildi = await sendContactMessage({ ad, email, konu, mesaj });

    if (!gonderildi) {
      // Mesajın kaybolduğunu kullanıcıdan gizleme — alternatif kanal sun.
      return NextResponse.json(
        {
          error:
            'Mesajınız şu anda iletilemedi. Lütfen doğrudan e-posta ile veya telefonla bize ulaşın.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/iletisim]', err);
    return NextResponse.json({ error: 'Mesaj gönderilemedi.' }, { status: 500 });
  }
}
