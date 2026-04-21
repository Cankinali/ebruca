'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  name: string;
  code: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  orderNo: string;
  status: OrderStatus;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  cargoCompany: string;
  trackingNo: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Bekliyor',    color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200'  },
  confirmed: { label: 'Onaylandı',   color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200'   },
  shipped:   { label: 'Kargoda',     color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  delivered: { label: 'Teslim',      color: 'text-green-700',  bg: 'bg-green-50 border-green-200'  },
  cancelled: { label: 'İptal',       color: 'text-red-700',    bg: 'bg-red-50 border-red-200'    },
};

const STATUS_STEPS: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered'];

export default function SiparisDetayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cargo, setCargo] = useState({ cargoCompany: '', trackingNo: '' });
  const [note, setNote] = useState('');

  useEffect(() => {
    fetch(`/api/admin/siparisler/${id}`)
      .then(r => r.json())
      .then(data => {
        setOrder(data);
        setCargo({ cargoCompany: data.cargoCompany || '', trackingNo: data.trackingNo || '' });
        setNote(data.note || '');
        setLoading(false);
      });
  }, [id]);

  const updateStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    setSaving(true);
    const res = await fetch(`/api/admin/siparisler/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    const updated = await res.json();
    setOrder(updated);
    setSaving(false);
  };

  const saveCargo = async () => {
    setSaving(true);
    const res = await fetch(`/api/admin/siparisler/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...cargo, note }),
    });
    const updated = await res.json();
    setOrder(updated);
    setSaving(false);
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center text-gray-400 text-sm">Yükleniyor...</div>
  );
  if (!order) return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center text-gray-400 text-sm">Sipariş bulunamadı.</div>
  );

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Üst bar */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-black transition-colors">
          ← Geri
        </button>
        <span className="text-gray-200">/</span>
        <h1 className="text-base font-bold font-mono">{order.orderNo}</h1>
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold border rounded-full ${cfg.bg} ${cfg.color}`}>
          {cfg.label}
        </span>
        <span className="ml-auto text-xs text-gray-400">
          {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Durum ilerleme */}
      {order.status !== 'cancelled' && (
        <div className="flex items-center mb-8 overflow-x-auto pb-2">
          {STATUS_STEPS.map((s, i) => {
            const sCfg = STATUS_CONFIG[s];
            const done = i <= currentStep;
            const active = i === currentStep;
            return (
              <div key={s} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => updateStatus(s)}
                  disabled={saving || i === currentStep}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border transition-colors rounded ${
                    active
                      ? `${sCfg.bg} ${sCfg.color} border-current font-bold`
                      : done
                      ? 'bg-black text-white border-black hover:bg-gray-800'
                      : 'border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600'
                  } disabled:cursor-default`}
                >
                  {done && !active && <span>✓</span>}
                  {sCfg.label}
                </button>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`w-6 h-px mx-1 ${i < currentStep ? 'bg-black' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
          <button
            onClick={() => updateStatus('cancelled')}
            disabled={saving}
            className="ml-3 px-3 py-2 text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors rounded disabled:opacity-40"
          >
            İptal Et
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sol - Müşteri & Kargo */}
        <div className="space-y-5">

          {/* Müşteri Bilgileri */}
          <div className="border border-gray-100 p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Müşteri</h2>
            <p className="font-semibold">{order.firstName} {order.lastName}</p>
            <p className="text-sm text-gray-600 mt-1">{order.email}</p>
            <p className="text-sm text-gray-600">{order.phone}</p>
          </div>

          {/* Teslimat Adresi */}
          <div className="border border-gray-100 p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Teslimat Adresi</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{order.address}</p>
            <p className="text-sm font-medium mt-1">{order.district} / {order.city}</p>
            {order.postalCode && <p className="text-xs text-gray-400 mt-0.5">{order.postalCode}</p>}
          </div>

          {/* Kargo Bilgileri */}
          <div className="border border-gray-100 p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Kargo</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Kargo Firması</label>
                <input
                  value={cargo.cargoCompany}
                  onChange={e => setCargo(p => ({ ...p, cargoCompany: e.target.value }))}
                  placeholder="Aras, Yurtiçi, MNG..."
                  className="w-full border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Takip No</label>
                <input
                  value={cargo.trackingNo}
                  onChange={e => setCargo(p => ({ ...p, trackingNo: e.target.value }))}
                  placeholder="123456789"
                  className="w-full border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Not</label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-black resize-none"
                />
              </div>
              <button
                onClick={saveCargo}
                disabled={saving}
                className="w-full bg-black text-white py-2 text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>

        {/* Sağ - Sipariş Kalemleri + Özet */}
        <div className="lg:col-span-2 space-y-5">

          {/* Ürünler */}
          <div className="border border-gray-100 p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Sipariş Kalemleri ({order.items.length} ürün)
            </h2>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="w-12 h-16 object-cover flex-shrink-0 bg-gray-100" />
                  ) : (
                    <div className="w-12 h-16 bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-300 text-lg">
                      👗
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    {item.code && <p className="text-xs text-gray-400">{item.code}</p>}
                    <p className="text-xs text-gray-500 mt-0.5">
                      Beden: {item.size} · Renk: {item.color}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold">{(item.price * item.quantity).toLocaleString('tr-TR')} TL</p>
                    <p className="text-xs text-gray-400">{item.price.toLocaleString('tr-TR')} TL × {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fiyat özeti */}
          <div className="border border-gray-100 p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Özet</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ara toplam</span>
                <span>{order.subtotal.toLocaleString('tr-TR')} TL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kargo</span>
                <span className={order.shippingFee === 0 ? 'text-green-600 font-medium' : ''}>
                  {order.shippingFee === 0 ? 'Ücretsiz' : `${order.shippingFee.toLocaleString('tr-TR')} TL`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
                <span>Toplam</span>
                <span>{order.total.toLocaleString('tr-TR')} TL</span>
              </div>
            </div>
          </div>

          {/* Hızlı aksiyonlar */}
          <div className="flex gap-2">
            {order.status === 'pending' && (
              <button onClick={() => updateStatus('confirmed')} disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-blue-700 transition-colors disabled:opacity-50">
                ✓ Onayla
              </button>
            )}
            {order.status === 'confirmed' && (
              <button onClick={() => updateStatus('shipped')} disabled={saving}
                className="flex-1 bg-purple-600 text-white py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-purple-700 transition-colors disabled:opacity-50">
                📦 Kargoya Ver
              </button>
            )}
            {order.status === 'shipped' && (
              <button onClick={() => updateStatus('delivered')} disabled={saving}
                className="flex-1 bg-green-600 text-white py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-green-700 transition-colors disabled:opacity-50">
                ✓ Teslim Edildi
              </button>
            )}
            <Link href="/admin/siparisler"
              className="flex-1 border border-gray-200 text-center py-2.5 text-xs font-medium hover:border-black transition-colors">
              ← Listeye Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
