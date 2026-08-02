"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers2, Loader2, ShoppingBag, Star } from "lucide-react";
import WishlistButton from "@/components/wishlist/WishlistButton";
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
  const brandLabel = product?.brand || product?.category?.name || "NileCart";

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
      className="group flex h-full flex-col border border-brand-amber/25 bg-[#FFECB3]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden bg-[#f5f5f5]">
        <Link href={href} className="relative block aspect-[5/4] overflow-hidden">
          {images.map((src, index) => (
            <img
              key={`${src}-${index}`}
              src={src}
              alt={
                index === 0
                  ? product?.title || "Product"
                  : `${product?.title || "Product"} view ${index + 1}`
              }
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                index === imageIndex ? "opacity-100" : "opacity-0"
              }`}
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}
        </Link>

        {discountPercent > 0 && (
          <span className="pointer-events-none absolute left-0 top-2 z-10 bg-brand-amber px-2 py-1 text-[10px] font-bold leading-none text-foreground">
            {discountPercent}% OFF
          </span>
        )}

        <div className="absolute right-2 top-2 z-20">
          <WishlistButton
            productId={product?._id}
            iconSize={15}
            className="!rounded-none !border !border-black/5 !bg-brand-white !p-1.5 !shadow-sm"
          />
        </div>

        {images.length > 1 && (
          <div
            className={`absolute inset-x-0 z-20 flex justify-center gap-1 transition-all duration-300 ${
              hovered ? "bottom-11 opacity-100" : "bottom-2 opacity-0"
            }`}
          >
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show image ${index + 1}`}
                onClick={(e) => handleDotClick(e, index)}
                className={`h-1 rounded-full transition-all ${
                  index === imageIndex
                    ? "w-3 bg-brand-amber"
                    : "w-1.5 bg-brand-white/85 hover:bg-brand-white"
                }`}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleViewSimilar}
          className="absolute inset-x-0 bottom-0 z-30 flex translate-y-full items-center justify-center gap-1.5 bg-brand-white py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-foreground shadow-[0_-4px_12px_rgba(0,0,0,0.06)] transition-transform duration-300 group-hover:translate-y-0"
        >
          <Layers2 size={13} strokeWidth={2} aria-hidden />
          View Similar
        </button>
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2.5 pt-2">
        <Link href={href} className="block min-w-0">
          <p className="truncate text-[13px] font-bold text-foreground">
            {brandLabel}
          </p>
          <h3 className="mt-0.5 line-clamp-1 text-[12px] leading-snug text-brand-gray">
            {product?.title}
          </h3>

          <div className="mt-1.5 inline-flex w-fit items-center gap-1 bg-[#f5f5f5] px-1.5 py-0.5">
            <span className="text-[11px] font-semibold tabular-nums text-foreground">
              {product?.rating ?? 0}
            </span>
            <Star
              size={10}
              fill="currentColor"
              className="shrink-0 text-brand-amber"
              aria-hidden
            />
            <span className="text-[10px] tabular-nums text-brand-gray">
              | {product?.ratingCount ?? 0}
            </span>
          </div>

          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-sm font-bold tabular-nums text-foreground">
              {formatRupee(price)}
            </span>
            {mrp != null && Number(mrp) > Number(price) ? (
              <span className="text-[11px] tabular-nums text-brand-gray line-through">
                {formatRupee(mrp)}
              </span>
            ) : null}
            {discountPercent > 0 ? (
              <span className="text-[11px] font-semibold text-emerald-600">
                ({discountPercent}% OFF)
              </span>
            ) : null}
          </div>
        </Link>

        <button
          type="button"
          onClick={handleAddToBag}
          disabled={addToCartMutation.isPending || !product?._id}
          className="mt-2 inline-flex w-full items-center justify-center gap-1.5 border border-foreground/15 bg-transparent px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-foreground transition hover:border-brand-amber hover:bg-brand-amber disabled:cursor-not-allowed disabled:opacity-60"
        >
          {addToCartMutation.isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              Adding…
            </>
          ) : (
            <>
              <ShoppingBag className="size-3.5" strokeWidth={2} aria-hidden />
              Add to Bag
            </>
          )}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
