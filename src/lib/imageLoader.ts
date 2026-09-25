'use client';

import { R2_PUBLIC_BASE, pickVariantWidth, variantKey } from './r2-url';

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
    return `${R2_PUBLIC_BASE}/${variantKey(key, pickVariantWidth(width))}`;
  }

  const match = src.match(CLOUDINARY_UPLOAD);
  if (!match) return src;

  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality ?? 'auto'}`];
  return `${match[1]}${params.join(',')}/${match[2]}`;
}
