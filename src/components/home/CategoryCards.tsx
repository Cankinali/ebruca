import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/lib/data';

export default function CategoryCards() {
  const featured = categories.slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 sm:mb-12">
        <div>
          <h2 className="text-xl sm:text-3xl font-light tracking-widest uppercase text-gray-900 mb-2">Kategoriler</h2>
          <div className="w-8 sm:w-12 h-0.5 bg-black mb-2 sm:mb-3"></div>
          <p className="text-gray-500 text-[11px] sm:text-sm font-light">Tarzınıza uygun koleksiyonu keşfedin</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-6">
        {featured.map(category => (
          <Link key={category.id} href={`/kategori/${category.slug}`} className="group block outline-none">
            <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden rounded-sm mb-3 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ objectPosition: category.objectPosition ?? 'center' }}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 lg:opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              
              {/* Glassmorphism Title */}
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 p-2 sm:p-3 flex flex-col items-center justify-center transform lg:translate-y-2 opacity-100 lg:opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-[10px] sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white leading-tight">
                    {category.name}
                  </p>
                  {category.productCount && (
                    <p className="text-[9px] sm:text-[10px] text-white/90 mt-0.5 sm:mt-1 font-light tracking-wide">{category.productCount} ÜRÜN</p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
