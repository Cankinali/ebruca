'use client';

import { CONSENT_COOKIE, CONSENT_EVENT, type ConsentValue } from './shared';

/**
 * Pazarlama çerezi onayı — tarayıcı tarafı.
 *
 * Çerezde tutulur (localStorage değil) ki sunucu da görebilsin:
 * /api/meta/event ve /api/odeme/baslat onay yoksa Meta'ya hiçbir şey göndermez.
 */
export function getConsent(): ConsentValue | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
  const v = m?.[1];
  return v === 'granted' || v === 'denied' ? v : null;
}

export function setConsent(value: ConsentValue) {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  // 1 yıl — KVKK rehberi onayın makul aralıklarla yeniden sorulmasını önerir
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${365 * 24 * 60 * 60}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
