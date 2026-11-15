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
          className="flex flex-col items-start gap-1.5 border border-neutral-200 bg-neutral-50 px-3 py-3 transition hover:border-black"
        >
          <span className="flex size-8 items-center justify-center rounded-xs bg-white text-black shadow-xs">
            <Icon size={16} strokeWidth={2} />
          </span>
          <p className="text-xs font-bold tracking-tight text-neutral-900">
            {label}
          </p>
          <p className="text-[10px] leading-snug text-neutral-500">{hint}</p>
        </div>
      ))}
    </div>
  );
}
