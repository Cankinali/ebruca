'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div
      className="group block relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Görsel Alanı */}
      <div className="relative aspect-[3/4] bg-[#f8f8f8] mb-3 sm:mb-4 overflow-hidden">
        <Link href={`/urun/${product.slug}`}>
          <Image
            src={hovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>
        
        {/* Karartma Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />

        {/* Rozetler */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-white/90 backdrop-blur-sm text-black text-[9px] sm:text-[10px] px-1.5 sm:px-2.5 py-0.5 sm:py-1 font-medium tracking-[0.15em] border border-black/5">
              YENİ
            </span>
          )}
          {discount && (
            <span className="bg-[#cc0000] text-white text-[9px] sm:text-[10px] px-1.5 sm:px-2.5 py-0.5 sm:py-1 font-medium tracking-wider">
              -%{discount}
            </span>
          )}
          {product.stock === 'low_stock' && (
            <span className="bg-[#b8960c] text-white text-[9px] sm:text-[10px] px-1.5 sm:px-2.5 py-0.5 sm:py-1 font-medium tracking-wider">
              AZ KALDI
            </span>
          )}
        </div>

        {/* Tükendi */}
        {product.stock === 'out_of_stock' && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="bg-black text-white text-[10px] sm:text-xs px-2.5 sm:px-4 py-1.5 sm:py-2 tracking-[0.2em] uppercase">
              TÜKENDİ
            </span>
          </div>
        )}

        {/* Hızlı Ekle Overlay (Sadece Desktop / Hover) */}
        {product.stock !== 'out_of_stock' && (
          <div className="absolute left-0 right-0 bottom-0 p-3 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 ease-out hidden lg:block z-20">
            <button className="w-full bg-white/90 backdrop-blur-md hover:bg-black hover:text-white hover:border-black text-black border border-transparent text-xs py-3 font-medium tracking-[0.1em] uppercase transition-all duration-300">
              Sepete Ekle
            </button>
          </div>
        )}
      </div>

      {/* Bilgi Alanı */}
      <div className="flex flex-col gap-1 sm:gap-1.5 px-0.5">
        <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-[0.15em] font-light">{product.brand}</p>
        <Link href={`/urun/${product.slug}`}>
          <h3 className="text-xs sm:text-sm font-light text-gray-900 line-clamp-1 group-hover:text-black transition-colors leading-relaxed">
            {product.name}
          </h3>
        </Link>
        <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mt-0.5">
          <span className="text-sm sm:text-base font-medium text-black tracking-wide">
            {product.price.toLocaleString('tr-TR')} TL
          </span>
          {product.originalPrice && (
            <span className="text-[10px] sm:text-xs text-gray-400 line-through font-light">
              {product.originalPrice.toLocaleString('tr-TR')} TL
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
