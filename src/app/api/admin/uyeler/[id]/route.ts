import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

/** Tek üyenin detayı: profil, kayıtlı adres, yasal onaylar ve siparişleri. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      address: true,
      city: true,
      district: true,
      postalCode: true,
      kvkkAcceptedAt: true,
      termsAcceptedAt: true,
      failedLoginCount: true,
      lockedUntil: true,
      createdAt: true,
      updatedAt: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      },
      _count: { select: { sessions: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Üye bulunamadı.' }, { status: 404 });
  }

  const now = new Date();
  const gecerli = user.orders.filter(
    o => o.paymentStatus === 'success' && o.status !== 'cancelled'
  );

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
      city: user.city,
      district: user.district,
      postalCode: user.postalCode,
      kvkkAcceptedAt: user.kvkkAcceptedAt?.toISOString() ?? null,
      termsAcceptedAt: user.termsAcceptedAt?.toISOString() ?? null,
      failedLoginCount: user.failedLoginCount,
      kilitli: !!user.lockedUntil && user.lockedUntil > now,
      lockedUntil: user.lockedUntil?.toISOString() ?? null,
      acikOturum: user._count.sessions,
      createdAt: user.createdAt.toISOString(),
      siparisSayisi: gecerli.length,
      toplamHarcama: gecerli.reduce((s, o) => s + o.total, 0),
    },
    orders: user.orders.map(o => ({
      id: o.id,
      orderNo: o.orderNo,
      status: o.status,
      paymentStatus: o.paymentStatus,
      total: o.total,
      createdAt: o.createdAt.toISOString(),
      items: o.items.map(i => ({
        id: i.id,
        name: i.name,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        price: i.price,
      })),
    })),
  });
}

/**
 * Üye hesabının kilidini açar (5 hatalı girişten sonra oluşan geçici kilit).
 * Müşteri arayıp "giriş yapamıyorum" dediğinde kullanılır.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  if (body.action !== 'kilidi-ac') {
    return NextResponse.json({ error: 'Geçersiz işlem.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!user) {
    return NextResponse.json({ error: 'Üye bulunamadı.' }, { status: 404 });
  }

  await prisma.user.update({
    where: { id },
    data: { failedLoginCount: 0, lockedUntil: null },
  });

  return NextResponse.json({ ok: true });
}
