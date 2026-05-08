'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function OrderSuccess() {
  const params = useSearchParams();
  const orderNo = params.get('no');

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-xl sm:text-2xl font-bold mb-2">Siparişiniz Alındı!</h1>
      {orderNo && (
        <p className="text-sm text-gray-500 mb-1">
          Sipariş No: <span className="font-mono font-bold text-black">{orderNo}</span>
        </p>
      )}
      <p className="text-sm text-gray-500 mb-8 leading-relaxed">
        Siparişiniz başarıyla oluşturuldu. En kısa sürede işleme alınacak ve kargo bilgileriniz e-posta ile iletilecektir.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/"
          className="px-8 py-3 bg-black text-white text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors">
          Alışverişe Devam
        </Link>
        <Link href="/tumurunler"
          className="px-8 py-3 border border-gray-200 text-sm font-medium hover:border-black transition-colors">
          Tüm Ürünler
        </Link>
      </div>
    </div>
  );
}

export default function SiparisTamamlandiPage() {
  return (
    <Suspense>
      <OrderSuccess />
    </Suspense>
  );
}
