'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Şifre en az 8 karakter olmalı.');
      return;
    }
    if (password !== confirm) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/sifre-yenile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Şifre güncellenemedi.');
        setSubmitting(false);
        return;
      }

      // Sunucu yeni oturumu açtı — doğrudan hesap sayfasına al.
      router.replace('/hesabim');
      router.refresh();
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-xl font-semibold">Geçersiz bağlantı</h1>
          <p className="text-gray-500 text-sm mt-2 mb-6">
            Bu şifre sıfırlama bağlantısı eksik veya hatalı görünüyor.
          </p>
          <Link
            href="/sifre-sifirla"
            className="block w-full bg-black text-white py-3.5 text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors"
          >
            Yeni Bağlantı İste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-[0.2em] uppercase">EBRUCA</Link>
          <h1 className="text-xl font-semibold mt-4">Yeni Şifre Belirle</h1>
          <p className="text-gray-500 text-sm mt-1">Hesabınız için yeni bir şifre oluşturun.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Yeni Şifre</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="En az 8 karakter"
              className="w-full border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Yeni Şifre Tekrar</label>
            <input
              type="password"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setError(''); }}
              className="w-full border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 p-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white py-3.5 text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Kaydediliyor...' : 'Şifremi Güncelle'}
          </button>
        </form>
      </div>
    </div>
  );
}
