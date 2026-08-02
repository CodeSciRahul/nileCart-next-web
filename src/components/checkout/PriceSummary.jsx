"use client";

import { useMemo } from "react";
import { Tag } from "lucide-react";
import { getMrpSavings } from "@/lib/cartPricing";
import { formatMoney } from "@/lib/currency";

export default function PriceSummary({
  cart,
  items = [],
  className = "",
  currency = "UGX",
}) {
  const { totalMrp, mrpDiscount } = useMemo(
    () => getMrpSavings(items),
    [items]
  );

  const subtotal = cart?.subtotal ?? 0;
  const couponDiscount = cart?.discount ?? 0;
  const shippingFee = cart?.shippingFee ?? 0;
  const total = cart?.total ?? subtotal;
  const freeShippingThreshold = cart?.freeShippingThreshold;
  const totalSavings = mrpDiscount + couponDiscount;
  const fmt = (value) => formatMoney(value, currency);

  return (
    <div className={className}>
      <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gray">
        Price Details
      </h2>

      <div className="mt-4 space-y-3 text-sm">
        {totalMrp > 0 && (
          <div className="flex justify-between tabular-nums">
            <span className="text-brand-gray">Total MRP</span>
            <span>{fmt(totalMrp)}</span>
          </div>
        )}

        {mrpDiscount > 0 && (
          <div className="flex justify-between tabular-nums text-emerald-700">
            <span>Discount on MRP</span>
            <span>- {fmt(mrpDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between tabular-nums">
          <span className="text-brand-gray">Bag total</span>
          <span>{fmt(subtotal)}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="flex justify-between tabular-nums text-emerald-700">
            <span className="inline-flex items-center gap-1">
              <Tag size={12} />
              Coupon discount
            </span>
            <span>- {fmt(couponDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between tabular-nums">
          <span className="text-brand-gray">Delivery</span>
          {shippingFee === 0 ? (
            <span className="font-semibold text-emerald-700">FREE</span>
          ) : (
            <span>{fmt(shippingFee)}</span>
          )}
        </div>

        {freeShippingThreshold && shippingFee > 0 && (
          <p className="text-[11px] leading-relaxed text-brand-gray">
            Free delivery on orders above {fmt(freeShippingThreshold)}
          </p>
        )}

        <div className="border-t border-brand-amber/20 pt-3">
          <div className="flex justify-between text-base font-black tabular-nums">
            <span>Total Amount</span>
            <span>{fmt(total)}</span>
          </div>
        </div>

        {totalSavings > 0 && (
          <div className="border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-800">
            You are saving {fmt(totalSavings)} on this order
          </div>
        )}
      </div>
    </div>
  );
}
