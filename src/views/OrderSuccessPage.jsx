"use client";

import Link from "next/link";
import { CheckCircle, Package, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckoutTrustBadges from "@/components/checkout/CheckoutTrustBadges";

export default function OrderSuccessPage({
  orderNumber,
  paymentMethod = "cod",
}) {
  const isOnline = paymentMethod === "online";

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-2 py-10 text-center sm:py-14">
      <div className="w-full border border-brand-amber/25 bg-brand-white p-6 shadow-sm sm:p-10">
        <span className="mx-auto flex size-16 items-center justify-center bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
          <CheckCircle size={36} />
        </span>

        <h1 className="mt-5 text-2xl font-black tracking-tight sm:text-3xl">
          Order placed successfully!
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-brand-gray">
          {isOnline
            ? "Thank you for your purchase. Your payment was confirmed and your order is being processed."
            : "Thank you for your purchase. Your Cash on Delivery order has been confirmed."}
        </p>

        {orderNumber && (
          <div className="mt-5 border border-brand-amber/25 bg-brand-cream/50 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gray">
              Order ID
            </p>
            <p className="mt-1 font-black tracking-wide">{orderNumber}</p>
          </div>
        )}

        <div className="mt-5 flex items-start gap-3 border border-brand-amber/15 bg-brand-cream/30 p-3 text-left text-xs text-brand-gray">
          <Package size={16} className="mt-0.5 shrink-0 text-brand-amber" />
          <p>
            {isOnline
              ? "You will receive updates as your order progresses."
              : "Pay with cash when your order is delivered. Keep your phone handy for delivery updates."}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            className="rounded-none bg-brand-amber font-bold text-foreground hover:bg-brand-amber/90"
          >
            <Link href="/account/orders">View my orders</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none border-brand-amber/30">
            <Link href="/">Continue shopping</Link>
          </Button>
        </div>

        <p className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-brand-gray">
          <ShieldCheck size={14} className="text-emerald-600" />
          Secure Nilescart checkout
        </p>
      </div>

      <div className="mt-6 w-full">
        <CheckoutTrustBadges />
      </div>
    </div>
  );
}
