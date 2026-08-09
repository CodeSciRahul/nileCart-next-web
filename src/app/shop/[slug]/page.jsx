import { Suspense } from "react";
import Header from "@/components/header";
import ShopPage from "@/components/shop/ShopPage.jsx";
import { fetchCategoryBySlug } from "@/lib/data/category.js";
import { buildPageMetadata, truncateMeta } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const { category } = await fetchCategoryBySlug(slug);
    const name = category?.name || "Shop";
    return buildPageMetadata({
      title: name,
      description: truncateMeta(
        category?.description ||
          `Shop ${name} at Nilescart. Browse the latest styles and deals.`
      ),
      path: `/shop/${slug}`,
    });
  } catch {
    return buildPageMetadata({
      title: "Shop",
      description: "Browse fashion categories at Nilescart.",
      path: `/shop/${slug}`,
    });
  }
}

function ShopPageFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-brand-cream" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[3/4] animate-pulse rounded-3xl bg-brand-cream"
          />
        ))}
      </div>
    </div>
  );
}

export default async function ShopSlugPage({ params }) {
  const { slug } = await params;

  return (
    <>
      <Header />
      <Suspense fallback={<ShopPageFallback />}>
        <ShopPage slug={slug} />
      </Suspense>
    </>
  );
}
