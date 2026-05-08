import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sayfa Bulunamadı',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
      <h1 className="text-xl font-bold tracking-wide uppercase mb-2">Sayfa Bulunamadı</h1>
      <p className="text-sm text-gray-500 mb-8">
        Aradığınız sayfa kaldırılmış veya hiç var olmamış olabilir.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/"
          className="px-8 py-3 bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors">
          Anasayfaya Dön
        </Link>
        <Link href="/tumurunler"
          className="px-8 py-3 border border-gray-200 text-xs font-medium hover:border-black transition-colors">
          Tüm Ürünler
        </Link>
      </div>
    </div>
  );
}
