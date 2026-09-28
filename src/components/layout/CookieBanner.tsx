'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getConsent, setConsent } from '@/lib/meta/consent-client';

/**
 * Çerez onayı — KVKK: zorunlu olmayan (reklam/analitik) çerezler için AÇIK
 * rıza gerekir; "devam ederek kabul etmiş olursunuz" ve tek "Kabul Et" butonu
 * yeterli sayılmaz (wiki/buyume/Yasal-Cerceve.md). Bu yüzden Kabul / Reddet.
 *
 * İki buton bilerek AYNI görünümde: reddetmek kabul etmek kadar kolay olmalı.
 * Meta Pixel ve CAPI yalnızca "Kabul Et" sonrası çalışır. Eski bant
 * (localStorage 'cookie_consent') açık rıza sayılmadığı için yeniden sorulur.
 */
export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (getConsent() === null) {
      // Sayfa yüklendikten sonra göster
      const t = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(t);
    }
  }, []);

  const choose = (value: 'granted' | 'denied') => {
    setConsent(value);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-sm z-50 bg-white border border-gray-200 shadow-lg p-4 rounded-sm">
      <p className="text-xs text-gray-700 leading-relaxed mb-3">
        Zorunlu çerezlerin yanında, reklamlarımızı ölçmek ve size uygun reklam göstermek için
        pazarlama çerezleri (Meta Pixel) kullanmak istiyoruz. Onay vermezseniz yalnızca zorunlu
        çerezler kullanılır.{' '}
        <Link prefetch={false} href="/cerez" className="underline text-black">Çerez Politikası</Link>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => choose('denied')}
          className="flex-1 bg-black text-white text-xs font-semibold uppercase tracking-wider py-2 hover:bg-gray-800 transition-colors"
        >
          Reddet
        </button>
        <button
          onClick={() => choose('granted')}
          className="flex-1 bg-black text-white text-xs font-semibold uppercase tracking-wider py-2 hover:bg-gray-800 transition-colors"
        >
          Kabul Et
        </button>
      </div>
    </div>
  );
}
