"use client";

import Link from "next/link";
import {
  Heart,
  Loader2,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/utils";

function imageUrl(variant, product) {
  const vImg = variant?.images?.[0];
  const pImg = product?.images?.[0];
  if (typeof vImg === "string") return vImg;
  if (vImg?.url) return vImg.url;
  if (typeof pImg === "string") return pImg;
  return pImg?.url || null;
}

export default function BagItemCard({
  item,
  variant,
  currency = "UGX",
  updating = false,
  removing = false,
  saving = false,
  onQuantityChange,
  onRemove,
  onSaveForLater,
}) {
  const product = item?.product;
  const href = product?.slug
    ? `/product/${product.slug}?cat=${product?.category?._id || ""}`
    : "#";
  const price = Number(variant?.price) || 0;
  const mrp = Number(variant?.mrp) || 0;
  const discount =
    mrp > price && mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const stock = Number(variant?.stock) || 0;
  const atMax = item.quantity >= stock;
  const lowStock = stock > 0 && stock <= 5;
  const busy = updating || removing || saving;
  const img = imageUrl(variant, product);
  const brand =
    (typeof product?.brand === "object" ? product?.brand?.name : product?.brand) ||
    product?.category?.name ||
    "Nilescart";

  return (
    <article
      className={cn(
        "flex gap-3 border border-brand-amber/20 bg-brand-white p-3 transition duration-200 sm:gap-5 sm:p-4",
        "hover:border-brand-amber/40",
        busy && "opacity-80"
      )}
    >
      <Link
        href={href}
        className="relative h-32 w-24 shrink-0 overflow-hidden border border-brand-amber/15 bg-[#FFECB3] sm:h-40 sm:w-28"
      >
        {img ? (
          <OptimizedImage
            src={img}
            alt={product?.title || "Product"}
            fill
            sizes="(max-width: 640px) 96px, 112px"
            className="object-cover transition duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-xs text-brand-gray">
            No image
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gray">
              {brand}
            </p>
            <Link
              href={href}
              className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-foreground hover:underline sm:text-base"
            >
              {product?.title}
            </Link>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-2 text-xs text-brand-gray">
          {variant?.color && (
            <span className="inline-flex items-center gap-1.5 border border-brand-amber/20 bg-brand-cream/40 px-2 py-1">
              {variant.colorHex && (
                <span
                  className="size-3 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: variant.colorHex }}
                  aria-hidden
                />
              )}
              {variant.color}
            </span>
          )}
          {variant?.size && (
            <span className="border border-brand-amber/20 bg-brand-cream/40 px-2 py-1">
              Size: <strong className="text-foreground">{variant.size}</strong>
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-base font-black tabular-nums sm:text-lg">
            {formatMoney(price, currency)}
          </span>
          {mrp > price && (
            <span className="text-sm text-brand-gray line-through tabular-nums">
              {formatMoney(mrp, currency)}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-brand-amber px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
              {discount}% OFF
            </span>
          )}
        </div>

        <p
          className={cn(
            "mt-1.5 text-[11px] font-semibold",
            lowStock ? "text-orange-600" : "text-emerald-700"
          )}
        >
          {lowStock ? `Only ${stock} left` : "In stock"}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
          <div className="inline-flex items-center border border-brand-amber/25 bg-brand-cream/30">
            <button
              type="button"
              className="flex size-9 items-center justify-center transition hover:bg-brand-amber/30 disabled:opacity-40"
              onClick={() => onQuantityChange(-1)}
              disabled={busy || item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-8 text-center text-sm font-bold tabular-nums">
              {updating ? (
                <Loader2 size={14} className="mx-auto animate-spin" />
              ) : (
                item.quantity
              )}
            </span>
            <button
              type="button"
              className="flex size-9 items-center justify-center transition hover:bg-brand-amber/30 disabled:opacity-40"
              onClick={() => onQuantityChange(1)}
              disabled={busy || atMax}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onSaveForLater}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-[11px] font-bold uppercase tracking-wide text-brand-gray transition hover:bg-brand-cream hover:text-foreground disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Heart size={13} />
              )}
              Save
            </button>
            <button
              type="button"
              onClick={onRemove}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-[11px] font-bold uppercase tracking-wide text-brand-gray transition hover:bg-red-50 hover:text-destructive disabled:opacity-50"
            >
              {removing ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Trash2 size={13} />
              )}
              Remove
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
