import Header from "@/components/header";
import Footer from "@/components/Footer";
import Banner from "@/components/banner";
import CategoriesSection from "@/components/category";
import Products from "@/components/products";
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
  // Avoid headers()/UA detection so the homepage can use ISR (better TTFB).
  // Banner component still serves responsive mobile/desktop images via CSS.
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
        fetchProducts({ limit: 8, sort: "-discountPercent" }),
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
    <div className="flex min-h-screen flex-col">
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
      <main>
        <Banner banners={heroBanners} />
        <CategoriesSection categories={categories} />
        <Products
          products={arrivals}
          eyebrow="Just in"
          title="New arrivals"
          description="Fresh drops from the Nilescart edit — ready to wear, ready to ship."
          ctaHref="/collections"
          ctaLabel="Browse collections"
        />
        <CampaignStrip />
        <DepartmentStrip />
        {picks.length > 0 ? (
          <Products
            products={picks}
            eyebrow="Strong edits"
            title="Better discounts"
            description="High-value picks from the live catalog."
            ctaHref="/search"
            ctaLabel="Search the store"
          />
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
