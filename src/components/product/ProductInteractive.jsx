"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { getProductImageUrl } from "@/lib/productHelpers";
import { useAddToCart } from "@/hooks/useCart";

export default function ProductGallery({ product }) {
  const images = product?.images || [];
  const normalizedImages = images.map((image) =>
    typeof image === "string" ? image : image?.url
  );
  const [selectedImage, setSelectedImage] = useState(
    normalizedImages[0] || getProductImageUrl(product)
  );

  return (
    <div>
      <div className="overflow-hidden rounded-3xl bg-gray-100">
        <img
          src={selectedImage}
          alt={product?.title || ""}
          className="h-[700px] w-full object-cover transition duration-500 hover:scale-105"
        />
      </div>

      <div className="mt-4 flex gap-3 overflow-x-auto">
        {normalizedImages.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setSelectedImage(image)}
            className={`overflow-hidden rounded-xl border ${
              selectedImage === image ? "border-brand-amber" : "border-gray-200"
            }`}
          >
            <img src={image} alt="" className="h-20 w-20 object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProductPurchasePanel({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null
  );
  const addToCartMutation = useAddToCart();

  return (
    <>
      <div className="mt-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-brand-amber">
            ₹{selectedVariant?.price}
          </span>
          <span className="text-xl text-gray-400 line-through">
            ₹{selectedVariant?.mrp}
          </span>
          <span className="font-semibold text-green-600">
            {product?.discountPercent}% OFF
          </span>
        </div>
        <p className="mt-2 text-green-600">
          You save ₹{selectedVariant?.mrp - selectedVariant?.price}
        </p>
      </div>

      <div className="mt-8">
        <h3 className="mb-3 font-semibold">Color</h3>
        <div className="flex gap-3">
          <div
            className="h-10 w-10 rounded-full border-2 border-gray-300"
            style={{ backgroundColor: selectedVariant?.colorHex }}
          />
        </div>
        <p className="mt-2 text-brand-gray">{selectedVariant?.color}</p>
      </div>

      <div className="mt-8">
        <h3 className="mb-3 font-semibold">Select Size</h3>
        <div className="flex flex-wrap gap-3">
          {product?.variants?.map((variant) => (
            <button
              key={variant._id}
              type="button"
              onClick={() => setSelectedVariant(variant)}
              className={`rounded-xl border px-5 py-3 ${
                selectedVariant?._id === variant?._id
                  ? "bg-black text-brand-white"
                  : "border-gray-300"
              }`}
            >
              {variant?.size}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-brand-gray">
          {selectedVariant?.stock} pieces available
        </p>
      </div>

      <div className="mt-10 flex gap-4">
        <button
          type="button"
          onClick={() =>
            addToCartMutation.mutate({
              productId: product?._id,
              variantSku: selectedVariant?.sku,
            })
          }
          disabled={addToCartMutation.isPending}
          className="flex-1 cursor-pointer rounded-2xl bg-brand-amber py-4 font-semibold text-brand-white hover:bg-brand-amber/90 disabled:opacity-60"
        >
          {addToCartMutation.isPending ? "Adding..." : "Add To Bag"}
        </button>

        <button
          type="button"
          className="cursor-pointer rounded-2xl border p-4"
          aria-label="Add to wishlist"
        >
          <Heart />
        </button>
      </div>
    </>
  );
}
