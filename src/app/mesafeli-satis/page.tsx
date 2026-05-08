import { COMPANY } from '@/lib/company';

export const metadata = { title: 'Mesafeli Satış Sözleşmesi — Ebruca' };

export default function MesafeliSatisPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">Mesafeli Satış Sözleşmesi</h1>
      <p className="text-xs text-gray-400 mb-8">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>

      <div className="prose prose-sm max-w-none space-y-5 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-base font-bold mt-6 mb-2">1. TARAFLAR</h2>
          <p><strong>SATICI:</strong></p>
          <ul className="ml-4 mt-1 space-y-0.5">
            <li>Ünvan: {COMPANY.legalName}</li>
            <li>Adres: {COMPANY.address}</li>
            <li>Telefon: {COMPANY.phone}</li>
            <li>E-posta: {COMPANY.email}</li>
            <li>Vergi Dairesi / No: {COMPANY.taxOffice} / {COMPANY.taxNumber}</li>
            {COMPANY.mersisNumber && <li>MERSİS No: {COMPANY.mersisNumber}</li>}
            {COMPANY.kepAddress && <li>KEP Adresi: {COMPANY.kepAddress}</li>}
          </ul>
          <p className="mt-2"><strong>ALICI:</strong> Sipariş formunda belirtilen ad-soyad, adres ve iletişim bilgilerine sahip kişi.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mt-6 mb-2">2. KONU</h2>
          <p>İşbu sözleşmenin konusu, ALICI&apos;nın SATICI&apos;ya ait <strong>{COMPANY.website}</strong> alan adlı internet sitesinden elektronik ortamda siparişini yaptığı, sözleşmede bahsi geçen nitelikleri haiz ve yine sözleşmede satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mt-6 mb-2">3. SÖZLEŞME KONUSU ÜRÜN VE ÖDEME BİLGİLERİ</h2>
          <p>Ürünün cinsi, türü, miktarı, marka/modeli, satış fiyatı, ödeme şekli, teslim alacak kişi ve teslim adresi sipariş özetinde belirtildiği gibidir. Tüm fiyatlara KDV dahildir. Kargo ücreti varsa ALICI&apos;ya aittir.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mt-6 mb-2">4. TESLİMAT</h2>
          <p>Ürün, ALICI&apos;nın sipariş formunda belirttiği teslimat adresine, sözleşmenin onaylanmasını takiben en geç <strong>30 gün</strong> içinde teslim edilir. Tipik teslimat süresi 1-4 iş günüdür. Kargo süresinin uzaması SATICI&apos;nın sorumluluğunda değildir.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mt-6 mb-2">5. CAYMA HAKKI</h2>
          <p>ALICI; sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişiye/kuruluşa tesliminden itibaren <strong>14 (on dört) gün</strong> içinde, hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.</p>
          <p className="mt-2">Cayma hakkının kullanılması için bu süre içinde SATICI&apos;ya yazılı olarak (e-posta: {COMPANY.email}) bildirimde bulunulması ve ürünün ambalajının açılmamış, kullanılmamış ve yeniden satılabilir durumda olması gerekir. Etiketi çıkarılmış, yıkanmış, iç çamaşırı/mayo, kişisel kullanıma özel ürünler iade edilemez.</p>
          <p className="mt-2">Cayma hakkının kullanılması durumunda iade kargo ücreti ALICI&apos;ya aittir. SATICI, ürünü teslim aldığı tarihten itibaren 14 gün içinde toplam bedeli ALICI&apos;ya iade eder.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mt-6 mb-2">6. CAYMA HAKKININ KULLANILAMAYACAĞI HALLER</h2>
          <p>Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi uyarınca; ALICI&apos;ya özel olarak hazırlanan ürünler, hijyenik nedenlerle iadesi uygun olmayan ürünler (iç giyim, mayo vb.), ambalajı açılmış ürünler için cayma hakkı kullanılamaz.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mt-6 mb-2">7. UYUŞMAZLIK ÇÖZÜMÜ</h2>
          <p>İşbu sözleşmenin uygulanmasından doğacak uyuşmazlıklarda, Sanayi ve Ticaret Bakanlığı&apos;nca her yıl ilan edilen değere kadar İl/İlçe Tüketici Hakem Heyetleri, bu değerin üzerindeki uyuşmazlıklarda Tüketici Mahkemeleri yetkilidir.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mt-6 mb-2">8. YÜRÜRLÜK</h2>
          <p>ALICI, siparişini elektronik ortamda onayladığı an, işbu sözleşmenin tüm şartlarını okuduğunu, anladığını ve kabul ettiğini beyan eder. Sözleşme, siparişin onaylanmasıyla yürürlüğe girer.</p>
        </section>
      </div>
    </div>
  );
}
