"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Heart,
  Loader2,
  Lock,
  Package,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { saveAuthIntent, peekAuthIntent } from "@/lib/authIntent";
import { useEffect } from "react";

const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    title: "Secure sign-in",
    description: "Passwordless OTP — no passwords to remember or steal.",
  },
  {
    icon: Package,
    title: "Faster checkout",
    description: "Saved details and order tracking in one place.",
  },
  {
    icon: Heart,
    title: "Wishlist & more",
    description: "Save looks and pick up where you left off.",
  },
];

function AuthAtmosphere() {
  return (
    <aside className="relative hidden overflow-hidden lg:flex lg:w-[46%] xl:w-1/2 flex-col justify-between bg-linear-to-br from-brand-cream via-[#fff8e0] to-brand-amber/40 px-10 py-12 xl:px-14 xl:py-14">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 22%, rgba(255,191,0,0.45) 0%, transparent 42%), radial-gradient(circle at 88% 78%, rgba(255,191,0,0.28) 0%, transparent 38%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative z-10">
        <BrandLogo className="scale-110 origin-left" />
      </div>

      <div className="relative z-10 max-w-md animate-in fade-in slide-in-from-left-4 duration-700">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/70">
          <Sparkles className="size-3.5 text-brand-amber" aria-hidden />
          Fashion Store
        </p>
        <h1 className="mt-4 text-4xl xl:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
          Sign in to shop curated fashion.
        </h1>
        <p className="mt-4 text-base xl:text-lg text-brand-gray leading-relaxed">
          One email. A quick code. Instant access to your bag, wishlist, and
          orders — built for a smooth checkout every time.
        </p>

        <ul className="mt-10 space-y-5">
          {TRUST_POINTS.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-3.5">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/70 ring-1 ring-brand-amber/25 shadow-sm shadow-brand-amber/10">
                <Icon className="size-4 text-foreground" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-foreground">{title}</p>
                <p className="mt-0.5 text-sm text-brand-gray leading-snug">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative z-10 text-xs text-brand-gray">
        Trusted shopping with secure, one-time verification.
      </p>
    </aside>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const redirectTo = searchParams.get("redirect") || "/";
  const intentId = searchParams.get("intent");

  useEffect(() => {
    if (!intentId) return;
    if (peekAuthIntent()) return;
    saveAuthIntent({
      actionId: intentId,
      payload: {},
      returnPath: redirectTo,
    });
  }, [intentId, redirectTo]);

  const handleSuccess = () => {
    router.replace(redirectTo);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-brand-cream via-brand-white to-brand-cream flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-brand-amber" aria-hidden />
        <p className="text-sm text-brand-gray">Preparing a secure sign-in…</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-brand-cream via-brand-white to-brand-amber/20 flex flex-col items-center justify-center px-4">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 30%, rgba(255,191,0,0.35) 0%, transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 w-full max-w-md text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-brand-amber/20 ring-1 ring-brand-amber/40">
            <CheckCircle2 className="size-8 text-foreground" aria-hidden />
          </div>
          <BrandLogo className="justify-center mb-6" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            You&apos;re already signed in
          </h1>
          <p className="mt-2 text-sm text-brand-gray">
            Continue browsing or head back to your bag anytime.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 h-14 w-full sm:w-auto sm:min-w-[220px] rounded-2xl bg-brand-amber px-8 text-base font-bold text-foreground hover:bg-brand-amber/90 shadow-md shadow-brand-amber/25"
          >
            <Link href={redirectTo === "/auth" ? "/" : redirectTo}>
              Continue
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-brand-white">
      <AuthAtmosphere />

      <main className="relative flex flex-1 flex-col">
        <div
          className="pointer-events-none absolute inset-0 lg:hidden opacity-80"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #fff5d1 0%, #ffffff 42%, #ffffff 100%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 flex flex-1 flex-col justify-center px-4 py-8 sm:px-8 sm:py-12 lg:px-12 xl:px-16">
          <div className="mx-auto w-full max-w-[420px]">
            <div className="mb-8 flex items-center justify-between lg:hidden animate-in fade-in duration-500">
              <BrandLogo />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-cream/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground/70 ring-1 ring-brand-amber/20">
                <Lock className="size-3" aria-hidden />
                Secure
              </span>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="mb-2 hidden lg:block">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-gray">
                  Account access
                </p>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Welcome to Nilescart
              </h2>
              <p className="mt-2 text-sm sm:text-base text-brand-gray leading-relaxed">
                Sign in or create an account with your email — no password needed.
              </p>

              <div className="mt-8 rounded-[1.75rem] border border-black/6 bg-white/90 p-6 sm:p-8 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.18)] backdrop-blur-sm">
                <AuthForm onSuccess={handleSuccess} />
              </div>

              <p className="mt-6 flex items-start justify-center gap-2 text-center text-xs sm:text-sm text-brand-gray px-1 leading-relaxed">
                <Lock className="mt-0.5 size-3.5 shrink-0 opacity-70" aria-hidden />
                <span>
                  By continuing, you agree to our{" "}
                  <span className="font-semibold text-foreground">Terms of Service</span>{" "}
                  and{" "}
                  <span className="font-semibold text-foreground">Privacy Policy</span>
                </span>
              </p>

              <p className="mt-8 text-center">
                <Link
                  href={redirectTo === "/auth" ? "/" : redirectTo}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-gray transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="size-3.5" aria-hidden />
                  Back to store
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
