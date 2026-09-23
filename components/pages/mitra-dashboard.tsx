"use client";

import Link from "next/link";
import { useState } from "react";
import { FiBox, FiCheckCircle, FiClock, FiDollarSign, FiPlus, FiTrendingUp } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDishconData } from "@/lib/dishcon-store";
import { EmptyState, MetricCard, StatusBadge, formatRupiah } from "@/components/pages/shared";

export function MitraDashboardPage() {
  const { listings, reservations, loading, completeReservation, mitraUpdateListingStatus } = useDishconData() as any;
  const [codeInputs, setCodeInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const active = listings.filter((l) => ["active", "pending_verification"].includes(l.status)).length;
  const completedReservations = reservations.filter((r) => r.status === "completed");
  const kantongTerjual = completedReservations.reduce((sum, item) => sum + item.jumlah, 0);
  const pendapatanBersih = completedReservations.reduce((sum, item) => sum + (item.total_harga - item.komisi_platform), 0);
  const menunggu = reservations.filter((r) => r.status === "reserved").length;

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
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={FiBox} label="Kantong Surplus Aktif" value={active} hint="Sedang tayang atau menunggu verifikasi" />
        <MetricCard icon={FiCheckCircle} label="Kantong Terjual" value={kantongTerjual} hint="Total dari reservasi selesai" tone="orange" />
        <MetricCard icon={FiClock} label="Menunggu Diambil" value={menunggu} hint="Reservasi belum dikonfirmasi" />
        <MetricCard icon={FiDollarSign} label="Pendapatan Bersih" value={formatRupiah(pendapatanBersih)} hint="Setelah komisi platform 10%" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="soft-panel p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-black text-brand-900">Kantong Surplus Terbaru</h2>
              <Link href="/mitra/history" className="font-bold text-brand-700">Lihat Semua Riwayat →</Link>
            </div>
            {loading ? <p className="text-stone-500">Memuat data...</p> : listings.length === 0 ? (
              <EmptyState
                title="Belum ada kantong surplus"
                description="Posting kantong surplus pertama Anda agar tampil untuk mahasiswa di sekitar."
                action={<Button asChild><Link href="/mitra/posting"><FiPlus /> Posting Kantong Surplus</Link></Button>}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="mockup-table min-w-[760px] w-full">
                  <thead><tr><th>Makanan</th><th>Harga</th><th>Lokasi</th><th>Batas Ambil</th><th>Status</th><th>Aksi</th></tr></thead>
                  <tbody>{listings.slice(0, 5).map((item) => (
                    <tr key={item.id}>
                      <td><b>{item.nama_makanan}</b><p className="text-xs text-stone-500">{item.kategori} · {item.jumlah_tersedia ?? item.jumlah_kantong} kantong tersisa</p></td>
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
                              if(confirm("Tandai stok ini habis/ludes terjual offline?")) {
                                //@ts-ignore - added in store
                                mitraUpdateListingStatus?.(item.id, "habis")
                              }
                            }}
                          >
                            Tandai Habis
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </section>

          <section className="soft-panel p-5">
            <div className="mb-4">
              <h2 className="text-xl font-black text-brand-900">Konfirmasi Pengambilan</h2>
              <p className="text-sm text-stone-500">Masukkan kode pengambilan 6 digit yang ditunjukkan mahasiswa saat datang mengambil pesanan.</p>
            </div>
            {reservations.filter((r) => r.status === "reserved").length === 0 ? (
              <EmptyState title="Belum ada reservasi menunggu" description="Reservasi mahasiswa akan muncul di sini secara instan, tanpa perlu Anda approve terlebih dulu." />
            ) : (
              <div className="space-y-3">
                {reservations.filter((r) => r.status === "reserved").map((reservation) => {
                  const listing = listings.find((l) => l.id === reservation.listing_id);
                  return (
                    <div key={reservation.id} className="flex flex-col gap-3 rounded-3xl border border-stone-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <b className="text-ink">{listing?.nama_makanan || "Kantong surplus"}</b>
                        <p className="text-xs text-stone-500">{reservation.jumlah} kantong · {formatRupiah(reservation.total_harga)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input value={codeInputs[reservation.id] || ""} onChange={(e) => setCodeInputs((old) => ({ ...old, [reservation.id]: e.target.value }))} placeholder="Kode 6 digit" className="w-32" />
                        <Button size="sm" onClick={() => submitCode(reservation.id)}><FiCheckCircle /> Konfirmasi</Button>
                      </div>
                      {feedback[reservation.id] && <p className="text-xs font-bold text-brand-700 sm:basis-full">{feedback[reservation.id]}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-brand-100 bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-card">
            <h3 className="text-xl font-black">Ringkasan Dampak</h3>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-white/10 p-4"><b>{kantongTerjual} kantong</b><p className="text-sm text-white/75">terjual, sisa dagangan tidak terbuang</p></div>
              <div className="rounded-2xl bg-white/10 p-4"><b>{formatRupiah(pendapatanBersih)}</b><p className="text-sm text-white/75">pendapatan tambahan bersih</p></div>
            </div>
            <Button asChild className="mt-5 w-full bg-white text-brand-800 hover:bg-brand-50"><Link href="/mitra/posting"><FiPlus /> Posting Kantong Surplus</Link></Button>
          </div>
          <div className="soft-panel p-5">
            <h3 className="font-black text-brand-900">Insight Mitra</h3>
            <div className="mt-4 space-y-3 text-sm text-stone-600">
              <p className="rounded-2xl bg-brand-50 p-3"><FiTrendingUp className="mr-2 inline" /> Insight akan aktif setelah ada minimal 3 kantong surplus terjual.</p>
              <p>Rekomendasi jam posting dan harga terbaik akan dihitung dari histori akun Anda.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
