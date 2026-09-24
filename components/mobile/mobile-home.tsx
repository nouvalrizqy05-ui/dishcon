"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiBell, FiCheckCircle, FiChevronRight, FiClock, FiFeather, FiMap, FiMapPin, FiSearch, FiUsers, FiZap } from "react-icons/fi";
import { useAuth, roleHome } from "@/lib/auth-context";
import { useDishconData } from "@/lib/dishcon-store";
import { buildMapsDirectionsUrl, formatDistanceMeters, haversineDistanceMeters } from "@/lib/maps";
import { isListingOrderable } from "@/lib/listings";
import { buildReceivedNutritionSummary, formatNutritionValue } from "@/lib/nutrition";
import { MetricCard, StatusBadge, formatRupiah } from "@/components/pages/shared";
import { BottomNav } from "./bottom-nav";
import { FoodCard } from "./food-card";
import { PromoBanner } from "./promo-banner";
import {
  MdCake,
  MdFastfood,
  MdLocalCafe,
  MdRamenDining,
  MdRestaurantMenu,
  MdRiceBowl,
} from "react-icons/md";

const categories = ["Semua", "Makanan Berat", "Jajanan", "Minuman", "Paket Nasi", "Katering"];

const categoryIcons = [
  { icon: MdRiceBowl, label: "Nasi", category: "Makanan Berat" },
  { icon: MdRamenDining, label: "Mie", category: "Makanan Berat" },
  { icon: MdCake, label: "Kue", category: "Jajanan" },
  { icon: MdLocalCafe, label: "Kopi", category: "Minuman" },
  { icon: MdFastfood, label: "Snack", category: "Jajanan" },
];

