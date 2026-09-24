"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiFilter, FiSearch, FiShield, FiX, FiZap } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { FoodCard } from "@/components/mobile/food-card";
import { useDishconData } from "@/lib/dishcon-store";
import { useAuth } from "@/lib/auth-context";
import { formatDistanceMeters, haversineDistanceMeters } from "@/lib/maps";
import { isListingOrderable } from "@/lib/listings";
import { EmptyState } from "@/components/pages/shared";
import { cn } from "@/lib/utils";

const categories = ["Makanan Berat", "Jajanan", "Minuman", "Paket Nasi", "Katering"];

type CategoryFilterProps = {
  selectedCategories: string[];
  onToggle: (category: string) => void;
};

function CategoryFilters({ selectedCategories, onToggle }: CategoryFilterProps) {
  return (
    <div className="space-y-2.5">
      {categories.map((category) => (
        <label key={category} className="flex min-h-10 cursor-pointer items-center gap-3 rounded-xl text-sm font-semibold text-stone-700 hover:text-brand-700">
          <input
            type="checkbox"
            checked={selectedCategories.includes(category)}
            onChange={() => onToggle(category)}
            className="h-4 w-4 accent-brand-700"
          />
          {category}
        </label>
      ))}
    </div>
  );
}

export function CatalogPage() {
  const { user } = useAuth();
  const { listings, loading, preferences } = useDishconData();
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [halalOnly, setHalalOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return listings
      .filter((item) => isListingOrderable(item))
      .map((item) => ({
        ...item,
        distanceMeter: user?.lat && user?.lng
          ? haversineDistanceMeters(user.lat, user.lng, item.lat, item.lng)
          : Infinity,
      }))
      .filter((item) => {
        const searchMatch = !normalizedQuery || `${item.nama_makanan} ${item.kategori} ${item.lokasi}`.toLowerCase().includes(normalizedQuery);
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.kategori);
        const halalMatch = !halalOnly || item.halal;
        const preferenceHalalMatch = !preferences.halal || item.halal;
        const preferenceCategoryMatch = preferences.preferredCategories.length === 0 || preferences.preferredCategories.includes(item.kategori);
        const distanceMatch = !Number.isFinite(item.distanceMeter) || item.distanceMeter <= preferences.maxRadiusMeter;
        return searchMatch && categoryMatch && halalMatch && preferenceHalalMatch && preferenceCategoryMatch && distanceMatch;
      })
      .sort((a, b) => a.distanceMeter - b.distanceMeter);
  }, [halalOnly, listings, preferences.halal, preferences.maxRadiusMeter, preferences.preferredCategories, query, selectedCategories, user?.lat, user?.lng]);

  function toggleCategory(category: string) {
    setSelectedCategories((current) => current.includes(category)
      ? current.filter((item) => item !== category)
      : [...current, category]);
  }

  function resetFilters() {
    setQuery("");
    setSelectedCategories([]);
    setHalalOnly(false);
  }

  const activeFilterCount = selectedCategories.length + (halalOnly ? 1 : 0);

  return (
    <div className="grid w-full min-w-0 max-w-full gap-4 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-6">
      <aside className="soft-panel hidden h-max min-w-0 p-5 xl:block" aria-labelledby="catalog-filter-title">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id="catalog-filter-title" className="font-black text-ink">Filter</h2>
          <button type="button" onClick={resetFilters} className="focus-ring min-h-10 rounded-xl text-sm font-black text-brand-700">Reset</button>
        </div>
        <div className="space-y-5 text-sm">
          <div>
            <p className="mb-2 font-black uppercase tracking-wider text-stone-400">Status</p>
            <label className="flex min-h-10 items-center gap-3">
              <input type="checkbox" checked readOnly className="h-4 w-4 accent-brand-700" /> Hanya Kantong tayang
            </label>
          </div>
          <div>
            <p className="mb-2 font-black uppercase tracking-wider text-stone-400">Kategori</p>
            <CategoryFilters selectedCategories={selectedCategories} onToggle={toggleCategory} />
          </div>
          <div>
            <p className="mb-2 font-black uppercase tracking-wider text-stone-400">Keamanan</p>
            <label className="flex min-h-10 cursor-pointer items-center gap-3">
              <input type="checkbox" checked={halalOnly} onChange={(event) => setHalalOnly(event.target.checked)} className="h-4 w-4 accent-brand-700" /> Hanya makanan halal
            </label>
          </div>
          <div className="rounded-2xl bg-brand-50 p-4">
            <p className="font-black text-brand-900">Preferensi aktif</p>
            <p className="mt-2 text-xs leading-5 text-brand-800">
              Katalog mengikuti halal, kategori favorit, dan radius maksimal <b>{formatDistanceMeters(preferences.maxRadiusMeter)}</b>.
            </p>
          </div>
        </div>
      </aside>

      <section className="min-w-0 space-y-4" aria-labelledby="catalog-title">
        <div className="rounded-3xl border border-stone-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex items-center gap-2.5 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2.5 focus-within:border-brand-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100">
            <FiSearch className="h-5 w-5 shrink-0 text-stone-400" aria-hidden="true" />
            <label htmlFor="catalog-search" className="sr-only">Cari nama makanan atau lokasi</label>
            <input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari makanan atau lokasi..."
              className="min-h-10 min-w-0 flex-1 bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-400 sm:text-sm"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="focus-ring grid h-9 w-9 place-items-center rounded-full text-stone-400 hover:bg-stone-100" aria-label="Hapus pencarian">
                <FiX aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="hide-scrollbar -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 xl:hidden" role="group" aria-label="Filter kategori">
            <button
              type="button"
              onClick={() => setSelectedCategories([])}
              className={cn(
                "focus-ring min-h-10 shrink-0 rounded-full px-4 py-2 text-sm font-bold transition",
                selectedCategories.length === 0 ? "bg-brand-700 text-white shadow-md" : "border border-stone-200 bg-white text-stone-600",
              )}
              aria-pressed={selectedCategories.length === 0}
            >
              Semua
            </button>
            {categories.map((category) => {
              const active = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    "focus-ring min-h-10 shrink-0 rounded-full px-4 py-2 text-sm font-bold transition",
                    active ? "bg-brand-700 text-white shadow-md" : "border border-stone-200 bg-white text-stone-600 hover:border-brand-200",
                  )}
                  aria-pressed={active}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 xl:hidden">
            <Button type="button" variant="secondary" onClick={() => setFiltersOpen((value) => !value)} aria-expanded={filtersOpen}>
              <FiFilter aria-hidden="true" /> Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
            <button
              type="button"
              onClick={() => setHalalOnly((value) => !value)}
              className={cn(
                "focus-ring inline-flex min-h-11 items-center gap-1.5 rounded-2xl px-3.5 text-xs font-black transition",
                halalOnly ? "bg-brand-700 text-white" : "border border-stone-200 bg-white text-stone-600",
              )}
              aria-pressed={halalOnly}
            >
              <FiShield aria-hidden="true" /> Halal {halalOnly ? "aktif" : "saja"}
            </button>
          </div>

          {filtersOpen && (
            <div className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 xl:hidden">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-black text-stone-900">Semua filter</p>
                <button type="button" onClick={resetFilters} className="focus-ring min-h-10 rounded-xl text-sm font-black text-brand-700">Reset</button>
              </div>
              <CategoryFilters selectedCategories={selectedCategories} onToggle={toggleCategory} />
              <p className="mt-3 rounded-xl bg-brand-50 p-3 text-xs leading-5 text-brand-800">
                Radius preferensi: <b>{formatDistanceMeters(preferences.maxRadiusMeter)}</b>
              </p>
            </div>
          )}
        </div>

        <div className="hidden items-center gap-2 text-sm md:flex">
          <span className="text-stone-500">Indikator:</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 font-bold text-brand-700"><FiShield aria-hidden="true" /> Terverifikasi</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 font-bold text-blue-700"><FiZap aria-hidden="true" /> Dianalisis AI</span>
        </div>

        <div className="flex items-end justify-between gap-3 px-1">
          <div>
            <h2 id="catalog-title" className="text-lg font-black text-stone-900 sm:text-xl">Kantong Tersedia</h2>
            <p className="mt-1 text-xs text-stone-500 sm:text-sm"><b className="text-stone-800">{filtered.length}</b> hasil, diurutkan dari terdekat</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => <div key={item} className="h-64 animate-pulse rounded-2xl bg-white sm:rounded-3xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Tidak ada Kantong Surplus"
            description="Belum ada listing yang cocok dengan pencarian dan filter. Coba kategori lain atau longgarkan preferensi di Settings."
            action={<Button type="button" onClick={resetFilters}><FiSearch aria-hidden="true" /> Reset pencarian</Button>}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((item, index) => <FoodCard key={item.id} listing={item} index={index} />)}
          </div>
        )}

        <p className="px-1 text-xs leading-5 text-stone-400">
          Harga, lokasi, dan stok dapat berubah. Pastikan Anda datang sebelum batas waktu pengambilan.
        </p>
      </section>
    </div>
  );
}
