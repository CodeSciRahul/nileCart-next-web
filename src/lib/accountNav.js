import {
  User,
  Package,
  Ticket,
  MapPin,
  Trash2,
} from "lucide-react";

export const ACCOUNT_NAV = [
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/coupons", label: "Coupons", icon: Ticket },
  { href: "/account/addresses", label: "Address", icon: MapPin },
  {
    href: "/account/delete-account",
    label: "Delete Account",
    icon: Trash2,
    danger: true,
  },
];
