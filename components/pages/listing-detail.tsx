"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiMap,
  FiMapPin,
  FiMinus,
  FiPlus,
  FiShare2,
  FiShield,
  FiShoppingBag,
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
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useDishconData } from "@/lib/dishcon-store";
import { buildMapsDirectionsUrl, formatDistanceMeters, haversineDistanceMeters } from "@/lib/maps";
import { isListingOrderable } from "@/lib/listings";
import { EmptyState, StatusBadge, formatRupiah } from "@/components/pages/shared";
import { cn } from "@/lib/utils";
import type { SurplusListing } from "@/lib/types";

const foodIcons: Record<string, IconType> = {
  "Makanan Berat": MdRiceBowl,
  Jajanan: MdFastfood,
  Minuman: MdLocalCafe,
  "Paket Nasi": MdTakeoutDining,
  Katering: MdSoupKitchen,
};

const gradients = [
  "from-amber-100 to-orange-100",
  "from-green-100 to-emerald-100",
  "from-blue-100 to-cyan-100",
  "from-pink-100 to-rose-100",
];

function InfoBox({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-2xl bg-stone-50 p-3 sm:p-4">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="truncate text-[9px] font-black uppercase tracking-wider text-stone-400 sm:text-[10px]">{label}</span>
      </div>
      <p className="mt-1 line-clamp-2 text-xs font-black leading-5 text-stone-900 sm:text-sm">{value || "-"}</p>
    </div>
  );
}

function NutritionBox({ label, value }: { label: string; value?: unknown }) {
  const displayValue = value !== undefined && value !== null && value !== "" ? String(value) : "-";
  return (
    <div className="rounded-2xl bg-stone-50 p-3.5 sm:p-4">
      <span className="text-[9px] font-black uppercase tracking-wider text-stone-400 sm:text-[10px]">{label}</span>
      <p className="mt-1 text-sm font-black leading-5 text-stone-900 sm:text-base">{displayValue}</p>
    </div>
  );
}

function listValue(value: unknown) {
  return Array.isArray(value) && value.length ? value.join(", ") : "-";
}

type ReservationPanelProps = {
  listing: SurplusListing;
  available: number;
  quantity: number;
  setQuantity: (value: number) => void;
  confirming: boolean;
  setConfirming: (value: boolean) => void;
  submitting: boolean;
  message: string;
  messageType: "success" | "error";
  onSubmit: () => void;
  mobile?: boolean;
};

function ReservationPanel({
  listing,
  available,
  quantity,
  setQuantity,
  confirming,
  setConfirming,
  submitting,
  message,
  messageType,
  onSubmit,
  mobile = false,
}: ReservationPanelProps) {
  const canOrder = isListingOrderable(listing);

  return (
    <div className={cn(mobile && "px-3 py-3 sm:px-5 sm:py-4")}>
      {!canOrder ? (
        <Button disabled className={cn("w-full", mobile && "h-12")}>Kantong Tidak Tersedia</Button>
      ) : confirming ? (
        <div className="space-y-2.5">
          <p className="rounded-xl bg-amber-50 p-2.5 text-center text-xs font-bold leading-5 text-amber-800">
            Pastikan Anda bisa mengambil sebelum batas waktu.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setConfirming(false)} disabled={submitting} className="focus-ring min-h-11 rounded-2xl bg-stone-100 px-4 text-sm font-black text-stone-700">
              Batal
            </button>
            <button type="button" onClick={onSubmit} disabled={submitting} className="focus-ring min-h-11 rounded-2xl bg-brand-700 px-4 text-sm font-black text-white shadow-lg shadow-brand-700/20 disabled:opacity-50">
              {submitting ? "Memproses..." : "Konfirmasi"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex shrink-0 items-center gap-1 rounded-2xl bg-stone-100 p-1">
            <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={submitting || quantity <= 1} className="focus-ring grid h-10 w-10 place-items-center rounded-xl bg-white text-stone-700 shadow-sm disabled:opacity-40" aria-label="Kurangi jumlah">
              <FiMinus aria-hidden="true" />
            </button>
            <span className="w-7 text-center font-black text-stone-900">{quantity}</span>
            <button type="button" onClick={() => setQuantity(Math.min(available, quantity + 1))} disabled={submitting || quantity >= available} className="focus-ring grid h-10 w-10 place-items-center rounded-xl bg-white text-stone-700 shadow-sm disabled:opacity-40" aria-label="Tambah jumlah">
              <FiPlus aria-hidden="true" />
            </button>
          </div>
          <button type="button" onClick={() => setConfirming(true)} disabled={submitting} className="focus-ring min-h-12 min-w-0 flex-1 rounded-2xl bg-brand-700 px-3 text-xs font-black text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-800 disabled:opacity-50 sm:px-4 sm:text-sm">
            <span className="block truncate">Pesan · {formatRupiah(listing.harga_diskon * quantity)}</span>
          </button>
        </div>
      )}

      {message && (
        <p
          role="status"
          aria-live="polite"
          className={cn(
            "mt-2 rounded-xl border px-3 py-2 text-center text-xs font-bold",
            messageType === "success" ? "border-brand-200 bg-brand-50 text-brand-800" : "border-red-200 bg-red-50 text-red-700",
          )}
        >
          {messageType === "success" && <FiCheckCircle className="mr-1 inline" aria-hidden="true" />}
          {message}
        </p>
      )}
    </div>
  );
}

