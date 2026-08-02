import Header from "@/components/header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ui/productCard";
import ProductReviewsSection from "@/components/product/ProductReviewsSection";
import ProductStoreSection from "@/components/product/ProductStoreSection";
import ProductDetailClient from "@/components/product/ProductDetailClient";

export default function ProductDetailContent({
  product,
  reviews = [],
  similarProducts = [],
}) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-white">
      <Header />

      <main className="flex-1 pb-24 lg:pb-12">
        <div className="border-b border-brand-amber/10 bg-linear-to-b from-brand-cream/50 to-brand-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-brand-gray"
            >
              <a href="/" className="hover:text-foreground">
                Home
              </a>
              <span aria-hidden>/</span>
              {product?.category?.name && (
                <>
                  <a
                    href={
                      product.category.slug
                        ? `/shop/${product.category.slug}`
                        : "#"
                    }
                    className="hover:text-foreground"
                  >
                    {product.category.name}
                  </a>
                  <span aria-hidden>/</span>
                </>
              )}
              <span className="truncate font-medium text-foreground">
                {product?.title}
              </span>
            </nav>

            <ProductDetailClient product={product} />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductStoreSection seller={product?.seller} />

          <ProductReviewsSection product={product} reviews={reviews} />

          {similarProducts.length > 0 && (
            <section className="border-t border-brand-amber/15 py-12 sm:py-16">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gray">
                    Inspired by your pick
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                    You May Also Like
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
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
