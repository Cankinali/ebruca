-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL DEFAULT 'Ebruca',
    "code" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "originalPrice" REAL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "sizes" TEXT NOT NULL DEFAULT '[]',
    "colors" TEXT NOT NULL DEFAULT '[]',
    "description" TEXT NOT NULL DEFAULT '',
    "measurements" TEXT,
    "stock" TEXT NOT NULL DEFAULT 'in_stock',
    "isNew" BOOLEAN NOT NULL DEFAULT true,
    "isBestseller" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
