---
tags: [moc]
---

# Ebruca Wiki 🏠

Ebruca.com (kadın giyim e-ticaret) kod tabanının özet ve bağlam katmanı. Asıl kaynak repodaki kod, bu vault onun üzerine yazılmış bir harita. **Bu wiki'yi Claude yazar ve günceller.** Elle düzenleme de serbest.

> Vault kökü `ebruca/wiki/`. Obsidian'da repo kökünü değil **bu klasörü** açın, yoksa `node_modules` da indekslenir.

## Genel

- [[Mimari]]: yığın, dizinler, sayfa haritası
- [[Veritabani]]: tablolar ve canlıya şema uygulama prosedürü
- [[Akis]]: fikirden canlıya (lokal, doğrulama, commit, Vercel)
- [[Deploy]]: canlı ortam, ortam değişkenleri, kırmızı çizgiler

## Özellikler

- [[Vitrin-ve-Urunler]]: kategoriler, renk varyantları, ürün kartı
- [[Stok]]: tek kaynak kuralı (`lib/stock.ts`)
- [[Sepet]]: istemci tarafı sepet
- [[Odeme-ve-Siparis]]: Iyzico akışı, iki durum alanı, kargo ücreti
- [[Uyelik]]: opsiyonel hesap, oturum, şifre sıfırlama
- [[Admin-Paneli]]: dashboard, siparişler, ürünler, üyeler
- [[E-posta]]: Resend, şablonlar, tuzaklar
- [[Gunluk-Bakim]]: cron, hatırlatma ve otomatik iptal
- [[Gorseller]]: Cloudinary'den R2'ye taşıma
- [[SEO]]: metadata, JSON-LD, sitemap

## Büyüme (satışı artırma)

- [[Buyume-Plani]]: yol haritası, **buradan başlayın**
- [[Meta-Pixel-ve-CAPI]]: tarayıcı ve sunucu tarafı dönüşüm ölçümü
- [[Katalog-ve-Dinamik-Reklam]]: ürün feed'i, Advantage+ katalog reklamları
- [[Kampanya-Olcumu]]: UTM, kaynak bazlı ciro, ROAS
- [[Donusum-Iyilestirme]]: sitedeki satış engelleri ve fırsatlar
- [[Yasal-Cerceve]]: KVKK, çerez rızası, ticari ileti (İYS)

## Durum

- [[Yapilacaklar]]: bekleyen işler
- [[Kararlar]]: neden böyle yapıldı (tekrar tartışılmasın diye)

## Kurallar (bu vault için)

- Yeni özellik eklenince ilgili not güncellenir; not yoksa `ozellikler/` ya da `buyume/` altına açılır ve buraya link eklenir.
- Kodu kopyalamak yerine **dosya yolunu gösterin** (`src/lib/stock.ts` gibi).
- Proje kuralları repodaki `CLAUDE.md` dosyasındadır. Bu vault onu tekrarlamaz, açıklar ve bağlar.
- Uzun çalışma belgeleri repo kökünde durur: `R2_TASIMA.md`, `IYZICO_ORDER_CONTEXT.md`.
- **Müşteri kişisel verisi (isim, e-posta, adres) buraya yazılmaz.** Vault git'te.
