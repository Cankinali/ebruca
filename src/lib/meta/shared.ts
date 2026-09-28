/**
 * Meta Pixel + Conversions API — istemci ve sunucu ortak sabitleri.
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

/**
 * Meta'daki ürün kimliği. Renk varyantları ayrı kart olarak listelendiği
 * için (lib/products-display.ts → displayKey) kimlik de "id-renk" biçiminde;
 * ileride kurulacak katalog feed'i de AYNI biçimi kullanmalı
 * (wiki/buyume/Katalog-ve-Dinamik-Reklam.md).
 */
export function metaContentId(productId: string, color?: string | null): string {
  return color ? `${productId}-${color}` : productId;
}

export interface MetaContent {
  id: string;
  quantity: number;
  item_price: number;
}

/** Tarayıcı ve sunucunun AYNI değeri kullandığı Purchase event_id'si (tekilleştirme). */
export function purchaseEventId(orderNo: string): string {
  return `purchase_${orderNo}`;
}
