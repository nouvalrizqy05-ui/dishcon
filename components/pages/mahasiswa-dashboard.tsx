"use client";

import Image from "next/image";
import Link from "next/link";
import { FiCheckCircle, FiClock, FiFeather, FiMap, FiSearch, FiUsers, FiZap } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useDishconData } from "@/lib/dishcon-store";
import { useAuth } from "@/lib/auth-context";
import { buildMapsDirectionsUrl, formatDistanceMeters, haversineDistanceMeters } from "@/lib/maps";
import { buildReceivedNutritionSummary, formatNutritionValue } from "@/lib/nutrition";
import { EmptyState, MetricCard, StatusBadge, statusHint, formatRupiah } from "@/components/pages/shared";

export function MahasiswaDashboardPage() {
  const { user } = useAuth();
  const { reservations, listings, kosShares, loading, preferences } = useDishconData();
  const menunggu = reservations.filter((r) => r.status === "reserved").length;
  const completedReservations = reservations.filter((r) => r.status === "completed");
  const kantongDiambil = completedReservations.reduce((sum, item) => sum + item.jumlah, 0);
  const totalHemat = completedReservations.reduce((sum, item) => {
    const listing = listings.find((l) => l.id === item.listing_id);
    return sum + (listing ? (listing.harga_normal - listing.harga_diskon) * item.jumlah : 0);
  }, 0);

  const availableListings = listings
    .map((item) => ({ ...item, distanceMeter: user?.lat && user?.lng ? haversineDistanceMeters(user.lat, user.lng, item.lat, item.lng) : Infinity }))
    .filter((item) => item.status === "active" && (item.jumlah_tersedia ?? 0) > 0 && item.distanceMeter <= preferences.maxRadiusMeter && (!preferences.halal || item.halal) && (preferences.preferredCategories.length === 0 || preferences.preferredCategories.includes(item.kategori)))
    .sort((a, b) => a.distanceMeter - b.distanceMeter);

  const nextReservation = reservations.find((r) => r.status === "reserved");
  const nextListing = listings.find((item) => item.id === nextReservation?.listing_id);
  const nutritionSummary = buildReceivedNutritionSummary(reservations, listings);

  function openMap() {
    if (!nextListing) {
      window.alert("Belum ada reservasi aktif yang memiliki lokasi pengambilan.");
      return;
    }
    window.open(buildMapsDirectionsUrl(user?.lat && user?.lng ? { lat: user.lat, lng: user.lng } : undefined, { lat: nextListing.lat, lng: nextListing.lng }), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 overflow-hidden">
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricCard icon={FiClock} label="Menunggu Diambil" value={menunggu} hint="Reservasi aktif Anda" />
        <MetricCard icon={FiCheckCircle} label="Kantong Diambil" value={kantongDiambil} hint="Total selesai" tone="orange" />
        <MetricCard icon={FiFeather} label="Total Hemat" value={formatRupiah(totalHemat)} hint="Dibanding harga normal" />
        <MetricCard icon={FiUsers} label="Berbagi Antar Kos" value={kosShares.filter((s) => s.status === "tersedia").length} hint="Item tersedia dari mahasiswa lain" />
      </div>

      <div className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0 space-y-6">
          <div className="soft-panel p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="text-xl font-black text-brand-900">Rekomendasi Kantong Surplus</h2><p className="text-stone-500">Mengikuti preferensi halal, kategori, dan radius maksimal {formatDistanceMeters(preferences.maxRadiusMeter)}.</p></div>
              <Link href="/mahasiswa/catalog" className="font-bold text-brand-700">Lihat Semua →</Link>
            </div>
            {loading ? <p className="text-stone-500">Memuat data...</p> : availableListings.length === 0 ? (
              <EmptyState
                title="Belum ada kantong surplus tersedia"
                description="Katalog akan terisi saat mitra memposting kantong surplus yang sesuai preferensi radius dan kategori Anda."
                action={<Button asChild><Link href="/mahasiswa/catalog"><FiSearch /> Buka Katalog</Link></Button>}
              />
            ) : (
              <div className="grid min-w-0 gap-4 lg:grid-cols-2">
                {availableListings.slice(0, 4).map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-3xl border border-stone-200">
                    {item.image_url && <div className="relative h-36 w-full"><Image src={item.image_url} alt={item.nama_makanan} fill className="object-cover" /></div>}
                    <div className="p-4">
                      <p className="font-black text-ink">{item.nama_makanan}</p>
                      <p className="mt-1 text-sm text-stone-500">{item.lokasi}</p>
                      <p className="mt-2 text-xs font-bold text-brand-700">{formatDistanceMeters(item.distanceMeter)} dari lokasi Anda</p>
                      <p className="mt-1 text-sm font-black text-brand-700">{formatRupiah(item.harga_diskon)} <span className="text-xs text-stone-400 line-through">{formatRupiah(item.harga_normal)}</span></p>
                      <div className="mt-3 flex items-center justify-between"><span className="rounded-xl bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">{item.jumlah_tersedia} kantong</span><Button asChild size="sm"><Link href={`/mahasiswa/listing/${item.id}`}>Pesan</Link></Button></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="soft-panel p-6">
            <h2 className="mb-4 text-xl font-black text-brand-900">Reservasi Terbaru</h2>
            {reservations.length === 0 ? (
              <EmptyState title="Belum ada reservasi" description="Setelah Anda memesan kantong surplus, status dan kode pengambilan akan muncul di sini." />
            ) : (
              <div className="w-full max-w-full overflow-x-auto">
                <table className="mockup-table w-full min-w-[760px]"><thead><tr><th>Makanan</th><th>Jumlah</th><th>Kode</th><th>Status</th><th>Keterangan</th><th>Tanggal</th></tr></thead><tbody>{reservations.slice(0, 5).map((r) => { const listing = listings.find((l) => l.id === r.listing_id); return <tr key={r.id}><td>{listing?.nama_makanan || "-"}</td><td>{r.jumlah}</td><td>{r.status === "reserved" ? r.kode_pengambilan : "-"}</td><td><StatusBadge status={r.status} /></td><td className="max-w-xs text-xs text-stone-500">{statusHint(r.status)}</td><td>{new Date(r.created_at).toLocaleDateString("id-ID")}</td></tr>; })}</tbody></table>
              </div>
            )}
          </div>
        </section>

        <aside className="min-w-0 space-y-5">
          <div className="rounded-[2rem] bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-card">
            <h3 className="text-2xl font-black">Navigasi Pengambilan</h3>
            {nextListing ? (
              <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm"><b>{nextListing.nama_makanan}</b><p className="mt-1 text-white/80">Kode: {nextReservation?.kode_pengambilan}</p><p className="text-white/80">Tujuan: {nextListing.lokasi}</p></div>
            ) : <p className="mt-4 rounded-2xl bg-white/10 p-4 text-sm text-white/80">Belum ada reservasi aktif yang menunggu diambil.</p>}
            <Button type="button" onClick={openMap} disabled={!nextListing} className="mt-5 w-full bg-white text-brand-800 hover:bg-brand-50"><FiMap /> Buka Peta Navigasi</Button>
          </div>
          <div className="rounded-[2rem] border border-brand-100 bg-brand-50 p-6">
            <FiUsers className="text-2xl text-brand-700" />
            <h3 className="mt-3 font-black text-brand-900">Berbagi Antar Kos</h3>
            <p className="mt-2 text-sm leading-6 text-brand-800">Bagikan atau cari bahan makanan gratis/murah dari sesama penghuni kos di sekitar Anda.</p>
            <Button asChild variant="secondary" className="mt-4 w-full"><Link href="/mahasiswa/kos-share">Buka Berbagi Antar Kos</Link></Button>
          </div>
          <div className="soft-panel p-5">
            <h3 className="font-black text-brand-900">Ringkasan Nutrisi Diterima</h3>
            <p className="mt-3 text-sm text-stone-500">Bertambah otomatis dari kantong surplus yang sudah selesai diambil.</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-blue-50 p-3"><span className="text-blue-700">Kalori</span><b className="block text-blue-900">{formatNutritionValue(nutritionSummary.totals.calories, "kkal")}</b></div>
              <div className="rounded-2xl bg-brand-50 p-3"><span className="text-brand-700">Protein</span><b className="block text-brand-900">{formatNutritionValue(nutritionSummary.totals.protein, "g")}</b></div>
              <div className="rounded-2xl bg-orange-50 p-3"><span className="text-orange-700">Karbo</span><b className="block text-orange-900">{formatNutritionValue(nutritionSummary.totals.carbohydrate, "g")}</b></div>
              <div className="rounded-2xl bg-stone-50 p-3"><span className="text-stone-500">Lemak</span><b className="block text-ink">{formatNutritionValue(nutritionSummary.totals.fat, "g")}</b></div>
            </div>
            {nutritionSummary.details.length === 0 && <p className="mt-4 rounded-2xl bg-stone-50 p-3 text-sm text-stone-500">Belum ada kantong selesai yang memiliki data nutrisi.</p>}
          </div>
          <div className="rounded-[2rem] border border-blue-100 bg-blue-50 p-5"><FiZap className="text-2xl text-blue-700" /><p className="mt-2 text-sm font-semibold text-blue-900">{formatRupiah(totalHemat)} berhasil dihemat dibanding harga normal, terhitung sejak akun ini dibuat.</p></div>
        </aside>
      </div>
    </div>
  );
}
