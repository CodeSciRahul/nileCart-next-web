"use client";

import { useEffect, useState } from "react";
import { Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useApplyCoupon,
  useRemoveCoupon,
  useValidateCoupon,
} from "@/hooks/useCoupon";
import { showErrorToast } from "@/lib/toast";
import { showSuccessToast } from "@/lib/toast";
import { showInfoToast } from "@/lib/toast";

export default function CouponInput({ appliedCoupon, subtotal = 0 }) {
  const [code, setCode] = useState("");
  const [preview, setPreview] = useState(null);

  const validateMutation = useValidateCoupon();
  const applyMutation = useApplyCoupon();
  const removeMutation = useRemoveCoupon();

  const isPending =
    validateMutation.isPending ||
    applyMutation.isPending ||
    removeMutation.isPending;

  useEffect(() => {
    setPreview(null);
  }, [appliedCoupon?.code]);

  const handleValidate = () => {
    const trimmed = code.trim();
    if (!trimmed) return;

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
        }
      }
    );
  };

  const handleApply = () => {
    const trimmed = code.trim();
    if (!trimmed) return;

    applyMutation.mutate(
      { code: trimmed },
      {
        onSuccess: () => {
          setCode("");
          setPreview(null);
        },
      }
    );
  };

  const handleRemove = () => {
    removeMutation.mutate();
    setCode("");
    setPreview(null);
  };

  if (appliedCoupon?.code) {
    return (
      <div className="rounded-lg border border-brand-amber/30 bg-brand-cream p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <Tag size={16} className="mt-0.5 shrink-0 text-brand-amber" />
            <div>
              <p className="text-sm font-semibold">{appliedCoupon.code}</p>
              {appliedCoupon.description && (
                <p className="text-brand-gray mt-0.5 text-xs">
                  {appliedCoupon.description}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="text-brand-gray hover:text-foreground shrink-0"
            aria-label="Remove coupon"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Have a coupon?</p>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setPreview(null);
          }}
          placeholder="Enter coupon code"
          disabled={isPending}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApply();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleValidate}
          disabled={isPending || !code.trim()}
        >
          Check
        </Button>
        <Button
          type="button"
          onClick={handleApply}
          disabled={isPending || !code.trim()}
          className="bg-brand-amber text-brand-white hover:bg-brand-amber/90"
        >
          Apply
        </Button>
      </div>
      {preview?.type === "success" && (
        <p className="text-sm text-green-600">{preview.message}</p>
      )}
    </div>
  );
}
