import { Suspense } from "react";
import PaymentCallbackPage from "@/views/PaymentCallbackPage";

function CallbackFallback() {
  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-brand-gray text-sm">Loading payment status...</p>
    </div>
  );
}

export default function PaymentCallback() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <PaymentCallbackPage />
    </Suspense>
  );
}
