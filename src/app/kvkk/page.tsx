import Link from 'next/link';
import { COMPANY } from '@/lib/company';

export const metadata = { title: 'KVKK Aydınlatma Metni — Ebruca' };

// Metin sitenin GERÇEKTE yaptığı işlemeyi anlatır. Yeni bir hizmet sağlayıcı,
// izleme aracı veya veri aktarımı eklenirse burası ve /cerez güncellenmeli
// (wiki/buyume/Yasal-Cerceve.md).
const SON_GUNCELLEME = '28.09.2026';

export default function KvkkPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">KVKK Aydınlatma Metni</h1>
      <p className="text-xs text-gray-400 mb-8">
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında · Son güncelleme: {SON_GUNCELLEME}
      </p>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-base font-bold mb-2">1. Veri Sorumlusu</h2>
          <p>{COMPANY.legalName} (&quot;{COMPANY.brand}&quot;), 6698 sayılı KVKK kapsamında Veri Sorumlusu sıfatıyla hareket etmektedir.</p>
          <p className="mt-1">Adres: {COMPANY.address}</p>
          <p>İletişim: {COMPANY.email} / {COMPANY.phone}</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">2. İşlenen Kişisel Veriler</h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Kimlik bilgileri (ad, soyad)</li>
            <li>İletişim bilgileri (e-posta, telefon, teslimat adresi)</li>
            <li>Müşteri işlem bilgileri (sipariş içeriği ve geçmişi, ödeme sonucu, kargo takip bilgisi)</li>
            <li>Üyelik bilgileri (üye olursanız: şifrenizin geri döndürülemez özeti, kayıtlı adres, onay tarihleri)</li>
            <li>İşlem güvenliği bilgileri (IP adresi, tarayıcı bilgisi, giriş denemeleri)</li>
            <li>
              Pazarlama bilgileri — <strong>yalnızca pazarlama çerezlerine onay verdiyseniz</strong>: Meta çerez
              kimlikleri (_fbp, _fbc), sitede görüntülediğiniz / sepete eklediğiniz / satın aldığınız ürünler
            </li>
          </ul>
          <p className="mt-2 text-xs text-gray-500">
            Kart bilgileriniz {COMPANY.brand} sunucularına hiç ulaşmaz; lisanslı ödeme kuruluşu Iyzico tarafından
            PCI-DSS standartlarına uygun şekilde işlenir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">3. İşleme Amaçları ve Hukuki Sebepler</h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              Siparişin alınması, hazırlanması, kargolanması, iade ve iptal işlemleri; üyelik hizmeti —
              <em> sözleşmenin kurulması ve ifası</em> (KVKK m.5/2-c)
            </li>
            <li>
              Fatura, vergi ve mesafeli satış mevzuatından doğan yükümlülükler —
              <em> hukuki yükümlülüğün yerine getirilmesi</em> (m.5/2-ç)
            </li>
            <li>
              Site ve ödeme güvenliği, dolandırıcılık ve kötüye kullanımın önlenmesi, müşteri hizmetleri —
              <em> meşru menfaat</em> (m.5/2-f)
            </li>
            <li>
              Reklam ölçümü ve size ilgili reklamların gösterilmesi (Meta Pixel ve Conversions API) —
              <em> açık rızanız</em> (m.5/1). Onay vermezseniz bu amaçla hiçbir veri işlenmez.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">4. Aktarım</h2>
          <p className="mb-2">Kişisel verileriniz yalnızca yukarıdaki amaçlar için ve gerektiği ölçüde şu alıcı gruplarıyla paylaşılır:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Kargo firmaları — teslimat için ad, telefon ve adres</li>
            <li>Iyzico Ödeme Hizmetleri A.Ş. — ödemenin alınması</li>
            <li>Muhasebe hizmeti ve yetkili kamu kurumları — yasal yükümlülükler ve talep hâlinde</li>
            <li>
              Teknik altyapı hizmet sağlayıcıları — sitenin barındırılması (Vercel), veritabanı (Turso),
              görsel dağıtımı ve alan adı hizmetleri (Cloudflare), e-posta gönderimi (Resend). Bu sağlayıcılar
              verileri yalnızca bizim adımıza, hizmeti sunmak için işler.
            </li>
            <li>
              Meta Platforms Ireland Ltd. / Meta Platforms, Inc. — <strong>yalnızca açık rızanızla</strong>, reklam
              ölçümü için. Satın almada e-posta, telefon, ad-soyad ve şehir bilgileriniz Meta&apos;ya gönderilmeden
              önce <strong>tek yönlü şifrelenir (hash)</strong>.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">5. Yurt Dışına Aktarım</h2>
          <p>
            Yukarıdaki teknik altyapı sağlayıcılarının ve Meta&apos;nın sunucuları Türkiye dışında (AB ve ABD
            dahil) bulunabilir; bu nedenle verileriniz yurt dışına aktarılabilir. Aktarım KVKK&apos;nın 9. maddesine
            uygun olarak yapılır. Meta&apos;ya reklam amaçlı aktarım, çerez bandında ya da{' '}
            <Link prefetch={false} href="/cerez" className="underline text-black">Çerez Politikası</Link>{' '}
            sayfasında vereceğiniz açık rızaya dayanır; rızanızı aynı sayfadan dilediğiniz zaman geri alabilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">6. Toplama Yöntemi</h2>
          <p>
            Verileriniz; sipariş, üyelik ve iletişim formlarına girdiğiniz bilgiler ile sitenin kullanımı sırasında
            çerezler ve sunucu kayıtları aracılığıyla elektronik ortamda toplanır.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">7. Saklama Süresi</h2>
          <p>
            Veriler, ilgili mevzuatta öngörülen süreler (ör. ticari defter ve fatura kayıtları için 10 yıl) boyunca
            veya işleme amacının gerektirdiği süre kadar saklanır; süre sona erdiğinde silinir, yok edilir veya anonim
            hâle getirilir. Pazarlama çerezleri en fazla 90 gün saklanır ve onayınızı geri aldığınızda silinir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">8. Haklarınız</h2>
          <p>KVKK&apos;nın 11. maddesi uyarınca:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
            <li>KVKK&apos;nın 7. maddesindeki şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
            <li>Düzeltme, silme ve yok etme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
            <li>Münhasıran otomatik sistemlerle analiz edilmesi sonucunda aleyhinize bir sonuç çıkmasına itiraz etme</li>
            <li>Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
          </ul>
          <p className="mt-2">Açık rızanızı (pazarlama çerezleri) dilediğiniz zaman <Link prefetch={false} href="/cerez" className="underline text-black">Çerez Politikası</Link> sayfasından geri alabilirsiniz.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">9. Başvuru Yöntemi</h2>
          <p>
            KVKK kapsamındaki haklarınızı kullanmak için <strong>{COMPANY.email}</strong> adresine kimliğinizi
            doğrulayan bilgilerle birlikte yazılı olarak başvurabilirsiniz. Talebiniz en geç 30 gün içinde ücretsiz
            olarak yanıtlanır.
          </p>
        </section>
      </div>
    </div>
  );
}
