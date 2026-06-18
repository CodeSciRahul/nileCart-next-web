"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSuccessPage({ orderNumber }) {
  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <CheckCircle size={64} className="mb-4 text-green-600" />

      <h1 className="text-2xl font-bold">Order placed successfully!</h1>

      <p className="text-brand-gray mt-2 text-sm">
        Thank you for your purchase. Your Cash on Delivery order has been confirmed.
      </p>

      {orderNumber && (
        <p className="mt-4 rounded-lg border bg-brand-cream px-4 py-3 text-sm">
          Order ID: <span className="font-semibold">{orderNumber}</span>
        </p>
      )}

      <p className="text-brand-gray mt-4 text-sm">
        Pay with cash when your order is delivered.
      </p>

      <div className="mt-8">
        <Button
          asChild
          className="w-full bg-brand-amber text-brand-white hover:bg-brand-amber/90 sm:w-auto"
        >
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
