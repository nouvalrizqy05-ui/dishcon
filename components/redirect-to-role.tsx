"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, roleHome } from "@/lib/auth-context";
import type { UserRole } from "@/lib/types";

function base(role: UserRole) {
  if (role === "mitra") return "/mitra";
  if (role === "mahasiswa") return "/mahasiswa";
  return "/admin";
}

function targetFor(role: UserRole, suffix: string) {
  if (suffix === "dashboard") return roleHome(role);
  if (suffix === "catalog") return role === "mahasiswa" ? "/mahasiswa/catalog" : roleHome(role);
  if (suffix === "posting") return role === "mitra" ? "/mitra/posting" : roleHome(role);
  if (suffix === "kos-share") return role === "mahasiswa" ? "/mahasiswa/kos-share" : roleHome(role);
  return `${base(role)}/${suffix}`;
}

export function RedirectToRole({ suffix = "dashboard" }: { suffix?: string }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else router.replace(targetFor(user.role, suffix));
  }, [loading, router, suffix, user]);
  return <main className="grid min-h-screen place-items-center bg-cream text-center"><div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-card"><p className="font-bold text-stone-600">Mengalihkan sesuai role akun...</p></div></main>;
}
