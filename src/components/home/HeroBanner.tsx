'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const slides = [
  {
    image: 'https://res.cloudinary.com/dgwcd1hnd/image/upload/v1778272259/ebruca/hero/hero-1.jpg',
    posClass: '[object-position:center_40%] md:[object-position:center_65%]',
    title: 'Yeni Sezon',
    subtitle: 'Koleksiyonu',
    description: '2025 İlkbahar/Yaz koleksiyonuyla şıklığı keşfedin',
    cta: 'Alışverişe Başla',
    href: '/kategori/elbise',
  },
  {
    image: 'https://res.cloudinary.com/dgwcd1hnd/image/upload/v1778272261/ebruca/hero/hero-2.jpg',
    posClass: '[object-position:center_18%] md:[object-position:center_12%]',
    title: 'Özel Tasarım',
    subtitle: 'Elbiseler',
    description: 'Zarif kesimler, kaliteli kumaşlar',
    cta: 'Keşfet',
    href: '/kategori/elbise',
  },
  {
    image: 'https://res.cloudinary.com/dgwcd1hnd/image/upload/v1778272264/ebruca/hero/hero-3.jpg',
    posClass: '[object-position:58%_22%] md:[object-position:58%_35%]',
    title: 'Sokak Stili',
    subtitle: 'Koleksiyonu',
    description: 'Günlük şıklığın adresi Ebruca',
    cta: 'İncele',
    href: '/tumurunler',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (i: number) => {
    if (i === current) return;
    setCurrent(i);
  };

  const slide = slides[current];

  return (
    <div className="relative h-[70vh] sm:h-[80vh] min-h-[500px] max-h-[850px] bg-[#1a1a1a] overflow-hidden group">
      {/* Slaytlar */}
      {slides.map((s, i) => (
        <div
          key={s.image}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            i === current ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
          }`}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            priority={i === 0}
            className={`object-cover ${s.posClass}`}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 md:via-black/20 to-transparent z-20" />
      <div className="absolute inset-0 bg-black/20 md:bg-black/10 z-20" /> {/* Mobil için hafif karanlıklaştır */}

      {/* İçerik */}
      <div className="relative z-30 h-full flex flex-col justify-end pb-16 sm:pb-32 px-5 sm:px-12 lg:px-24">
        <div className="max-w-2xl text-center sm:text-left mx-auto sm:mx-0 w-full overflow-hidden">
          <p className="text-white/70 text-[9px] sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-2 sm:mb-4 animate-fadeIn">
            Ebruca Butik
          </p>
          <div className="overflow-hidden mb-0.5 sm:mb-1">
            <h1
              key={`title-${current}`}
              className="text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-tight tracking-tight animate-fadeIn"
            >
              {slide.title}
            </h1>
          </div>
          <div className="overflow-hidden mb-3 sm:mb-6">
            <h2
              key={`sub-${current}`}
              className="text-3xl sm:text-5xl lg:text-6xl font-serif italic text-white/90 leading-tight animate-fadeIn"
              style={{ animationDelay: '100ms', animationFillMode: 'both' }}
            >
              {slide.subtitle}
            </h2>
          </div>
          <p 
            key={`desc-${current}`}
            className="text-white/80 text-xs sm:text-lg mb-6 sm:mb-10 font-light max-w-xs sm:max-w-md mx-auto sm:mx-0 animate-fadeIn"
            style={{ animationDelay: '200ms', animationFillMode: 'both' }}
          >
            {slide.description}
          </p>
          <Link
            key={`cta-${current}`}
            href={slide.href}
            className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 sm:px-10 py-3 sm:py-4 text-[11px] sm:text-sm hover:cursor-pointer font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-300 animate-fadeIn"
            style={{ animationDelay: '300ms', animationFillMode: 'both' }}
          >
            {slide.cta}
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* İndikatörler */}
      <div className="absolute bottom-6 sm:bottom-12 left-0 right-0 flex justify-center sm:justify-start sm:left-12 lg:left-24 gap-2.5 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-500 rounded-full ${
              i === current ? 'w-8 sm:w-10 h-1bg-white bg-white' : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 hover:bg-white/80'
            }`}
            style={i === current ? { height: '3px', borderRadius: '4px' } : {}}
            aria-label={`Slayt ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
