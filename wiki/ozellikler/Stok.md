---
tags: [ozellik, kritik]
---

# Stok

**Tek kaynak: `src/lib/stock.ts`.** Kural: seçili renge ait dolu bir stok tablosu varsa (`colorSizeStock[renk]`) o geçerlidir, yoksa düz `sizeStock` kullanılır.

| Fonksiyon | Kullanan yer |
|---|---|
| `resolveStock` / `availableStock` | Ürün sayfası, ürün kartı |
| `hasEnoughStock` | Ödeme öncesi kontrol (`api/odeme/baslat`) |
| `decrementStock` | Ödeme sonrası düşüm (`api/odeme/sonuc`) |
| `totalStock` / `stockLevel` | Liste rozetleri |

**Kuralı başka yere kopyalamayın.** Daha önce dört ayrı yerde yazılmıştı. Ödeme öncesi kontrol farklılaşınca renk bazlı ürünlerde stok denetimi tamamen atlanıyordu.

Stok **yalnızca başarılı ödemede** düşer, sepete eklerken rezerve edilmez.

Meta kataloğundaki `availability` alanı da bu fonksiyonlardan üretilmeli → [[Katalog-ve-Dinamik-Reklam]]
