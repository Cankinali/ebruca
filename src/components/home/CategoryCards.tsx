import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/lib/data';
import { prisma } from '@/lib/prisma';

export default async function CategoryCards() {
  // Üst kategori → alt kategori eşleştirmesi
  const CHILDREN: Record<string, string[]> = {
    'alt-giyim': ['etek', 'pantolon'],
    'takim':     ['etekli-takim', 'pantolonlu-takim'],
  };

  // Tüm ürün sayımlarını çek
  const counts = await prisma.product.groupBy({
    by: ['category'],
    _count: { id: true },
  });

  const rawMap: Record<string, number> = {};
  counts.forEach(c => { rawMap[c.category] = c._count.id; });

  // Üst kategoriler için alt kategori sayılarını da topla
  const countMap: Record<string, number> = { ...rawMap };
  for (const [parent, children] of Object.entries(CHILDREN)) {
    const childTotal = children.reduce((sum, child) => sum + (rawMap[child] ?? 0), 0);
    countMap[parent] = (rawMap[parent] ?? 0) + childTotal;
  }

  const featured = categories;

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-10">
        <h2 className="text-xl sm:text-3xl font-light tracking-widest uppercase text-gray-900 mb-2">Kategoriler</h2>
        <div className="w-8 sm:w-12 h-0.5 bg-black mb-2 sm:mb-3"></div>
        <p className="text-gray-500 text-[11px] sm:text-sm font-light">Tarzınıza uygun koleksiyonu keşfedin</p>
      </div>

      {/* 4 kategori: mobil 2'li, tablet 2'li, masaüstü 4 eşit sütun */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {featured.map(category => {
          const realCount = countMap[category.slug] ?? 0;
          return (
            <Link key={category.id} href={`/kategori/${category.slug}`} className="group block outline-none">
              <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden rounded-sm shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ objectPosition: category.objectPosition ?? 'center' }}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 lg:opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Glassmorphism Title */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                  <div className="bg-white/20 backdrop-blur-md border border-white/30 py-2 px-3 flex flex-col items-center justify-center">
                    <p className="text-[11px] sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white leading-tight text-center">
                      {category.name}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-white/80 mt-0.5 font-light tracking-wide">
                      {realCount} ÜRÜN
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
