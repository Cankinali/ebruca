import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

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

  return NextResponse.json(order);
}
