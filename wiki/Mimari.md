---
tags: [genel]
---

# Mimari

Next.js 16 (App Router) + React 19 + TypeScript, Tailwind v4, Prisma 7. Veritabanı yerelde SQLite, canlıda Turso (libSQL). Barındırma Vercel'de. Kod, yorumlar ve route isimleri Türkçe.

> Next.js 16'da API'ler eğitim verisindekinden farklı olabilir (örneğin `middleware` yerine `src/proxy.ts`). Kod yazmadan önce `node_modules/next/dist/docs/` okunmalı.

## Dizinler

| Yol | İçerik |
|---|---|
| `src/app/` | Sayfalar ve `api/` route'ları |
| `src/app/admin/` | Admin paneli → [[Admin-Paneli]] |
| `src/components/` | `home/` (anasayfa blokları), `layout/` (Header, Footer, AnnouncementBar, CookieBanner), `ui/` (ProductCard, FilterPanel), `admin/` |
| `src/lib/` | İş mantığı (aşağıda) |
| `src/generated/prisma/` | Üretilmiş Prisma client, **git'te** (Vercel build'i için) |
| `prisma/` | `schema.prisma`, `manual/` (canlı SQL) → [[Veritabani]] |
| `src/proxy.ts` | `/admin/*` koruması (Next 16'da middleware'in adı) |

## `src/lib/` haritası

| Dosya | Ne yapar | Not |
|---|---|---|
| `stock.ts` | Stok kuralı | [[Stok]] |
| `cart-context.tsx` | Sepet | [[Sepet]] |
| `iyzico.ts` | Iyzico REST client | [[Odeme-ve-Siparis]] |
| `auth.ts`, `use-session.ts`, `admin-auth.ts` | Üyelik ve admin yetkisi | [[Uyelik]] |
| `email.ts` | Tüm e-posta şablonları | [[E-posta]] |
| `storage.ts`, `imageLoader.ts`, `r2.ts`, `r2-url.ts` | Görsel yükleme (R2) ve URL/sürüm seçimi | [[Gorseller]] |
| `compress-image.ts` | Admin yüklemesinden önce tarayıcıda küçültme / HEIC→JPEG | [[Gorseller]] |
| `revalidate.ts` | ISR sayfalarını hedefli yenileme | [[Vitrin-ve-Urunler]] |
| `meta/` | Meta Pixel + CAPI, çerez onayı | [[Meta-Pixel-ve-CAPI]] |
| `seo.ts` | Site sabitleri | [[SEO]] |
| `company.ts` | Şirket ve yasal bilgiler (tek kaynak) | |
| `data.ts` | **Kategoriler kodda sabit** (DB'de değil) | [[Vitrin-ve-Urunler]] |
| `db-helpers.ts` | Ürün sorguları, JSON alanları parse eder | |
| `products-display.ts` | Renk bazlı kart genişletme | [[Vitrin-ve-Urunler]] |
| `rate-limit.ts` | Bellek içi IP sınırı | |
| `order-status.ts` | Durum etiketleri ve renkleri | |

## Müşteri sayfaları

`/` · `/tumurunler` · `/kategori/[slug]` · `/urun/[slug]` · `/sepet` · `/odeme` · `/siparis-tamamlandi` · `/siparis-sorgula` · `/giris` · `/kayit` · `/hesabim` · `/sifre-sifirla` · `/sifre-yenile` · `/iletisim` · `/sss`

Yasal: `/kvkk` · `/gizlilik` · `/cerez` · `/mesafeli-satis` · `/iade-iptal` · `/teslimat` · `/uyelik-sozlesmesi` · `/hakkimizda`

## Tasarım kararları

- **Kök layout statiktir.** Oturum bilgisi istemcide `use-session.ts` ile alınır. Layout'ta `cookies()` okunursa tüm site dinamik render'a düşer. Meta Pixel gibi scriptler eklenirken de bu korunmalı → [[Meta-Pixel-ve-CAPI]]
- Fiyat, kargo ve stok **daima sunucuda** hesaplanır.
- **Vitrin ISR ile CDN'den sunulur** (`revalidate = 86400`, değişiklikte `revalidateVitrin(slugs)`), `force-dynamic` yok. Vercel **Hobby** takımı 20+ projeyle kotayı paylaşıyor; bu kararlar kota yüzünden → [[Olaylar-ve-Dersler]]
- **Vitrin linklerinde `prefetch={false}`** — varsayılan ön yükleme sayfa başına ~100 Edge Request yapıyordu.
- Cevaptan sonra yapılacak işler (e-posta, CAPI) **`after()`** ile — await edilmeyen promise Vercel'de yarıda kesilebilir.
