/**
 * Meta Pixel + Conversions API — istemci ve sunucu ortak kurallar.
 * Bu dosyaya gizli değer KOYMAYIN; istemci paketine girer.
 * Genel tasarım: wiki/buyume/Meta-Pixel-ve-CAPI.md
 */

/** Pazarlama çerezi onayı. Değer: 'granted' | 'denied'. Yoksa henüz sorulmamış. */
export const CONSENT_COOKIE = 'ebruca_consent';
/** Onay değişince window'a gönderilen olay (MetaPixel dinler). */
export const CONSENT_EVENT = 'ebruca-consent';

export type ConsentValue = 'granted' | 'denied';

/** CAPI köprüsünün (/api/meta/event) kabul ettiği olaylar. */
export const BRIDGED_EVENTS = ['AddToCart', 'InitiateCheckout'] as const;
export type BridgedEvent = (typeof BRIDGED_EVENTS)[number];

// ---------------------------------------------------------------------------
// Ortam koruması: Meta YALNIZCA canlıda çalışır
// ---------------------------------------------------------------------------

/** Canlı alan adları — preview deploy'lar ve localhost bunlarla eşleşmez. */
const PRODUCTION_HOSTS = ['ebruca.com', 'www.ebruca.com'];

/** Test için geçici açma anahtarı (localhost/preview'da). Canlıya geçişte KAPATIN. */
export const META_FORCE_ENABLE = process.env.NEXT_PUBLIC_META_FORCE_ENABLE === 'true';

/**
 * Meta bu ortamda çalışmalı mı?
 * - Sunucu: VERCEL_ENV === 'production'
 * - Tarayıcı: NEXT_PUBLIC_VERCEL_ENV === 'production' veya canlı alan adı
 *   (Vercel sistem env'i build'e açılmamışsa da canlıda çalışsın diye)
 * - Admin paneli (/admin) hiçbir koşulda
 */
export function metaEnvironmentAllowed(pathname?: string): boolean {
  if (pathname?.startsWith('/admin')) return false;
  if (META_FORCE_ENABLE) return true;
  if (typeof window === 'undefined') return process.env.VERCEL_ENV === 'production';
  return (
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
    PRODUCTION_HOSTS.includes(window.location.hostname)
  );
}

// ---------------------------------------------------------------------------
// Ürün kimliği ve tutar — TÜM olaylar bu iki helper'dan geçer
// ---------------------------------------------------------------------------

/**
 * Meta'daki ürün kimliği = ürünün KALICI veritabanı kimliği (Product.id, cuid).
 *
 * VARYANT DEĞİL, ÜRÜN kimliği: renk/beden ayrı kimlik almaz. Product.code
 * (SKU) elle girildiği ve değişebildiği için kullanılmadı. İleride kurulacak
 * Meta ürün kataloğunda her ürünün `id` alanı da Product.id olmalı
 * (wiki/buyume/Katalog-ve-Dinamik-Reklam.md).
 */
export function metaContentId(productId: string): string {
  return productId;
}

/** Tutar: her zaman number, 2 ondalık. */
export function metaValue(n: number): number {
  return Math.round(n * 100) / 100;
}

/*
 * TUTAR KURALI — tüm olaylarda aynı: value = ÜRÜN TUTARI, KARGO HARİÇ.
 *   ViewContent / AddToCart : ürün fiyatı
 *   InitiateCheckout        : sepet ara toplamı
 *   Purchase                : Order.subtotal (kargo hariç; taksit vade farkı da hariç)
 * Kargo tarayıcıda bilinmiyor (sunucuda hesaplanıyor); hepsinde aynı tanımı
 * kullanmak için kargo hariç seçildi.
 */

export interface MetaContent {
  id: string;
  quantity: number;
  item_price: number;
}

/** Tarayıcı ve sunucunun AYNI değeri kullandığı Purchase event_id'si (tekilleştirme). */
export function purchaseEventId(orderNo: string): string {
  return `purchase_${orderNo}`;
}

// ---------------------------------------------------------------------------
// Normalizasyon (Advanced Matching ve CAPI ortak)
// ---------------------------------------------------------------------------

const TR_FOLD: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };

export const normEmail = (v?: string | null) => (v ?? '').trim().toLowerCase();
export const normName = (v?: string | null) => (v ?? '').trim().toLocaleLowerCase('tr-TR');

/** Şehir: küçük harf, Latin a-z, boşluksuz (Meta önerisi). */
export const normCity = (v?: string | null) =>
  normName(v).replace(/[çğıöşüâîû]/g, c => TR_FOLD[c] ?? c).replace(/[^a-z]/g, '');

/** Telefon → E.164 rakamları, Türkiye için "90" önekli (ör. 905321234567). */
export function normPhone(raw?: string | null): string {
  let d = (raw ?? '').replace(/\D/g, '');
  if (d.startsWith('0090')) d = d.slice(2);
  if (d.startsWith('0')) d = '90' + d.slice(1);
  if (d.length === 10 && d.startsWith('5')) d = '90' + d;
  return d;
}

/** _fbc biçimi: fb.1.<ms>.<fbclid> */
export const FBC_RE = /^fb\.1\.\d{10,}\.[\w-]{10,500}$/;
export const FBP_RE = /^fb\.1\.\d{10,}\.\d{5,}$/;
