import { NextRequest, NextResponse, after } from 'next/server';
import { capiEnabled, metaContext, sendCapiEvent } from '@/lib/meta/capi';
import { BRIDGED_EVENTS, type BridgedEvent } from '@/lib/meta/shared';
import { rateLimit, clientIp } from '@/lib/rate-limit';

/**
 * Tarayıcıdan CAPI'ye köprü: AddToCart ve InitiateCheckout.
 *
 * Pixel olayı tarayıcıda aynı eventId ile atılır, Meta ikisini tekilleştirir.
 * IP ve user-agent burada istekten alınır. Onay çerezi yoksa hiçbir şey
 * gönderilmez. Purchase buradan GEÇMEZ — ödeme dönüşünde sunucu kendisi gönderir.
 */

const MAX_BODY = 8_000;

export async function POST(req: NextRequest) {
  const limit = rateLimit(`meta-event:${clientIp(req)}`, 60, 60_000);
  if (!limit.allowed) return new NextResponse(null, { status: 429 });
  if (!capiEnabled()) return new NextResponse(null, { status: 204 });

  const raw = await req.text();
  if (raw.length > MAX_BODY) return new NextResponse(null, { status: 413 });

  let body: {
    eventName?: unknown;
    eventId?: unknown;
    eventSourceUrl?: unknown;
    customData?: unknown;
  };
  try {
    body = JSON.parse(raw);
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const eventName = body.eventName as BridgedEvent;
  if (!BRIDGED_EVENTS.includes(eventName)) return new NextResponse(null, { status: 400 });
  if (typeof body.eventId !== 'string' || body.eventId.length > 100) {
    return new NextResponse(null, { status: 400 });
  }
  const customData =
    body.customData && typeof body.customData === 'object' && !Array.isArray(body.customData)
      ? (body.customData as Record<string, unknown>)
      : {};

  // Kaynak URL yalnızca kendi alan adımızdan kabul edilir
  const siteHost = req.nextUrl.host;
  let eventSourceUrl = req.nextUrl.origin;
  if (typeof body.eventSourceUrl === 'string') {
    try {
      const u = new URL(body.eventSourceUrl);
      if (u.host === siteHost) eventSourceUrl = u.toString();
    } catch { /* varsayılan kalır */ }
  }

  const ctx = metaContext(req, eventSourceUrl);
  if (!ctx.consent) return new NextResponse(null, { status: 204 });

  const eventId = body.eventId;
  // Cevabı bekletmeden gönder; after() gönderim bitene kadar fonksiyonu açık tutar
  after(() =>
    sendCapiEvent({
      eventName,
      eventId,
      eventSourceUrl,
      userData: { ip: ctx.ip, userAgent: ctx.userAgent, fbp: ctx.fbp, fbc: ctx.fbc },
      customData: { currency: 'TRY', content_type: 'product', ...customData },
    })
  );
  return new NextResponse(null, { status: 202 });
}
