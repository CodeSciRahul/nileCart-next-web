"use client";

import {
  BadgeCheck,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

const BADGES = [
  { icon: Truck, label: "Fast Delivery", hint: "2–7 day ETA" },
  { icon: RotateCcw, label: "Easy Returns", hint: "7-day returns" },
  { icon: ShieldCheck, label: "Secure Payment", hint: "Encrypted checkout" },
  { icon: BadgeCheck, label: "Genuine Product", hint: "Verified sellers" },
];

export default function ProductTrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {BADGES.map(({ icon: Icon, label, hint }) => (
        <div
          key={label}
          className="flex flex-col items-start gap-1.5 border border-brand-amber/20 bg-brand-cream/40 px-3 py-3 transition hover:border-brand-amber/40"
        >
          <span className="flex size-8 items-center justify-center bg-brand-amber/20 text-foreground">
            <Icon size={16} strokeWidth={2} />
          </span>
          <p className="text-xs font-bold tracking-tight text-foreground">
            {label}
          </p>
          <p className="text-[10px] leading-snug text-brand-gray">{hint}</p>
        </div>
      ))}
    </div>
  );
}
