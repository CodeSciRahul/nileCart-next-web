"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sendOtp, verifyOtp } from "@/services/authService";
import OtpInput from "@/components/auth/OtpInput";
import { useCountdown } from "@/hooks/useCountdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 45;

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const formatCountdown = (seconds) => {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
};

function StepIndicator({ step, compact }) {
  const steps = [
    { id: "email", label: "Email" },
    { id: "otp", label: "Verify" },
  ];
  const activeIndex = step === "email" ? 0 : 1;

  return (
    <nav aria-label="Sign-in progress" className={cn(compact ? "mb-5" : "mb-8")}>
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

/**
 * Passwordless email OTP form — shared by /auth page and AuthGate modal.
 *
 * @param {{
 *   onSuccess?: (data: { user?: object, token?: string }) => void | Promise<void>,
 *   compact?: boolean,
 *   className?: string,
 *   autoFocus?: boolean,
 * }} props
 */
export default function AuthForm({
  onSuccess,
  compact = false,
  className,
  autoFocus = true,
}) {
  const { setSession } = useAuth();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { seconds, isActive, start } = useCountdown(0);

  const clearError = () => setError("");
  const inputHeight = compact ? "h-12" : "h-14";
  const buttonHeight = compact ? "h-12" : "h-14";

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
      const message =
        err.message || "Unable to send verification code. Please try again.";
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
      showSuccessToast("Signed in successfully");
      await onSuccess?.(data);
    } catch (err) {
      const message =
        err.message || "Invalid verification code. Please try again.";
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

  return (
    <div className={cn(className)}>
      <StepIndicator step={step} compact={compact} />

      {step === "otp" && (
        <button
          type="button"
          onClick={handleChangeEmail}
          disabled={loading}
          className="group mb-5 -mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-brand-gray transition-colors hover:text-foreground disabled:opacity-50"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Change email
        </button>
      )}

      <div aria-live="polite" aria-atomic="true">
        {error && (
          <div
            role="alert"
            className="mb-4 flex gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 animate-in fade-in slide-in-from-top-1 duration-300 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
          >
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-bold dark:bg-red-900/60">
              !
            </span>
            <span>{error}</span>
          </div>
        )}
      </div>

      {step === "email" ? (
        <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
          <div className="space-y-2">
            <label
              htmlFor="auth-gate-email"
              className="text-sm font-semibold text-foreground"
            >
              Email address
            </label>
            <div className="relative group">
              <Mail
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-brand-gray transition-colors group-focus-within:text-foreground"
                aria-hidden
              />
              <Input
                id="auth-gate-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoFocus={autoFocus}
                placeholder="you@example.com"
                value={email}
                aria-invalid={Boolean(error)}
                onChange={(event) => {
                  clearError();
                  setEmail(event.target.value);
                }}
                disabled={loading}
                className={cn(
                  inputHeight,
                  "rounded-2xl border-black/10 bg-brand-cream/30 pl-12 text-base placeholder:text-brand-gray/70 focus-visible:border-brand-amber focus-visible:bg-white focus-visible:ring-brand-amber/30 dark:bg-muted/40"
                )}
              />
            </div>
            <p className="text-xs text-brand-gray">
              We&apos;ll send a one-time code — no password needed.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={cn(
              "group w-full rounded-2xl bg-brand-amber text-base font-bold text-foreground shadow-md shadow-brand-amber/20 transition-all hover:bg-brand-amber/90 active:scale-[0.99] disabled:opacity-60",
              buttonHeight
            )}
          >
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden />
                Sending code…
              </>
            ) : (
              <>
                Continue
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </>
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="space-y-3 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-brand-cream to-brand-amber/40 ring-1 ring-brand-amber/30 shadow-sm shadow-brand-amber/15 animate-in zoom-in-95 duration-300">
              <Mail className="size-5 text-foreground" aria-hidden />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Enter verification code
              </h3>
              <p className="mt-1 text-sm text-brand-gray break-all">
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
                <span className="font-semibold tabular-nums text-foreground">
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
                  loading && "cursor-not-allowed opacity-50"
                )}
              >
                Resend verification code
              </button>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || otp.length !== OTP_LENGTH}
            className={cn(
              "group w-full rounded-2xl bg-brand-amber text-base font-bold text-foreground shadow-md shadow-brand-amber/20 transition-all hover:bg-brand-amber/90 active:scale-[0.99] disabled:opacity-60",
              buttonHeight
            )}
          >
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden />
                Verifying…
              </>
            ) : (
              <>
                Verify & continue
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