export function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { listings, profiles, loading, reserveListing } = useDishconData();
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [shareLabel, setShareLabel] = useState("Bagikan");

  const listing = listings.find((item) => item.id === params.id);
  const mitra = profiles.find((profile) => profile.id === listing?.mitra_id);
  const distance = listing && user?.lat && user?.lng
    ? haversineDistanceMeters(user.lat, user.lng, listing.lat, listing.lng)
    : undefined;
  const available = listing?.jumlah_tersedia ?? listing?.jumlah_kantong ?? 0;
  const discount = listing && listing.harga_normal > listing.harga_diskon
    ? Math.round(((listing.harga_normal - listing.harga_diskon) / listing.harga_normal) * 100)
    : 0;
  const Icon = foodIcons[listing?.kategori || ""] || MdRestaurant;
  const gradient = gradients[(params.id || "").charCodeAt(0) % gradients.length];

  function updateQuantity(next: number) {
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
      setMessage("Reservasi berhasil. Kode pengambilan sudah tersimpan.");
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
    const shareData = {
      title: listing.nama_makanan,
      text: `Amankan Kantong Surplus ${listing.nama_makanan} di DishCon.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareLabel("Tautan disalin");
        setTimeout(() => setShareLabel("Bagikan"), 1800);
      }
    } catch {
      // Menutup native share sheet tidak dianggap error.
    }
  }

  function openMap() {
    if (!listing) return;
    window.open(
      buildMapsDirectionsUrl(
        user?.lat && user?.lng ? { lat: user.lat, lng: user.lng } : undefined,
        { lat: listing.lat, lng: listing.lng },
      ),
      "_blank",
      "noopener,noreferrer",
    );
  }

  if (loading) {
    return (
      <div className="space-y-4" aria-label="Memuat detail Kantong Surplus">
        <div className="h-72 animate-pulse rounded-3xl bg-white sm:h-96" />
        <div className="h-64 animate-pulse rounded-3xl bg-white" />
      </div>
    );
  }

  if (!listing) {
    return (
      <EmptyState
        title="Kantong Surplus tidak ditemukan"
        description="Listing tidak tersedia, sudah habis, atau tidak dapat diakses oleh akun Anda."
        action={<Button asChild><Link href="/mahasiswa/catalog">Kembali ke Katalog</Link></Button>}
      />
    );
  }

  const deadline = new Date(listing.batas_waktu);
  const allergens = listing.nutrition?.allergens || [];

  return (
    <div className="min-w-0 pb-32 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-6 lg:pb-0">
      <div className="min-w-0 space-y-4 sm:space-y-5">
        <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-card sm:rounded-[2rem]">
          <div className={cn("relative h-64 overflow-hidden bg-gradient-to-br sm:h-96 lg:h-[440px]", gradient)}>
            {listing.image_url ? (
              <Image
                src={listing.image_url}
                alt={listing.nama_makanan}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 70vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-brand-700/25">
                <Icon className="h-28 w-28 sm:h-36 sm:w-36" aria-hidden="true" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5" />

            <button type="button" onClick={() => router.back()} className="focus-ring absolute left-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-stone-700 shadow-md backdrop-blur transition hover:bg-white sm:left-5 sm:top-5" aria-label="Kembali">
              <FiArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={shareListing} className="focus-ring absolute right-3 top-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/90 px-3 text-xs font-black text-stone-700 shadow-md backdrop-blur transition hover:bg-white sm:right-5 sm:top-5 sm:px-4 sm:text-sm">
              <FiShare2 className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">{shareLabel}</span>
            </button>

            {discount > 0 && (
              <span className="absolute bottom-4 left-4 rounded-full bg-red-500 px-3 py-1.5 text-xs font-black text-white shadow-md sm:bottom-5 sm:left-5 sm:text-sm">
                Diskon {discount}%
              </span>
            )}
          </div>

          <div className="relative p-4 sm:p-6 lg:p-8">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={listing.status} />
              {listing.halal && <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-700"><FiShield aria-hidden="true" /> Halal</span>}
              {listing.nutrition && <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700"><FiZap aria-hidden="true" /> AI Verified</span>}
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-600">{listing.kategori}</span>
            </div>

            <h2 className="mt-4 text-2xl font-black leading-tight text-stone-950 sm:text-3xl lg:text-4xl">{listing.nama_makanan}</h2>
            <div className="mt-3 flex items-start gap-2 text-sm text-stone-600 sm:text-base">
              <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" aria-hidden="true" />
              <div className="min-w-0">
                <p>{listing.lokasi}</p>
                {distance !== undefined && Number.isFinite(distance) && <p className="mt-1 text-xs font-black text-brand-700 sm:text-sm">{formatDistanceMeters(distance)} dari lokasi Anda</p>}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-3xl font-black text-brand-700 sm:text-4xl">{formatRupiah(listing.harga_diskon)}</span>
              {discount > 0 && <span className="text-sm font-bold text-stone-400 line-through sm:text-lg">{formatRupiah(listing.harga_normal)}</span>}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
              <InfoBox label="Tersisa" value={`${available} kantong`} />
              <InfoBox label="Batas ambil" value={deadline.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" })} icon={<FiClock className="h-3 w-3 text-orange-500" aria-hidden="true" />} />
              <InfoBox label="Mitra" value={mitra?.nama_usaha || mitra?.name || "UMKM"} />
            </div>
          </div>
        </section>

        <section className="soft-panel p-4 sm:p-6" aria-labelledby="listing-description-title">
          <h3 id="listing-description-title" className="text-lg font-black text-stone-900 sm:text-xl">Tentang makanan</h3>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-600 sm:text-base">{listing.deskripsi || "Tidak ada deskripsi tambahan dari mitra."}</p>
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            <NutritionBox label="Kategori" value={listing.kategori} />
            <NutritionBox label="Penyimpanan" value={listing.metode_penyimpanan} />
            <NutritionBox label="Waktu produksi" value={listing.waktu_produksi ? new Date(listing.waktu_produksi).toLocaleString("id-ID") : undefined} />
            <NutritionBox label="Kelayakan" value={listing.expiry?.risk_level} />
          </div>
        </section>

        {listing.nutrition && (
          <section className="soft-panel p-4 sm:p-6" aria-labelledby="nutrition-title">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-blue-700"><FiZap aria-hidden="true" /></span>
              <div><h3 id="nutrition-title" className="text-lg font-black text-stone-900 sm:text-xl">Analisis Nutrisi</h3><p className="text-xs text-stone-500">Perkiraan otomatis dari hasil assessment AI.</p></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
              <NutritionBox label="Kalori" value={listing.nutrition.calories_estimate ?? listing.nutrition.calories} />
              <NutritionBox label="Protein" value={listing.nutrition.protein} />
              <NutritionBox label="Karbohidrat" value={listing.nutrition.carbohydrate ?? listing.nutrition.carbs} />
              <NutritionBox label="Lemak" value={listing.nutrition.fat} />
              <NutritionBox label="Serat" value={listing.nutrition.fiber} />
              <NutritionBox label="Sodium" value={listing.nutrition.sodium} />
            </div>
            {allergens.length > 0 && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-3.5 text-sm text-red-800">
                <FiAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p><b>Alergen:</b> {allergens.join(", ")}</p>
              </div>
            )}
          </section>
        )}

        {listing.expiry && (
          <section className="soft-panel p-4 sm:p-6" aria-labelledby="expiry-title">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-50 text-orange-700"><FiClock aria-hidden="true" /></span>
              <div><h3 id="expiry-title" className="text-lg font-black text-stone-900 sm:text-xl">Kelayakan Ambil</h3><p className="text-xs text-stone-500">Perkiraan waktu aman setelah produksi.</p></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
              <NutritionBox label="Tingkat risiko" value={listing.expiry.risk_level} />
              <NutritionBox label="Aman Benson" value={listing.expiry.safe_hours !== undefined ? `${listing.expiry.safe_hours} jam` : undefined} />
              <NutritionBox label="Konsumsi sebelum" value={listing.expiry.recommended_consume_before} />
            </div>
            {listing.expiry.storage_recommendation && <p className="mt-3 rounded-2xl bg-stone-50 p-3 text-sm leading-6 text-stone-600">Saran penyimpanan: {listing.expiry.storage_recommendation}</p>}
          </section>
        )}

        <button type="button" onClick={openMap} className="focus-ring flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-stone-100 px-4 text-sm font-black text-stone-700 transition hover:bg-stone-200 lg:hidden">
          <FiMap className="h-5 w-5" aria-hidden="true" /> Buka Peta Navigasi
        </button>
      </div>

      <aside className="hidden space-y-5 lg:block">
        <section className="sticky top-28 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-card">
          <FiShoppingBag className="h-8 w-8" aria-hidden="true" />
          <h3 className="mt-4 text-2xl font-black">Pesan Sekarang</h3>
          <p className="mt-2 text-sm leading-6 text-white/75">Stok langsung dikunci tanpa menunggu persetujuan.</p>
          <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm">
            <b>Total: {formatRupiah(listing.harga_diskon * quantity)}</b>
            <p className="mt-1 text-xs text-white/65">Maksimal {available} kantong</p>
          </div>
          <ReservationPanel
            listing={listing}
            available={available}
            quantity={quantity}
            setQuantity={updateQuantity}
            confirming={confirming}
            setConfirming={setConfirming}
            submitting={submitting}
            message={message}
            messageType={messageType}
            onSubmit={submitReservation}
          />
        </section>

        <section className="soft-panel p-5">
          <h3 className="font-black text-stone-900">Navigasi Pengambilan</h3>
          <p className="mt-2 text-sm leading-6 text-stone-500">Rute dimulai dari lokasi profil Anda dan berakhir di lokasi mitra.</p>
          <Button type="button" variant="secondary" className="mt-4 w-full" onClick={openMap}><FiMap aria-hidden="true" /> Buka Peta</Button>
        </section>
      </aside>

      {isListingOrderable(listing) && <div className="mobile-safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white/95 shadow-[0_-10px_35px_rgba(15,40,26,0.12)] backdrop-blur-xl lg:hidden">
        <ReservationPanel
          listing={listing}
          available={available}
          quantity={quantity}
          setQuantity={updateQuantity}
          confirming={confirming}
          setConfirming={setConfirming}
          submitting={submitting}
          message={message}
          messageType={messageType}
          onSubmit={submitReservation}
          mobile
        />
      </div>}
    </div>
  );
}
