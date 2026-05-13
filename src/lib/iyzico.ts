/**
 * Iyzico ödeme istemcisi — Checkout Form (hosted) mimarisi.
 * Kart bilgileri hiçbir zaman bizim sunucumuza gelmez; Iyzico tarafında işlenir.
 */
import Iyzipay from 'iyzipay';

declare global {
  // eslint-disable-next-line no-var
  var __iyzipay: Iyzipay | undefined;
}

function createClient(): Iyzipay {
  return new Iyzipay({
    apiKey: process.env.IYZIPAY_API_KEY!,
    secretKey: process.env.IYZIPAY_SECRET_KEY!,
    uri: process.env.IYZIPAY_BASE_URL ?? 'https://api.iyzipay.com',
  });
}

export const iyzipay = globalThis.__iyzipay ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__iyzipay = iyzipay;
}
