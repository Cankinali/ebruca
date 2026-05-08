'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('cookie_consent')) {
      // Sayfa yüklendikten sonra göster
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-sm z-50 bg-white border border-gray-200 shadow-lg p-4 rounded-sm">
      <p className="text-xs text-gray-700 leading-relaxed mb-3">
        Sitemizde deneyiminizi iyileştirmek için çerez kullanıyoruz. Devam ederek{' '}
        <Link href="/cerez" className="underline text-black">Çerez Politikamızı</Link> kabul etmiş olursunuz.
      </p>
      <div className="flex gap-2">
        <button
          onClick={accept}
          className="flex-1 bg-black text-white text-xs font-semibold uppercase tracking-wider py-2 hover:bg-gray-800 transition-colors"
        >
          Kabul Et
        </button>
        <Link
          href="/cerez"
          className="flex-1 border border-gray-200 text-xs text-center font-medium py-2 hover:border-black transition-colors flex items-center justify-center"
        >
          Daha Fazla
        </Link>
      </div>
    </div>
  );
}
