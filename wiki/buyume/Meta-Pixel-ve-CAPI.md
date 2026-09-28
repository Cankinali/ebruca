---
tags: [buyume, plan]
---

# Meta Pixel ve Conversions API

Durum: **kod hazır (28.09.2026)**; `NEXT_PUBLIC_META_PIXEL_ID` + `META_CAPI_TOKEN` Vercel'e girilince çalışır. Env yoksa her şey sessizce no-op.

## Dosyalar

| Dosya | Görev |
|---|---|
| `src/lib/meta/shared.ts` | Ortam koruması, `metaContentId` (Product.id), `metaValue`, normalizasyon, `purchaseEventId` |
| `src/lib/meta/consent-client.ts` | `ebruca_consent` çerezi (`granted`/`denied`) oku/yaz |
| `src/lib/meta/pixel.ts` | fbq kurulumu (onay yoksa yüklenmez), `track`, `trackWithServer` |
| `src/lib/meta/purchase-client.ts` | Ödeme başlatılırken sessionStorage'a özet; başarı sayfasında Purchase bir kez |
| `src/lib/meta/capi.ts` | `server-only`; SHA-256 normalizasyon, 3 sn zaman aşımı, asla fırlatmaz; `metaContext(req)` |
| `src/components/meta/MetaPixel.tsx` | Layout'ta (Suspense) — PageView, onay değişimini dinler |
| `src/app/api/meta/event/route.ts` | AddToCart / InitiateCheckout köprüsü (onay + rate limit) |
| `src/components/layout/CookieBanner.tsx` | **Kabul Et / Reddet** (eşit görünüm) |
| `prisma/manual/2026-09-28-meta-capi.sql` | `Order`: metaConsent, metaFbp, metaFbc, clientIp, userAgent, metaPurchaseSentAt — canlıya 28.09'da uygulandı |

## Kararlar (28.09.2026)

- **Yalnızca canlıda:** `metaEnvironmentAllowed()` — sunucuda `VERCEL_ENV === 'production'`, tarayıcıda `NEXT_PUBLIC_VERCEL_ENV === 'production'` **veya** alan adı `ebruca.com` / `www.ebruca.com`. localhost, preview deploy ve **`/admin`** hiçbir koşulda tetiklemez. Test için `NEXT_PUBLIC_META_FORCE_ENABLE=true` (build anında gömülür).
- **`content_ids` = `Product.id` (kalıcı cuid), VARYANT DEĞİL.** Renk/beden ayrı kimlik almaz; aynı ürünün farklı kalemleri `contents`'te birleşir. `Product.code` elle girildiği için kullanılmadı. Tek kaynak: `metaContentId()`. Katalogda item `id` de `Product.id` olmalı → [[Katalog-ve-Dinamik-Reklam]]
- **Tutar = ürün tutarı, KARGO HARİÇ, tüm olaylarda:** ViewContent/AddToCart ürün fiyatı, InitiateCheckout sepet ara toplamı, Purchase `Order.subtotal` (taksit vade farkı da hariç). Hep `metaValue()` → number, 2 ondalık. Kargo tarayıcıda bilinmediği için tutarlılık adına hariç.
- **Advanced Matching:** Giriş yapmış kullanıcı (Header'daki mevcut `useSession`, ek istek yok) ve ödeme formu → `fbq('init', PIXEL_ID, {em, ph, fn, ln, ct, country:'tr'})`, düz ama normalize (Pixel hash'ler). Yoksa boş init.
- **fbclid → `_fbc`:** Reklamdan gelen URL'deki `fbclid`, onay varsa 90 günlük `_fbc` çerezine yazılır. Instagram/Facebook uygulama içi tarayıcısı çerez başlığını göndermeyebildiği için ödeme başlatılırken `_fbp`/`_fbc` istek gövdesinde de gider (biçim doğrulanarak) ve `Order.metaFbc`'ye yazılır.
- ViewContent yalnızca Pixel (her görüntülemede fonksiyon çalışmasın — Vercel kotası → [[Mimari]]). Purchase CAPI `after()` ile, `metaPurchaseSentAt` ile tek sefer; gönderim başarısızsa işaret geri alınır.
- Headless/otomasyon tarayıcılarında (`navigator.webdriver`) Pixel olay GÖNDERMEZ — Playwright testinde bunu gizlemek gerekir.

## Vercel env

