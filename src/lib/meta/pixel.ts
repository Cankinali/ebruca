'use client';

import { getConsent } from './consent-client';
import {
  metaEnvironmentAllowed,
  normCity,
  normEmail,
  normName,
  normPhone,
  FBC_RE,
  FBP_RE,
  type BridgedEvent,
} from './shared';

/**
 * Meta Pixel — tarayıcı tarafı.
 *
 * Hiçbir şey yapmadığı durumlar: pazarlama onayı yok, Pixel ID yok, canlı
 * ortam değil (localhost / preview) ya da /admin rotası.
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
  return (
    Boolean(PIXEL_ID) &&
    getConsent() === 'granted' &&
    metaEnvironmentAllowed(window.location.pathname)
  );
}

// ---------------------------------------------------------------------------
// Advanced Matching — düz ama normalize değerler; Pixel kendisi hash'ler
// ---------------------------------------------------------------------------

export interface MatchingInput {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
}

let matching: Record<string, string> = {};

function buildMatching(u: MatchingInput): Record<string, string> {
  const out: Record<string, string> = {};
  const em = normEmail(u.email);
  if (em) out.em = em;
  const ph = normPhone(u.phone);
  if (ph) out.ph = ph;
  const fn = normName(u.firstName);
  if (fn) out.fn = fn;
  const ln = normName(u.lastName);
  if (ln) out.ln = ln;
  const ct = normCity(u.city);
  if (ct) out.ct = ct;
  if (Object.keys(out).length) out.country = 'tr';
  return out;
}

/**
 * Giriş yapmış kullanıcı (Header) ya da ödeme formu bilgisiyle çağrılır.
 * Pixel zaten yüklüyse Meta'nın önerdiği gibi yeniden init edilir.
 */
export function setAdvancedMatching(u: MatchingInput) {
  const next = buildMatching(u);
  if (!Object.keys(next).length) return;
  if (JSON.stringify(next) === JSON.stringify(matching)) return;
  matching = next;
  if (window.fbq && pixelEnabled()) window.fbq('init', PIXEL_ID, matching);
}

// ---------------------------------------------------------------------------
// Kurulum
// ---------------------------------------------------------------------------

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

  // Advanced Matching bilgisi varsa init'te, yoksa boş init
  if (Object.keys(matching).length) n('init', PIXEL_ID, matching);
  else n('init', PIXEL_ID);
  return true;
}

// ---------------------------------------------------------------------------
// fbclid → _fbc (Instagram / Facebook uygulama içi tarayıcı)
// ---------------------------------------------------------------------------

const FBC_MAX_AGE = 90 * 24 * 60 * 60;

/**
 * Reklamdan gelen ziyaretçinin URL'indeki fbclid'i 90 günlük _fbc çerezine
 * yazar (Meta biçimi: fb.1.<ms>.<fbclid>). Pixel de bunu yapar ama uygulama
 * içi tarayıcılarda script geç yüklenebiliyor; biz ilk sayfada garantiye
 * alıyoruz. Aynı fbclid için çerez yeniden yazılmaz. Yalnızca onayla.
 * Checkout'ta bu değer siparişe de kaydedilir (Order.metaFbc) — çerez
 * kısıtlı tarayıcılarda da Purchase eşleşsin diye.
 */
export function captureFbclid() {
  if (!pixelEnabled()) return;
  const fbclid = new URLSearchParams(window.location.search).get('fbclid');
  if (!fbclid || !/^[\w-]{10,500}$/.test(fbclid)) return;
  const current = readCookie('_fbc');
  if (current.endsWith(`.${fbclid}`)) return;
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `_fbc=fb.1.${Date.now()}.${fbclid}; Max-Age=${FBC_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

function readCookie(name: string): string {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : '';
}

/**
 * Ödeme başlatılırken sunucuya giden _fbp/_fbc. Sunucu önce kendi çerez
 * başlığına bakar; uygulama içi tarayıcı çerezi göndermediyse bu kullanılır.
 */
export function metaBrowserIds(): { fbp: string; fbc: string } {
  if (!pixelEnabled()) return { fbp: '', fbc: '' };
  const fbp = readCookie('_fbp');
  const fbc = readCookie('_fbc');
  return { fbp: FBP_RE.test(fbp) ? fbp : '', fbc: FBC_RE.test(fbc) ? fbc : '' };
}

// ---------------------------------------------------------------------------
// Olaylar
// ---------------------------------------------------------------------------

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
