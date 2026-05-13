import { NextRequest, NextResponse } from 'next/server';
import type Iyzipay from 'iyzipay';
import { iyzipay } from '@/lib/iyzico';
import { prisma } from '@/lib/prisma';

/**
 * Iyzico checkout sonrası buraya POST eder (callbackUrl).
 * Token'ı alıp result'ı sorgular, ödeme başarılıysa stok düşer,
 * kullanıcıyı siparis-tamamlandi sayfasına yönlendiririz.
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const token = formData.get('token') as string | null;
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');

  if (!token || !orderId) {
    return NextResponse.redirect(new URL('/sepet?error=missing_token', req.url));
  }

  try {
    // Token ile ödeme sonucunu sorgula
    const result = await new Promise<Iyzipay.CheckoutFormRetrieveResponse>(
      (resolve, reject) => {
        iyzipay.checkoutForm.retrieve({ locale: 'tr', token }, (err, r) => {
          if (err) reject(err);
          else resolve(r);
        });
      }
    );

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.redirect(new URL('/sepet?error=order_not_found', req.url));
    }

    // Başarılı ödeme?
    if (
      result.status === 'success' &&
      result.paymentStatus === 'SUCCESS' &&
      result.fraudStatus !== -1
    ) {
      // Güvenli, ödeme onaylı
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'confirmed',
          paymentStatus: 'success',
          paymentId: result.paymentId ?? '',
          fraudStatus: result.fraudStatus ?? 0,
          paymentTransactionId: result.paymentItems?.[0]?.paymentTransactionId ?? '',
        },
      });

      // Stok düş
      for (const item of order.items) {
        if (!item.productId) continue;
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) continue;
        const sizeStock = JSON.parse(product.sizeStock || '{}') as Record<string, number>;
        if (sizeStock[item.size] !== undefined) {
          sizeStock[item.size] = Math.max(0, (sizeStock[item.size] ?? 0) - item.quantity);
          const totalStock = Object.values(sizeStock).reduce((a, b) => a + b, 0);
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              sizeStock: JSON.stringify(sizeStock),
              stock: totalStock === 0 ? 'out_of_stock' : totalStock <= 3 ? 'low_stock' : 'in_stock',
            },
          });
        }
      }

      return NextResponse.redirect(
        new URL(`/siparis-tamamlandi?no=${order.orderNo}`, req.url)
      );
    }

    // Fraud (-1) — askıya al
    if (result.fraudStatus === 0) {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'pending', fraudStatus: 0 },
      });
      return NextResponse.redirect(
        new URL(`/siparis-tamamlandi?no=${order.orderNo}&pending=1`, req.url)
      );
    }

    // Başarısız
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'failure',
        status: 'cancelled',
        fraudStatus: result.fraudStatus ?? -1,
      },
    });
    return NextResponse.redirect(
      new URL(
        `/sepet?error=payment_failed&msg=${encodeURIComponent(result.errorMessage ?? 'Ödeme başarısız')}`,
        req.url
      )
    );
  } catch (err) {
    console.error('[POST /api/odeme/sonuc]', err);
    return NextResponse.redirect(new URL('/sepet?error=server_error', req.url));
  }
}

// GET ile direkt erişilirse hata
export async function GET() {
  return NextResponse.json({ error: 'POST request bekleniyor' }, { status: 405 });
}
