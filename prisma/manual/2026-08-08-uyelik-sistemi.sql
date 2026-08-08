-- ============================================================================
-- Üyelik sistemi — canlı (Turso) veritabanına uygulanacak şema değişikliği
-- Tarih: 2026-08-08
-- ============================================================================
--
-- NEDEN ELLE SQL?
-- `prisma db push` bu projede canlıya uygulanamaz: prisma.config.ts datasource
-- URL'ini sabit olarak yerel dosyaya (prisma/dev.db) yazar, bu yüzden komut
-- DATABASE_URL ne olursa olsun daima yerel veritabanına gider ve Turso'ya
-- dokunmadan "başarılı" der.
--
-- NEDEN PRISMA'NIN ÜRETTİĞİ SCRIPT DEĞİL?
-- `prisma migrate diff` çıktısı, Order tablosuna userId sütununu eklemek için
-- tabloyu kopyalayıp DROP edip yeniden oluşturur. Veriyi korur ama canlı sipariş
-- tablosunda gereksiz risktir. Aşağıdaki sürüm bunun yerine ALTER TABLE ADD
-- COLUMN kullanır — SQLite bunu, varsayılan değer NULL olduğu sürece REFERENCES
-- içeren sütunlar için de destekler. Order tablosuna dokunulmaz.
--
-- ÇALIŞTIRMA:
--   turso db shell <veritabani-adi> < prisma/manual/2026-08-08-uyelik-sistemi.sql
--
-- Tekrar çalıştırılabilir: IF NOT EXISTS kullanıldığı için ikinci kez
-- çalıştırmak hata vermez. Tek istisna ALTER TABLE — aşağıdaki nota bakın.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1) Üye tablosu
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "district" TEXT NOT NULL DEFAULT '',
    "postalCode" TEXT NOT NULL DEFAULT '',
    "kvkkAcceptedAt" DATETIME,
    "termsAcceptedAt" DATETIME,
    "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- ---------------------------------------------------------------------------
-- 2) Oturum tablosu
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
CREATE INDEX IF NOT EXISTS "Session_expiresAt_idx" ON "Session"("expiresAt");

-- ---------------------------------------------------------------------------
-- 3) Şifre sıfırlama token tablosu
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");
CREATE INDEX IF NOT EXISTS "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- ---------------------------------------------------------------------------
-- 4) Order tablosuna üyelik bağlantısı
--
-- NOT: SQLite'ta "ADD COLUMN IF NOT EXISTS" yoktur. Bu script ikinci kez
-- çalıştırılırsa yalnızca bu satır "duplicate column name: userId" hatası verir;
-- bu hata zararsızdır ve sütunun zaten eklendiği anlamına gelir.
-- ---------------------------------------------------------------------------
ALTER TABLE "Order" ADD COLUMN "userId" TEXT
    REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId");
CREATE INDEX IF NOT EXISTS "Order_email_idx" ON "Order"("email");
