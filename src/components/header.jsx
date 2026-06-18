"use client";

import { useState, useRef, useEffect } from "react";
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
import { getCategoryTree } from "@/services/categoryService.js";
import {
  DEPARTMENTS,
  getDepartmentSubcategories,
} from "@/lib/categoryHelpers.js";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState(null);
  const [mobileDepartment, setMobileDepartment] = useState("men");
  const userMenuRef = useRef(null);
  const router = useRouter();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const { data: cartItemCount = 0 } = useCart();
  const { data: wishlistData } = useWishlist();
  const wishlistCount = wishlistData?.count ?? 0;

  const { data: categoryData } = useQuery({
    queryKey: ["categories", "tree"],
    queryFn: getCategoryTree,
    staleTime: 5 * 60 * 1000,
  });

  const categoryTree = categoryData?.categories || [];

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
    setMobileDepartment((current) => (current === key ? null : key));
  };

  const renderDepartmentDropdown = (variant = "desktop") => {
    const isCompact = variant === "compact";

    return DEPARTMENTS.map(({ key, label }) => {
      const isActive = activeDepartment === key;
      const subcategories = getDepartmentSubcategories(categoryTree, key);

      return (
        <div
          key={key}
          className="relative"
          onMouseEnter={() => setActiveDepartment(key)}
          onMouseLeave={() => setActiveDepartment(null)}
        >
          <Link
            href={`/shop/${key}`}
            onClick={() => setActiveDepartment(null)}
            className={`items-center gap-1 font-bold tracking-wide transition hidden md:flex ${
              isCompact
                ? "rounded-full px-3 py-1.5 text-xs"
                : "px-2 py-1 text-sm"
            } ${
              isActive
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
            <div className="absolute left-0 top-full z-50 pt-2">
              <div className="min-w-[280px] rounded-xl border border-brand-amber/20 bg-brand-white p-4 shadow-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-gray">
                Shop by category
              </p>
              {subcategories.length > 0 ? (
                <div className="grid gap-1">
                  {subcategories.map((sub) => (
                    <Link
                      key={sub._id}
                      href={`/shop/${sub.slug}`}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-brand-cream hover:text-brand-amber"
                      onClick={() => setActiveDepartment(null)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-3 py-2 text-sm text-brand-gray">
                  No subcategories yet. Add them under {label} in the admin panel.
                </p>
              )}
              <Link
                href={`/shop/${key}`}
                className="mt-3 block border-t border-brand-cream pt-3 text-sm font-semibold text-brand-amber hover:underline"
                onClick={() => setActiveDepartment(null)}
              >
                View all {label.toLowerCase()}
              </Link>
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
            className={`absolute left-0 top-0 h-full w-[320px] bg-brand-white/95 backdrop-blur-xl shadow-xl transition-transform duration-300 ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-brand-amber/20">
              <h2 className="font-bold text-xl bg-gradient-to-r from-brand-amber to-amber-400 bg-clip-text text-transparent">
                Categories
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-foreground hover:text-brand-amber"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-brand-amber/20">
              <div className="flex items-center gap-3 bg-brand-cream rounded-full px-4 py-3">
                <Search size={18} className="text-brand-amber" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent outline-none flex-1 text-sm"
                />
              </div>
            </div>

            {/* Categories */}
            <nav className="overflow-y-auto h-[calc(100%-130px)]">
              <div className="border-b border-brand-amber/20 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-gray">
                  Shop by department
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DEPARTMENTS.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => selectMobileDepartment(key)}
                      className={`rounded-xl px-4 py-3 text-sm font-bold tracking-wide transition ${
                        mobileDepartment === key
                          ? "bg-brand-amber text-foreground"
                          : "bg-brand-cream text-foreground hover:bg-brand-amber/20"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {mobileDepartment && (
                <div className="py-2">
                  {getDepartmentSubcategories(categoryTree, mobileDepartment).length > 0 ? (
                    getDepartmentSubcategories(categoryTree, mobileDepartment).map((sub) => (
                      <Link
                        key={sub._id}
                        href={`/shop/${sub.slug}`}
                        onClick={() => setOpen(false)}
                        className="block border-b border-brand-cream px-5 py-4 font-medium text-foreground transition hover:bg-brand-cream hover:text-brand-amber"
                      >
                        {sub.name}
                      </Link>
                    ))
                  ) : (
                    <p className="px-5 py-4 text-sm text-brand-gray">
                      No subcategories yet for this department.
                    </p>
                  )}

                  <Link
                    href={`/shop/${mobileDepartment}`}
                    onClick={() => setOpen(false)}
                    className="block px-5 py-4 text-sm font-semibold text-brand-amber"
                  >
                    View all {mobileDepartment}
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
