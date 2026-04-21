'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardData {
  totalRevenue: number;
  monthRevenue: number;
  lastMonthRevenue: number;
  monthOrderCount: number;
  totalOrderCount: number;
  statusCounts: Record<string, number>;
  monthly: { month: number; revenue: number; count: number }[];
  topProducts: { name: string; qty: number; revenue: number }[];
}

const MONTH_NAMES = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Bekliyor',  color: 'bg-amber-400'  },
  confirmed: { label: 'Onaylandı', color: 'bg-blue-500'   },
  shipped:   { label: 'Kargoda',   color: 'bg-purple-500' },
  delivered: { label: 'Teslim',    color: 'bg-green-500'  },
  cancelled: { label: 'İptal',     color: 'bg-red-400'    },
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400 text-sm">Yükleniyor...</div>
  );
  if (!data) return null;

  const maxRevenue = Math.max(...data.monthly.map(m => m.revenue), 1);
  const currentMonth = new Date().getMonth();

  const growthPct = data.lastMonthRevenue > 0
    ? Math.round(((data.monthRevenue - data.lastMonthRevenue) / data.lastMonthRevenue) * 100)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold tracking-wide uppercase">Dashboard</h1>
        <p className="text-xs text-gray-400">{new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="border border-gray-100 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Bu Ay Gelir</p>
          <p className="text-xl sm:text-2xl font-bold">{data.monthRevenue.toLocaleString('tr-TR')} TL</p>
          {growthPct !== null && (
            <p className={`text-xs mt-1 font-medium ${growthPct >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {growthPct >= 0 ? '▲' : '▼'} %{Math.abs(growthPct)} geçen aya göre
            </p>
          )}
        </div>
        <div className="border border-gray-100 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Toplam Gelir</p>
          <p className="text-xl sm:text-2xl font-bold">{data.totalRevenue.toLocaleString('tr-TR')} TL</p>
          <p className="text-xs text-gray-400 mt-1">İptal hariç</p>
        </div>
        <div className="border border-gray-100 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Bu Ay Sipariş</p>
          <p className="text-xl sm:text-2xl font-bold">{data.monthOrderCount}</p>
          <p className="text-xs text-gray-400 mt-1">adet</p>
        </div>
        <div className="border border-gray-100 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Toplam Sipariş</p>
          <p className="text-xl sm:text-2xl font-bold">{data.totalOrderCount}</p>
          <Link href="/admin/siparisler" className="text-xs text-gray-400 hover:text-black mt-1 inline-block underline">
            Tümünü Gör →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Aylık Gelir Grafiği */}
        <div className="lg:col-span-2 border border-gray-100 p-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-5">
            {new Date().getFullYear()} — Aylık Gelir
          </h2>
          <div className="flex items-end gap-1.5 h-40">
            {data.monthly.map((m, i) => {
              const pct = (m.revenue / maxRevenue) * 100;
              const isCurrentMonth = i === currentMonth;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full flex items-end justify-center" style={{ height: '128px' }}>
                    <div
                      className={`w-full transition-all rounded-sm ${
                        isCurrentMonth ? 'bg-black' : 'bg-gray-200 group-hover:bg-gray-400'
                      }`}
                      style={{ height: `${Math.max(pct, 2)}%` }}
                      title={`${m.revenue.toLocaleString('tr-TR')} TL · ${m.count} sipariş`}
                    />
                  </div>
                  <p className={`text-[9px] sm:text-[10px] ${isCurrentMonth ? 'font-bold' : 'text-gray-400'}`}>
                    {MONTH_NAMES[i]}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
            {data.monthly.map((m, i) => m.revenue > 0 && (
              <span key={i} className={i === currentMonth ? 'font-bold text-black' : ''}>
                {MONTH_NAMES[i]}: {m.revenue.toLocaleString('tr-TR')} TL
              </span>
            ))}
          </div>
        </div>

        {/* Durum dağılımı */}
        <div className="border border-gray-100 p-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Sipariş Durumları</h2>
          {data.totalOrderCount === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Henüz sipariş yok</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(STATUS_LABELS).map(([key, { label, color }]) => {
                const count = data.statusCounts[key] || 0;
                const pct = Math.round((count / data.totalOrderCount) * 100);
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${color}`} />
                        <span className="text-xs text-gray-600">{label}</span>
                      </div>
                      <span className="text-xs font-bold">{count} <span className="font-normal text-gray-400">({pct}%)</span></span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-gray-100">
            <Link href="/admin/siparisler?status=pending"
              className="block w-full text-center py-2 text-xs font-semibold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors">
              Bekleyen Siparişler ({data.statusCounts['pending'] || 0})
            </Link>
          </div>
        </div>
      </div>

      {/* En çok satan ürünler */}
      {data.topProducts.length > 0 && (
        <div className="border border-gray-100 p-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">En Çok Satan Ürünler</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">#</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">Ürün</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-gray-400 uppercase">Adet</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-gray-400 uppercase">Gelir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.topProducts.map((p, i) => (
                  <tr key={p.name}>
                    <td className="py-2.5 px-3 text-gray-400 font-mono text-xs">{i + 1}</td>
                    <td className="py-2.5 px-3 font-medium">{p.name}</td>
                    <td className="py-2.5 px-3 text-right text-gray-600">{p.qty} adet</td>
                    <td className="py-2.5 px-3 text-right font-bold">{p.revenue.toLocaleString('tr-TR')} TL</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data.topProducts.length === 0 && (
        <div className="border border-gray-100 p-10 text-center text-gray-400">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-sm">Satış verisi henüz yok.</p>
          <p className="text-xs mt-1">Siparişler geldikçe istatistikler burada görünecek.</p>
        </div>
      )}
    </div>
  );
}
