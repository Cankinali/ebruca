import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { sendShippingNotification } from '@/lib/email';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const body = await request.json();

  // Önceki durumu al — kargoya verme bildirimi yalnızca durum geçişinde gönderilmeli
  const previous = await prisma.order.findUnique({ where: { id }, select: { status: true } });

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.cargoCompany !== undefined && { cargoCompany: body.cargoCompany }),
      ...(body.trackingNo !== undefined && { trackingNo: body.trackingNo }),
      ...(body.note !== undefined && { note: body.note }),
    },
    include: { items: true },
  });

  // Durum "shipped"a yeni geçtiyse müşteriye e-posta gönder
  if (
    body.status === 'shipped' &&
    previous?.status !== 'shipped' &&
    order.email
  ) {
    sendShippingNotification({
      orderNo: order.orderNo,
      firstName: order.firstName,
      email: order.email,
      total: order.total,
      shippingFee: order.shippingFee,
      address: order.address,
      city: order.city,
      district: order.district,
      cargoCompany: order.cargoCompany,
      trackingNo: order.trackingNo,
      items: order.items.map(i => ({
        name: i.name,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        price: i.price,
      })),
    }).catch(e => console.error('Email error:', e));
  }

  return NextResponse.json(order);
}
