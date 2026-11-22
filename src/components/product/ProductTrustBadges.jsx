"use client";

import {
  BadgeCheck,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

const BADGES = [
  { icon: Truck, label: "Fast Dispatch", hint: "2–5 days delivery" },
  { icon: RotateCcw, label: "7-Day Returns", hint: "Instant pickup & refund" },
  { icon: ShieldCheck, label: "Secure Checkout", hint: "SSL encrypted payments" },
  { icon: BadgeCheck, label: "100% Genuine", hint: "Verified brand quality" },
];

export default function ProductTrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {BADGES.map(({ icon: Icon, label, hint }) => (
        <div
          key={label}
          className="flex items-center gap-2.5 rounded-xs border border-neutral-200/90 bg-neutral-50/60 px-3 py-2.5 transition hover:border-black hover:bg-white"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-xs bg-white text-black border border-neutral-200 shadow-xs">
            <Icon size={14} strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-tight text-neutral-900 truncate">
              {label}
            </p>
            <p className="text-[10px] leading-tight text-neutral-500 truncate">
              {hint}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
