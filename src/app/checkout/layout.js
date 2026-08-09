import CheckoutHeader from "@/components/checkoutHeader";

export const metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-b from-brand-cream/80 via-brand-cream/40 to-brand-white">
      <CheckoutHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>
    </div>
  );
}
