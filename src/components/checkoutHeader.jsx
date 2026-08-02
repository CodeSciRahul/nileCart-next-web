"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo.jsx";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Bag", path: "/checkout/bag" },
  { label: "Payment", path: "/checkout/payment" },
];

export default function CheckoutHeader() {
  const pathname = usePathname();
  const currentStep = Math.max(
    0,
    steps.findIndex(
      (step) => pathname === step.path || pathname?.startsWith(`${step.path}`)
    )
  );

  const activeIndex =
    pathname?.includes("/success") || pathname?.includes("/callback")
      ? steps.length
      : currentStep === -1
        ? 0
        : currentStep;

  return (
    <header className="sticky top-0 z-50 border-b border-brand-amber/15 bg-brand-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6">
        <BrandLogo className="min-w-0" />

        <nav
          aria-label="Checkout progress"
          className="hidden items-center gap-1 md:flex"
        >
          {steps.map((step, index) => {
            const done = index < activeIndex;
            const current = index === activeIndex;
            const reachable = index <= activeIndex;

            return (
              <div key={step.label} className="flex items-center">
                {reachable && index < activeIndex ? (
                  <Link
                    href={step.path}
                    className="flex items-center gap-2 px-2 py-1"
                  >
                    <StepPill index={index} done current={false} label={step.label} />
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 px-2 py-1">
                    <StepPill
                      index={index}
                      done={done}
                      current={current}
                      label={step.label}
                    />
                  </div>
                )}
                {index !== steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-1 h-px w-10 sm:w-14",
                      index < activeIndex ? "bg-brand-amber" : "bg-border"
                    )}
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray sm:text-xs">
          <ShieldCheck size={16} className="text-emerald-600" aria-hidden />
          <span className="hidden sm:inline">100% Secure</span>
          <span className="sm:hidden">Secure</span>
        </div>
      </div>

      {/* Mobile step label */}
      <div className="border-t border-brand-amber/10 bg-brand-cream/40 px-4 py-2 md:hidden">
        <p className="text-center text-[11px] font-bold uppercase tracking-wider text-foreground">
          Step {Math.min(activeIndex + 1, steps.length)} of {steps.length}
          {" · "}
          {steps[Math.min(activeIndex, steps.length - 1)]?.label}
        </p>
      </div>
    </header>
  );
}

function StepPill({ index, done, current, label }) {
  return (
    <>
      <span
        className={cn(
          "flex size-6 items-center justify-center text-[10px] font-black tabular-nums ring-1",
          done || current
            ? "bg-brand-amber text-foreground ring-brand-amber"
            : "bg-brand-white text-brand-gray ring-border"
        )}
      >
        {index + 1}
      </span>
      <span
        className={cn(
          "text-xs font-bold uppercase tracking-[0.16em]",
          done || current ? "text-foreground" : "text-brand-gray"
        )}
      >
        {label}
      </span>
    </>
  );
}
