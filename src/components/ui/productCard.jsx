"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers2, Loader2, ShoppingBag } from "lucide-react";
import WishlistButton from "@/components/wishlist/WishlistButton";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/context/AuthContext";
import { useAuthGate } from "@/context/AuthGateContext";
import { AUTH_ACTIONS } from "@/lib/authActions";
import { getProductImageUrls } from "@/lib/productHelpers";

const IMAGE_INTERVAL_MS = 1100;

function formatRupee(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

const ProductCard = ({ product }) => {
  const router = useRouter();
  const addToCartMutation = useAddToCart();
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useAuthGate();
  const [hovered, setHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const images = useMemo(() => {
    const urls = getProductImageUrls(product);
    return urls.length > 0 ? urls : [""];
  }, [product]);

  const price = product?.price ?? product?.variants?.[0]?.price;
  const mrp = product?.mrp ?? product?.variants?.[0]?.mrp;
  const discountPercent = product?.discountPercent;
  const defaultSku = product?.variants?.[0]?.sku;
  const href = `/product/${product?.slug}?cat=${product?.category?._id || ""}`;
  const similarHref = product?.category?.slug
    ? `/shop/${product.category.slug}`
    : href;
  const brandLabel = product?.brand || product?.category?.name || "Nilescart";

  useEffect(() => {
    if (!hovered || images.length < 2) return undefined;

    const id = window.setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, IMAGE_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [hovered, images.length]);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setImageIndex(0);
  }, []);

  const handleDotClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex(index);
  };

  const handleViewSimilar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(similarHref);
  };

  const handleAddToBag = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (addToCartMutation.isPending || !product?._id) return;

    const payload = {
      productId: product._id,
      variantSku: defaultSku,
    };

    const run = () => addToCartMutation.mutate(payload);

    if (isAuthenticated) {
      run();
      return;
    }

    await requireAuth({
      action: AUTH_ACTIONS.ADD_TO_CART,
      payload,
      onSuccess: run,
    });
  };

  return (
    <article
      className="group flex h-full flex-col bg-transparent"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden bg-brand-sand/40">
        <Link
          href={href}
          className="relative block aspect-[3/4] overflow-hidden"
        >
          {images.map((src, index) =>
            src ? (
              <OptimizedImage
                key={`${src}-${index}`}
                src={src}
                alt={
                  index === 0
                    ? product?.title || "Product"
                    : `${product?.title || "Product"} view ${index + 1}`
                }
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className={`object-cover transition-[opacity,transform] duration-500 ease-out ${
                  index === imageIndex ? "opacity-100" : "opacity-0"
                } ${hovered ? "scale-[1.04]" : "scale-100"}`}
                loading="lazy"
              />
            ) : (
              <span
                key={`empty-${index}`}
                className="absolute inset-0 bg-brand-sand/50"
                aria-hidden
              />
            )
          )}
        </Link>

        <div className="absolute right-2 top-2 z-20 sm:right-2.5 sm:top-2.5">
          <WishlistButton
            productId={product?._id}
            iconSize={16}
            className="!rounded-none !border-0 !bg-transparent !p-1 !shadow-none !backdrop-blur-none hover:!scale-105"
          />
        </div>

        {images.length > 1 && (
          <div
            className={`pointer-events-none absolute inset-x-0 z-20 flex justify-center gap-1 transition-opacity duration-300 ${
              hovered ? "bottom-10 opacity-100" : "bottom-2.5 opacity-0"
            }`}
          >
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show image ${index + 1}`}
                onClick={(e) => handleDotClick(e, index)}
                className={`pointer-events-auto h-0.5 transition-all ${
                  index === imageIndex
                    ? "w-4 bg-brand-ink"
                    : "w-2 bg-brand-white/80 hover:bg-brand-white"
                }`}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleViewSimilar}
          className="absolute inset-x-0 bottom-0 z-30 flex translate-y-full items-center justify-center gap-1.5 bg-brand-white/95 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-brand-ink transition-transform duration-300 group-hover:translate-y-0"
        >
          <Layers2 size={12} strokeWidth={1.75} aria-hidden />
          View Similar
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-2.5">
        <Link href={href} className="block min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-ink">
            {brandLabel}
          </p>
          <h3 className="mt-0.5 line-clamp-2 text-[13px] font-normal leading-snug text-brand-gray">
            {product?.title}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-[13px] font-semibold tabular-nums text-brand-ink">
              {formatRupee(price)}
            </span>
            {mrp != null && Number(mrp) > Number(price) ? (
              <span className="text-[12px] tabular-nums text-brand-stone line-through">
                {formatRupee(mrp)}
              </span>
            ) : null}
            {discountPercent > 0 ? (
              <span className="text-[11px] font-medium tabular-nums text-brand-amber">
                {discountPercent}% off
              </span>
            ) : null}
          </div>
        </Link>

        <button
          type="button"
          onClick={handleAddToBag}
          disabled={addToCartMutation.isPending || !product?._id}
          className="mt-2 inline-flex w-fit items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-brand-ink transition hover:text-brand-amber disabled:cursor-not-allowed disabled:opacity-50"
        >
          {addToCartMutation.isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              Adding…
            </>
          ) : (
            <>
              <ShoppingBag className="size-3.5" strokeWidth={1.75} aria-hidden />
              Add to Bag
            </>
          )}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
