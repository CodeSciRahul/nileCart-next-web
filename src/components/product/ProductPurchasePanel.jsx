"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Loader2,
  MapPin,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
  Zap,
} from "lucide-react";
import WishlistButton from "@/components/wishlist/WishlistButton";
import ProductStickyCta from "@/components/product/ProductStickyCta";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/context/AuthContext";
import { useAuthGate } from "@/context/AuthGateContext";
import { AUTH_ACTIONS } from "@/lib/authActions";
import {
  formatRupee,
  getColorOptions,
  getDiscountPercent,
  getEstimatedDelivery,
  getSavings,
  getSizesForColor,
  getStockState,
  pickInitialVariant,
} from "@/lib/pdpHelpers";
import { cn } from "@/lib/utils";
import { showSuccessToast } from "@/lib/toast";

export default function ProductPurchasePanel({
  product,
  selectedVariant,
  onSelectVariant,
  quantity,
  onQuantityChange,
  selectedColorKey,
  onSelectColor,
}) {
  const router = useRouter();
  const addToCartMutation = useAddToCart();
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useAuthGate();
  const [buying, setBuying] = useState(false);
  const [pincode, setPincode] = useState("");
  const [checkedPin, setCheckedPin] = useState("");
  const [sizeHint, setSizeHint] = useState(false);

  const colorOptions = useMemo(
    () => getColorOptions(product?.variants || []),
    [product?.variants]
  );

  const activeColor =
    colorOptions.find((c) => c.key === selectedColorKey) || colorOptions[0];

  const sizes = getSizesForColor(activeColor);
  const price = selectedVariant?.price;
  const mrp = selectedVariant?.mrp;
  const discount =
    getDiscountPercent(price, mrp) || Number(product?.discountPercent) || 0;
  const savings = getSavings(price, mrp);
  const stockState = getStockState(selectedVariant?.stock);
  const outOfStock = stockState.key === "oos";
  const maxQty = Math.max(1, Math.min(Number(selectedVariant?.stock) || 1, 10));

  const delivery = useMemo(
    () => getEstimatedDelivery(checkedPin),
    [checkedPin]
  );

  const buildPayload = () => ({
    productId: product?._id,
    variantSku: selectedVariant?.sku,
    quantity,
  });

  const ensureVariant = () => {
    if (!selectedVariant?.sku) {
      setSizeHint(true);
      return false;
    }
    if (outOfStock) return false;
    return true;
  };

  const runAdd = (payload) =>
    new Promise((resolve, reject) => {
      addToCartMutation.mutate(payload, {
        onSuccess: resolve,
        onError: reject,
      });
    });

  const handleAddToBag = async () => {
    if (addToCartMutation.isPending || buying) return;
    if (!ensureVariant()) return;

    const payload = buildPayload();
    const run = () => runAdd(payload);

    if (isAuthenticated) {
      await run().catch(() => {});
      return;
    }

    await requireAuth({
      action: AUTH_ACTIONS.ADD_TO_CART,
      payload,
      onSuccess: () => run().catch(() => {}),
    });
  };

  const handleBuyNow = async () => {
    if (addToCartMutation.isPending || buying) return;
    if (!ensureVariant()) return;

    const payload = buildPayload();

    const go = async () => {
      setBuying(true);
      try {
        await runAdd(payload);
        router.push("/checkout/bag");
      } catch {
        /* toast handled by mutation meta */
      } finally {
        setBuying(false);
      }
    };

    if (isAuthenticated) {
      await go();
      return;
    }

    await requireAuth({
      action: AUTH_ACTIONS.BUY_NOW,
      payload,
      onSuccess: go,
    });
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.title,
          text: product?.title,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        showSuccessToast("Link copied");
      }
    } catch {
      /* user cancelled share */
    }
  };

  const handleColorSelect = (colorOption) => {
    onSelectColor(colorOption.key);
    const next =
      pickInitialVariant(colorOption.variants) || colorOption.variants[0];
    if (next) onSelectVariant(next);
    setSizeHint(false);
  };

  const handleSizeSelect = (variant) => {
    if (getStockState(variant.stock).key === "oos") return;
    onSelectVariant(variant);
    setSizeHint(false);
    if (quantity > Math.min(Number(variant.stock) || 1, 10)) {
      onQuantityChange(1);
    }
  };

  return (
    <div className="space-y-7">
      {/* Price block */}
      <div className="space-y-1.5 border-b border-brand-amber/15 pb-5">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <span className="text-3xl font-black tabular-nums tracking-tight text-foreground sm:text-4xl">
            {formatRupee(price)}
          </span>
          {mrp > price && (
            <span className="text-lg text-brand-gray line-through tabular-nums">
              {formatRupee(mrp)}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-brand-amber px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-foreground">
              {discount}% OFF
            </span>
          )}
        </div>
        {savings > 0 && (
          <p className="text-sm font-semibold text-emerald-700">
            You save {formatRupee(savings)}
          </p>
        )}
        <p className="text-[11px] text-brand-gray">
          Inclusive of all taxes · MRP shown above
        </p>
      </div>

      {/* Color swatches */}
      {colorOptions.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-tight">
              Color{" "}
              <span className="font-medium text-brand-gray">
                — {activeColor?.color}
              </span>
            </h3>
          </div>
          <div className="flex flex-wrap gap-2.5" role="listbox" aria-label="Color">
            {colorOptions.map((opt) => {
              const selected = opt.key === activeColor?.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  aria-label={opt.color}
                  title={opt.color}
                  onClick={() => handleColorSelect(opt)}
                  className={cn(
                    "relative size-10 rounded-full border-2 transition duration-200",
                    selected
                      ? "border-foreground scale-105 shadow-md"
                      : "border-brand-amber/30 hover:border-brand-amber"
                  )}
                  style={{ backgroundColor: opt.colorHex }}
                >
                  {selected && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check
                        size={14}
                        className="drop-shadow"
                        style={{
                          color:
                            luminance(opt.colorHex) > 0.55 ? "#1a1a1a" : "#fff",
                        }}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sizes */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-tight">Select Size</h3>
          {stockState.urgency && !outOfStock && (
            <span className="text-xs font-semibold text-orange-600 animate-pulse">
              {stockState.urgency}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2" role="listbox" aria-label="Size">
          {sizes.map((variant) => {
            const state = getStockState(variant.stock);
            const selected = selectedVariant?._id === variant._id;
            const disabled = state.key === "oos";

            return (
              <button
                key={variant._id || variant.sku}
                type="button"
                role="option"
                aria-selected={selected}
                aria-disabled={disabled}
                disabled={disabled}
                onClick={() => handleSizeSelect(variant)}
                className={cn(
                  "relative min-w-[3.25rem] border px-4 py-2.5 text-sm font-semibold transition duration-200",
                  selected &&
                    !disabled &&
                    "border-foreground bg-foreground text-brand-white",
                  !selected &&
                    !disabled &&
                    "border-brand-amber/30 bg-brand-white hover:border-brand-amber",
                  disabled &&
                    "cursor-not-allowed border-dashed border-brand-gray/40 text-brand-gray/50 line-through",
                  state.key === "low" &&
                    !selected &&
                    !disabled &&
                    "border-orange-300"
                )}
              >
                {variant.size}
                {state.key === "low" && !disabled && (
                  <span className="absolute -right-1 -top-1 size-2 rounded-full bg-orange-500" />
                )}
              </button>
            );
          })}
        </div>
        {sizeHint && (
          <p className="mt-2 text-xs font-medium text-destructive" role="alert">
            Please select a size
          </p>
        )}
        <p
          className={cn(
            "mt-2 text-xs font-medium",
            outOfStock
              ? "text-destructive"
              : stockState.key === "low"
                ? "text-orange-600"
                : "text-emerald-700"
          )}
        >
          {outOfStock
            ? "Out of stock for this size"
            : `${stockState.label} · ${selectedVariant?.stock ?? 0} available`}
        </p>
      </div>

      {/* Quantity */}
      <div>
        <h3 className="mb-3 text-sm font-bold tracking-tight">Quantity</h3>
        <div className="inline-flex items-center border border-brand-amber/25 bg-brand-cream/30">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="flex size-10 items-center justify-center text-foreground transition hover:bg-brand-amber/30 disabled:opacity-40"
          >
            <Minus size={16} />
          </button>
          <span className="min-w-10 text-center text-sm font-bold tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={quantity >= maxQty || outOfStock}
            onClick={() =>
              onQuantityChange(Math.min(maxQty, quantity + 1))
            }
            className="flex size-10 items-center justify-center text-foreground transition hover:bg-brand-amber/30 disabled:opacity-40"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Delivery check */}
      <div className="border border-brand-amber/20 bg-brand-cream/25 p-4">
        <div className="flex items-center gap-2 text-sm font-bold">
          <MapPin size={16} className="text-brand-amber" />
          Delivery estimate
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter pincode"
            value={pincode}
            onChange={(e) =>
              setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="h-10 flex-1 border border-brand-amber/25 bg-brand-white px-3 text-sm outline-none focus:border-brand-amber"
            aria-label="Delivery pincode"
          />
          <button
            type="button"
            onClick={() => setCheckedPin(pincode)}
            disabled={pincode.length < 6}
            className="h-10 px-4 text-xs font-bold uppercase tracking-wide bg-foreground text-brand-white transition hover:bg-foreground/90 disabled:opacity-40"
          >
            Check
          </button>
        </div>
        <p className="mt-2 text-xs text-brand-gray">
          Get it by{" "}
          <span className="font-semibold text-foreground">{delivery.label}</span>
          {checkedPin ? ` for ${checkedPin}` : " · enter pincode for accuracy"}
        </p>
      </div>

      {/* Desktop CTAs */}
      <div className="hidden gap-3 lg:flex">
        <button
          type="button"
          onClick={handleAddToBag}
          disabled={outOfStock || addToCartMutation.isPending || buying}
          className="flex flex-1 items-center justify-center gap-2 border border-brand-amber bg-brand-cream py-4 text-sm font-bold uppercase tracking-wide text-foreground transition hover:bg-brand-amber disabled:cursor-not-allowed disabled:opacity-50"
        >
          {addToCartMutation.isPending && !buying ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <ShoppingBag size={18} />
          )}
          {outOfStock
            ? "Out of Stock"
            : addToCartMutation.isPending && !buying
              ? "Adding..."
              : "Add to Bag"}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={outOfStock || addToCartMutation.isPending || buying}
          className="flex flex-1 items-center justify-center gap-2 bg-brand-amber py-4 text-sm font-bold uppercase tracking-wide text-foreground transition hover:bg-brand-amber/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {buying ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Zap size={18} />
          )}
          {buying ? "Please wait..." : "Buy Now"}
        </button>

        <WishlistButton
          productId={product?._id}
          variant="plain"
          iconSize={20}
          className="rounded-none! p-4!"
        />

        <button
          type="button"
          onClick={handleShare}
          aria-label="Share product"
          className="border border-brand-amber/20 p-4 transition hover:border-brand-amber hover:bg-brand-cream"
        >
          <Share2 size={20} />
        </button>
      </div>

      {/* Mobile wishlist + share row */}
      <div className="flex gap-2 lg:hidden">
        <WishlistButton
          productId={product?._id}
          variant="plain"
          iconSize={18}
          className="flex flex-1 items-center justify-center rounded-none! py-3!"
        />
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-1 items-center justify-center gap-2 border border-brand-amber/20 py-3 text-xs font-bold uppercase tracking-wide transition hover:bg-brand-cream"
        >
          <Share2 size={16} />
          Share
        </button>
      </div>

      <ProductStickyCta
        price={price}
        mrp={mrp}
        outOfStock={outOfStock}
        adding={addToCartMutation.isPending && !buying}
        buying={buying}
        onAdd={handleAddToBag}
        onBuy={handleBuyNow}
        disabled={!selectedVariant}
      />
    </div>
  );
}

function luminance(hex) {
  const h = (hex || "#ccc").replace("#", "");
  if (h.length < 6) return 0.5;
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
