-- ============================================================================
-- Sipariş hatırlatma — canlı (Turso) veritabanına uygulanacak şema değişikliği
-- Tarih: 2026-08-08
-- ============================================================================
--
-- Tamamlanmamış sipariş hatırlatmasının bir kez gönderildiğini işaretler.
-- Order tablosuna yalnızca nullable bir sütun ekler; mevcut satırlara
-- dokunulmaz (tüm eski siparişlerde NULL kalır — zaten 72 saati geçtikleri
-- için hatırlatma penceresinin dışındalar).
--
-- ÇALIŞTIRMA:
--   .env.production.local bilgileriyle bu dosyayı Turso'ya uygulayın.
--
-- NOT: SQLite'ta "ADD COLUMN IF NOT EXISTS" yoktur. İkinci kez çalıştırılırsa
-- "duplicate column name: reminderSentAt" hatası verir; bu zararsızdır ve
-- sütunun zaten eklendiği anlamına gelir.
-- ============================================================================

ALTER TABLE "Order" ADD COLUMN "reminderSentAt" DATETIME;
