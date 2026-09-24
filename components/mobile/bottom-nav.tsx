"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  FiBell,
  FiClipboard,
  FiClock,
  FiGrid,
  FiHome,
  FiPackage,
  FiPlusCircle,
  FiSearch,
  FiUser,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import type { UserRole } from "@/lib/types";
import { useDishconData } from "@/lib/dishcon-store";
import { cn } from "@/lib/utils";

type BottomNavItem = {
  href: string;
  icon: IconType;
  label: string;
  exact?: boolean;
};

const navigation: Record<UserRole, BottomNavItem[]> = {
  mahasiswa: [
    { href: "/mahasiswa/dashboard", icon: FiHome, label: "Home", exact: true },
    { href: "/mahasiswa/catalog", icon: FiSearch, label: "Katalog" },
    { href: "/mahasiswa/kos-share", icon: FiUsers, label: "Berbagi" },
    { href: "/mahasiswa/history", icon: FiClock, label: "Riwayat" },
    { href: "/mahasiswa/profile", icon: FiUser, label: "Profil" },
  ],
  mitra: [
    { href: "/mitra/dashboard", icon: FiHome, label: "Home", exact: true },
    { href: "/mitra/posting", icon: FiPlusCircle, label: "Posting" },
    { href: "/mitra/history", icon: FiClock, label: "Reservasi" },
    { href: "/mitra/notifications", icon: FiBell, label: "Notifikasi" },
    { href: "/mitra/profile", icon: FiUser, label: "Profil" },
  ],
  admin: [
    { href: "/admin/dashboard", icon: FiGrid, label: "Home", exact: true },
    { href: "/admin/listings", icon: FiPackage, label: "Listing" },
    { href: "/admin/reservations", icon: FiClipboard, label: "Reservasi" },
    { href: "/admin/mitra", icon: FiUserCheck, label: "Mitra" },
    { href: "/admin/notifications", icon: FiBell, label: "Notifikasi" },
  ],
};

export function BottomNav({
  role = "mahasiswa",
  className,
}: {
  role?: UserRole;
  className?: string;
}) {
  const pathname = usePathname();
  const { notifications } = useDishconData();
  const unread = notifications.filter((notification) => !notification.is_read).length;
  const roleRoot = `/${role}`;

  return (
    <nav
      aria-label="Navigasi utama"
      className={cn(
        "glass-mobile-nav mobile-safe-bottom fixed bottom-0 left-1/2 z-50 flex w-full max-w-lg md:hidden -translate-x-1/2 items-center justify-around gap-1 overflow-hidden rounded-t-[1.75rem] border border-white/60 px-2 pt-2 shadow-[0_-18px_50px_rgba(15,40,26,0.2)]",
        className,
      )}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
      {navigation[role].map((item) => {
        const Icon = item.icon;
        const isHome = item.exact && (pathname === item.href || pathname === roleRoot);
        const isActive = isHome || (!item.exact && pathname.startsWith(`${item.href}/`)) || pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "focus-ring group relative flex min-h-12 min-w-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1 transition active:scale-95",
              isActive ? "text-brand-700" : "text-stone-400 hover:text-stone-600",
            )}
          >
            <span
              className={cn(
                "grid h-8 w-10 place-items-center rounded-2xl transition-colors",
                isActive ? "bg-brand-100/80 shadow-sm backdrop-blur-md" : "group-hover:bg-white/60",
              )}
            >
              <Icon className="h-[21px] w-[21px]" aria-hidden="true" />
            </span>
            <span className={cn("whitespace-nowrap text-[9px] leading-none sm:text-[10px]", isActive ? "font-black" : "font-semibold")}>
              {item.label}
            </span>
            {item.href.endsWith("/notifications") && unread > 0 && <span className="absolute right-1 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-orange-500 px-1 text-[8px] font-black text-white">{unread > 99 ? "99+" : unread}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
