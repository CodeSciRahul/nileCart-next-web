import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import {
  BadgeCheck,
  ChevronRight,
  MapPin,
  Package,
  ShieldCheck,
  Star,
  Store,
} from "lucide-react";

/**
 * Marketplace-style "Sold by" store card (Myntra / Meesho / Amazon pattern).
 * Shows seller identity, rating, trust chips, and a Visit Store CTA.
 */
export default function ProductStoreSection({ seller }) {
  if (!seller?.storeName) return null;

  const logoUrl =
    typeof seller.logo === "string" ? seller.logo : seller.logo?.url;
  const ratingAvg = Number(seller.rating?.average) || 0;
  const ratingCount = Number(seller.rating?.count) || 0;
  const isVerified = seller.approvalStatus === "Approved";
  const location = [seller.address?.city, seller.address?.state]
    .filter(Boolean)
    .join(", ");
  const storeHref = seller.storeSlug
    ? `/store/${seller.storeSlug}`
    : seller._id
      ? `/search?seller=${seller._id}`
      : null;
  const initial = seller.storeName.charAt(0).toUpperCase();

  return (
    <section
      id="store"
      aria-labelledby="store-heading"
      className="scroll-mt-28 border-t border-brand-amber/15 py-12 sm:py-14"
    >
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gray">
          Marketplace seller
        </p>
        <h2
          id="store-heading"
          className="mt-1 text-xl font-black tracking-tight sm:text-2xl"
        >
          Sold by
        </h2>
      </div>

      <div className="overflow-hidden border border-brand-amber/25 bg-brand-white">
        {/* Header strip */}
        <div className="flex flex-col gap-5 border-b border-brand-amber/15 bg-linear-to-r from-brand-cream/60 via-brand-white to-brand-cream/30 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-start gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden border border-brand-amber/25 bg-[#FFECB3] sm:size-20">
              {logoUrl ? (
                <OptimizedImage
                  src={logoUrl}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="flex size-full items-center justify-center text-2xl font-black text-foreground">
                  {initial}
                </span>
              )}
              {isVerified && (
                <span
                  className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-emerald-600 text-brand-white ring-2 ring-brand-white"
                  title="Verified seller"
                >
                  <BadgeCheck size={14} />
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-lg font-black tracking-tight text-foreground sm:text-xl">
                  {seller.storeName}
                </h3>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
                    <ShieldCheck size={12} />
                    Verified
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5 bg-brand-cream/80 px-2 py-0.5 font-bold tabular-nums ring-1 ring-brand-amber/25">
                  <Star
                    size={13}
                    fill="currentColor"
                    className="text-brand-amber"
                  />
                  {ratingAvg > 0 ? ratingAvg.toFixed(1) : "New"}
                </span>
                <span className="text-brand-gray">
                  {ratingCount > 0
                    ? `${ratingCount.toLocaleString("en-IN")} store ratings`
                    : "No ratings yet"}
                </span>
              </div>

              {location && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-brand-gray">
                  <MapPin size={12} className="shrink-0 text-brand-amber" />
                  {location}
                </p>
              )}
            </div>
          </div>

          {storeHref && (
            <Link
              href={storeHref}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 bg-brand-amber px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground transition hover:bg-brand-amber/90"
            >
              <Store size={15} />
              Visit Store
              <ChevronRight size={14} />
            </Link>
          )}
        </div>

        {/* Body */}
        <div className="grid gap-6 p-5 sm:grid-cols-[1.4fr_1fr] sm:p-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gray">
              About the store
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-brand-gray">
              {seller.description?.trim() ||
                `${seller.storeName} is a Nilescart marketplace seller offering curated fashion and lifestyle products. Shop with confidence — every listing is quality-checked before it goes live.`}
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-gray">
              Why shop here
            </h4>
            <ul className="space-y-2.5">
              {[
                {
                  icon: BadgeCheck,
                  title: "Genuine products",
                  text: "Sourced and listed by an approved seller",
                },
                {
                  icon: Package,
                  title: "Fulfilled by seller",
                  text: "Packed and shipped from the store",
                },
                {
                  icon: ShieldCheck,
                  title: "Buyer protection",
                  text: "Easy returns on eligible orders",
                },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center bg-brand-cream text-foreground ring-1 ring-brand-amber/20">
                    <Icon size={15} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{title}</p>
                    <p className="text-xs text-brand-gray">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
