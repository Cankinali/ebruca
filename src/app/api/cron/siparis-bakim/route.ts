import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAbandonedOrderReminder } from '@/lib/email';
import { SITE } from '@/lib/seo';

/**
 * Günlük sipariş bakımı — iki iş sırayla yapılır:
 *
 *   1. HATIRLATMA (24-72 saat arası): ödemesi tamamlanmamış siparişin sahibine
 *      tek seferlik bir işlem bildirimi gönderilir.
 *   2. İPTAL (72 saatten eski): sipariş 'cancelled' olarak işaretlenir.
 *
 * İkisi tek uç noktada, bu sırayla: önce hatırlat, sonra iptal et. Ayrı cron'lar
 * olsaydı sıra garanti edilemezdi ve Vercel'in cron kotası da sınırlı.
 *
 * GÜVENLİK PAYLARI (ikisi için de geçerli):
 *   - paymentId dolu olan siparişlere dokunulmaz; Iyzico'da kayıtlı bir ödeme
 *     var demektir, callback düşmüş olabilir, insan incelemesi gerekir.
 *   - İptalde yalnızca `status` değişir; `paymentStatus` korunur, böylece
 *     sipariş "ödeme bekleyenler" sekmesinde kalır ve işlem geri alınabilir.
 *   - Aynı e-posta sonradan başarılı sipariş verdiyse hatırlatma gönderilmez.
 */

const HATIRLATMA_SAAT = 24;
const IPTAL_SAAT = 72;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const cronYetkili = !!secret && req.headers.get('authorization') === `Bearer ${secret}`;
  const adminToken = req.cookies.get('admin_token')?.value;
  const adminYetkili = !!process.env.ADMIN_SECRET && adminToken === process.env.ADMIN_SECRET;

  if (!cronYetkili && !adminYetkili) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const simdi = Date.now();
    const hatirlatmaEsigi = new Date(simdi - HATIRLATMA_SAAT * 3600_000);
    const iptalEsigi = new Date(simdi - IPTAL_SAAT * 3600_000);
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || SITE.url).replace(/\/$/, '');

    // ---------------------------------------------------------------------
    // 1. HATIRLATMA — 24 ile 72 saat arasındaki, henüz hatırlatılmamış siparişler
    // ---------------------------------------------------------------------
    const adaylar = await prisma.order.findMany({
      where: {
        paymentStatus: { not: 'success' },
        status: { not: 'cancelled' },
        paymentId: '',
        reminderSentAt: null,
        createdAt: { lt: hatirlatmaEsigi, gte: iptalEsigi },
      },
      include: { items: true },
    });

    // Sonradan başarılı sipariş vermiş kişilere hatırlatma gitmesin.
    const basariliKayitlar = await prisma.order.findMany({
      where: { paymentStatus: 'success' },
      select: { email: true },
    });
    const basariliEpostalar = new Set(
      basariliKayitlar.map(o => o.email.trim().toLowerCase())
    );

    const gonderilen: string[] = [];
    const atlanan: string[] = [];
    const basarisiz: string[] = [];

    for (const order of adaylar) {
      if (basariliEpostalar.has(order.email.trim().toLowerCase())) {
        atlanan.push(`${order.orderNo} (sonradan sipariş vermiş)`);
        continue;
      }
      if (order.items.length === 0) {
        atlanan.push(`${order.orderNo} (ürün yok)`);
        continue;
      }

      // Ürün sayfası linkleri için slug'ları topluca çek.
      const urunIdler = order.items.map(i => i.productId).filter(Boolean);
      const urunler = urunIdler.length
        ? await prisma.product.findMany({
            where: { id: { in: urunIdler } },
            select: { id: true, slug: true },
          })
        : [];
      const slugById = new Map(urunler.map(p => [p.id, p.slug]));

      const items = order.items.map(i => {
        const slug = slugById.get(i.productId);
        return {
          name: i.name,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          price: i.price,
          url: slug
            ? `${siteUrl}/urun/${slug}${i.color ? `?renk=${encodeURIComponent(i.color)}` : ''}`
            : undefined,
        };
      });

      // Tek ürünse doğrudan o ürüne, çoklu ürünse tüm ürünler sayfasına gönder.
      const ctaUrl = items.length === 1 && items[0].url ? items[0].url : `${siteUrl}/tumurunler`;

      const gecenSaat = (simdi - order.createdAt.getTime()) / 3600_000;
      const kalanSaat = Math.max(1, Math.round(IPTAL_SAAT - gecenSaat));

      const ok = await sendAbandonedOrderReminder({
        orderNo: order.orderNo,
        firstName: order.firstName,
        email: order.email,
        total: order.total,
        shippingFee: order.shippingFee,
        items,
        ctaUrl,
        kalanSaat,
      });

      if (ok) {
        // Yalnızca gönderim başarılıysa işaretle — başarısızsa yarın tekrar
        // denenir (72 saatlik pencere kapanana kadar).
        await prisma.order.update({
          where: { id: order.id },
          data: { reminderSentAt: new Date() },
        });
        gonderilen.push(order.orderNo);
      } else {
        basarisiz.push(order.orderNo);
      }
    }

    // ---------------------------------------------------------------------
    // 2. İPTAL — 72 saatten eski, ödemesi tamamlanmamış siparişler
    // ---------------------------------------------------------------------
    const iptalAdaylari = await prisma.order.findMany({
      where: {
        paymentStatus: { not: 'success' },
        status: { not: 'cancelled' },
        paymentId: '',
        createdAt: { lt: iptalEsigi },
      },
      select: { id: true, orderNo: true, total: true },
    });

    let iptalEdilen = 0;
    if (iptalAdaylari.length > 0) {
      const sonuc = await prisma.order.updateMany({
        where: { id: { in: iptalAdaylari.map(o => o.id) } },
        data: { status: 'cancelled' },
      });
      iptalEdilen = sonuc.count;
    }

    const ozet = {
      ok: true,
      hatirlatma: {
        aday: adaylar.length,
        gonderilen: gonderilen.length,
        atlanan: atlanan.length,
        basarisiz: basarisiz.length,
        detay: { gonderilen, atlanan, basarisiz },
      },
      iptal: {
        iptalEdilen,
        siparisler: iptalAdaylari.map(o => o.orderNo),
      },
      not: 'İptalde paymentStatus değiştirilmez — siparişler "ödeme bekleyenler" sekmesinde kalır.',
    };

    console.log('[cron/siparis-bakim]', JSON.stringify(ozet));
    return NextResponse.json(ozet);
  } catch (err) {
    console.error('[GET /api/cron/siparis-bakim]', err);
    return NextResponse.json({ error: 'Bakım işlemi başarısız.' }, { status: 500 });
  }
}
