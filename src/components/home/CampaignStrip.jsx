import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import Reveal from "@/components/motion/Reveal";

const CampaignStrip = ({
  image = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2000&q=80",
  eyebrow = "Campaign",
  title = "Soft light. Strong silhouettes.",
  description = "A season of clean lines and warm tones — explore the lookbook, then shop the pieces.",
  primaryHref = "/lookbook",
  primaryLabel = "Open lookbook",
  secondaryHref = "/shop/women",
  secondaryLabel = "Shop women",
}) => {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[70vh] w-full md:min-h-[62vh]">
        <OptimizedImage
          src={image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-brand-ink/75 via-brand-ink/45 to-brand-ink/20"
          aria-hidden
        />

        <div className="relative z-[1] flex min-h-[70vh] items-center md:min-h-[62vh]">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-20">
            <Reveal className="max-w-lg text-brand-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-amber">
                {eyebrow}
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                {title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-brand-white/80 sm:text-base">
                {description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={primaryHref}
                  className="inline-flex bg-brand-amber px-6 py-3 text-sm font-semibold text-brand-ink transition hover:brightness-105"
                >
                  {primaryLabel}
                </Link>
                <Link
                  href={secondaryHref}
                  className="inline-flex border border-brand-white/50 px-6 py-3 text-sm font-semibold text-brand-white transition hover:bg-brand-white/10"
                >
                  {secondaryLabel}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignStrip;
