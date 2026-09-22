---
tags: [buyume, plan]
---

# Kampanya Ölçümü

Soru: **Hangi kanal ne kadar satış getirdi?** Bugün bu soru cevaplanamıyor, siparişte kaynak bilgisi yok.

## Öneri

1. **Giriş anında yakala:** URL'de `utm_source`, `utm_medium`, `utm_campaign`, `fbclid` varsa istemcide sakla (sepet gibi `localStorage`, 7-30 gün, *son dokunuş*). `fbclid` ayrıca `_fbc` çerezine dönüşür → [[Meta-Pixel-ve-CAPI]]
2. **Siparişe yaz:** `/api/odeme/baslat` bu bilgiyi alıp `Order` tablosuna kaydeder. Gereken yeni kolonlar: `utmSource`, `utmMedium`, `utmCampaign`, `fbp`, `fbc`, `clientIp`, `userAgent` → `prisma/manual/` ile eklenir ([[Veritabani]])
3. **Göster:** Admin dashboard'da kaynak bazlı ciro ve sipariş sayısı (`paymentStatus='success'` ve `status!='cancelled'`) → [[Admin-Paneli]]

## UTM standardı (reklamlarda kullanılacak)

| Kanal | utm_source | utm_medium |
|---|---|---|
| Meta reklam | `meta` | `paid_social` |
| Instagram bio/story (organik) | `instagram` | `social` |
| WhatsApp paylaşımı | `whatsapp` | `social` |
| E-posta kampanyası | `email` | `email` |

`utm_campaign` küçük harf ve tireli olmalı: `2026-10-sonbahar-elbise`. Meta'da dinamik parametre de kullanılabilir: `{{campaign.name}}`.

## Bugün ölçülebilenler (kod gerekmez)

- Ödeme başlatıp tamamlamayanların oranı (`paymentStatus` dağılımı)
- Hatırlatma sonrası tamamlanan sipariş oranı (`reminderSentAt` dolu olup sonradan `success` olanlar)
- Ortalama sepet tutarı ve 5.000 TL eşiğini geçenlerin payı

Kişisel veri içeren sorgu çıktıları wiki'ye **yazılmaz**. Yalnızca toplam sayılar yazılır.
