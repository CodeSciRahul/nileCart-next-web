import { Suspense } from "react";
import AuthPage from "@/views/AuthPage";

export default function Auth() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-cream" />}>
      <AuthPage />
    </Suspense>
  );
}
