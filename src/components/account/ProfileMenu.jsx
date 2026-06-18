"use client";

import Link from "next/link";
import { LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ACCOUNT_NAV } from "@/lib/accountNav";
import UserAvatar from "@/components/account/UserAvatar";

const ProfileMenu = ({ open, onClose, onLogout }) => {
  const { user } = useAuth();

  if (!open) return null;

  const displayName = user?.name || user?.email?.split("@")[0] || "there";

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-xl border border-brand-amber/20 bg-brand-white shadow-2xl">
      <div className="bg-gradient-to-r from-brand-amber/15 via-brand-cream to-brand-amber/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} size="md" className="shadow-sm" />
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-gray">
              Hello
            </p>
            <p className="truncate text-sm font-bold text-foreground">
              {displayName}
            </p>
            {user?.email && (
              <p className="truncate text-xs text-brand-gray">{user.email}</p>
            )}
          </div>
        </div>
      </div>

      <nav className="py-1">
        {ACCOUNT_NAV.map(({ href, label, icon: Icon, danger }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`group flex items-center gap-3 px-4 py-2.5 text-sm transition ${
              danger
                ? "text-red-600 hover:bg-red-50"
                : "text-foreground hover:bg-brand-cream hover:text-brand-amber"
            }`}
          >
            <Icon
              size={18}
              className={
                danger
                  ? "text-red-500"
                  : "text-brand-gray group-hover:text-brand-amber"
              }
            />
            <span className="flex-1 font-medium">{label}</span>
            <ChevronRight
              size={16}
              className="text-brand-gray/60 opacity-0 transition group-hover:opacity-100"
            />
          </Link>
        ))}
      </nav>

      <div className="border-t border-brand-cream">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-brand-cream hover:text-brand-amber"
        >
          <LogOut size={18} className="text-brand-gray" />
          Log out
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu;
