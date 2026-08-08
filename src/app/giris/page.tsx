'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// useSearchParams istemci tarafında çözülür; statik prerender için Suspense şart.
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Korumalı bir sayfadan yönlendirildiyse giriş sonrası oraya dön.
  const rawNext = searchParams.get('next') || '/hesabim';
  // Açık yönlendirme (open redirect) koruması: sadece site içi yollara izin ver.
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/hesabim';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Tüm alanları doldurun.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/giris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Giriş yapılamadı.');
        setSubmitting(false);
        return;
      }

      // Header'ın oturum durumunu tazelemesi için sunucu bileşenlerini yenile.
      router.replace(next);
      router.refresh();
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-[0.2em] uppercase">EBRUCA</Link>
          <h1 className="text-xl font-semibold mt-4">Giriş Yap</h1>
          <p className="text-gray-500 text-sm mt-1">Hesabınıza giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">E-posta</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ornek@email.com"
              className="w-full border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
              required
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-medium text-gray-600">Şifre</label>
              <Link href="/sifre-sifirla" className="text-xs text-gray-400 hover:text-black underline">
                Şifremi Unuttum
              </Link>
            </div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
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
            {submitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <div className="relative text-center">
            <span className="bg-white px-3 text-xs text-gray-400">veya</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600">
          Hesabınız yok mu?{' '}
          <Link href="/kayit" className="font-medium text-black underline">
            Üye Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
