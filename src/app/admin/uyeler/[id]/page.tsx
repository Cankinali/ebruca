'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { orderStatusStyle } from '@/lib/order-status';

interface Uye {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  kvkkAcceptedAt: string | null;
  termsAcceptedAt: string | null;
  failedLoginCount: number;
  kilitli: boolean;
  lockedUntil: string | null;
  acikOturum: number;
  createdAt: string;
  siparisSayisi: number;
  toplamHarcama: number;
}

interface Siparis {
  id: string;
  orderNo: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: { id: string; name: string; size: string; color: string; quantity: number; price: number }[];
}

export default function UyeDetayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [uye, setUye] = useState<Uye | null>(null);
  const [siparisler, setSiparisler] = useState<Siparis[]>([]);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState('');
  const [islemde, setIslemde] = useState(false);
  const [yenile, setYenile] = useState(0);

  // `yenile` artınca effect tekrar çalışır — kilit açıldıktan sonra veriyi
  // tazelemek için. setState'ler await sonrasında olduğu için effect
  // gövdesinde senkron çağrı yok.
  useEffect(() => {
    let iptal = false;

    (async () => {
      try {
        const res = await fetch(`/api/admin/uyeler/${id}`);
        if (iptal) return;
        if (!res.ok) {
          setHata('Üye bulunamadı.');
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (iptal) return;
        setUye(data.user);
        setSiparisler(data.orders || []);
      } catch {
        if (!iptal) setHata('Üye bilgileri yüklenemedi.');
      }
      if (!iptal) setLoading(false);
    })();

    return () => { iptal = true; };
  }, [id, yenile]);

  const kilidiAc = async () => {
    setIslemde(true);
    await fetch(`/api/admin/uyeler/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'kilidi-ac' }),
    });
    setYenile(n => n + 1);
    setIslemde(false);
  };

  const tarih = (s: string | null) =>
    s ? new Date(s).toLocaleString('tr-TR', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }) : '—';

  if (loading) {
    return <p className="text-sm text-gray-400 py-16 text-center">Yükleniyor...</p>;
  }
  if (hata || !uye) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">{hata || 'Üye bulunamadı.'}</p>
        <Link href="/admin/uyeler" className="text-sm underline">Üyeler listesine dön</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link href="/admin/uyeler" className="text-sm text-gray-500 hover:text-black">
        ← Üyeler
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3 mt-3 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">
            {uye.firstName} {uye.lastName}
            {uye.kilitli && (
              <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 bg-red-50 text-red-700 align-middle">
                Hesap Kilitli
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{uye.email}</p>
        </div>
        {uye.kilitli && (
          <button
            onClick={kilidiAc}
            disabled={islemde}
            className="bg-black text-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-40"
          >
            {islemde ? 'Açılıyor...' : 'Kilidi Aç'}
          </button>
        )}
      </div>

      {/* Özet kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { etiket: 'Sipariş', deger: String(uye.siparisSayisi) },
          { etiket: 'Toplam Harcama', deger: `${uye.toplamHarcama.toLocaleString('tr-TR')} TL` },
          { etiket: 'Açık Oturum', deger: String(uye.acikOturum) },
          { etiket: 'Üyelik', deger: new Date(uye.createdAt).toLocaleDateString('tr-TR') },
        ].map(k => (
          <div key={k.etiket} className="border border-gray-100 p-3">
            <p className="text-[10px] uppercase tracking-wider text-gray-400">{k.etiket}</p>
            <p className="text-base font-bold mt-1">{k.deger}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol: bilgiler */}
        <div className="space-y-6">
          <section className="border border-gray-100 p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              İletişim
            </h2>
            <dl className="space-y-2 text-sm">
              <div><dt className="text-gray-400 text-xs">E-posta</dt><dd className="break-all">{uye.email}</dd></div>
              <div><dt className="text-gray-400 text-xs">Telefon</dt><dd>{uye.phone || '—'}</dd></div>
            </dl>
          </section>

          <section className="border border-gray-100 p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Kayıtlı Adres
            </h2>
            {uye.address ? (
              <p className="text-sm leading-relaxed">
                {uye.address}<br />
                {uye.district && `${uye.district} / `}{uye.city}
                {uye.postalCode && ` ${uye.postalCode}`}
              </p>
            ) : (
              <p className="text-sm text-gray-400">Adres kaydedilmemiş</p>
            )}
          </section>

          <section className="border border-gray-100 p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Hesap Durumu
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-400 text-xs">KVKK onayı</dt>
                <dd>{tarih(uye.kvkkAcceptedAt)}</dd>
              </div>
              <div>
                <dt className="text-gray-400 text-xs">Üyelik sözleşmesi</dt>
                <dd>{tarih(uye.termsAcceptedAt)}</dd>
              </div>
              <div>
                <dt className="text-gray-400 text-xs">Hatalı giriş denemesi</dt>
                <dd>{uye.failedLoginCount}</dd>
              </div>
              {uye.kilitli && (
                <div>
                  <dt className="text-gray-400 text-xs">Kilit bitişi</dt>
                  <dd className="text-red-700">{tarih(uye.lockedUntil)}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>

        {/* Sağ: siparişler */}
        <div className="lg:col-span-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Siparişleri ({siparisler.length})
          </h2>

          {siparisler.length === 0 ? (
            <div className="border border-gray-100 py-12 text-center">
              <p className="text-sm text-gray-500">Bu üyenin henüz siparişi yok.</p>
              <p className="text-xs text-gray-400 mt-1">
                Üyelikten önce misafir olarak verilen siparişler burada görünmez.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {siparisler.map(s => {
                const durum = orderStatusStyle(s.status);
                const odenmemis = s.paymentStatus !== 'success';
                return (
                  <Link
                    key={s.id}
                    href={`/admin/siparisler/${s.id}`}
                    className="block border border-gray-100 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <div>
                        <p className="font-mono text-sm font-semibold">{s.orderNo}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(s.createdAt).toLocaleDateString('tr-TR', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {odenmemis && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 bg-gray-200 text-gray-600">
                            Ödenmedi
                          </span>
                        )}
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 ${durum.bg} ${durum.color}`}>
                          {durum.label}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between gap-3">
                      <p className="text-xs text-gray-500 truncate">
                        {s.items.map(i => `${i.name} (${i.size}/${i.color}) ×${i.quantity}`).join(', ')}
                      </p>
                      <span className="text-sm font-bold whitespace-nowrap">
                        {s.total.toLocaleString('tr-TR')} TL
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
