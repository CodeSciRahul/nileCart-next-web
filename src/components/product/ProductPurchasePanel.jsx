"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Info,
  Loader2,
  MapPin,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import WishlistButton from "@/components/wishlist/WishlistButton";
import ProductStickyCta from "@/components/product/ProductStickyCta";
import ProductSizeGuideModal from "@/components/product/ProductSizeGuideModal";
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

  // Accordion state (first open by default)
  const [openAccordions, setOpenAccordions] = useState({
    details: true,
    specs: false,
    shipping: false,
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  const ratingAvg = Number(product?.rating?.average) || 0;
  const ratingCount = Number(product?.rating?.count) || 0;

  const brandLabel =
    (typeof product?.brand === "object"
      ? product?.brand?.name
      : product?.brand) ||
    product?.seller?.storeName ||
    product?.category?.name ||
    "Nilescart";

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
        showSuccessToast("Link copied to clipboard");
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
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Header Information Block */}
      <div className="space-y-2 border-b border-neutral-200/90 pb-4">
        {/* Brand & Quick Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-neutral-500">
              {brandLabel}
            </span>
            {product?.category?.name && (
              <>
                <span className="text-neutral-300">·</span>
                <Link
                  href={
                    product.category.slug
                      ? `/shop/${product.category.slug}`
                      : "/shop"
                  }
                  className="text-xs font-semibold text-neutral-500 transition hover:text-black hover:underline underline-offset-2"
                >
                  {product.category.name}
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <WishlistButton
              productId={product?._id}
              variant="plain"
              iconSize={18}
              className="size-8 rounded-full border border-neutral-200 bg-white p-0! hover:border-black hover:bg-neutral-50 transition"
            />
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share product"
              className="flex size-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-black hover:text-black hover:bg-neutral-50"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-black leading-tight tracking-tight text-neutral-950">
          {product?.title}
        </h1>

        {/* Rating Snippet */}
        <div className="flex items-center gap-2.5 pt-0.5">
          <div className="inline-flex items-center gap-1.5 rounded-xs border border-neutral-200/90 bg-neutral-100/80 px-2 py-0.5 text-xs font-bold text-neutral-900">
            <Star size={12} fill="currentColor" className="text-[#fdd835]" />
            <span className="tabular-nums">
              {ratingAvg > 0 ? ratingAvg.toFixed(1) : "New"}
            </span>
          </div>
          <a
            href="#reviews"
            className="text-xs font-medium text-neutral-500 underline-offset-2 hover:text-black hover:underline"
          >
            {ratingCount > 0
              ? `${ratingCount} ${ratingCount === 1 ? "review" : "reviews"}`
              : "No reviews yet"}
          </a>
          {product?.isNewArrival && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-xs border border-amber-200">
              <Sparkles size={11} /> New Season
            </span>
          )}
        </div>

        {/* Price & Savings */}
        <div className="pt-2">
          <div className="flex flex-wrap items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-black tabular-nums tracking-tight text-neutral-950">
              {formatRupee(price)}
            </span>
            {mrp > price && (
              <span className="text-base text-neutral-400 line-through tabular-nums font-normal">
                {formatRupee(mrp)}
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-xs bg-[#fdd835] px-2 py-0.5 text-xs font-black uppercase tracking-wider text-black">
                {discount}% OFF
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            {savings > 0 && (
              <span className="font-bold text-emerald-700">
                You save {formatRupee(savings)}
              </span>
            )}
            <span className="text-neutral-400">·</span>
            <span className="text-neutral-500">
              Inclusive of all taxes
            </span>
          </div>
        </div>
      </div>

      {/* 2. Color Selection */}
      {colorOptions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wide text-neutral-900">
              Color:{" "}
              <span className="font-medium text-neutral-600">
                {activeColor?.color || "Selected"}
              </span>
            </span>
            <span className="text-neutral-400">
              {colorOptions.length} {colorOptions.length === 1 ? "shade" : "shades"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2" role="listbox" aria-label="Color">
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
                    "relative size-9 rounded-full border-2 transition duration-150 focus:outline-none",
                    selected
                      ? "border-black scale-105 shadow-sm ring-2 ring-black/25"
                      : "border-neutral-300 hover:border-black/70 hover:scale-102"
                  )}
                  style={{ backgroundColor: opt.colorHex }}
                >
                  {selected && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check
                        size={13}
                        className="drop-shadow-sm"
                        style={{
                          color:
                            luminance(opt.colorHex) > 0.55 ? "#111" : "#fff",
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

      {/* 3. Size Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wide text-neutral-900">
              Select Size
            </span>
            {stockState.urgency && !outOfStock && (
              <span className="font-bold text-orange-600 animate-pulse">
                · {stockState.urgency}
              </span>
            )}
          </div>
          <ProductSizeGuideModal />
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
                  "relative min-w-[3.5rem] rounded-xs border px-3.5 py-2 text-xs font-bold uppercase tracking-wide transition duration-150",
                  selected &&
                    !disabled &&
                    "border-black bg-black text-white shadow-xs",
                  !selected &&
                    !disabled &&
                    "border-neutral-200 bg-white text-neutral-900 hover:border-black hover:bg-neutral-50",
                  disabled &&
                    "cursor-not-allowed border-dashed border-neutral-300 bg-neutral-50/70 text-neutral-400 line-through",
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
          <p className="text-xs font-semibold text-red-600" role="alert">
            Please choose a size to continue
          </p>
        )}

        <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500">
          <span
            className={cn(
              "size-1.5 rounded-full",
              outOfStock
                ? "bg-red-500"
                : stockState.key === "low"
                  ? "bg-orange-500"
                  : "bg-emerald-500"
            )}
          />
          <span>
            {outOfStock
              ? "Out of stock for this size"
              : `${stockState.label} · ${selectedVariant?.stock ?? 0} in stock`}
          </span>
        </div>
      </div>

      {/* 4. Action Buttons (Immediate Visibility, Conversion Focused) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center gap-2.5">
          {/* Quantity Stepper */}
          <div className="inline-flex h-12 items-center rounded-xs border border-neutral-300 bg-white shrink-0">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="flex size-10 items-center justify-center text-neutral-700 transition hover:bg-neutral-100 hover:text-black disabled:opacity-30"
            >
              <Minus size={15} />
            </button>
            <span className="min-w-8 text-center text-xs font-extrabold tabular-nums text-neutral-950">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= maxQty || outOfStock}
              onClick={() =>
                onQuantityChange(Math.min(maxQty, quantity + 1))
              }
              className="flex size-10 items-center justify-center text-neutral-700 transition hover:bg-neutral-100 hover:text-black disabled:opacity-30"
            >
              <Plus size={15} />
            </button>
          </div>

          {/* ADD TO BAG */}
          <button
            type="button"
            onClick={handleAddToBag}
            disabled={outOfStock || addToCartMutation.isPending || buying}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xs bg-black px-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white shadow-xs transition hover:bg-neutral-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addToCartMutation.isPending && !buying ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ShoppingBag size={16} />
            )}
            {outOfStock
              ? "Out of Stock"
              : addToCartMutation.isPending && !buying
                ? "Adding..."
                : "Add to Bag"}
          </button>
        </div>

        {/* BUY NOW */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={outOfStock || addToCartMutation.isPending || buying}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xs bg-[#fdd835] px-4 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-xs transition hover:bg-yellow-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {buying ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Zap size={17} className="fill-black" />
          )}
          {buying ? "Processing..." : "Buy Now"}
        </button>
      </div>

      {/* 5. Delivery & Pincode Checker Card */}
      <div className="rounded-xs border border-neutral-200/90 bg-neutral-50/70 p-3.5 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
          <MapPin size={15} className="text-black" />
          <span>Delivery & Service Availability</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit Pincode"
            value={pincode}
            onChange={(e) =>
              setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="h-9 flex-1 rounded-xs border border-neutral-300 bg-white px-3 text-xs outline-none transition focus:border-black placeholder:text-neutral-400"
            aria-label="Delivery pincode"
          />
          <button
            type="button"
            onClick={() => setCheckedPin(pincode)}
            disabled={pincode.length < 6}
            className="h-9 rounded-xs bg-black px-4 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-neutral-800 disabled:opacity-40"
          >
            Check
          </button>
        </div>

        <div className="space-y-1 text-xs text-neutral-600 pt-0.5">
          <div className="flex items-center gap-1.5 font-medium">
            <Truck size={13} className="text-neutral-500 shrink-0" />
            <span>
              Estimated delivery by{" "}
              <span className="font-bold text-black">{delivery.label}</span>
              {checkedPin ? ` to ${checkedPin}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-neutral-500 pt-0.5 pl-5">
            <span>✓ Cash on Delivery Available</span>
            <span>·</span>
            <span>✓ Free Express Shipping</span>
          </div>
        </div>
      </div>

      {/* 6. Sleek Micro-Trust Strip */}
      <div className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4">
        {[
          { icon: Truck, title: "Fast Dispatch", desc: "Ships in 24h" },
          { icon: RotateCcw, title: "7-Day Return", desc: "Easy doorstep pickup" },
          { icon: ShieldCheck, title: "100% Genuine", desc: "Direct brand verified" },
          { icon: Package, title: "Secure Pack", desc: "Tamper-proof box" },
        ].map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-2 rounded-xs border border-neutral-200/80 bg-neutral-50/50 p-2 text-left"
          >
            <item.icon size={14} className="text-neutral-700 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-neutral-900 truncate">
                {item.title}
              </p>
              <p className="text-[10px] text-neutral-500 truncate">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 7. Collapsible Structured Information Accordions */}
      <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200 pt-1">
        {/* Accordion 1: Product Description */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => toggleAccordion("details")}
            className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-neutral-900 transition hover:text-black"
          >
            <span className="flex items-center gap-2">
              <Info size={14} /> Product Description & Story
            </span>
            <ChevronDown
              size={15}
              className={cn(
                "transition-transform duration-200 text-neutral-500",
                openAccordions.details && "rotate-180 text-black"
              )}
            />
          </button>
          {openAccordions.details && (
            <div className="mt-3 space-y-3 text-xs leading-relaxed text-neutral-600">
              <p>{product?.description || "Crafted with precision for effortless style and all-day comfort. Designed to complement contemporary wardrobes."}</p>

              {product?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-xs border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {product?.seller?.storeName && (
                <div className="pt-1">
                  <a
                    href="#store"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-black hover:underline"
                  >
                    Sold by{" "}
                    <span className="font-bold text-black">
                      {product.seller.storeName}
                    </span>
                    {product.seller.approvalStatus === "Approved" && (
                      <span className="text-emerald-700 font-bold">· Verified Seller</span>
                    )}
                    <ChevronRight size={12} />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Accordion 2: Product Specifications */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => toggleAccordion("specs")}
            className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-neutral-900 transition hover:text-black"
          >
            <span className="flex items-center gap-2">
              <Sparkles size={14} /> Specifications & Fabric
            </span>
            <ChevronDown
              size={15}
              className={cn(
                "transition-transform duration-200 text-neutral-500",
                openAccordions.specs && "rotate-180 text-black"
              )}
            />
          </button>
          {openAccordions.specs && (
            <div className="mt-3 text-xs text-neutral-700">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-xs bg-neutral-50/70 p-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Brand</span>
                  <p className="font-semibold text-black">{brandLabel}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Category</span>
                  <p className="font-semibold text-black">{product?.category?.name || "Apparel"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Gender</span>
                  <p className="font-semibold text-black">{product?.gender || "Unisex"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Style SKU</span>
                  <p className="font-semibold text-black truncate">{selectedVariant?.sku || product?.slug || "—"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Care Instructions</span>
                  <p className="font-semibold text-black">Machine wash cold</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Origin</span>
                  <p className="font-semibold text-black">Made in India</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 3: Shipping & Returns */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => toggleAccordion("shipping")}
            className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-neutral-900 transition hover:text-black"
          >
            <span className="flex items-center gap-2">
              <RotateCcw size={14} /> Shipping & Easy Returns
            </span>
            <ChevronDown
              size={15}
              className={cn(
                "transition-transform duration-200 text-neutral-500",
                openAccordions.shipping && "rotate-180 text-black"
              )}
            />
          </button>
          {openAccordions.shipping && (
            <div className="mt-3 space-y-2 text-xs leading-relaxed text-neutral-600">
              <p>
                <span className="font-bold text-black">Easy 7-Day Returns:</span> Eligible for return or size exchange within 7 days of delivery. Keep original tags and packaging intact.
              </p>
              <p>
                <span className="font-bold text-black">Free Shipping:</span> All orders above ₹499 qualify for free express door delivery across India.
              </p>
              <p>
                <span className="font-bold text-black">Cash on Delivery:</span> COD is supported at no extra convenience charge.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 8. Sticky Mobile CTA for seamless mobile conversions */}
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
