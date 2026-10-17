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
      <div className="relative overflow-hidden bg-zinc-100">
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
                className="absolute inset-0 bg-zinc-100"
                aria-hidden
              />
            )
          )}
        </Link>

        {/* Savana-style Top-Left Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute left-1.5 top-1.5 z-20 sm:left-2 sm:top-2">
            <span className="inline-block rounded-none bg-brand-amber px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-sm">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Top-Right Wishlist Button */}
        <div className="absolute right-1.5 top-1.5 z-20 sm:right-2 sm:top-2">
          <WishlistButton
            productId={product?._id}
            iconSize={16}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 p-0 text-black backdrop-blur-sm transition hover:bg-white hover:scale-110 shadow-sm"
          />
        </div>

        {images.length > 1 && (
          <div
            className={`pointer-events-none absolute inset-x-0 z-20 flex justify-center gap-1 transition-opacity duration-300 ${
              hovered ? "bottom-10 opacity-100" : "bottom-2 opacity-0"
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
                    ? "w-3 bg-black"
                    : "w-1.5 bg-white/80 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}

        {/* Savana Quick Add overlay on hover */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex translate-y-full items-center justify-between gap-1 bg-white/95 px-2.5 py-1.5 text-xs font-bold text-black backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0 shadow-sm">
          <button
            type="button"
            onClick={handleAddToBag}
            disabled={addToCartMutation.isPending || !product?._id}
            className="flex flex-1 items-center justify-center gap-1.5 py-1 text-[11px] font-bold uppercase tracking-wider text-black hover:text-brand-amber transition disabled:opacity-50"
          >
            {addToCartMutation.isPending ? (
              <Loader2 className="size-3 animate-spin" aria-hidden />
            ) : (
              <ShoppingBag className="size-3.5" aria-hidden />
            )}
            <span>Add to Bag</span>
          </button>
          <span className="text-zinc-300">|</span>
          <button
            type="button"
            onClick={handleViewSimilar}
            className="p-1 text-zinc-600 hover:text-black transition"
            title="View Similar"
          >
            <Layers2 size={13} aria-hidden />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-2">
        <Link href={href} className="block min-w-0">
          <p className="truncate text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            {brandLabel}
          </p>
          <h3 className="mt-0.5 line-clamp-1 text-[12px] sm:text-[13px] font-medium leading-snug text-foreground group-hover:text-brand-amber transition">
            {product?.title}
          </h3>

          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-[13px] sm:text-[14px] font-black tabular-nums text-foreground">
              {formatRupee(price)}
            </span>
            {mrp != null && Number(mrp) > Number(price) ? (
              <span className="text-[11px] tabular-nums text-zinc-400 line-through">
                {formatRupee(mrp)}
              </span>
            ) : null}
            {discountPercent > 0 ? (
              <span className="text-[10px] font-bold tabular-nums text-brand-amber">
                {discountPercent}% off
              </span>
            ) : null}
          </div>
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
