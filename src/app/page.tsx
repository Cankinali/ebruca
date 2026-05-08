import HeroBanner from '@/components/home/HeroBanner';
import CategoryCards from '@/components/home/CategoryCards';
import ProductSection from '@/components/home/ProductSection';
import TrustBadges from '@/components/home/TrustBadges';
import { dbGetNewArrivals, dbGetBestsellers } from '@/lib/db-helpers';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const newArrivals = await dbGetNewArrivals();
  const bestsellers = await dbGetBestsellers();

  return (
    <>
      <HeroBanner />
      <TrustBadges />
      <CategoryCards />
      {newArrivals.length > 0 && (
        <div className="bg-white">
          <ProductSection
            title="Yeni Gelenler"
            subtitle="2025 ilkbahar/yaz koleksiyonu"
            products={newArrivals}
            viewAllHref="/tumurunler"
          />
        </div>
      )}
      {bestsellers.length > 0 && (
        <div className="bg-gray-50">
          <ProductSection
            title="Çok Satanlar"
            subtitle="En çok tercih edilen ürünler"
            products={bestsellers}
            viewAllHref="/tumurunler"
          />
        </div>
      )}
    </>
  );
}
