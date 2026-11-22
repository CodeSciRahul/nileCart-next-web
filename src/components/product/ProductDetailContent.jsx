import Header from "@/components/header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/ui/productCard";
import ProductReviewsSection from "@/components/product/ProductReviewsSection";
import ProductStoreSection from "@/components/product/ProductStoreSection";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo";

export default function ProductDetailContent({
  product,
  reviews = [],
  similarProducts = [],
}) {
  const categoryPath = product?.category?.slug
    ? `/shop/${product.category.slug}`
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <JsonLd
        data={[
          productJsonLd(product),
          breadcrumbJsonLd(
            [
              { name: "Home", path: "/" },
              product?.category?.name && categoryPath
                ? { name: product.category.name, path: categoryPath }
                : null,
              { name: product?.title, path: `/product/${product?.slug}` },
            ].filter(Boolean)
          ),
        ]}
      />
      <Header />

      <main className="flex-1 pb-20 lg:pb-12 bg-white">
        <div className="border-b border-neutral-200/80 bg-white">
          <div className="mx-auto max-w-7xl px-4 pt-3 pb-8 sm:px-6 sm:pt-4 sm:pb-10 lg:px-8 lg:pt-5 lg:pb-12">
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumb"
              className="mb-3.5 sm:mb-5 flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs font-medium text-neutral-500"
            >
              <Link href="/" className="hover:text-black transition">
                Home
              </Link>
              <ChevronRight size={12} className="text-neutral-400 shrink-0" />
              {product?.category?.name && (
                <>
                  <Link
                    href={categoryPath || "/"}
                    className="hover:text-black transition truncate max-w-[120px] sm:max-w-none"
                  >
                    {product.category.name}
                  </Link>
                  <ChevronRight size={12} className="text-neutral-400 shrink-0" />
                </>
              )}
              <span className="truncate font-semibold text-neutral-900 max-w-[200px] sm:max-w-md">
                {product?.title}
              </span>
            </nav>

            {/* Core Product Presentation Island */}
            <ProductDetailClient product={product} />
          </div>
        </div>

        {/* Lower Content Sections */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductStoreSection seller={product?.seller} />

          <ProductReviewsSection product={product} reviews={reviews} />

          {similarProducts.length > 0 && (
            <section className="border-t border-neutral-200 py-10 sm:py-14">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                    Handpicked Recommendations
                  </p>
                  <h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl text-neutral-950">
                    You May Also Like
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-3 sm:gap-y-8 md:grid-cols-4">
                {similarProducts.slice(0, 8).map((item) => (
                  <ProductCard key={item?._id} product={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
