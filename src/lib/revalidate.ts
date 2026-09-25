import { revalidatePath } from 'next/cache';

/**
 * Vitrin sayfaları (anasayfa, tüm ürünler, kategori, ürün detayı) ISR ile
 * CDN'de önbelleklenir. Ürün, fiyat veya stok değiştiğinde bu çağrılır.
 *
 * Tek tek yol hesaplamak yerine kökten tüm sayfalar geçersiz kılınır: ürün
 * sayfaları "çok satanlar" listesini de gösterdiği için bir üründeki
 * değişiklik diğer ürün sayfalarını da etkiler. Sayfalar hemen değil,
 * bir sonraki ziyarette yeniden üretilir.
 */
export function revalidateVitrin() {
  revalidatePath('/', 'layout');
}
