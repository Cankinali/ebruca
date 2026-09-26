---
tags: [ozellik]
---

# Vitrin ve Ürünler

Akış: anasayfa → kategori / tüm ürünler → ürün detayı → [[Sepet]] → [[Odeme-ve-Siparis]]

## Kategoriler

`src/lib/data.ts` dosyasında **sabit**: Elbise · Takım (Etekli, Pantolonlu) · Alt Giyim (Etek, Pantolon) · Üst Giyim · Dış Giyim · Şal & Eşarp. Ürünün `category` / `subcategory` alanı bu slug'larla eşleşir. Kategori görselleri de burada sabit URL olarak durur (R2 taşımasında değişecek → [[Gorseller]]).

## Renk varyantları

`src/lib/products-display.ts` → `expandProductsByColor()`: 2 veya daha fazla renkli bir ürün **her renk için ayrı kart** olarak listelenir (`displayKey = id-renk`). Her rengin kendine ait görseli (`colorImages`), bedenleri (`colorSizes`) ve stoğu (`colorSizeStock`) olabilir → [[Stok]]

> Meta kataloğunda ürün kimliği aynı mantıkla kurulmalı: renk başına bir öğe, ürün id'si grup kimliği olur → [[Katalog-ve-Dinamik-Reklam]]

## Anasayfa blokları

`src/components/home/`: HeroBanner (3 sabit görsel), CategoryCards, ProductSection (yeni gelenler / çok satanlar), TrustBadges. Üstte `AnnouncementBar` ("5.000 TL üzeri ücretsiz kargo" / "3 taksit").

## Ürün bayrakları

`isNew`, `isBestseller`, `isFeatured` admin panelinden elle işaretlenir. Satış verisinden **otomatik hesaplanmaz**.

## Önbellek (ISR)

Anasayfa, `/tumurunler`, `/kategori/[slug]` ve `/urun/[slug]` **ISR** ile Vercel CDN'inde önbelleklenir (`revalidate = 86400`, günde bir). Kısa tutmayın: botlar tüm ürünleri gezdiği için her yenileme Active CPU yer. Ürün ve kategori sayfaları build'de `generateStaticParams` ile önceden üretilir. Build sonrası eklenen ürünlerin sayfası ilk ziyarette üretilir.

Veri değişince `src/lib/revalidate.ts` → `revalidateVitrin(slugs)` **hedefli** yeniler: anasayfa, tüm ürünler, kategori sayfaları ve yalnızca değişen ürünlerin sayfası. (Önceden tüm siteyi geçersiz kılıyordu; her admin kaydında ~200 sayfa yeniden üretiliyordu.) Diğer ürün sayfalarındaki "çok satanlar" bloğu en geç 1 gün eski kalabilir. Çağrıldığı yerler: admin ürün ekle/düzenle/sil, admin elle sipariş, ödeme sonucu (stok düşümü). **Ürünleri veya stoğu değiştiren yeni bir yol eklenirse bu çağrı unutulmamalı.** Unutulursa vitrin en fazla 1 gün eski veri gösterir. Fiyat ve stok zaten `/api/odeme/baslat`'ta sunucuda yeniden doğrulanır.

Eskiden bu dört sayfada `force-dynamic` vardı. Her istek function çalıştırıyordu ve Active CPU'nun ~%85'i buradan geliyordu (09.2026).

## Link ön yüklemesi kapalı

Vitrindeki tüm `<Link>`'lerde `prefetch={false}` (admin hariç). Varsayılan ön yükleme ekranda görünen her link için arka planda istek atıyordu: tek bir kategori/anasayfa görüntülemesi ~90-105 Vercel Edge Request demekti (isteklerin ~%85'i). Kapatınca sayfa başına ~14'e indi; tıklamada sayfa önbellekten geldiği için geçiş yine hızlı (26.09.2026). **Yeni link eklerken `prefetch={false}` unutulmamalı.**

## Ürün detayı

`src/app/urun/[slug]/`: `page.tsx` (metadata + Product/Breadcrumb JSON-LD) ve `ProductDetail.tsx` (renk/beden seçimi, `addItem`). `?renk=` parametresi `ProductDetailFromUrl` içinde Suspense altında okunur. Fallback, ilk renkle tam render edilir; böylece statik HTML'de ürün içeriği eksiksiz yer alır. Tasarlanan `ViewContent` ve `AddToCart` olayları buraya bağlanacak → [[Meta-Pixel-ve-CAPI]]
