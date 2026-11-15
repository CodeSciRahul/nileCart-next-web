import Header from "@/components/header";
import Footer from "@/components/Footer";
import Banner from "@/components/banner";
import CategoriesSection from "@/components/category";
import Products from "@/components/products";
import FlashDealsBanner from "@/components/home/FlashDealsBanner";
import PromoBannerGrid from "@/components/home/PromoBannerGrid";
import JsonLd from "@/components/seo/JsonLd";
import { fetchProducts } from "@/lib/data/products";
import { fetchSubCategories } from "@/lib/data/category";
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
  let categories = [];
  let heroBanners = [];

  try {
    const [homeData, arrivalsData, picksData, categoriesData] =
      await Promise.allSettled([
        fetchHome({ device }),
        fetchProducts({ limit: 12, sort: "-createdAt" }),
        fetchProducts({ limit: 8, sort: "-discountPercent" }),
        fetchSubCategories(),
      ]);

    if (homeData.status === "fulfilled") home = homeData.value || home;
    if (arrivalsData.status === "fulfilled") arrivals = arrivalsData.value?.products || [];
    if (picksData.status === "fulfilled") picks = picksData.value?.products || [];
    if (categoriesData.status === "fulfilled") categories = categoriesData.value?.categories || [];

    heroBanners = await getHeroBanners(home, { device });
  } catch {
    // API downtime tolerance
  }

  // Find dynamic campaign banner if configured in home sections from dashboard
  const campaignSection = home?.sections?.find(
    (s) => s.type === "banner" || s.key === "campaign_banner" || s.key === "new_arrivals"
  );

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

      {/* 1. Header with announcement ticker & categories */}
      <Header announcement={home?.announcement || null} />

      <main className="flex-1 pb-10">
        {/* 2. Hero Campaign Showcase & Member Banner */}
        <Banner banners={heroBanners} />

        {/* 3. 4 Price Point / Collection Tiles */}
        <CategoriesSection categories={categories} />

        {/* 4. Trending Now 4-Card Section */}
        <FlashDealsBanner items={picks} title="TRENDING NOW" />

        {/* 5. Campaign Banner (Manageable from Dashboard) */}
        <PromoBannerGrid banner={campaignSection} />

        {/* 6. FOR YOU Curated Product Grid with Gender Switcher */}
        <Products
          products={arrivals}
          title="FOR YOU"
          showGenderFilter={true}
        />
      </main>

      {/* 7. Footer & Floating Actions */}
      <Footer />
    </div>
  );
}
