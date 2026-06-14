"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

export default function BagPage({ cart }) {
  const router = useRouter();
  const items = cart?.cart?.items || [];

  const priceDetails = useMemo(() => {
    let totalMrp = 0;
    let totalPrice = 0;

    items?.forEach((item) => {
      const variant = item?.product?.variants?.find(
        (v) => v.sku === item.variantSku
      );

      if (!variant) return;

      totalMrp += variant.mrp * item.quantity;
      totalPrice += variant.price * item.quantity;
    });

    return {
      totalMrp,
      totalPrice,
      discount: totalMrp - totalPrice,
    };
  }, [items]);

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
                      <button type="button" className="h-8 w-8 rounded border">
                        -
                      </button>
                      <span>{item?.quantity}</span>
                      <button type="button" className="h-8 w-8 rounded border">
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
          <div className="sticky top-24 rounded-lg border bg-brand-white p-5">
            <h2 className="mb-4 font-semibold">PRICE DETAILS</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span>₹{priceDetails?.totalMrp}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount on MRP</span>
                <span>- ₹{priceDetails?.discount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-green-600">FREE</span>
              </div>
              <hr />
              <div className="flex justify-between text-base font-bold">
                <span>Total Amount</span>
                <span>₹{priceDetails?.totalPrice}</span>
              </div>
            </div>

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
