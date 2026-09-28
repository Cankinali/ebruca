'use client';

import { track } from './pixel';
import { metaValue, purchaseEventId, type MetaContent } from './shared';

/**
 * Tarayıcı tarafı Purchase.
 *
 * Ödeme başlatılırken sipariş özeti sessionStorage'a yazılır; başarı sayfası
 * (/siparis-tamamlandi) aynı sipariş no'suyla açılınca Purchase'ı BİR KEZ
 * atar ve kaydı siler — sayfa yenilense de ikinci Purchase gitmez.
 * event_id sunucudaki CAPI Purchase ile aynı → Meta tekilleştirir.
 */

const KEY = 'meta_pending_purchase';

interface PendingPurchase {
  orderNo: string;
  value: number;
  contents: MetaContent[];
}

export function savePendingPurchase(p: PendingPurchase) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(p));
  } catch { /* gizli mod vb. — Purchase yalnızca CAPI'den gider */ }
}

export function firePendingPurchase(orderNo: string) {
  let p: PendingPurchase | null = null;
  try {
    const raw = sessionStorage.getItem(KEY);
    p = raw ? (JSON.parse(raw) as PendingPurchase) : null;
    if (!p || p.orderNo !== orderNo) return;
    sessionStorage.removeItem(KEY);
  } catch {
    return;
  }
  track(
    'Purchase',
    {
      content_ids: p.contents.map(c => c.id),
      contents: p.contents,
      num_items: p.contents.reduce((a, c) => a + c.quantity, 0),
      value: metaValue(p.value),
      currency: 'TRY',
      content_type: 'product',
      order_id: orderNo,
    },
    purchaseEventId(orderNo)
  );
}
