import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import { DEPARTMENT_LABELS, DEPARTMENT_ORDER } from "@/constant/index.js";
import { ArrowRight } from "lucide-react";

export default function DepartmentStrip() {
  return (
    <section className="border-t border-border/60 bg-zinc-50/50 py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-2">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 bg-brand-amber rounded-full" />
            <h2 className="font-display text-base sm:text-lg md:text-xl font-black uppercase tracking-tight text-foreground">
              Shop by Department
            </h2>
          </div>
          <Link
            href="/collections"
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-amber hover:text-black transition"
          >
            <span>All Departments</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {DEPARTMENT_ORDER.map((key, index) => (
            <li key={key}>
              <Reveal delay={Math.min(index * 25, 150)}>
                <Link
                  href={`/shop/${key}`}
                  className="group flex flex-col items-center justify-center rounded-none border border-border/70 bg-white p-3 text-center transition hover:border-black hover:shadow-xs active:scale-95"
                >
                  <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-wide text-foreground group-hover:text-brand-amber transition">
                    {DEPARTMENT_LABELS[key]}
                  </span>
                  <span className="mt-1 text-[10px] font-semibold text-zinc-400 group-hover:text-black transition">
                    Explore &rarr;
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
