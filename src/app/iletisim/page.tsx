'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ ad: '', email: '', konu: '', mesaj: '', kvkk: false });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API entegrasyonu
    setSent(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold tracking-wide uppercase">İletişim</h1>
        <p className="text-gray-500 text-sm mt-2">Size yardımcı olmaktan memnuniyet duyarız.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4">İletişim Bilgileri</h2>
            <div className="space-y-4">
              {[
                {
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
                  label: 'Telefon',
                  value: '+90 (212) 000 00 00',
                },
                {
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                  label: 'E-posta',
                  value: 'info@ebruca.com',
                },
                {
                  icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>,
                  label: 'WhatsApp',
                  value: '+90 (500) 000 00 00',
                  href: 'https://wa.me/905000000000',
                },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="text-gray-400 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm hover:underline">{item.value}</a>
                    ) : (
                      <p className="text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Çalışma Saatleri</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Hafta içi: 09:00 — 18:00</p>
              <p>Cumartesi: 10:00 — 16:00</p>
              <p className="text-gray-400">Pazar: Kapalı</p>
            </div>
          </div>
        </div>

        {/* Form */}
        {sent ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-bold mb-2">Mesajınız İletildi</h3>
            <p className="text-sm text-gray-500">En kısa sürede size dönüş yapacağız.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ad Soyad *</label>
                <input name="ad" value={form.ad} onChange={handleChange} required
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">E-posta *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Konu</label>
              <select name="konu" value={form.konu} onChange={handleChange}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black bg-white">
                <option value="">Seçiniz</option>
                <option>Sipariş hakkında</option>
                <option>Ürün bilgisi</option>
                <option>İade / Değişim</option>
                <option>Diğer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mesajınız *</label>
              <textarea name="mesaj" value={form.mesaj} onChange={handleChange} rows={5} required
                className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black resize-none" />
            </div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" name="kvkk" checked={form.kvkk} onChange={handleChange} required
                className="mt-0.5 accent-black flex-shrink-0" />
              <span className="text-xs text-gray-500">
                Kişisel verilerimin işlenmesine ilişkin{' '}
                <a href="/gizlilik" className="underline">KVKK Aydınlatma Metni</a>'ni okudum, onaylıyorum.
              </span>
            </label>
            <button type="submit"
              className="w-full bg-black text-white py-3.5 text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors">
              Gönder
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
