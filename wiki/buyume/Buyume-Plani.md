---
tags: [buyume, moc]
---

# Büyüme Planı

Hedef: Meta (Instagram + Facebook) reklamları ve site içi iyileştirmelerle **ölçülebilir** satış artışı.

## Bugünkü durum (23.09.2026)

| | Durum |
|---|---|
| Meta Pixel | ❌ Yok |
| Conversions API (sunucu) | ❌ Yok |
| Google Analytics / başka ölçüm | ❌ Yok (`/cerez` sayfası GA'dan bahsediyor ama kurulu değil) |
| Ürün kataloğu feed'i | ❌ Yok |
| Siparişte kaynak / UTM | ❌ Tutulmuyor |
| Çerez rızası | ⚠️ Yalnızca "Kabul Et" butonu var, reklam çerezleri için geçerli rıza sayılmaz |
| Pazarlama izni (e-posta/SMS) | ❌ Toplanmıyor |
| Instagram | ✅ @ebrucabutik17 (organik kanal) |

Özetle: bugün reklam verilse **hangi reklamın satış getirdiği bilinemez** ve Meta'nın algoritması öğrenemez. Önce ölçüm kurulmalı.

## Sıralama

Her adım bir öncekinin üzerine kurulur.

### Faz 0: Zemin
1. ~~Sepet ve ödeme hatası sızıntısını kapat~~ ✅ 23.09.2026 → [[Donusum-Iyilestirme]]
2. **R2 taşımasını bitir** → [[Gorseller]] (trafik artınca Cloudinary faturası artar)
3. **Çerez rızasını düzelt** (kabul et / reddet / tercihler) → [[Yasal-Cerceve]]

### Faz 1: Ölçüm
4. Meta Business Manager, Pixel ve alan adı doğrulaması
5. Tarayıcı olayları: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase → [[Meta-Pixel-ve-CAPI]]
6. Sunucu `Purchase` olayı (CAPI), `event_id` ile tekilleştirme
7. UTM ve kaynak bilgisini siparişe kaydetme, dashboard'da kaynak bazlı ciro → [[Kampanya-Olcumu]]

### Faz 2: Katalog
8. Ürün feed endpoint'i (renk başına bir öğe) → [[Katalog-ve-Dinamik-Reklam]]
9. Commerce Manager'a bağlama, Instagram ürün etiketleri

### Faz 3: Kampanyalar
10. Yeniden hedefleme: ürüne bakıp almayan, sepete ekleyip almayan
11. Advantage+ katalog / alışveriş kampanyaları
12. Satın alanlardan benzer kitle (lookalike)

### Faz 4: Tekrar satış
13. Pazarlama izni toplama + İYS → e-posta kampanyaları → [[Yasal-Cerceve]]

## Başarı ölçütleri

- ROAS (reklam harcaması başına ciro), kaynak bazlı ciro
- Dönüşüm oranı: ziyaret → sepet → ödeme başlatma → ödeme başarılı
- Ödeme başlatıp tamamlamayan oranı (`paymentStatus != 'success'` / tümü): mevcut veriyle **bugün de ölçülebilir**
- Ortalama sepet tutarı ve 5.000 TL eşiğini geçen siparişlerin payı

## Karar günlüğü

Büyüme kararları ve sonuçları → [[Kararlar]]
