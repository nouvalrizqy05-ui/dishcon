"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FiCheckCircle, FiClock, FiMap, FiMapPin, FiMinus, FiPlus, FiShield, FiShoppingBag, FiZap } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useDishconData } from "@/lib/dishcon-store";
import { buildMapsDirectionsUrl, formatDistanceMeters, haversineDistanceMeters } from "@/lib/maps";
import { EmptyState, StatusBadge, formatRupiah } from "@/components/pages/shared";

function NutritionBox({ label, value }: { label: string; value?: unknown }) {
  return <div className="rounded-2xl bg-white p-4"><span className="text-xs font-black uppercase tracking-widest text-stone-400">{label}</span><p className="mt-1 font-black text-ink">{value !== undefined && value !== null && value !== "" ? String(value) : "-"}</p></div>;
}

function listValue(value: unknown) {
  return Array.isArray(value) && value.length ? value.join(", ") : "-";
}

export function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { listings, profiles, loading, reserveListing } = useDishconData();
  const [jumlah, setJumlah] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");

  const listing = listings.find((item) => item.id === params.id);
  const mitra = profiles.find((profile) => profile.id === listing?.mitra_id);
  const distance = listing && user?.lat && user?.lng ? haversineDistanceMeters(user.lat, user.lng, listing.lat, listing.lng) : undefined;
  const tersedia = listing?.jumlah_tersedia ?? listing?.jumlah_kantong ?? 0;

  if (loading) return <p className="text-stone-500">Memuat detail kantong surplus...</p>;
  if (!listing) return <EmptyState title="Kantong surplus tidak ditemukan" description="Listing tidak tersedia, sudah habis, atau tidak dapat diakses oleh akun Anda." action={<Button asChild><Link href="/mahasiswa/catalog">Kembali ke Katalog</Link></Button>} />;

  function changeJumlah(next: number) {
    setJumlah(Math.max(1, Math.min(tersedia || 1, next)));
  }

  async function submitReservation() {
    setMessage("");
    setSubmitting(true);
    try {
      await reserveListing(listing!.id, jumlah);
      setMessage("Reservasi berhasil! Lihat kode pengambilan di halaman Reservasi Saya.");
      setTimeout(() => router.push("/mahasiswa/history"), 1200);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Reservasi gagal dibuat.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <section className="space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-card">
          <div className="grid h-[340px] place-items-center overflow-hidden bg-gradient-to-br from-brand-50 to-amber-50 text-7xl">
            {listing.image_url ? <div className="relative h-full w-full"><Image src={listing.image_url} alt={listing.nama_makanan} fill className="object-cover" /></div> : "🍱"}
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2"><StatusBadge status={listing.status} />{listing.halal && <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-700"><FiShield className="mr-1 inline" /> Halal</span>}</div>
            <h2 className="mt-4 text-3xl font-black text-brand-900">{listing.nama_makanan}</h2>
            <p className="mt-2 flex items-start gap-2 text-stone-500"><FiMapPin className="mt-1 shrink-0" /> {listing.lokasi}</p>
            {distance !== undefined && <p className="mt-2 text-sm font-black text-brand-700">Jarak dari lokasi Anda: {formatDistanceMeters(distance)}</p>}
            <div className="mt-4 flex items-baseline gap-3"><span className="text-3xl font-black text-brand-700">{formatRupiah(listing.harga_diskon)}</span><span className="text-lg font-bold text-stone-400 line-through">{formatRupiah(listing.harga_normal)}</span></div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-brand-50 p-4"><span className="text-xs font-black uppercase tracking-widest text-brand-700">Kantong tersisa</span><p className="mt-1 text-2xl font-black text-brand-900">{tersedia}</p></div>
              <div className="rounded-2xl bg-orange-50 p-4"><span className="text-xs font-black uppercase tracking-widest text-orange-700">Batas ambil</span><p className="mt-1 font-black text-orange-900">{new Date(listing.batas_waktu).toLocaleString("id-ID")}</p></div>
              <div className="rounded-2xl bg-blue-50 p-4"><span className="text-xs font-black uppercase tracking-widest text-blue-700">Kategori</span><p className="mt-1 font-black text-blue-900">{listing.kategori}</p></div>
            </div>
          </div>
        </div>

        <div className="soft-panel p-6">
          <h3 className="text-xl font-black text-brand-900">Detail Makanan</h3>
          <p className="mt-3 whitespace-pre-line leading-7 text-stone-600">{listing.deskripsi || "Tidak ada deskripsi tambahan dari mitra."}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <NutritionBox label="Mitra" value={mitra?.nama_usaha || mitra?.name || "Mitra UMKM"} />
            <NutritionBox label="Penyimpanan" value={listing.metode_penyimpanan} />
            <NutritionBox label="Waktu Produksi" value={listing.waktu_produksi ? new Date(listing.waktu_produksi).toLocaleString("id-ID") : "-"} />
            <NutritionBox label="Status Kelayakan" value={listing.expiry?.risk_level || "Belum dianalisis"} />
          </div>
        </div>

        <div className="soft-panel p-6">
          <div className="flex items-center gap-3"><FiZap className="text-2xl text-blue-700" /><h3 className="text-xl font-black text-brand-900">Detail AI Nutrition</h3></div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <NutritionBox label="Kalori / kantong" value={listing.nutrition?.calories_estimate ?? listing.nutrition?.calories} />
            <NutritionBox label="Protein / kantong" value={listing.nutrition?.protein} />
            <NutritionBox label="Karbohidrat / kantong" value={listing.nutrition?.carbohydrate ?? listing.nutrition?.carbs} />
            <NutritionBox label="Lemak / kantong" value={listing.nutrition?.fat} />
            <NutritionBox label="Bahan Utama" value={listValue(listing.nutrition?.ingredients_detected)} />
            <NutritionBox label="Alergen" value={listValue(listing.nutrition?.allergens)} />
          </div>
        </div>

        <div className="soft-panel p-6">
          <div className="flex items-center gap-3"><FiClock className="text-2xl text-orange-700" /><h3 className="text-xl font-black text-brand-900">Detail AI Expiry Risk</h3></div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <NutritionBox label="Tingkat Risiko" value={listing.expiry?.risk_level} />
            <NutritionBox label="Aman Dikonsumsi" value={listing.expiry?.safe_hours !== undefined ? `${listing.expiry.safe_hours} jam` : undefined} />
            <NutritionBox label="Konsumsi Sebelum" value={listing.expiry?.recommended_consume_before} />
            <NutritionBox label="Saran Penyimpanan" value={listing.expiry?.storage_recommendation} />
          </div>
        </div>
      </section>

      <aside className="space-y-5">
        <div className="rounded-[2rem] bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-card">
          <FiShoppingBag className="text-3xl" />
          <h3 className="mt-4 text-2xl font-black">Pesan Sekarang</h3>
          <p className="mt-2 text-sm leading-6 text-white/75">Reservasi instan — stok langsung terkunci, tanpa menunggu persetujuan siapa pun.</p>
          {listing.status === "active" && tersedia > 0 ? (
            <>
              <div className="mt-5 flex items-center gap-3">
                <Button type="button" variant="secondary" onClick={() => { changeJumlah(jumlah - 1); setConfirming(false); }} disabled={submitting || confirming}><FiMinus /></Button>
                <span className="flex-1 rounded-2xl bg-white/10 py-3 text-center text-2xl font-black">{jumlah}</span>
                <Button type="button" variant="secondary" onClick={() => { changeJumlah(jumlah + 1); setConfirming(false); }} disabled={submitting || confirming}><FiPlus /></Button>
              </div>
              <p className="mt-2 text-center text-xs text-white/70">Maksimal {tersedia} kantong tersedia</p>
              <div className="mt-3 rounded-2xl bg-white/10 p-4 text-sm"><b>Total Bayar di Tempat: {formatRupiah(listing.harga_diskon * jumlah)}</b></div>
              
              {!confirming ? (
                <Button type="button" onClick={() => setConfirming(true)} disabled={submitting} className="mt-4 w-full bg-white text-brand-900 hover:bg-brand-50 text-lg font-black h-14">Amankan Kantong</Button>
              ) : (
                <div className="mt-4 rounded-2xl bg-amber-500/20 p-4 border border-amber-500/30">
                  <p className="text-sm font-bold text-amber-100 mb-3 text-center">Pastikan Anda bisa mengambil makanan sebelum batas waktu berakhir.</p>
                  <div className="flex gap-2">
                    <Button type="button" variant="secondary" onClick={() => setConfirming(false)} disabled={submitting} className="flex-1 text-xs">Batal</Button>
                    <Button type="button" onClick={submitReservation} disabled={submitting} className="flex-1 bg-white text-brand-900 hover:bg-brand-50 font-black">{submitting ? "Memproses..." : "Konfirmasi"}</Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Button disabled className="mt-5 w-full bg-white/50 text-white/70 font-black h-14">Kantong Tidak Tersedia</Button>
          )}
          {message && <p className="mt-4 rounded-2xl bg-green-500/20 p-3 text-sm font-bold border border-green-500/30 text-green-100"><FiCheckCircle className="inline mr-1"/>{message}</p>}
        </div>
        <div className="soft-panel p-5">
          <h3 className="font-black text-brand-900">Navigasi</h3>
          <p className="mt-2 text-sm text-stone-500">Rute memakai titik GPS profil Anda sebagai titik awal dan lokasi mitra sebagai tujuan.</p>
          <Button type="button" variant="secondary" className="mt-4 w-full" onClick={() => window.open(buildMapsDirectionsUrl(user?.lat && user?.lng ? { lat: user.lat, lng: user.lng } : undefined, { lat: listing.lat, lng: listing.lng }), "_blank", "noopener,noreferrer")}><FiMap /> Buka Peta</Button>
        </div>
        <div className="rounded-[2rem] border border-orange-100 bg-orange-50 p-5"><FiClock className="text-orange-700" /><p className="mt-2 text-sm font-semibold text-orange-900">Datang sebelum batas waktu dan tunjukkan kode pengambilan ke mitra saat serah terima.</p></div>
      </aside>
    </div>
  );
}
