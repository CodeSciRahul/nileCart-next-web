"use client";

import { useState } from "react";
import { Check, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useApplyCoupon,
  useRemoveCoupon,
  useValidateCoupon,
} from "@/hooks/useCoupon";
import { useAuth } from "@/context/AuthContext";
import { useAuthGate } from "@/context/AuthGateContext";
import { AUTH_ACTIONS } from "@/lib/authActions";
import { showErrorToast } from "@/lib/toast";

export default function CouponInput({ appliedCoupon, subtotal = 0 }) {
  const [code, setCode] = useState("");
  const [preview, setPreview] = useState(null);
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useAuthGate();

  const validateMutation = useValidateCoupon();
  const applyMutation = useApplyCoupon();
  const removeMutation = useRemoveCoupon();

  const isPending =
    validateMutation.isPending ||
    applyMutation.isPending ||
    removeMutation.isPending;
  const withAuth = async (fn) => {
    if (isAuthenticated) {
      fn();
      return;
    }
    await requireAuth({
      action: AUTH_ACTIONS.APPLY_COUPON,
      onSuccess: fn,
    });
  };

  const handleValidate = () => {
    const trimmed = code.trim();
    if (!trimmed) return;

    withAuth(() => {
      setPreview(null);
      validateMutation.mutate(
        { code: trimmed, orderAmount: subtotal },
        {
          onSuccess: (data) => {
            setPreview({
              type: "success",
              message: `You save ₹${data?.discount ?? 0} with ${data?.coupon?.code}`,
              discount: data?.discount,
            });
          },
          onError: (error) => {
            showErrorToast(error?.message);
            setPreview(null);
          },
        }
      );
    });
  };

  const handleApply = () => {
    const trimmed = code.trim();
    if (!trimmed) return;

    withAuth(() => {
      applyMutation.mutate(
        { code: trimmed },
        {
          onSuccess: () => {
            setCode("");
            setPreview(null);
          },
        }
      );
    });
  };

  const handleRemove = () => {
    withAuth(() => {
      removeMutation.mutate();
      setCode("");
      setPreview(null);
    });
  };

  if (appliedCoupon?.code) {
    return (
      <div className="border border-brand-amber/30 bg-brand-cream/60 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center bg-brand-amber/25 text-foreground">
              <Check size={14} strokeWidth={2.5} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-gray">
                Coupon applied
              </p>
              <p className="mt-0.5 text-sm font-bold tracking-wide">
                {appliedCoupon.code}
              </p>
              {appliedCoupon.description && (
                <p className="mt-0.5 text-xs text-brand-gray">
                  {appliedCoupon.description}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="shrink-0 p-1 text-brand-gray transition hover:text-foreground disabled:opacity-50"
            aria-label="Remove coupon"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-gray">
        <Tag size={13} className="text-brand-amber" />
        Have a coupon?
      </p>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setPreview(null);
          }}
          placeholder="Enter code"
          disabled={isPending}
          className="h-10 rounded-none border-brand-amber/25 bg-brand-white uppercase tracking-wide"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApply();
            }
          }}
          aria-label="Coupon code"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleValidate}
          disabled={isPending || !code.trim()}
          className="h-10 rounded-none border-brand-amber/30 px-3"
        >
          Check
        </Button>
        <Button
          type="button"
          onClick={handleApply}
          disabled={isPending || !code.trim()}
          className="h-10 rounded-none bg-brand-amber px-4 font-bold text-foreground hover:bg-brand-amber/90"
        >
          Apply
        </Button>
      </div>
      {preview?.type === "success" && (
        <p className="text-xs font-semibold text-emerald-700" role="status">
          {preview.message}
        </p>
      )}
    </div>
  );
}
