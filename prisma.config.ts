import "dotenv/config";
import path from "path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // DİKKAT: URL burada sabittir — DATABASE_URL ortam değişkeni YOK SAYILIR.
  // Bu yüzden `prisma db push` / `migrate` komutları DAİMA yerel dev.db'ye
  // yazar, canlı Turso veritabanına asla dokunmaz (ve yine de "başarılı" der).
  // Canlı şema değişiklikleri prisma/manual/ altındaki SQL script'leriyle,
  // .env.production.local bilgileri kullanılarak elle uygulanır.
  datasource: {
    url: `file:${path.join(process.cwd(), "prisma", "dev.db")}`,
  },
});
