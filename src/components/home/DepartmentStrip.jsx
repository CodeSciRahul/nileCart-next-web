import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import { DEPARTMENT_LABELS, DEPARTMENT_ORDER } from "@/constant/index.js";

/**
 * Full-bleed department storytelling — interactive links, no card chrome.
 */
export default function DepartmentStrip() {
  return (
    <section className="border-y border-border/70 atmosphere-panel py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-10 max-w-xl md:mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-amber">
            Departments
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Start where you shop
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-gray md:text-base">
            Jump into a department — then refine by category on the shop floor.
          </p>
        </Reveal>

        <ul className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {DEPARTMENT_ORDER.map((key, index) => (
            <li key={key}>
              <Reveal delay={Math.min(index * 50, 250)}>
                <Link
                  href={`/shop/${key}`}
                  className="group flex items-baseline justify-between border-t border-foreground/10 px-1 py-5 transition hover:border-brand-amber sm:px-2"
                >
                  <span className="font-display text-2xl font-semibold tracking-tight text-foreground transition group-hover:text-brand-ink md:text-3xl">
                    {DEPARTMENT_LABELS[key]}
                  </span>
                  <span className="text-sm font-medium text-brand-stone transition group-hover:text-brand-amber">
                    Shop →
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
