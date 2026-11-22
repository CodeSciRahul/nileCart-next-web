"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, ImageOff, Loader2, ShoppingBag, Zap } from "lucide-react";
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
  return `₹ ${Number(value).toLocaleString("en-IN")}`;
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
  const gender = product?.gender || (product?.tags?.includes("unisex") ? "unisex" : null);

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

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(href);
  };

  return (
    <article
      className="group flex h-full flex-col cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xs bg-neutral-100 shadow-xs">
        <Link href={href} className="relative block size-full">
          {images.some((s) => Boolean(s)) ? (
            images.map((src, index) =>
              src ? (
                <OptimizedImage
                  key={`${src}-${index}`}
                  src={src}
                  alt={product?.title || "Product"}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover transition-[opacity,transform] duration-500 ease-out select-none ${
                    index === imageIndex ? "opacity-100" : "opacity-0"
                  } ${hovered ? "scale-[1.03]" : "scale-100"}`}
                  loading="lazy"
                />
              ) : null
            )
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100 p-4 text-center select-none text-neutral-400">
              <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center mb-1.5">
                <ImageOff className="w-5 h-5 text-neutral-400 stroke-[1.5]" />
              </div>
              <span className="text-[11px] font-semibold text-neutral-600">
                No Product Image
              </span>
              <span className="text-[9px] text-neutral-400 mt-0.5">
                Upload in Dashboard
              </span>
            </div>
          )}
        </Link>

        {/* Top Badges (Gender + Discount) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          {gender && (
            <span className="bg-white/90 backdrop-blur-xs text-black text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs">
              {gender}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#fdd835] text-black text-[10px] font-black uppercase px-1.5 py-0.5 rounded-xs shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Button */}
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton
            productId={product?._id}
            iconSize={16}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 p-0 text-black backdrop-blur-xs transition hover:bg-white hover:scale-110 shadow-sm"
          />
        </div>

        {/* Bottom-Left Fast Delivery Zap Pill */}
        <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
          <span className="bg-white/90 backdrop-blur-xs text-neutral-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>Fast delivery</span>
          </span>
        </div>

        {/* Desktop Quick Actions on Hover */}
        <div className="absolute inset-x-2 bottom-2 z-20 hidden md:flex items-center gap-1.5 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <button
            type="button"
            onClick={handleQuickView}
            className="flex-1 bg-white/95 hover:bg-white text-black text-xs font-bold py-2 rounded-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            type="button"
            onClick={handleAddToBag}
            disabled={addToCartMutation.isPending || !product?._id}
            className="bg-black hover:bg-neutral-800 text-white p-2 rounded-xs shadow-md transition-colors"
            title="Add to Bag"
            aria-label="Add to Bag"
          >
            {addToCartMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-2.5 flex flex-1 flex-col">
        <Link href={href} className="block min-w-0">
          <h3 className="line-clamp-1 text-[13px] md:text-[14px] font-bold text-neutral-900 group-hover:text-black transition-colors">
            {product?.title || "Product Title (Set in Dashboard)"}
          </h3>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-sm md:text-base font-black text-black">
              {formatRupee(price)}
            </span>
            {mrp != null && Number(mrp) > Number(price) ? (
              <span className="text-xs text-neutral-600 line-through font-normal">
                {formatRupee(mrp)}
              </span>
            ) : null}
            {discountPercent > 0 ? (
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-1 py-0.2 rounded">
                {discountPercent}% OFF
              </span>
            ) : null}
          </div>
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
