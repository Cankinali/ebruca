'use client';

import { getConsent } from './consent-client';
import type { BridgedEvent } from './shared';

/**
 * Meta Pixel — tarayıcı tarafı.
 *
 * Onay yoksa HİÇBİR ŞEY yapmaz: script yüklenmez, olay gönderilmez.
 * Pixel ID tanımlı değilse (NEXT_PUBLIC_META_PIXEL_ID) de sessizce no-op.
 */

export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export type PixelEvent = 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase';

export function pixelEnabled(): boolean {
  return Boolean(PIXEL_ID) && getConsent() === 'granted';
}

/**
 * fbq'yu kurar ve fbevents.js'i yükler (Meta'nın resmi snippet'inin aynısı).
 * Birden çok çağrı güvenli. Script yüklenene kadar olaylar kuyrukta bekler,
 * böylece sayfa açılır açılmaz atılan ViewContent kaybolmaz.
 */
export function ensurePixel(): boolean {
  if (!pixelEnabled()) return false;
  if (window.fbq) return true;

  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue.push(args);
  } as Fbq;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];
  window.fbq = n;
  if (!window._fbq) window._fbq = n;

  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);

  n('init', PIXEL_ID);
  return true;
}

export function newEventId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Pixel olayı. eventId verilirse CAPI'deki aynı olayla tekilleştirilir. */
export function track(event: PixelEvent, params: Record<string, unknown> = {}, eventId?: string) {
  if (!ensurePixel()) return;
  window.fbq!('track', event, params, eventId ? { eventID: eventId } : undefined);
}

/**
 * Olayı hem Pixel'e hem (aynı eventId ile) sunucu üzerinden CAPI'ye gönderir.
 * Sunucu çağrısı sayfa değişse de tamamlansın diye keepalive; hata yutulur.
 */
export function trackWithServer(event: BridgedEvent, params: Record<string, unknown>) {
  if (!pixelEnabled()) return;
  const eventId = newEventId();
  track(event, params, eventId);
  fetch('/api/meta/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventName: event, eventId, eventSourceUrl: location.href, customData: params }),
    keepalive: true,
  }).catch(() => {});
}
