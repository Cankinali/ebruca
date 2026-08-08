import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeEmail } from '@/lib/auth';
import { rateLimit, clientIp } from '@/lib/rate-limit';

interface Body {
  orderNo?: string;
  email?: string;
}

/**
 * Misafir sipariş sorgulama.
 *
 * Erişim için sipariş numarası ile siparişteki e-posta adresinin birlikte
 * tutması gerekir. Yanıt, siparişin var olup olmadığını sızdırmaz — eşleşmeyen
 * her durumda aynı mesaj döner.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    // 10 dakikada 10 deneme — numara tahmin etmeye çalışan trafiği yavaşlatır.
    const limit = rateLimit(`siparis-sorgula:${ip}`, 10, 10 * 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla sorgulama yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      );
    }

    const body = (await req.json()) as Body;
    const orderNo = (body.orderNo || '').trim().toUpperCase();
    const email = normalizeEmail(body.email || '');

    if (!orderNo || !email) {
      return NextResponse.json(
        { error: 'Sipariş numarası ve e-posta adresi zorunludur.' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { orderNo },
      include: { items: true },
    });

    // Sipariş yok ya da e-posta tutmuyor — her iki durumda da aynı yanıt.
    if (!order || normalizeEmail(order.email) !== email) {
      return NextResponse.json(
        {
          error:
            'Girdiğiniz bilgilere ait sipariş bulunamadı. Sipariş numaranızı ve e-posta adresinizi kontrol edin.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order: {
        orderNo: order.orderNo,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt.toISOString(),
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        total: order.total,
        cargoCompany: order.cargoCompany,
        trackingNo: order.trackingNo,
        // Tam adres bilinçli olarak dönülmüyor; teyit için il/ilçe yeterli.
        city: order.city,
        district: order.district,
        items: order.items.map(i => ({
          id: i.id,
          name: i.name,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          price: i.price,
          image: i.image,
        })),
      },
    });
  } catch (err) {
    console.error('[POST /api/siparis-sorgula]', err);
    return NextResponse.json({ error: 'Sorgulama yapılamadı.' }, { status: 500 });
  }
}
