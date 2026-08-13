@AGENTS.md

# Ebruca — Genel Akış ve Mimari

Next.js 16 (App Router) + Prisma 7 + SQLite/Turso ile çalışan bir e-ticaret
sitesi. Kod, yorumlar ve route isimleri **Türkçe**; bu tutarlılığı koruyun
(`/urun`, `/sepet`, `/odeme`, `/hesabim`, `/api/auth/kayit` …).

## Yığın

| Katman | Teknoloji |
| --- | --- |
| Framework | Next.js 16 App Router, React 19, TypeScript |
| Stil | Tailwind v4 |
| ORM | Prisma 7 — driver adapter ile (`@prisma/adapter-libsql`, `@prisma/adapter-better-sqlite3`) |
| Veritabanı | Yerel: SQLite dosyası · Canlı: Turso (libSQL) |
| Ödeme | Iyzico Checkout Form (barındırılan ödeme sayfası) |
| E-posta | Resend |
| Görsel | Cloudinary (custom Next image loader) |
| Barındırma | Vercel (+ Vercel Cron) |

## Üç ana bölüm

### 1. Vitrin (müşteri tarafı)

Anasayfa → kategori/tüm ürünler → ürün detayı → sepet → ödeme.

- Ürünler `Product` tablosunda; JSON string alanlar TypeScript tarafında
  parse edilir (`lib/db-helpers.ts`).
- **Sepet** `lib/cart-context.tsx` içinde React state + `localStorage`
  (7 gün geçerli). Sunucuda tutulmaz.
- **Renk varyantları**: bir ürün her renk için ayrı kart olarak listelenebilir
  (`lib/products-display.ts`). Renge özel görsel, beden ve stok olabilir.

### 2. Üyelik (opsiyonel — sipariş için zorunlu değil)

Misafir checkout her zaman açıktır; üyelik sadece kolaylık sağlar.

- `lib/auth.ts` tek kaynak: scrypt ile şifre özetleme, oturum üretimi,
  `getCurrentUser()` DAL'ı (React `cache` ile sarılı).
- Oturum token'ı çerezde ham, veritabanında **SHA-256 özeti** olarak durur.
- Çerez: httpOnly + sameSite=lax + canlıda secure, 30 gün.
- 5 hatalı girişte hesap 15 dk kilitlenir (`User.lockedUntil`).
- Şifre sıfırlama: tek kullanımlık, 1 saat geçerli token; şifre değişince
  o kullanıcının tüm oturumları kapatılır.
- **Geçmiş misafir siparişleri e-postaya göre hesaba BAĞLANMAZ.** E-posta
  doğrulaması yok; olsaydı biri başkasının adresiyle kayıt olup o kişinin
  sipariş geçmişini görebilirdi. E-posta doğrulaması eklenirse açılabilir.

### 3. Admin paneli (`/admin`)

Tek şifreli giriş. `proxy.ts` `/admin/*` yollarını korur, API'ler ayrıca
`requireAdmin()` çağırır (iki katman).

Bölümler: Dashboard · Siparişler · Ürünler · Üyeler.

## Sipariş akışı (en kritik yol)

```
/odeme formu
  → POST /api/odeme/baslat
      · fiyatlar İSTEMCİDEN ALINMAZ, DB'den okunur
      · stok kontrolü (lib/stock.ts)
      · kargo ücreti sunucuda hesaplanır
      · Order kaydı oluşur (paymentStatus: 'pending')
      · Iyzico ödeme oturumu açılır
  → Iyzico barındırılan ödeme sayfası (kart bilgisi bize hiç gelmez)
  → GET/POST /api/odeme/sonuc  (callback)
      · token Iyzico'ya sunucu tarafında doğrulatılır
      · conversationId ve tutar manipülasyon kontrolü
      · başarılıysa: paymentStatus 'success', stok düşer, onay e-postası
  → /siparis-tamamlandi
```

**İki ayrı durum alanı vardır, karıştırmayın:**

| Alan | Anlamı | Değerler |
| --- | --- | --- |
| `paymentStatus` | Ödemenin/Iyzico'nun sonucu | `pending` `success` `failure` |
| `status` | Operasyonel süreç | `pending` `confirmed` `shipped` `delivered` `cancelled` |

Admin ana listesi varsayılan olarak yalnızca `paymentStatus='success'`
olanları gösterir; ödemesi tamamlanmamışlar ayrı sekmededir.

## Stok kuralı — tek kaynak

`lib/stock.ts`. Kural: **seçili renge ait dolu bir stok tablosu varsa o
geçerlidir, yoksa düz `sizeStock` kullanılır.**

Bu kuralı asla kopyalamayın; ürün sayfası, ürün kartı, ödeme öncesi kontrol
ve ödeme sonrası stok düşümü aynı fonksiyonları çağırır. (Daha önce dört
yerde ayrı yazılmıştı ve ödeme öncesi kontrol ayrışıp renk bazlı ürünlerde
stok denetimini tamamen atlıyordu.)

