'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  orderNo: string;
  status: OrderStatus;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  total: number;
  shippingFee: number;
  cargoCompany: string;
  trackingNo: string;
  createdAt: string;
  items: { id: string; name: string; quantity: number; price: number; size: string; color: string }[];
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Bekliyor',    color: 'text-amber-700',  bg: 'bg-amber-50'  },
  confirmed: { label: 'Onaylandı',   color: 'text-blue-700',   bg: 'bg-blue-50'   },
  shipped:   { label: 'Kargoda',     color: 'text-purple-700', bg: 'bg-purple-50' },
  delivered: { label: 'Teslim',      color: 'text-green-700',  bg: 'bg-green-50'  },
  cancelled: { label: 'İptal',       color: 'text-red-700',    bg: 'bg-red-50'    },
};

const STATUS_FILTERS = [
  { value: '', label: 'Tümü' },
  { value: 'confirmed', label: 'Onaylandı' },
  { value: 'shipped', label: 'Kargoda' },
  { value: 'delivered', label: 'Teslim' },
  { value: 'cancelled', label: 'İptal' },
];

export default function SiparislerPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');
  const [showUnpaid, setShowUnpaid] = useState(false);
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (status) params.set('status', status);
    if (showUnpaid) params.set('unpaid', '1');
    const res = await fetch(`/api/admin/siparisler?${params}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setTotal(data.total || 0);
    setPages(data.pages || 1);
    setLoading(false);
  }, [page, status, showUnpaid]);

  // Ödeme bekleyen sayısını arka planda al
  useEffect(() => {
    fetch('/api/admin/siparisler?unpaid=1&page=1')
      .then(r => r.json())
      .then(d => setUnpaidCount(d.total || 0));
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-wide uppercase">Siparişler</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} sipariş</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Listelenen Gelir</p>
          <p className="text-lg font-bold">{totalRevenue.toLocaleString('tr-TR')} TL</p>
        </div>
      </div>

      {/* Ödenmiş / Ödeme Bekleyen sekmeleri */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        <button
          onClick={() => { setShowUnpaid(false); setPage(1); setStatus(''); }}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            !showUnpaid ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'
          }`}
        >
          ✅ Ödenmiş Siparişler
        </button>
        <button
          onClick={() => { setShowUnpaid(true); setPage(1); setStatus(''); }}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2 ${
            showUnpaid ? 'border-amber-500 text-amber-700' : 'border-transparent text-gray-400 hover:text-black'
          }`}
        >
          ⏳ Ödeme Bekleyen
          {unpaidCount > 0 && (
            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full px-2 py-0.5">
              {unpaidCount}
            </span>
          )}
        </button>
      </div>

      {showUnpaid && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-xs text-amber-800 flex gap-2">
          <span>⚠️</span>
          <span>
            Bu siparişler ödemeye başladı ama tamamlamadı. Iyzico panelinden teyit etmeden işleme almayın.
            Genelde kullanıcı kart vermekten vazgeçmiştir veya banka onaylamadı.
          </span>
        </div>
      )}

      {/* Filtreler */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => { setStatus(f.value); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
              status === f.value
                ? 'bg-black text-white border-black'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tablo */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm">Yükleniyor...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-sm">Henüz sipariş yok</p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sipariş No</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Müşteri</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Şehir</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürünler</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tutar</th>
                  <th className="text-center py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tarih</th>
                  <th className="py-3 px-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => {
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 font-mono text-xs font-bold">{order.orderNo}</td>
                      <td className="py-3 px-3">
                        <p className="font-medium">{order.firstName} {order.lastName}</p>
                        <p className="text-xs text-gray-400">{order.phone}</p>
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-600">{order.city} / {order.district}</td>
                      <td className="py-3 px-3">
                        {order.items.slice(0, 2).map(item => (
                          <p key={item.id} className="text-xs text-gray-600 truncate max-w-[180px]">
                            {item.name} ({item.size}) ×{item.quantity}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-gray-400">+{order.items.length - 2} daha</p>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-bold whitespace-nowrap">
                        {order.total.toLocaleString('tr-TR')} TL
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-3">
                        <Link href={`/admin/siparisler/${order.id}`}
                          className="text-xs font-medium text-black underline hover:text-gray-600 whitespace-nowrap">
                          Detay →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-3">
            {orders.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              return (
                <Link key={order.id} href={`/admin/siparisler/${order.id}`}
                  className="block border border-gray-100 p-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-mono text-xs font-bold">{order.orderNo}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="font-medium text-sm">{order.firstName} {order.lastName}</p>
                  <p className="text-xs text-gray-400 mb-2">{order.city} · {new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{order.items.length} ürün</p>
                    <p className="font-bold text-sm">{order.total.toLocaleString('tr-TR')} TL</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Sayfalama */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 disabled:opacity-40 hover:border-black transition-colors">
                ← Önceki
              </button>
              <span className="text-sm text-gray-500">{page} / {pages}</span>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="px-3 py-1.5 text-sm border border-gray-200 disabled:opacity-40 hover:border-black transition-colors">
                Sonraki →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
