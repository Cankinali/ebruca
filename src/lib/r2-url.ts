/**
 * R2 görsel adresleri — istemci ve sunucu ortak (bağımlılıksız).
 *
 * Kovada her görsel için orijinal + genişlik sürümleri durur:
 *   ebruca/products/abc.jpg        (orijinal)
 *   ebruca/products/abc-400.webp
 *   ebruca/products/abc-800.webp
 *   ebruca/products/abc-1200.webp
 * Veritabanında orijinalin adresi saklanır; sürümü imageLoader seçer.
 */

export const R2_PUBLIC_BASE = (process.env.NEXT_PUBLIC_R2_PUBLIC_BASE || 'https://cdn.ebruca.com').replace(/\/$/, '');

export const R2_VARIANT_WIDTHS = [400, 800, 1200] as const;

/** "ebruca/products/abc.jpg" → "ebruca/products/abc-800.webp" */
export function variantKey(originalKey: string, width: number): string {
  return `${originalKey.replace(/\.[a-z0-9]+$/i, '')}-${width}.webp`;
}

/** İstenen genişliği karşılayan en küçük sürüm; hiçbiri yetmiyorsa en büyüğü. */
export function pickVariantWidth(width: number): number {
  return R2_VARIANT_WIDTHS.find(w => w >= width) ?? R2_VARIANT_WIDTHS[R2_VARIANT_WIDTHS.length - 1];
}
