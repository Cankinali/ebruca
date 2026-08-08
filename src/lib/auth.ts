/**
 * Üyelik altyapısı — şifre özetleme, oturum yönetimi ve veri erişim katmanı (DAL).
 *
 * Tasarım notları:
 * - Şifreler Node'un yerleşik `scrypt`i ile özetlenir (ek bağımlılık yok).
 * - Oturum çerezinde ham token durur; veritabanında SHA-256 özeti saklanır.
 *   Böylece DB sızıntısı tek başına oturum ele geçirmeye yetmez.
 * - E-postalar daima küçük harfe normalize edilir (SQLite unique indeksi
 *   büyük/küçük harf duyarlıdır — "Ali@x.com" ve "ali@x.com" aksi halde iki kayıt olur).
 */
import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import {
  randomBytes,
  scrypt as scryptCb,
  timingSafeEqual,
  createHash,
} from 'node:crypto';
import { promisify } from 'node:util';
import { prisma } from './prisma';

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

export const SESSION_COOKIE = 'ebruca_session';
const SESSION_DAYS = 30;
const RESET_TOKEN_MINUTES = 60;

/** Art arda başarısız giriş denemesinden sonra hesap geçici kilitlenir. */
const MAX_FAILED_LOGINS = 5;
const LOCK_MINUTES = 15;

// ---------------------------------------------------------------------------
// Şifre
// ---------------------------------------------------------------------------

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const key = await scrypt(password.normalize('NFKC'), salt, KEY_LENGTH);
  return `scrypt:${salt.toString('hex')}:${key.toString('hex')}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [scheme, saltHex, keyHex] = stored.split(':');
  if (scheme !== 'scrypt' || !saltHex || !keyHex) return false;

  const expected = Buffer.from(keyHex, 'hex');
  const actual = await scrypt(
    password.normalize('NFKC'),
    Buffer.from(saltHex, 'hex'),
    KEY_LENGTH
  );
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(actual, expected);
}

/** Kayıt/şifre yenileme için ortak şifre kuralı. Hata mesajı döner, geçerliyse null. */
export function validatePassword(password: string): string | null {
  if (!password || password.length < 8) return 'Şifre en az 8 karakter olmalı.';
  if (password.length > 200) return 'Şifre çok uzun.';
  return null;
}

export function isValidEmail(email: string): boolean {
  // Kasıtlı olarak sade: RFC'yi tam doğrulamak yerine bariz hataları yakalar.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

// ---------------------------------------------------------------------------
// Oturum
// ---------------------------------------------------------------------------

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Yeni oturum oluşturur ve httpOnly çerezi yazar.
 * Sadece Route Handler / Server Action içinden çağrılabilir (çerez yazımı gerektirir).
 */
export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);

  await prisma.session.create({
    data: { tokenHash: hashToken(token), userId, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

/** Mevcut oturumu hem veritabanından hem çerezden siler. */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    // deleteMany: token zaten geçersizse hata fırlatmasın.
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  cookieStore.delete(SESSION_COOKIE);
}

/** Bir kullanıcının tüm oturumlarını kapatır (şifre değişiminde kullanılır). */
export async function destroyAllSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
}

/**
 * Veri Erişim Katmanı (DAL). Oturum çerezini doğrular ve kullanıcıyı döner.
 * React `cache` ile sarıldığı için tek render içinde tekrar tekrar çağrılabilir.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.session.deleteMany({ where: { id: session.id } });
    return null;
  }

  const { user } = session;
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    address: user.address,
    city: user.city,
    district: user.district,
    postalCode: user.postalCode,
  };
});

// ---------------------------------------------------------------------------
// Kaba kuvvet koruması
// ---------------------------------------------------------------------------

export function lockRemainingMinutes(lockedUntil: Date | null): number {
  if (!lockedUntil) return 0;
  const ms = lockedUntil.getTime() - Date.now();
  return ms > 0 ? Math.ceil(ms / 60_000) : 0;
}

export async function registerFailedLogin(
  userId: string,
  currentCount: number
): Promise<void> {
  const nextCount = currentCount + 1;
  await prisma.user.update({
    where: { id: userId },
    data: {
      failedLoginCount: nextCount,
      lockedUntil:
        nextCount >= MAX_FAILED_LOGINS
          ? new Date(Date.now() + LOCK_MINUTES * 60_000)
          : null,
    },
  });
}

export async function clearFailedLogins(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { failedLoginCount: 0, lockedUntil: null },
  });
}

// ---------------------------------------------------------------------------
// Şifre sıfırlama token'ları
// ---------------------------------------------------------------------------

/** Sıfırlama token'ı üretir. Ham token e-postaya, özeti veritabanına gider. */
export async function createResetToken(userId: string): Promise<string> {
  // Kullanıcının bekleyen eski token'larını geçersiz kıl.
  await prisma.passwordResetToken.deleteMany({
    where: { userId, usedAt: null },
  });

  const token = randomBytes(32).toString('base64url');
  await prisma.passwordResetToken.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt: new Date(Date.now() + RESET_TOKEN_MINUTES * 60_000),
    },
  });
  return token;
}

/** Token'ı doğrular; geçerliyse kullanıcı id'sini döner. Tek kullanımlıktır. */
export async function consumeResetToken(
  token: string
): Promise<string | null> {
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) return null;

  await prisma.passwordResetToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });
  return record.userId;
}

/** Token'ı tüketmeden geçerliliğini kontrol eder (sıfırlama formunu göstermek için). */
export async function isResetTokenValid(token: string): Promise<boolean> {
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });
  return !!record && !record.usedAt && record.expiresAt >= new Date();
}
