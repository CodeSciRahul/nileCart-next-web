import Header from "@/components/header";
import Footer from "@/components/Footer";

/**
 * Shared chrome for marketing pages — preserves site header/footer.
 */
export default function MarketingShell({
  children,
  announcement = null,
  className = "",
}) {
  return (
    <div className={`flex min-h-screen flex-col ${className}`}>
      <Header announcement={announcement} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
