"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, Clock, ChevronRight } from "lucide-react";

export default function FlashDealsBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: "04",
    minutes: "38",
    seconds: "12",
  });

  useEffect(() => {
    // 6-hour cycle countdown
    const target = Date.now() + 4 * 3600 * 1000 + 38 * 60 * 1000 + 12 * 1000;
    const interval = setInterval(() => {
      const diff = Math.max(0, target - Date.now());
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-black text-white py-2.5 px-3 sm:px-6">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
        {/* Left: Flash Sale Title + Icon */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-amber text-black shadow-sm">
            <Zap size={15} className="fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm sm:text-base font-black uppercase tracking-wider text-brand-amber">
                Flash Deals
              </span>
              <span className="hidden sm:inline-block rounded-sm bg-white/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Up to 80% Off
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block leading-none mt-0.5">
              Refreshed daily • Limited quantities available
            </p>
          </div>
        </div>

        {/* Center: Live Countdown Timer */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <Clock size={13} className="text-brand-amber hidden xs:block" />
          <span className="text-zinc-400 text-[11px] hidden md:inline">Ends in:</span>
          <div className="flex items-center gap-1 font-mono">
            <span className="flex h-6 min-w-6 items-center justify-center rounded bg-zinc-800 px-1 text-xs font-bold text-white shadow-inner">
              {timeLeft.hours}
            </span>
            <span className="text-brand-amber font-bold">:</span>
            <span className="flex h-6 min-w-6 items-center justify-center rounded bg-zinc-800 px-1 text-xs font-bold text-white shadow-inner">
              {timeLeft.minutes}
            </span>
            <span className="text-brand-amber font-bold">:</span>
            <span className="flex h-6 min-w-6 items-center justify-center rounded bg-zinc-800 px-1 text-xs font-bold text-white shadow-inner">
              {timeLeft.seconds}
            </span>
          </div>
        </div>

        {/* Right: CTA */}
        <Link
          href="/collections"
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-amber hover:text-white transition group"
        >
          <span>Shop All Deals</span>
          <ChevronRight size={14} className="transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
