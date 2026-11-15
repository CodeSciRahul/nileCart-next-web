"use client";

import Link from "next/link";
import { ChevronUp, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplyCode = () => {
    toast.success("Coupon FRESH20 copied! Use it at checkout for 20% off.");
  };

  return (
    <>
      <footer className="bg-white border-t border-neutral-200 py-10 text-xs text-neutral-600 mt-auto">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-neutral-100">
            <div>
              <h4 className="text-black font-bold uppercase tracking-wider mb-3">
                Customer Care
              </h4>
              <ul className="space-y-2 text-neutral-500">
                <li>
                  <Link href="/account/orders" className="hover:text-black">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-black">
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-black">
                    Easy Returns
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-black">
                    Shipping Info
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-black font-bold uppercase tracking-wider mb-3">
                Shop Categories
              </h4>
              <ul className="space-y-2 text-neutral-500">
                <li>
                  <Link href="/shop/tops" className="hover:text-black">
                    Tops & Knits
                  </Link>
                </li>
                <li>
                  <Link href="/shop/dresses" className="hover:text-black">
                    Dresses
                  </Link>
                </li>
                <li>
                  <Link href="/shop/co-ords" className="hover:text-black">
                    Co-Ords & Sets
                  </Link>
                </li>
                <li>
                  <Link href="/shop/jackets" className="hover:text-black">
                    Jackets & Outerwear
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-black font-bold uppercase tracking-wider mb-3">
                Brand & Trust
              </h4>
              <ul className="space-y-2 text-neutral-500">
                <li>
                  <Link href="/about" className="hover:text-black">
                    About NILESCART
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-black">
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-black">
                    Authentic Quality
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-black">
                    Terms & Privacy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-black font-bold uppercase tracking-wider mb-3">
                Special Offer
              </h4>
              <p className="text-neutral-500 leading-relaxed mb-3">
                Use coupon <strong>FRESH20</strong> or <strong>NILES20</strong> at checkout for 20% off your purchase.
              </p>
              <button
                type="button"
                onClick={handleApplyCode}
                className="px-4 py-2 bg-black text-white rounded text-xs font-bold hover:bg-neutral-800 transition-colors"
              >
                Apply 20% Off Code
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
            <p>© {new Date().getFullYear()} NILESCART. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              <span>UPI</span>
              <span>Credit & Debit Cards</span>
              <span>Net Banking</span>
              <span>Cash on Delivery</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons matching Reference UI */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-30 flex flex-col items-center gap-2.5">
        <button
          type="button"
          onClick={scrollToTop}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-neutral-200 flex items-center justify-center text-neutral-800 hover:bg-neutral-50 transition-transform hover:-translate-y-0.5 active:scale-95"
          aria-label="Scroll to top"
          title="Back to top"
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
        </button>

        <button
          type="button"
          onClick={() =>
            toast.info("NILESCART Style Advisor: Ask our stylist for size & outfit recommendations!")
          }
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform active:scale-95"
          aria-label="Style Assistant"
          title="NILESCART Styling Assistant"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </>
  );
}
