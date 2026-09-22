---
tags: [buyume, plan]
---

# Katalog ve Dinamik Reklam

Durum: **planlandı, kod yok.**

Meta'nın ürün kataloğu sayesinde reklamlar kullanıcının baktığı ürünü otomatik gösterir (dinamik yeniden hedefleme, Advantage+ katalog). Instagram'da ürün etiketleme ve mağaza da bu kataloğa bağlıdır.

## Feed endpoint'i (öneri)

`GET /api/katalog/meta` (CSV veya XML). Commerce Manager bu adresi belirli aralıklarla çeker.

| Feed alanı | Kaynak |
|---|---|
| `id` | `urunId-renk` (tek renkliyse `urunId`), `expandProductsByColor` ile aynı mantık |
| `item_group_id` | `urunId` |
| `title` | `name` + renk |
| `description` | `description` |
| `availability` | `lib/stock.ts`, **kuralı kopyalamayın** → [[Stok]] |
| `price` / `sale_price` | `originalPrice` varsa o `price`, `price` ise `sale_price` olur (`TRY`) |
| `link` | `absoluteUrl('/urun/slug')` (renk parametresi desteklenirse eklenir) |
| `image_link` | Rengin ilk görseli, yoksa `images[0]`. **R2 sonrası kalıcı URL** → [[Gorseller]] |
| `brand` | `Ebruca` |
| `google_product_category` / `product_type` | `data.ts` kategorisi |
| `color`, `size` | varyant alanları |
| `condition` | `new` |

## Kurallar

- Pixel olaylarındaki `content_ids` ile feed `id` alanı **birebir aynı** olmalı. Aksi halde dinamik reklam çalışmaz → [[Meta-Pixel-ve-CAPI]]
- Stokta olmayan ürün feed'de `out of stock` olarak görünür, silinmez (geçmiş reklam eşleşmeleri korunur).
- Feed herkese açık bir URL'dir. İçinde yalnızca vitrinde zaten görünen bilgi olmalı.
- Aynı feed küçük değişikliklerle **Google Merchant Center** için de kullanılabilir.
