---
tags: [durum]
---

# Kararlar

Neden böyle yapıldı? Tekrar tartışılmasın diye. Yeni kararlar en üste eklenir: **tarih, karar, gerekçe**.

## Büyüme ve pazarlama

| Tarih | Karar | Gerekçe |
|---|---|---|
| 23.09.2026 | Wiki kuruldu, Meta reklamları için büyüme bölümü açıldı | Satış artırma çalışmaları başlayacak, önce ölçüm |

## Ürün ve teknik

| Tarih | Karar | Gerekçe |
|---|---|---|
| 16.09.2026 | Kargo 90 TL'den **130 TL**'ye çıkarıldı (5.000 TL üstü ücretsiz) | commit `5805d2e` |
| 30.08.2026 | Görseller Cloudinary'den R2'ye taşınıyor | Trafik kaynaklı kota aşımı; R2'de trafik ücretsiz → [[Gorseller]] |
| 08.2026 | Misafir siparişleri e-posta ile hesaba **bağlanmaz** | E-posta doğrulaması yok. Biri başkasının adresiyle kayıt olup o kişinin geçmişini görebilirdi. Doğrulama eklenirse açılabilir → [[Uyelik]] |
| 08.2026 | Terk edilmiş sipariş hatırlatması pazarlama dili **içermez** | 6563 sayılı kanun ve İYS → [[Gunluk-Bakim]] |
| 08.2026 | 72 saatlik otomatik iptalde `paymentStatus` korunur | Sipariş panelde kalsın, geri alınabilsin |
| — | Stok kuralı tek dosyada (`lib/stock.ts`) | Dört kopya ayrışmıştı → [[Stok]] |
| 09.2026 | Vitrin sayfaları ISR, değişiklikte `revalidateVitrin()` | `force-dynamic` Active CPU'yu tüketiyordu → [[Vitrin-ve-Urunler]] |
| — | Kök layout statik | `cookies()` tüm siteyi dinamik yapardı → [[Mimari]] |
| — | Canlı şema elle yazılmış SQL ile güncellenir | Prisma Turso'ya gitmiyor → [[Veritabani]] |
