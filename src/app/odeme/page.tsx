'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

type Step = 'adres' | 'kargo' | 'odeme';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>('adres');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    ad: '', soyad: '', email: '', telefon: '',
    adres: '', il: '', ilce: '', postaKodu: '',
    kargo: 'standart',
    kartNo: '', sonKullanma: '', cvv: '', kartAd: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedSales, setAgreedSales] = useState(false);

  const shippingFee = form.kargo === 'ekspres' ? 1 : (totalPrice >= 5000 ? 0 : 90);
  const finalTotal = totalPrice + shippingFee;

  const steps: { key: Step; label: string }[] = [
    { key: 'adres', label: 'Adres' },
    { key: 'kargo', label: 'Kargo' },
    { key: 'odeme', label: 'Ödeme' },
  ];
  const stepIndex = steps.findIndex(s => s.key === step);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validateAddress = () => {
    const errs: Record<string, string> = {};
    if (!form.ad.trim()) errs.ad = 'Ad zorunludur';
    if (!form.soyad.trim()) errs.soyad = 'Soyad zorunludur';
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Geçerli e-posta giriniz';
    if (!form.telefon.trim() || form.telefon.length < 10) errs.telefon = 'Geçerli telefon giriniz';
    if (!form.adres.trim()) errs.adres = 'Adres zorunludur';
    if (!form.il.trim()) errs.il = 'İl zorunludur';
    if (!form.ilce.trim()) errs.ilce = 'İlçe zorunludur';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = () => {
    const errs: Record<string, string> = {};
    if (!form.kartNo.replace(/\s/g, '') || form.kartNo.replace(/\s/g, '').length < 16) errs.kartNo = 'Geçerli kart numarası giriniz';
    if (!form.kartAd.trim()) errs.kartAd = 'Kart üzerindeki isim zorunludur';
    if (!form.sonKullanma || form.sonKullanma.length < 5) errs.sonKullanma = 'Son kullanma tarihi giriniz';
    if (!form.cvv || form.cvv.length < 3) errs.cvv = 'CVV zorunludur';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!agreedTerms || !agreedSales) {
      setErrors({ submit: 'Devam etmek için sözleşmeleri okuyup onaylamanız gerekiyor.' });
      return;
    }

    setSubmitting(true);
    try {
      // Iyzico ödeme oturumu başlat
      // Not: Fiyatları sunucu DB'den doğrulayacak, bu yüzden istemciden göndermiyoruz
      const res = await fetch('/api/odeme/baslat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.ad,
          lastName: form.soyad,
          email: form.email,
          phone: form.telefon,
          address: form.adres,
          city: form.il,
          district: form.ilce,
          postalCode: form.postaKodu,
          shippingMethod: form.kargo,
          items: items.map(item => ({
            productId: item.product.id,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            // name, price, code, image alanları sunucuda DB'den doldurulacak
            name: '',
            code: '',
            price: 0,
            image: '',
          })),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.paymentPageUrl) {
        throw new Error(data.error || 'Ödeme başlatılamadı');
      }

      // Sepeti temizle ve Iyzico ödeme sayfasına yönlendir
      clearCart();
      window.location.href = data.paymentPageUrl;
    } catch (err) {
      setErrors({ submit: 'Ödeme başlatılamadı: ' + (err instanceof Error ? err.message : 'bilinmeyen hata') });
      setSubmitting(false);
    }
  };

  const inputCls = "w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black";
  const inputErrCls = "w-full border border-red-300 px-3 py-2.5 text-sm outline-none focus:border-red-500";

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Sepetiniz boş.</p>
        <Link href="/" className="bg-black text-white px-6 py-3 text-sm">Alışverişe Başla</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">

      {/* Adım göstergesi */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1 ${i <= stepIndex ? 'text-black' : 'text-gray-300'}`}>
              <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0 ${
                i < stepIndex ? 'bg-black text-white' :
                i === stepIndex ? 'border-2 border-black' : 'border-2 border-gray-200'
              }`}>
                {i < stepIndex ? '✓' : i + 1}
              </span>
              <span className="text-xs sm:text-sm font-medium">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-6 sm:w-12 h-px ${i < stepIndex ? 'bg-black' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
        {/* Form */}
        <div className="lg:col-span-2">

          {/* Adres */}
          {step === 'adres' && (
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">Teslimat Adresi</h2>

              {/* Misafir / Giriş */}
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 text-xs sm:text-sm font-medium border bg-black text-white text-center">
                  Misafir Olarak Devam
                </button>
                <Link href="/giris" className="flex-1 py-2.5 text-xs sm:text-sm font-medium border border-gray-200 hover:border-gray-400 text-center transition-colors">
                  Giriş Yap
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ad *</label>
                  <input name="ad" value={form.ad} onChange={handleChange}
                    className={errors.ad ? inputErrCls : inputCls} />
                  {errors.ad && <p className="text-xs text-red-500 mt-1">{errors.ad}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Soyad *</label>
                  <input name="soyad" value={form.soyad} onChange={handleChange}
                    className={errors.soyad ? inputErrCls : inputCls} />
                  {errors.soyad && <p className="text-xs text-red-500 mt-1">{errors.soyad}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">E-posta *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  className={errors.email ? inputErrCls : inputCls} />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Telefon *</label>
                <input type="tel" name="telefon" value={form.telefon} onChange={handleChange}
                  placeholder="05XX XXX XX XX" className={errors.telefon ? inputErrCls : inputCls} />
                {errors.telefon && <p className="text-xs text-red-500 mt-1">{errors.telefon}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Adres *</label>
                <textarea name="adres" value={form.adres} onChange={handleChange} rows={3}
                  className={`${errors.adres ? inputErrCls : inputCls} resize-none`} />
                {errors.adres && <p className="text-xs text-red-500 mt-1">{errors.adres}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">İl *</label>
                  <input name="il" value={form.il} onChange={handleChange}
                    className={errors.il ? inputErrCls : inputCls} />
                  {errors.il && <p className="text-xs text-red-500 mt-1">{errors.il}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">İlçe *</label>
                  <input name="ilce" value={form.ilce} onChange={handleChange}
                    className={errors.ilce ? inputErrCls : inputCls} />
                  {errors.ilce && <p className="text-xs text-red-500 mt-1">{errors.ilce}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Posta Kodu</label>
                  <input name="postaKodu" value={form.postaKodu} onChange={handleChange} className={inputCls} />
                </div>
              </div>
              <button
                onClick={() => { if (validateAddress()) setStep('kargo'); }}
                className="w-full bg-black text-white py-3.5 text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors">
                Kargo Seçimine Geç →
              </button>
            </div>
          )}

          {/* Kargo */}
          {step === 'kargo' && (
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">Kargo Seçimi</h2>
              {[
                { value: 'standart', label: 'Standart Kargo', desc: '2-4 iş günü', price: totalPrice >= 5000 ? 0 : 90 },
                { value: 'ekspres', label: 'Ekspres Kargo (TEST)', desc: '1 TL test', price: 1 },
              ].map(option => (
                <label key={option.value}
                  className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                    form.kargo === option.value ? 'border-black' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="kargo" value={option.value}
                      checked={form.kargo === option.value} onChange={handleChange}
                      className="accent-black w-4 h-4" />
                    <div>
                      <p className="text-sm font-medium">{option.label}</p>
                      <p className="text-xs text-gray-400">{option.desc}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold ml-4">
                    {option.price === 0 ? 'Ücretsiz' : `${option.price} TL`}
                  </span>
                </label>
              ))}
              <div className="flex gap-3">
                <button onClick={() => setStep('adres')}
                  className="flex-1 border border-gray-200 py-3 text-sm hover:border-black transition-colors">
                  ← Geri
                </button>
                <button onClick={() => setStep('odeme')}
                  className="flex-1 bg-black text-white py-3 text-sm font-semibold tracking-wider uppercase hover:bg-gray-800 transition-colors">
                  Ödemeye Geç →
                </button>
              </div>
            </div>
          )}

          {/* Ödeme */}
          {step === 'odeme' && (
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">Ödeme</h2>

              {/* Iyzico + Visa + Mastercard logoları (Iyzico zorunlu) */}
              <div className="flex items-center justify-between gap-3 p-4 border border-gray-200 bg-gradient-to-b from-gray-50 to-white">
                <div className="flex items-center gap-2">
                  {/* iyzico ile Öde rozeti */}
                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded px-2.5 py-1.5">
                    <svg viewBox="0 0 70 28" className="h-4 w-auto" aria-label="iyzico">
                      <text x="0" y="20" fontSize="22" fontWeight="700" fill="#1E64FF" fontFamily="system-ui">iyzico</text>
                    </svg>
                    <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-wider">ile Öde</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href="https://www.visa.com" target="_blank" rel="noopener noreferrer" aria-label="Visa">
                    <svg viewBox="0 0 50 16" className="h-5 w-auto" aria-hidden="true">
                      <text x="0" y="13" fontSize="14" fontStyle="italic" fontWeight="900" fill="#1A1F71" fontFamily="system-ui">VISA</text>
                    </svg>
                  </a>
                  <a href="https://www.mastercard.com" target="_blank" rel="noopener noreferrer" aria-label="Mastercard" className="flex items-center">
                    <svg viewBox="0 0 36 22" className="h-5 w-auto" aria-hidden="true">
                      <circle cx="13" cy="11" r="9" fill="#EB001B" />
                      <circle cx="23" cy="11" r="9" fill="#F79E1B" />
                      <path d="M18 4.2a8.95 8.95 0 010 13.6 8.95 8.95 0 010-13.6z" fill="#FF5F00" />
                    </svg>
                  </a>
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider hidden sm:inline">3D Secure</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 text-xs text-green-700">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>
                  Kart bilgileriniz <strong>iyzico&apos;nun güvenli ödeme sayfasında</strong> alınır. 256 Bit SSL · 3D Secure · PCI-DSS uyumlu.
                </span>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-4 text-sm">
                <p className="text-gray-700">
                  &quot;Ödemeyi Tamamla&quot; butonuna bastığınızda <strong>iyzico</strong>&apos;nun güvenli ödeme sayfasına yönlendirileceksiniz.
                  Orada kart bilgilerinizi girip işlemi tamamlayabilirsiniz. Banka onayı sonrası bu sayfaya geri döndürüleceksiniz.
                </p>
                {finalTotal >= 5000 && (
                  <p className="text-xs text-green-700 mt-2 font-medium">
                    ✓ Bu siparişte <strong>vade farksız 3 taksit</strong> imkanı sunulmaktadır.
                  </p>
                )}
              </div>

              {/* Taksit destekli kartlar bilgisi */}
              <div className="border border-gray-100 p-3 text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                <p className="font-semibold text-gray-700 mb-1">💳 Peşin fiyatına taksit seçenekleri:</p>
                <p>
                  <strong>World, Bonus, Maximum, Axess, CardFinans, Paraf</strong> kartlarda geçerlidir.
                  Taksit seçenekleri banka ve kart tipine göre ödeme ekranında görüntülenir.
                </p>
              </div>
              {/* Yasal onaylar — Iyzico zorunlu */}
              <div className="space-y-2.5 pt-2 border-t border-gray-100">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedSales}
                    onChange={e => setAgreedSales(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-black flex-shrink-0"
                  />
                  <span className="text-xs text-gray-700 leading-relaxed">
                    <Link href="/mesafeli-satis" target="_blank" className="underline font-medium">Mesafeli Satış Sözleşmesi</Link>&apos;ni okudum, onaylıyorum.
                  </span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={e => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-black flex-shrink-0"
                  />
                  <span className="text-xs text-gray-700 leading-relaxed">
                    <Link href="/teslimat" target="_blank" className="underline">Ön Bilgilendirme Formu</Link>&apos;nu (teslimat, iade, kargo) okudum,{' '}
                    <Link href="/kvkk" target="_blank" className="underline">KVKK Aydınlatma Metni</Link>&apos;ni anladım ve kabul ediyorum.
                  </span>
                </label>
              </div>

              {errors.submit && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 p-3">{errors.submit}</p>
              )}
              <div className="flex gap-3">
                <button onClick={() => setStep('kargo')}
                  className="flex-1 border border-gray-200 py-3 text-sm hover:border-black transition-colors">
                  ← Geri
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !agreedTerms || !agreedSales}
                  className="flex-1 bg-black text-white py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {submitting ? 'iyzico\'ya yönlendiriliyor...' : `Ödemeyi Tamamla · ${finalTotal.toLocaleString('tr-TR')} TL`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sipariş özeti */}
        <div>
          <div className="border border-gray-100 p-4 sm:p-5 lg:sticky lg:top-20">
            <h2 className="font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">Sipariş Özeti</h2>
            <div className="space-y-2.5 mb-3 max-h-48 overflow-y-auto">
              {items.map(item => (
                <div key={`${item.product.id}-${item.size}`} className="flex justify-between gap-2 text-xs sm:text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{item.product.name}</p>
                    <p className="text-gray-400 text-[10px] sm:text-xs">{item.size} / {item.color} × {item.quantity}</p>
                  </div>
                  <span className="font-medium flex-shrink-0">
                    {(item.product.price * item.quantity).toLocaleString('tr-TR')} TL
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Ara toplam</span>
                <span>{totalPrice.toLocaleString('tr-TR')} TL</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Kargo</span>
                <span className={shippingFee === 0 ? 'text-green-600' : ''}>
                  {shippingFee === 0 ? 'Ücretsiz' : `${shippingFee} TL`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-sm sm:text-base pt-1.5 border-t border-gray-100">
                <span>Toplam</span>
                <span>{finalTotal.toLocaleString('tr-TR')} TL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
