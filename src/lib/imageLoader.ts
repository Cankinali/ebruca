'use client';

import { R2_PUBLIC_BASE, pickVariantWidth, variantKey } from './r2-url';

// GEÇİCİ — bkz. next.config.ts rewrites. true iken R2 görselleri kendi
// alan adımızdaki /r2/ yolundan istenir (DNS yayılımı bitene kadar).
const R2_VIA_PROXY = true;

// Cloudinary olmayan kaynaklar (ör. lokal geliştirmedeki /uploads/...) dönüşümsüz geçer.
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // R2: dönüşüm sunucusu yok; önceden üretilmiş 400/800/1200 WebP sürümlerinden
  // istenen genişliği karşılayanı seç (bkz. lib/r2-url.ts).
  if (src.startsWith(`${R2_PUBLIC_BASE}/`)) {
    const key = src.slice(R2_PUBLIC_BASE.length + 1);
    const variant = variantKey(key, pickVariantWidth(width));
    return R2_VIA_PROXY ? `/r2/${variant}` : `${R2_PUBLIC_BASE}/${variant}`;
  }

  const match = src.match(CLOUDINARY_UPLOAD);
  if (!match) return src;

  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality ?? 'auto'}`];
  return `${match[1]}${params.join(',')}/${match[2]}`;
}
