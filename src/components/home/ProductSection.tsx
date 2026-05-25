import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ui/ProductCard';
import { expandProductsByColor } from '@/lib/products-display';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}

export default function ProductSection({ title, subtitle, products, viewAllHref }: ProductSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 sm:mb-12">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-widest uppercase text-gray-900 mb-2">{title}</h2>
          <div className="w-12 h-0.5 bg-black mb-3"></div>
          {subtitle && <p className="text-gray-500 text-sm font-light">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref}
            className="group flex items-center gap-2 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-gray-600 hover:text-black transition-colors mt-6 md:mt-0">
            TÜMÜNÜ GÖR
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {expandProductsByColor(products).slice(0, 8).map(product => (
          <ProductCard key={product.displayKey} product={product} />
        ))}
      </div>
    </section>
  );
}
