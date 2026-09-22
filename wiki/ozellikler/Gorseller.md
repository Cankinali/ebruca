---
tags: [ozellik, kritik]
---

# Görseller

**Durum: Cloudinary'den Cloudflare R2'ye taşıma yarıda.** Ayrıntılı adım listesi repo kökünde `R2_TASIMA.md` dosyasında.

- Şu an: `src/lib/storage.ts` (yükleme) ve `src/lib/imageLoader.ts` (Next görsel loader'ı) Cloudinary'yi kullanıyor.
- 29.08.2026'da Cloudinary ücretsiz kotası (**trafik** kaynaklı) aşıldı, tüm görseller kırıldı. Geçici çözüm olarak Small PAYG planına geçildi ($29/ay).
- Hedef: R2 kovası `ebruca`, `cdn.ebruca.com`, 400/800/1200px WebP. Trafik ücretsiz.
- Tamamlananlar: yedek (`backups/cloudinary-2026-08-29/`), R2 yüklemesi (4.619 nesne).
- Bekleyenler: DNS'i Cloudflare'e taşımak → `cdn` alan adı → kod → canlı DB URL'leri → Cloudinary'yi Free plana düşürmek.

**"Görseller gitti" tipi bir şikayette önce hesap veya kota durumuna bakın, koda değil.**

## Reklamla ilişkisi

Meta reklamları trafiği artırdıkça Cloudinary faturası da artar. Bu yüzden **reklam bütçesi açılmadan önce R2 taşımasının bitmesi** tavsiye edilir. Katalog feed'i de kalıcı görsel URL'lerine ihtiyaç duyar → [[Katalog-ve-Dinamik-Reklam]]
