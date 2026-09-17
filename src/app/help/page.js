import Link from "next/link";
import MarketingShell from "@/components/marketing/MarketingShell";
import Reveal from "@/components/motion/Reveal";
import { buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Help & Contact",
  description: `Get help from ${SITE.name} — orders, shipping, returns, and contact.`,
  path: "/help",
});

const TOPICS = [
  {
    title: "Track an order",
    body: "Sign in to view order status and delivery updates.",
    href: "/account/orders",
    label: "Go to orders",
  },
  {
    title: "Manage addresses",
    body: "Add or update shipping addresses for checkout.",
    href: "/account/addresses",
    label: "Addresses",
  },
  {
    title: "Coupons & offers",
    body: "See coupons available on your account.",
    href: "/account/coupons",
    label: "View coupons",
  },
  {
    title: "Account & profile",
    body: "Update your profile or account preferences.",
    href: "/account/profile",
    label: "Open profile",
  },
];

export default function HelpPage() {
  return (
    <MarketingShell>
      <section className="border-b border-border atmosphere-panel py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-amber">
            Support
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Help & contact
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-brand-gray md:text-base">
            Answers and account tools — wired to the same flows you already use
            for orders, addresses, and profile.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-4 md:grid-cols-2">
            {TOPICS.map((topic, index) => (
              <Reveal key={topic.title} delay={Math.min(index * 60, 180)}>
                <Link
                  href={topic.href}
                  className="group block border border-border bg-brand-white/60 p-6 transition hover:border-brand-amber sm:p-8"
                >
                  <h2 className="font-display text-xl font-bold tracking-tight">
                    {topic.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-brand-gray">
                    {topic.body}
                  </p>
                  <span className="mt-5 inline-block text-sm font-semibold text-foreground underline-offset-4 group-hover:underline">
                    {topic.label} →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14 max-w-xl border-t border-border pt-10">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Contact
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-gray md:text-base">
              Email{" "}
              <a
                href="mailto:support@nilescart.com"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                support@nilescart.com
              </a>{" "}
              or call{" "}
              <a
                href="tel:18001234567"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                1800-123-4567
              </a>
              . For account issues, start from your{" "}
              <Link href="/account" className="underline-offset-4 hover:underline">
                account home
              </Link>
              .
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex border border-foreground/20 px-5 py-2.5 text-sm font-semibold transition hover:border-brand-amber"
              >
                About Nilescart
              </Link>
              <Link
                href="/collections"
                className="inline-flex bg-brand-amber px-5 py-2.5 text-sm font-semibold text-brand-ink transition hover:brightness-105"
              >
                Continue shopping
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </MarketingShell>
  );
}
