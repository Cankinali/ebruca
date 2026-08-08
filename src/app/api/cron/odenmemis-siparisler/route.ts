import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * 72 saatten eski, ödemesi tamamlanmamış siparişleri iptal olarak işaretler.
 *
 * Neden 72 saat: Iyzico'da fraud incelemesi normalde dakikalar-saatler içinde
 * sonuçlanır. 72 saat sonra hâlâ 'pending' olan bir sipariş, ödeme sayfasında
 * terk edilmiş demektir.
 *
 * GÜVENLİK PAYLARI — bir siparişin parası alınmış olabilir (Iyzico başarılı
 * dönmüş ama callback'imiz düşmüş olabilir), bu yüzden:
 *   1. Yalnızca `status` alanı 'cancelled' yapılır. `paymentStatus` DEĞİŞTİRİLMEZ,
 *      böylece sipariş admin panelindeki "ödeme bekleyenler" sekmesinde kalır
 *      ve elle teyit edilebilir. Hiçbir şey silinmez, işlem geri alınabilir.
 *   2. paymentId dolu olan siparişlere hiç dokunulmaz — Iyzico tarafında
 *      kayıtlı bir ödeme var demektir, insan gözüyle incelenmelidir.
 *
 * Vercel Cron günde bir çağırır (bkz. vercel.json). CRON_SECRET tanımlıysa
 * Vercel isteği `Authorization: Bearer <CRON_SECRET>` başlığıyla gönderir.
 * Admin oturumu olan biri tarayıcıdan elle de tetikleyebilir.
 */

const SAAT = 72;

export async function GET(req: NextRequest) {
  // --- Yetki ---
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  const cronYetkili = !!secret && authHeader === `Bearer ${secret}`;

  const adminToken = req.cookies.get('admin_token')?.value;
  const adminYetkili = !!process.env.ADMIN_SECRET && adminToken === process.env.ADMIN_SECRET;

  if (!cronYetkili && !adminYetkili) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const esik = new Date(Date.now() - SAAT * 60 * 60 * 1000);

    const adaylar = await prisma.order.findMany({
      where: {
        paymentStatus: { not: 'success' },
        status: { not: 'cancelled' },
        paymentId: '', // Iyzico'da kayıtlı ödemesi olanlara dokunma
        createdAt: { lt: esik },
      },
      select: { id: true, orderNo: true, createdAt: true, total: true },
    });

    if (adaylar.length === 0) {
      return NextResponse.json({
        ok: true,
        iptalEdilen: 0,
        mesaj: `${SAAT} saatten eski ödenmemiş sipariş bulunamadı.`,
      });
    }

    const sonuc = await prisma.order.updateMany({
      where: { id: { in: adaylar.map(o => o.id) } },
      data: { status: 'cancelled' },
    });

    console.log(
      `[cron/odenmemis-siparisler] ${sonuc.count} sipariş iptal edildi:`,
      adaylar.map(o => o.orderNo).join(', ')
    );

    return NextResponse.json({
      ok: true,
      iptalEdilen: sonuc.count,
      siparisler: adaylar.map(o => ({
        orderNo: o.orderNo,
        tutar: o.total,
        olusturulma: o.createdAt.toISOString(),
      })),
      not: 'paymentStatus değiştirilmedi — siparişler "ödeme bekleyenler" sekmesinde görünmeye devam eder.',
    });
  } catch (err) {
    console.error('[GET /api/cron/odenmemis-siparisler]', err);
    return NextResponse.json({ error: 'Temizlik işlemi başarısız.' }, { status: 500 });
  }
}
