"use client";

import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "h-8 w-8 text-sm",
  md: "h-11 w-11 text-base",
};

const UserAvatar = ({ user, size = "sm", className }) => {
  const label = user?.name || user?.email || "User";
  const initial = label.charAt(0).toUpperCase();

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={label}
        className={cn(
          "shrink-0 rounded-full object-cover ring-2 ring-brand-amber/20",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-brand-amber font-bold text-foreground",
        sizeClasses[size],
        className
      )}
    >
      {initial}
    </span>
  );
};

export default UserAvatar;