export function MobileHome() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { listings, reservations, kosShares, notifications, loading, preferences } = useDishconData();
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?next=/mahasiswa/dashboard");
      return;
    }
    if (user.role !== "mahasiswa") router.replace(roleHome(user.role));
  }, [authLoading, router, user]);

  if (authLoading || !user || user.role !== "mahasiswa") {
    return (
      <div className="grid min-h-[100dvh] max-w-md place-items-center bg-[#f8faf8] px-5">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-brand-100" />
          <p className="mt-4 text-sm font-bold text-stone-500">Memuat Home...</p>
        </div>
      </div>
    );
  }

  const unread = notifications.filter((notification) => !notification.is_read).length;
  const available = listings
    .map((item) => ({
      ...item,
      distanceMeter: user.lat && user.lng ? haversineDistanceMeters(user.lat, user.lng, item.lat, item.lng) : Infinity,
    }))
    .filter((item) => {
      const isActive = isListingOrderable(item);
      const categoryMatch = activeCategory === "Semua" || item.kategori === activeCategory;
      const searchMatch = !searchQuery || `${item.nama_makanan} ${item.kategori} ${item.lokasi}`.toLowerCase().includes(searchQuery.toLowerCase());
      const halalMatch = !preferences.halal || item.halal;
      const preferredCategoryMatch = preferences.preferredCategories.length === 0 || preferences.preferredCategories.includes(item.kategori);
      const distanceMatch = !Number.isFinite(item.distanceMeter) || item.distanceMeter <= preferences.maxRadiusMeter;
      return isActive && categoryMatch && searchMatch && halalMatch && preferredCategoryMatch && distanceMatch;
    })
    .sort((a, b) => a.distanceMeter - b.distanceMeter);

  const completedReservations = reservations.filter((reservation) => reservation.status === "completed");
  const activeReservations = reservations.filter((reservation) => reservation.status === "reserved");
  const bagsTaken = completedReservations.reduce((sum, reservation) => sum + reservation.jumlah, 0);
  const totalSavings = completedReservations.reduce((sum, reservation) => {
    const item = listings.find((listing) => listing.id === reservation.listing_id);
    return sum + (item ? (item.harga_normal - item.harga_diskon) * reservation.jumlah : 0);
  }, 0);
  const nextReservation = activeReservations[0];
  const nextListing = listings.find((item) => item.id === nextReservation?.listing_id);
  const nutritionSummary = buildReceivedNutritionSummary(reservations, listings);

  function openPickupMap() {
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
    <div className="relative mx-auto min-h-[100dvh] max-w-md overflow-hidden bg-[#f8faf8] shadow-2xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 rounded-b-[40px] bg-gradient-to-b from-[#d1f0d9] via-[#e3f5e8] to-transparent" />

      <div className="relative z-10 px-5 pb-28 pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
              <FiMapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Lokasi Saat Ini</span>
            </div>
            <p className="mt-0.5 truncate text-sm font-bold text-stone-900">{user.address || "Sekitar Kampus UNNES"}</p>
          </div>
          <Link href="/mahasiswa/notifications" aria-label={`Notifikasi${unread > 0 ? `, ${unread} belum dibaca` : ""}`} className="relative rounded-full bg-white/80 p-2.5 shadow-sm backdrop-blur-sm transition hover:bg-white">
            <FiBell className="h-5 w-5 text-stone-700" aria-hidden="true" />
            {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">{unread > 99 ? "99+" : unread}</span>}
          </Link>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-stone-100 bg-white px-4 py-3 shadow-sm focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100">
          <FiSearch className="mr-1 h-[18px] w-[18px] shrink-0 text-stone-400" aria-hidden="true" />
          <input
            type="search"
            aria-label="Cari makanan atau lokasi"
            placeholder="Cari makanan atau lokasi..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-400"
          />
        </div>

        <div className="hide-scrollbar mt-5 flex gap-2.5 overflow-x-auto pb-1" role="group" aria-label="Kategori makanan">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                activeCategory === category
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                  : "border border-stone-200 bg-white text-stone-600 hover:border-brand-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-5 flex justify-between px-2" role="group" aria-label="Kategori cepat">
          {categoryIcons.map((category) => {
            const Icon = category.icon;
            const active = activeCategory === category.category;
            return (
              <button key={category.label} type="button" onClick={() => setActiveCategory(active ? "Semua" : category.category)} aria-pressed={active} className="group flex flex-col items-center gap-1.5">
                <div className={`grid h-14 w-14 place-items-center rounded-2xl border bg-white shadow-sm transition-all group-active:scale-95 ${active ? "border-brand-300 text-brand-700 ring-2 ring-brand-100" : "border-stone-100 text-brand-600 group-hover:shadow-md"}`}>
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <span className="text-[11px] font-medium text-stone-600">{category.label}</span>
              </button>
            );
          })}
        </div>

        <PromoBanner />

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div><h3 className="text-base font-bold text-stone-900">Kantong Surplus Terdekat</h3><p className="mt-0.5 text-[10px] text-stone-500">{available.length} pilihan{user.lat && user.lng ? ` · radius ${formatDistanceMeters(preferences.maxRadiusMeter)}` : " · lokasi belum lengkap"}</p></div>
            <Link href="/mahasiswa/catalog" className="flex items-center gap-0.5 text-sm font-semibold text-brand-600 hover:text-brand-700">Semua <FiChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
          </div>

          {loading ? (
            <div className="mt-3 grid grid-cols-2 gap-3">{[1, 2, 3, 4].map((item) => <div key={item} className="h-48 animate-pulse rounded-2xl bg-white shadow-sm" />)}</div>
          ) : available.length === 0 ? (
            <div className="mt-3 flex flex-col items-center rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center shadow-sm">
              <MdRestaurantMenu className="h-12 w-12 text-stone-300" aria-hidden="true" />
              <p className="mt-3 text-sm font-bold text-stone-700">Belum ada kantong surplus</p>
              <p className="mt-1 text-xs text-stone-500">Katalog akan terisi saat mitra memposting Kantong Surplus.</p>
              <Link href="/mahasiswa/catalog" className="mt-3 inline-flex min-h-10 items-center justify-center rounded-xl bg-brand-600 px-4 text-xs font-black text-white">Buka Katalog</Link>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-3">{available.slice(0, 6).map((item, index) => <FoodCard key={item.id} listing={item} index={index} />)}</div>
          )}
        </div>

        <section className="mt-6 grid grid-cols-2 gap-3" aria-label="Ringkasan aktivitas">
          <MetricCard icon={FiClock} label="Menunggu Diambil" value={activeReservations.length} hint="Reservasi aktif" />
          <MetricCard icon={FiCheckCircle} label="Kantong Diambil" value={bagsTaken} hint="Total selesai" tone="orange" />
          <MetricCard icon={FiFeather} label="Total Hemat" value={formatRupiah(totalSavings)} hint="vs. harga normal" />
          <MetricCard icon={FiUsers} label="Berbagi Kos" value={kosShares.filter((share) => share.status === "tersedia").length} hint="Item tersedia" />
        </section>

        <section className="mt-4 rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white shadow-card" aria-labelledby="mobile-pickup-title">
          <div className="flex items-center gap-2"><FiMap className="h-6 w-6" aria-hidden="true" /><h3 id="mobile-pickup-title" className="text-lg font-black">Navigasi Pengambilan</h3></div>
          {nextListing ? <div className="mt-3 rounded-2xl bg-white/10 p-3.5 text-sm"><b>{nextListing.nama_makanan}</b><p className="mt-1 text-white/75">Kode: {nextReservation?.kode_pengambilan}</p><p className="text-white/75">Tujuan: {nextListing.lokasi}</p></div> : <p className="mt-3 rounded-2xl bg-white/10 p-3.5 text-sm leading-6 text-white/75">Belum ada reservasi aktif yang menunggu diambil.</p>}
          <button type="button" onClick={openPickupMap} disabled={!nextListing} className="mt-4 min-h-11 w-full rounded-2xl bg-white px-4 text-sm font-black text-brand-800 shadow-sm transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50">Buka Peta Navigasi</button>
        </section>

        <section className="mt-4 rounded-3xl bg-white p-4 shadow-sm" aria-labelledby="mobile-reservations-title">
          <div className="flex items-center justify-between gap-3"><h3 id="mobile-reservations-title" className="font-black text-stone-900">Reservasi Terbaru</h3><Link href="/mahasiswa/history" className="text-xs font-black text-brand-700">Lihat semua</Link></div>
          {reservations.length === 0 ? <p className="mt-3 rounded-2xl bg-stone-50 p-3 text-xs leading-5 text-stone-500">Pesan Kantong Surplus dan tiket digital akan muncul di sini.</p> : <div className="mt-3 space-y-2.5">{reservations.slice(0, 4).map((reservation) => { const item = listings.find((listing) => listing.id === reservation.listing_id); return <article key={reservation.id} className="rounded-2xl border border-stone-200 p-3"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-sm font-black text-stone-900">{item?.nama_makanan || "Kantong surplus"}</p><p className="mt-1 text-[11px] text-stone-500">{reservation.jumlah} kantong · {formatRupiah(reservation.total_harga)}</p></div><StatusBadge status={reservation.status} /></div>{reservation.status === "reserved" && <p className="mt-2 text-[10px] font-bold text-brand-700">Kode: {reservation.kode_pengambilan}</p>}</article>; })}</div>}
        </section>

        <section className="mt-4 rounded-3xl border border-brand-100 bg-brand-50 p-4">
          <div className="flex items-center gap-2"><FiUsers className="h-5 w-5 text-brand-700" aria-hidden="true" /><h3 className="font-black text-brand-900">Berbagi Antar Kos</h3></div>
          <p className="mt-2 text-xs leading-5 text-brand-800">Temukan bahan makanan dari mahasiswa sekitar atau bagikan milikmu.</p>
          <Link href="/mahasiswa/kos-share" className="mt-3 flex min-h-11 items-center justify-center rounded-2xl bg-white px-4 text-sm font-black text-brand-700 shadow-sm">Buka Komunitas</Link>
        </section>

        <section className="mt-4 rounded-3xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2"><FiZap className="h-5 w-5 text-blue-700" aria-hidden="true" /><h3 className="font-black text-stone-900">Ringkasan Nutrisi</h3></div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs"><div className="rounded-2xl bg-blue-50 p-3"><span className="text-blue-700">Kalori</span><b className="mt-0.5 block text-blue-900">{formatNutritionValue(nutritionSummary.totals.calories, "kkal")}</b></div><div className="rounded-2xl bg-brand-50 p-3"><span className="text-brand-700">Protein</span><b className="mt-0.5 block text-brand-900">{formatNutritionValue(nutritionSummary.totals.protein, "g")}</b></div><div className="rounded-2xl bg-orange-50 p-3"><span className="text-orange-700">Karbo</span><b className="mt-0.5 block text-orange-900">{formatNutritionValue(nutritionSummary.totals.carbohydrate, "g")}</b></div><div className="rounded-2xl bg-stone-50 p-3"><span className="text-stone-500">Lemak</span><b className="mt-0.5 block text-stone-900">{formatNutritionValue(nutritionSummary.totals.fat, "g")}</b></div></div>
        </section>

      </div>

      <BottomNav role="mahasiswa" className="max-w-md" />
    </div>
  );
}
