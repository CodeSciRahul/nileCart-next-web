"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sendOtp, verifyOtp } from "@/services/authService";
import OtpInput from "@/components/auth/OtpInput";
import { useCountdown } from "@/hooks/useCountdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showErrorToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 45;

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const formatCountdown = (seconds) => {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
};

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
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-black/60" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4">
        <p className="text-lg font-medium mb-4">You are already signed in.</p>
        <Button asChild size="lg" className="h-12 px-8 rounded-2xl bg-black text-white hover:bg-black/90">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Link
              href="/"
              className="inline-block text-3xl sm:text-4xl font-bold tracking-tight hover:opacity-80 transition-opacity"
            >
              NILECART
            </Link>
            <p className="mt-3 text-sm sm:text-base text-brand-gray">
              {step === "email"
                ? "Sign in or create an account with your email"
                : "We've sent a verification code to your email"}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-black/5 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {step === "otp" && (
              <button
                type="button"
                onClick={handleChangeEmail}
                disabled={loading}
                className="flex items-center gap-1.5 text-sm text-brand-gray hover:text-black transition-colors mb-6 -mt-1 disabled:opacity-50"
              >
                <ArrowLeft className="size-4" />
                Change email
              </button>
            )}

            {error && (
              <div
                role="alert"
                className="mb-5 px-4 py-3 rounded-2xl text-sm bg-red-50 text-red-700 border border-red-100 animate-in fade-in duration-300"
              >
                {error}
              </div>
            )}

            {step === "email" ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-black">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-brand-gray pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoFocus
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => {
                        clearError();
                        setEmail(event.target.value);
                      }}
                      disabled={loading}
                      className="h-14 pl-12 rounded-2xl text-base border-gray-200 bg-white focus-visible:ring-black/10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-black text-white text-base font-semibold hover:bg-black/90 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Sending code...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-4 text-center">
                  <div className="inline-flex items-center justify-center size-12 rounded-full bg-brand-cream">
                    <Mail className="size-5 text-black" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-black">
                      Enter verification code
                    </h2>
                    <p className="mt-1.5 text-sm text-brand-gray break-all">
                      Sent to <span className="font-medium text-black">{email}</span>
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
                />

                <div className="text-center text-sm text-brand-gray">
                  {isActive ? (
                    <p>
                      Resend code in{" "}
                      <span className="font-medium text-black tabular-nums">
                        {formatCountdown(seconds)}
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className={cn(
                        "font-medium text-black hover:underline underline-offset-4 transition-colors",
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
                  className="w-full h-14 rounded-2xl bg-black text-white text-base font-semibold hover:bg-black/90 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>
              </form>
            )}
          </div>

          <p className="mt-6 text-center text-xs sm:text-sm text-brand-gray px-4">
            By continuing, you agree to our{" "}
            <span className="font-medium text-black">Terms of Service</span> and{" "}
            <span className="font-medium text-black">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
