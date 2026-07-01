"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSuccessPage({ orderNumber, paymentMethod = "cod" }) {
  const isOnline = paymentMethod === "online";

  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <CheckCircle size={64} className="mb-4 text-green-600" />

      <h1 className="text-2xl font-bold">Order placed successfully!</h1>

      <p className="text-brand-gray mt-2 text-sm">
        {isOnline
          ? "Thank you for your purchase. Your payment was confirmed and your order is being processed."
          : "Thank you for your purchase. Your Cash on Delivery order has been confirmed."}
      </p>

      {orderNumber && (
        <p className="mt-4 rounded-lg border bg-brand-cream px-4 py-3 text-sm">
          Order ID: <span className="font-semibold">{orderNumber}</span>
        </p>
      )}

      <p className="text-brand-gray mt-4 text-sm">
        {isOnline
          ? "You will receive updates as your order progresses."
          : "Pay with cash when your order is delivered."}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          asChild
          className="bg-brand-amber text-brand-white hover:bg-brand-amber/90"
        >
          <Link href="/account/orders">View my orders</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
