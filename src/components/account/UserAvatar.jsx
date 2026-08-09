"use client";

import OptimizedImage from "@/components/ui/OptimizedImage";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
};

const UserAvatar = ({ user, size = "sm", className }) => {
  const label = user?.name || user?.email || "User";
  const initial = label.charAt(0).toUpperCase();

  if (user?.avatar) {
    return (
      <span
        className={cn(
          "relative inline-block shrink-0 overflow-hidden rounded-full ring-2 ring-brand-amber/20",
          sizeClasses[size],
          className
        )}
      >
        <OptimizedImage
          src={user.avatar}
          alt={label}
          fill
          sizes="44px"
          className="object-cover"
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-brand-amber font-bold text-foreground",
        size === "sm" ? "h-8 w-8 text-sm" : "h-11 w-11 text-base",
        className
      )}
    >
      {initial}
    </span>
  );
};

export default UserAvatar;
