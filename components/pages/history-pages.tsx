"use client";

import { useState } from "react";
import { FiCheckCircle, FiDownload, FiMapPin, FiSearch, FiXCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDishconData } from "@/lib/dishcon-store";
import { EmptyState, StatusBadge, statusHint, formatRupiah } from "@/components/pages/shared";

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function MitraHistoryPage() {
  const { listings, reservations, completeReservation } = useDishconData();
  const [query, setQuery] = useState("");
  const [codeInputs, setCodeInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const filtered = listings.filter((listing) => `${listing.nama_makanan} ${listing.kategori} ${listing.lokasi} ${listing.status}`.toLowerCase().includes(query.toLowerCase()));

  async function confirm(reservationId: string) {
    const code = codeInputs[reservationId]?.trim();
    if (!code) return;
    try {
      await completeReservation(reservationId, code);
      setFeedback((old) => ({ ...old, [reservationId]: "Pengambilan berhasil dikonfirmasi." }));
    } catch (error) {
      setFeedback((old) => ({ ...old, [reservationId]: error instanceof Error ? error.message : "Kode tidak cocok." }));
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="soft-panel min-w-0 p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-stone-900 sm:text-xl">Riwayat Kantong Surplus</h2>
            <p className="mt-1 text-sm text-stone-500">Semua listing dari akun mitra Anda.</p>
          </div>
          <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => downloadCsv("dishcon-listing.csv", filtered.map((listing) => [listing.nama_makanan, listing.kategori, listing.lokasi, String(listing.jumlah_tersedia ?? listing.jumlah_kantong), formatRupiah(listing.harga_diskon), listing.status]))}><FiDownload aria-hidden="true" /> Export</Button>
        </div>
        <label className="relative mb-4 block">
          <span className="sr-only">Cari riwayat listing</span>
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" aria-hidden="true" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-11" placeholder="Cari riwayat listing..." />
        </label>

        {filtered.length === 0 ? (
          <EmptyState title="Belum ada riwayat listing" description="Riwayat akan muncul setelah Anda memposting Kantong Surplus." />
        ) : (
          <>
            <div className="space-y-3 xl:hidden">
              {filtered.map((listing) => (
                <article key={listing.id} className="rounded-2xl border border-stone-200 p-3.5 sm:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-black text-stone-900">{listing.nama_makanan}</h3>
                      <p className="mt-1 text-xs text-stone-500">{listing.kategori} · {listing.jumlah_tersedia ?? listing.jumlah_kantong}/{listing.jumlah_kantong} tersisa</p>
                    </div>
                    <StatusBadge status={listing.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-stone-400">Harga diskon</span><b className="mt-0.5 block text-brand-700">{formatRupiah(listing.harga_diskon)}</b></div>
                    <div><span className="text-stone-400">Batas ambil</span><b className="mt-0.5 block text-stone-700">{new Date(listing.batas_waktu).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</b></div>
                  </div>
                  <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-stone-500"><FiMapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {listing.lokasi}</p>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto xl:block">
              <table className="mockup-table min-w-[820px] w-full">
                <thead><tr><th>Makanan</th><th>Harga</th><th>Lokasi</th><th>Batas Ambil</th><th>Status</th></tr></thead>
                <tbody>
                  {filtered.map((listing) => (
                    <tr key={listing.id}>
                      <td><b>{listing.nama_makanan}</b><p className="text-xs text-stone-500">{listing.kategori} · {listing.jumlah_tersedia ?? listing.jumlah_kantong}/{listing.jumlah_kantong} kantong</p></td>
                      <td>{formatRupiah(listing.harga_diskon)}</td>
                      <td>{listing.lokasi}</td>
                      <td>{new Date(listing.batas_waktu).toLocaleString("id-ID")}</td>
                      <td><StatusBadge status={listing.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <section className="soft-panel p-4 sm:p-5" aria-labelledby="reservation-in-title">
        <div className="mb-4">
          <h2 id="reservation-in-title" className="text-lg font-black text-stone-900 sm:text-xl">Reservasi Masuk</h2>
          <p className="mt-1 text-sm leading-6 text-stone-500">Masukkan kode pengambilan 6 digit untuk menandai reservasi selesai.</p>
        </div>
        {reservations.length === 0 ? (
          <EmptyState title="Belum ada reservasi" description="Reservasi mahasiswa terhadap Kantong Surplus Anda akan tampil di sini." />
        ) : (
          <>
            <div className="space-y-3 xl:hidden">
              {reservations.map((reservation) => {
                const listing = listings.find((item) => item.id === reservation.listing_id);
                return (
                  <article key={reservation.id} className="rounded-2xl border border-stone-200 p-3.5 sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0"><h3 className="truncate font-black text-stone-900">{listing?.nama_makanan || "-"}</h3><p className="mt-1 text-xs text-stone-500">{reservation.jumlah} kantong · {formatRupiah(reservation.total_harga)}</p></div>
                      <StatusBadge status={reservation.status} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-stone-500"><span>Komisi platform</span><b className="text-stone-800">{formatRupiah(reservation.komisi_platform)}</b></div>
                    {reservation.status === "reserved" && (
                      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                        <Input value={codeInputs[reservation.id] || ""} onChange={(event) => setCodeInputs((old) => ({ ...old, [reservation.id]: event.target.value }))} placeholder="Kode 6 digit" inputMode="numeric" className="min-w-0" />
                        <Button size="icon" onClick={() => confirm(reservation.id)} aria-label="Konfirmasi pengambilan"><FiCheckCircle aria-hidden="true" /></Button>
                      </div>
                    )}
                    {feedback[reservation.id] && <p role="status" className="mt-2 text-xs font-bold text-brand-700">{feedback[reservation.id]}</p>}
                  </article>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto xl:block">
              <table className="mockup-table min-w-[820px] w-full">
                <thead><tr><th>Makanan</th><th>Jumlah</th><th>Total</th><th>Komisi (10%)</th><th>Status</th><th>Aksi</th></tr></thead>
                <tbody>
                  {reservations.map((reservation) => {
                    const listing = listings.find((item) => item.id === reservation.listing_id);
                    return (
                      <tr key={reservation.id}>
                        <td><b>{listing?.nama_makanan || "-"}</b></td>
                        <td>{reservation.jumlah}</td>
                        <td>{formatRupiah(reservation.total_harga)}</td>
                        <td>{formatRupiah(reservation.komisi_platform)}</td>
                        <td><StatusBadge status={reservation.status} /></td>
                        <td>
                          {reservation.status === "reserved" ? (
                            <div className="flex items-center gap-2"><Input value={codeInputs[reservation.id] || ""} onChange={(event) => setCodeInputs((old) => ({ ...old, [reservation.id]: event.target.value }))} placeholder="Kode" className="w-24" /><Button size="sm" onClick={() => confirm(reservation.id)}><FiCheckCircle aria-hidden="true" /></Button></div>
                          ) : <span className="text-xs text-stone-400">-</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export function MahasiswaHistoryPage() {
  const { reservations, listings, cancelReservation } = useDishconData();
  const [query, setQuery] = useState("");
  const [cancelFeedback, setCancelFeedback] = useState("");
  const filtered = reservations.filter((reservation) => {
    const listing = listings.find((item) => item.id === reservation.listing_id);
    return `${reservation.id} ${listing?.nama_makanan || ""} ${reservation.status}`.toLowerCase().includes(query.toLowerCase());
  });

  async function cancel(reservationId: string) {
    setCancelFeedback("");
    try {
      await cancelReservation(reservationId);
      setCancelFeedback("Reservasi berhasil dibatalkan.");
    } catch (error) {
      setCancelFeedback(error instanceof Error ? error.message : "Reservasi gagal dibatalkan.");
    }
  }

  return (
    <section className="soft-panel p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-stone-900 sm:text-xl">Reservasi Saya</h2>
          <p className="mt-1 text-sm text-stone-500">Tunjukkan kode pengambilan kepada mitra.</p>
        </div>
        <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => downloadCsv("dishcon-reservasi.csv", filtered.map((reservation) => { const listing = listings.find((item) => item.id === reservation.listing_id); return [reservation.id, listing?.nama_makanan || "", String(reservation.jumlah), formatRupiah(reservation.total_harga), reservation.status, reservation.kode_pengambilan]; }))}><FiDownload aria-hidden="true" /> Export</Button>
      </div>
      <label className="relative mb-4 block">
        <span className="sr-only">Cari reservasi</span>
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" aria-hidden="true" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-11" placeholder="Cari reservasi..." />
      </label>
      {cancelFeedback && <p role="status" className="mb-4 rounded-2xl bg-brand-50 p-3 text-sm font-bold text-brand-700">{cancelFeedback}</p>}

      {filtered.length === 0 ? (
        <EmptyState title="Belum ada reservasi" description="Setelah memesan Kantong Surplus, status dan kode pengambilan akan tersimpan di sini." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((reservation) => {
            const listing = listings.find((item) => item.id === reservation.listing_id);
            return (
              <article key={reservation.id} className="relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm sm:rounded-3xl sm:shadow-card">
                <div className="border-b border-dashed border-stone-200 bg-stone-50 p-4 sm:p-5">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <StatusBadge status={reservation.status} />
                    <span className="text-[10px] font-bold text-stone-500 sm:text-xs">{new Date(reservation.created_at).toLocaleDateString("id-ID")}</span>
                  </div>
                  <h3 className="truncate text-base font-black text-stone-900 sm:text-lg" title={listing?.nama_makanan}>{listing?.nama_makanan || "-"}</h3>
                  <p className="mt-1 text-xs text-stone-500 sm:text-sm">{reservation.jumlah} kantong · {formatRupiah(reservation.total_harga)}</p>
                </div>

                <div className="relative flex flex-col items-center justify-center bg-white p-4 sm:p-5">
                  <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full border-b border-r border-stone-200 bg-white" />
                  <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full border-b border-l border-stone-200 bg-white" />
                  {reservation.status === "reserved" ? (
                    <>
                      <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-stone-400 sm:text-xs">Kode Pengambilan</p>
                      <div className="w-full rounded-2xl border-2 border-brand-200 bg-brand-50 px-3 py-3 text-center sm:px-6">
                        <span className="text-2xl font-black tracking-widest text-brand-700 sm:text-3xl">{reservation.kode_pengambilan}</span>
                      </div>
                      <p className="mt-3 px-2 text-center text-xs leading-5 text-stone-500">{statusHint(reservation.status)}</p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center py-5 opacity-60">
                      <FiXCircle className="h-9 w-9 text-stone-300" aria-hidden="true" />
                      <p className="mt-2 text-sm font-bold text-stone-400">Tiket Tidak Aktif</p>
                      <p className="mt-1 text-center text-xs leading-5 text-stone-400">{statusHint(reservation.status)}</p>
                    </div>
                  )}
                </div>

                {reservation.status === "reserved" && (
                  <div className="flex border-t border-stone-100 bg-stone-50 p-3 sm:p-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => {
                        if (confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) void cancel(reservation.id);
                      }}
                    >
                      <FiXCircle className="mr-2" aria-hidden="true" /> Batalkan Pesanan
                    </Button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
