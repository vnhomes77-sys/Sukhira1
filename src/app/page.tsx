import { CategoryCardsStatic } from '@/components/CategoryCards';
import { TrustBadges } from '@/components/TrustBadges';
import { ReviewsSection } from '@/components/ReviewsSection';
import { RecentlyViewedSection } from '@/components/RecentlyViewedSection';
import { VideoSection } from '@/components/VideoSection';
import { AnimatedProductSection } from '@/components/AnimatedProductSection';
import { shopifyFetch, extractNodes, ShopifyProduct } from '@/lib/shopify';
import { GET_PRODUCTS } from '@/lib/queries';

async function getBestSellers() {
  try {
    const data = await shopifyFetch<{
      products: { edges: { node: ShopifyProduct }[] };
    }>({
      query: GET_PRODUCTS,
      variables: { first: 8, sortKey: 'BEST_SELLING' },
      tags: ['products'],
    });
    return extractNodes(data.products.edges);
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return [];
  }
}

async function getNewArrivals() {
  try {
    const data = await shopifyFetch<{
      products: { edges: { node: ShopifyProduct }[] };
    }>({
      query: GET_PRODUCTS,
      variables: { first: 4, sortKey: 'CREATED_AT', reverse: true },
      tags: ['products'],
    });
    return extractNodes(data.products.edges);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
}

export default async function HomePage() {
  const [bestSellers, newArrivals] = await Promise.all([
    getBestSellers(),
    getNewArrivals(),
  ]);

  return (
    <>
      {/* Video Hero Section - Full screen with text overlay */}
      <VideoSection
        title="Discover Premium Products"
        subtitle="Shop the latest in home & kitchen and electronics. Quality guaranteed with free shipping on orders over ₹ 499."
        videoType="self-hosted"
        videoSrc="/videos/_type_video_1080p_202602022223.mp4"
        ctaText="Shop Now"
        ctaLink="/collections/all"
        layout="overlay"
      />

      {/* Categories */}
      <CategoryCardsStatic />

      {/* Best Sellers */}
      <AnimatedProductSection
        title="Best Sellers"
        viewAllLink="/collections/best-sellers"
        products={bestSellers}
        columns={4}
      />

      {/* Trust Badges */}
      <TrustBadges />

      {/* New Arrivals */}
      <AnimatedProductSection
        title="New Arrivals"
        viewAllLink="/collections/new-arrivals"
        products={newArrivals}
        columns={4}
      />

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Recently Viewed */}
      <RecentlyViewedSection />
    </>
  );
}
