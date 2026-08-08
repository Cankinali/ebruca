import 'server-only';

/**
 * Basit, bellek içi hız sınırlayıcı.
 *
 * Sınırlar: Vercel'de her sunucu örneği kendi sayacını tutar ve örnek yeniden
 * başladığında sayaç sıfırlanır. Yani bu, dağıtık ve kesin bir koruma değil;
 * amacı tek kaynaktan gelen kaba deneme trafiğini yavaşlatmak. Sipariş
 * sorgulamada asıl koruma, sipariş numarası ile e-postanın birlikte tutması.
 */
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Sızıntıyı önlemek için ara ara süresi dolmuş kayıtları temizler. */
function sweep(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  /** Sınır aşıldıysa kaç saniye sonra tekrar denenebileceği. */
  retryAfterSeconds: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

/** İstemci IP'sini proxy başlıklarından çıkarır. */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'bilinmiyor';
}
