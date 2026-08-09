"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchasePanel from "@/components/product/ProductPurchasePanel";
import ProductTrustBadges from "@/components/product/ProductTrustBadges";
import {
  getColorOptions,
  getGalleryMedia,
  pickInitialVariant,
} from "@/lib/pdpHelpers";

/**
 * Client island: gallery + purchase state stay in sync when color changes.
 */
export default function ProductDetailClient({ product }) {
  const colorOptions = useMemo(
    () => getColorOptions(product?.variants || []),
    [product?.variants]
  );

  const initialVariant = useMemo(
    () => pickInitialVariant(product?.variants || []),
    [product?.variants]
  );

  const initialColorKey =
    colorOptions.find((c) =>
      c.variants.some((v) => v._id === initialVariant?._id)
    )?.key || colorOptions[0]?.key;

  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [selectedColorKey, setSelectedColorKey] = useState(initialColorKey);
  const [quantity, setQuantity] = useState(1);

  const media = useMemo(
    () => getGalleryMedia(product, selectedVariant),
    [product, selectedVariant]
  );

  const brandLabel =
    (typeof product?.brand === "object"
      ? product?.brand?.name
      : product?.brand) ||
    product?.seller?.storeName ||
    product?.category?.name ||
    "Nilescart";

  const ratingAvg = Number(product?.rating?.average) || 0;
  const ratingCount = Number(product?.rating?.count) || 0;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
      <ProductGallery media={media} title={product?.title || "Product"} />

      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        {/* Badges */}
        <div className="mb-3 flex flex-wrap gap-2">
          {product?.isTrending && (
            <span className="bg-brand-cream px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground ring-1 ring-brand-amber/30">
              Trending
            </span>
          )}
          {product?.isNewArrival && (
            <span className="bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
              New Arrival
            </span>
          )}
          {product?.isOnSale && (
            <span className="bg-orange-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-700 ring-1 ring-orange-200">
              Sale
            </span>
          )}
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gray">
          {brandLabel}
        </p>

        <h1 className="mt-1 text-2xl font-black leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {product?.title}
        </h1>

        {product?.category?.name && (
          <p className="mt-1.5 text-sm text-brand-gray">
            {product.category.slug ? (
              <Link
                href={`/shop/${product.category.slug}`}
                className="underline-offset-2 hover:text-foreground hover:underline"
              >
                {product.category.name}
              </Link>
            ) : (
              product.category.name
            )}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1.5 bg-brand-cream/80 px-2.5 py-1 ring-1 ring-brand-amber/25">
            <Star
              size={14}
              fill="currentColor"
              className="text-brand-amber"
            />
            <span className="text-sm font-bold tabular-nums">
              {ratingAvg.toFixed(1)}
            </span>
          </div>
          <a
            href="#reviews"
            className="text-sm text-brand-gray underline-offset-2 hover:text-foreground hover:underline"
          >
            {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
          </a>
        </div>

        {product?.description && (
          <p className="mt-5 text-sm leading-relaxed text-brand-gray line-clamp-4 lg:line-clamp-none">
            {product.description}
          </p>
        )}

        <div className="mt-8">
          <ProductPurchasePanel
            product={product}
            selectedVariant={selectedVariant}
            onSelectVariant={setSelectedVariant}
            selectedColorKey={selectedColorKey}
            onSelectColor={setSelectedColorKey}
            quantity={quantity}
            onQuantityChange={setQuantity}
          />
        </div>

        <div className="mt-8">
          <ProductTrustBadges />
        </div>

        {product?.tags?.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-gray">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-brand-amber/20 bg-brand-cream/40 px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {product?.seller?.storeName && (
          <a
            href="#store"
            className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-brand-gray underline-offset-2 hover:text-foreground hover:underline"
          >
            Sold by{" "}
            <span className="text-foreground">{product.seller.storeName}</span>
            {product.seller.approvalStatus === "Approved" && (
              <span className="ml-1 text-emerald-700">· Verified</span>
            )}
          </a>
        )}
      </div>
    </div>
  );
}
