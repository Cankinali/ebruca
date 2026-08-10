import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

/**
 * Üye listesi — arama ve sayfalama ile.
 * passwordHash hiçbir koşulda dönülmez.
 */
export async function GET(req: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = q
    ? {
        OR: [
          { email: { contains: q } },
          { firstName: { contains: q } },
          { lastName: { contains: q } },
          { phone: { contains: q } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        city: true,
        district: true,
        lockedUntil: true,
        createdAt: true,
        // Siparişleri toplamak için — tutarlar aşağıda hesaplanır
        orders: {
          select: { total: true, paymentStatus: true, status: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const now = new Date();

  return NextResponse.json({
    users: users.map(u => {
      // Yalnızca ödemesi başarılı ve iptal edilmemiş siparişler ciroya sayılır
      const gecerli = u.orders.filter(
        o => o.paymentStatus === 'success' && o.status !== 'cancelled'
      );
      return {
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        city: u.city,
        district: u.district,
        kilitli: !!u.lockedUntil && u.lockedUntil > now,
        createdAt: u.createdAt.toISOString(),
        siparisSayisi: gecerli.length,
        toplamHarcama: gecerli.reduce((s, o) => s + o.total, 0),
      };
    }),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
  });
}
