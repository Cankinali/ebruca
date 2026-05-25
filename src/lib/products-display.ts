import { Product } from './types';

/**
 * Listede görünen ürün. Birden fazla renkli ürünler her renk için
 * ayrı bir DisplayProduct olarak genişletilir.
 */
export interface DisplayProduct extends Product {
  displayColor?: string;       // bu kartın gösterdiği renk
  displayKey: string;          // React key (id veya id-color)
  displayImage?: string;       // bu kartta gösterilecek ana fotoğraf
}

/**
 * Çoklu renkli ürünleri her renk için ayrı bir karta dönüştürür.
 * - 0 veya 1 renkli ürünler → 1 kart (eski davranış)
 * - 2+ renkli ürünler → her renk için 1 kart (toplam N kart)
 */
export function expandProductsByColor(products: Product[]): DisplayProduct[] {
  const out: DisplayProduct[] = [];
  for (const p of products) {
    const colors = p.colors ?? [];
    if (colors.length <= 1) {
      out.push({ ...p, displayKey: p.id });
      continue;
    }
    for (const color of colors) {
      const colorPics = p.colorImages?.[color] ?? [];
      const displayImage = colorPics[0] || p.images[0];
      out.push({
        ...p,
        displayColor: color,
        displayKey: `${p.id}-${color}`,
        displayImage,
      });
    }
  }
  return out;
}
