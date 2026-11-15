"use client";

import { useState } from "react";
import { KeyRound, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { setPassword, changePassword } from "@/services/authService";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/button";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

export default function CustomerPasswordSection() {
  const { user, refreshProfile } = useAuth();
  const hasPassword = Boolean(user?.hasPassword);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
      if (hasPassword) {
        if (!currentPassword) {
          setError("Please enter your current password.");
          setLoading(false);
          return;
        }

        await changePassword({
          currentPassword,
          newPassword,
          confirmPassword,
        });
        showSuccessToast("Password changed successfully");
      } else {
        await setPassword({
          password: newPassword,
          confirmPassword,
        });
        showSuccessToast("Password configured successfully");
      }

      resetForm();
      await refreshProfile();
    } catch (err) {
      const msg = err.message || "Failed to update password.";
      setError(msg);
      showErrorToast(err, msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 max-w-lg rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-black/5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand-amber/15 text-foreground ring-1 ring-brand-amber/20">
            <Lock className="size-4.5" />
          </span>
          <div>
            <h3 className="font-bold text-foreground">Security & Password</h3>
            <p className="text-xs text-brand-gray">
              {hasPassword
                ? "Update your password anytime."
                : "Set a password to log in without waiting for an OTP."}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            hasPassword
              ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
              : "bg-brand-cream text-brand-gray ring-1 ring-brand-amber/20"
          }`}
        >
          {hasPassword ? (
            <>
              <ShieldCheck className="size-3" />
              Configured
            </>
          ) : (
            "OTP Only"
          )}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs text-red-700"
          >
            {error}
          </div>
        )}

        {hasPassword && (
          <div className="space-y-1.5">
            <label
              htmlFor="cust-current-password"
              className="text-sm font-semibold text-foreground"
            >
              Current password *
            </label>
            <PasswordInput
              id="cust-current-password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => {
                setError("");
                setCurrentPassword(e.target.value);
              }}
              required
              className="rounded-xl border-black/10 bg-brand-cream/20 text-sm"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="cust-new-password"
            className="text-sm font-semibold text-foreground"
          >
            {hasPassword ? "New password *" : "Create password *"}
          </label>
          <PasswordInput
            id="cust-new-password"
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={(e) => {
              setError("");
              setNewPassword(e.target.value);
            }}
            required
            className="rounded-xl border-black/10 bg-brand-cream/20 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="cust-confirm-password"
            className="text-sm font-semibold text-foreground"
          >
            Confirm new password *
          </label>
          <PasswordInput
            id="cust-confirm-password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => {
              setError("");
              setConfirmPassword(e.target.value);
            }}
            required
            className="rounded-xl border-black/10 bg-brand-cream/20 text-sm"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-brand-amber font-bold text-foreground hover:bg-brand-amber/90"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <KeyRound className="size-4" />
              {hasPassword ? "Change Password" : "Set Password"}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

