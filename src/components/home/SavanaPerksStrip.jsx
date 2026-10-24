import { Truck, Banknote, RotateCcw, Sparkles } from "lucide-react";

const PERKS = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On all orders over ₹790",
  },
  {
    icon: Banknote,
    title: "Cash on Delivery",
    subtitle: "Pay at your doorstep",
  },
  {
    icon: RotateCcw,
    title: "Easy 7-Day Returns",
    subtitle: "Hassle-free doorstep pickup",
  },
  {
    icon: Sparkles,
    title: "100K+ Trendy Styles",
    subtitle: "Fresh fast-fashion drops daily",
  },
];

export default function SavanaPerksStrip() {
  return (
    <section className="border-y border-border/60 bg-zinc-50/80 py-4 sm:py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {PERKS.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 py-1"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-amber/15 text-foreground ring-1 ring-brand-amber/30">
                  <Icon size={18} className="text-foreground" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-tight truncate">
                    {perk.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 truncate">
                    {perk.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
