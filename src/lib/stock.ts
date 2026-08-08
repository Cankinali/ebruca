/**
 * Stok kuralının TEK kaynağı.
 *
 * Ürünlerde stok iki yerde tutulabiliyor:
 *   - sizeStock       → { "M": 3 }                 (renkten bağımsız)
 *   - colorSizeStock  → { "Kırmızı": { "M": 3 } }  (renk bazlı)
 *
 * Kural: seçili renge ait dolu bir stok tablosu varsa o geçerlidir, yoksa düz
 * sizeStock kullanılır. Bu kural daha önce üç ayrı yerde (ürün sayfası, ödeme
 * öncesi kontrol, ödeme sonrası stok düşümü) ayrı ayrı yazılmıştı ve ödeme
 * öncesi kontrol düz stoğa baktığı için renk bazlı ürünlerde stok denetimi
 * tamamen atlanıyordu. Üçü de artık buradaki fonksiyonları kullanır.
 */

export interface StockSource {
  sizeStock?: Record<string, number>;
  colorSizeStock?: Record<string, Record<string, number>>;
}

export type StockOrigin = 'variant' | 'flat';

export interface ResolvedStock {
  /** Seçili renk için geçerli beden→adet tablosu. */
  sizeStock: Record<string, number>;
  /** Tablonun hangi kaynaktan geldiği — stok düşerken doğru yeri güncellemek için. */
  origin: StockOrigin;
}

/** Seçili renk için geçerli stok tablosunu döner. */
export function resolveStock(product: StockSource, color?: string): ResolvedStock {
  const variant = color ? product.colorSizeStock?.[color] : undefined;

  if (variant && Object.keys(variant).length > 0) {
    return { sizeStock: variant, origin: 'variant' };
  }
  return { sizeStock: product.sizeStock ?? {}, origin: 'flat' };
}

/**
 * Belirli bir renk+beden için satılabilir adet.
 *
 * `null` → bu ürün için stok takibi yapılmıyor (tablo boş); adet sınırı yok.
 * `0`    → tükendi ya da bu beden tabloda tanımlı değil.
 */
export function availableStock(
  product: StockSource,
  color: string | undefined,
  size: string
): number | null {
  const { sizeStock } = resolveStock(product, color);

  // Tablo tamamen boşsa stok girilmemiş demektir — kısıt uygulama.
  if (Object.keys(sizeStock).length === 0) return null;

  return sizeStock[size] ?? 0;
}

/** İstenen adet karşılanabiliyor mu? Stok takibi yoksa daima true. */
export function hasEnoughStock(
  product: StockSource,
  color: string | undefined,
  size: string,
  quantity: number
): boolean {
  const available = availableStock(product, color, size);
  return available === null || available >= quantity;
}

/**
 * Satış sonrası stok düşer ve güncellenmiş iki tabloyu birlikte döner.
 * Hangi tablodan düşüleceğini resolveStock belirler; böylece ödeme öncesi
 * kontrol edilen sayı ile düşülen sayı daima aynı kaynaktan olur.
 */
export function decrementStock(
  product: StockSource,
  color: string | undefined,
  size: string,
  quantity: number
): { sizeStock: Record<string, number>; colorSizeStock: Record<string, Record<string, number>> } {
  const sizeStock = { ...(product.sizeStock ?? {}) };
  const colorSizeStock: Record<string, Record<string, number>> = {};
  for (const [c, sizes] of Object.entries(product.colorSizeStock ?? {})) {
    colorSizeStock[c] = { ...sizes };
  }

  const { origin } = resolveStock(product, color);

  if (origin === 'variant' && color) {
    const variant = colorSizeStock[color];
    if (variant && variant[size] !== undefined) {
      variant[size] = Math.max(0, variant[size] - quantity);
    }
  } else if (sizeStock[size] !== undefined) {
    sizeStock[size] = Math.max(0, sizeStock[size] - quantity);
  }

  return { sizeStock, colorSizeStock };
}

/** Tüm renkler + düz stoğun toplamı. */
export function totalStock(product: StockSource): number {
  const flat = Object.values(product.sizeStock ?? {}).reduce((a, b) => a + b, 0);
  const variants = Object.values(product.colorSizeStock ?? {}).reduce(
    (sum, sizes) => sum + Object.values(sizes).reduce((a, b) => a + b, 0),
    0
  );
  return flat + variants;
}

export type StockLevel = 'in_stock' | 'low_stock' | 'out_of_stock';

/** Toplam adede göre Product.stock etiketi. */
export function stockLevel(total: number): StockLevel {
  if (total === 0) return 'out_of_stock';
  if (total <= 3) return 'low_stock';
  return 'in_stock';
}
