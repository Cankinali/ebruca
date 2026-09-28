---
tags: [durum, kritik]
---

# Olaylar ve Dersler

Yaşanan sorunların kök sebebi ve dersi. **Bir şey bozulduğunda önce buraya bakın**; aynı tuzak büyük ihtimalle daha önce yaşandı. Yeni olay en üste eklenir. Müşteri kişisel verisi yazılmaz.

## Hızlı teşhis tablosu

| Belirti | İlk bakılacak | Olay |
|---|---|---|
| Karttan para çekildi ama site "ödeme doğrulanamadı" diyor | `vercel logs … --query "Tutar"`; siparişin `paymentToken`'ı ile `retrieveCheckout` | [[#28.09 — Taksitli ödeme iptal ediliyordu]] |
| Canlıda bir ürünün fiyatı/rengi saçma | Son yerel testler `next start` ile mi yapıldı? | [[#28.09 — "Yerel" test canlı veritabanına yazdı]] |
| Görseller bazı telefonlarda kırık, bazılarında sağlam | `dig cdn.ebruca.com @<operatör DNS>` NXDOMAIN mi? | [[#26.09 — DNS yayılımı: bazı operatörlerde görseller kırık]] |
| Admin fotoğraf yükleyemiyor | Loglarda `/api/admin/upload` 413 mü, 500 (`sharp`) mı? | [[#26.09 — Admin fotoğraf yükleyemiyor (413 / HEIC)]], [[#26.09 — sharp Vercel'de açılmadı]] |
| Vercel kota uyarısı (Active CPU / Edge Requests) | Usage → proje dağılımı; `force-dynamic`, layout'ta `cookies()`, `<Link>` prefetch | [[#25-27.09 — Vercel Hobby kotası %92]] |
| Bütün görseller kırık (401) | Görsel sağlayıcının hesap/kota durumu — kod değil | [[#29.08 — Cloudinary hesabı kapandı]] |
| Sipariş maili gitmedi ama log temiz | Gönderim `after()` içinde mi? Resend `{ error }` kontrol ediliyor mu? | [[#28.09 — Onay maili yarıda kesilebiliyordu]], [[E-posta]] |

---

## 28.09 — Taksitli ödeme iptal ediliyordu

- **Belirti:** Müşteri 3 taksitle ödedi; karttan vade farkıyla 8.370,66 TL çekildi, site "ödeme doğrulanamadı" dedi, sipariş `failure/cancelled` oldu (EB98601892, sipariş tutarı 7.915 TL).
- **Kök sebep:** `api/odeme/sonuc` Iyzico'nun `paidPrice`'ını sipariş toplamıyla **birebir** karşılaştırıyordu. `paidPrice` kart sahibinden çekilen tutardır, **taksitte vade farkı eklenir**. `baslat` 5.000 TL üstünde taksiti açtığı için o tutarın üstündeki her taksitli ödeme bu hataya düşecekti.
- **Düzeltme:** `price` (sepet) = `order.subtotal` birebir, `paidPrice` ≥ `order.total`. Sipariş dönüş yeni kodla yeniden POST edilerek kurtarıldı (stok düştü, onay maili gitti). 34 başarısız sipariş Iyzico'da tek tek sorgulandı, başka etkilenen yok. **cicek'te de aynı hata vardı**, düzeltildi.
- **Ders:** Ödeme sağlayıcısının "fiyat" ve "ödenen fiyat" alanları farklı şeylerdir; tamper kontrolü **eksik ödemeyi** yakalamalı, fazlasını (vade farkı) değil. Taksitli bir test ödemesi canlıya çıkmadan denenmeli. Kurtarma adımları → [[Odeme-ve-Siparis]]

## 28.09 — "Yerel" test canlı veritabanına yazdı

- **Belirti:** Canlıda "Lacivert Bluz" 54.321 TL ve yanlış renklerle göründü (25-28.09 arası, ~2 gün).
- **Kök sebep:** `next start` (üretim modu) `.env.production.local`'ı otomatik yükler → `DATABASE_URL` canlı Turso. Admin PUT testleri canlı ürüne yazdı; "geri yükleme" diye yerel `dev.db` kopyalandı, canlı hiç düzelmedi.
- **Düzeltme:** Ürün admin API ile özgün değerlerine döndürüldü; o ürünle sipariş yoktu.
- **Ders:** Yerel üretim testinde `DATABASE_URL=file:./prisma/dev.db TURSO_AUTH_TOKEN=` zorlanır ve **testten önce hangi DB'ye bağlanıldığı doğrulanır** (ör. ürün sayısı: yerel ≠ canlı). `CLAUDE.md`'de de yazılı.

## 28.09 — Onay maili yarıda kesilebiliyordu

- **Kök sebep:** `sendOrderConfirmation(...).catch()` await edilmeden çağrılıyordu; Vercel cevap döndükten sonra fonksiyonu kesebilir.
- **Düzeltme:** `after(() => …)` (Next 16) — gönderim bitene kadar fonksiyon açık kalır. cicek'te mağaza bildirimi de aynı şekilde.
- **Ders:** Cevaptan sonra yapılacak her iş (`e-posta`, `CAPI`, `log`) `after()` ile. Resend anahtarı "sadece gönderim" yetkili olduğu için gönderilenler API'den listelenemiyor; kontrol resend.com panelinden.

## 26.09 — DNS yayılımı: bazı operatörlerde görseller kırık

- **Belirti:** Bir admin (iPhone 17 Pro Max, mobil operatör) fotoğraf yükledi, önizleme "?" gösterdi; diğer telefonda sorun yok.
- **Kök sebep:** Nameserver Hostinger → Cloudflare taşındı; bazı Türk operatörleri eski `.com` delegasyonunu **48 saate kadar** tutuyor. Yeni eklenen `cdn` kaydı Hostinger'da yoktu → o ağlarda `NXDOMAIN`. Hostinger, NS değişince DNS düzenlemeye izin vermiyor, sonradan eklenemedi.
- **Düzeltme (geçici):** Görsel yüklenemezse `layout.tsx`'teki küçük script aynı dosyayı `www…/r2/` proxy'sinden ister (Vercel rewrite). Yalnızca etkilenen ziyaretçiler Vercel kotası harcar. **28.09 sonrası kaldırılacak** → [[Yapilacaklar]]
- **Ders:** DNS taşımadan ÖNCE yeni alt alan adları (ör. `cdn`) **eski sağlayıcıya da** eklenmeli; yayılım bitene kadar eski NS de doğru cevap versin.

## 26.09 — Admin fotoğraf yükleyemiyor (413 / HEIC)

- **Kök sebep:** Vercel istek gövdesi **4,5 MB** ile sınırlı; telefon fotoğrafları koda ulaşmadan 413 alıyordu (logda "GET" görünür). Form hatayı hiç göstermiyordu. Mac Safari HEIC gönderebiliyor.
- **Düzeltme:** `src/lib/compress-image.ts` — 3 MB üstü ya da desteklenmeyen dosya tarayıcıda en fazla 2400px JPEG'e küçültülür; hata yükleme alanının yanında gösterilir.
- **Ders:** Vercel'e dosya yükleyen her form ya tarayıcıda küçültmeli ya da doğrudan depolamaya (presigned URL) yüklemeli. Hata mesajı sessiz kalmamalı.

## 26.09 — sharp Vercel'de açılmadı

- **Belirti:** R2'ye geçince canlıda yükleme 500: `libvips-cpp.so … cannot open shared object file`.
- **Kök sebep:** Next'in dosya izleme adımı sharp'ın dinamik yüklediği Linux `.so` dosyasını pakete almıyor. Mac'teki yerel testte görünmez.
- **Düzeltme:** `next.config.ts` → `outputFileTracingIncludes` ile `@img/sharp-linux-x64` ve `@img/sharp-libvips-linux-x64`.
- **Ders:** Native bağımlılık (sharp vb.) ekleyen değişiklik **canlıda** gerçek bir istekle test edilmeli; yerel Mac testi yetmez.

## 25-27.09 — Vercel Hobby kotası %92

- **Belirti:** Takımın (20+ proje) Fluid Active CPU'su 3 sa 41 dk / 4 sa, Edge Requests 782 bin / 1 milyon. Aşılırsa tüm siteler durabilir.
- **Kök sebepler:**
  1. Vitrin sayfalarında `force-dynamic` → her ziyaret ve bot isteği fonksiyon çalıştırıyordu (ebruca CPU'nun %60'ı). cicek'te ayrıca kök layout `cookies()` okuyordu.
  2. ISR'ın ilk hâli saatlik yenileme + her admin kaydında **tüm siteyi** geçersiz kılıyordu.
  3. `<Link>` prefetch: tek sayfa görüntülemesi ~90-105 Edge Request (ekrandaki her ürün kartı/link).
- **Düzeltme:** ISR `revalidate = 86400` + hedefli `revalidateVitrin(slugs)`; vitrin linklerinde `prefetch={false}` (ebruca, cicek, posthane). Sonuç: günlük CPU 8-11 dk → ~2,5 dk; sayfa başına istek 104 → 14.
- **Ders:** Şablondan kopyalanan projelerde ilk iş `force-dynamic`, layout'ta çerez okuması ve prefetch kontrolü. Ölçüm: Playwright ile sayfa başına istek sayımı; Hobby'de CLI metrikleri kapalı.

## 29.08 — Cloudinary hesabı kapandı

- **Belirti:** Bütün görseller 401.
- **Kök sebep:** Ücretsiz planın kotası **trafik** yüzünden aşıldı; kodda hata yoktu. Ücretli plana geçmek zorunda kalındı.
- **Düzeltme:** 26.09'da Cloudflare R2'ye (`cdn.ebruca.com`, trafik ücretsiz) taşındı, Cloudinary iptal edildi. Ayrıntı: `R2_TASIMA.md`, [[Gorseller]]
- **Ders:** "Görseller gitti" şikayetinde önce hesap/kota. Görsel sağlayıcı seçerken **trafik** ücretine bakın.
