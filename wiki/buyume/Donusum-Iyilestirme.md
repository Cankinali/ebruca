---
tags: [buyume]
---

# Dönüşüm İyileştirme

Reklama para harcamadan önce kapatılacak sızıntılar ve fırsatlar.

## 🔴 Sızıntılar

1. **Fraud incelemesindeki sipariş** `/siparis-tamamlandi?pending=1` sayfasında "Siparişiniz Alındı!" görüyor, `pending` parametresi okunmuyor. Hem müşteri hem de Purchase ölçümü açısından yanlış → [[Meta-Pixel-ve-CAPI]]

## ✅ Kapatılanlar

- **Başarısız ödemede sepetin boşalması** (23.09.2026): sepet artık Iyzico'ya yönlendirmeden önce değil, `/siparis-tamamlandi` sayfasında temizleniyor. `/sepet` sayfası `?error=` koduna göre açıklayıcı bir mesaj gösteriyor. Tutar veya doğrulama uyuşmazlığında "tekrar dene" yerine iletişime yönlendiriyor (çift çekim riski) → [[Sepet]]
- **Sabit "4.9 / 5" puanı** (23.09.2026): `CustomerReviews` bileşeni hiçbir sayfada kullanılmıyordu, yani sitede hiç görünmüyordu. Ölü kod olarak silindi.

## 🟡 Fırsatlar (test edilmeli)

- **5.000 TL ücretsiz kargo eşiği:** sepette "ücretsiz kargoya X TL kaldı" göstergesi. Ortalama sepet tutarı ölçüldükten sonra eşik de tartışılabilir → [[Odeme-ve-Siparis]]
- **Taksit yalnızca 5.000 TL üstünde.** Bu bilgi ürün sayfasında da görünürse sepet tutarı yükselebilir.
- **Misafir ödeme açık** (iyi). Ödeme formu üyeler için ön dolduruluyor.
- **"Çok satanlar" elle işaretleniyor.** Satış verisinden otomatik hesaplanabilir → [[Vitrin-ve-Urunler]]
- **Güven unsurları:** gerçek müşteri yorumları (Instagram yorumları veya sipariş sonrası yorum isteme), iade ve teslimat bilgisinin ürün sayfasında görünürlüğü.
- **WhatsApp:** `COMPANY.whatsappUrl` var. Ürün sayfasından "bu ürünü sor" bağlantısı konabilir.
- **Mobil hız:** R2 ile WebP ve boyutlandırılmış görseller → [[Gorseller]]

Her değişiklik öncesi ve sonrası dönüşüm oranı not edilmeli → [[Kararlar]]
