---
tags: [ozellik, kritik]
---

# Görseller

**Durum: Cloudinary'den Cloudflare R2'ye taşıma yarıda.** Ayrıntılı adım listesi repo kökünde `R2_TASIMA.md` dosyasında.

- Şu an görseller hâlâ Cloudinary'den geliyor (DB'deki adresler öyle). Kod ikisini de destekliyor: `imageLoader.ts` adrese bakar; `res.cloudinary.com` → Cloudinary dönüşümü, `cdn.ebruca.com` → önceden üretilmiş `-400/-800/-1200.webp` sürümü (`lib/r2-url.ts`). Yükleme `storage.ts` içinde `STORAGE_PROVIDER` (`cloudinary` | `r2` | yerel) ile seçilir; R2 sürümleri `lib/r2.ts` üretir.
- `scripts/r2-senkron.mts`: canlı DB'deki her Cloudinary görselinin R2'de tüm sürümleriyle olduğunu denetler, eksiği tamamlar (varsayılan rapor, `--uygula` ile yazar).
- 29.08.2026'da Cloudinary ücretsiz kotası (**trafik** kaynaklı) aşıldı, tüm görseller kırıldı. Geçici çözüm olarak Small PAYG planına geçildi ($29/ay).
- Hedef: R2 kovası `ebruca`, `cdn.ebruca.com`, 400/800/1200px WebP. Trafik ücretsiz.
- Tamamlananlar: yedek (`backups/cloudinary-2026-08-29/`), R2 yüklemesi, 25.09.2026 senkronu (1.085 görselin tamamı R2'de), kod.
- Bekleyenler: DNS'i Cloudflare'e taşımak → `cdn` alan adı → Vercel'de `STORAGE_PROVIDER=r2` → son senkron → canlı DB URL'leri → Cloudinary'yi Free plana düşürmek.

**"Görseller gitti" tipi bir şikayette önce hesap veya kota durumuna bakın, koda değil.**

## Reklamla ilişkisi

Meta reklamları trafiği artırdıkça Cloudinary faturası da artar. Bu yüzden **reklam bütçesi açılmadan önce R2 taşımasının bitmesi** tavsiye edilir. Katalog feed'i de kalıcı görsel URL'lerine ihtiyaç duyar → [[Katalog-ve-Dinamik-Reklam]]
