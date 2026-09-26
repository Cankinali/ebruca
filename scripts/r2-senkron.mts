/**
 * Cloudinary → R2 senkronu (bkz. R2_TASIMA.md).
 *
 * Canlı veritabanındaki (Product, OrderItem) ve kodda sabit yazılı her Cloudinary görseli için
 * R2'de orijinal + 400/800/1200 WebP sürümlerinin hepsi var mı bakar, eksik
 * olanları tamamlar. Tekrar çalıştırılabilir: var olana dokunmaz.
 *
 * Orijinal önce yerel yedekten (backups/cloudinary-2026-08-29/) okunur,
 * yoksa Cloudinary'den indirilir.
 *
 *   npx tsx scripts/r2-senkron.mts            → yalnızca rapor
 *   npx tsx scripts/r2-senkron.mts --uygula   → eksikleri R2'ye yükle
 *
 * Veritabanındaki URL'ler değişmeden hemen önce bir kez daha çalıştırılmalı:
 * o ana kadar admin panelinden Cloudinary'ye yeni görsel yüklenmiş olabilir.
 */

import { config } from 'dotenv';
import { readFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { createClient } from '@libsql/client';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

config({ path: '.env' }); // R2_*
config({ path: '.env.production.local', override: true }); // canlı Turso

const { r2Client, r2Bucket, putObject, renderVariant } = await import('../src/lib/r2');
const { R2_VARIANT_WIDTHS, variantKey } = await import('../src/lib/r2-url');

const UYGULA = process.argv.includes('--uygula');
const YEDEK = 'backups/cloudinary-2026-08-29';
const CLOUDINARY = /https:\/\/res\.cloudinary\.com\/[^/"'\s]+\/image\/upload\/(?:v\d+\/)?([^"'\s]+\.[a-z0-9]+)/gi;

// 1) Canlı veritabanındaki görseller
const db = createClient({ url: process.env.DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN });
if (!process.env.DATABASE_URL?.startsWith('libsql://')) throw new Error('Canlı Turso bilgisi okunamadı');
const rows = (await db.execute('select images, colorImages from Product')).rows;

const urls = new Map<string, string>(); // key → cloudinary url
const collect = (text: string) => {
  for (const m of text.matchAll(CLOUDINARY)) urls.set(m[1], m[0]);
};
for (const r of rows) collect(`${r.images} ${r.colorImages}`);
// Sipariş kalemleri: silinmiş ürünlerin görselleri yalnızca burada kalmış olabilir
for (const r of (await db.execute('select image from OrderItem')).rows) collect(String(r.image ?? ''));

// 2) Kodda sabit yazılı olanlar (HeroBanner, kategori görselleri …)
async function scan(dir: string) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'generated') await scan(p); }
    else if (/\.(tsx?|css)$/.test(e.name)) collect(await readFile(p, 'utf8'));
  }
}
await scan('src');

// 3) R2'de ne var
const existing = new Set<string>();
let token: string | undefined;
do {
  const res = await r2Client().send(new ListObjectsV2Command({ Bucket: r2Bucket(), ContinuationToken: token }));
  res.Contents?.forEach(o => existing.add(o.Key!));
  token = res.NextContinuationToken;
} while (token);

// 4) Eksikler
const plan = [...urls].map(([key, url]) => ({
  key,
  url,
  missing: [key, ...R2_VARIANT_WIDTHS.map(w => variantKey(key, w))].filter(k => !existing.has(k)),
})).filter(p => p.missing.length > 0);

console.log(`Görsel: ${urls.size} · R2 nesne: ${existing.size} · eksiği olan: ${plan.length}`);
const tamamenYok = plan.filter(p => p.missing.includes(p.key)).length;
console.log(`  orijinali hiç yok: ${tamamenYok} · yalnızca sürümü eksik: ${plan.length - tamamenYok}`);

if (!UYGULA) {
  plan.slice(0, 10).forEach(p => console.log('  ', p.key, '→', p.missing.length, 'eksik'));
  console.log('\nRapor modu. Yüklemek için: --uygula');
  process.exit(0);
}

const CONTENT_TYPES: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' };
// Cloudinary ardışık isteklerde ara sıra bağlantıyı düşürüyor ("fetch failed").
async function indir(url: string, deneme = 3): Promise<Buffer> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Cloudinary ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    if (deneme <= 1) throw err;
    await new Promise(r => setTimeout(r, 2000));
    return indir(url, deneme - 1);
  }
}

let ok = 0;
const hatalar: string[] = [];
for (const [i, p] of plan.entries()) {
  try {
    const local = path.join(YEDEK, p.key);
    let original: Buffer;
    if (existsSync(local)) {
      original = await readFile(local);
    } else {
      original = await indir(p.url);
    }
    for (const k of p.missing) {
      if (k === p.key) {
        const ext = p.key.split('.').pop()!.toLowerCase();
        await putObject(k, original, CONTENT_TYPES[ext] ?? 'application/octet-stream');
      } else {
        const w = Number(k.match(/-(\d+)\.webp$/)![1]);
        await putObject(k, await renderVariant(original, w), 'image/webp');
      }
    }
    ok++;
    if ((i + 1) % 20 === 0) console.log(`  ${i + 1}/${plan.length}`);
  } catch (err) {
    hatalar.push(`${p.key}: ${err}`);
  }
}
console.log(`Tamamlanan: ${ok}/${plan.length}`);
if (hatalar.length) { console.log('HATALAR:'); hatalar.forEach(h => console.log('  ', h)); process.exitCode = 1; }
