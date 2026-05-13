/**
 * Iyzico Checkout Form — minimal REST client.
 * iyzipay paketi yerine Node fetch + crypto kullanır (sıfır bağımlılık).
 * Iyzico'nun resmi V2 imza algoritmasını uygular.
 */
import crypto from 'crypto';

const API_KEY = process.env.IYZIPAY_API_KEY!;
const SECRET_KEY = process.env.IYZIPAY_SECRET_KEY!;
const BASE_URL = process.env.IYZIPAY_BASE_URL ?? 'https://api.iyzipay.com';

const PATH_INITIALIZE = '/payment/iyzipos/checkoutform/initialize/auth/ecom';
const PATH_RETRIEVE   = '/payment/iyzipos/checkoutform/auth/ecom/detail';

function randomString(length = 8) {
  return process.hrtime()[0] + Math.random().toString(length).slice(2);
}

function buildAuthHeader(uri: string, body: object, rnd: string) {
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(rnd + uri + JSON.stringify(body))
    .digest('hex');

  const params = [
    `apiKey:${API_KEY}`,
    `randomKey:${rnd}`,
    `signature:${signature}`,
  ];
  const auth = Buffer.from(params.join('&')).toString('base64');
  return `IYZWSv2 ${auth}`;
}

async function iyzipost<T>(path: string, body: object): Promise<T> {
  const rnd = randomString();
  const auth = buildAuthHeader(path, body, rnd);

  const res = await fetch(BASE_URL + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth,
      'x-iyzi-rnd': rnd,
      'x-iyzi-client-version': 'ebruca-custom-1.0.0',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Iyzico geçersiz yanıt (${res.status}): ${text.slice(0, 200)}`);
  }
}

// ============ Tipler ============

export interface CheckoutInitializeRequest {
  locale?: string;
  conversationId: string;
  price: string;          // ara toplam, kuruşsuz "100.00"
  paidPrice: string;      // toplam, kuruşsuz "120.00"
  currency?: string;
  basketId?: string;
  paymentGroup?: 'PRODUCT' | 'SUBSCRIPTION';
  callbackUrl: string;
  enabledInstallments?: number[];
  buyer: {
    id: string;
    name: string;
    surname: string;
    gsmNumber: string;
    email: string;
    identityNumber: string;
    registrationAddress: string;
    ip: string;
    city: string;
    country: string;
    zipCode?: string;
  };
  shippingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode?: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode?: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category1: string;
    itemType: 'PHYSICAL' | 'VIRTUAL';
    price: string;
  }>;
}

export interface CheckoutInitializeResponse {
  status: 'success' | 'failure';
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
  conversationId?: string;
  token?: string;
  checkoutFormContent?: string;
  paymentPageUrl?: string;
  tokenExpireTime?: number;
}

export interface CheckoutRetrieveResponse {
  status: 'success' | 'failure';
  errorCode?: string;
  errorMessage?: string;
  conversationId?: string;
  paymentStatus?: 'SUCCESS' | 'FAILURE' | 'INIT_THREEDS' | 'CALLBACK_THREEDS';
  paymentId?: string;
  fraudStatus?: number;
  price?: number;
  paidPrice?: number;
  paymentItems?: Array<{
    itemId: string;
    paymentTransactionId: string;
    transactionStatus: number;
    price: number;
    paidPrice: number;
  }>;
  basketId?: string;
  token?: string;
}

// ============ Public API ============

export function initializeCheckout(req: CheckoutInitializeRequest) {
  return iyzipost<CheckoutInitializeResponse>(PATH_INITIALIZE, {
    locale: 'tr',
    currency: 'TRY',
    paymentGroup: 'PRODUCT',
    ...req,
  });
}

export function retrieveCheckout(token: string, conversationId?: string) {
  return iyzipost<CheckoutRetrieveResponse>(PATH_RETRIEVE, {
    locale: 'tr',
    token,
    conversationId,
  });
}
