/**
 * Görsel yükleme soyutlaması.
 *
 * STORAGE_PROVIDER env'ine göre çalışır:
 *  - 'r2'         → Cloudflare R2'ye orijinal + WebP sürümleri (canlı ortam, hedef)
 *  - 'cloudinary' → Cloudinary'ye yükler (eski canlı ortam, bkz. R2_TASIMA.md)
 *  - diğer       → public/uploads/'a yazar (yerel geliştirme)
 */

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { putImageWithVariants } from './r2';
import { R2_PUBLIC_BASE } from './r2-url';

export interface UploadResult {
  url: string;
  publicId?: string;
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadImage(file: File): Promise<UploadResult> {
  const provider = process.env.STORAGE_PROVIDER ?? 'local';

  if (provider === 'r2') {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    const key = `ebruca/products/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    await putImageWithVariants(key, buffer, file.type);
    return { url: `${R2_PUBLIC_BASE}/${key}` };
  }

  if (provider === 'cloudinary') {
    configureCloudinary();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'ebruca/products',
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good', fetch_format: 'auto' },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  // === Local disk ===
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name).toLowerCase() || '.jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return { url: `/uploads/${filename}` };
}
