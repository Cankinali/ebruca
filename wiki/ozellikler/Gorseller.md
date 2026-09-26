---
tags: [ozellik, kritik]
---

# Görseller

**Durum (26.09.2026): görseller Cloudflare R2'den (`cdn.ebruca.com`) geliyor.** Cloudinary hesabı aynı gün iptal edildi; aylık ücret bitti. Ayrıntılı adım listesi repo kökünde `R2_TASIMA.md` dosyasında.

- DB ve koddaki tüm adresler `cdn.ebruca.com`. Loader eski Cloudinary adreslerini de hâlâ tanıyor: `imageLoader.ts` adrese bakar; `res.cloudinary.com` → Cloudinary dönüşümü, `cdn.ebruca.com` → önceden üretilmiş `-400/-800/-1200.webp` sürümü (`lib/r2-url.ts`). Yükleme `storage.ts` içinde `STORAGE_PROVIDER` (`cloudinary` | `r2` | yerel) ile seçilir; R2 sürümleri `lib/r2.ts` üretir.
- `scripts/r2-senkron.mts`: canlı DB'deki her Cloudinary görselinin R2'de tüm sürümleriyle olduğunu denetler, eksiği tamamlar (varsayılan rapor, `--uygula` ile yazar).
- 29.08.2026'da Cloudinary ücretsiz kotası (**trafik** kaynaklı) aşıldı, tüm görseller kırıldı. Geçici çözüm olarak Small PAYG planına geçildi ($29/ay).
- Hedef: R2 kovası `ebruca`, `cdn.ebruca.com`, 400/800/1200px WebP. Trafik ücretsiz.
- Tamamlananlar: yedek (`backups/cloudinary-2026-08-29/`), R2 yüklemesi, 25.09.2026 senkronu (1.085 görselin tamamı R2'de), kod.
- 26.09.2026: DNS Cloudflare'e taşındı, `cdn` bağlandı, Vercel'de `STORAGE_PROVIDER=r2`, canlı DB çevrildi (306 satır, `prisma/manual/2026-09-26-r2-gorsel-url.sql`).
- `sharp` Vercel'de çalışsın diye `next.config.ts` → `outputFileTracingIncludes` şart.

**"Görseller gitti" tipi bir şikayette önce hesap veya kota durumuna bakın, koda değil.**

## Reklamla ilişkisi

Meta reklamları trafiği artırdıkça Cloudinary faturası da artar. Bu yüzden **reklam bütçesi açılmadan önce R2 taşımasının bitmesi** tavsiye edilir. Katalog feed'i de kalıcı görsel URL'lerine ihtiyaç duyar → [[Katalog-ve-Dinamik-Reklam]]

## Admin yükleme sınırı

Vercel istek gövdesini **4,5 MB** ile sınırlar; aşan istek koda ulaşmadan 413 döner. Admin formu (`ProductForm.tsx`) bu yüzden 3 MB'tan büyük ya da JPG/PNG/WebP/GIF olmayan (ör. Mac Safari HEIC) dosyaları yüklemeden önce tarayıcıda en fazla 2400px JPEG'e çevirir → `src/lib/compress-image.ts`. Sunucu tarafı sınır 4 MB. Chrome HEIC açamaz, "Görsel okunamadı" der.
