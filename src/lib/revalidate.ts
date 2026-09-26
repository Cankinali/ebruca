import { revalidatePath } from 'next/cache';

/**
 * Vitrin sayfaları (anasayfa, tüm ürünler, kategori, ürün detayı) ISR ile
 * CDN'de önbelleklenir ve günde bir kendiliğinden yenilenir. Ürün, fiyat veya
 * stok değiştiğinde bu çağrılır; sayfalar hemen değil, bir sonraki ziyarette
 * yeniden üretilir.
 *
 * Bilerek HEDEFLİ: yalnızca değişen ürünlerin sayfası + listeler yenilenir.
 * Tüm siteyi geçersiz kılmak her admin kaydında ~200 sayfayı yeniden
 * ürettiriyordu ve Hobby planının Active CPU kotasını yiyordu (26.09.2026).
 * Bedeli: diğer ürün sayfalarındaki "çok satanlar" bloğu en geç 1 gün eski kalabilir.
 */
export function revalidateVitrin(productSlugs: string[] = []) {
  revalidatePath('/');
  revalidatePath('/tumurunler');
  revalidatePath('/kategori/[slug]', 'page');
  for (const slug of new Set(productSlugs)) revalidatePath(`/urun/${slug}`);
}
