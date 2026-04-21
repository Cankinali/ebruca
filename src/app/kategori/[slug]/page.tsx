'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCategoryBySlug } from '@/lib/data';
import { FilterOptions, Product, SortOption } from '@/lib/types';
import ProductCard from '@/components/ui/ProductCard';
import FilterPanel from '@/components/ui/FilterPanel';
import Link from 'next/link';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = getCategoryBySlug(slug);

  const [baseProducts, setBaseProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Partial<FilterOptions>>({});
  const [sort, setSort] = useState<SortOption>('newest');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/kategori/${slug}`)
      .then(r => r.json())
      .then((data: Product[]) => { setBaseProducts(data); setLoading(false); });
  }, [slug]);

  const filtered = useMemo(() => {
    let list = [...baseProducts];
    if (filters.sizes?.length) {
      list = list.filter(p => p.sizes.some(s => filters.sizes!.includes(s)));
    }
    if (filters.colors?.length) {
      list = list.filter(p => p.colors.some(c => filters.colors!.includes(c)));
    }
    if (filters.priceRange) {
      list = list.filter(
        p => p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]
      );
    }
    switch (sort) {
      case 'price_asc': list.sort((a, b) => a.price - b.price); break;
      case 'price_desc': list.sort((a, b) => b.price - a.price); break;
      case 'bestseller': list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0)); break;
    }
    return list;
  }, [baseProducts, filters, sort]);

  const activeFilterCount =
    (filters.sizes?.length || 0) + (filters.colors?.length || 0) + (filters.priceRange ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-black">Anasayfa</Link>
        <span>/</span>
        <span className="text-black">{category?.name ?? slug}</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-wide uppercase">
            {category?.name ?? slug}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? '...' : `${filtered.length} ürün`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden flex items-center gap-1.5 text-sm border border-gray-200 px-3 py-2"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtrele
            {activeFilterCount > 0 && (
              <span className="bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <select value={sort} onChange={e => setSort(e.target.value as SortOption)}
            className="border border-gray-200 text-sm px-3 py-2 outline-none focus:border-black">
            <option value="newest">En Yeni</option>
            <option value="price_asc">Fiyat: Artan</option>
            <option value="price_desc">Fiyat: Azalan</option>
            <option value="bestseller">En Çok Satan</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <FilterPanel
            onFilterChange={f => setFilters(prev => ({ ...prev, ...f }))}
            activeFilters={filters}
          />
          {activeFilterCount > 0 && (
            <button onClick={() => setFilters({})}
              className="mt-4 w-full text-xs text-gray-500 underline text-left">
              Filtreleri temizle ({activeFilterCount})
            </button>
          )}
        </aside>

        {filterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filtrele</h3>
                <button onClick={() => setFilterOpen(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <FilterPanel
                onFilterChange={f => setFilters(prev => ({ ...prev, ...f }))}
                activeFilters={filters}
              />
              <div className="mt-6 flex gap-2">
                <button onClick={() => { setFilters({}); setFilterOpen(false); }}
                  className="flex-1 border border-black py-2 text-sm">Temizle</button>
                <button onClick={() => setFilterOpen(false)}
                  className="flex-1 bg-black text-white py-2 text-sm">
                  Uygula ({filtered.length})
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-100 mb-3" />
                  <div className="h-3 bg-gray-100 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">Bu kriterlere uygun ürün bulunamadı.</p>
              <button onClick={() => setFilters({})} className="mt-4 text-sm underline">
                Filtreleri temizle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
