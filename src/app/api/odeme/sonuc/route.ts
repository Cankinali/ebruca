import { NextRequest, NextResponse } from 'next/server';
import { retrieveCheckout } from '@/lib/iyzico';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmation } from '@/lib/email';

/**
 * 303 See Other ile redirect — POST'tan GET'e dönüşür.
 * Browser /siparis-tamamlandi'ya GET ile gider; aksi halde 307 ile
 * POST korunur ve "INVALID_REQUEST_METHOD" hatası alırız.
 */
function redirect303(url: URL) {
  return NextResponse.redirect(url, 303);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const token = formData.get('token') as string | null;
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');

  if (!token || !orderId) {
    return redirect303(new URL('/sepet?error=missing_token', req.url));
  }

  try {
    const result = await retrieveCheckout(token);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return redirect303(new URL('/sepet?error=order_not_found', req.url));
    }

    // ConversationId tampering kontrolü
    if (result.conversationId && result.conversationId !== order.conversationId) {
      console.error('ConversationId uyuşmazlığı', {
        orderId,
        expected: order.conversationId,
        got: result.conversationId,
      });
      return redirect303(new URL('/sepet?error=mismatch', req.url));
    }

    // Tutar tampering kontrolü
    if (result.paidPrice !== undefined && Math.abs(result.paidPrice - order.total) > 0.01) {
      console.error('Tutar uyuşmazlığı', {
        orderId,
        expected: order.total,
        got: result.paidPrice,
      });
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'failure', status: 'cancelled' },
      });
      return redirect303(new URL('/sepet?error=amount_mismatch', req.url));
    }

    // Başarılı
    if (
      result.status === 'success' &&
      result.paymentStatus === 'SUCCESS' &&
      result.fraudStatus !== -1
    ) {
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

      // E-posta gönder (asenkron, hata olsa bile akışı bozma)
      sendOrderConfirmation({
        orderNo: order.orderNo,
        firstName: order.firstName,
        email: order.email,
        total: order.total,
        shippingFee: order.shippingFee,
        address: order.address,
        city: order.city,
        district: order.district,
        items: order.items.map(i => ({
          name: i.name,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          price: i.price,
        })),
      }).catch(e => console.error('Email error:', e));

      return redirect303(new URL(`/siparis-tamamlandi?no=${order.orderNo}`, req.url));
    }

    // Fraud incelemede
    if (result.fraudStatus === 0) {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'pending', fraudStatus: 0 },
      });
      return redirect303(new URL(`/siparis-tamamlandi?no=${order.orderNo}&pending=1`, req.url));
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
    return redirect303(
      new URL(
        `/sepet?error=payment_failed&msg=${encodeURIComponent(result.errorMessage ?? 'Ödeme başarısız')}`,
        req.url
      )
    );
  } catch (err) {
    console.error('[POST /api/odeme/sonuc]', err);
    return redirect303(new URL('/sepet?error=server_error', req.url));
  }
}

export async function GET() {
  return NextResponse.json({ error: 'POST request bekleniyor' }, { status: 405 });
}
