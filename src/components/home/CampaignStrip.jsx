import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import Reveal from "@/components/motion/Reveal";

const CampaignStrip = ({
  image = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2000&q=80",
  eyebrow = "Curated Campaign",
  title = "Clean Cuts & Statement Looks",
  description = "Explore this season's bold silhouettes and viral streetwear drops.",
  primaryHref = "/collections",
  primaryLabel = "Shop Campaign",
  secondaryHref = "/shop/women",
  secondaryLabel = "Explore Women",
}) => {
  return (
    <section className="relative my-3 md:my-5 overflow-hidden">
      <div className="relative h-[260px] sm:h-[320px] md:h-[380px] w-full">
        <OptimizedImage
          src={image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent"
          aria-hidden
        />

        <div className="relative z-[1] flex h-full items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <Reveal className="max-w-md text-white">
              <span className="inline-block rounded-none bg-brand-amber px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black">
                {eyebrow}
              </span>
              <h2 className="mt-2 font-display text-xl sm:text-2xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                {title}
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-300 line-clamp-2">
                {description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <Link
                  href={primaryHref}
                  className="inline-flex items-center rounded-none bg-brand-amber px-5 py-2 text-xs font-bold uppercase tracking-wider text-black transition hover:brightness-110 active:scale-95"
                >
                  {primaryLabel}
                </Link>
                <Link
                  href={secondaryHref}
                  className="inline-flex items-center rounded-none border border-white/60 bg-black/40 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
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
