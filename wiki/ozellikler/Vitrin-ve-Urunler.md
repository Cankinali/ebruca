---
tags: [ozellik]
---

# Vitrin ve Ürünler

Akış: anasayfa → kategori / tüm ürünler → ürün detayı → [[Sepet]] → [[Odeme-ve-Siparis]]

## Kategoriler

`src/lib/data.ts` dosyasında **sabit**: Elbise · Takım (Etekli, Pantolonlu) · Alt Giyim (Etek, Pantolon) · Üst Giyim · Dış Giyim · Şal & Eşarp. Ürünün `category` / `subcategory` alanı bu slug'larla eşleşir. Kategori görselleri de burada sabit URL olarak durur (R2 taşımasında değişecek → [[Gorseller]]).

## Renk varyantları

`src/lib/products-display.ts` → `expandProductsByColor()`: 2 veya daha fazla renkli bir ürün **her renk için ayrı kart** olarak listelenir (`displayKey = id-renk`). Her rengin kendine ait görseli (`colorImages`), bedenleri (`colorSizes`) ve stoğu (`colorSizeStock`) olabilir → [[Stok]]

> Meta kataloğunda ürün kimliği aynı mantıkla kurulmalı: renk başına bir öğe, ürün id'si grup kimliği olur → [[Katalog-ve-Dinamik-Reklam]]

## Anasayfa blokları

`src/components/home/`: HeroBanner (3 sabit görsel), CategoryCards, ProductSection (yeni gelenler / çok satanlar), TrustBadges. Üstte `AnnouncementBar` ("5.000 TL üzeri ücretsiz kargo" / "3 taksit").

## Ürün bayrakları

`isNew`, `isBestseller`, `isFeatured` admin panelinden elle işaretlenir. Satış verisinden **otomatik hesaplanmaz**.

## Ürün detayı

`src/app/urun/[slug]/`: `page.tsx` (metadata + Product/Breadcrumb JSON-LD) ve `ProductDetail.tsx` (renk/beden seçimi, `addItem`). Tasarlanan `ViewContent` ve `AddToCart` olayları buraya bağlanacak → [[Meta-Pixel-ve-CAPI]]
