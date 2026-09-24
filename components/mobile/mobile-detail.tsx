"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiMap,
  FiMapPin,
  FiMinus,
  FiPlus,
  FiSearch,
  FiShare2,
  FiShield,
  FiUser,
  FiZap,
} from "react-icons/fi";
import {
  MdFastfood,
  MdLocalCafe,
  MdRamenDining,
  MdRestaurant,
  MdRiceBowl,
  MdSoupKitchen,
  MdTakeoutDining,
} from "react-icons/md";
import type { IconType } from "react-icons";
import { Button } from "@/components/ui/button";
import { useAuth, roleHome } from "@/lib/auth-context";
import { useDishconData } from "@/lib/dishcon-store";
import { buildMapsDirectionsUrl, formatDistanceMeters, haversineDistanceMeters } from "@/lib/maps";
import { isListingExpired, isListingOrderable } from "@/lib/listings";
import { StatusBadge, formatRupiah } from "@/components/pages/shared";

const foodIcons: Record<string, IconType> = {
  "Makanan Berat": MdRiceBowl,
  Jajanan: MdFastfood,
  Minuman: MdLocalCafe,
  "Paket Nasi": MdTakeoutDining,
  Katering: MdSoupKitchen,
};

const gradients = ["from-amber-100 to-orange-100", "from-green-100 to-emerald-100", "from-blue-100 to-cyan-100", "from-pink-100 to-rose-100"];

