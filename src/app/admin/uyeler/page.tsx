'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Uye {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  district: string;
  kilitli: boolean;
  createdAt: string;
  siparisSayisi: number;
  toplamHarcama: number;
}

export default function UyelerPage() {
  const [uyeler, setUyeler] = useState<Uye[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [q, setQ] = useState('');
  const [arama, setArama] = useState('');
  const [loading, setLoading] = useState(true);

  // Veri çekme doğrudan effect içinde: setState'ler await sonrasında çalışır,
  // effect gövdesinde senkron değil. `iptal` bayrağı, hızlı arama/sayfa
  // değişiminde geç dönen eski yanıtın yeniyi ezmesini engeller.
  useEffect(() => {
    let iptal = false;

    (async () => {
      const params = new URLSearchParams({ page: String(page) });
      if (arama) params.set('q', arama);

      try {
        const res = await fetch(`/api/admin/uyeler?${params}`);
        const data = await res.json();
        if (iptal) return;
        setUyeler(data.users || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      } catch {
        if (!iptal) setUyeler([]);
      }
      if (!iptal) setLoading(false);
    })();

    return () => { iptal = true; };
  }, [page, arama]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPage(1);
    setArama(q.trim());
  };

  const sayfaDegistir = (yeni: number) => {
    setLoading(true);
    setPage(yeni);
  };

  const tarih = (s: string) =>
    new Date(s).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wide">Üyeler</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {total} kayıtlı üye
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Ad, e-posta veya telefon"
            className="border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black w-48 sm:w-64"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Ara
          </button>
          {arama && (
            <button
              type="button"
              onClick={() => { setLoading(true); setQ(''); setArama(''); setPage(1); }}
              className="border border-gray-200 px-3 py-2 text-xs hover:border-black transition-colors"
            >
              Temizle
            </button>
          )}
        </form>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-12 text-center">Yükleniyor...</p>
      ) : uyeler.length === 0 ? (
        <div className="border border-gray-100 py-16 text-center">
          <p className="text-gray-500">
            {arama ? 'Aramanızla eşleşen üye bulunamadı.' : 'Henüz kayıtlı üye yok.'}
          </p>
        </div>
      ) : (
        <>
          {/* Masaüstü tablo */}
          <div className="hidden md:block border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr className="text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3 font-medium">Üye</th>
                  <th className="px-4 py-3 font-medium">İletişim</th>
                  <th className="px-4 py-3 font-medium">Şehir</th>
                  <th className="px-4 py-3 font-medium text-right">Sipariş</th>
                  <th className="px-4 py-3 font-medium text-right">Harcama</th>
                  <th className="px-4 py-3 font-medium">Kayıt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {uyeler.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/uyeler/${u.id}`} className="font-medium hover:underline">
                        {u.firstName} {u.lastName}
                      </Link>
                      {u.kilitli && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-red-50 text-red-700">
                          Kilitli
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="truncate max-w-[220px]">{u.email}</div>
                      {u.phone && <div className="text-xs text-gray-400">{u.phone}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {u.city ? `${u.district ? u.district + ' / ' : ''}${u.city}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{u.siparisSayisi}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {u.toplamHarcama > 0 ? `${u.toplamHarcama.toLocaleString('tr-TR')} TL` : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {tarih(u.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobil kart listesi */}
          <div className="md:hidden space-y-3">
            {uyeler.map(u => (
              <Link
                key={u.id}
                href={`/admin/uyeler/${u.id}`}
                className="block border border-gray-100 p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {u.firstName} {u.lastName}
                      {u.kilitli && (
                        <span className="ml-2 text-[10px] font-semibold uppercase px-1.5 py-0.5 bg-red-50 text-red-700">
                          Kilitli
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{tarih(u.createdAt)}</span>
                </div>
                <div className="flex gap-4 mt-3 text-xs text-gray-600">
                  <span>{u.siparisSayisi} sipariş</span>
                  {u.toplamHarcama > 0 && (
                    <span className="font-medium">{u.toplamHarcama.toLocaleString('tr-TR')} TL</span>
                  )}
                  {u.city && <span className="text-gray-400">{u.city}</span>}
                </div>
              </Link>
            ))}
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => sayfaDegistir(Math.max(1, page - 1))}
                disabled={page === 1}
                className="border border-gray-200 px-4 py-2 text-sm disabled:opacity-30 hover:border-black transition-colors"
              >
                ← Önceki
              </button>
              <span className="text-sm text-gray-500">{page} / {pages}</span>
              <button
                onClick={() => sayfaDegistir(Math.min(pages, page + 1))}
                disabled={page === pages}
                className="border border-gray-200 px-4 py-2 text-sm disabled:opacity-30 hover:border-black transition-colors"
              >
                Sonraki →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
