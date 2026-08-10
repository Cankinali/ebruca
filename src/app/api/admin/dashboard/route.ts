import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const now = new Date();
  const year = now.getFullYear();

  // Sadece ÖDEMESİ BAŞARILI ve iptal edilmemiş siparişler
  // (ödeme bekleyenler gelir/sipariş sayısına dahil edilmez)
  const allOrders = await prisma.order.findMany({
    where: {
      paymentStatus: 'success',
      status: { not: 'cancelled' },
    },
    select: { total: true, status: true, createdAt: true },
  });

  // This month
  const startOfMonth = new Date(year, now.getMonth(), 1);
  const monthOrders = allOrders.filter(o => new Date(o.createdAt) >= startOfMonth);
  const monthRevenue = monthOrders.reduce((s, o) => s + o.total, 0);

  // Last month
  const startOfLastMonth = new Date(year, now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(year, now.getMonth(), 0, 23, 59, 59);
  const lastMonthOrders = allOrders.filter(o => {
    const d = new Date(o.createdAt);
    return d >= startOfLastMonth && d <= endOfLastMonth;
  });
  const lastMonthRevenue = lastMonthOrders.reduce((s, o) => s + o.total, 0);

  // Monthly breakdown for the year
  const monthly: { month: number; revenue: number; count: number }[] = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    revenue: 0,
    count: 0,
  }));

  allOrders.forEach(o => {
    const d = new Date(o.createdAt);
    if (d.getFullYear() === year) {
      const m = d.getMonth();
      monthly[m].revenue += o.total;
      monthly[m].count += 1;
    }
  });

  // Status counts
  // Statü sayımları için: ödenmiş + iptal edilenler (ödeme bekleyenler hariç)
  const allWithCancelled = await prisma.order.findMany({
    where: { paymentStatus: 'success' },
    select: { status: true },
  });
  const statusCounts: Record<string, number> = {};
  allWithCancelled.forEach(o => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  // Total revenue
  const totalRevenue = allOrders.reduce((s, o) => s + o.total, 0);

  // Üyelik istatistikleri
  const startOfWeek = new Date(now.getTime() - 7 * 86_400_000);
  const [uyeToplam, uyeBuAy, uyeBuHafta, uyeliSiparis] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.order.count({
      where: { userId: { not: null }, paymentStatus: 'success', status: { not: 'cancelled' } },
    }),
  ]);

  // Top products
  const items = await prisma.orderItem.findMany({
    select: { name: true, quantity: true, price: true },
  });
  const productMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  items.forEach(item => {
    if (!productMap[item.name]) productMap[item.name] = { name: item.name, qty: 0, revenue: 0 };
    productMap[item.name].qty += item.quantity;
    productMap[item.name].revenue += item.price * item.quantity;
  });
  const topProducts = Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return NextResponse.json({
    totalRevenue,
    monthRevenue,
    lastMonthRevenue,
    monthOrderCount: monthOrders.length,
    totalOrderCount: allWithCancelled.length,
    statusCounts,
    monthly,
    topProducts,
    uyeler: {
      toplam: uyeToplam,
      buAy: uyeBuAy,
      buHafta: uyeBuHafta,
      // Üyelikle verilen sipariş sayısı — üyeliğin satışa katkısını gösterir
      uyeliSiparis,
      misafirSiparis: allOrders.length - uyeliSiparis,
    },
  });
}
