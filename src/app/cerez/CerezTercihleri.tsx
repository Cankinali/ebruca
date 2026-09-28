'use client';

import { useSyncExternalStore } from 'react';
import { getConsent, setConsent } from '@/lib/meta/consent-client';
import { CONSENT_EVENT, type ConsentValue } from '@/lib/meta/shared';

/**
 * Çerez tercihini sonradan değiştirme — KVKK: rızanın geri alınması, verilmesi
 * kadar kolay olmalı. Reddedilince Meta'nın bu sitede bıraktığı _fbp/_fbc
 * çerezleri de silinir.
 */

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_EVENT, onChange);
}
const serverSnapshot = (): ConsentValue | null => null;

function deleteMetaCookies() {
  const host = location.hostname;
  const domains = ['', `; Domain=${host}`, `; Domain=.${host.replace(/^www\./, '')}`];
  for (const name of ['_fbp', '_fbc']) {
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; Path=/${d}`;
  }
}

export default function CerezTercihleri() {
  const consent = useSyncExternalStore(subscribe, getConsent, serverSnapshot);

  const choose = (v: ConsentValue) => {
    if (v === 'denied') deleteMetaCookies();
    setConsent(v);
  };

  const durum =
    consent === 'granted' ? 'Pazarlama çerezlerine izin verdiniz.'
    : consent === 'denied' ? 'Pazarlama çerezlerini reddettiniz; yalnızca zorunlu çerezler kullanılıyor.'
    : 'Henüz bir tercih yapmadınız; yalnızca zorunlu çerezler kullanılıyor.';

  return (
    <div className="border border-gray-200 p-4">
      <p className="text-sm mb-3">
        <strong>Mevcut tercihiniz:</strong> {durum}
      </p>
      <div className="flex gap-2 max-w-sm">
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
      <p className="text-xs text-gray-500 mt-2">
        Onayınızı geri aldığınızda Meta Pixel bir daha yüklenmez ve bu sitedeki Meta çerezleri silinir.
        Daha önce iletilmiş veriler için Meta&apos;nın kendi gizlilik ayarlarını da kullanabilirsiniz.
      </p>
    </div>
  );
}
