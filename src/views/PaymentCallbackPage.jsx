"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyPayment } from "@/hooks/usePayment";

const MISSING_REF_MESSAGE =
  "Missing payment reference. Please contact support if you were charged.";

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyPayment = useVerifyPayment();
  const attempted = useRef(false);

  const txRef = searchParams.get("tx_ref") || searchParams.get("txRef");
  const transactionId =
    searchParams.get("transaction_id") || searchParams.get("transactionId");
  const redirectStatus = searchParams.get("status");

  const [state, setState] = useState(() =>
    txRef
      ? { status: "loading", message: "" }
      : { status: "error", message: MISSING_REF_MESSAGE }
  );

  useEffect(() => {
    if (attempted.current || !txRef) return;
    attempted.current = true;

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
              message:
                "Payment failed. Your order was cancelled and stock restored.",
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

  const shell = (icon, title, message, actions) => (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-2 py-10 text-center">
      <div className="w-full border border-brand-amber/25 bg-brand-white p-6 shadow-sm sm:p-10">
        {icon}
        <h1 className="mt-5 text-xl font-black tracking-tight sm:text-2xl">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-brand-gray">{message}</p>
        {actions}
      </div>
    </div>
  );

  if (state.status === "loading" || verifyPayment.isPending) {
    return shell(
      <Loader2 className="mx-auto size-12 animate-spin text-brand-amber" />,
      "Verifying your payment",
      "Please wait while we confirm your payment securely with Flutterwave."
    );
  }

  if (state.status === "cancelled") {
    return shell(
      <AlertCircle className="mx-auto size-12 text-amber-600" />,
      "Payment cancelled",
      state.message,
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          asChild
          className="rounded-none bg-brand-amber font-bold text-foreground hover:bg-brand-amber/90"
        >
          <Link href="/checkout/payment">Try again</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-none border-brand-amber/30">
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return shell(
    <AlertCircle className="mx-auto size-12 text-red-600" />,
    "Payment verification issue",
    state.message,
    <>
      {txRef && (
        <p className="mt-4 border border-brand-amber/20 bg-brand-cream/50 px-4 py-2 text-xs text-brand-gray">
          Reference: <span className="font-mono font-semibold">{txRef}</span>
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          asChild
          className="rounded-none bg-brand-amber font-bold text-foreground hover:bg-brand-amber/90"
        >
          <Link href="/checkout/payment">Back to payment</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-none border-brand-amber/30">
          <Link href="/account/orders">View orders</Link>
        </Button>
      </div>
    </>
  );
}
