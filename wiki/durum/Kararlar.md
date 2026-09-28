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
| 28.09.2026 | Meta `content_ids` = `Product.id` (varyant değil), `value` her olayda **kargo hariç** | Kalıcı kimlik, tarayıcıda kargo bilinmiyor; tutarlılık → [[Meta-Pixel-ve-CAPI]] |
| 28.09.2026 | Meta yalnızca canlıda ve pazarlama onayıyla; çerez bandı Kabul/Reddet (eşit) | KVKK açık rıza → [[Yasal-Cerceve]] |
| 28.09.2026 | Ödeme dönüşünde `price`=subtotal, `paidPrice`≥total; dönüş idempotent | Taksit vade farkı yüzünden ödemeler iptal ediliyordu → [[Olaylar-ve-Dersler]] |
| 26.09.2026 | Vitrin linklerinde `prefetch={false}`, ISR 1 gün + hedefli yenileme | Vercel Hobby Edge Requests / Active CPU kotası → [[Olaylar-ve-Dersler]] |
| 26.09.2026 | Görseller Cloudflare R2 (`cdn.ebruca.com`), DNS Cloudflare'de, Cloudinary iptal | Trafik ücretsiz → [[Gorseller]] |
| 26.09.2026 | Admin yüklemesi tarayıcıda küçültülür (≤2400px JPEG) | Vercel 4,5 MB gövde sınırı, HEIC |
| 16.09.2026 | Kargo 90 TL'den **130 TL**'ye çıkarıldı (5.000 TL üstü ücretsiz) | commit `5805d2e` |
| 08.2026 | Misafir siparişleri e-posta ile hesaba **bağlanmaz** | E-posta doğrulaması yok. Biri başkasının adresiyle kayıt olup o kişinin geçmişini görebilirdi. Doğrulama eklenirse açılabilir → [[Uyelik]] |
| 08.2026 | Terk edilmiş sipariş hatırlatması pazarlama dili **içermez** | 6563 sayılı kanun ve İYS → [[Gunluk-Bakim]] |
| 08.2026 | 72 saatlik otomatik iptalde `paymentStatus` korunur | Sipariş panelde kalsın, geri alınabilsin |
| — | Stok kuralı tek dosyada (`lib/stock.ts`) | Dört kopya ayrışmıştı → [[Stok]] |
| 09.2026 | Vitrin sayfaları ISR, değişiklikte `revalidateVitrin()` | `force-dynamic` Active CPU'yu tüketiyordu → [[Vitrin-ve-Urunler]] |
| — | Kök layout statik | `cookies()` tüm siteyi dinamik yapardı → [[Mimari]] |
| — | Canlı şema elle yazılmış SQL ile güncellenir | Prisma Turso'ya gitmiyor → [[Veritabani]] |
