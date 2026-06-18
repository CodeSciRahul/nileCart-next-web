"use client";

import { useRouter } from "next/navigation";
import CouponInput from "@/components/checkout/CouponInput";
import PriceSummary from "@/components/checkout/PriceSummary";
import { useUpdateCartItem } from "@/hooks/useCart";
import { showErrorToast } from "@/lib/toast";

export default function BagPage({ cart }) {
  const router = useRouter();
  const updateCartItem = useUpdateCartItem();
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

  const isUpdating = (itemId) =>
    updateCartItem.isPending && updateCartItem.variables?.itemId === itemId;

  if (!cart) {
    return (
      <div className="container mx-auto py-10 text-brand-gray">
        Sign in to view your bag or add items from a product page.
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <h1 className="mb-6 text-2xl font-bold">
            Bag ({cart.itemCount} items)
          </h1>

          <div className="space-y-4">
            {items?.map((item) => {
              const variant = item?.product?.variants?.find(
                (v) => v?.sku === item?.variantSku
              );

              if (!variant) return null;

              const atMax = item.quantity >= variant.stock;
              const updating = isUpdating(item._id);

              return (
                <div
                  key={item?._id}
                  className="flex gap-4 rounded-lg border bg-brand-white p-4"
                >
                  <img
                    src={variant?.images?.[0]?.url || item?.product?.images?.[0]?.url}
                    alt={item?.product?.title}
                    className="h-36 w-28 rounded object-cover"
                  />

                  <div className="flex flex-1 flex-col">
                    <h3 className="font-semibold">{item?.product?.title}</h3>
                    <p className="mt-2 text-sm text-brand-gray">
                      Color: {variant?.color}
                    </p>
                    <p className="text-sm text-brand-gray">
                      Size: {variant?.size}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <span className="font-bold">₹{variant?.price}</span>
                      <span className="text-gray-400 line-through">
                        ₹{variant?.mrp}
                      </span>
                      <span className="text-orange-500">
                        {Math.round(
                          ((variant?.mrp - variant?.price) / variant?.mrp) * 100
                        )}
                        % OFF
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        className="h-8 w-8 rounded border disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => handleQuantityChange(item, variant, -1)}
                        disabled={updating}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="min-w-6 text-center">
                        {item?.quantity}
                      </span>
                      <button
                        type="button"
                        className="h-8 w-8 rounded border disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => handleQuantityChange(item, variant, 1)}
                        disabled={updating || atMax}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="sticky top-24 space-y-4 rounded-lg border bg-brand-white p-5">
            <CouponInput
              appliedCoupon={cart?.coupon}
              subtotal={cart?.subtotal ?? 0}
            />

            <PriceSummary cart={cart} items={items} />

            <button
              type="button"
              onClick={() => router.push("/checkout/payment")}
              className="mt-5 w-full cursor-pointer rounded bg-brand-amber py-3 font-semibold text-brand-white hover:bg-brand-amber/90"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
