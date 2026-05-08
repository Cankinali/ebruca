import { PrismaClient } from '@/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createClient() {
  const dbUrl = process.env.DATABASE_URL;

  // === Turso (libSQL) — canlı ortam ===
  if (dbUrl?.startsWith('libsql://') || dbUrl?.startsWith('https://')) {
    const adapter = new PrismaLibSql({
      url: dbUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
  }

  // === Local SQLite (better-sqlite3) — geliştirme ===
  const localPath = dbUrl?.startsWith('file:')
    ? dbUrl.replace('file:', '').replace(/^\.\//, '')
    : 'prisma/dev.db';

  const fullPath = path.isAbsolute(localPath)
    ? localPath
    : path.join(process.cwd(), localPath.includes('prisma/') ? '' : 'prisma', localPath);

  const adapter = new PrismaBetterSqlite3({ url: fullPath });
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

export const prisma = globalForPrisma.prisma || createClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
