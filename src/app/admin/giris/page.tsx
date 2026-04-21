'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    setLoading(false);
    if (res.ok) {
      router.push('/admin/urunler');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? 'Hata oluştu.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-[0.2em] uppercase">EBRUCA</h1>
          <p className="text-gray-500 text-sm mt-2">Admin Paneli</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-8 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoFocus
              className="w-full border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
            />
          </div>
          {error && (
            <p className="text-red-500 text-xs bg-red-50 px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}
