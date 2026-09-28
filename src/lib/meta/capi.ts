import 'server-only';
import { createHash } from 'crypto';
import {
  CONSENT_COOKIE,
  FBC_RE,
  FBP_RE,
  metaEnvironmentAllowed,
  normCity,
  normEmail,
  normName,
  normPhone,
} from './shared';

/**
 * Meta Conversions API — yalnızca sunucu. META_CAPI_TOKEN istemciye ASLA
 * sızmamalı ('server-only' bunu derleme anında garanti eder).
 *
 * Kural: CAPI hatası ödeme/sipariş akışını BOZMAZ. sendCapiEvent hiçbir
 * zaman fırlatmaz, 3 sn'de zaman aşımına uğrar ve sonucu boolean döner.
 */

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';
const TOKEN = process.env.META_CAPI_TOKEN ?? '';
const TEST_CODE = process.env.META_TEST_EVENT_CODE ?? '';
// v25.0: Şubat 2026'da çıktı, ~2 yıl destekleniyor. Gerekirse env ile güncellenir.
const API_VERSION = process.env.META_GRAPH_API_VERSION || 'v25.0';
const TIMEOUT_MS = 3000;

/** Yalnızca canlıda (VERCEL_ENV=production) ya da NEXT_PUBLIC_META_FORCE_ENABLE=true iken. */
export function capiEnabled(): boolean {
  return Boolean(PIXEL_ID && TOKEN) && metaEnvironmentAllowed();
}

export interface CapiUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
}

export interface CapiEvent {
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  userData: CapiUserData;
  customData: Record<string, unknown>;
}

const sha256 = (v: string) => createHash('sha256').update(v).digest('hex');

/** Meta'nın normalizasyon kurallarıyla hash'lenmiş user_data. IP/UA/fbp/fbc hash'lenmez. */
function buildUserData(u: CapiUserData) {
  const out: Record<string, unknown> = { country: [sha256('tr')] };
  const em = normEmail(u.email);
  if (em) out.em = [sha256(em)];
  const ph = normPhone(u.phone);
  if (ph) out.ph = [sha256(ph)];
  const fn = normName(u.firstName);
  if (fn) out.fn = [sha256(fn)];
  const ln = normName(u.lastName);
  if (ln) out.ln = [sha256(ln)];
  const ct = normCity(u.city);
  if (ct) out.ct = [sha256(ct)];
  if (u.ip) out.client_ip_address = u.ip;
  if (u.userAgent) out.client_user_agent = u.userAgent;
  if (u.fbp) out.fbp = u.fbp;
  if (u.fbc) out.fbc = u.fbc;
  return out;
}

export async function sendCapiEvent(ev: CapiEvent): Promise<boolean> {
  if (!capiEnabled()) return false;
  const body: Record<string, unknown> = {
    data: [
      {
        event_name: ev.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: ev.eventId,
        event_source_url: ev.eventSourceUrl,
        action_source: 'website',
        user_data: buildUserData(ev.userData),
        custom_data: ev.customData,
      },
    ],
  };
  if (TEST_CODE) body.test_event_code = TEST_CODE;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(TOKEN)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      }
    );
    if (!res.ok) {
      console.error('[meta/capi]', ev.eventName, res.status, (await res.text()).slice(0, 500));
      return false;
    }
    return true;
  } catch (err) {
    console.error('[meta/capi]', ev.eventName, 'gönderilemedi:', err);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// İstekten Meta bağlamı: onay + _fbp/_fbc çerezleri + IP + UA
// ---------------------------------------------------------------------------

export interface MetaRequestContext {
  consent: boolean;
  fbp: string;
  fbc: string;
  ip: string;
  userAgent: string;
}

function readCookie(req: Request, name: string): string {
  const m = (req.headers.get('cookie') ?? '').match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : '';
}

/**
 * _fbc çerezi yoksa ve URL'de fbclid varsa Meta'nın biçiminde üretir:
 * fb.1.<ms>.<fbclid>
 */
function fbcFromUrl(url: string | null | undefined): string {
  if (!url) return '';
  try {
    const fbclid = new URL(url).searchParams.get('fbclid');
    return fbclid ? `fb.1.${Date.now()}.${fbclid}` : '';
  } catch {
    return '';
  }
}

/**
 * fallback: tarayıcının istek gövdesinde gönderdiği _fbp/_fbc. Instagram /
 * Facebook uygulama içi tarayıcıları çerez başlığını her zaman göndermiyor;
 * biçimi doğrulanmadan kullanılmaz.
 */
export function metaContext(
  req: Request,
  pageUrl?: string | null,
  fallback?: { fbp?: unknown; fbc?: unknown }
): MetaRequestContext {
  const consent = readCookie(req, CONSENT_COOKIE) === 'granted';
  if (!consent) return { consent: false, fbp: '', fbc: '', ip: '', userAgent: '' };
  const fwd = req.headers.get('x-forwarded-for');
  const fbFallback = (v: unknown, re: RegExp) => (typeof v === 'string' && re.test(v) ? v : '');
  return {
    consent: true,
    fbp: readCookie(req, '_fbp') || fbFallback(fallback?.fbp, FBP_RE),
    fbc:
      readCookie(req, '_fbc') ||
      fbFallback(fallback?.fbc, FBC_RE) ||
      fbcFromUrl(pageUrl ?? req.headers.get('referer')),
    ip: fwd ? fwd.split(',')[0].trim() : req.headers.get('x-real-ip') ?? '',
    userAgent: req.headers.get('user-agent') ?? '',
  };
}
