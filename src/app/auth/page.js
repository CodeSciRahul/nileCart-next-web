import { Suspense } from "react";
import AuthPage from "@/views/AuthPage";

export const metadata = {
  title: "Sign in",
  description: "Sign in or create your Nilescart account with a secure email code.",
  robots: { index: false, follow: false },
};

export default function Auth() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-brand-cream via-brand-white to-brand-cream" />
      }
    >
      <AuthPage />
    </Suspense>
  );
}
