---
tags: [durum]
---

# Yapılacaklar

Son güncelleme: 23.09.2026

## Devam eden

- [ ] **R2 taşıması**: DNS → `cdn.ebruca.com` → kod → canlı DB URL'leri → Cloudinary'yi Free plana düşürmek. Ayrıntı `R2_TASIMA.md`, özet → [[Gorseller]]
  - `package.json`: `@aws-sdk/client-s3` ve `sharp` henüz `devDependencies`'te (commit edilmemiş değişiklik), taşıma adımında `dependencies`'e geçecek.
  - `storage.ts` içinde eksik `deleteImage`: ürün silinince dosya sağlayıcıda kalıyor.

## Satış / büyüme (öncelik sırasıyla) → [[Buyume-Plani]]

- [ ] Başarısız ödemede sepetin boşalması + sepet sayfasında hata mesajının görünmemesi → [[Donusum-Iyilestirme]]
- [ ] Anasayfadaki sabit "4.9 / 5" puanı ile "Henüz yorum yok." çelişkisi
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
