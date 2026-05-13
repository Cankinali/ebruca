import { COMPANY } from '@/lib/company';

export const metadata = { title: 'Teslimat ve Kargo Şartları — Ebruca' };

export default function TeslimatPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-8">Teslimat ve Kargo Şartları</h1>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-base font-bold mb-2">Kargo Süresi</h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Siparişler genellikle <strong>1 iş günü</strong> içinde kargoya verilir.</li>
            <li>Kargo teslim süresi şehre göre <strong>1-4 iş günüdür</strong>.</li>
            <li>Hafta sonu ve resmi tatil günlerinde kargo işlemi yapılmaz.</li>
            <li>14:00&apos;e kadar verilen siparişler aynı gün, sonrasındakiler ertesi gün kargoya verilir.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Kargo Ücreti</h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>5.000 TL ve üzeri</strong> alışverişlerde kargo ücretsizdir.</li>
            <li>Standart kargo: 90 TL</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Kargo Firmaları</h2>
          <p>Aras Kargo, Yurtiçi Kargo, MNG Kargo veya PTT ile gönderim yapılır. Kargo firması bölgenize göre belirlenir.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Sipariş Takibi</h2>
          <p>Siparişiniz kargoya verildiğinde takip numaranız e-posta ile size iletilir. Ayrıca <a href="/siparis-sorgula" className="underline text-black">Sipariş Sorgula</a> sayfasından siparişinizin durumunu öğrenebilirsiniz.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Teslimatta Dikkat Edilecekler</h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Kargoyu teslim alırken paketi kontrol edin.</li>
            <li>Paket hasarlı görünüyorsa kargo görevlisinden tutanak tutturun.</li>
            <li>Hasarlı ürünleri tutanaksız teslim almayın.</li>
            <li>Yanlış adres bilgisi nedeniyle yapılan tekrar gönderimlerin ücreti ALICI&apos;ya aittir.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Yurt Dışı Gönderim</h2>
          <p>Şu an için yalnızca Türkiye sınırları içinde gönderim yapılmaktadır.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Sorularınız İçin</h2>
          <p>📧 {COMPANY.email} · 📞 {COMPANY.phone}</p>
        </section>
      </div>
    </div>
  );
}
