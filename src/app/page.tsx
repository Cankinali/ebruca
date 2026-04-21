import HeroBanner from '@/components/home/HeroBanner';
import CategoryCards from '@/components/home/CategoryCards';
import ProductSection from '@/components/home/ProductSection';
import TrustBadges from '@/components/home/TrustBadges';
import { dbGetNewArrivals, dbGetBestsellers } from '@/lib/db-helpers';
import { getFeaturedProducts, getBestsellers } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Veritabanından al, yoksa mock veriye dön
  let newArrivals = await dbGetNewArrivals();
  let bestsellers = await dbGetBestsellers();

  if (newArrivals.length === 0) newArrivals = getFeaturedProducts();
  if (bestsellers.length === 0) bestsellers = getBestsellers();

  return (
    <>
      <HeroBanner />
      <TrustBadges />
      <CategoryCards />
      <div className="bg-white">
        <ProductSection
          title="Yeni Gelenler"
          subtitle="2025 ilkbahar/yaz koleksiyonu"
          products={newArrivals}
          viewAllHref="/kategori/elbise"
        />
      </div>
      <div className="bg-gray-50">
        <ProductSection
          title="Çok Satanlar"
          subtitle="En çok tercih edilen ürünler"
          products={bestsellers}
          viewAllHref="/kategori/elbise"
        />
      </div>
    </>
  );
}
