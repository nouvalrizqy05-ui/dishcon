"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/data";
import { useAuth, roleHome } from "@/lib/auth-context";

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/70 bg-white/75 pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur-2xl">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 py-2.5 sm:min-h-[72px] sm:px-6 sm:py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-brand-100 bg-white shadow-md sm:h-10 sm:w-10">
            <Image src="/logo-dishcon.jpeg" alt="DishCon logo" width={40} height={40} className="h-full w-full object-cover" priority />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-brand-900 sm:text-xl">DishCon</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 text-sm font-semibold text-stone-600 md:flex">
          {navLinks.map((item) => (
            <Link key={item.label} href={item.href.startsWith("#") ? `/${item.href}` : item.href} className="hover:text-brand-600 transition">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth / CTA */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Button asChild size="sm" className="rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 shadow-lg shadow-brand-600/25">
              <Link href={roleHome(user.role)}>Dasbor Anda</Link>
            </Button>
          ) : (
            <>
              {/* Masuk Dropdown */}
              <div className="relative group">
                <button className="text-sm font-bold text-brand-700 hover:text-brand-800 py-2">
                  Masuk
                </button>
                <div className="absolute right-0 top-full mt-1 hidden w-48 flex-col rounded-xl border border-stone-100 bg-white p-2 shadow-xl group-hover:flex group-focus-within:flex">
                  <Link href="/login" className="rounded-lg px-4 py-2.5 text-sm font-bold text-stone-700 hover:bg-brand-50 hover:text-brand-700">
                    Sebagai Mahasiswa
                  </Link>
                  <Link href="/mitra/login" className="rounded-lg px-4 py-2.5 text-sm font-bold text-stone-700 hover:bg-brand-50 hover:text-brand-700">
                    Sebagai Mitra UMKM
                  </Link>
                </div>
              </div>

              {/* Daftar Dropdown */}
              <div className="relative group">
                <Button size="sm" className="rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 shadow-lg shadow-brand-600/25">
                  Daftar
                </Button>
                <div className="absolute right-0 top-full mt-1 hidden w-48 flex-col rounded-xl border border-stone-100 bg-white p-2 shadow-xl group-hover:flex group-focus-within:flex">
                  <Link href="/register" className="rounded-lg px-4 py-2.5 text-sm font-bold text-stone-700 hover:bg-brand-50 hover:text-brand-700">
                    Sebagai Mahasiswa
                  </Link>
                  <Link href="/mitra/register" className="rounded-lg px-4 py-2.5 text-sm font-bold text-stone-700 hover:bg-brand-50 hover:text-brand-700">
                    Sebagai Mitra UMKM
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(true)}
          className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 md:hidden"
          aria-label="Buka menu"
          aria-expanded={open}
          aria-controls="public-mobile-menu"
        >
          <FiMenu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div id="public-mobile-menu" className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Menu publik">
          <div
            className="mobile-safe-bottom ml-auto flex h-full w-[88%] max-w-sm flex-col gap-8 overflow-y-auto bg-white/95 px-5 pb-5 pt-[calc(1.25rem+env(safe-area-inset-top))] shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
                <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-brand-100 bg-white shadow-md sm:h-10 sm:w-10">
                  <Image src="/logo-dishcon.jpeg" alt="DishCon logo" width={40} height={40} className="h-full w-full object-cover" />
                </span>
                <span className="text-lg font-extrabold tracking-tight text-brand-900 sm:text-xl">DishCon</span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="focus-ring flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-600"
                aria-label="Tutup menu"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <Link
                  onClick={() => setOpen(false)}
                  key={item.label}
                  href={item.href.startsWith("#") ? `/${item.href}` : item.href}
                  className="rounded-xl px-4 py-3.5 font-bold text-stone-700 hover:bg-brand-50 hover:text-brand-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 pb-6">
              {user ? (
                <Button asChild size="lg" className="w-full rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg shadow-brand-600/25">
                  <Link href={roleHome(user.role)}>Masuk ke Dasbor</Link>
                </Button>
              ) : (
                <div className="space-y-5">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400">Masuk</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button asChild variant="outline" size="sm" className="w-full rounded-full font-bold border-stone-200">
                        <Link href="/login">Mahasiswa</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full rounded-full font-bold border-stone-200">
                        <Link href="/mitra/login">Mitra UMKM</Link>
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400">Daftar</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button asChild size="sm" className="w-full rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg shadow-brand-600/25">
                        <Link href="/register">Mahasiswa</Link>
                      </Button>
                      <Button asChild size="sm" className="w-full rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg shadow-brand-600/25">
                        <Link href="/mitra/register">Mitra UMKM</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
