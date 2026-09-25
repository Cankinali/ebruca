/**
 * Cloudflare R2 yazma işlemleri (yalnızca sunucu / script).
 *
 * Hem admin yüklemesi (lib/storage.ts) hem de Cloudinary → R2 senkron
 * script'i (scripts/r2-senkron.mts) sürümleri buradan üretir; adlandırma
 * kuralı tek yerde kalsın diye.
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { R2_VARIANT_WIDTHS, variantKey } from './r2-url';

let client: S3Client | null = null;

export function r2Client(): S3Client {
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return client;
}

export function r2Bucket(): string {
  const bucket = process.env.R2_BUCKET;
  if (!bucket) throw new Error('R2_BUCKET tanımlı değil');
  return bucket;
}

// Görseller adreslerine göre değişmez (yeni yükleme = yeni ad), uzun önbellek güvenli.
const CACHE_CONTROL = 'public, max-age=31536000, immutable';

export async function putObject(key: string, body: Buffer, contentType: string) {
  await r2Client().send(new PutObjectCommand({
    Bucket: r2Bucket(),
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: CACHE_CONTROL,
  }));
}

/**
 * Bir sürümü üretir. Görsel istenen genişlikten darsa büyütülmez ama sürüm
 * yine de yazılır — loader her sürümün var olduğunu varsayar, eksik = 404.
 */
export async function renderVariant(original: Buffer, width: number): Promise<Buffer> {
  return sharp(original)
    .rotate() // EXIF yönünü uygula (telefon fotoğrafları yan dönmesin)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}

/** Orijinali ve tüm genişlik sürümlerini yükler. */
export async function putImageWithVariants(key: string, original: Buffer, contentType: string) {
  await putObject(key, original, contentType);
  await Promise.all(R2_VARIANT_WIDTHS.map(async w => {
    await putObject(variantKey(key, w), await renderVariant(original, w), 'image/webp');
  }));
}
