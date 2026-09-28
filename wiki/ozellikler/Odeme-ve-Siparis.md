---
tags: [ozellik, kritik]
---

# Ödeme ve Sipariş

Ayrıntılı belge: repo kökünde `IYZICO_ORDER_CONTEXT.md`. Bu not özettir.

```
/odeme formu (2 yasal onay kutusu zorunlu)
  → POST /api/odeme/baslat
      fiyat DB'den · stok kontrolü (lib/stock.ts) · kargo sunucuda
      Order oluşur: status=pending, paymentStatus=pending
      Iyzico checkout başlatılır → paymentPageUrl
  → Iyzico barındırılan sayfa (kart bilgisi bize gelmez)
  → POST /api/odeme/sonuc  (Iyzico'dan dönüş, 303 ile GET'e çevrilir)
      token Iyzico'da doğrulanır · conversationId + tutar kontrolü
      başarılı → paymentStatus=success, status=confirmed, stok düşer, onay e-postası
      fraud incelemesi (fraudStatus=0) → pending kalır, ?pending=1
      başarısız → failure/cancelled, /sepet?error=payment_failed
  → /siparis-tamamlandi?no=...
```

## İki durum alanı (karıştırmayın)

| Alan | Anlamı | Değerler |
|---|---|---|
| `paymentStatus` | Iyzico sonucu | `pending` `success` `failure` |
| `status` | Operasyon | `pending` `confirmed` `shipped` `delivered` `cancelled` |

**Satış = `paymentStatus='success'`.** Dashboard cirosu buna ek olarak `status != 'cancelled'` koşulunu da ister. Reklam dönüşümü de (Meta `Purchase`) **yalnızca** bu anda gönderilmeli → [[Meta-Pixel-ve-CAPI]]

## Ticari kurallar (kodda)

| Kural | Yer |
|---|---|
| Kargo: 5.000 TL ve üzeri ücretsiz, altı **130 TL** | `api/odeme/baslat/route.ts` |
| Taksit: 5.000 TL altı yalnızca tek çekim | aynı dosya, `enabledInstallments` |
| Duyuru çubuğu aynı eşikleri yazar | `components/layout/AnnouncementBar.tsx` |

Eşik değişirse **üç yer** birlikte güncellenmeli (bir de `/teslimat` ve `/sss` metinleri).

## Bilinen eksikler

- `/siparis-tamamlandi` sayfası `pending=1` parametresine bakmıyor, fraud incelemesindeki siparişe de "Siparişiniz Alındı!" diyor.

## Tutar kontrolü ve taksit (28.09.2026 olayı)

Ödeme dönüşünde (`/api/odeme/sonuc`) Iyzico'nun iki tutarı ayrı kontrol edilir:

- `price` = sepet tutarı → `order.subtotal` ile **birebir** eşleşmeli.
- `paidPrice` = kart sahibinden çekilen → **taksitte vade farkı eklenir**, bu yüzden `order.total`'dan büyük olabilir; yalnızca **eksik** olması reddedilir.

Eskiden `paidPrice === total` aranıyordu. `baslat` 5.000 TL üstünde taksiti açtığı için her taksitli ödeme para çekildiği hâlde `failure/cancelled` oluyordu. İlk gerçek vaka: EB98601892 (7.915 TL, 3 taksit, 8.370,66 TL). Düzeltildi; sipariş dönüş yeni kodla yeniden işletilerek kurtarıldı. O güne kadarki 34 başarısız sipariş Iyzico'da tek tek sorgulandı, başka etkilenen yok. Aynı hata cicek'te de düzeltildi.

Onay maili `after()` ile gönderilir. Await edilmeyen promise, Vercel'de cevap döndükten sonra yarıda kesilebilir.

**Para çekildi ama sipariş başarısız görünüyorsa:** siparişin `paymentToken`'ı ile `retrieveCheckout` sorgula; `paymentStatus === 'SUCCESS'` ise dönüşü aynı token ile yeniden POST et (`/api/odeme/sonuc?orderId=…`, form alanı `token`). Route idempotenttir (koşullu `updateMany`): zaten `success` olan siparişte tekrar çalıştırmak stok düşümünü ve maili tekrarlamaz.
