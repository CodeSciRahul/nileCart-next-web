import Header from "@/components/header";
import Footer from "@/components/Footer";
import Banner from "@/components/banner";
import SpecialOffersSection from "@/components/home/SpecialOffersSection";
import BestSellersBanner from "@/components/home/BestSellersBanner";
import TrendingNowSection from "@/components/home/TrendingNowSection";
import NewArrivalsBanner from "@/components/home/NewArrivalsBanner";
import ClearanceSaleBanner from "@/components/home/ClearanceSaleBanner";
import Products from "@/components/products";
import JsonLd from "@/components/seo/JsonLd";
import { fetchProducts } from "@/lib/data/products";
import { fetchHome, getHeroBanners } from "@/lib/data/home";
import { buildPageMetadata } from "@/lib/seo";
import { SITE, getSiteUrl } from "@/lib/site";

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: "nilescart | Official Online Store",
  description:
    "Shop the latest luxury contemporary trends at NILESCART. Unisex, menswear, and womenswear collections, knitwear, tailoring, and essentials with easy returns and fast delivery.",
  path: "/",
  absoluteTitle: true,
});

export default async function HomePage() {
  const device = "desktop";

  let home = { announcement: null, sections: [], popup: null };
  let arrivals = [];
  let picks = [];
  let heroBanners = [];

  try {
    const [homeData, arrivalsData, picksData] =
      await Promise.allSettled([
        fetchHome({ device }),
        fetchProducts({ limit: 12, sort: "-createdAt" }),
        fetchProducts({ limit: 8, sort: "-discountPercent" }),
      ]);

    if (homeData.status === "fulfilled") home = homeData.value || home;
    if (arrivalsData.status === "fulfilled") arrivals = arrivalsData.value?.products || [];
    if (picksData.status === "fulfilled") picks = picksData.value?.products || [];

    heroBanners = await getHeroBanners(home, { device });
  } catch {
    // API downtime tolerance
  }

  const sections = Array.isArray(home?.sections) ? home.sections : [];

  const findSection = (key, type) =>
    sections.find(
      (s) => s.key === key || (type && s.type === type)
    );

  const specialOffersSection = findSection("special-offers", "special_offers");
  const bestsellersSection = findSection("bestsellers-banner");
  const trendingSection = findSection("trending-now", "trending_cards");
  const newArrivalsSection = findSection("new-arrivals-banner");
  const clearanceSection = findSection("clearance-sale-banner");
  const forYouSection = findSection("for-you", "recommended_products");

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans antialiased selection:bg-black selection:text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Store",
          name: "NILESCART",
          description:
            "Shop the latest luxury contemporary trends at NILESCART. Unisex, menswear, and womenswear collections, knitwear, tailoring, and essentials with easy returns and fast delivery.",
          url: getSiteUrl(),
        }}
      />

      {/* 1. Header with announcement ticker & search */}
      <Header announcement={home?.announcement || null} />

      <main className="flex-1 pb-10">
        {/* 1. Hero Campaign Showcase & Member Banner */}
        <Banner banners={heroBanners} />

        {/* 2. Special Offers (4 Price-Point Cards) */}
        <SpecialOffersSection section={specialOffersSection} />

        {/* 3. Best Sellers Banner (Hot right now. Best Sellers) */}
        <BestSellersBanner section={bestsellersSection} />

        {/* 4. Trending Now (4 Trend Cards) */}
        <TrendingNowSection section={trendingSection} products={picks} />

        {/* 5. New Arrivals Full-Width Banner */}
        <NewArrivalsBanner section={newArrivalsSection} />

        {/* 6. Last Chances Clearance Sale Banner */}
        <ClearanceSaleBanner section={clearanceSection} />

        {/* 7. FOR YOU Curated Product Grid with Gender Switcher */}
        <Products
          products={arrivals}
          title={forYouSection?.title || "FOR YOU"}
          eyebrow={forYouSection?.subtitle}
          showGenderFilter={true}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
