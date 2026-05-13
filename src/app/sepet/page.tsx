'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  const shippingFee = totalPrice >= 5000 ? 0 : 90;
  const finalTotal = totalPrice + shippingFee;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <svg className="w-14 h-14 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h1 className="text-lg font-bold mb-2">Sepetiniz boş</h1>
        <p className="text-gray-500 text-sm mb-8">Beğendiğiniz ürünleri sepete ekleyin.</p>
        <Link href="/" className="bg-black text-white px-8 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors">
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <h1 className="text-lg sm:text-2xl font-bold tracking-wide uppercase mb-5 sm:mb-8">
        Sepetim ({totalItems} ürün)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
        {/* Ürünler */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {items.map(item => (
            <div key={`${item.product.id}-${item.size}-${item.color}`}
              className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-100">
              {/* Görsel */}
              <Link href={`/urun/${item.product.slug}`}
                className="relative w-20 sm:w-24 flex-shrink-0 bg-gray-100 overflow-hidden"
                style={{ aspectRatio: '3/4' }}>
                <Image src={item.product.images[0]} alt={item.product.name}
                  fill className="object-cover" sizes="96px" />
              </Link>

              {/* Bilgi */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <Link href={`/urun/${item.product.slug}`}
                    className="text-xs sm:text-sm font-semibold hover:underline line-clamp-2 leading-snug">
                    {item.product.name}
                  </Link>
                  <div className="text-[10px] sm:text-xs text-gray-400 mt-1 space-y-0.5">
                    <p>Beden: {item.size}</p>
                    <p>Renk: {item.color}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  {/* Adet */}
                  <div className="flex items-center border border-gray-200">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-base hover:bg-gray-50">
                      −
                    </button>
                    <span className="w-7 text-center text-xs sm:text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-base hover:bg-gray-50">
                      +
                    </button>
                  </div>

                  {/* Fiyat */}
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-bold">
                      {(item.product.price * item.quantity).toLocaleString('tr-TR')} TL
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-[10px] sm:text-xs text-gray-400">
                        {item.product.price.toLocaleString('tr-TR')} TL / adet
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sil */}
              <button onClick={() => removeItem(item.product.id, item.size, item.color)}
                className="self-start p-1 text-gray-300 hover:text-black min-w-[32px] min-h-[32px] flex items-center justify-center"
                aria-label="Kaldır">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Özet */}
        <div>
          <div className="border border-gray-100 p-4 sm:p-5 lg:sticky lg:top-20">
            <h2 className="font-bold text-sm uppercase tracking-wider mb-4">Sipariş Özeti</h2>

            {/* Kupon */}
            <div className="flex gap-2 mb-4">
              <input type="text" placeholder="Kupon kodu"
                className="flex-1 border border-gray-200 px-2.5 py-2 text-xs sm:text-sm outline-none focus:border-black" />
              <button className="border border-black px-3 py-2 text-xs sm:text-sm font-medium hover:bg-black hover:text-white transition-colors whitespace-nowrap">
                Uygula
              </button>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 text-xs sm:text-sm">Ara toplam</span>
                <span className="text-xs sm:text-sm">{totalPrice.toLocaleString('tr-TR')} TL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-xs sm:text-sm">Kargo</span>
                <span className={`text-xs sm:text-sm ${shippingFee === 0 ? 'text-green-600 font-medium' : ''}`}>
                  {shippingFee === 0 ? 'Ücretsiz' : `${shippingFee} TL`}
                </span>
              </div>
              {shippingFee > 0 && (
                <p className="text-[10px] sm:text-xs text-gray-400 bg-gray-50 px-2 py-1.5">
                  {(5000 - totalPrice).toLocaleString('tr-TR')} TL daha ekle, kargo ücretsiz olsun!
                </p>
              )}
              <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold">
                <span className="text-sm sm:text-base">Toplam</span>
                <span className="text-sm sm:text-base">{finalTotal.toLocaleString('tr-TR')} TL</span>
              </div>
            </div>

            <Link href="/odeme"
              className="block w-full bg-black text-white text-center py-3.5 sm:py-4 mt-4 sm:mt-5 text-xs sm:text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors">
              Ödemeye Geç
            </Link>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-gray-400">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              SSL ile güvenli ödeme
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
