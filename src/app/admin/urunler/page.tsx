import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import AdminNav from '@/components/admin/AdminNav';
import DeleteButton from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const stockLabels: Record<string, { text: string; class: string }> = {
    in_stock: { text: 'Stokta', class: 'bg-green-100 text-green-700' },
    low_stock: { text: 'Tükeniyor', class: 'bg-amber-100 text-amber-700' },
    out_of_stock: { text: 'Tükendi', class: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-lg sm:text-xl font-bold">Ürünler</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{products.length} ürün</p>
          </div>
          <Link
            href="/admin/urunler/yeni"
            className="bg-black text-white px-4 sm:px-5 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-1 min-h-[44px]"
          >
            <span className="text-lg leading-none">+</span> <span className="hidden sm:inline">Yeni</span> Ürün
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white border border-gray-100 p-16 text-center">
            <p className="text-gray-400 mb-4">Henüz ürün eklenmedi.</p>
            <Link href="/admin/urunler/yeni"
              className="bg-black text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors">
              İlk Ürünü Ekle
            </Link>
          </div>
        ) : (
          <>
          {/* Mobil: kart görünümü */}
          <div className="md:hidden space-y-2">
            {products.map(product => {
              const images = JSON.parse(product.images) as string[];
              const stockInfo = stockLabels[product.stock] ?? stockLabels.in_stock;
              return (
                <div key={product.id} className="bg-white border border-gray-100 p-3 flex gap-3">
                  <div className="relative w-16 h-20 bg-gray-100 overflow-hidden flex-shrink-0">
                    {images[0] ? (
                      <Image src={images[0]} alt={product.name} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">👗</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.code}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-sm font-bold">{product.price.toLocaleString('tr-TR')} TL</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {product.originalPrice.toLocaleString('tr-TR')}
                        </span>
                      )}
                      <span className={`text-[10px] px-1.5 py-0.5 ${stockInfo.class}`}>{stockInfo.text}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Link href={`/admin/urunler/${product.id}`}
                        className="flex-1 text-xs text-center py-2 border border-gray-200 hover:border-black transition-colors min-h-[36px] flex items-center justify-center">
                        Düzenle
                      </Link>
                      <Link href={`/urun/${product.slug}`} target="_blank"
                        className="text-xs px-3 py-2 border border-gray-200 hover:border-black transition-colors min-h-[36px] flex items-center justify-center">
                        Gör ↗
                      </Link>
                      <DeleteButton id={product.id} name={product.name} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Masaüstü: tablo görünümü */}
          <div className="hidden md:block bg-white border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 w-16">
                    Görsel
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Ürün
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">
                    Kategori
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Fiyat
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:table-cell">
                    Stok
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(product => {
                  const images = JSON.parse(product.images) as string[];
                  const stockInfo = stockLabels[product.stock] ?? stockLabels.in_stock;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="relative w-12 h-16 bg-gray-100 overflow-hidden flex-shrink-0">
                          {images[0] ? (
                            <Image
                              src={images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{product.code}</p>
                        <div className="flex gap-1 mt-1">
                          {product.isNew && (
                            <span className="text-xs bg-black text-white px-1.5 py-0.5">YENİ</span>
                          )}
                          {product.isBestseller && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5">ÇOK SATAN</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-gray-600 capitalize">
                          {product.category.replace(/-/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold">{product.price.toLocaleString('tr-TR')} TL</p>
                        {product.originalPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            {product.originalPrice.toLocaleString('tr-TR')} TL
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`text-xs px-2 py-1 ${stockInfo.class}`}>
                          {stockInfo.text}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/urun/${product.slug}`}
                            target="_blank"
                            className="text-xs text-gray-400 hover:text-black transition-colors"
                            title="Siteyi Gör"
                          >
                            Gör ↗
                          </Link>
                          <Link
                            href={`/admin/urunler/${product.id}`}
                            className="text-xs text-gray-600 hover:text-black border border-gray-200 px-2.5 py-1 hover:border-black transition-colors"
                          >
                            Düzenle
                          </Link>
                          <DeleteButton id={product.id} name={product.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
