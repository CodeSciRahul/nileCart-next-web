"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Heart,
  Loader2,
  Lock,
  Mail,
  Package,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sendOtp, verifyOtp } from "@/services/authService";
import OtpInput from "@/components/auth/OtpInput";
import { BrandLogo } from "@/components/BrandLogo";
import { useCountdown } from "@/hooks/useCountdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showErrorToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 45;

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

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const formatCountdown = (seconds) => {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
};

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

function StepIndicator({ step }) {
  const steps = [
    { id: "email", label: "Email" },
    { id: "otp", label: "Verify" },
  ];
  const activeIndex = step === "email" ? 0 : 1;

  return (
    <nav aria-label="Sign-in progress" className="mb-8">
      <ol className="flex items-center gap-2">
        {steps.map((item, index) => {
          const isComplete = index < activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <li key={item.id} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                  isComplete && "bg-brand-amber text-foreground",
                  isCurrent && "bg-foreground text-white ring-4 ring-brand-amber/25",
                  !isComplete && !isCurrent && "bg-black/5 text-brand-gray"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isComplete ? (
                  <CheckCircle2 className="size-4" aria-hidden />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold tracking-wide uppercase",
                  isCurrent ? "text-foreground" : "text-brand-gray"
                )}
              >
                {item.label}
              </span>
              {index < steps.length - 1 && (
                <span
                  className={cn(
                    "ml-1 h-px flex-1 transition-colors duration-300",
                    isComplete ? "bg-brand-amber" : "bg-black/10"
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading: authLoading, setSession } = useAuth();

  const redirectTo = searchParams.get("redirect") || "/";
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { seconds, isActive, start } = useCountdown(0);

  const clearError = () => setError("");

  const handleSendOtp = async (event) => {
    event?.preventDefault();
    clearError();

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await sendOtp(trimmedEmail);
      setEmail(trimmedEmail);
      setOtp("");
      setStep("otp");
      start(RESEND_COOLDOWN);
    } catch (err) {
      const message = err.message || "Unable to send verification code. Please try again.";
      setError(message);
      showErrorToast(err, message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isActive || loading) return;
    clearError();
    setLoading(true);

    try {
      await sendOtp(email);
      setOtp("");
      start(RESEND_COOLDOWN);
    } catch (err) {
      const message = err.message || "Unable to resend verification code.";
      setError(message);
      showErrorToast(err, message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event?.preventDefault();
    clearError();

    if (otp.length !== OTP_LENGTH) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOtp({ email, otp });
      setSession(data);
      router.replace(redirectTo);
    } catch (err) {
      const message = err.message || "Invalid verification code. Please try again.";
      setError(message);
      showErrorToast(err, message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    clearError();
    setOtp("");
    setStep("email");
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
            <Link href="/">
              Continue Shopping
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
                {step === "email" ? "Welcome to NileCart" : "Check your inbox"}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-brand-gray leading-relaxed">
                {step === "email"
                  ? "Sign in or create an account with your email — no password needed."
                  : "Enter the 6-digit code we sent to verify it’s you."}
              </p>

              <div className="mt-8 rounded-[1.75rem] border border-black/6 bg-white/90 p-6 sm:p-8 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.18)] backdrop-blur-sm">
                <StepIndicator step={step} />

                {step === "otp" && (
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    disabled={loading}
                    className="group mb-6 -mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-gray transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                    Change email
                  </button>
                )}

                <div aria-live="polite" aria-atomic="true">
                  {error && (
                    <div
                      role="alert"
                      className="mb-5 flex gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 animate-in fade-in slide-in-from-top-1 duration-300"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-bold">
                        !
                      </span>
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                {step === "email" ? (
                  <form onSubmit={handleSendOtp} className="space-y-5" noValidate>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-semibold text-foreground"
                      >
                        Email address
                      </label>
                      <div className="relative group">
                        <Mail
                          className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-brand-gray transition-colors group-focus-within:text-foreground pointer-events-none"
                          aria-hidden
                        />
                        <Input
                          id="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          autoFocus
                          placeholder="you@example.com"
                          value={email}
                          aria-invalid={Boolean(error)}
                          aria-describedby="email-hint"
                          onChange={(event) => {
                            clearError();
                            setEmail(event.target.value);
                          }}
                          disabled={loading}
                          className="h-14 pl-12 rounded-2xl text-base border-black/10 bg-brand-cream/30 placeholder:text-brand-gray/70 focus-visible:border-brand-amber focus-visible:bg-white focus-visible:ring-brand-amber/30 transition-all"
                        />
                      </div>
                      <p id="email-hint" className="text-xs text-brand-gray">
                        We&apos;ll send a one-time verification code — never a password.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="group w-full h-14 rounded-2xl bg-brand-amber text-base font-bold text-foreground hover:bg-brand-amber/90 shadow-md shadow-brand-amber/20 disabled:opacity-60 transition-all active:scale-[0.99]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="size-5 animate-spin" aria-hidden />
                          Sending code…
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="space-y-4 text-center">
                      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-brand-cream to-brand-amber/40 ring-1 ring-brand-amber/30 shadow-sm shadow-brand-amber/15 animate-in zoom-in-95 duration-300">
                        <Mail className="size-6 text-foreground" aria-hidden />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          Enter verification code
                        </h3>
                        <p className="mt-1.5 text-sm text-brand-gray break-all">
                          Sent to{" "}
                          <span className="font-semibold text-foreground">{email}</span>
                        </p>
                      </div>
                    </div>

                    <OtpInput
                      value={otp}
                      onChange={(value) => {
                        clearError();
                        setOtp(value);
                      }}
                      disabled={loading}
                      autoFocus
                      hasError={Boolean(error)}
                    />

                    <div className="text-center text-sm text-brand-gray">
                      {isActive ? (
                        <p>
                          Resend code in{" "}
                          <span className="font-semibold text-foreground tabular-nums">
                            {formatCountdown(seconds)}
                          </span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={loading}
                          className={cn(
                            "font-semibold text-foreground underline-offset-4 transition-colors hover:underline hover:text-foreground/80",
                            loading && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          Resend verification code
                        </button>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={loading || otp.length !== OTP_LENGTH}
                      className="group w-full h-14 rounded-2xl bg-brand-amber text-base font-bold text-foreground hover:bg-brand-amber/90 shadow-md shadow-brand-amber/20 disabled:opacity-60 transition-all active:scale-[0.99]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="size-5 animate-spin" aria-hidden />
                          Verifying…
                        </>
                      ) : (
                        <>
                          Verify & Continue
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                        </>
                      )}
                    </Button>
                  </form>
                )}
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
                  href="/"
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
