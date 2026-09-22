---
tags: [genel, kritik]
---

# Veritabanı

Şema: `prisma/schema.prisma`. Yerelde `dev.db` (SQLite), canlıda Turso.

## Tablolar

| Model | Ne tutar |
|---|---|
| `Product` | Ürün. `images`, `sizes`, `colors`, `sizeStock`, `colorImages`, `colorSizes`, `colorSizeStock` alanları **JSON string**, `lib/db-helpers.ts` parse eder |
| `Order` | Sipariş: müşteri, adres, tutarlar, kargo, Iyzico alanları, `status` + `paymentStatus`, `reminderSentAt` |
| `OrderItem` | Satır: sipariş anındaki ad, fiyat, beden, renk ve görselin kopyası |
| `User` | Üye: scrypt özeti, kayıtlı adres, KVKK/sözleşme onay damgaları, kilit alanları |
| `Session` | Oturum (token'ın SHA-256 özeti) |
| `PasswordResetToken` | Tek kullanımlık sıfırlama token'ı |

Kategoriler tabloda **değil**, `src/lib/data.ts` dosyasında sabit.

## ⚠️ Canlıya şema değişikliği

`prisma.config.ts` datasource'u **sabit olarak yerel dev.db'ye** bağlar. `prisma db push` / `migrate` Turso'ya dokunmadan "başarılı" der.

Doğru yöntem:

1. **Yedek alın** → `backups/` (git dışında, müşteri verisi içerir)
2. `prisma/manual/YYYY-MM-DD-konu.sql` yazın, `ALTER TABLE ... ADD COLUMN` tercih edin (tabloyu kopyala-sil-yeniden-yarat yöntemi yok)
3. `.env.production.local` bilgileriyle Turso'ya uygulayın
4. `schema.prisma` dosyasını güncelleyip `npx prisma generate` çalıştırın. `src/generated/prisma` da commit'e girer.

Uygulanmış script'ler: `2026-08-08-uyelik-sistemi.sql`, `2026-08-08-siparis-hatirlatma.sql`.

`prisma/migrations/` eski, kullanılmıyor.

## Büyüme için beklenen şema ekleri

[[Kampanya-Olcumu]] ve [[Meta-Pixel-ve-CAPI]] işleri `Order` tablosuna kaynak ve eşleştirme alanları ekleyecek (`utmSource`, `fbp`, `fbc` …). Bunlar da yukarıdaki prosedürle, `ADD COLUMN` ile eklenecek.
