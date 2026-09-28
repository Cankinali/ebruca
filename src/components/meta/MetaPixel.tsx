'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { CONSENT_EVENT } from '@/lib/meta/shared';
import { getConsent } from '@/lib/meta/consent-client';
import { PIXEL_ID, ensurePixel, track } from '@/lib/meta/pixel';

/**
 * Meta Pixel yükleyici + PageView.
 *
 * Kök layout statik kalsın diye istemci bileşeni; useSearchParams kullandığı
 * için layout'ta Suspense içinde. Pazarlama onayı yoksa hiçbir şey yüklemez;
 * onay sonradan verilirse (CookieBanner → CONSENT_EVENT) o anda yüklenir.
 */

function subscribe(onChange: () => void) {
  const handler = (e: Event) => {
    // Onay geri çekildiyse yüklenmiş Pixel'e de bildir
    if ((e as CustomEvent).detail === 'denied' && window.fbq) window.fbq('consent', 'revoke');
    onChange();
  };
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}
const isGranted = () => getConsent() === 'granted';
const serverSnapshot = () => false;

export default function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const granted = useSyncExternalStore(subscribe, isGranted, serverSnapshot);

  // İlk açılışta ve her rota değişiminde PageView
  const search = searchParams.toString();
  useEffect(() => {
    if (!granted || !PIXEL_ID) return;
    if (ensurePixel()) track('PageView');
  }, [granted, pathname, search]);

  return null;
}
