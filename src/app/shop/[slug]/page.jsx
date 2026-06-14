import { Suspense } from "react";
import Header from "@/components/header";
import ShopPage from "@/components/shop/ShopPage.jsx";
import { fetchCategoryBySlug } from "@/lib/data/category.js";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const { category } = await fetchCategoryBySlug(slug);
    return {
      title: category?.name || "Shop",
      description:
        category?.description || `Shop ${category?.name} at LightCollection.`,
    };
  } catch {
    return { title: "Shop" };
  }
}

function ShopPageFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-brand-cream" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="aspect-[3/4] animate-pulse rounded-3xl bg-brand-cream" />
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
