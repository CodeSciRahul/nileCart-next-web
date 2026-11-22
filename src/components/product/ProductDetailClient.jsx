"use client";

import { useMemo, useState } from "react";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchasePanel from "@/components/product/ProductPurchasePanel";
import {
  getColorOptions,
  getGalleryMedia,
  pickInitialVariant,
} from "@/lib/pdpHelpers";

/**
 * Client island: gallery + purchase state stay in sync when color changes.
 * Modern, compact 7/5 grid ratio with zero awkward whitespace.
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

  // High-contrast fashion badge chip for the gallery
  const badges = useMemo(() => {
    const list = [];
    if (product?.isOnSale) {
      list.push(
        <span
          key="sale"
          className="rounded-xs bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm"
        >
          Sale
        </span>
      );
    }
    if (product?.isTrending) {
      list.push(
        <span
          key="trending"
          className="rounded-xs bg-black px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm"
        >
          Trending
        </span>
      );
    }
    if (product?.isNewArrival) {
      list.push(
        <span
          key="new"
          className="rounded-xs bg-[#fdd835] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-sm"
        >
          New
        </span>
      );
    }
    return list.length > 0 ? <>{list}</> : null;
  }, [product?.isOnSale, product?.isTrending, product?.isNewArrival]);

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
      {/* Left Column: Product Visuals & Gallery (7 Cols) */}
      <div className="min-w-0 lg:col-span-7">
        <ProductGallery
          media={media}
          title={product?.title || "Product"}
          badges={badges}
        />
      </div>

      {/* Right Column: Product Information, Purchase Actions & Accordion (5 Cols) */}
      <div className="min-w-0 lg:col-span-5 lg:sticky lg:top-20 lg:self-start">
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
    </div>
  );
}
