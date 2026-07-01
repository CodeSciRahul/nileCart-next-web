"use client";

import { useMemo } from "react";
import { getMrpSavings } from "@/lib/cartPricing";
import { formatMoney } from "@/lib/currency";

export default function PriceSummary({ cart, items = [], className = "", currency = "UGX" }) {
  const { totalMrp, mrpDiscount } = useMemo(() => getMrpSavings(items), [items]);

  const subtotal = cart?.subtotal ?? 0;
  const couponDiscount = cart?.discount ?? 0;
  const shippingFee = cart?.shippingFee ?? 0;
  const total = cart?.total ?? subtotal;
  const freeShippingThreshold = cart?.freeShippingThreshold;
  const fmt = (value) => formatMoney(value, currency);

  return (
    <div className={className}>
      <h2 className="mb-4 font-semibold">PRICE DETAILS</h2>

      <div className="space-y-3 text-sm">
        {totalMrp > 0 && (
          <div className="flex justify-between">
            <span>Total MRP</span>
            <span>{fmt(totalMrp)}</span>
          </div>
        )}

        {mrpDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount on MRP</span>
            <span>- {fmt(mrpDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Bag total</span>
          <span>{fmt(subtotal)}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon discount</span>
            <span>- {fmt(couponDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Shipping Fee</span>
          {shippingFee === 0 ? (
            <span className="text-green-600">FREE</span>
          ) : (
            <span>{fmt(shippingFee)}</span>
          )}
        </div>

        {freeShippingThreshold && shippingFee > 0 && (
          <p className="text-brand-gray text-xs">
            Free shipping on orders above {fmt(freeShippingThreshold)}
          </p>
        )}

        <hr />

        <div className="flex justify-between text-base font-bold">
          <span>Total Amount</span>
          <span>{fmt(total)}</span>
        </div>
      </div>
    </div>
  );
}
