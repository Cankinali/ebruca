/**
 * Meta CAPI doğrudan test: Graph API'ye test_event_code ile TEK bir örnek
 * Purchase gönderir ve cevabı (status, events_received, messages, fbtrace_id)
 * yazdırır. Olay yalnızca Events Manager → Test Events'te görünür; reklam
 * ölçümüne karışmaz.
 *
 *   META_CAPI_TOKEN=… META_TEST_EVENT_CODE=TEST527 npx tsx scripts/meta-capi-test.mts
 *
 * Token asla yazdırılmaz. META_TEST_EVENT_CODE yoksa ÇALIŞMAZ (canlı veriye
 * sahte satın alma karışmasın diye).
 */

import { createHash } from 'crypto';
import { normEmail, normPhone, purchaseEventId } from '../src/lib/meta/shared';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1463467692367317';
const TOKEN = process.env.META_CAPI_TOKEN ?? '';
const TEST_CODE = process.env.META_TEST_EVENT_CODE ?? '';
const API_VERSION = process.env.META_GRAPH_API_VERSION || 'v25.0';

if (!TOKEN) throw new Error('META_CAPI_TOKEN tanımlı değil');
if (!TEST_CODE) throw new Error('META_TEST_EVENT_CODE yok — canlıya sahte Purchase göndermemek için durduruldu');

const sha = (v: string) => createHash('sha256').update(v).digest('hex');
const orderNo = `TEST${Date.now().toString().slice(-8)}`;
const eventId = purchaseEventId(orderNo);

const body = {
  data: [
    {
      event_name: 'Purchase',
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: `https://www.ebruca.com/siparis-tamamlandi?no=${orderNo}`,
      action_source: 'website',
      user_data: {
        em: [sha(normEmail('capi-test@ebruca.com'))],
        ph: [sha(normPhone('0500 000 00 00'))],
        country: [sha('tr')],
        client_ip_address: '85.105.0.1',
        client_user_agent: 'Mozilla/5.0 (EbrucaCapiTest)',
      },
      custom_data: {
        currency: 'TRY',
        value: 1,
        content_type: 'product',
        content_ids: ['capi-test-urun'],
        contents: [{ id: 'capi-test-urun', quantity: 1, item_price: 1 }],
        num_items: 1,
        order_id: orderNo,
      },
    },
  ],
  test_event_code: TEST_CODE,
};

const res = await fetch(
  `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(TOKEN)}`,
  { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
);
const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
console.log(JSON.stringify({
  status: res.status,
  event_id: eventId,
  test_event_code: TEST_CODE,
  events_received: json.events_received,
  messages: json.messages,
  fbtrace_id: json.fbtrace_id,
  error: (json.error as { message?: string } | undefined)?.message,
}, null, 2));
