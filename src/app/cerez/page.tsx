import Link from 'next/link';
import { COMPANY } from '@/lib/company';
import CerezTercihleri from './CerezTercihleri';

export const metadata = { title: 'Çerez Politikası — Ebruca' };

// Metin sitenin GERÇEKTE kullandığı çerezleri anlatır. Yeni bir çerez / izleme
// aracı eklenirse burası ve /kvkk da güncellenmeli (wiki/buyume/Yasal-Cerceve.md).
const SON_GUNCELLEME = '28.09.2026';

export default function CerezPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">Çerez Politikası</h1>
      <p className="text-xs text-gray-400 mb-8">Son güncelleme: {SON_GUNCELLEME}</p>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-base font-bold mb-2">Çerez Nedir?</h2>
          <p>
            Çerezler (cookies), ziyaret ettiğiniz web sitesinin tarayıcınız aracılığıyla cihazınıza kaydettiği
            küçük metin dosyalarıdır. Benzer amaçla tarayıcının yerel depolama alanı (localStorage /
            sessionStorage) da kullanılabilir; bu politikada hepsi &quot;çerez&quot; olarak anılır.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Tercihleriniz</h2>
          <p className="mb-3">
            Zorunlu çerezler dışındaki çerezler yalnızca <strong>açık onayınızla</strong> kullanılır. Tercihinizi
            dilediğiniz zaman buradan değiştirebilirsiniz:
          </p>
          <CerezTercihleri />
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">1. Zorunlu Çerezler (onay gerekmez)</h2>
          <p className="mb-2">Sitenin çalışması için gereklidir; kapatılamaz.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-gray-200">
              <thead className="bg-gray-50">
                <tr><th className="text-left p-2">Ad</th><th className="text-left p-2">Amaç</th><th className="text-left p-2">Süre</th></tr>
              </thead>
              <tbody>
                <tr className="border-t"><td className="p-2">Sepet (yerel depolama)</td><td className="p-2">Sepetinizdeki ürünleri hatırlamak</td><td className="p-2">7 gün</td></tr>
                <tr className="border-t"><td className="p-2">ebruca_session</td><td className="p-2">Üye girişi oturumu (yalnızca giriş yaparsanız)</td><td className="p-2">30 gün</td></tr>
                <tr className="border-t"><td className="p-2">ebruca_consent</td><td className="p-2">Çerez tercihinizi hatırlamak</td><td className="p-2">1 yıl</td></tr>
                <tr className="border-t"><td className="p-2">Sipariş özeti (oturum depolaması)</td><td className="p-2">Ödeme sonrası sipariş bilgisinin başarı sayfasına taşınması</td><td className="p-2">Sekme kapanana kadar</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">2. Pazarlama Çerezleri (yalnızca onayınızla)</h2>
          <p className="mb-2">
            Reklamlarımızın etkisini ölçmek ve size ilgili reklamlar gösterebilmek için <strong>Meta Pixel</strong>
            (Meta Platforms Ireland Ltd. / Meta Platforms, Inc.) kullanırız. Onay vermezseniz Meta Pixel hiç yüklenmez
            ve Meta&apos;ya hiçbir bilgi gönderilmez.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-gray-200">
              <thead className="bg-gray-50">
                <tr><th className="text-left p-2">Ad</th><th className="text-left p-2">Amaç</th><th className="text-left p-2">Süre</th></tr>
              </thead>
              <tbody>
                <tr className="border-t"><td className="p-2">_fbp</td><td className="p-2">Tarayıcınızı Meta reklam ölçümü için tanımlamak</td><td className="p-2">90 gün</td></tr>
                <tr className="border-t"><td className="p-2">_fbc</td><td className="p-2">Facebook / Instagram reklamına tıklayarak geldiğinizi kaydetmek</td><td className="p-2">90 gün</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2">
            Onay verdiğinizde Meta&apos;ya iletilen bilgiler: ziyaret ettiğiniz sayfalar, görüntülediğiniz ve sepete
            eklediğiniz ürünler, ödeme adımına geçmeniz ve satın alma (sipariş numarası, ürünler, tutar); tarayıcı
            bilgisi ve IP adresi. Giriş yaptıysanız ya da ödeme formunu doldurduysanız e-posta, telefon, ad-soyad ve
            şehir bilgileriniz <strong>tek yönlü şifrelenerek (hash)</strong> eşleştirme amacıyla iletilir. Bu
            aktarım yurt dışına yapılır; ayrıntılar <Link prefetch={false} href="/kvkk" className="underline text-black">KVKK Aydınlatma Metni</Link>&apos;ndedir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">3. Ödeme Sayfası</h2>
          <p>
            Kart bilgileriniz, ödeme sırasında yönlendirildiğiniz Iyzico&apos;nun güvenli ödeme sayfasında girilir.
            Iyzico kendi alan adında, ödeme güvenliği için kendi çerezlerini kullanabilir; bu çerezler Iyzico&apos;nun
            çerez politikasına tabidir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Kullanmadıklarımız</h2>
          <p>Sitemizde Google Analytics veya başka bir analitik / reklam aracı kullanılmamaktadır.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Tarayıcıdan Yönetme</h2>
          <p>
            Çerezleri tarayıcı ayarlarınızdan da silebilir veya engelleyebilirsiniz. Zorunlu çerezleri engellerseniz
            sepet ve üye girişi gibi özellikler çalışmayabilir.
          </p>
          <ul className="list-disc list-inside ml-2 mt-2 space-y-0.5 text-xs text-gray-500">
            <li>Chrome: Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
            <li>Safari: Ayarlar → Gizlilik → Web Sitesi Verilerini Yönet</li>
            <li>Firefox: Ayarlar → Gizlilik ve Güvenlik → Çerezler ve Site Verileri</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">İletişim</h2>
          <p>Çerez politikamızla ilgili sorularınız için: {COMPANY.email}</p>
        </section>
      </div>
    </div>
  );
}
