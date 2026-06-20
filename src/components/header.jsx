"use client";

import { useState, useRef, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Menu, User, Heart, ShoppingBag, X, Truck, Zap, PackageCheck } from "lucide-react";
import ProfileMenu from "@/components/account/ProfileMenu";
import UserAvatar from "@/components/account/UserAvatar";
import { BrandLogo } from "@/components/BrandLogo.jsx";
import { HeaderSearch } from "@/components/HeaderSearch.jsx";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { getCategoryNavigation } from "@/services/categoryService.js";
import { mapNavDepartments, getDepartmentNav } from "@/lib/categoryHelpers.js";
import { DepartmentNavItem } from "@/components/DepartmentNavItem.jsx";
import { MobileCategorySidebar } from "@/components/MobileCategorySidebar.jsx";
import { DEPARTMENT_LABELS, DEPARTMENT_ORDER } from "@/constant/index.js";

const ANNOUNCEMENT_KEY = "nilecart-announcement-dismissed";
const ANNOUNCEMENT_TEXT =
  "🎉 Anniversary Sale • Up To 80% OFF + Free Shipping Above ₹999";

function HeaderIconButton({ href, onClick, label, children, badge }) {
  const className =
    "relative flex h-9 w-9 items-center justify-center rounded-full bg-brand-cream/50 text-foreground ring-1 ring-brand-amber/10 transition hover:bg-brand-amber/15 hover:text-brand-amber hover:ring-brand-amber/25 sm:h-10 sm:w-10";

  const content = (
    <>
      {children}
      {badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-amber px-1 text-[9px] font-bold text-foreground sm:h-[18px] sm:min-w-[18px] sm:text-[10px]">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className} aria-label={label}>
      {content}
    </button>
  );
}

const Header = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState(null);
  const [pinnedDepartment, setPinnedDepartment] = useState(null);
  const [mobileDepartment, setMobileDepartment] = useState(null);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const userMenuRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const { data: cartItemCount = 0 } = useCart();
  const { data: wishlistData } = useWishlist();
  const wishlistCount = wishlistData?.count ?? 0;

  const { data: navData, isLoading: navLoading } = useQuery({
    queryKey: ["categories", "navigation"],
    queryFn: getCategoryNavigation,
    staleTime: 5 * 60 * 1000,
  });

  const navDepartments = useMemo(
    () => mapNavDepartments(navData?.departments),
    [navData?.departments]
  );

  useEffect(() => {
    if (pathname !== "/") {
      setShowAnnouncement(false);
      return;
    }
    setShowAnnouncement(sessionStorage.getItem(ANNOUNCEMENT_KEY) !== "1");
  }, [pathname]);

  useEffect(() => {
    if (!mobileDepartment && DEPARTMENT_ORDER.length > 0) {
      setMobileDepartment(DEPARTMENT_ORDER[0]);
    }
  }, [mobileDepartment]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (
        pinnedDepartment &&
        !e.target.closest("[data-dept-nav]") &&
        !e.target.closest("[data-dept-popover]")
      ) {
        setPinnedDepartment(null);
        setActiveDepartment(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pinnedDepartment]);

  const dismissAnnouncement = () => {
    sessionStorage.setItem(ANNOUNCEMENT_KEY, "1");
    setShowAnnouncement(false);
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    router.push("/auth");
  };

  const selectMobileDepartment = (key) => {
    setMobileDepartment(key);
  };

  const closeDepartmentNav = () => {
    setPinnedDepartment(null);
    setActiveDepartment(null);
  };

  const handleDepartmentOpen = (key) => {
    setActiveDepartment(key);
  };

  const handleDepartmentClose = () => {
    if (pinnedDepartment) return;
    setActiveDepartment(null);
  };

  const handleDepartmentClick = (e, key) => {
    e.preventDefault();
    if (pinnedDepartment === key && activeDepartment === key) {
      closeDepartmentNav();
    } else {
      setPinnedDepartment(key);
      setActiveDepartment(key);
    }
  };

  const renderDepartmentDropdown = () =>
    DEPARTMENT_ORDER.map((key) => {
      const label = DEPARTMENT_LABELS[key];
      const deptNav = getDepartmentNav(navDepartments, key, label);
      const shopHref = deptNav.slug ? `/shop/${deptNav.slug}` : `/shop/${key}`;

      return (
        <DepartmentNavItem
          key={key}
          deptKey={key}
          label={label}
          shopHref={shopHref}
          deptNav={deptNav}
          isActive={activeDepartment === key}
          isPinned={pinnedDepartment === key}
          onOpen={() => handleDepartmentOpen(key)}
          onClose={handleDepartmentClose}
          onToggleClick={(e) => handleDepartmentClick(e, key)}
          onNavigate={closeDepartmentNav}
          isLoading={navLoading}
        />
      );
    });

  return (
    <>
      {showAnnouncement && (
        <div className="relative bg-gradient-to-r from-brand-amber via-amber-400 to-brand-amber py-2 pl-4 pr-10 text-center text-xs font-medium text-foreground md:text-sm">
          <p className="truncate">{ANNOUNCEMENT_TEXT}</p>
          <button
            type="button"
            onClick={dismissAnnouncement}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-foreground/80 transition hover:bg-black/10 hover:text-foreground"
            aria-label="Dismiss announcement"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-50 w-full bg-brand-white/95 shadow-sm backdrop-blur-md">
        <div className="border-b border-brand-amber/10 bg-gradient-to-r from-brand-cream via-brand-white to-brand-cream">
          <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6">
            {/* Logo + mobile menu */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="shrink-0 rounded-full p-2 text-foreground transition hover:bg-brand-cream hover:text-brand-amber lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
              <BrandLogo className="min-w-0" />
            </div>

            {/* Departments — inline on desktop */}
            <nav
              className="hidden shrink-0 items-center gap-0 overflow-visible lg:flex"
              aria-label="Shop by department"
            >
              {renderDepartmentDropdown()}
            </nav>

            {/* Search — grows to fill remaining space */}
            <Suspense fallback={null}>
              <div className="min-w-0 flex-1">
                <HeaderSearch className="h-9 w-full sm:h-10" />
              </div>
            </Suspense>

            {/* Account + cart */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 lg:gap-2">
              <div className="relative" ref={userMenuRef}>
                {isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className="flex cursor-pointer items-center gap-2 rounded-full bg-brand-cream/50 py-1 pl-1 pr-2.5 ring-1 ring-brand-amber/10 transition hover:bg-brand-amber/15 hover:ring-brand-amber/25 sm:pr-3"
                      aria-label="Account menu"
                      aria-expanded={userMenuOpen}
                    >
                      <UserAvatar user={user} size="sm" />
                      <span className="hidden max-w-[88px] truncate text-xs font-medium text-foreground xl:block">
                        {user?.name || "Account"}
                      </span>
                    </button>
                    <ProfileMenu
                      open={userMenuOpen}
                      onClose={() => setUserMenuOpen(false)}
                      onLogout={handleLogout}
                    />
                  </>
                ) : (
                  <Link
                    href="/auth"
                    className="flex items-center gap-1.5 rounded-full bg-brand-cream/50 px-2.5 py-1.5 text-foreground ring-1 ring-brand-amber/10 transition hover:bg-brand-amber/15 hover:text-brand-amber hover:ring-brand-amber/25 sm:px-3"
                    aria-label={authLoading ? "Loading account" : "Login"}
                  >
                    <User size={18} className="sm:h-5 sm:w-5" />
                    <span className="hidden text-xs font-semibold sm:inline sm:text-sm">Login</span>
                  </Link>
                )}
              </div>

              <HeaderIconButton
                href="/wishlist"
                label={wishlistCount > 0 ? `Wishlist, ${wishlistCount} items` : "Wishlist"}
                badge={wishlistCount}
              >
                <Heart size={18} className="sm:h-5 sm:w-5" />
              </HeaderIconButton>

              <HeaderIconButton
                onClick={() => router.push("/checkout/bag")}
                label={
                  cartItemCount > 0
                    ? `Shopping bag, ${cartItemCount} items`
                    : "Shopping bag"
                }
                badge={cartItemCount}
              >
                <ShoppingBag size={18} className="sm:h-5 sm:w-5" />
              </HeaderIconButton>
            </div>
          </div>
        </div>

        {/* Benefits bar */}
        <div className="border-b border-brand-amber/10 bg-gradient-to-b from-[#fffdf8] to-brand-white">
          <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6">
            <div className="grid grid-cols-3 divide-x divide-brand-amber/10 text-center">
              <div className="flex items-center justify-center gap-2 px-1 sm:gap-2.5 sm:px-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-amber/10 ring-1 ring-brand-amber/15 sm:h-9 sm:w-9">
                  <PackageCheck size={16} className="text-brand-amber sm:h-[18px] sm:w-[18px]" />
                </span>
                <div className="min-w-0 text-left sm:text-center">
                  <p className="text-[11px] font-bold text-foreground md:text-sm">Easy Returns</p>
                  <p className="hidden text-xs text-brand-gray md:block">Free Pick Up</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 px-1 sm:gap-2.5 sm:px-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-amber/10 ring-1 ring-brand-amber/15 sm:h-9 sm:w-9">
                  <Zap size={16} className="text-brand-amber sm:h-[18px] sm:w-[18px]" />
                </span>
                <div className="min-w-0 text-left sm:text-center">
                  <p className="text-[11px] font-bold text-foreground md:text-sm">Fast Delivery</p>
                  <p className="hidden text-xs text-brand-gray md:block">10000+ Styles</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 px-1 sm:gap-2.5 sm:px-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-amber/10 ring-1 ring-brand-amber/15 sm:h-9 sm:w-9">
                  <Truck size={16} className="text-brand-amber sm:h-[18px] sm:w-[18px]" />
                </span>
                <div className="min-w-0 text-left sm:text-center">
                  <p className="text-[11px] font-bold text-foreground md:text-sm">Free Shipping</p>
                  <p className="hidden text-xs text-brand-gray md:block">Above ₹999</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`fixed inset-0 z-[100] h-screen transition-all duration-300 lg:hidden ${
            open ? "visible bg-black/40" : "invisible"
          }`}
          onClick={() => setOpen(false)}
        >
          <div
            className={`absolute left-0 top-0 flex h-full w-[min(100vw,400px)] flex-col bg-brand-white shadow-xl transition-transform duration-300 ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-brand-amber/20 px-4 py-4">
              <BrandLogo compact />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-foreground transition-colors hover:bg-brand-cream hover:text-brand-amber"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <div className="shrink-0 border-b border-brand-amber/20 px-4 py-3">
              <Suspense fallback={null}>
                <HeaderSearch className="h-10 w-full" />
              </Suspense>
            </div>

            <div className="min-h-0 flex-1">
              {mobileDepartment && (
                <MobileCategorySidebar
                  navDepartments={navDepartments}
                  selectedKey={mobileDepartment}
                  onSelectDepartment={selectMobileDepartment}
                  onNavigate={() => setOpen(false)}
                  isLoading={navLoading}
                />
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
