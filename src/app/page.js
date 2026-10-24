import Header from "@/components/header";
import Footer from "@/components/Footer";
import Banner from "@/components/banner";
import CategoriesSection from "@/components/category";
import Products from "@/components/products";
import FlashDealsBanner from "@/components/home/FlashDealsBanner";
import PromoBannerGrid from "@/components/home/PromoBannerGrid";
import SavanaPerksStrip from "@/components/home/SavanaPerksStrip";
import CampaignStrip from "@/components/home/CampaignStrip";
import DepartmentStrip from "@/components/home/DepartmentStrip";
import JsonLd from "@/components/seo/JsonLd";
import { fetchProducts } from "@/lib/data/products";
import { fetchSubCategories } from "@/lib/data/category";
import { fetchHome, getHeroBanners } from "@/lib/data/home";
import { buildPageMetadata } from "@/lib/seo";
import { SITE, getSiteUrl } from "@/lib/site";

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  path: "/",
  absoluteTitle: true,
});

export default async function HomePage() {
  const device = "desktop";

  let home = { announcement: null, sections: [], popup: null };
  let arrivals = [];
  let picks = [];
  let categories = [];
  let heroBanners = [];

  try {
    const [homeData, arrivalsData, picksData, categoriesData] =
      await Promise.all([
        fetchHome({ device }),
        fetchProducts({ limit: 10, sort: "-createdAt" }),
        fetchProducts({ limit: 10, sort: "-discountPercent" }),
        fetchSubCategories(),
      ]);
    home = homeData || home;
    arrivals = arrivalsData?.products || [];
    picks = picksData?.products || [];
    categories = categoriesData?.categories || [];
    heroBanners = await getHeroBanners(home, { device });
  } catch {
    // Allow builds / API downtime without failing the whole page.
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Store",
          name: SITE.name,
          description: SITE.description,
          url: getSiteUrl(),
        }}
      />
      <Header announcement={home?.announcement || null} />
      <main className="flex-1">
        {/* 1. Hero Fashion Carousel */}
        <Banner banners={heroBanners} />

        {/* 2. Savana-style Circular Category Avatars (Story Bubbles) */}
        <CategoriesSection categories={categories} />

        {/* 3. Live Flash Deals Strip with Realtime Countdown Timer */}
        <FlashDealsBanner />

        {/* 4. Fresh Drops / New In Products Grid */}
        <Products
          products={arrivals}
          eyebrow="Fresh Drops"
          title="New Arrivals"
          ctaHref="/collections"
          ctaLabel="Shop All New"
        />

        {/* 5. 3-Tile Promotional Campaign Banners */}
        <PromoBannerGrid />

        {/* 6. Trending Deals / High Discount Products Grid */}
        {picks.length > 0 && (
          <Products
            products={picks}
            eyebrow="Up to 70% Off"
            title="Trending Best Sellers"
            ctaHref="/search"
            ctaLabel="View All Deals"
          />
        )}

        {/* 7. Curated Editorial Campaign Strip */}
        <CampaignStrip />

        {/* 8. Department Quick Navigation Tiles */}
        <DepartmentStrip />

        {/* 9. Savana Service & Trust Perks (COD, Free Shipping, 7-Day Returns) */}
        <SavanaPerksStrip />
      </main>
      <Footer />
    </div>
  );
}
