---
tags: [genel, kritik]
---

# Deploy ve Canlı Ortam

- **Barındırma:** Vercel (git push ile otomatik deploy). Geri alma için Vercel **Instant Rollback** kullanılır.
- **Cron:** `vercel.json`, her gün 06:00 UTC → [[Gunluk-Bakim]]
- **DNS:** **Cloudflare** (26.09.2026'dan beri; nameserver `celine` / `seth.ns.cloudflare.com`). Alan adı kaydı hâlâ Hostinger'da — Hostinger panelinde DNS artık DÜZENLENEMEZ. `cdn.ebruca.com` → R2 (proxied) → [[Gorseller]]
- **Vercel CLI:** proje bağlı değil; komutlara `--scope cankinalis-projects --project ebruca` ekleyin. Vercel MCP bu takıma 403 verir.
- **Kota:** Hobby planı, 20+ proje aynı takımda (Active CPU 4 sa, Edge Requests 1 M / ay). Kullanım: vercel.com/cankinalis-projects/~/usage (Hobby'de `vercel usage` / `vercel metrics` çalışmaz) → [[Olaylar-ve-Dersler]]
- **Alan adı:** ebruca.com (Vercel: apex A kaydı + `www` CNAME, **proxy kapalı**)

## Ortam değişkenleri

Yerelde `.env`, canlı Turso bilgileri `.env.production.local` dosyasında (ikisi de git dışında). Canlı uygulamanın değişkenleri Vercel'de.

| Grup | Değişkenler |
|---|---|
| DB | `DATABASE_URL` `TURSO_AUTH_TOKEN` |
| Admin | `ADMIN_PASSWORD` `ADMIN_SECRET` |
| Cron | `CRON_SECRET` |
| Ödeme | `IYZIPAY_API_KEY` `IYZIPAY_SECRET_KEY` `IYZIPAY_BASE_URL` |
| E-posta | `RESEND_API_KEY` `EMAIL_FROM` `REPLY_TO_EMAIL` |
| Görsel | `STORAGE_PROVIDER=r2` `R2_ACCOUNT_ID` `R2_ACCESS_KEY_ID` `R2_SECRET_ACCESS_KEY` `R2_BUCKET` (`CLOUDINARY_*` artık kullanılmıyor, hesap iptal) |
| Site | `NEXT_PUBLIC_SITE_URL` `GOOGLE_SITE_VERIFICATION` |
| Meta | `NEXT_PUBLIC_META_PIXEL_ID` `META_CAPI_TOKEN` `META_TEST_EVENT_CODE` (yalnızca test) — tablo ve canlıya geçiş listesi → [[Meta-Pixel-ve-CAPI]] |

## Kırmızı çizgiler

- `prisma db push` canlıya **gitmez**. Canlı şema değişikliği yalnızca `prisma/manual/` SQL ile yapılır → [[Veritabani]]
- Canlı DB'ye dokunmadan önce **yedek** alınır.
- `backups/` klasörü asla commit'lenmez.
- DNS taşınırken Resend kayıtları (`resend._domainkey`, `send` MX/TXT) unutulursa e-postalar **sessizce** durur.
- Vercel kayıtları Cloudflare'de **DNS only** kalmalı (turuncu bulut kapalı).
- **`next start` / `next build` `.env.production.local`'ı yükler → CANLI veritabanı.** Yerel yazma testinde `DATABASE_URL=file:./prisma/dev.db TURSO_AUTH_TOKEN=` zorlayın → [[Olaylar-ve-Dersler]]
- `NEXT_PUBLIC_*` değişkenleri build'e gömülür: Vercel'de değiştirince **yeniden deploy** gerekir.
