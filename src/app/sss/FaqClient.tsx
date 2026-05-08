'use client';

import { useState } from 'react';

const faqs = [
  {
    category: 'Sipariş',
    items: [
      {
        q: 'Kargo kaç günde gelir?',
        a: 'Standart kargo siparişler 2-4 iş günü içinde teslim edilir. Ekspres kargo seçeneğinde 1-2 iş günüdür.',
      },
      {
        q: 'Siparişimi nasıl takip edebilirim?',
        a: 'Sipariş onay e-postanızdaki takip numarasını kullanarak veya "Sipariş Sorgula" sayfamızdan siparişinizi takip edebilirsiniz.',
      },
      {
        q: 'Ücretsiz kargo için minimum tutar nedir?',
        a: '5.000 TL ve üzeri siparişlerde standart kargo ücretsizdir.',
      },
    ],
  },
  {
    category: 'Ödeme',
    items: [
      {
        q: 'Hangi ödeme yöntemleri kabul ediliyor?',
        a: 'Visa, Mastercard ve Türk kredi kartlarıyla 3D Secure güvenceli ödeme kabul edilmektedir.',
      },
      {
        q: 'Taksit imkanı var mı?',
        a: '10.000 TL ve üzeri siparişlerde vade farksız 3 taksit imkanı sunulmaktadır.',
      },
      {
        q: 'Ödemem güvende mi?',
        a: 'Evet. 256 Bit SSL şifreleme ve 3D Secure koruması ile tüm ödemeler güvence altındadır.',
      },
    ],
  },
  {
    category: 'İade & Değişim',
    items: [
      {
        q: 'Ürünü iade edebilir miyim?',
        a: 'Teslim tarihinden itibaren 14 gün içinde, kullanılmamış ve etiketli ürünlerinizi iade edebilirsiniz.',
      },
      {
        q: 'Beden değişimi yapılıyor mu?',
        a: 'Evet, stok durumuna göre beden değişimi yapılmaktadır. İletişim sayfamızdan bizimle iletişime geçin.',
      },
    ],
  },
];

export default function FaqClient() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold tracking-wide uppercase">Sıkça Sorulan Sorular</h1>
        <p className="text-gray-500 text-sm mt-2">Merak ettiğiniz soruların cevaplarını burada bulabilirsiniz.</p>
      </div>

      {faqs.map(section => (
        <div key={section.category} className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 pl-1">
            {section.category}
          </h2>
          <div className="divide-y divide-gray-100 border border-gray-100">
            {section.items.map(item => (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(open === item.q ? null : item.q)}
                  className="w-full flex items-center justify-between p-4 text-left text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  {item.q}
                  <svg
                    className={`w-4 h-4 flex-shrink-0 ml-3 transition-transform ${open === item.q ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {open === item.q && (
                  <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-gray-50 p-6 text-center mt-8">
        <p className="text-sm text-gray-600 mb-3">Sorunuzu bulamadınız mı?</p>
        <a
          href="/iletisim"
          className="bg-black text-white px-6 py-2.5 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors inline-block"
        >
          Bize Ulaşın
        </a>
      </div>
    </div>
  );
}
