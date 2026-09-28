-- ============================================================================
-- Meta Pixel + Conversions API — canlı (Turso) veritabanına uygulanacak şema
-- Tarih: 2026-09-28
-- ============================================================================
--
-- Order tablosuna yalnızca varsayılan değerli / nullable sütunlar ekler;
-- mevcut satırlara dokunulmaz. KOD DEPLOY EDİLMEDEN ÖNCE uygulanmalı:
-- Prisma varsayılan olarak tüm sütunları seçtiği için sütunlar yokken yeni kod
-- Order sorgularında hata verir (eski kod ise ek sütunları görmezden gelir).
--
-- Iyzico dönüşü siteler arası POST olduğu için _fbp/_fbc çerezleri ve istemci
-- bilgisi o anda gelmez; /api/odeme/baslat bunları (yalnızca pazarlama onayı
-- varsa) buraya yazar, /api/odeme/sonuc CAPI Purchase'ta buradan okur.
--
-- ÇALIŞTIRMA: önce yedek (backups/), sonra .env.production.local bilgileriyle
-- Turso'ya uygulayın. İkinci kez çalıştırılırsa "duplicate column name" hatası
-- zararsızdır. Boolean'lar bu veritabanında INTEGER (0/1) olarak tutuluyor.
-- ============================================================================

ALTER TABLE "Order" ADD COLUMN "metaConsent" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN "metaFbp" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "metaFbc" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "clientIp" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "userAgent" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "metaPurchaseSentAt" DATETIME;
