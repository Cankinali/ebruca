import { COMPANY } from '@/lib/company';

export const metadata = { title: 'Çerez Politikası — Ebruca' };

export default function CerezPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-8">Çerez Politikası</h1>

      <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-base font-bold mb-2">Çerez Nedir?</h2>
          <p>Çerezler (cookies), web sitelerinin tarayıcınız üzerinden cihazınıza yerleştirdiği küçük metin dosyalarıdır. Sitemizin düzgün çalışması ve deneyiminizin iyileştirilmesi için kullanılır.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Kullandığımız Çerezler</h2>
          <ul className="space-y-3 ml-2">
            <li>
              <strong>Zorunlu Çerezler:</strong> Sepet, oturum yönetimi, güvenlik gibi sitenin temel işlevleri için gereklidir. Devre dışı bırakılamaz.
            </li>
            <li>
              <strong>Performans Çerezleri:</strong> Sitenin hangi sayfalarının görüntülendiğini anonim olarak ölçer, performans iyileştirmesi için kullanılır.
            </li>
            <li>
              <strong>İşlevsel Çerezler:</strong> Tercihlerinizi (dil, görüntüleme ayarları vb.) hatırlamak için kullanılır.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Çerezleri Yönetme</h2>
          <p>Tarayıcı ayarlarınızdan çerezleri silebilir, engelleyebilir veya yalnızca belirli sitelere izin verebilirsiniz. Ancak zorunlu çerezleri devre dışı bırakırsanız sitenin bazı özellikleri çalışmayabilir (örneğin sepete ürün ekleme).</p>
          <ul className="list-disc list-inside ml-2 mt-2 space-y-0.5 text-xs text-gray-500">
            <li>Chrome: Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
            <li>Safari: Tercihler → Gizlilik → Çerezler</li>
            <li>Firefox: Seçenekler → Gizlilik → Çerez ve Site Verileri</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Üçüncü Taraf Çerezleri</h2>
          <p>Sitemizde ödeme işlemlerini güvenli hale getirmek için Iyzico, performans takibi için Google Analytics gibi üçüncü taraflara ait çerezler kullanılabilir.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">İletişim</h2>
          <p>Çerez politikamızla ilgili sorularınız için: {COMPANY.email}</p>
        </section>
      </div>
    </div>
  );
}
