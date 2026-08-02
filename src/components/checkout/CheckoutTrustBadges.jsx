import {
  BadgeCheck,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BADGES = [
  { icon: ShieldCheck, label: "Secure Checkout" },
  { icon: RotateCcw, label: "Easy Returns" },
  { icon: Truck, label: "Fast Delivery" },
  { icon: BadgeCheck, label: "Authentic Products" },
];

/**
 * @param {{ className?: string, compact?: boolean }} props
 * compact: 2×2 grid for narrow sidebars; otherwise 2×2 → 4-col on wider widths
 */
export default function CheckoutTrustBadges({
  className = "",
  compact = false,
}) {
  return (
    <div
      className={cn(
        "grid gap-2",
        compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4",
        className
      )}
      role="list"
      aria-label="Shopping guarantees"
    >
      {BADGES.map(({ icon: Icon, label }) => (
        <div
          key={label}
          role="listitem"
          className="flex min-w-0 items-center gap-2 border border-brand-amber/20 bg-brand-cream/50 px-2.5 py-2.5"
        >
          <span className="flex size-7 shrink-0 items-center justify-center bg-brand-amber/20 text-foreground">
            <Icon size={14} strokeWidth={2} />
          </span>
          <span className="text-[10px] font-bold leading-tight tracking-wide text-foreground sm:text-[11px]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
