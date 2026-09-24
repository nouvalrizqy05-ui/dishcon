"use client";

import Link from "next/link";
import { useState } from "react";
import { FiBox, FiCheckCircle, FiClock, FiDollarSign, FiMapPin, FiPlus, FiTrendingUp } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDishconData } from "@/lib/dishcon-store";
import { EmptyState, MetricCard, StatusBadge, formatRupiah } from "@/components/pages/shared";

export function MitraDashboardPage() {
  const { listings, reservations, loading, completeReservation, mitraUpdateListingStatus } = useDishconData() as any;
  const [codeInputs, setCodeInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const active = listings.filter((listing: any) => ["active", "pending_verification"].includes(listing.status)).length;
  const completedReservations = reservations.filter((reservation: any) => reservation.status === "completed");
  const kantongTerjual = completedReservations.reduce((sum: number, item: any) => sum + item.jumlah, 0);
  const pendapatanBersih = completedReservations.reduce((sum: number, item: any) => sum + (item.total_harga - item.komisi_platform), 0);
  const menunggu = reservations.filter((reservation: any) => reservation.status === "reserved");
  const recentListings = listings.slice(0, 5);

  async function submitCode(reservationId: string) {
    const code = codeInputs[reservationId]?.trim();
    if (!code) return;
    try {
      await completeReservation(reservationId, code);
      setFeedback((old) => ({ ...old, [reservationId]: "Pengambilan dikonfirmasi." }));
    } catch (error) {
      setFeedback((old) => ({ ...old, [reservationId]: error instanceof Error ? error.message : "Kode tidak cocok." }));
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4" aria-label="Ringkasan mitra">
        <MetricCard icon={FiBox} label="Kantong Aktif" value={active} hint="Tayang atau diverifikasi" />
        <MetricCard icon={FiCheckCircle} label="Kantong Terjual" value={kantongTerjual} hint="Reservasi selesai" tone="orange" />
        <MetricCard icon={FiClock} label="Menunggu Diambil" value={menunggu.length} hint="Belum dikonfirmasi" />
        <MetricCard icon={FiDollarSign} label="Pendapatan Bersih" value={formatRupiah(pendapatanBersih)} hint="Setelah komisi 10%" />
      </section>

      <div className="grid min-w-0 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4 sm:space-y-6">
          <section className="soft-panel min-w-0 p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-stone-900 sm:text-xl">Kantong Surplus Terbaru</h2>
                <p className="mt-1 text-sm text-stone-500">Pantau stok, harga, dan batas ambil.</p>
              </div>
              <Link href="/mitra/history" className="focus-ring inline-flex min-h-10 items-center rounded-xl text-sm font-black text-brand-700">Lihat riwayat</Link>
            </div>

            {loading ? (
              <p className="text-stone-500">Memuat data...</p>
            ) : listings.length === 0 ? (
              <EmptyState
                title="Belum ada Kantong Surplus"
                description="Posting Kantong Surplus pertama agar tampil untuk mahasiswa di sekitar."
                action={<Button asChild><Link href="/mitra/posting"><FiPlus aria-hidden="true" /> Posting Kantong Surplus</Link></Button>}
              />
            ) : (
              <>
                <div className="space-y-3 xl:hidden">
                  {recentListings.map((item: any) => (
                    <article key={item.id} className="rounded-2xl border border-stone-200 p-3.5 sm:p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-black text-stone-900">{item.nama_makanan}</h3>
                          <p className="mt-1 text-xs text-stone-500">{item.kategori} · {item.jumlah_tersedia ?? item.jumlah_kantong} tersisa</p>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                        <div><span className="text-stone-400">Harga</span><b className="mt-0.5 block text-brand-700">{formatRupiah(item.harga_diskon)}</b>{item.harga_normal > item.harga_diskon && <span className="text-[10px] text-stone-400 line-through">{formatRupiah(item.harga_normal)}</span>}</div>
                        <div><span className="text-stone-400">Batas ambil</span><b className="mt-0.5 block text-stone-700">{new Date(item.batas_waktu).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</b></div>
                      </div>
                      <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-stone-500"><FiMapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {item.lokasi}</p>
                      {item.status === "active" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="mt-3 w-full text-red-600 hover:bg-red-50"
                          onClick={() => {
                            if (confirm("Tandai stok ini habis atau terjual offline?")) mitraUpdateListingStatus?.(item.id, "habis");
                          }}
                        >
                          Tandai Habis
                        </Button>
                      )}
                    </article>
                  ))}
                </div>

                <div className="hidden overflow-x-auto xl:block">
                  <table className="mockup-table min-w-[760px] w-full">
                    <thead><tr><th>Makanan</th><th>Harga</th><th>Lokasi</th><th>Batas Ambil</th><th>Status</th><th>Aksi</th></tr></thead>
                    <tbody>
                      {recentListings.map((item: any) => (
                        <tr key={item.id}>
                          <td><b>{item.nama_makanan}</b><p className="text-xs text-stone-500">{item.kategori} · {item.jumlah_tersedia ?? item.jumlah_kantong} tersisa</p></td>
                          <td>{formatRupiah(item.harga_diskon)} <span className="text-xs text-stone-400 line-through">{formatRupiah(item.harga_normal)}</span></td>
                          <td>{item.lokasi}</td>
                          <td>{new Date(item.batas_waktu).toLocaleString("id-ID")}</td>
                          <td><StatusBadge status={item.status} /></td>
                          <td>
                            {item.status === "active" && (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="text-xs text-red-600 hover:bg-red-50"
                                onClick={() => {
                                  if (confirm("Tandai stok ini habis atau terjual offline?")) mitraUpdateListingStatus?.(item.id, "habis");
                                }}
                              >
                                Tandai Habis
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>

          <section className="soft-panel p-4 sm:p-5" aria-labelledby="confirmation-title">
            <div className="mb-4">
              <h2 id="confirmation-title" className="text-lg font-black text-stone-900 sm:text-xl">Konfirmasi Pengambilan</h2>
              <p className="mt-1 text-sm leading-6 text-stone-500">Masukkan kode 6 digit dari mahasiswa saat serah terima.</p>
            </div>
            {menunggu.length === 0 ? (
              <EmptyState title="Belum ada reservasi menunggu" description="Reservasi akan muncul otomatis setelah mahasiswa memesan." />
            ) : (
              <div className="space-y-3">
                {menunggu.map((reservation: any) => {
                  const listing = listings.find((item: any) => item.id === reservation.listing_id);
                  return (
                    <article key={reservation.id} className="rounded-2xl border border-stone-200 p-3.5 sm:rounded-3xl sm:p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <b className="block truncate text-stone-900">{listing?.nama_makanan || "Kantong surplus"}</b>
                          <p className="mt-1 text-xs text-stone-500">{reservation.jumlah} kantong · {formatRupiah(reservation.total_harga)}</p>
                        </div>
                        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex">
                          <Input value={codeInputs[reservation.id] || ""} onChange={(event) => setCodeInputs((old) => ({ ...old, [reservation.id]: event.target.value }))} placeholder="Kode 6 digit" inputMode="numeric" className="min-w-0 sm:w-32" />
                          <Button size="sm" onClick={() => submitCode(reservation.id)} aria-label={`Konfirmasi pengambilan ${listing?.nama_makanan || "reservasi"}`}><FiCheckCircle aria-hidden="true" /> <span className="hidden sm:inline">Konfirmasi</span></Button>
                        </div>
                      </div>
                      {feedback[reservation.id] && <p className="mt-2 text-xs font-bold text-brand-700">{feedback[reservation.id]}</p>}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <section className="rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white shadow-card sm:p-6">
            <h2 className="text-lg font-black sm:text-xl">Ringkasan Dampak</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-white/10 p-4"><b>{kantongTerjual} kantong</b><p className="text-sm text-white/75">tidak terbuang</p></div>
              <div className="rounded-2xl bg-white/10 p-4"><b>{formatRupiah(pendapatanBersih)}</b><p className="text-sm text-white/75">pendapatan tambahan bersih</p></div>
            </div>
            <Button asChild className="mt-4 w-full bg-white text-brand-800 hover:bg-brand-50"><Link href="/mitra/posting"><FiPlus aria-hidden="true" /> Posting Kantong Surplus</Link></Button>
          </section>

          <section className="soft-panel p-5 sm:p-6">
            <h2 className="font-black text-stone-900">Insight Mitra</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-stone-600">
              <p className="rounded-2xl bg-brand-50 p-3"><FiTrendingUp className="mr-2 inline" aria-hidden="true" /> Insight aktif setelah ada minimal 3 Kantong Surplus terjual.</p>
              <p>Rekomendasi waktu posting dan harga akan dihitung dari histori akun.</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