## Günlük bakım

`GET /api/cron/siparis-bakim` — Vercel Cron her gün 06:00 UTC (TR 09:00).

1. **Hatırlatma** (24-72 saat): ödemesi tamamlanmamış siparişin sahibine
   tek seferlik işlem bildirimi. Pazarlama dili YOK — indirim/aciliyet
   eklenirse ticari elektronik ileti olur ve onay + İYS kaydı gerekir
   (6563 sayılı kanun).
2. **İptal** (72 saatten eski): yalnızca `status='cancelled'` yapılır;
   `paymentStatus` korunur, böylece sipariş panelde kalır ve geri alınabilir.

Her ikisinde de `paymentId` dolu olan siparişlere dokunulmaz — Iyzico'da
kayıtlı ödeme var demektir, insan incelemesi gerekir.

Yetki: `CRON_SECRET` (Bearer) veya admin oturumu.

## E-posta

`lib/email.ts` — tek dosyada tüm şablonlar, ortak `emailLayout()`.

- **Resend SDK 4xx/5xx'te exception FIRLATMAZ**, `{ data, error }` döndürür.
  Her gönderimde dönen `error` kontrol edilmeli. (Bu gözden kaçtığı için
  aylarca sessizce başarısız oldu.)
- Tüm göndericiler `Promise<boolean>` döner.
- Müşteri e-postalarında `Reply-To` mağazanın gerçek gelen kutusudur —
  gönderim alan adının MX kaydı olmayabilir, yanıtlar kaybolmasın.
- Gönderici `resend.dev` içeriyorsa bir kez uyarı loglanır (o adresle
  yalnızca hesap sahibine gönderim yapılabilir).

## Güvenlik alışkanlıkları

- Fiyat, kargo ve stok **daima sunucuda** hesaplanır; istemciden gelen
  değerlere güvenilmez.
- Hesap varlığı sızdırılmaz: giriş ve şifre sıfırlamada tek tip mesaj.
- `lib/rate-limit.ts` — bellek içi, IP başına. Sunucu örneği başına
  çalışır (dağıtık değil), kaba trafiği yavaşlatmak içindir.
  Kayıt / giriş / şifre sıfırlama / iletişim / sipariş sorgulama korumalı.
- Sipariş sorgulama: sipariş no **ve** e-posta birlikte tutmalı; yanıtta
  tam adres dönmez.
- `passwordHash` hiçbir API yanıtında yer almaz.

## Veritabanı — canlıya şema uygulama (DİKKAT)

`prisma.config.ts` datasource URL'ini **sabit olarak yerel dev.db'ye** yazar.
Bu yüzden `prisma db push` / `migrate` komutları `DATABASE_URL` ne olursa
olsun yerel dosyaya gider ve Turso'ya dokunmadan "başarılı" der.

**Canlı şema değişikliği** `prisma/manual/` altındaki elle yazılmış SQL
script'leriyle, `.env.production.local` bilgileri kullanılarak uygulanır.
Script'ler `ALTER TABLE ADD COLUMN` tercih eder; Prisma'nın ürettiği
"tabloyu kopyala-sil-yeniden yarat" yöntemi canlı sipariş tablosunda
gereksiz risktir.

Uygulamadan önce **yedek alın** (`backups/`, git dışında — müşteri kişisel
verisi içerir).

`prisma/migrations/` klasörü eskimiştir, kullanılmıyor.

## Ortam değişkenleri

Yerel geliştirme `.env`, canlı Turso bilgileri `.env.production.local`
(ikisi de git dışında). Canlı uygulamanın kendi değişkenleri Vercel'de.

`DATABASE_URL` `TURSO_AUTH_TOKEN` `ADMIN_PASSWORD` `ADMIN_SECRET`
`CRON_SECRET` `IYZIPAY_API_KEY` `IYZIPAY_SECRET_KEY` `IYZIPAY_BASE_URL`
`RESEND_API_KEY` `EMAIL_FROM` `REPLY_TO_EMAIL` `CLOUDINARY_*`
`STORAGE_PROVIDER` `NEXT_PUBLIC_SITE_URL`

## Çalışma notları

- `npm run dev` · `npm run build` · `npm run lint` · `npx prisma generate`
- Lint'te **14 sorun baştan beri var** (çoğu `react/no-unescaped-entities`).
  Yeni hata eklemeyin; sayı 14'ün üstüne çıkıyorsa sizin değişikliğinizdendir.
- Kök layout bilerek statiktir. Oturum bilgisi `lib/use-session.ts` ile
  istemci tarafında çekilir; layout'ta `cookies()` okunsaydı tüm sayfalar
  dinamik render'a düşerdi.
- Test altyapısı yok. Değişiklikleri geçici `.tmp.mts` script'leriyle
  yerel veritabanına karşı doğrulayın ve sonra silin.