| Değişken | Değer | Not |
|---|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID` | `1463467692367317` | Production + Preview (28.09 eklendi) |
| `META_CAPI_TOKEN` | gizli | Production + Preview (28.09 eklendi) |
| `META_TEST_EVENT_CODE` | `TEST527` | **Yalnızca test süresince** — boşsa hiç gönderilmez |
| `NEXT_PUBLIC_META_FORCE_ENABLE` | eklenmedi | Sadece localhost/preview testi için `true` |
| `NEXT_PUBLIC_META_DOMAIN_VERIFICATION` | boş | Alan adı doğrulaması yapılınca |
| `META_GRAPH_API_VERSION` | boş (v25.0) | İsteğe bağlı |

## Canlıya geçiş checklist'i

1. Events Manager → Test Events'te PageView, ViewContent (Browser), AddToCart / InitiateCheckout (Browser + Server, **Deduplicated**), bir gerçek siparişte Purchase (Browser + Server, Deduplicated) görüldü.
2. Vercel'den **`META_TEST_EVENT_CODE` silindi** (açıkken CAPI olayları reklam ölçümüne sayılmaz).
3. **`NEXT_PUBLIC_META_FORCE_ENABLE`** Vercel'de yok / `true` değil.
4. Env değişikliğinden sonra **yeniden deploy** (NEXT_PUBLIC_ değerleri build'e gömülür).
5. Alan adı doğrulaması (`NEXT_PUBLIC_META_DOMAIN_VERIFICATION` ya da DNS TXT — DNS artık Cloudflare'de).
6. `/cerez` ve `/kvkk` metinleri Meta Pixel ve yurt dışı aktarımını anlatacak şekilde güncellendi (hukuki onayla) → [[Yasal-Cerceve]]
7. Test sırasında sohbete yapıştırılan CAPI token'ı yenilenip Vercel'de değiştirildi (öneri).

## Neden ikisi birden

- **Pixel** (tarayıcı): kolay kurulur ama reklam engelleyiciler, iOS kısıtları ve çerez reddi yüzünden olayların bir kısmı kaybolur.
- **CAPI** (sunucu): `Purchase` olayını doğrudan bizim sunucumuz gönderir, kayıp olmaz.
- İkisi aynı `event_id` ile gönderilir, Meta **tekilleştirir**.

## Olay ↔ kod eşlemesi

| Olay | Nerede tetiklenir | content_ids |
|---|---|---|
| `PageView` | Kök layout'ta script (**rıza varsa**) | |
| `ViewContent` | `src/app/urun/[slug]/ProductDetail.tsx`, sayfa açılınca ve renk değişince | `Product.id` |
| `AddToCart` | Aynı dosyada `addItem` çağrısı | `Product.id` |
| `InitiateCheckout` | `src/app/odeme/page.tsx`, sayfa açılınca | sepetteki öğeler |
| `Purchase` (tarayıcı) | `/siparis-tamamlandi`, **`pending=1` değilse** | |
| `Purchase` (sunucu, CAPI) | `src/app/api/odeme/sonuc/route.ts`, `paymentStatus='success'` yapılan yerde | |

- Purchase `event_id` = **`purchase_<orderNo>`** (tarayıcı ve sunucu aynı değeri kullanır); diğer olaylarda tarayıcıda üretilen UUID köprüye aynen gider
- `value` = kargo HARİÇ (bkz. Kararlar), `currency` = `TRY`
- `content_ids` = `Product.id`; katalog item `id`'si de aynı olmalı → [[Katalog-ve-Dinamik-Reklam]]

## ⚠️ Tuzaklar (kodu yazarken)

1. **Iyzico dönüşü siteler arası POST'tur.** Tarayıcı, `SameSite=Lax` olan `_fbp` / `_fbc` çerezlerini bu istekte göndermez. Bu yüzden CAPI için gereken eşleştirme verisi (`fbp`, `fbc`, IP, user-agent) **`/api/odeme/baslat` anında `Order` tablosuna kaydedilmeli**. Bunun için yeni kolonlar gerekir, `prisma/manual/` ile eklenir → [[Veritabani]]
2. **Purchase yalnızca `paymentStatus='success'` anında gönderilir.** Fraud incelemesindekiler (`pending=1`) sayılmaz. İnceleme sonradan onaylanırsa elle ya da ayrı bir akışla gönderilir.
3. **Kök layout statik kalmalı.** Pixel scripti istemci bileşeni olarak yüklenir, layout'ta `cookies()` okunmaz → [[Mimari]]
4. **Rıza yoksa Pixel yüklenmez.** Sunucu tarafı CAPI için de hukuki dayanak gerekir → [[Yasal-Cerceve]]
5. E-posta ve telefon CAPI'ye **SHA-256 özeti** olarak gider (küçük harf, boşluksuz; telefon `90` ülke kodlu, sadece rakam).
6. CAPI çağrısı başarısız olursa ödeme akışı **bozulmamalı**: try/catch ile sarılmalı, sonuç loglanmalı. Resend'deki gibi sessiz başarısızlığa dikkat edin → [[E-posta]]
7. Test: Events Manager → **Test Events** (`test_event_code`) ile canlıdan önce doğrulanır.

## Ortam değişkenleri

`NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_TOKEN` (Events Manager'da üretilir, **gizli**), isteğe bağlı `META_TEST_EVENT_CODE` (doluysa CAPI olayları Test Events'e gider — canlıya geçerken SİLİN), `NEXT_PUBLIC_META_DOMAIN_VERIFICATION` (meta etiketi), `META_GRAPH_API_VERSION` (varsayılan v25.0).

## Hesap kurulumu (kod dışı)

- Meta Business Manager, reklam hesabı, Pixel (dataset)
- Alan adı doğrulaması: `ebruca.com` (meta etiketi ya da DNS TXT. DNS Cloudflare'e taşınacaksa taşımadan sonra yapın.)
- Instagram hesabını Business Manager'a bağlama
