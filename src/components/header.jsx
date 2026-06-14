"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const router = useRouter();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();

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

  const navLinks = [
    "TOPS",
    "BOTTOMS",
    "DRESSES",
    "ACCESSORIES",
    "SALE",
    "INCLUSIVE",
    "BAGS",
    "JEWELLERY",
    "BEAUTY",
    "SWIMWEAR",
    "SPORTS & GYM",
    "LINGERIE",
  ];

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
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <button
                onClick={() => setOpen(true)}
                className="text-foreground hover:text-brand-amber transition lg:hidden"
              >
                <Menu size={28} />
              </button>

              <div className="hidden md:flex items-center flex-1 bg-brand-cream border border-brand-amber/20 rounded-full px-4 py-2">
                <Search size={18} className="text-brand-amber" />

                <input
                  type="text"
                  placeholder="Search dresses, tops, beauty..."
                  className="
        flex-1
        bg-transparent
        outline-none
        px-3
        text-sm
        text-foreground
        placeholder:text-brand-gray
      "
                />
              </div>

              {/* Mobile Search Icon */}
              <button className="md:hidden">
                <Search
                  size={24}
                  className="text-foreground hover:text-brand-amber"
                />
              </button>
            </div>

            {/* Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-brand-amber via-amber-400 to-brand-amber bg-clip-text text-transparent">
                  LIGHTCOLLECTION
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
                    >
                      <span className="w-8 h-8 rounded-full bg-brand-amber text-foreground text-sm font-bold flex items-center justify-center">
                        {(user?.name || user?.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                      <span className="hidden md:block text-sm font-medium max-w-[100px] truncate">
                        {user?.name || "Account"}
                      </span>
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-brand-white rounded-xl shadow-lg border border-brand-amber/20 py-2 z-50">
                        <p className="px-4 py-2 text-sm text-brand-gray truncate border-b border-brand-cream">
                          {user?.email}
                        </p>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-brand-cream hover:text-brand-amber"
                        >
                          <LogOut size={16} />
                          Log out
                        </button>
                      </div>
                    )}
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

              <Heart
                size={22}
                className="cursor-pointer text-foreground hover:text-brand-amber hover:scale-110 transition-all"
              />

              <div className="relative">
                <ShoppingBag
                  size={22}
                  onClick={() => router.push("/checkout/bag")}
                  className="cursor-pointer text-foreground hover:text-brand-amber hover:scale-110 transition-all"
                />

                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-brand-amber text-foreground text-[10px] flex items-center justify-center font-bold">
                  2
                </span>
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

          {/* Desktop Categories */}
          <div className="hidden lg:block border-b border-brand-amber/20 bg-brand-white">
            <div className="max-w-[1440px] mx-auto overflow-x-auto">
              <div className="flex items-center justify-center gap-8 px-8 py-3 whitespace-nowrap">
                {navLinks.map((item) => (
                  <button
                    key={item}
                    className="relative text-sm font-semibold text-foreground hover:text-brand-amber transition group"
                  >
                    {item}

                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-brand-amber transition-all duration-300 group-hover:w-full" />
                  </button>
                ))}
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
              {navLinks.map((item) => (
                <button
                  key={item}
                  className="
                    w-full
                    text-left
                    px-5
                    py-4
                    border-b
                    border-brand-cream
                    font-medium
                    text-foreground
                    hover:bg-brand-cream
                    hover:text-brand-amber
                    transition
                  "
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
