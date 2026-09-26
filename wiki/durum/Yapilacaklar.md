---
tags: [durum]
---

# Yapılacaklar

Son güncelleme: 26.09.2026

## Devam eden

- [ ] **27.09.2026: Vercel kota kontrolü** (vercel.com/cankinalis-projects/~/usage, son 30 gün). 26.09'daki değerler: Fluid Active CPU **3s41dk / 4s**, Edge Requests **782K / 1M**, FDT 28/100 GB. Aynı gün ebruca+cicek ISR'a çekildi, ebruca+cicek+posthane'de link prefetch kapatıldı. Beklenen: 27.09 çubuğunda ebruca (mavi) ve cicek CPU'su belirgin düşük; Edge Requests'te ebruca ~%85, cicek ~%78, posthane ~%30 daha az. Düşmediyse: proje bazında Active CPU ve Edge Requests ekran görüntüsü al, `vercel logs` ile hangi route'ların fonksiyon çalıştırdığına bak.
- [x] **R2 taşıması** tamamlandı (26.09.2026), Cloudinary iptal → [[Gorseller]]
- [ ] **28.09.2026 sonrası: geçici `/r2/` proxy'sini kaldır.** DNS yayılımı sırasında bazı operatörler `cdn.ebruca.com`'u çözemediği için, görsel hata verirse `layout.tsx`'teki `R2_FALLBACK_SCRIPT` aynı dosyayı `www…/r2/` proxy'sinden istiyor (yalnızca etkilenen ziyaretçiler Vercel kotası harcar). Kaldırılacaklar: `next.config.ts` → `rewrites`, `layout.tsx` → `R2_FALLBACK_SCRIPT`, `imageLoader.ts` → `R2_VIA_PROXY`. Önce `dig cdn.ebruca.com @193.192.98.8` NXDOMAIN dönmüyor mu kontrol et.
- [ ] `storage.ts` içinde eksik `deleteImage`: ürün silinince dosya R2'de kalıyor.
- [ ] Ölü Cloudinary kodu (`storage.ts` dalı, `imageLoader` kuralı), `cloudinary` paketi ve Vercel'deki `CLOUDINARY_*` değişkenleri temizlenebilir.
- [ ] Admin elle sipariş (`api/admin/siparisler` POST) stok düşümü `lib/stock.ts` kullanmıyor, renk bazlı stoğu atlıyor.

## Satış / büyüme (öncelik sırasıyla) → [[Buyume-Plani]]

- [x] Başarısız ödemede sepetin boşalması + hata mesajı (23.09.2026)
- [ ] Sepetteki işlevsiz "Kupon kodu" kutusu: ya kaldırılmalı ya da çalışır hale getirilmeli
- [ ] `/siparis-tamamlandi` sayfasında `pending=1` durumunun ayrı gösterilmesi
- [ ] Çerez rızası: Kabul / Reddet / Tercihler + `/cerez` metninin güncellenmesi → [[Yasal-Cerceve]]
- [ ] Meta Business Manager, Pixel, alan adı doğrulaması
- [ ] Pixel olayları + CAPI Purchase → [[Meta-Pixel-ve-CAPI]]
- [ ] UTM/fbp/fbc kolonları + dashboard kaynak kırılımı → [[Kampanya-Olcumu]]
- [ ] Katalog feed'i → [[Katalog-ve-Dinamik-Reklam]]
- [ ] Pazarlama izni kutusu + İYS kaydı

## Yasal / şirket

- [ ] `src/lib/company.ts`: `mersisNumber` ve `kepAddress` boş (ETBİS kaydı ve KEP adresi)

## Bilinen

- Lint'te baştan beri 14 sorun var (çoğu `react/no-unescaped-entities`).
