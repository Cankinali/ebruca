'use client';

import { pixelEnabled, track } from './pixel';
import { decodePurchaseSummary, metaValue, purchaseEventId, type MetaContent } from './shared';

/**
 * Tarayıcı tarafı Purchase (/siparis-tamamlandi).
 *
 * Özet öncelikle URL'den okunur (ödeme dönüşü sunucuda ekler: mv, mc);
 * yoksa ödeme başlatılırken sessionStorage'a yazılan kayda düşülür.
 * sessionStorage tek başına güvenilir değildi: ödeme banka uygulamasında ya
 * da yeni bir sekmede tamamlanınca kayboluyor ve Purchase hiç atılmıyordu.
 *
 * Tek sefer: sipariş başına localStorage işareti — sayfa yenilense, geri
 * gelinse ya da başka sekmede açılsa da ikinci Purchase gitmez.
 * event_id sunucudaki CAPI Purchase ile aynı → Meta tekilleştirir.
 */

const KEY = 'meta_pending_purchase';
const SENT_PREFIX = 'meta_purchase_sent_';

interface PendingPurchase {
  orderNo: string;
  value: number;
  contents: MetaContent[];
}

export function savePendingPurchase(p: PendingPurchase) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(p));
  } catch { /* gizli mod vb. — URL özeti ve CAPI yine çalışır */ }
}

function readPending(orderNo: string): PendingPurchase | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    const p = raw ? (JSON.parse(raw) as PendingPurchase) : null;
    return p && p.orderNo === orderNo ? p : null;
  } catch {
    return null;
  }
}

export function firePurchase(orderNo: string, params: URLSearchParams) {
  if (!pixelEnabled()) return;
  const sentKey = SENT_PREFIX + orderNo;
  try {
    if (localStorage.getItem(sentKey)) return;
  } catch { /* depolama kapalı — yine de bir kez dene */ }

  const summary = decodePurchaseSummary(params) ?? readPending(orderNo);
  if (!summary) return;

  track(
    'Purchase',
    {
      content_ids: summary.contents.map(c => c.id),
      contents: summary.contents,
      num_items: summary.contents.reduce((a, c) => a + c.quantity, 0),
      value: metaValue(summary.value),
      currency: 'TRY',
      content_type: 'product',
      order_id: orderNo,
    },
    purchaseEventId(orderNo)
  );

  try {
    localStorage.setItem(sentKey, String(Date.now()));
    sessionStorage.removeItem(KEY);
  } catch { /* yoksay */ }
}
