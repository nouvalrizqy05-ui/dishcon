"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiFeather,
  FiMap,
  FiMapPin,
  FiSearch,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import {
  MdCake,
  MdFastfood,
  MdLocalCafe,
  MdRamenDining,
  MdRestaurantMenu,
  MdRiceBowl,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import { FoodCard } from "@/components/mobile/food-card";
import { PromoBanner } from "@/components/mobile/promo-banner";
import { useDishconData } from "@/lib/dishcon-store";
import { useAuth } from "@/lib/auth-context";
import { buildMapsDirectionsUrl, formatDistanceMeters, haversineDistanceMeters } from "@/lib/maps";
import { isListingOrderable } from "@/lib/listings";
import { buildReceivedNutritionSummary, formatNutritionValue } from "@/lib/nutrition";
import { EmptyState, MetricCard, StatusBadge, formatRupiah } from "@/components/pages/shared";

const categories = ["Semua", "Makanan Berat", "Jajanan", "Minuman", "Paket Nasi", "Katering"];

const categoryShortcuts = [
  { icon: MdRiceBowl, label: "Nasi", category: "Makanan Berat" },
  { icon: MdRamenDining, label: "Mie", category: "Makanan Berat" },
  { icon: MdCake, label: "Kue", category: "Jajanan" },
  { icon: MdLocalCafe, label: "Kopi", category: "Minuman" },
  { icon: MdFastfood, label: "Snack", category: "Jajanan" },
];

export function MahasiswaDashboardPage() {
  const { user } = useAuth();
  const { reservations, listings, kosShares, loading, preferences } = useDishconData();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const menunggu = reservations.filter((reservation) => reservation.status === "reserved").length;
  const completedReservations = reservations.filter((reservation) => reservation.status === "completed");
  const kantongDiambil = completedReservations.reduce((sum, item) => sum + item.jumlah, 0);
  const totalHemat = completedReservations.reduce((sum, item) => {
    const listing = listings.find((candidate) => candidate.id === item.listing_id);
    return sum + (listing ? (listing.harga_normal - listing.harga_diskon) * item.jumlah : 0);
  }, 0);

  const availableListings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return listings
      .map((item) => ({
        ...item,
        distanceMeter: user?.lat && user?.lng
          ? haversineDistanceMeters(user.lat, user.lng, item.lat, item.lng)
          : Infinity,
      }))
      .filter((item) => {
        const isActive = isListingOrderable(item);
        const categoryMatch = activeCategory === "Semua" || item.kategori === activeCategory;
        const searchMatch = !normalizedQuery || `${item.nama_makanan} ${item.kategori} ${item.lokasi}`.toLowerCase().includes(normalizedQuery);
        const halalMatch = !preferences.halal || item.halal;
        const preferredCategoryMatch = preferences.preferredCategories.length === 0 || preferences.preferredCategories.includes(item.kategori);
        const distanceMatch = !Number.isFinite(item.distanceMeter) || item.distanceMeter <= preferences.maxRadiusMeter;
        return isActive && categoryMatch && searchMatch && halalMatch && preferredCategoryMatch && distanceMatch;
      })
      .sort((a, b) => a.distanceMeter - b.distanceMeter);
  }, [activeCategory, listings, preferences.halal, preferences.maxRadiusMeter, preferences.preferredCategories, query, user?.lat, user?.lng]);

  const nextReservation = reservations.find((reservation) => reservation.status === "reserved");
  const nextListing = listings.find((item) => item.id === nextReservation?.listing_id);
  const nutritionSummary = buildReceivedNutritionSummary(reservations, listings);

  function openMap() {
    if (!nextListing) return;
    window.open(
      buildMapsDirectionsUrl(
        user?.lat && user?.lng ? { lat: user.lat, lng: user.lng } : undefined,
        { lat: nextListing.lat, lng: nextListing.lng },
      ),
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-5">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-100 via-emerald-50 to-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6 lg:p-7" aria-labelledby="student-home-title">
          <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-white/45" />
          <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-brand-200/20" />
          <div className="relative z-10">
            <div className="flex items-start gap-2 text-stone-600">
              <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider sm:text-xs">Lokasi saat ini</p>
                <p className="truncate text-sm font-black text-stone-900">{user?.address || "Sekitar Kampus UNNES"}</p>
              </div>
            </div>

            <h2 id="student-home-title" className="mt-5 max-w-xl text-2xl font-black leading-tight text-stone-950 sm:text-3xl lg:text-4xl">
              Temukan Kantong Surplus terdekat, warga kos.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
              Cari makanan layak pakai dengan harga lebih ringan di sekitar kos.
            </p>

            <label className="mt-5 flex min-h-12 items-center gap-3 rounded-2xl border border-stone-200/80 bg-white px-4 py-3 shadow-sm focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
              <FiSearch className="h-5 w-5 shrink-0 text-stone-400" aria-hidden="true" />
              <span className="sr-only">Cari makanan atau lokasi</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari makanan atau lokasi..."
                className="min-w-0 flex-1 bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-400 sm:text-sm"
              />
            </label>

            <div className="hide-scrollbar -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Kategori makanan">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`focus-ring min-h-10 shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                    activeCategory === category
                      ? "bg-brand-700 text-white shadow-md shadow-brand-700/20"
                      : "border border-stone-200 bg-white/90 text-stone-600 hover:border-brand-200 hover:text-brand-700"
                  }`}
                  aria-pressed={activeCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-5 gap-2 sm:max-w-xl sm:gap-4" role="group" aria-label="Kategori pilihan cepat">
              {categoryShortcuts.map((category) => {
                const Icon = category.icon;
                const active = activeCategory === category.category;
                return (
                  <button
                    key={category.label}
                    type="button"
                    onClick={() => setActiveCategory(active ? "Semua" : category.category)}
                    className="focus-ring group flex min-w-0 flex-col items-center gap-1.5 rounded-2xl"
                    aria-pressed={active}
                  >
                    <span className={`grid aspect-square w-full max-w-16 place-items-center rounded-2xl border bg-white shadow-sm transition group-active:scale-95 sm:rounded-3xl ${active ? "border-brand-300 text-brand-700 ring-2 ring-brand-100" : "border-stone-200/80 text-brand-600"}`}>
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
                    </span>
                    <span className="truncate text-[10px] font-bold text-stone-600 sm:text-xs">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <PromoBanner className="xl:pt-8" />
      </div>

      <section className="min-w-0" aria-labelledby="nearest-listings-title">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 id="nearest-listings-title" className="text-lg font-black text-stone-900 sm:text-xl">Kantong Surplus Terdekat</h2>
            <p className="mt-1 text-xs leading-5 text-stone-500 sm:text-sm">
              {availableListings.length} pilihan{user?.lat && user?.lng ? ` dalam radius ${formatDistanceMeters(preferences.maxRadiusMeter)}` : " · lokasi belum lengkap"}.
            </p>
          </div>
          <Link href="/mahasiswa/catalog" className="focus-ring inline-flex min-h-10 shrink-0 items-center gap-1 rounded-xl text-sm font-black text-brand-700 hover:text-brand-800">
            Semua <FiChevronRight aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => <div key={item} className="h-64 animate-pulse rounded-2xl bg-white sm:rounded-3xl" />)}
          </div>
        ) : availableListings.length === 0 ? (
          <EmptyState
            title="Belum ada Kantong Surplus"
            description="Coba ubah kata kunci atau kategori. Katalog juga mengikuti preferensi halal dan radius dari pengaturan Anda."
            action={<Button asChild><Link href="/mahasiswa/catalog"><FiSearch /> Buka Katalog</Link></Button>}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-4">
            {availableListings.slice(0, 8).map((item, index) => (
              <FoodCard key={item.id} listing={item} index={index} />
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4" aria-label="Ringkasan aktivitas">
        <MetricCard icon={FiClock} label="Menunggu Diambil" value={menunggu} hint="Reservasi aktif" />
        <MetricCard icon={FiCheckCircle} label="Kantong Diambil" value={kantongDiambil} hint="Total selesai" tone="orange" />
        <MetricCard icon={FiFeather} label="Total Hemat" value={formatRupiah(totalHemat)} hint="vs. harga normal" />
        <MetricCard icon={FiUsers} label="Berbagi Antar Kos" value={kosShares.filter((share) => share.status === "tersedia").length} hint="Item tersedia" />
      </section>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-6">
        <section className="soft-panel min-w-0 p-4 sm:p-6" aria-labelledby="recent-reservations-title">
          <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
            <div>
              <h2 id="recent-reservations-title" className="text-lg font-black text-stone-900 sm:text-xl">Reservasi Terbaru</h2>
              <p className="mt-1 text-sm text-stone-500">Pantau kode dan status pengambilan.</p>
            </div>
            <Link href="/mahasiswa/history" className="focus-ring rounded-xl text-sm font-black text-brand-700">Lihat semua</Link>
          </div>

          {reservations.length === 0 ? (
            <EmptyState title="Belum ada reservasi" description="Pesan Kantong Surplus terdekat dan tiket digital akan muncul di sini." />
          ) : (
            <div className="space-y-3">
              {reservations.slice(0, 4).map((reservation) => {
                const listing = listings.find((item) => item.id === reservation.listing_id);
                return (
                  <article key={reservation.id} className="rounded-2xl border border-stone-200 p-3.5 sm:rounded-3xl sm:p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge status={reservation.status} />
                          <span className="text-[11px] font-bold text-stone-400">{new Date(reservation.created_at).toLocaleDateString("id-ID")}</span>
                        </div>
                        <h3 className="mt-2 truncate font-black text-stone-900">{listing?.nama_makanan || "Kantong surplus"}</h3>
                        <p className="mt-1 text-xs text-stone-500 sm:text-sm">{reservation.jumlah} kantong · {formatRupiah(reservation.total_harga)}</p>
                      </div>
                      {reservation.status === "reserved" && (
                        <div className="shrink-0 rounded-2xl bg-brand-50 px-4 py-2 text-center">
                          <span className="block text-[9px] font-black uppercase tracking-wider text-brand-600">Kode</span>
                          <b className="text-lg tracking-widest text-brand-800">{reservation.kode_pengambilan}</b>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <section className="rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white shadow-card sm:p-6" aria-labelledby="pickup-title">
            <FiMap className="h-7 w-7" aria-hidden="true" />
            <h2 id="pickup-title" className="mt-3 text-xl font-black">Navigasi Pengambilan</h2>
            {nextListing ? (
              <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm">
                <b>{nextListing.nama_makanan}</b>
                <p className="mt-1 text-white/75">Kode: {nextReservation?.kode_pengambilan}</p>
                <p className="mt-1 text-white/75">Tujuan: {nextListing.lokasi}</p>
              </div>
            ) : (
              <p className="mt-4 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/75">Belum ada reservasi aktif yang menunggu diambil.</p>
            )}
            <Button type="button" onClick={openMap} disabled={!nextListing} className="mt-4 w-full bg-white text-brand-800 hover:bg-brand-50">
              <FiMap aria-hidden="true" /> Buka Navigasi
            </Button>
          </section>

          <section className="rounded-3xl border border-brand-100 bg-brand-50 p-5 sm:p-6">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-brand-700 shadow-sm"><FiUsers className="h-5 w-5" aria-hidden="true" /></div>
            <h2 className="mt-3 text-lg font-black text-brand-900">Berbagi Antar Kos</h2>
            <p className="mt-2 text-sm leading-6 text-brand-800">Temukan bahan makanan dari mahasiswa sekitar atau bagikan milikmu.</p>
            <Button asChild variant="secondary" className="mt-4 w-full"><Link href="/mahasiswa/kos-share">Buka Komunitas</Link></Button>
          </section>

          <section className="soft-panel p-5 sm:col-span-2 sm:p-6 xl:col-span-1">
            <div className="flex items-center gap-2">
              <FiZap className="h-5 w-5 text-blue-700" aria-hidden="true" />
              <h2 className="font-black text-stone-900">Ringkasan Nutrisi</h2>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5 text-sm">
              <div className="rounded-2xl bg-blue-50 p-3"><span className="text-xs text-blue-700">Kalori</span><b className="block text-blue-900">{formatNutritionValue(nutritionSummary.totals.calories, "kkal")}</b></div>
              <div className="rounded-2xl bg-brand-50 p-3"><span className="text-xs text-brand-700">Protein</span><b className="block text-brand-900">{formatNutritionValue(nutritionSummary.totals.protein, "g")}</b></div>
              <div className="rounded-2xl bg-orange-50 p-3"><span className="text-xs text-orange-700">Karbo</span><b className="block text-orange-900">{formatNutritionValue(nutritionSummary.totals.carbohydrate, "g")}</b></div>
              <div className="rounded-2xl bg-stone-50 p-3"><span className="text-xs text-stone-500">Lemak</span><b className="block text-stone-900">{formatNutritionValue(nutritionSummary.totals.fat, "g")}</b></div>
            </div>
          </section>
        </aside>
      </div>

      {availableListings.length === 0 && !loading && (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed border-stone-300 bg-white/60 p-4 text-sm text-stone-500">
          <MdRestaurantMenu className="h-5 w-5 shrink-0 text-stone-400" aria-hidden="true" />
          Mitra dapat memposting Kantong Surplus baru agar langsung tampil di beranda.
        </div>
      )}
    </div>
  );
}
