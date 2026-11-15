"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  sendOtp,
  verifyOtp,
  lookupAuthMethods,
  loginWithPassword,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
} from "@/services/authService";
import OtpInput from "@/components/auth/OtpInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
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
  let label2 = "Sign in";
  if (step === "otp") label2 = "Verify";
  if (step === "password") label2 = "Password";
  if (step === "forgot_password") label2 = "Reset";

  const steps = [
    { id: "email", label: "Email" },
    { id: "action", label: label2 },
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
 * Production-grade unified authentication form supporting both Password and OTP login,
 * plus Forgot Password recovery.
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
  const [step, setStep] = useState("email"); // "email" | "password" | "otp" | "forgot_password"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot password flow states
  const [forgotStep, setForgotStep] = useState("email"); // "email" | "otp" | "reset"
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { seconds, isActive, start } = useCountdown(0);

  const clearError = () => setError("");
  const inputHeight = compact ? "h-12" : "h-14";
  const buttonHeight = compact ? "h-12" : "h-14";

  // Step 1: Detect method or send OTP if no password
  const handleContinueEmail = async (event) => {
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
      const lookup = await lookupAuthMethods(trimmedEmail);

      if (lookup.hasPassword) {
        // Account has password -> show password field by default
        setEmail(trimmedEmail);
        setStep("password");
      } else {
        // Account has NO password -> send OTP automatically and show OTP field
        await sendOtp(trimmedEmail);
        setEmail(trimmedEmail);
        setOtp("");
        setStep("otp");
        start(RESEND_COOLDOWN);
      }
    } catch (err) {
      const message = err.message || "Unable to proceed. Please try again.";
      setError(message);
      showErrorToast(err, message);
    } finally {
      setLoading(false);
    }
  };

  // Switch to OTP login explicitly
  const handleSelectOtpMode = async () => {
    clearError();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setStep("otp");
      return;
    }

    setLoading(true);
    try {
      await sendOtp(trimmedEmail);
      setEmail(trimmedEmail);
      setOtp("");
      setStep("otp");
      start(RESEND_COOLDOWN);
      showSuccessToast("Verification code sent to your email");
    } catch (err) {
      const message = err.message || "Unable to send verification code.";
      setError(message);
      showErrorToast(err, message);
    } finally {
      setLoading(false);
    }
  };

  // Switch to Password login explicitly
  const handleSelectPasswordMode = () => {
    clearError();
    setStep("password");
  };

  // Submit Password login
  const handlePasswordLogin = async (event) => {
    event?.preventDefault();
    clearError();

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      setSession(data);
      showSuccessToast("Signed in successfully");
      await onSuccess?.(data);
    } catch (err) {
      const message = err.message || "Invalid email or password.";
      setError(message);
      showErrorToast(err, message);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (isActive || loading) return;
    clearError();
    setLoading(true);
    try {
      if (step === "forgot_password") {
        await sendForgotPasswordOtp(email);
      } else {
        await sendOtp(email);
      }
      setOtp("");
      start(RESEND_COOLDOWN);
      showSuccessToast("Verification code resent");
    } catch (err) {
      const message = err.message || "Unable to resend verification code.";
      setError(message);
      showErrorToast(err, message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
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

  // Forgot password flow
  const handleStartForgotPassword = async () => {
    clearError();
    setStep("forgot_password");
    setForgotStep("email");
    setOtp("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");

    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail && isValidEmail(trimmedEmail)) {
      setLoading(true);
      try {
        await sendForgotPasswordOtp(trimmedEmail);
        setForgotStep("otp");
        start(RESEND_COOLDOWN);
        showSuccessToast("Password reset code sent to your email");
      } catch (err) {
        const message = err.message || "Unable to send reset code.";
        setError(message);
        showErrorToast(err, message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSendForgotOtp = async (event) => {
    event?.preventDefault();
    clearError();

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await sendForgotPasswordOtp(trimmedEmail);
      setEmail(trimmedEmail);
      setForgotStep("otp");
      start(RESEND_COOLDOWN);
      showSuccessToast("Password reset code sent");
    } catch (err) {
      const message = err.message || "Failed to send reset code.";
      setError(message);
      showErrorToast(err, message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyForgotOtp = async (event) => {
    event?.preventDefault();
    clearError();

    if (otp.length !== OTP_LENGTH) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyForgotPasswordOtp({ email, otp });
      setResetToken(res.resetToken);
      setForgotStep("reset");
      showSuccessToast("Code verified. Please set your new password.");
    } catch (err) {
      const message = err.message || "Invalid verification code.";
      setError(message);
      showErrorToast(err, message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (event) => {
    event?.preventDefault();
    clearError();

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        resetToken,
        email,
        newPassword,
        confirmPassword,
      });
      showSuccessToast("Password reset successfully. You can now sign in.");
      setPassword(newPassword);
      setStep("password");
      setForgotStep("email");
    } catch (err) {
      const message = err.message || "Failed to reset password.";
      setError(message);
      showErrorToast(err, message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    clearError();
    setOtp("");
    setPassword("");
    setStep("email");
    setForgotStep("email");
  };

  return (
    <div className={cn(className)}>
      <StepIndicator step={step} compact={compact} />

      {step !== "email" && (
        <button
          type="button"
          onClick={handleChangeEmail}
          disabled={loading}
          className="group mb-5 -mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-brand-gray transition-colors hover:text-foreground disabled:opacity-50"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          {step === "forgot_password" ? "Back to sign in" : "Change email"}
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

      {/* STEP 1: Email / Auto-detect */}
      {step === "email" && (
        <form onSubmit={handleContinueEmail} className="space-y-4" noValidate>
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
              Sign in with password or receive a one-time code.
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
                Checking account…
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

          <div className="relative text-center text-xs text-brand-gray my-3">
            <span className="relative z-10 bg-white px-2">or choose sign-in method</span>
            <div className="absolute inset-x-0 top-1/2 border-t border-black/10" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handleSelectPasswordMode}
              className="rounded-xl border-black/10 text-xs font-semibold gap-1.5 h-11"
            >
              <Lock className="size-3.5 text-brand-gray" />
              Password
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handleSelectOtpMode}
              className="rounded-xl border-black/10 text-xs font-semibold gap-1.5 h-11"
            >
              <KeyRound className="size-3.5 text-brand-gray" />
              One-Time Code
            </Button>
          </div>
        </form>
      )}

      {/* STEP 2: Password Login */}
      {step === "password" && (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="auth-email-display"
              className="text-sm font-semibold text-foreground"
            >
              Email address
            </label>
            <Input
              id="auth-email-display"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={cn(
                inputHeight,
                "rounded-2xl border-black/10 bg-brand-cream/20 text-base"
              )}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="auth-password"
                className="text-sm font-semibold text-foreground"
              >
                Password
              </label>
              <button
                type="button"
                onClick={handleStartForgotPassword}
                className="text-xs font-semibold text-brand-gray hover:text-foreground hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <PasswordInput
              id="auth-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                clearError();
                setPassword(e.target.value);
              }}
              autoFocus
              disabled={loading}
              className={cn(
                inputHeight,
                "rounded-2xl border-black/10 bg-brand-cream/30 text-base"
              )}
            />
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
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </>
            )}
          </Button>

          <div className="relative text-center text-xs text-brand-gray my-3">
            <span className="relative z-10 bg-white px-2">or</span>
            <div className="absolute inset-x-0 top-1/2 border-t border-black/10" />
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleSelectOtpMode}
            className="w-full rounded-2xl border-black/10 text-xs font-semibold h-11"
          >
            Sign in with one-time code instead
          </Button>
        </form>
      )}

      {/* STEP 3: OTP Login */}
      {step === "otp" && (
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

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleSelectPasswordMode}
              className="text-xs font-semibold text-brand-gray hover:text-foreground hover:underline"
            >
              Sign in with password instead
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Forgot Password Flow */}
      {step === "forgot_password" && (
        <div className="space-y-4">
          {forgotStep === "email" && (
            <form onSubmit={handleSendForgotOtp} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="forgot-pw-email"
                  className="text-sm font-semibold text-foreground"
                >
                  Confirm your email
                </label>
                <Input
                  id="forgot-pw-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    clearError();
                    setEmail(e.target.value);
                  }}
                  disabled={loading}
                  required
                  className={cn(
                    inputHeight,
                    "rounded-2xl border-black/10 bg-brand-cream/30 text-base"
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full rounded-2xl bg-brand-amber text-base font-bold text-foreground shadow-md hover:bg-brand-amber/90",
                  buttonHeight
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" aria-hidden />
                    Sending code…
                  </>
                ) : (
                  "Send Reset Code"
                )}
              </Button>
            </form>
          )}

          {forgotStep === "otp" && (
            <form onSubmit={handleVerifyForgotOtp} className="space-y-5">
              <div className="space-y-2 text-center">
                <h3 className="text-base font-bold text-foreground">
                  Enter reset code
                </h3>
                <p className="text-sm text-brand-gray break-all">
                  Sent to <span className="font-semibold">{email}</span>
                </p>
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
                    className="font-semibold text-foreground hover:underline"
                  >
                    Resend code
                  </button>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || otp.length !== OTP_LENGTH}
                className={cn(
                  "w-full rounded-2xl bg-brand-amber text-base font-bold text-foreground shadow-md hover:bg-brand-amber/90",
                  buttonHeight
                )}
              >
                {loading ? "Verifying…" : "Confirm code"}
              </Button>
            </form>
          )}

          {forgotStep === "reset" && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="reset-new-password"
                  className="text-sm font-semibold text-foreground"
                >
                  New password
                </label>
                <PasswordInput
                  id="reset-new-password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => {
                    clearError();
                    setNewPassword(e.target.value);
                  }}
                  autoFocus
                  disabled={loading}
                  className={cn(
                    inputHeight,
                    "rounded-2xl border-black/10 bg-brand-cream/30 text-base"
                  )}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="reset-confirm-password"
                  className="text-sm font-semibold text-foreground"
                >
                  Confirm new password
                </label>
                <PasswordInput
                  id="reset-confirm-password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    clearError();
                    setConfirmPassword(e.target.value);
                  }}
                  disabled={loading}
                  className={cn(
                    inputHeight,
                    "rounded-2xl border-black/10 bg-brand-cream/30 text-base"
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full rounded-2xl bg-brand-amber text-base font-bold text-foreground shadow-md hover:bg-brand-amber/90",
                  buttonHeight
                )}
              >
                {loading ? "Updating password…" : "Save New Password"}
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
