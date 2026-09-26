'use client';

/**
 * Admin görsel yüklemesinden önce tarayıcıda küçültme.
 *
 * Vercel bir isteğin gövdesini 4,5 MB ile sınırlar; aşan istek koda hiç
 * ulaşmadan 413 döner. Telefon/Mac fotoğrafları bu sınırı kolayca geçer ve
 * Mac Safari HEIC gönderebilir (sunucu kabul etmez). Bu yüzden büyük ya da
 * desteklenmeyen dosyalar en uzun kenarı MAX_SIDE olacak şekilde JPEG'e
 * çevrilir. Sitede en büyük 1200px sürüm gösterildiği için kayıp görünmez.
 */

const MAX_SIDE = 2400;
const PASSTHROUGH_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const PASSTHROUGH_MAX_BYTES = 3 * 1024 * 1024;
const TARGET_MAX_BYTES = 4 * 1024 * 1024;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Görsel okunamadı')); };
    img.src = url;
  });
}

function toJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Görsel dönüştürülemedi'))), 'image/jpeg', quality)
  );
}

export async function compressImage(file: File): Promise<File> {
  if (PASSTHROUGH_TYPES.includes(file.type) && file.size <= PASSTHROUGH_MAX_BYTES) return file;

  const img = await loadImage(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Görsel dönüştürülemedi');
  // Tarayıcılar EXIF yönünü çizimde uygular (image-orientation: from-image varsayılan)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  let blob = await toJpeg(canvas, 0.85);
  for (const q of [0.75, 0.65]) {
    if (blob.size <= TARGET_MAX_BYTES) break;
    blob = await toJpeg(canvas, q);
  }

  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], name, { type: 'image/jpeg' });
}

/** Yükleme cevabından okunabilir hata mesajı (413 JSON değildir). */
export async function uploadErrorMessage(res: Response): Promise<string> {
  if (res.status === 413) return 'Görsel çok büyük (en fazla 4 MB).';
  try {
    const j = await res.json();
    if (j?.error) return j.error;
  } catch { /* JSON değil */ }
  return `Görsel yüklenemedi (${res.status}).`;
}
