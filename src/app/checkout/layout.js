import CheckoutHeader from "@/components/checkoutHeader";

export default function CheckoutLayout({ children }) {
  return (
    <div className="min-h-screen bg-brand-cream">
      <CheckoutHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