function InfoBox({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return <div className="min-w-0 rounded-2xl bg-stone-50 p-3"><div className="flex items-center gap-1.5">{icon}<span className="truncate text-[10px] font-bold uppercase tracking-widest text-stone-400">{label}</span></div><p className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-stone-900">{value || "-"}</p></div>;
}

export function MobileDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { listings, profiles, loading, reserveListing } = useDishconData();
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?next=/mahasiswa/catalog");
      return;
    }
    if (user.role !== "mahasiswa") router.replace(roleHome(user.role));
  }, [authLoading, router, user]);

  const listing = listings.find((item) => item.id === params.id);
  const mitra = profiles.find((profile) => profile.id === listing?.mitra_id);
  const distance = listing && user?.lat && user?.lng ? haversineDistanceMeters(user.lat, user.lng, listing.lat, listing.lng) : undefined;
  const available = listing?.jumlah_tersedia ?? listing?.jumlah_kantong ?? 0;
  const expired = Boolean(listing && isListingExpired(listing));
  const orderable = Boolean(listing && isListingOrderable(listing));
  const discount = listing && listing.harga_normal > listing.harga_diskon ? Math.round(((listing.harga_normal - listing.harga_diskon) / listing.harga_normal) * 100) : 0;
  const Icon = foodIcons[listing?.kategori || ""] || MdRestaurant;
  const gradient = gradients[(params.id || "").charCodeAt(0) % gradients.length];

  function changeQuantity(next: number) {
    setQuantity(Math.max(1, Math.min(available || 1, next)));
    setConfirming(false);
  }

  async function submitReservation() {
    if (!listing) return;
    setMessage("");
    setSubmitting(true);
    try {
      await reserveListing(listing.id, quantity);
      setMessageType("success");
      setMessage("Reservasi berhasil! Lihat kode pengambilan di Riwayat.");
      setTimeout(() => router.push("/mahasiswa/history"), 1200);
    } catch (error) {
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : "Reservasi gagal dibuat.");
    } finally {
      setSubmitting(false);
    }
  }

  async function shareListing() {
    if (!listing) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: listing.nama_makanan, text: `Amankan Kantong Surplus ${listing.nama_makanan} di DishCon.`, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 1800);
      }
    } catch {
      // Menutup share sheet bukan error.
    }
  }

  if (authLoading || !user || user.role !== "mahasiswa") return <div className="grid min-h-[100dvh] max-w-md place-items-center bg-[#f8faf8]"><div className="h-12 w-12 animate-pulse rounded-full bg-brand-100" /></div>;
  if (loading) return <div className="grid min-h-[100dvh] max-w-md place-items-center bg-[#f8faf8]"><div className="text-center"><div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-brand-100" /><p className="mt-4 text-sm font-bold text-stone-500">Memuat detail...</p></div></div>;
  if (!listing) return <div className="min-h-[100dvh] bg-[#f8faf8]"><div className="p-5 pt-6"><Link href="/mahasiswa/catalog" className="inline-flex rounded-full bg-white p-2 shadow-sm" aria-label="Kembali ke Katalog"><FiArrowLeft className="h-5 w-5 text-stone-700" /></Link></div><div className="flex flex-col items-center justify-center p-12 text-center"><FiSearch className="h-12 w-12 text-stone-300" /><p className="mt-4 font-bold text-stone-700">Kantong surplus tidak ditemukan</p><p className="mt-2 text-sm text-stone-500">Listing tidak tersedia atau sudah habis.</p><Button asChild className="mt-5"><Link href="/mahasiswa/catalog">Kembali ke Katalog</Link></Button></div></div>;

  const deadline = new Date(listing.batas_waktu).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });
  const allergens = listing.nutrition?.allergens || [];

  return (
    <div className="relative mx-auto min-h-[100dvh] max-w-md overflow-hidden bg-[#f8faf8] shadow-2xl">
      <div className={`relative h-64 bg-gradient-to-br ${gradient}`}>
        {listing.image_url ? <Image src={listing.image_url} alt={listing.nama_makanan} fill className="object-cover" sizes="100vw" priority /> : <div className="flex h-full w-full items-center justify-center text-brand-700/25"><Icon className="h-24 w-24" aria-hidden="true" /></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <button type="button" onClick={() => router.back()} aria-label="Kembali" className="absolute left-4 top-[calc(1rem+env(safe-area-inset-top))] z-10 grid min-h-11 min-w-11 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white"><FiArrowLeft className="h-5 w-5 text-stone-700" /></button>
        <div className="absolute right-4 top-[calc(1rem+env(safe-area-inset-top))] z-10 flex gap-2"><Link href="/mahasiswa/profile" aria-label="Buka profil" className="grid min-h-11 min-w-11 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white"><FiUser className="h-[18px] w-[18px] text-stone-700" /></Link><button type="button" onClick={shareListing} aria-label="Bagikan Kantong Surplus" className="grid min-h-11 min-w-11 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white"><FiShare2 className="h-[18px] w-[18px] text-stone-700" /></button></div>
        {discount > 0 && <div className="absolute bottom-4 left-4 z-10 rounded-full bg-red-500 px-3 py-1.5 text-sm font-black text-white shadow-md">Diskon {discount}%</div>}
        {shared && <span className="absolute right-4 top-16 z-10 rounded-full bg-stone-900/80 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur">Tautan disalin</span>}
      </div>

      <div className="relative z-10 -mt-6 min-h-[60vh] rounded-t-3xl bg-white p-5 pb-44">
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={listing.status} />
          {listing.halal && <span className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700"><FiShield className="h-3 w-3" /> Halal</span>}
          {listing.nutrition && <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"><FiZap className="h-3 w-3" /> AI Verified</span>}
          <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">{listing.kategori}</span>
        </div>

        <h2 className="mt-4 text-2xl font-black text-stone-900">{listing.nama_makanan}</h2>
        <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-brand-700"><FiCheckCircle className="h-3.5 w-3.5" aria-hidden="true" /> Status &amp; informasi listing</div>
        <div className="mt-3 flex items-start gap-2"><FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" /><p className="text-sm text-stone-600">{listing.lokasi}</p></div>
        {distance !== undefined && Number.isFinite(distance) && <p className="ml-6 mt-1 text-xs font-bold text-brand-600">{formatDistanceMeters(distance)} dari lokasi Anda</p>}

        <div className="mt-4 flex items-baseline gap-3"><span className="text-3xl font-black text-brand-700">{formatRupiah(listing.harga_diskon)}</span>{discount > 0 && <span className="text-base font-semibold text-stone-400 line-through">{formatRupiah(listing.harga_normal)}</span>}</div>

        <div className="mt-5 grid grid-cols-3 gap-2"><InfoBox label="Tersisa" value={`${available} kantong`} /><InfoBox label="Batas" value={deadline} icon={<FiClock className="h-2.5 w-2.5 text-orange-500" />} /><InfoBox label="Mitra" value={mitra?.nama_usaha || mitra?.name || "UMKM"} /></div>

        <div className="mt-5"><h3 className="font-bold text-stone-900">Deskripsi</h3><p className="mt-2 text-sm leading-6 text-stone-600">{listing.deskripsi || "Tidak ada deskripsi tambahan dari mitra."}</p></div>

        <div className="mt-5 grid grid-cols-2 gap-2"><InfoBox label="Penyimpanan" value={listing.metode_penyimpanan || "-"} /><InfoBox label="Waktu Produksi" value={listing.waktu_produksi ? new Date(listing.waktu_produksi).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) : "-"} /></div>

        {listing.nutrition && <div className="mt-5"><div className="flex items-center gap-2"><FiZap className="text-blue-600" /><h3 className="font-bold text-stone-900">Analisis AI Nutrisi</h3></div><div className="mt-3 grid grid-cols-2 gap-2"><div className="rounded-2xl bg-blue-50 p-3"><span className="text-[10px] font-bold uppercase text-blue-600">Kalori</span><p className="mt-0.5 text-sm font-black text-blue-900">{listing.nutrition.calories_estimate ?? listing.nutrition.calories ?? "-"}</p></div><div className="rounded-2xl bg-green-50 p-3"><span className="text-[10px] font-bold uppercase text-green-600">Protein</span><p className="mt-0.5 text-sm font-black text-green-900">{listing.nutrition.protein ?? "-"}</p></div><div className="rounded-2xl bg-orange-50 p-3"><span className="text-[10px] font-bold uppercase text-orange-600">Karbohidrat</span><p className="mt-0.5 text-sm font-black text-orange-900">{listing.nutrition.carbohydrate ?? listing.nutrition.carbs ?? "-"}</p></div><div className="rounded-2xl bg-purple-50 p-3"><span className="text-[10px] font-bold uppercase text-purple-600">Lemak</span><p className="mt-0.5 text-sm font-black text-purple-900">{listing.nutrition.fat ?? "-"}</p></div></div><div className="mt-3 grid grid-cols-2 gap-2"><div className="rounded-2xl bg-stone-50 p-3"><span className="text-[10px] font-bold uppercase text-stone-500">Serat</span><p className="mt-0.5 text-sm font-black text-stone-800">{listing.nutrition.fiber ?? "-"}</p></div><div className="rounded-2xl bg-stone-50 p-3"><span className="text-[10px] font-bold uppercase text-stone-500">Sodium</span><p className="mt-0.5 text-sm font-black text-stone-800">{listing.nutrition.sodium ?? "-"}</p></div></div><p className="mt-3 text-xs leading-5 text-stone-600"><b>Bahan utama:</b> {Array.isArray(listing.nutrition.ingredients_detected) && listing.nutrition.ingredients_detected.length ? listing.nutrition.ingredients_detected.join(", ") : "Belum terdeteksi"}</p>{(listing.nutrition.nutrition_note || listing.nutrition.recommendation) && <p className="mt-2 text-xs leading-5 text-stone-500"><b>Catatan:</b> {listing.nutrition.nutrition_note || listing.nutrition.recommendation}</p>}{allergens.length > 0 && <div className="mt-3 rounded-2xl border border-red-100 bg-red-50 p-3"><span className="text-[10px] font-bold uppercase text-red-600">Alergen</span><p className="mt-0.5 text-sm font-bold text-red-900">{allergens.join(", ")}</p></div>}</div>}

        {listing.expiry && <div className="mt-5"><div className="flex items-center gap-2"><FiClock className="text-orange-600" /><h3 className="font-bold text-stone-900">Risiko Kedaluwarsa</h3></div><div className="mt-3 grid grid-cols-2 gap-2"><InfoBox label="Tingkat Risiko" value={listing.expiry.risk_level || "-"} /><InfoBox label="Aman" value={listing.expiry.safe_hours !== undefined ? `${listing.expiry.safe_hours} jam` : "-"} /></div><div className="mt-3 grid grid-cols-2 gap-2"><InfoBox label="Konsumsi Sebelum" value={listing.expiry.recommended_consume_before || "-"} /><InfoBox label="Peringatan" value={Array.isArray(listing.expiry.food_safety_warnings) && listing.expiry.food_safety_warnings.length ? listing.expiry.food_safety_warnings.join(", ") : "Tidak ada"} /></div>{listing.expiry.storage_recommendation && <p className="mt-2 rounded-xl bg-stone-50 p-3 text-xs leading-5 text-stone-500">{listing.expiry.storage_recommendation}</p>}</div>}

        <button type="button" onClick={() => window.open(buildMapsDirectionsUrl(user?.lat && user?.lng ? { lat: user.lat, lng: user.lng } : undefined, { lat: listing.lat, lng: listing.lng }), "_blank", "noopener,noreferrer")} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-100 py-3 text-sm font-bold text-stone-700 transition hover:bg-stone-200"><FiMap className="h-[18px] w-[18px]" /> Buka Peta Navigasi</button>


        {message && <div role="status" aria-live="polite" className={`mt-4 rounded-2xl border p-3 text-center text-sm font-bold ${messageType === "success" ? "border-brand-200 bg-brand-50 text-brand-700" : "border-red-200 bg-red-50 text-red-700"}`}>{messageType === "success" && <FiCheckCircle className="mr-1 inline" />}{message}</div>}
        {!orderable && <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50 p-4 text-center"><FiClock className="mx-auto h-6 w-6 text-orange-600" aria-hidden="true" /><h3 className="mt-2 font-black text-orange-900">{expired ? "Batas pengambilan sudah lewat" : "Kantong tidak tersedia"}</h3><p className="mt-1 text-xs leading-5 text-orange-800">{expired ? "Cari Kantong Surplus lain yang masih bisa diambil." : "Listing ini sudah habis, ditolak, atau tidak dapat dipesan."}</p><Link href="/mahasiswa/catalog" className="mt-3 inline-flex min-h-10 items-center justify-center rounded-xl bg-white px-4 text-xs font-black text-orange-800 shadow-sm">Cari Kantong Lain</Link></div>}
      </div>

      {orderable && <div className="mobile-safe-bottom fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-white/70 bg-white/80 px-5 py-4 shadow-[0_-10px_35px_rgba(15,40,26,0.12)] backdrop-blur-xl">{!confirming ? <div className="flex items-center gap-3"><div className="flex items-center gap-1 rounded-2xl bg-stone-100 p-1"><button type="button" onClick={() => changeQuantity(quantity - 1)} disabled={submitting || quantity <= 1} aria-label="Kurangi jumlah" className="grid h-11 w-11 place-items-center rounded-xl bg-white text-stone-700 shadow-sm disabled:opacity-40"><FiMinus className="h-4 w-4" /></button><span className="w-8 text-center font-black text-stone-900">{quantity}</span><button type="button" onClick={() => changeQuantity(quantity + 1)} disabled={submitting || quantity >= available} aria-label="Tambah jumlah" className="grid h-11 w-11 place-items-center rounded-xl bg-white text-stone-700 shadow-sm disabled:opacity-40"><FiPlus className="h-4 w-4" /></button></div><button type="button" onClick={() => setConfirming(true)} disabled={submitting} className="flex-1 rounded-2xl bg-brand-600 py-3.5 text-sm font-black text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:opacity-50">Pesan · {formatRupiah(listing.harga_diskon * quantity)}</button></div> : <div className="space-y-3"><p className="rounded-xl bg-amber-50 p-2.5 text-center text-xs font-bold leading-5 text-amber-700">Pastikan Anda bisa mengambil sebelum batas waktu.</p><div className="flex gap-2"><button type="button" onClick={() => setConfirming(false)} disabled={submitting} className="flex-1 rounded-2xl bg-stone-100 py-3 text-sm font-bold text-stone-700">Batal</button><button type="button" onClick={submitReservation} disabled={submitting} className="flex-1 rounded-2xl bg-brand-600 py-3 text-sm font-black text-white shadow-lg shadow-brand-600/25 disabled:opacity-50">{submitting ? "Memproses..." : "Konfirmasi ✓"}</button></div></div>}</div>}
    </div>
  );
}
