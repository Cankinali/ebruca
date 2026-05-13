declare module 'iyzipay' {
  namespace Iyzipay {
    export interface IyzipayOptions {
      apiKey: string;
      secretKey: string;
      uri: string;
    }

    export interface CheckoutFormInitializeRequest {
      locale?: string;
      conversationId?: string;
      price: string;
      paidPrice: string;
      currency?: string;
      basketId?: string;
      paymentGroup?: string;
      callbackUrl: string;
      enabledInstallments?: number[];
      buyer: Record<string, unknown>;
      shippingAddress: Record<string, unknown>;
      billingAddress: Record<string, unknown>;
      basketItems: Array<Record<string, unknown>>;
    }

    export interface CheckoutFormRetrieveRequest {
      locale?: string;
      conversationId?: string;
      token: string;
    }

    export interface CheckoutFormInitializeResponse {
      status: 'success' | 'failure';
      errorCode?: string;
      errorMessage?: string;
      locale?: string;
      systemTime?: number;
      conversationId?: string;
      token?: string;
      checkoutFormContent?: string;
      paymentPageUrl?: string;
      tokenExpireTime?: number;
    }

    export interface CheckoutFormRetrieveResponse {
      status: 'success' | 'failure';
      errorCode?: string;
      errorMessage?: string;
      locale?: string;
      systemTime?: number;
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

    export type IyzipayCallback<T = unknown> = (err: Error | null, result: T) => void;
  }

  class Iyzipay {
    constructor(options: Iyzipay.IyzipayOptions);
    checkoutFormInitialize: {
      create(
        request: Iyzipay.CheckoutFormInitializeRequest,
        cb: Iyzipay.IyzipayCallback<Iyzipay.CheckoutFormInitializeResponse>
      ): void;
    };
    checkoutForm: {
      retrieve(
        request: Iyzipay.CheckoutFormRetrieveRequest,
        cb: Iyzipay.IyzipayCallback<Iyzipay.CheckoutFormRetrieveResponse>
      ): void;
    };
  }

  export = Iyzipay;
}
