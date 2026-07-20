"use client";

import { Check } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { useAuthGate } from "@/context/AuthGateContext";
import { resolveAuthAction } from "@/lib/authActions";
import { cn } from "@/lib/utils";

/**
 * Full-page soft gate for routes that require auth (wishlist, account, bag).
 * Preserves scroll/context — no abrupt redirect.
 */
export default function AuthRequiredState({
  action = "GENERIC",
  className,
  onAuthenticated,
}) {
  const { requireAuth } = useAuthGate();
  const config = resolveAuthAction(action);
  const Icon = config.icon;

  const handleContinue = async () => {
    await requireAuth({
      action: config,
      onSuccess: onAuthenticated,
    });
  };

  return (
    <div
      className={cn(
        "mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center",
        className
      )}
    >
      <span className="mb-5 flex size-16 items-center justify-center rounded-3xl bg-brand-amber/20 text-foreground ring-1 ring-brand-amber/30 shadow-sm shadow-brand-amber/10">
        <Icon className="size-7" aria-hidden />
      </span>

      <BrandLogo className="mb-4 justify-center opacity-90" />

      <h1 className="text-2xl font-bold tracking-tight text-[#282c3f] dark:text-foreground">
        {config.title}
      </h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#696e79] dark:text-muted-foreground">
        {config.description}
      </p>

      <ul className="mt-6 w-full max-w-sm space-y-2.5 text-left">
        {config.benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-amber/25">
              <Check className="size-3" strokeWidth={3} aria-hidden />
            </span>
            <span className="text-sm font-medium text-[#282c3f] dark:text-foreground">
              {benefit}
            </span>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        onClick={handleContinue}
        className="mt-8 h-12 w-full max-w-sm rounded-2xl bg-brand-amber text-base font-bold text-foreground shadow-md shadow-brand-amber/20 hover:bg-brand-amber/90"
      >
        {config.primaryLabel}
      </Button>
    </div>
  );
}
