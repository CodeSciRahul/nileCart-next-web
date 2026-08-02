"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import BagItemCard from "@/components/checkout/BagItemCard";
import CouponInput from "@/components/checkout/CouponInput";
import PriceSummary from "@/components/checkout/PriceSummary";
import CheckoutTrustBadges from "@/components/checkout/CheckoutTrustBadges";
import AuthRequiredState from "@/components/auth/AuthRequiredState";
import { useRemoveCartItem, useUpdateCartItem } from "@/hooks/useCart";
import { useToggleWishlist, useWishlist } from "@/hooks/useWishlist";
import { usePaymentConfig } from "@/hooks/usePayment";
import { useAuth } from "@/context/AuthContext";
import { AUTH_ACTIONS } from "@/lib/authActions";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

export default function BagPage({ cart }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const toggleWishlist = useToggleWishlist();
  const { data: wishlistData } = useWishlist();
  const { data: paymentConfig } = usePaymentConfig();
  const currency = paymentConfig?.currency || "UGX";
  const items = cart?.cart?.items || [];

  const handleQuantityChange = (item, variant, delta) => {
    const nextQuantity = item.quantity + delta;

    if (delta > 0 && nextQuantity > variant.stock) {
      showErrorToast(`Only ${variant.stock} in stock`);
      return;
    }

    updateCartItem.mutate({
      itemId: item._id,
      quantity: nextQuantity,
    });
  };

  const handleRemove = (item) => {
    removeCartItem.mutate(item._id, {
      onSuccess: () => showSuccessToast("Item removed from bag"),
    });
  };

  const handleSaveForLater = async (item) => {
    const productId = item?.product?._id;
    if (!productId || toggleWishlist.isPending || removeCartItem.isPending) {
      return;
    }

    try {
      const alreadySaved = wishlistData?.productIds?.has(String(productId));
      if (!alreadySaved) {
        await toggleWishlist.mutateAsync(productId);
      }
      await removeCartItem.mutateAsync(item._id);
      showSuccessToast("Saved for later");
    } catch {
      /* mutation meta toasts */
    }
  };

  const isUpdating = (itemId) =>
    updateCartItem.isPending && updateCartItem.variables?.itemId === itemId;

  const isRemoving = (itemId) =>
    removeCartItem.isPending && removeCartItem.variables === itemId;

  const isSaving = () => toggleWishlist.isPending || removeCartItem.isPending;

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-brand-gray">
        Loading your bag...
      </div>
    );
  }

  if (!isAuthenticated || !cart) {
    return (
      <AuthRequiredState
        action={AUTH_ACTIONS.VIEW_BAG}
        onAuthenticated={() => router.refresh()}
      />
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg border border-dashed border-brand-amber/30 bg-brand-white px-6 py-16 text-center">
        <span className="mx-auto flex size-14 items-center justify-center bg-brand-cream text-brand-amber ring-1 ring-brand-amber/25">
          <ShoppingBag size={28} />
        </span>
        <h1 className="mt-5 text-xl font-black tracking-tight">
          Your bag is empty
        </h1>
        <p className="mt-2 text-sm text-brand-gray">
          Looks like you haven&apos;t added anything yet. Explore new styles and
          fill your bag.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex bg-brand-amber px-6 py-3 text-xs font-bold uppercase tracking-wide text-foreground transition hover:bg-brand-amber/90"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-10">
      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gray">
              Shopping bag
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              Bag{" "}
              <span className="text-brand-gray">
                ({cart.itemCount} {cart.itemCount === 1 ? "item" : "items"})
              </span>
            </h1>
          </div>
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-wide text-brand-gray underline-offset-2 hover:text-foreground hover:underline"
          >
            + Add more
          </Link>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {items.map((item) => {
            const variant = item?.product?.variants?.find(
              (v) => v?.sku === item?.variantSku
            );
            if (!variant) return null;

            return (
              <BagItemCard
                key={item._id}
                item={item}
                variant={variant}
                currency={currency}
                updating={isUpdating(item._id)}
                removing={isRemoving(item._id)}
                saving={
                  isSaving() &&
                  String(toggleWishlist.variables) ===
                    String(item?.product?._id)
                }
                onQuantityChange={(delta) =>
                  handleQuantityChange(item, variant, delta)
                }
                onRemove={() => handleRemove(item)}
                onSaveForLater={() => handleSaveForLater(item)}
              />
            );
          })}
        </div>
      </div>

      <aside className="min-w-0 space-y-4 lg:sticky lg:top-28 lg:self-start">
        <div className="space-y-4 border border-brand-amber/25 bg-brand-white p-4 shadow-sm sm:p-5">
          <CouponInput
            appliedCoupon={cart?.coupon}
            subtotal={cart?.subtotal ?? 0}
          />

          <div className="border-t border-brand-amber/15 pt-4">
            <PriceSummary cart={cart} items={items} currency={currency} />
          </div>

          <button
            type="button"
            onClick={() => router.push("/checkout/payment")}
            className="w-full bg-brand-amber py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground transition hover:bg-brand-amber/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-amber"
          >
            Place Order
          </button>

          <p className="text-center text-[11px] text-brand-gray">
            Address & payment on the next step
          </p>
        </div>

        <CheckoutTrustBadges compact />
      </aside>
    </div>
  );
}
