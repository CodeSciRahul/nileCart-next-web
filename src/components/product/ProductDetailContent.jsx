import Header from "@/components/header";
import ProductCard from "@/components/ui/productCard";
import ProductReviewsSection from "@/components/product/ProductReviewsSection";
import ProductGallery, {
  ProductPurchasePanel,
} from "@/components/product/ProductInteractive";
import { Star, ShoppingBag, Truck, ShieldCheck } from "lucide-react";

export default function ProductDetailContent({
  product,
  reviews = [],
  similarProducts = [],
}) {
  return (
    <div>
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery product={product} />

          <div>
            <div className="mb-4 flex gap-2">
              {product?.isTrending && (
                <span className="rounded-full bg-brand-cream px-3 py-1 text-sm text-brand-amber">
                  Trending
                </span>
              )}
              {product?.isNewArrival && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600">
                  New Arrival
                </span>
              )}
              {product?.isOnSale && (
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-600">
                  Sale
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold">{product?.title}</h1>
            <p className="mt-2 text-brand-gray">{product?.category?.name}</p>

            <div className="mt-4 flex items-center gap-2">
              <Star fill="currentColor" className="text-yellow-500" size={18} />
              <span className="font-medium">{product?.rating?.average}</span>
              <span className="text-brand-gray">
                ({product?.rating?.count} reviews)
              </span>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="mt-2 text-brand-gray">{product?.description}</p>
            </div>

            <ProductPurchasePanel product={product} />

            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="text-center">
                <Truck className="mx-auto" />
                <p className="mt-2 text-sm">Free Delivery</p>
              </div>
              <div className="text-center">
                <ShieldCheck className="mx-auto" />
                <p className="mt-2 text-sm">Secure Payment</p>
              </div>
              <div className="text-center">
                <ShoppingBag className="mx-auto" />
                <p className="mt-2 text-sm">Easy Returns</p>
              </div>
            </div>

            {product?.tags?.length > 0 && (
              <div className="mt-10">
                <h3 className="mb-3 font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <ProductReviewsSection product={product} reviews={reviews} />

        {similarProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 text-3xl font-bold">You May Also Like</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {similarProducts.map((item) => (
                <ProductCard key={item?._id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
