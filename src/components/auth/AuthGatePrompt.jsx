"use client";

import { useEffect, useId } from "react";
import { Check, Lock, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import AuthForm from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { cn } from "@/lib/utils";

/**
 * Premium auth gate — centered dialog on desktop, bottom sheet on mobile.
 */
export default function AuthGatePrompt({
  open,
  phase = "prompt",
  action,
  busy = false,
  onOpenChange,
  onContinue,
  onCancel,
  onAuthSuccess,
}) {
  const titleId = useId();
  const descriptionId = useId();
  const primaryId = useId();
  const Icon = action?.icon || Lock;

  useEffect(() => {
    if (!open || phase !== "prompt") return;
    const id = requestAnimationFrame(() => {
      document.getElementById(primaryId)?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open, phase, primaryId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        overlayClassName="z-[300] bg-black/40 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 duration-200"
        className={cn(
          // Mobile bottom sheet
          "fixed inset-x-0 bottom-0 top-auto z-[300] flex max-h-[92vh] w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-t-3xl rounded-b-none border-0 bg-white p-0 shadow-2xl ring-1 ring-black/5",
          "data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-bottom-4 data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-bottom-4 duration-200",
          // Desktop centered card
          "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:max-h-[min(90vh,720px)] sm:w-full sm:max-w-[440px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:data-open:zoom-in-95 sm:data-closed:zoom-out-95 sm:data-open:slide-in-from-bottom-0 sm:data-closed:slide-out-to-bottom-0",
          "dark:bg-card dark:ring-white/10"
        )}
        onEscapeKeyDown={(event) => {
          if (busy) {
            event.preventDefault();
            return;
          }
          onCancel?.();
        }}
        onPointerDownOutside={(event) => {
          if (busy) {
            event.preventDefault();
            return;
          }
          onCancel?.();
        }}
      >
        {/* Grab handle — mobile */}
        <div className="flex justify-center pt-3 sm:hidden" aria-hidden>
          <span className="h-1.5 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        </div>

        <div className="relative flex items-start justify-between gap-3 border-b border-neutral-100 px-5 pb-4 pt-2 sm:px-6 sm:pt-5 dark:border-neutral-800">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-amber/20 text-foreground ring-1 ring-brand-amber/30">
              <Icon className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Nilescart account
              </p>
              <DialogTitle
                id={titleId}
                className="truncate text-lg font-bold tracking-tight text-[#282c3f] dark:text-foreground"
              >
                {action?.title || "Sign in to continue"}
              </DialogTitle>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-foreground disabled:opacity-50 dark:hover:bg-neutral-800"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          <DialogDescription
            id={descriptionId}
            className="text-sm leading-relaxed text-[#696e79] dark:text-muted-foreground"
          >
            {action?.description}
          </DialogDescription>

          {phase === "prompt" && (
            <div className="mt-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <ul className="space-y-2.5">
                {(action?.benefits || []).map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-amber/25 text-foreground">
                      <Check className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                    <span className="text-sm font-medium text-[#282c3f] dark:text-foreground">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-2.5">
                <Button
                  id={primaryId}
                  type="button"
                  onClick={onContinue}
                  disabled={busy}
                  className="h-12 w-full rounded-2xl bg-brand-amber text-base font-bold text-foreground shadow-md shadow-brand-amber/20 transition hover:bg-brand-amber/90 active:scale-[0.99]"
                >
                  {action?.primaryLabel || "Continue with Login"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  disabled={busy}
                  className="h-11 w-full rounded-2xl text-sm font-semibold text-[#696e79] hover:bg-neutral-50 hover:text-foreground dark:hover:bg-neutral-800"
                >
                  {action?.secondaryLabel || "Continue browsing"}
                </Button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                <BrandLogo compact className="opacity-80" />
                <p className="text-[11px] text-neutral-500">
                  Secure · Passwordless · Free
                </p>
              </div>
            </div>
          )}

          {phase === "form" && (
            <div className="mt-4 animate-in fade-in slide-in-from-right-2 duration-200">
              <AuthForm
                compact
                autoFocus
                onSuccess={async () => {
                  await onAuthSuccess?.();
                }}
              />
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={busy}
                className="mt-3 h-10 w-full rounded-xl text-sm font-medium text-neutral-500"
              >
                {action?.secondaryLabel || "Cancel"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
