'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { orderStatusStyle } from '@/lib/order-status';

interface OrderItem {
  id: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
}

interface FoundOrder {
  orderNo: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  cargoCompany: string;
  trackingNo: string;
  city: string;
  district: string;
  items: OrderItem[];
}

export default function OrderQueryPage() {
  const [form, setForm] = useState({ email: '', siparisNo: '' });
  const [order, setOrder] = useState<FoundOrder | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setOrder(null);
    setError('');
    setForm({ email: '', siparisNo: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/siparis-sorgula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNo: form.siparisNo, email: form.email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Sorgulama yapılamadı.');
      } else {
        setOrder(data.order);
      }
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    }
    setSubmitting(false);
  };

  if (order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
        <OrderResult order={order} onReset={reset} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold tracking-wide uppercase">Sipariş Sorgula</h1>
        <p className="text-gray-500 text-sm mt-2">
          E-posta adresiniz ve sipariş numaranızla siparişinizi sorgulayın.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-gray-100 p-8 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">E-posta Adresi *</label>
          <input
            type="email"
            value={form.email}
            onChange={e => { setForm(prev => ({ ...prev, email: e.target.value })); setError(''); }}
            placeholder="siparis@email.com"
            required
            className="w-full border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Sipariş Numarası *</label>
          <input
            type="text"
            value={form.siparisNo}
            onChange={e => { setForm(prev => ({ ...prev, siparisNo: e.target.value })); setError(''); }}
            placeholder="EB12345678"
            required
            className="w-full border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 p-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black text-white py-3.5 text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Sorgulanıyor...' : 'Sorgula'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-6">
        Sipariş numaranızı e-posta ile aldığınız onay mesajında bulabilirsiniz.
      </p>
      <p className="text-center text-xs text-gray-400 mt-2">
        Üyeyseniz tüm siparişlerinizi{' '}
        <Link href="/hesabim" className="underline">Hesabım</Link> sayfasından görebilirsiniz.
      </p>
    </div>
  );
}

function OrderResult({ order, onReset }: { order: FoundOrder; onReset: () => void }) {
  const status = orderStatusStyle(order.status);
  const unpaid = order.paymentStatus !== 'success';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide uppercase">
            Sipariş Durumu
          </h1>
          <p className="font-mono text-sm text-gray-500 mt-1">{order.orderNo}</p>
        </div>
        <button onClick={onReset} className="text-sm underline text-gray-600 hover:text-black">
          Başka sipariş sorgula
        </button>
      </div>

      <div className="border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-2 p-4 bg-gray-50 border-b border-gray-100">
          <p className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleDateString('tr-TR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}{' '}
            tarihinde oluşturuldu
          </p>
          <div className="flex items-center gap-2">
            {unpaid && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 bg-gray-200 text-gray-600">
                Ödeme Tamamlanmadı
              </span>
            )}
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 ${status.bg} ${status.color}`}>
              {status.label}
            </span>
          </div>
        </div>

        {order.trackingNo && (
          <div className="p-4 border-b border-gray-100 bg-purple-50/50">
            <p className="text-sm">
              <span className="text-gray-500">Kargo:</span>{' '}
              <strong>{order.cargoCompany}</strong>{' '}
              <span className="font-mono">{order.trackingNo}</span>
            </p>
          </div>
        )}

        <div className="p-4 space-y-3">
          {order.items.map(item => (
            <div key={item.id} className="flex gap-3">
              <div className="relative w-14 h-18 bg-gray-50 flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-gray-400">
                  {item.size} / {item.color} × {item.quantity}
                </p>
              </div>
              <span className="text-sm font-medium flex-shrink-0">
                {(item.price * item.quantity).toLocaleString('tr-TR')} TL
              </span>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-gray-100 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Ara toplam</span>
            <span>{order.subtotal.toLocaleString('tr-TR')} TL</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Kargo</span>
            <span className={order.shippingFee === 0 ? 'text-green-600' : ''}>
              {order.shippingFee === 0 ? 'Ücretsiz' : `${order.shippingFee.toLocaleString('tr-TR')} TL`}
            </span>
          </div>
          <div className="flex justify-between font-bold pt-1.5 border-t border-gray-100">
            <span>Toplam</span>
            <span>{order.total.toLocaleString('tr-TR')} TL</span>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Teslimat bölgesi: {order.district} / {order.city}
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        Sorularınız için{' '}
        <Link href="/iletisim" className="underline">bizimle iletişime geçebilirsiniz</Link>.
      </p>
    </div>
  );
}
