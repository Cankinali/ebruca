'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({
    ad: '', soyad: '', email: '', password: '', passwordConfirm: '',
    kvkk: false, sozlesme: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.ad) e.ad = 'Ad gerekli';
    if (!form.soyad) e.soyad = 'Soyad gerekli';
    if (!form.email) e.email = 'E-posta gerekli';
    if (!form.password || form.password.length < 8) e.password = 'Şifre en az 8 karakter olmalı';
    if (form.password !== form.passwordConfirm) e.passwordConfirm = 'Şifreler eşleşmiyor';
    if (!form.kvkk) e.kvkk = 'KVKK onayı gerekli';
    if (!form.sozlesme) e.sozlesme = 'Üyelik sözleşmesi onayı gerekli';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    // TODO: API entegrasyonu
    alert('Kayıt başarılı! (Demo)');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-[0.2em] uppercase">EBRUCA</Link>
          <h1 className="text-xl font-semibold mt-4">Üye Ol</h1>
          <p className="text-gray-500 text-sm mt-1">Hızlı ve güvenli alışveriş için üye olun</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ad *</label>
              <input name="ad" value={form.ad} onChange={handleChange}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
              {errors.ad && <p className="text-red-500 text-xs mt-0.5">{errors.ad}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Soyad *</label>
              <input name="soyad" value={form.soyad} onChange={handleChange}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
              {errors.soyad && <p className="text-red-500 text-xs mt-0.5">{errors.soyad}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">E-posta *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
            {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Şifre *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="En az 8 karakter"
              className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
            {errors.password && <p className="text-red-500 text-xs mt-0.5">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Şifre Tekrar *</label>
            <input type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={handleChange}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
            {errors.passwordConfirm && <p className="text-red-500 text-xs mt-0.5">{errors.passwordConfirm}</p>}
          </div>

          <div className="space-y-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" name="kvkk" checked={form.kvkk} onChange={handleChange}
                className="mt-0.5 accent-black flex-shrink-0" />
              <span className="text-xs text-gray-600">
                <Link href="/gizlilik" className="underline">KVKK Aydınlatma Metni</Link>'ni okudum ve kabul ediyorum. *
              </span>
            </label>
            {errors.kvkk && <p className="text-red-500 text-xs ml-5">{errors.kvkk}</p>}

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" name="sozlesme" checked={form.sozlesme} onChange={handleChange}
                className="mt-0.5 accent-black flex-shrink-0" />
              <span className="text-xs text-gray-600">
                <Link href="/uyelik-sozlesmesi" className="underline">Üyelik Sözleşmesi</Link>'ni okudum ve kabul ediyorum. *
              </span>
            </label>
            {errors.sozlesme && <p className="text-red-500 text-xs ml-5">{errors.sozlesme}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3.5 text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors"
          >
            Üye Ol
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Zaten üye misiniz?{' '}
          <Link href="/giris" className="font-medium text-black underline">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}
