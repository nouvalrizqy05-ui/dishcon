"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiFilter, FiSearch, FiShield, FiSliders } from "react-icons/fi";
import { useAuth, roleHome } from "@/lib/auth-context";
import { useDishconData } from "@/lib/dishcon-store";
import { formatDistanceMeters, haversineDistanceMeters } from "@/lib/maps";
import { isListingOrderable } from "@/lib/listings";
import { BottomNav } from "./bottom-nav";
import { FoodCard } from "./food-card";

const categories = ["Makanan Berat", "Jajanan", "Minuman", "Paket Nasi", "Katering"];

export function MobileCatalog() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { listings, loading, preferences } = useDishconData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [halalOnly, setHalalOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?next=/mahasiswa/catalog");
      return;
    }
    if (user.role !== "mahasiswa") router.replace(roleHome(user.role));
  }, [authLoading, router, user]);

  const filtered = useMemo(() => {
    if (!user) return [];
    return listings
      .map((item) => ({
        ...item,
        distanceMeter: user.lat && user.lng ? haversineDistanceMeters(user.lat, user.lng, item.lat, item.lng) : Infinity,
      }))
      .filter((item) => {
        const isActive = isListingOrderable(item);
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.kategori);
        const searchMatch = !searchQuery || `${item.nama_makanan} ${item.kategori} ${item.lokasi}`.toLowerCase().includes(searchQuery.toLowerCase());
        const halalMatch = !halalOnly || item.halal;
        const preferenceHalalMatch = !preferences.halal || item.halal;
        const preferenceCategoryMatch = preferences.preferredCategories.length === 0 || preferences.preferredCategories.includes(item.kategori);
        const distanceMatch = !Number.isFinite(item.distanceMeter) || item.distanceMeter <= preferences.maxRadiusMeter;
        return isActive && categoryMatch && searchMatch && halalMatch && preferenceHalalMatch && preferenceCategoryMatch && distanceMatch;
      })
      .sort((a, b) => a.distanceMeter - b.distanceMeter);
  }, [halalOnly, listings, preferences.halal, preferences.maxRadiusMeter, preferences.preferredCategories, searchQuery, selectedCategories, user]);

  function toggleCategory(category: string) {
    setSelectedCategories((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
  }

  if (authLoading || !user || user.role !== "mahasiswa") {
    return <div className="grid min-h-[100dvh] max-w-md place-items-center bg-[#f8faf8]"><div className="h-12 w-12 animate-pulse rounded-full bg-brand-100" /></div>;
  }

  return (
    <div className="relative mx-auto min-h-[100dvh] max-w-md overflow-hidden bg-[#f8faf8] shadow-2xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 rounded-b-[40px] bg-gradient-to-b from-[#e3f5e8] to-transparent" />
      <div className="relative z-10 px-5 pb-28 pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/mahasiswa/dashboard" aria-label="Kembali ke Home" className="rounded-full bg-white/80 p-2 shadow-sm backdrop-blur-sm transition hover:bg-white"><FiArrowLeft className="h-5 w-5 text-stone-700" aria-hidden="true" /></Link>
            <h1 className="text-xl font-black text-stone-900">Katalog</h1>
          </div>
          <button type="button" onClick={() => setHalalOnly((value) => !value)} aria-pressed={halalOnly} className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition-all ${halalOnly ? "bg-brand-600 text-white shadow-md" : "border border-stone-200 bg-white text-stone-600"}`}><FiShield className="h-3.5 w-3.5" aria-hidden="true" />{halalOnly ? "Halal ✓" : "Halal"}</button>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-stone-100 bg-white px-4 py-3 shadow-sm focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100">
          <FiSearch className="mr-1 h-[18px] w-[18px] shrink-0 text-stone-400" aria-hidden="true" />
          <input type="search" aria-label="Cari makanan atau lokasi" placeholder="Cari makanan atau lokasi..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-400" />
        </div>

        <div className="hide-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Kategori makanan">
          <button type="button" onClick={() => setSelectedCategories([])} aria-pressed={selectedCategories.length === 0} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${selectedCategories.length === 0 ? "bg-brand-600 text-white shadow-md shadow-brand-600/25" : "border border-stone-200 bg-white text-stone-600 hover:border-brand-200"}`}>Semua</button>
          {categories.map((category) => {
            const active = selectedCategories.includes(category);
            return <button key={category} type="button" onClick={() => toggleCategory(category)} aria-pressed={active} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${active ? "bg-brand-600 text-white shadow-md shadow-brand-600/25" : "border border-stone-200 bg-white text-stone-600 hover:border-brand-200"}`}>{category}</button>;
          })}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button type="button" onClick={() => setFiltersOpen((value) => !value)} aria-expanded={filtersOpen} className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-black ${filtersOpen || selectedCategories.length > 0 ? "bg-brand-50 text-brand-700" : "border border-stone-200 bg-white text-stone-600"}`}><FiSliders className="h-3.5 w-3.5" aria-hidden="true" />Filter{selectedCategories.length > 0 ? ` (${selectedCategories.length})` : ""}</button>
        </div>

        {filtersOpen && <div className="mt-3 rounded-2xl border border-stone-200 bg-white p-3.5 shadow-sm"><div className="mb-2 flex items-center justify-between"><p className="text-xs font-black text-stone-800">Filter kategori</p><button type="button" onClick={() => setFiltersOpen(false)} className="min-h-9 rounded-lg px-2 text-xs font-bold text-brand-700">Selesai</button></div><div className="grid grid-cols-2 gap-2">{categories.map((category) => <label key={category} className="flex min-h-10 items-center gap-2 rounded-xl bg-stone-50 px-2.5 text-xs font-semibold text-stone-700"><input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => toggleCategory(category)} className="h-4 w-4 accent-brand-700" />{category}</label>)}</div><label className="mt-2 flex min-h-10 items-center gap-2 rounded-xl bg-brand-50 px-2.5 text-xs font-semibold text-brand-800"><input type="checkbox" checked={halalOnly} onChange={(event) => setHalalOnly(event.target.checked)} className="h-4 w-4 accent-brand-700" />Hanya makanan halal</label><p className="mt-3 text-[10px] leading-4 text-stone-500">Preferensi akun: halal {preferences.halal ? "aktif" : "tidak"} · radius {formatDistanceMeters(preferences.maxRadiusMeter)}</p></div>}

        <div className="mt-4 flex items-center justify-between gap-2"><p className="text-sm text-stone-500"><span className="font-bold text-stone-900">{filtered.length}</span> kantong tersedia</p><div className="flex items-center gap-2">{(searchQuery || selectedCategories.length > 0 || halalOnly) && <button type="button" onClick={() => { setSearchQuery(""); setSelectedCategories([]); setHalalOnly(false); }} className="min-h-9 rounded-lg px-2 text-xs font-black text-brand-700">Reset</button>}<div className="flex items-center gap-1 text-xs text-stone-400"><FiFilter className="h-3 w-3" aria-hidden="true" /><span>Terdekat</span></div></div></div>

        {loading ? <div className="mt-3 grid grid-cols-2 gap-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-48 animate-pulse rounded-2xl bg-white shadow-sm" />)}</div> : filtered.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center shadow-sm"><FiSearch className="h-12 w-12 text-stone-300" aria-hidden="true" /><p className="mt-3 text-sm font-bold text-stone-700">Tidak ada hasil</p><p className="mt-1 text-xs text-stone-500">Coba ubah filter atau kata kunci pencarian Anda.</p></div>
        ) : <div className="mt-3 grid grid-cols-2 gap-3">{filtered.map((item, index) => <FoodCard key={item.id} listing={item} index={index} />)}</div>}
      </div>
      <BottomNav role="mahasiswa" className="max-w-md" />
    </div>
  );
}
