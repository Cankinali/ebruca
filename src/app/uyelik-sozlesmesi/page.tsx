import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Üyelik Sözleşmesi',
  description: 'Ebruca üyelik sözleşmesi koşulları ve kullanım şartları.',
  alternates: { canonical: absoluteUrl('/uyelik-sozlesmesi') },
};

export default function MembershipAgreementPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-2xl font-bold tracking-wide uppercase mb-8">Üyelik Sözleşmesi</h1>
      <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
        <section>
          <h2 className="text-base font-bold uppercase tracking-wider mb-3">1. Taraflar</h2>
          <p className="leading-relaxed">
            İşbu Üyelik Sözleşmesi, Ebruca ("Site") ve siteye üye olan kullanıcı ("Üye") arasında akdedilmektedir. Siteye üye olarak bu sözleşmeyi kabul etmiş sayılırsınız.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold uppercase tracking-wider mb-3">2. Üyelik Şartları</h2>
          <p className="leading-relaxed">
            Siteye üye olmak için 18 yaşını doldurmuş olmanız gerekmektedir. Üyelik bilgilerinin doğru ve güncel olması üyenin sorumluluğundadır. Yanlış bilgi verilmesi durumunda üyelik askıya alınabilir.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold uppercase tracking-wider mb-3">3. Sipariş ve Ödeme</h2>
          <p className="leading-relaxed">
            Tüm siparişler 3D Secure güvenceli ödeme altyapısı üzerinden işlenmektedir. Sipariş onayı e-posta yoluyla iletilir. Stok tükenmesi veya fiyat hatası durumunda sipariş iptal edilebilir, ödeme iade edilir.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold uppercase tracking-wider mb-3">4. İptal ve İade</h2>
          <p className="leading-relaxed">
            Teslimat tarihinden itibaren 14 gün içinde, kullanılmamış, etiketi çıkarılmamış ürünler iade edilebilir. İade kargo bedeli alıcıya aittir. Hatalı veya hasarlı ürünlerde kargo bedeli tarafımızca karşılanır.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold uppercase tracking-wider mb-3">5. Fikri Mülkiyet</h2>
          <p className="leading-relaxed">
            Sitedeki tüm içerik, görsel, logo ve tasarımlar Ebruca'ya aittir. İzinsiz kullanım yasal yaptırıma tabidir.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold uppercase tracking-wider mb-3">6. Uygulanacak Hukuk</h2>
          <p className="leading-relaxed">
            İşbu sözleşme Türk Hukuku'na tabidir. Uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
          </p>
        </section>
        <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
          Son güncelleme: Ocak 2025
        </p>
      </div>
    </div>
  );
}
