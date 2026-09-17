import Link from "next/link";
import MarketingShell from "@/components/marketing/MarketingShell";
import Reveal from "@/components/motion/Reveal";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Lookbook",
  description: `${SITE.name} lookbook — seasonal campaign imagery and shoppable edits.`,
  path: "/lookbook",
});

const FRAMES = [
  {
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80",
    title: "City light",
    href: "/shop/women",
    label: "Shop women",
  },
  {
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80",
    title: "Layered ease",
    href: "/shop/men",
    label: "Shop men",
  },
  {
    src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1400&q=80",
    title: "Weekend line",
    href: "/collections",
    label: "All collections",
  },
  {
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=80",
    title: "Warm neutrals",
    href: "/shop/accessories",
    label: "Accessories",
  },
];

export default function LookbookPage() {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden">
        <div className="relative min-h-[70vh] md:min-h-[78vh]">
          <OptimizedImage
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2200&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-ken-burns object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-ink/75 via-brand-ink/30 to-brand-ink/20"
            aria-hidden
          />
          <div className="relative z-[1] flex min-h-[70vh] items-end md:min-h-[78vh]">
            <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-28 sm:px-6 md:pb-20">
              <p className="hero-enter-brand font-display text-5xl font-extrabold tracking-tight text-brand-white sm:text-6xl md:text-7xl">
                nilescart
              </p>
              <h1 className="hero-enter-copy mt-4 font-display text-xl font-semibold text-brand-white sm:text-2xl">
                Lookbook — soft light, strong silhouettes
              </h1>
              <p className="hero-enter-copy mt-3 max-w-md text-sm text-brand-white/75 sm:text-base">
                Campaign frames that lead back into live departments and
                collections.
              </p>
              <div className="hero-enter-cta mt-8">
                <Link
                  href="/collections"
                  className="inline-flex bg-brand-amber px-6 py-3 text-sm font-semibold text-brand-ink transition hover:brightness-105"
                >
                  Shop the edit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mb-10 max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-amber">
              Frames
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              One story per frame
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {FRAMES.map((frame, index) => (
              <Reveal key={frame.title} delay={Math.min(index * 70, 210)}>
                <Link
                  href={frame.href}
                  className="group relative block aspect-[4/5] overflow-hidden bg-brand-sand sm:aspect-[3/4]"
                >
                  <OptimizedImage
                    src={frame.src}
                    alt={frame.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="img-zoom object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-brand-ink/70 via-transparent to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-2xl font-bold text-brand-white">
                      {frame.title}
                    </h3>
                    <span className="mt-2 inline-block text-sm font-medium text-brand-white/85 underline-offset-4 group-hover:underline">
                      {frame.label}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
