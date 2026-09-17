import Link from "next/link";
import MarketingShell from "@/components/marketing/MarketingShell";
import Reveal from "@/components/motion/Reveal";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "About",
  description: `The story behind ${SITE.name} — fashion edited for everyday life.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden border-b border-border">
        <div className="relative min-h-[52vh] md:min-h-[58vh]">
          <OptimizedImage
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 via-brand-ink/40 to-brand-ink/25"
            aria-hidden
          />
          <div className="relative z-[1] flex min-h-[52vh] items-end md:min-h-[58vh]">
            <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-28 sm:px-6 md:pb-16">
              <p className="hero-enter-brand font-display text-5xl font-extrabold tracking-tight text-brand-white sm:text-6xl md:text-7xl">
                nilescart
              </p>
              <h1 className="hero-enter-copy mt-4 max-w-xl font-display text-xl font-semibold text-brand-white/95 sm:text-2xl">
                Fashion, edited for everyday
              </h1>
              <p className="hero-enter-copy mt-3 max-w-md text-sm text-brand-white/75 sm:text-base">
                We build a storefront that feels like a lookbook — clear, bold,
                and easy to shop.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-amber">
              Our approach
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Less noise. More wardrobe.
            </h2>
          </Reveal>
          <Reveal delay={80} className="space-y-5 text-base leading-relaxed text-brand-gray md:col-span-7 md:text-lg">
            <p>
              Nilescart is built for people who want fashion without the
              dashboard clutter — strong imagery, honest categories, and a path
              from inspiration to bag.
            </p>
            <p>
              From men and women to kids, beauty, and home, every department is a
              doorway into curated products powered by the same catalog you
              already shop on the site.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/collections"
                className="inline-flex bg-brand-amber px-6 py-3 text-sm font-semibold text-brand-ink transition hover:brightness-105"
              >
                Browse collections
              </Link>
              <Link
                href="/help"
                className="inline-flex border border-foreground/20 px-6 py-3 text-sm font-semibold transition hover:border-brand-amber"
              >
                Get help
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </MarketingShell>
  );
}
