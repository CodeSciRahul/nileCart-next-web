"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Menu,
  Search,
  User,
  Heart,
  ShoppingBag,
  X,
  Truck,
  Zap,
  PackageCheck,
  ChevronDown,
} from "lucide-react";
import ProfileMenu from "@/components/account/ProfileMenu";
import UserAvatar from "@/components/account/UserAvatar";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { getCategoryNavigation } from "@/services/categoryService.js";
import { mapNavDepartments, getDepartmentNav } from "@/lib/categoryHelpers.js";
import { DepartmentCategoryNav } from "@/components/DepartmentCategoryNav.jsx";
import { MobileCategorySidebar } from "@/components/MobileCategorySidebar.jsx";
import { DEPARTMENT_LABELS, DEPARTMENT_ORDER } from "@/constant/index.js";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState(null);
  const [mobileDepartment, setMobileDepartment] = useState(null);
  const userMenuRef = useRef(null);
  const router = useRouter();
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
    if (!mobileDepartment && DEPARTMENT_ORDER.length > 0) {
      setMobileDepartment(DEPARTMENT_ORDER[0]);
    }
  }, [mobileDepartment]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    router.push("/auth");
  };

  const selectMobileDepartment = (key) => {
    setMobileDepartment(key);
  };

  const renderDepartmentDropdown = (variant = "desktop") => {
    const isCompact = variant === "compact";

    return DEPARTMENT_ORDER.map((key) => {
      const label = DEPARTMENT_LABELS[key];
      const deptNav = getDepartmentNav(navDepartments, key, label);
      const isActive = activeDepartment === key;
      const closeNav = () => setActiveDepartment(null);

      return (
        <div
          key={key}
          className="relative"
          onMouseEnter={() => !isCompact && setActiveDepartment(key)}
          onMouseLeave={() => !isCompact && setActiveDepartment(null)}
        >
          <Link
            href={`#`}
            onClick={closeNav}
            className={`flex items-center gap-1 font-bold tracking-wide transition ${isCompact
                ? "rounded-full px-3 py-1.5 text-xs"
                : "px-2 py-1 text-sm"
              } ${isActive
                ? "bg-brand-amber text-foreground"
                : "text-foreground hover:bg-brand-cream hover:text-brand-amber"
              }`}
          >
            {label}
            {!isCompact && (
              <ChevronDown
                size={14}
                className={`transition-transform ${isActive ? "rotate-180" : ""}`}
              />
            )}
          </Link>

          {isActive && !isCompact && (
            <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 lg:left-0 lg:translate-x-0">
              <div className="animate-in fade-in slide-in-from-top-1 duration-200 w-[min(92vw,720px)] overflow-hidden rounded-2xl border border-brand-amber/20 bg-brand-white/95 shadow-2xl shadow-brand-amber/10 backdrop-blur-md">
                <DepartmentCategoryNav
                  categories={deptNav.categories}
                  departmentLabel={label}
                  departmentSlug={deptNav.slug || key}
                  onNavigate={closeNav}
                  variant="popover"
                  isLoading={navLoading}
                />
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-brand-amber via-amber-400 to-brand-amber text-foreground text-center py-2 text-xs md:text-sm font-medium">
        🎉 Anniversary Sale • Up To 80% OFF + Free Shipping Above ₹999
      </div>

      <header className="sticky top-0 z-50 bg-brand-white/95 backdrop-blur-md shadow-sm w-full">
        {/* Main Header */}
        <div className="mx-auto">
          <div className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 bg-gradient-to-r from-brand-cream via-brand-white to-brand-cream">
            {/* Left Side */}
            <div className="flex flex-1 items-center gap-3 md:gap-4 lg:max-w-2xl">
              <button
                onClick={() => setOpen(true)}
                className="text-foreground hover:text-brand-amber transition lg:hidden"
              >
                <Menu size={28} />
              </button>

              <div className="hidden items-center gap-1 md:flex">
                {renderDepartmentDropdown("desktop")}
              </div>

              <div className="flex items-center gap-2 md:hidden">
                {renderDepartmentDropdown("compact")}
              </div>

              {/* <div className="hidden min-w-0 flex-1 items-center rounded-full border border-brand-amber/20 bg-brand-cream px-4 py-2 md:flex">
                <Search size={18} className="shrink-0 text-brand-amber" />

                <input
                  type="text"
                  placeholder="Search dresses, tops, beauty..."
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-brand-gray"
                />
              </div> */}

              {/* Mobile Search Icon */}
              {/* <button className="md:hidden">
                <Search
                  size={24}
                  className="text-foreground hover:text-brand-amber"
                />
              </button> */}
            </div>

            {/* Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-brand-amber via-amber-400 to-brand-amber bg-clip-text text-transparent">
                  NILECART
                </span>
              </h1>
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-3 md:gap-5">
              <div className="relative" ref={userMenuRef}>
                {isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className="flex items-center gap-2 cursor-pointer text-foreground hover:text-brand-amber transition-all"
                      aria-label="Account menu"
                      aria-expanded={userMenuOpen}
                    >
                      <UserAvatar user={user} size="sm" />
                      <span className="hidden md:block text-sm font-medium max-w-[100px] truncate">
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
                    className="flex items-center gap-1 text-foreground hover:text-brand-amber transition-all"
                    aria-label={authLoading ? "Loading account" : "Login"}
                  >
                    <User size={22} />
                    <span className="hidden md:block text-sm font-medium">
                      Login
                    </span>
                  </Link>
                )}
              </div>

              <Link
                href="/wishlist"
                className="relative text-foreground transition-all hover:scale-110 hover:text-brand-amber"
                aria-label={
                  wishlistCount > 0
                    ? `Wishlist, ${wishlistCount} items`
                    : "Wishlist"
                }
              >
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-amber px-1 text-[10px] font-bold text-foreground">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                <ShoppingBag
                  size={22}
                  onClick={() => router.push("/checkout/bag")}
                  className="cursor-pointer text-foreground hover:text-brand-amber hover:scale-110 transition-all"
                  aria-label={
                    cartItemCount > 0
                      ? `Shopping bag, ${cartItemCount} items`
                      : "Shopping bag"
                  }
                />

                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-amber px-1 text-[10px] font-bold text-foreground">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Benefits Bar */}
          <div className="bg-gradient-to-r from-brand-cream via-brand-cream/50 to-brand-cream border-y border-brand-amber/30">
            <div className="max-w-[1440px] mx-auto px-3 py-2">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex items-center justify-center gap-2">
                  <PackageCheck size={20} className="text-brand-amber" />
                  <div>
                    <p className="text-[11px] md:text-sm font-bold text-foreground">
                      Easy Returns
                    </p>
                    <p className="hidden md:block text-xs text-brand-amber">
                      Free Pick Up
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Zap size={20} className="text-brand-amber" />
                  <div>
                    <p className="text-[11px] md:text-sm font-bold text-foreground">
                      Fast Delivery
                    </p>
                    <p className="hidden md:block text-xs text-brand-amber">
                      10000+ Styles
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Truck size={20} className="text-brand-amber" />
                  <div>
                    <p className="text-[11px] md:text-sm font-bold text-foreground">
                      Free Shipping
                    </p>
                    <p className="hidden md:block text-xs text-brand-amber">
                      Above ₹999
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-100 h-screen transition-all duration-300 ${
            open ? "visible bg-black/40" : "invisible"
          }`}
        >
          <div
            className={`absolute left-0 top-0 flex h-full w-[min(100vw,400px)] flex-col bg-brand-white shadow-xl transition-transform duration-300 ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-brand-amber/20 px-4 py-4">
              <h2 className="text-lg font-bold bg-gradient-to-r from-brand-amber to-amber-400 bg-clip-text text-transparent">
                Categories
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-foreground transition-colors hover:bg-brand-cream hover:text-brand-amber"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
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
