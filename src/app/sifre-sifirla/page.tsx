'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('E-posta adresinizi girin.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/auth/sifre-sifirla', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'İstek gönderilemedi.');
        setSubmitting(false);
        return;
      }
      setMessage(data.message || 'Şifre sıfırlama bağlantısı gönderildi.');
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-[0.2em] uppercase">EBRUCA</Link>
          <h1 className="text-xl font-semibold mt-4">Şifremi Unuttum</h1>
          <p className="text-gray-500 text-sm mt-1">
            Hesabınızın e-posta adresini girin, sıfırlama bağlantısı gönderelim.
          </p>
        </div>

        {message ? (
          <div className="space-y-4">
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 p-4 leading-relaxed">
              {message}
            </p>
            <Link
              href="/giris"
              className="block w-full bg-black text-white py-3.5 text-sm font-semibold tracking-widest uppercase text-center hover:bg-gray-800 transition-colors"
            >
              Giriş Sayfasına Dön
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="ornek@email.com"
                className="w-full border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
                required
              />
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white py-3.5 text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
            </button>

            <p className="text-center text-sm text-gray-600 pt-2">
              <Link href="/giris" className="font-medium text-black underline">Giriş sayfasına dön</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
