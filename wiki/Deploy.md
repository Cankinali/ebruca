---
tags: [genel, kritik]
---

# Deploy ve Canlı Ortam

- **Barındırma:** Vercel (git push ile otomatik deploy). Geri alma için Vercel **Instant Rollback** kullanılır.
- **Cron:** `vercel.json`, her gün 06:00 UTC → [[Gunluk-Bakim]]
- **DNS:** Şu an Hostinger'da. Cloudflare'e taşıma planlı ([[Gorseller]], `R2_TASIMA.md`).
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
| Görsel | `CLOUDINARY_*` `STORAGE_PROVIDER` (R2 sonrası: `R2_*`, `R2_PUBLIC_BASE`) |
| Site | `NEXT_PUBLIC_SITE_URL` `GOOGLE_SITE_VERIFICATION` |
| *Planlı* | `NEXT_PUBLIC_META_PIXEL_ID` `META_CAPI_TOKEN` → [[Meta-Pixel-ve-CAPI]] |

## Kırmızı çizgiler

- `prisma db push` canlıya **gitmez**. Canlı şema değişikliği yalnızca `prisma/manual/` SQL ile yapılır → [[Veritabani]]
- Canlı DB'ye dokunmadan önce **yedek** alınır.
- `backups/` klasörü asla commit'lenmez.
- DNS taşınırken Resend kayıtları (`resend._domainkey`, `send` MX/TXT) unutulursa e-postalar **sessizce** durur.
- Vercel kayıtları Cloudflare'de **DNS only** kalmalı (turuncu bulut kapalı).
