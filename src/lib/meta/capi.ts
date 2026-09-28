import 'server-only';
import { createHash } from 'crypto';
import { CONSENT_COOKIE } from './shared';

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

export function capiEnabled(): boolean {
  return Boolean(PIXEL_ID && TOKEN);
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

const TR_FOLD: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };

/** Telefon → E.164 rakamları, Türkiye için "90" önekli (ör. 905321234567). */
export function normalizePhone(raw: string): string {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('0090')) d = d.slice(2);
  if (d.startsWith('0')) d = '90' + d.slice(1);
  if (d.length === 10 && d.startsWith('5')) d = '90' + d;
  return d;
}

/** Meta'nın normalizasyon kurallarıyla hash'lenmiş user_data. IP/UA/fbp/fbc hash'lenmez. */
function buildUserData(u: CapiUserData) {
  const lower = (v?: string) => v?.trim().toLocaleLowerCase('tr-TR') || '';
  const out: Record<string, unknown> = { country: [sha256('tr')] };
  const email = lower(u.email);
  if (email) out.em = [sha256(email)];
  const phone = u.phone ? normalizePhone(u.phone) : '';
  if (phone) out.ph = [sha256(phone)];
  const fn = lower(u.firstName);
  if (fn) out.fn = [sha256(fn)];
  const ln = lower(u.lastName);
  if (ln) out.ln = [sha256(ln)];
  // Şehir: küçük harf, Latin a-z, boşluksuz (Meta önerisi)
  const ct = lower(u.city).replace(/[çğıöşüâîû]/g, c => TR_FOLD[c] ?? c).replace(/[^a-z]/g, '');
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

export function metaContext(req: Request, pageUrl?: string | null): MetaRequestContext {
  const consent = readCookie(req, CONSENT_COOKIE) === 'granted';
  if (!consent) return { consent: false, fbp: '', fbc: '', ip: '', userAgent: '' };
  const fwd = req.headers.get('x-forwarded-for');
  return {
    consent: true,
    fbp: readCookie(req, '_fbp'),
    fbc: readCookie(req, '_fbc') || fbcFromUrl(pageUrl ?? req.headers.get('referer')),
    ip: fwd ? fwd.split(',')[0].trim() : req.headers.get('x-real-ip') ?? '',
    userAgent: req.headers.get('user-agent') ?? '',
  };
}
