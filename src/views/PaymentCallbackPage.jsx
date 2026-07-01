"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyPayment } from "@/hooks/usePayment";

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyPayment = useVerifyPayment();
  const attempted = useRef(false);

  const [state, setState] = useState({ status: "loading", message: "" });

  const txRef = searchParams.get("tx_ref") || searchParams.get("txRef");
  const transactionId =
    searchParams.get("transaction_id") || searchParams.get("transactionId");
  const redirectStatus = searchParams.get("status");

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    if (!txRef) {
      setState({
        status: "error",
        message: "Missing payment reference. Please contact support if you were charged.",
      });
      return;
    }

    if (redirectStatus === "cancelled" || redirectStatus === "canceled") {
      verifyPayment.mutate(
        { txRef, transactionId, status: "cancelled" },
        {
          onSuccess: (data) => {
            setState({
              status: "cancelled",
              message: data?.cancelled
                ? "Payment was cancelled. Your order was not confirmed and stock has been restored."
                : "Payment was cancelled.",
            });
          },
          onError: () => {
            setState({
              status: "cancelled",
              message: "Payment was cancelled. Your order was not confirmed.",
            });
          },
        }
      );
      return;
    }

    verifyPayment.mutate(
      { txRef, transactionId },
      {
        onSuccess: (data) => {
          const order = data?.order;

          if (data?.failed) {
            setState({
              status: "error",
              message: "Payment failed. Your order was cancelled and stock restored.",
            });
            return;
          }

          const params = new URLSearchParams({
            paymentMethod: "online",
            ...(order?._id && { orderId: order._id }),
            ...(order?.orderNumber && { orderNumber: order.orderNumber }),
          });

          router.replace(`/checkout/success?${params.toString()}`);
        },
        onError: (err) => {
          setState({
            status: "error",
            message: err.message || "Payment verification failed.",
          });
        },
      }
    );
  }, [txRef, transactionId, redirectStatus, router, verifyPayment]);

  if (state.status === "loading" || verifyPayment.isPending) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <Loader2 className="mb-4 size-12 animate-spin text-brand-amber" />
        <h1 className="text-xl font-semibold">Verifying your payment</h1>
        <p className="text-brand-gray mt-2 text-sm">
          Please wait while we confirm your payment securely with Flutterwave.
        </p>
      </div>
    );
  }

  if (state.status === "cancelled") {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <AlertCircle className="mb-4 size-12 text-amber-600" />
        <h1 className="text-xl font-semibold">Payment cancelled</h1>
        <p className="text-brand-gray mt-2 text-sm">{state.message}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="bg-brand-amber text-brand-white hover:bg-brand-amber/90">
            <Link href="/checkout/payment">Try again</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <AlertCircle className="mb-4 size-12 text-red-600" />
      <h1 className="text-xl font-semibold">Payment verification issue</h1>
      <p className="text-brand-gray mt-2 text-sm">{state.message}</p>
      {txRef && (
        <p className="text-brand-gray mt-4 rounded-lg border bg-brand-cream px-4 py-2 text-xs">
          Reference: <span className="font-mono">{txRef}</span>
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="bg-brand-amber text-brand-white hover:bg-brand-amber/90">
          <Link href="/checkout/payment">Back to payment</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/account/orders">View orders</Link>
        </Button>
      </div>
    </div>
  );
}
