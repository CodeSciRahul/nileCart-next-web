"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ACCOUNT_NAV } from "@/lib/accountNav";
import { cn } from "@/lib/utils";

const AccountShell = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-brand-gray">
        Loading your account...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        My Account
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <aside className="lg:w-64 lg:shrink-0">
          <nav className="flex gap-2 overflow-x-auto rounded-xl border border-brand-amber/20 bg-brand-white p-2 shadow-sm lg:flex-col lg:overflow-visible">
            {ACCOUNT_NAV.map(({ href, label, icon: Icon, danger }) => {
              const active = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition whitespace-nowrap",
                    active
                      ? "bg-brand-amber text-foreground shadow-sm"
                      : danger
                        ? "text-red-600 hover:bg-red-50"
                        : "text-foreground hover:bg-brand-cream hover:text-brand-amber"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="rounded-xl border border-brand-amber/20 bg-brand-white p-5 shadow-sm md:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountShell;
