"use client";

import { useState } from "react";
import { Copy, Check, Ticket, Tag } from "lucide-react";
import { useActiveCoupons } from "@/hooks/useCoupons";
import { showInfoToast } from "@/lib/toast";

const formatDiscount = (coupon) => {
  if (coupon.discountType === "percentage") {
    const text = `${coupon.discountValue}% OFF`;
    return coupon.maxDiscount
      ? `${text} (up to ₹${coupon.maxDiscount})`
      : text;
  }
  return `₹${coupon.discountValue} OFF`;
};

const CouponsPage = () => {
  const { data: coupons = [], isLoading, isError } = useActiveCoupons();
  const [copiedCode, setCopiedCode] = useState(null);

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      showInfoToast(`Coupon ${code} copied`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      showInfoToast("Could not copy coupon code");
    }
  };

  if (isLoading) {
    return <p className="text-sm text-brand-gray">Loading coupons...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600">
        Could not load coupons. Please try again later.
      </p>
    );
  }

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-foreground">Coupons</h2>
      <p className="mb-6 text-sm text-brand-gray">
        Available offers you can apply at checkout.
      </p>

      {coupons.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-amber/30 bg-brand-cream/50 px-6 py-12 text-center">
          <Ticket className="mx-auto mb-3 text-brand-amber" size={40} />
          <h3 className="font-semibold text-foreground">No coupons right now</h3>
          <p className="mt-1 text-sm text-brand-gray">
            Check back soon for new offers and deals.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {coupons.map((coupon) => (
            <article
              key={coupon.code}
              className="relative overflow-hidden rounded-xl border border-brand-amber/25 bg-gradient-to-br from-brand-white to-brand-cream p-4 shadow-sm"
            >
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-brand-amber/15" />
              <div className="relative">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-lg font-black tracking-wide text-brand-amber">
                      {coupon.code}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatDiscount(coupon)}
                    </p>
                  </div>
                  <Tag size={20} className="shrink-0 text-brand-amber/70" />
                </div>

                {coupon.description && (
                  <p className="mb-3 text-sm text-brand-gray">
                    {coupon.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 text-xs text-brand-gray">
                  {coupon.minOrderAmount > 0 && (
                    <span className="rounded-full bg-brand-white px-2.5 py-1">
                      Min. order ₹{coupon.minOrderAmount}
                    </span>
                  )}
                  {coupon.eligibleUserType && coupon.eligibleUserType !== "all" && (
                    <span className="rounded-full bg-brand-white px-2.5 py-1 capitalize">
                      {coupon.eligibleUserType} users
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => copyCode(coupon.code)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-brand-amber/30 bg-brand-white px-3 py-1.5 text-sm font-medium text-foreground transition hover:border-brand-amber hover:text-brand-amber"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check size={16} className="text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy code
                    </>
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default CouponsPage;
