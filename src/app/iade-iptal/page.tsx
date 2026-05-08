import { COMPANY } from '@/lib/company';

export const metadata = { title: 'İade ve İptal Şartları — Ebruca' };

export default function IadeIptalPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-8">İade ve İptal Şartları</h1>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-base font-bold mb-2">Cayma Hakkı (14 Gün)</h2>
          <p>6502 sayılı Tüketicinin Korunması Hakkında Kanun gereği, ürünün size teslim edildiği günden itibaren <strong>14 gün içinde</strong> herhangi bir gerekçe göstermeksizin iade hakkınız bulunmaktadır.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">İade Şartları</h2>
          <ul className="list-disc list-inside space-y-1.5 ml-2">
            <li>Ürün etiketi çıkarılmamış olmalıdır</li>
            <li>Ürün kullanılmamış, yıkanmamış ve hasarsız olmalıdır</li>
            <li>Orijinal ambalajıyla birlikte gönderilmelidir</li>
            <li>İç giyim, mayo gibi hijyenik ürünler iade edilemez</li>
            <li>Özel sipariş üzerine üretilen ürünler iade edilemez</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">İade Süreci</h2>
          <ol className="list-decimal list-inside space-y-1.5 ml-2">
            <li>{COMPANY.email} adresine sipariş numaranızla birlikte iade talebinizi iletin</li>
            <li>Tarafımızdan iade onayı ve adres bilgisini aldıktan sonra ürünü kargoya verin</li>
            <li>Ürün tarafımıza ulaştıktan ve kontrolden geçtikten sonra <strong>14 gün içinde</strong> ücret iadesi yapılır</li>
            <li>İade, ödemenin yapıldığı kart/hesaba aynı yöntemle gerçekleştirilir</li>
          </ol>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">İade Kargo Ücreti</h2>
          <p>Ürün hatalı, eksik veya hasarlıysa kargo ücreti tarafımızdan karşılanır. Müşteri kaynaklı iadelerde (beğenmeme, beden uyumsuzluğu vb.) kargo ücreti ALICI&apos;ya aittir.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Sipariş İptali</h2>
          <p>Siparişiniz kargoya verilmeden önce iptal talebinde bulunabilirsiniz. Kargoya verilen siparişler için iade süreci işletilir.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Hatalı / Hasarlı Ürün</h2>
          <p>Teslimatta ürünü kontrol etmenizi öneririz. Hasarlı ürün durumunda kargoyu teslim almadan tutanak tutturarak iade edebilirsiniz. Üründe sonradan fark edilen üretim hatası için 24 saat içinde {COMPANY.email} adresinden bize ulaşın.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">İletişim</h2>
          <p>İade ve iptal işlemleri için:</p>
          <ul className="ml-2 mt-1 space-y-0.5">
            <li>📧 {COMPANY.email}</li>
            <li>📞 {COMPANY.phone}</li>
            <li>💬 WhatsApp: {COMPANY.whatsapp}</li>
            <li>🕐 {COMPANY.workingHours}</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
