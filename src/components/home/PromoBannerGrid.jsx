import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";

const FALLBACK_CAMPAIGN = {
  title: "NEW ARRIVALS FROM ₹ 390",
  eyebrow: "Autumn / Winter 2026 Collection",
  ctaText: "Shop Collection",
  ctaLink: "/shop/all",
  image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80",
};

export default function PromoBannerGrid({ banner = null }) {
  const currentBanner = banner || FALLBACK_CAMPAIGN;
  const imageSrc =
    (typeof currentBanner.image === "string"
      ? currentBanner.image
      : currentBanner.image?.url) || FALLBACK_CAMPAIGN.image;

  const href = currentBanner.ctaLink || currentBanner.ctaHref || "/shop/all";
  const title = currentBanner.title || FALLBACK_CAMPAIGN.title;
  const eyebrow = currentBanner.subtitle || currentBanner.eyebrow || FALLBACK_CAMPAIGN.eyebrow;
  const ctaText = currentBanner.ctaText || FALLBACK_CAMPAIGN.ctaText;

  return (
    <section className="w-full bg-white py-4 md:py-6">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
        <Link
          href={href}
          className="relative block w-full overflow-hidden rounded-xs cursor-pointer shadow-xs group"
        >
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/7] overflow-hidden bg-neutral-900">
            <OptimizedImage
              src={imageSrc}
              alt={title}
              fill
              sizes="100vw"
              className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-[1.008]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute left-6 md:left-12 bottom-6 md:bottom-10 text-white max-w-md">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#fdd835]">
                {eyebrow}
              </span>
              <h3 className="text-xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white mt-1 mb-3">
                {title}
              </h3>
              <span className="px-5 py-2 bg-white text-black text-xs font-extrabold uppercase rounded-full shadow-md hover:bg-neutral-100 transition-colors inline-block">
                {ctaText}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
