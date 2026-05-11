import { COMPANY } from '@/lib/company';
import Link from 'next/link';

export const metadata = { title: 'Hakkımızda — Ebruca' };

export default function HakkimizdaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">Hakkımızda</h1>
      <div className="w-12 h-0.5 bg-black mb-8"></div>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

        <section>
          <p className="text-base text-gray-800 leading-loose">
            <strong>Ebruca</strong>, modern kadın giyiminde şıklık ve kaliteyi bir araya getiren bir butiktir.
            Çanakkale Biga&apos;daki mağazamızda başladığımız yolculuğumuza, online platformumuzla tüm Türkiye&apos;ye ulaşarak devam ediyoruz.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold uppercase tracking-wider mb-3">Misyonumuz</h2>
          <p>
            Her ortama uygun, kaliteli kumaşlardan üretilmiş, zarif kesimli ürünleri uygun fiyatlarla sunmak.
            Müşterilerimizin tarzlarını yansıtacakları, kendilerini özel hissedecekleri parçalarla buluşturmak temel hedefimizdir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold uppercase tracking-wider mb-3">Neler Sunuyoruz?</h2>
          <ul className="list-disc list-inside space-y-1.5 ml-2">
            <li>Elbise, takım, alt-üst giyim</li>
            <li>Modern ve klasik kesimler</li>
            <li>Geniş beden seçenekleri (XS&apos;ten 5 BEDEN&apos;e)</li>
            <li>Hızlı kargo ve güvenli ödeme</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold uppercase tracking-wider mb-3">Mağaza Adresimiz</h2>
          <p className="leading-relaxed">{COMPANY.address}</p>
          <p className="text-xs text-gray-500 mt-1">{COMPANY.workingHours}</p>
        </section>

        <section>
          <h2 className="text-base font-bold uppercase tracking-wider mb-3">İletişim</h2>
          <ul className="space-y-1">
            <li>📞 <a href={`tel:${COMPANY.phone.replace(/\s/g, '')}`} className="hover:underline">{COMPANY.phone}</a></li>
            <li>📧 <a href={`mailto:${COMPANY.email}`} className="hover:underline">{COMPANY.email}</a></li>
            <li>💬 <a href={COMPANY.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">WhatsApp: {COMPANY.whatsapp}</a></li>
            <li>📷 <a href={COMPANY.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram: @{COMPANY.instagram}</a></li>
          </ul>
        </section>

        <section className="bg-gray-50 p-5 border border-gray-100 mt-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Yasal Bilgiler</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
            <div className="flex justify-between sm:block">
              <dt className="text-gray-500">Ticari Ünvan:</dt>
              <dd className="font-medium">{COMPANY.legalName}</dd>
            </div>
            <div className="flex justify-between sm:block">
              <dt className="text-gray-500">Vergi Dairesi:</dt>
              <dd className="font-medium">{COMPANY.taxOffice}</dd>
            </div>
            <div className="flex justify-between sm:block">
              <dt className="text-gray-500">Vergi No:</dt>
              <dd className="font-medium font-mono">{COMPANY.taxNumber}</dd>
            </div>
            {COMPANY.mersisNumber && (
              <div className="flex justify-between sm:block">
                <dt className="text-gray-500">MERSİS No:</dt>
                <dd className="font-medium font-mono">{COMPANY.mersisNumber}</dd>
              </div>
            )}
            {COMPANY.kepAddress && (
              <div className="flex justify-between sm:block">
                <dt className="text-gray-500">KEP Adresi:</dt>
                <dd className="font-medium">{COMPANY.kepAddress}</dd>
              </div>
            )}
            <div className="flex justify-between sm:block">
              <dt className="text-gray-500">Faaliyet Alanı:</dt>
              <dd className="font-medium">{COMPANY.naceLabel}</dd>
            </div>
          </dl>
        </section>

        <section className="text-center pt-4">
          <Link href="/tumurunler"
            className="inline-block bg-black text-white px-8 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors">
            Ürünlerimize Göz At
          </Link>
        </section>
      </div>
    </div>
  );
}
