'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { orderStatusStyle } from '@/lib/order-status';

// Not: tip @/lib/auth'tan alınmıyor — o modül 'server-only' ile işaretli.
interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
}

interface OrderItem {
  id: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  orderNo: string;
  status: string;
  paymentStatus: string;
  total: number;
  cargoCompany: string;
  trackingNo: string;
  createdAt: string;
  items: OrderItem[];
}

type Tab = 'siparisler' | 'bilgiler';

export default function AccountClient({
  user,
  orders,
}: {
  user: SessionUser;
  orders: Order[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('siparisler');

  const handleLogout = async () => {
    await fetch('/api/auth/cikis', { method: 'POST' });
    router.replace('/');
    router.refresh();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">Hesabım</h1>
          <p className="text-sm text-gray-500 mt-1">
            Merhaba {user.firstName} · {user.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="border border-gray-200 px-4 py-2 text-xs font-medium uppercase tracking-wider hover:border-black transition-colors"
        >
          Çıkış Yap
        </button>
      </div>

      <div className="flex gap-1 border-b border-gray-100 mb-6">
        {([
          { key: 'siparisler', label: `Siparişlerim${orders.length ? ` (${orders.length})` : ''}` },
          { key: 'bilgiler', label: 'Bilgilerim' },
        ] as { key: Tab; label: string }[]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'siparisler' ? <OrdersTab orders={orders} /> : <ProfileTab user={user} />}
    </div>
  );
}

function OrdersTab({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16 border border-gray-100">
        <p className="text-gray-500 mb-1">Henüz siparişiniz bulunmuyor.</p>
        <p className="text-gray-400 text-xs mb-6">
          Üyeliğinizden önce misafir olarak verdiğiniz siparişler burada görünmez —
          onları <Link href="/siparis-sorgula" className="underline">Sipariş Sorgula</Link> sayfasından takip edebilirsiniz.
        </p>
        <Link href="/tumurunler" className="inline-block bg-black text-white px-6 py-3 text-sm font-semibold tracking-wider uppercase hover:bg-gray-800 transition-colors">
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(order => {
        const status = orderStatusStyle(order.status);
        const unpaid = order.paymentStatus !== 'success';

        return (
          <div key={order.id} className="border border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-2 p-4 bg-gray-50 border-b border-gray-100">
              <div>
                <p className="font-mono text-sm font-semibold">{order.orderNo}</p>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
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

            <div className="p-4 space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-14 h-18 bg-gray-50 flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
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

            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-gray-100">
              {order.trackingNo ? (
                <p className="text-xs text-gray-600">
                  <span className="text-gray-400">Kargo:</span> {order.cargoCompany}{' '}
                  <span className="font-mono">{order.trackingNo}</span>
                </p>
              ) : <span />}
              <p className="text-sm font-bold">
                Toplam: {order.total.toLocaleString('tr-TR')} TL
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProfileTab({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    address: user.address,
    city: user.city,
    district: user.district,
    postalCode: user.postalCode,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage('');
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/auth/profil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Bilgiler kaydedilemedi.');
      } else {
        setMessage('Bilgileriniz güncellendi.');
        router.refresh();
      }
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    }
    setSaving(false);
  };

  const inputCls = 'w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black';

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Ad</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Soyad</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">E-posta</label>
        <input
          value={user.email}
          disabled
          className="w-full border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
        />
        <p className="text-[11px] text-gray-400 mt-1">
          E-posta adresinizi değiştirmek için bizimle iletişime geçin.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Telefon</label>
        <input name="phone" value={form.phone} onChange={handleChange}
          placeholder="05XX XXX XX XX" className={inputCls} />
      </div>

      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 pt-2">
          Kayıtlı Teslimat Adresi
        </p>
        <p className="text-[11px] text-gray-400 mb-3">
          Buraya kaydettiğiniz adres, ödeme sayfasında otomatik doldurulur.
        </p>
        <textarea name="address" value={form.address} onChange={handleChange} rows={3}
          placeholder="Mahalle, sokak, bina, daire" className={`${inputCls} resize-none`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">İl</label>
          <input name="city" value={form.city} onChange={handleChange} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">İlçe</label>
          <input name="district" value={form.district} onChange={handleChange} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Posta Kodu</label>
          <input name="postalCode" value={form.postalCode} onChange={handleChange} className={inputCls} />
        </div>
      </div>

      {message && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 p-3">{message}</p>
      )}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 p-3">{error}</p>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white px-6 py-3 text-sm font-semibold tracking-wider uppercase hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? 'Kaydediliyor...' : 'Bilgilerimi Kaydet'}
        </button>
        <Link
          href="/sifre-sifirla"
          className="border border-gray-200 px-6 py-3 text-sm font-medium hover:border-black transition-colors"
        >
          Şifremi Değiştir
        </Link>
      </div>
    </form>
  );
}
