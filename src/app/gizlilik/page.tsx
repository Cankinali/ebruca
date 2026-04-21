export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-2xl font-bold tracking-wide uppercase mb-8">Gizlilik Politikası</h1>
      <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
        <section>
          <h2 className="text-base font-bold uppercase tracking-wider mb-3">1. Kişisel Verilerin Toplanması</h2>
          <p className="leading-relaxed">
            Ebruca olarak, web sitemizi kullandığınızda sizden bazı kişisel bilgiler talep edebiliriz. Bu bilgiler; ad, soyad, e-posta adresi, telefon numarası ve teslimat adresi gibi verilerdir. Bu veriler yalnızca sipariş işlemlerinizin tamamlanması ve size daha iyi hizmet sunulması amacıyla kullanılmaktadır.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold uppercase tracking-wider mb-3">2. Verilerin Kullanımı</h2>
          <p className="leading-relaxed">
            Toplanan kişisel veriler; sipariş işlemleri, kargo takibi, müşteri hizmetleri ve yasal yükümlülüklerin yerine getirilmesi amacıyla kullanılmaktadır. Verileriniz üçüncü taraflarla yasal zorunluluklar dışında paylaşılmamaktadır.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold uppercase tracking-wider mb-3">3. Çerezler (Cookie)</h2>
          <p className="leading-relaxed">
            Web sitemiz, kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanmaktadır. Çerezleri tarayıcı ayarlarınızdan devre dışı bırakabilirsiniz; ancak bu durumda bazı özellikler çalışmayabilir.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold uppercase tracking-wider mb-3">4. Veri Güvenliği</h2>
          <p className="leading-relaxed">
            Kişisel verileriniz 256 Bit SSL şifreleme ile korunmaktadır. Ödeme bilgileriniz tarafımızca saklanmamakta, 3D Secure güvenceli ödeme altyapısı üzerinden işlenmektedir.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold uppercase tracking-wider mb-3">5. KVKK Hakları</h2>
          <p className="leading-relaxed">
            6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında; verilerinize erişme, düzeltme, silme ve işlenmesine itiraz etme haklarına sahipsiniz. Bu haklarınızı kullanmak için info@ebruca.com adresine başvurabilirsiniz.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold uppercase tracking-wider mb-3">6. İletişim</h2>
          <p className="leading-relaxed">
            Gizlilik politikamız hakkında sorularınız için: <a href="mailto:info@ebruca.com" className="underline">info@ebruca.com</a>
          </p>
        </section>
        <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
          Son güncelleme: Ocak 2025
        </p>
      </div>
    </div>
  );
}
