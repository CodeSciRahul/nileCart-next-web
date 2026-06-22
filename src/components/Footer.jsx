import Link from "next/link";
import { MapPin, Phone, Mail, CreditCard } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo.jsx";
import { DEPARTMENT_LABELS, DEPARTMENT_ORDER } from "@/constant/index.js";

function SocialIcon({ name }) {
  const className = "h-4 w-4";

  if (name === "instagram") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === "facebook") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M13.5 9.5V7.75c0-.69.56-1.25 1.25-1.25H16V4h-2.25A3.75 3.75 0 0010 7.75V9.5H8v3h2V20h3.5v-7.5H16l.5-3h-3z" />
      </svg>
    );
  }
  if (name === "twitter") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 3H21.5l-7.5 8.574L22 21h-6.594l-5.156-6.74L4.75 21H1.5l8.063-9.218L2 3h6.75l4.656 6.168L18.244 3zm-2.313 16.2h1.75L7.97 4.684H6.125L15.93 19.2z" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.8 8.001a2.749 2.749 0 00-1.94-1.94C18.28 6 12 6 12 6s-6.28 0-7.86.061A2.749 2.749 0 002.2 8.001 28.61 28.61 0 002 12c0 1.33.077 2.64.2 3.999a2.749 2.749 0 001.94 1.94C5.72 18 12 18 12 18s6.28 0 7.86-.061a2.749 2.749 0 001.94-1.94c.123-1.359.2-2.669.2-3.999 0-1.33-.077-2.64-.2-3.999zM10 15.001V9l5.2 3-5.2 3z" />
    </svg>
  );
}

const FOOTER_LINKS = {
  help: [
    { label: "Customer Support", href: "/account" },
    { label: "Track Order", href: "/account/orders" },
    { label: "Returns & Refunds", href: "#" },
    { label: "Shipping Info", href: "#" },
    { label: "FAQs", href: "#" },
  ],
  company: [
    { label: "About NileCart", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Become a Seller", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  policies: [
    { label: "Terms of Use", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Grievance Redressal", href: "#" },
  ],
};

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "Twitter", href: "#", icon: "twitter" },
  { label: "YouTube", href: "#", icon: "youtube" },
];

function FooterLinkColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-amber">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-brand-gray transition hover:text-brand-amber"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-amber/20 bg-gradient-to-b from-brand-cream/50 via-brand-white to-brand-cream/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-10">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <BrandLogo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-gray">
              Your destination for trendy fashion — curated styles for men, women, kids, and more.
            </p>
            <div className="mt-5 space-y-2.5 text-sm text-brand-gray">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0 text-brand-amber" />
                Mumbai, Maharashtra, India
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-brand-amber" />
                1800-123-4567
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-brand-amber" />
                support@nilecart.com
              </p>
            </div>
          </div>

          <FooterLinkColumn
            title="Shop"
            links={DEPARTMENT_ORDER.map((key) => ({
              label: DEPARTMENT_LABELS[key],
              href: `/shop/${key}`,
            }))}
          />
          <FooterLinkColumn title="Help" links={FOOTER_LINKS.help} />
          <FooterLinkColumn title="Company" links={FOOTER_LINKS.company} />
          <FooterLinkColumn title="Policies" links={FOOTER_LINKS.policies} />
        </div>

        {/* Department chips */}
        <div className="mt-10 border-t border-brand-amber/15 pt-8 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-amber">
            Popular categories
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {DEPARTMENT_ORDER.map((key) => (
              <Link
                key={key}
                href={`/shop/${key}`}
                className="rounded-full border border-brand-amber/20 bg-brand-cream/60 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-brand-amber hover:bg-brand-amber hover:text-foreground"
              >
                {DEPARTMENT_LABELS[key]}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-amber/20 bg-gradient-to-r from-brand-cream via-brand-white to-brand-cream">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6">
          <p className="text-center text-xs text-brand-gray sm:text-left">
            © {new Date().getFullYear()} NileCart Fashion Pvt. Ltd. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-cream/50 text-foreground ring-1 ring-brand-amber/10 transition hover:bg-brand-amber/15 hover:text-brand-amber hover:ring-brand-amber/25"
              >
                <SocialIcon name={icon} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 text-brand-gray">
            <CreditCard size={16} className="text-brand-amber" />
            <span className="text-xs">Visa · Mastercard · UPI · COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
