import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = status ? { status } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({ orders, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(request: Request) {
  const body = await request.json();

  const orderNo = 'EB' + Date.now().toString().slice(-8);

  const order = await prisma.order.create({
    data: {
      orderNo,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      district: body.district,
      postalCode: body.postalCode || '',
      subtotal: body.subtotal,
      shippingFee: body.shippingFee,
      total: body.total,
      note: body.note || '',
      items: {
        create: body.items.map((item: {
          productId: string;
          name: string;
          code: string;
          price: number;
          size: string;
          color: string;
          quantity: number;
          image: string;
        }) => ({
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

  return NextResponse.json(order, { status: 201 });
}
