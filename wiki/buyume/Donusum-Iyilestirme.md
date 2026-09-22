---
tags: [buyume]
---

# Dönüşüm İyileştirme

Reklama para harcamadan önce kapatılacak sızıntılar ve fırsatlar.

## 🔴 Sızıntılar (kodda doğrulandı, 23.09.2026)

1. **Başarısız ödemede sepet boşalıyor.** `src/app/odeme/page.tsx`, Iyzico'ya yönlendirmeden **önce** `clearCart()` çağırıyor. Kart reddedilirse `/api/odeme/sonuc` müşteriyi `/sepet?error=payment_failed&msg=...` adresine gönderiyor, ama:
   - sepet zaten boş,
   - `src/app/sepet/page.tsx` `error` parametresini **hiç okumuyor**, yani müşteri neden döndüğünü görmüyor.

   Öneri: sepeti yalnızca başarılı sipariş sayfasında temizlemek (ya da sepeti `pending` siparişten geri yüklemek) ve sepet sayfasında anlaşılır bir hata mesajı göstermek.
2. **Anasayfadaki yorum bloğu çelişkili.** `src/components/home/CustomerReviews.tsx` sabit "4.9 / 5" puanı gösteriyor, hemen altında "Henüz yorum yok." yazıyor. Güveni zedeliyor. Reklam trafiği geldiğinde de yanıltıcı beyan riski taşıyor → [[Yasal-Cerceve]]. Gerçek yorumlar gelene kadar puan kaldırılmalı.
3. **Fraud incelemesindeki sipariş** `/siparis-tamamlandi?pending=1` sayfasında "Siparişiniz Alındı!" görüyor. `pending` parametresi okunmuyor. Bu hem müşteri hem de Purchase ölçümü açısından yanlış → [[Meta-Pixel-ve-CAPI]]

## 🟡 Fırsatlar (test edilmeli)

- **5.000 TL ücretsiz kargo eşiği:** sepette "ücretsiz kargoya X TL kaldı" göstergesi. Ortalama sepet tutarı ölçüldükten sonra eşik de tartışılabilir → [[Odeme-ve-Siparis]]
- **Taksit yalnızca 5.000 TL üstünde.** Bu bilgi ürün sayfasında da görünürse sepet tutarı yükselebilir.
- **Misafir ödeme açık** (iyi). Ödeme formu üyeler için ön dolduruluyor.
- **"Çok satanlar" elle işaretleniyor.** Satış verisinden otomatik hesaplanabilir → [[Vitrin-ve-Urunler]]
- **Güven unsurları:** gerçek müşteri yorumları (Instagram yorumları veya sipariş sonrası yorum isteme), iade ve teslimat bilgisinin ürün sayfasında görünürlüğü.
- **WhatsApp:** `COMPANY.whatsappUrl` var. Ürün sayfasından "bu ürünü sor" bağlantısı konabilir.
- **Mobil hız:** R2 ile WebP ve boyutlandırılmış görseller → [[Gorseller]]

Her değişiklik öncesi ve sonrası dönüşüm oranı not edilmeli → [[Kararlar]]
