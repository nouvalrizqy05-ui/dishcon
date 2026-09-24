"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiBell,
  FiChevronDown,
  FiClipboard,
  FiClock,
  FiGrid,
  FiHome,
  FiLogOut,
  FiMapPin,
  FiMenu,
  FiMessageCircle,
  FiPackage,
  FiPlusCircle,
  FiSearch,
  FiSettings,
  FiUser,
  FiUserCheck,
  FiUsers,
  FiX,
  FiZap,
} from "react-icons/fi";
import { BrandLogo } from "@/components/brand-logo";
import { BottomNav } from "@/components/mobile/bottom-nav";
import { useAuth, roleHome } from "@/lib/auth-context";
import { useDishconData } from "@/lib/dishcon-store";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: IconType; badge?: number; highlight?: boolean };
type NavSection = { label: string; items: NavItem[] };

function roleBase(role: UserRole) {
  if (role === "admin") return "/admin";
  if (role === "mitra") return "/mitra";
  return "/mahasiswa";
}

function isNavItemActive(pathname: string, href: string, role: UserRole) {
  if (href === `${roleBase(role)}/dashboard`) {
    return pathname === href || pathname === roleBase(role);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getNav(role: UserRole, unread: number, pendingMitra: number): NavSection[] {
  if (role === "admin") {
    return [
      {
        label: "DASHBOARD",
        items: [
          { href: "/admin/dashboard", label: "Overview", icon: FiGrid },
          { href: "/admin/listings", label: "Kantong Surplus", icon: FiPackage },
          { href: "/admin/reservations", label: "Reservasi", icon: FiClipboard },
          { href: "/admin/mitra", label: "Verifikasi Mitra", icon: FiUserCheck, badge: pendingMitra },
        ],
      },
      {
        label: "MANAJEMEN",
        items: [
          { href: "/admin/users", label: "Pengguna", icon: FiUsers },
          { href: "/admin/zones", label: "Sebaran Lokasi", icon: FiMapPin },
        ],
      },
      {
        label: "SISTEM",
        items: [
          { href: "/admin/ai-settings", label: "Pengaturan AI", icon: FiZap },
          { href: "/admin/complaints", label: "Pusat Pengaduan", icon: FiMessageCircle },
          { href: "/admin/notifications", label: "Notifikasi", icon: FiBell, badge: unread },
          { href: "/admin/settings", label: "Konfigurasi", icon: FiSettings },
        ],
      },
    ];
  }

  if (role === "mitra") {
    return [
      {
        label: "MENU MITRA",
        items: [
          { href: "/mitra/dashboard", label: "Dashboard", icon: FiHome },
          { href: "/mitra/posting", label: "Posting Kantong Surplus", icon: FiPlusCircle, highlight: true },
          { href: "/mitra/history", label: "Riwayat & Reservasi", icon: FiClock },
          { href: "/mitra/profile", label: "Profil Usaha", icon: FiUser },
          { href: "/mitra/notifications", label: "Notifikasi", icon: FiBell, badge: unread },
          { href: "/mitra/complaint", label: "Pusat Pengaduan", icon: FiMessageCircle },
          { href: "/mitra/settings", label: "Settings", icon: FiSettings },
        ],
      },
    ];
  }

  return [
    {
      label: "MENU MAHASISWA",
      items: [
        { href: "/mahasiswa/dashboard", label: "Dashboard", icon: FiHome },
        { href: "/mahasiswa/catalog", label: "Cari Kantong Surplus", icon: FiSearch },
        { href: "/mahasiswa/kos-share", label: "Berbagi Antar Kos", icon: FiUsers, highlight: true },
        { href: "/mahasiswa/history", label: "Reservasi Saya", icon: FiClock },
        { href: "/mahasiswa/profile", label: "Profil", icon: FiUser },
        { href: "/mahasiswa/notifications", label: "Notifikasi", icon: FiBell, badge: unread },
        { href: "/mahasiswa/complaint", label: "Pusat Pengaduan", icon: FiMessageCircle },
        { href: "/mahasiswa/settings", label: "Settings", icon: FiSettings },
      ],
    },
  ];
}

function Sidebar({ role, open, onClose }: { role: UserRole; open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { notifications, profiles } = useDishconData();
  const pendingMitra = role === "admin"
    ? profiles.filter((profile) => profile.role === "mitra" && profile.verification_status === "belum_verifikasi").length
    : 0;
  const nav = getNav(role, notifications.filter((notification) => !notification.is_read).length, pendingMitra);
  const admin = role === "admin";

  return (
    <aside className={cn("flex h-full flex-col border-r border-stone-200", admin ? "bg-brand-900 text-white" : "bg-white text-ink")}>
      <div className="flex items-center justify-between p-4 sm:p-5">
        <BrandLogo dark={admin} className={admin ? "text-white" : ""} />
        {open && (
          <button
            type="button"
            onClick={onClose}
            className={cn("focus-ring grid h-10 w-10 place-items-center rounded-xl", admin ? "bg-white/10" : "bg-stone-100")}
            aria-label="Tutup menu"
          >
            <FiX aria-hidden="true" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-5 sm:px-4" aria-label={`Menu ${admin ? "admin" : role}`}>
        {nav.map((section) => (
          <div key={section.label}>
            <p className={cn("mb-2 px-2 text-[11px] font-black uppercase tracking-[0.18em]", admin ? "text-white/40" : "text-stone-400")}>
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isNavItemActive(pathname, item.href, role);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "focus-ring flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-extrabold transition",
                      admin
                        ? active
                          ? "bg-white/10 text-white"
                          : "text-white/65 hover:bg-white/10 hover:text-white"
                        : item.highlight
                          ? "green-gradient text-white shadow-lg shadow-brand-700/20 hover:shadow-xl"
                          : active
                            ? "bg-brand-100 text-brand-800"
                            : "text-stone-700 hover:bg-brand-50 hover:text-brand-700",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="flex-1">{item.label}</span>
                    {!!item.badge && item.badge > 0 && (
                      <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-black text-white">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-current/10 p-3 sm:p-5">
        <button
          type="button"
          onClick={logout}
          className={cn(
            "focus-ring flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-extrabold transition",
            admin ? "text-white/70 hover:bg-white/10 hover:text-white" : "text-stone-600 hover:bg-red-50 hover:text-red-600",
          )}
        >
          <FiLogOut aria-hidden="true" /> Logout
        </button>
      </div>
    </aside>
  );
}

function ProfileDropdown({ role }: { role: UserRole }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const base = roleBase(role);
  if (!user) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Buka menu profil ${user.name}`}
        className="focus-ring flex items-center gap-2 rounded-full bg-white p-1 shadow-sm ring-1 ring-stone-200 transition hover:shadow-md sm:gap-3 sm:pr-3"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-700 text-xs font-black text-white sm:h-10 sm:w-10 sm:text-sm">
          {user.name.slice(0, 2).toUpperCase()}
        </span>
        <span className="hidden text-left text-sm md:block">
          <b className="block max-w-36 truncate text-ink">{user.name}</b>
          <span className="text-stone-500">{role === "mitra" ? "Mitra UMKM" : role === "mahasiswa" ? "Mahasiswa" : "Admin"}</span>
        </span>
        <FiChevronDown className="hidden text-stone-400 sm:block" aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-14 z-40 w-64 rounded-3xl border border-stone-200 bg-white p-2 shadow-2xl">
          <div className="px-4 py-3">
            <p className="truncate font-black text-ink">{user.name}</p>
            <p className="truncate text-sm text-stone-500">{user.email}</p>
          </div>
          <Link onClick={() => setOpen(false)} href={`${base}/profile`} className="flex min-h-11 items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold hover:bg-brand-50">
            <FiUser aria-hidden="true" /> Profil Saya
          </Link>
          <Link onClick={() => setOpen(false)} href={`${base}/settings`} className="flex min-h-11 items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold hover:bg-brand-50">
            <FiSettings aria-hidden="true" /> Settings
          </Link>
          <button type="button" onClick={logout} className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50">
            <FiLogOut aria-hidden="true" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}

function TopNotification({ role }: { role: UserRole }) {
  const { notifications } = useDishconData();
  const unread = notifications.filter((notification) => !notification.is_read).length;
  return (
    <Link
      href={`${roleBase(role)}/notifications`}
      aria-label={unread > 0 ? `Notifikasi, ${unread} belum dibaca` : "Notifikasi"}
      className="focus-ring relative grid h-10 w-10 place-items-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:bg-brand-50 hover:text-brand-700 sm:h-11 sm:w-11"
    >
      <FiBell aria-hidden="true" />
      {unread > 0 && (
        <span className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </Link>
  );
}

type ProtectedPageProps = {
  role: UserRole;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showMobileNav?: boolean;
  showMobileHeader?: boolean;
};

export function ProtectedPage({ role, title, subtitle, children, showMobileNav = true, showMobileHeader = true }: ProtectedPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(roleHome(role))}`);
      return;
    }
    if (user.role !== role) router.replace(roleHome(user.role));
  }, [loading, role, router, user]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  if (loading || !user || user.role !== role) {
    return (
      <main className="grid min-h-screen place-items-center bg-stone-50 px-4 text-center">
        <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-card sm:p-8">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-brand-100" />
          <p className="mt-4 font-bold text-stone-600">Memeriksa akses akun...</p>
        </div>
      </main>
    );
  }

  const admin = role === "admin";

  return (
    <div className={cn("min-h-screen", admin ? "bg-stone-50 xl:bg-white" : "bg-[#f7f7f5]")}>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] xl:block">
        <Sidebar role={role} />
      </aside>

      <main className="min-w-0 xl:pl-[280px]">
        <header className={cn("sticky top-0 z-20 border-b border-stone-200/80 bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl", showMobileHeader ? "block" : "hidden md:block")}>
          <div className="mx-auto flex min-h-[68px] max-w-[1600px] items-center justify-between gap-2 px-3 py-2.5 sm:min-h-[82px] sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-stone-200 bg-white text-stone-700 xl:hidden"
                aria-label="Buka menu"
                aria-expanded={mobileOpen}
              >
                <FiMenu aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-black tracking-tight text-ink sm:text-2xl xl:text-4xl">{title}</h1>
                {subtitle && <p className="mt-0.5 hidden line-clamp-1 text-sm text-stone-600 sm:mt-1 sm:block xl:line-clamp-2 xl:text-base">{subtitle}</p>}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <TopNotification role={role} />
              <ProfileDropdown role={role} />
            </div>
          </div>
        </header>

        <div
          className={cn(
            "mx-auto w-full max-w-[1600px] min-w-0 px-3 py-4 sm:px-6 sm:py-6 lg:px-8",
            showMobileNav ? "pb-28 sm:pb-28 md:pb-6" : "pb-8 md:pb-6",
            !showMobileHeader && "pt-[calc(1rem+env(safe-area-inset-top))] md:pt-6",
            role === "mahasiswa" && "overflow-x-hidden",
          )}
        >
          {children}
        </div>
      </main>

      {showMobileNav && <BottomNav role={role} className="md:hidden" />}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm xl:hidden"
          onClick={() => setMobileOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
        >
          <div className="h-full w-[86%] max-w-[330px] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <Sidebar role={role} open onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
