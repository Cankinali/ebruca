---
tags: [buyume, plan]
---

# Meta Pixel ve Conversions API

Durum: **planlandı, kod yok.**

## Neden ikisi birden

- **Pixel** (tarayıcı): kolay kurulur ama reklam engelleyiciler, iOS kısıtları ve çerez reddi yüzünden olayların bir kısmı kaybolur.
- **CAPI** (sunucu): `Purchase` olayını doğrudan bizim sunucumuz gönderir, kayıp olmaz.
- İkisi aynı `event_id` ile gönderilir, Meta **tekilleştirir**.

## Olay ↔ kod eşlemesi

| Olay | Nerede tetiklenir | content_ids |
|---|---|---|
| `PageView` | Kök layout'ta script (**rıza varsa**) | |
| `ViewContent` | `src/app/urun/[slug]/ProductDetail.tsx`, sayfa açılınca ve renk değişince | `id-renk` |
| `AddToCart` | Aynı dosyada `addItem` çağrısı | `id-renk` |
| `InitiateCheckout` | `src/app/odeme/page.tsx`, sayfa açılınca | sepetteki öğeler |
| `Purchase` (tarayıcı) | `/siparis-tamamlandi`, **`pending=1` değilse** | |
| `Purchase` (sunucu, CAPI) | `src/app/api/odeme/sonuc/route.ts`, `paymentStatus='success'` yapılan yerde | |

- `event_id` = **`orderNo`** (tarayıcı ve sunucu aynı değeri kullanır)
- `value` = `Order.total`, `currency` = `TRY`
- `content_ids` biçimi katalogla **birebir aynı** olmalı → [[Katalog-ve-Dinamik-Reklam]]

## ⚠️ Tuzaklar (kodu yazarken)

1. **Iyzico dönüşü siteler arası POST'tur.** Tarayıcı, `SameSite=Lax` olan `_fbp` / `_fbc` çerezlerini bu istekte göndermez. Bu yüzden CAPI için gereken eşleştirme verisi (`fbp`, `fbc`, IP, user-agent) **`/api/odeme/baslat` anında `Order` tablosuna kaydedilmeli**. Bunun için yeni kolonlar gerekir, `prisma/manual/` ile eklenir → [[Veritabani]]
2. **Purchase yalnızca `paymentStatus='success'` anında gönderilir.** Fraud incelemesindekiler (`pending=1`) sayılmaz. İnceleme sonradan onaylanırsa elle ya da ayrı bir akışla gönderilir.
3. **Kök layout statik kalmalı.** Pixel scripti istemci bileşeni olarak yüklenir, layout'ta `cookies()` okunmaz → [[Mimari]]
4. **Rıza yoksa Pixel yüklenmez.** Sunucu tarafı CAPI için de hukuki dayanak gerekir → [[Yasal-Cerceve]]
5. E-posta ve telefon CAPI'ye **SHA-256 özeti** olarak gider (küçük harf, boşluksuz; telefon `90` ülke kodlu, sadece rakam).
6. CAPI çağrısı başarısız olursa ödeme akışı **bozulmamalı**: try/catch ile sarılmalı, sonuç loglanmalı. Resend'deki gibi sessiz başarısızlığa dikkat edin → [[E-posta]]
7. Test: Events Manager → **Test Events** (`test_event_code`) ile canlıdan önce doğrulanır.

## Ortam değişkenleri (planlı)

`NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_TOKEN` (Events Manager'da üretilir, **gizli**), isteğe bağlı olarak `META_TEST_EVENT_CODE`.

## Hesap kurulumu (kod dışı)

- Meta Business Manager, reklam hesabı, Pixel (dataset)
- Alan adı doğrulaması: `ebruca.com` (meta etiketi ya da DNS TXT. DNS Cloudflare'e taşınacaksa taşımadan sonra yapın.)
- Instagram hesabını Business Manager'a bağlama
