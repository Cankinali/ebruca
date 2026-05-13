import { NextRequest, NextResponse } from 'next/server';
import { initializeCheckout } from '@/lib/iyzico';
import { prisma } from '@/lib/prisma';
import { SITE } from '@/lib/seo';

interface CartItem {
  productId: string;
  name: string;
  code: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

interface Body {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode?: string;
  identityNumber?: string;
  items: CartItem[];
  shippingMethod?: 'standart' | 'ekspres';
  note?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    if (!body.items?.length) {
      return NextResponse.json({ error: 'Sepet boş.' }, { status: 400 });
    }

    // SUNUCU-TARAFLI FIYAT DOĞRULAMA — istemciden gelen fiyatlara güvenme!
    let serverSubtotal = 0;
    const verifiedItems: typeof body.items = [];
    for (const item of body.items) {
      if (!item.productId) {
        return NextResponse.json({ error: 'Geçersiz ürün.' }, { status: 400 });
      }
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return NextResponse.json({ error: `Ürün bulunamadı: ${item.name}` }, { status: 400 });
      }
      // Stok kontrolü
      const sizeStock = JSON.parse(product.sizeStock || '{}') as Record<string, number>;
      const availableStock = sizeStock[item.size];
      if (Object.keys(sizeStock).length > 0 && (availableStock === undefined || availableStock < item.quantity)) {
        return NextResponse.json({
          error: `${product.name} (${item.size}) stokta yok veya yetersiz.`,
        }, { status: 400 });
      }
      // Fiyatı DB'den al (kullanıcının gönderdiğini kabul etme!)
      const realPrice = product.price;
      const qty = Math.max(1, Math.min(99, Math.floor(item.quantity)));
      serverSubtotal += realPrice * qty;
      verifiedItems.push({
        ...item,
        price: realPrice,
        quantity: qty,
        name: product.name,
        code: product.code,
        image: JSON.parse(product.images || '[]')[0] || '',
      });
    }

    // Kargo ücretini sunucuda hesapla
    let serverShipping: number;
    if (body.shippingMethod === 'ekspres') {
      serverShipping = 1; // test modu — sonra 29 TL'ye çevrilecek
    } else {
      serverShipping = serverSubtotal >= 5000 ? 0 : 99;
    }
    const serverTotal = serverSubtotal + serverShipping;

    // 1. Sipariş kaydı (pending)
    const orderNo = 'EB' + Date.now().toString().slice(-8);
    const conversationId = orderNo + '-' + Math.random().toString(36).slice(2, 8);
    const basketId = orderNo;

    const order = await prisma.order.create({
      data: {
        orderNo,
        status: 'pending',
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        district: body.district,
        postalCode: body.postalCode || '',
        subtotal: serverSubtotal,
        shippingFee: serverShipping,
        total: serverTotal,
        note: body.note || '',
        conversationId,
        basketId,
        paymentStatus: 'pending',
        items: {
          create: verifiedItems.map(item => ({
            productId: item.productId,
            name: item.name,
            code: item.code || '',
            price: item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            image: item.image || '',
          })),
        },
      },
      include: { items: true },
    });

    // 2. Iyzico request payload
    const buyerIp = req.headers.get('x-forwarded-for')?.split(',')[0] ||
                   req.headers.get('x-real-ip') || '85.34.78.112';

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;
    const callbackUrl = `${siteUrl}/api/odeme/sonuc?orderId=${order.id}`;

    const result = await initializeCheckout({
      conversationId,
      price: serverSubtotal.toFixed(2),
      paidPrice: serverTotal.toFixed(2),
      basketId,
      callbackUrl,
      enabledInstallments: serverTotal >= 10000 ? [1, 2, 3] : [1],
      buyer: {
        id: order.id,
        name: body.firstName,
        surname: body.lastName,
        gsmNumber: body.phone.startsWith('+') ? body.phone : '+90' + body.phone.replace(/^0/, ''),
        email: body.email,
        identityNumber: body.identityNumber || '11111111111',
        registrationAddress: body.address,
        ip: buyerIp,
        city: body.city,
        country: 'Turkey',
        zipCode: body.postalCode || '17200',
      },
      shippingAddress: {
        contactName: `${body.firstName} ${body.lastName}`,
        city: body.city,
        country: 'Turkey',
        address: body.address,
        zipCode: body.postalCode || '17200',
      },
      billingAddress: {
        contactName: `${body.firstName} ${body.lastName}`,
        city: body.city,
        country: 'Turkey',
        address: body.address,
        zipCode: body.postalCode || '17200',
      },
      basketItems: verifiedItems.map((item, idx) => ({
        id: `${item.productId}-${idx}`,
        name: item.name,
        category1: 'Giyim',
        itemType: 'PHYSICAL',
        price: (item.price * item.quantity).toFixed(2),
      })),
    });

    if (result.status !== 'success') {
      console.error('Iyzico hatası:', result);
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'failure', status: 'cancelled' },
      });
      return NextResponse.json(
        { error: result.errorMessage || 'Ödeme başlatılamadı.', code: result.errorCode },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentToken: result.token ?? '' },
    });

    return NextResponse.json({
      orderId: order.id,
      orderNo: order.orderNo,
      paymentPageUrl: result.paymentPageUrl,
      token: result.token,
    });
  } catch (err) {
    console.error('[POST /api/odeme/baslat]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
