"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const steps = [
  {
    label: "BAG",
    path: "/checkout/bag",
  },
  {
    label: "PAYMENT",
    path: "/checkout/payment",
  },
];

export default function CheckoutHeader() {
  const pathname = usePathname();

  const currentStep = steps.findIndex((step) => pathname === step.path);

  return (
    <header className="bg-brand-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-wide">
          NILECART
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {steps.map((step, index) => (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <span
                  className={`text-sm font-semibold tracking-wider ${
                    index <= currentStep ? "text-green-600" : "text-brand-gray"
                  }`}
                >
                  {step.label}
                </span>

                <div
                  className={`mt-2 h-[2px] w-16 ${
                    index <= currentStep ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
              </div>

              {index !== steps.length - 1 && (
                <div className="w-12 h-[2px] bg-gray-300 mx-3 mt-1" />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheck size={18} className="text-green-600" />
          <span className="uppercase tracking-wider">100% Secure</span>
        </div>
      </div>
    </header>
  );
}
