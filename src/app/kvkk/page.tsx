import { COMPANY } from '@/lib/company';

export const metadata = { title: 'KVKK Aydınlatma Metni — Ebruca' };

export default function KvkkPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">KVKK Aydınlatma Metni</h1>
      <p className="text-xs text-gray-400 mb-8">6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında</p>

      <div className="space-y-5 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-base font-bold mb-2">1. Veri Sorumlusu</h2>
          <p>{COMPANY.legalName} (&quot;Ebruca&quot;), 6698 sayılı KVKK kapsamında Veri Sorumlusu sıfatıyla hareket etmektedir.</p>
          <p className="mt-1">Adres: {COMPANY.address}</p>
          <p>İletişim: {COMPANY.email} / {COMPANY.phone}</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">2. İşlenen Kişisel Veriler</h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Kimlik bilgileri (ad, soyad)</li>
            <li>İletişim bilgileri (e-posta, telefon, adres)</li>
            <li>Sipariş ve ödeme bilgileri (sipariş geçmişi, fatura/teslimat adresi)</li>
            <li>Site kullanım bilgileri (IP, çerez verileri)</li>
          </ul>
          <p className="mt-2 text-xs text-gray-500">Kart bilgileriniz Ebruca sunucularında saklanmaz; lisanslı ödeme kuruluşu (Iyzico) tarafından PCI-DSS standartlarına uygun şekilde işlenir.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">3. İşlenme Amacı</h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Sipariş alımı, hazırlanması ve kargolanması</li>
            <li>Müşteri hizmetleri ve iletişim</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi (fatura, vergi vb.)</li>
            <li>İade ve iptal işlemleri</li>
            <li>Site güvenliği ve dolandırıcılık önleme</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">4. Aktarım</h2>
          <p>Kişisel verileriniz; kargo firmaları, ödeme kuruluşu (Iyzico), muhasebe yazılımları ve yasal otoriteler ile zorunluluk durumlarında paylaşılır. Yurt dışına aktarım yapılmaz.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">5. Saklama Süresi</h2>
          <p>Veriler, ilgili mevzuatta öngörülen süreler boyunca veya işlenme amacının gerektirdiği süre kadar saklanır. Yasal saklama süresi sona erdiğinde silinir, yok edilir veya anonim hale getirilir.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">6. Haklarınız</h2>
          <p>KVKK&apos;nın 11. maddesi uyarınca:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Düzeltilmesini, silinmesini veya yok edilmesini isteme</li>
            <li>İşlemenin kanuna aykırı olması nedeniyle zarara uğramanız halinde tazminat talep etme</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">7. Başvuru Yöntemi</h2>
          <p>KVKK kapsamındaki haklarınızı kullanmak için <strong>{COMPANY.email}</strong> adresine kimliğinizi doğrulayan belgelerle birlikte yazılı başvuruda bulunabilirsiniz. Talebiniz en geç 30 gün içinde yanıtlanır.</p>
        </section>
      </div>
    </div>
  );
}
