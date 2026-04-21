'use client';

import { useState } from 'react';

export default function OrderQueryPage() {
  const [form, setForm] = useState({ email: '', siparisNo: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold tracking-wide uppercase">Sipariş Sorgula</h1>
        <p className="text-gray-500 text-sm mt-2">
          E-posta adresiniz ve sipariş numaranızla siparişinizi sorgulayın.
        </p>
      </div>

      {submitted ? (
        <div className="border border-gray-100 p-8 text-center">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-bold mb-2">Sipariş Bulunamadı</h3>
          <p className="text-sm text-gray-500 mb-4">
            Girdiğiniz bilgilere ait sipariş bulunamadı. Lütfen bilgilerinizi kontrol edin.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ email: '', siparisNo: '' }); }}
            className="text-sm underline"
          >
            Tekrar Dene
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="border border-gray-100 p-8 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">E-posta Adresi *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="siparis@email.com"
              required
              className="w-full border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sipariş Numarası *</label>
            <input
              type="text"
              value={form.siparisNo}
              onChange={e => setForm(prev => ({ ...prev, siparisNo: e.target.value }))}
              placeholder="EBR-2025-XXXXX"
              required
              className="w-full border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-3.5 text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors"
          >
            Sorgula
          </button>
        </form>
      )}

      <p className="text-center text-xs text-gray-400 mt-6">
        Sipariş numaranızı e-posta ile aldığınız onay mesajında bulabilirsiniz.
      </p>
    </div>
  );
}
