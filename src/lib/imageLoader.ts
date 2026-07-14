'use client';

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
  const match = src.match(CLOUDINARY_UPLOAD);
  if (!match) return src;

  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality ?? 'auto'}`];
  return `${match[1]}${params.join(',')}/${match[2]}`;
}
