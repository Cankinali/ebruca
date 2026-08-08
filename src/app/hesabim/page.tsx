import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AccountClient from './AccountClient';

export const metadata: Metadata = {
  title: 'Hesabım',
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  // Asıl yetki kontrolü burada — proxy'deki kontrol yalnızca hızlı ön eleme.
  const user = await getCurrentUser();
  if (!user) redirect('/giris?next=/hesabim');

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
    take: 50,
  });

  return (
    <AccountClient
      user={user}
      orders={orders.map(o => ({
        id: o.id,
        orderNo: o.orderNo,
        status: o.status,
        paymentStatus: o.paymentStatus,
        total: o.total,
        cargoCompany: o.cargoCompany,
        trackingNo: o.trackingNo,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map(i => ({
          id: i.id,
          name: i.name,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          price: i.price,
          image: i.image,
        })),
      }))}
    />
  );
}
