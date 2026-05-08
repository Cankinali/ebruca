import Link from 'next/link';
import { COMPANY } from '@/lib/company';

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      {/* Trust badges */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wider">256 BIT SSL</p>
                <p className="text-xs text-white/50 mt-0.5">Güvenli alışveriş</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wider">3D SECURE</p>
                <p className="text-xs text-white/50 mt-0.5">Güvenli ödeme</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wider">ÜCRETSİZ KARGO</p>
                <p className="text-xs text-white/50 mt-0.5">5.000 TL üzeri</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wider">3 TAKSİT</p>
                <p className="text-xs text-white/50 mt-0.5">10.000 TL üzeri</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold tracking-[0.2em] mb-4">EBRUCA</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Modern kadın giyiminde şıklık ve kalitenin adresi. Her ortama uygun koleksiyonlarımızla stilinizi tamamlayın.
            </p>
            <div className="flex gap-3">
              <a href={COMPANY.instagramUrl} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 border border-white/20 rounded flex items-center justify-center hover:bg-white/10" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href={COMPANY.whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 border border-white/20 rounded flex items-center justify-center hover:bg-white/10" aria-label="WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-4">Kategoriler</h4>
            <ul className="space-y-2">
              {['Elbise', 'Takım', 'Alt Giyim', 'Üst Giyim'].map(cat => (
                <li key={cat}>
                  <Link
                    href={`/kategori/${cat.toLowerCase().replace(/\s/g, '-').replace('&', 've').replace('ş', 's').replace('ü', 'u').replace('ğ', 'g').replace('ı', 'i').replace('ö', 'o').replace('ç', 'c')}`}
                    className="text-white/60 text-sm hover:text-white"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-4">Yardım</h4>
            <ul className="space-y-2">
              <li><Link href="/hakkimizda" className="text-white/60 text-sm hover:text-white">Hakkımızda</Link></li>
              <li><Link href="/siparis-sorgula" className="text-white/60 text-sm hover:text-white">Sipariş Sorgula</Link></li>
              <li><Link href="/teslimat" className="text-white/60 text-sm hover:text-white">Teslimat ve Kargo</Link></li>
              <li><Link href="/iade-iptal" className="text-white/60 text-sm hover:text-white">İade ve İptal</Link></li>
              <li><Link href="/sss" className="text-white/60 text-sm hover:text-white">Sıkça Sorulan Sorular</Link></li>
              <li><Link href="/iletisim" className="text-white/60 text-sm hover:text-white">İletişim</Link></li>
              <li><Link href="/mesafeli-satis" className="text-white/60 text-sm hover:text-white">Mesafeli Satış Sözleşmesi</Link></li>
              <li><Link href="/gizlilik" className="text-white/60 text-sm hover:text-white">Gizlilik Politikası</Link></li>
              <li><Link href="/kvkk" className="text-white/60 text-sm hover:text-white">KVKK Aydınlatma</Link></li>
              <li><Link href="/cerez" className="text-white/60 text-sm hover:text-white">Çerez Politikası</Link></li>
              <li><Link href="/uyelik-sozlesmesi" className="text-white/60 text-sm hover:text-white">Üyelik Sözleşmesi</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-4">İletişim</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${COMPANY.phone.replace(/\s/g, '')}`} className="text-white/60 text-sm hover:text-white">{COMPANY.phone}</a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${COMPANY.email}`} className="text-white/60 text-sm hover:text-white">{COMPANY.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <a href={COMPANY.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-white/60 text-sm hover:text-white">WhatsApp Destek</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Şirket Bilgileri (Iyzico için zorunlu) */}
        <div className="border-t border-white/10 mt-10 pt-6 mb-4">
          <p className="text-white/50 text-[11px] leading-relaxed">
            <strong className="text-white/70">{COMPANY.legalName}</strong>
            {' · '}{COMPANY.address}
            {' · Vergi Dairesi: '}{COMPANY.taxOffice}
            {' · Vergi No: '}{COMPANY.taxNumber}
            {COMPANY.mersisNumber && ` · MERSİS: ${COMPANY.mersisNumber}`}
            {COMPANY.kepAddress && ` · KEP: ${COMPANY.kepAddress}`}
          </p>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            © 2025 Ebruca. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-xs">Güvenli ödeme:</span>
            <div className="flex items-center gap-2">
              <span className="bg-white px-2 py-1 rounded flex items-center" aria-label="iyzico">
                <svg viewBox="0 0 70 28" className="h-3.5 w-auto">
                  <text x="0" y="20" fontSize="22" fontWeight="700" fill="#1E64FF" fontFamily="system-ui">iyzico</text>
                </svg>
              </span>
              <span className="bg-white px-2 py-1 rounded flex items-center" aria-label="Visa">
                <svg viewBox="0 0 50 16" className="h-3.5 w-auto">
                  <text x="0" y="13" fontSize="14" fontStyle="italic" fontWeight="900" fill="#1A1F71" fontFamily="system-ui">VISA</text>
                </svg>
              </span>
              <span className="bg-white px-2 py-1 rounded flex items-center" aria-label="Mastercard">
                <svg viewBox="0 0 36 22" className="h-4 w-auto">
                  <circle cx="13" cy="11" r="9" fill="#EB001B" />
                  <circle cx="23" cy="11" r="9" fill="#F79E1B" />
                  <path d="M18 4.2a8.95 8.95 0 010 13.6 8.95 8.95 0 010-13.6z" fill="#FF5F00" />
                </svg>
              </span>
              <span className="text-white/50 text-[10px] font-semibold tracking-wider">3D SECURE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
