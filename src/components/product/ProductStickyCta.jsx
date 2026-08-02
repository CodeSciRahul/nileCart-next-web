"use client";

import { Loader2, ShoppingBag, Zap } from "lucide-react";
import { formatRupee } from "@/lib/pdpHelpers";
import { cn } from "@/lib/utils";

/**
 * Sticky mobile CTA bar — Add to Bag + Buy Now.
 */
export default function ProductStickyCta({
  price,
  mrp,
  disabled,
  outOfStock,
  adding,
  buying,
  onAdd,
  onBuy,
}) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-brand-amber/20 bg-brand-white/95 px-3 py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden",
        "pb-[max(0.625rem,env(safe-area-inset-bottom))]"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2">
        <div className="min-w-0 shrink-0 pr-1">
          <p className="text-base font-black tabular-nums text-foreground">
            {formatRupee(price)}
          </p>
          {mrp > price && (
            <p className="text-[10px] text-brand-gray line-through">
              {formatRupee(mrp)}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onAdd}
          disabled={disabled || outOfStock || adding}
          className="flex flex-1 items-center justify-center gap-1.5 border border-brand-amber bg-brand-cream py-3 text-xs font-bold uppercase tracking-wide text-foreground transition hover:bg-brand-amber disabled:cursor-not-allowed disabled:opacity-50"
        >
          {adding ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ShoppingBag size={16} />
          )}
          {outOfStock ? "Sold Out" : "Add"}
        </button>

        <button
          type="button"
          onClick={onBuy}
          disabled={disabled || outOfStock || buying || adding}
          className="flex flex-1 items-center justify-center gap-1.5 bg-brand-amber py-3 text-xs font-bold uppercase tracking-wide text-foreground transition hover:bg-brand-amber/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {buying ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Zap size={16} />
          )}
          Buy Now
        </button>
      </div>
    </div>
  );
}
