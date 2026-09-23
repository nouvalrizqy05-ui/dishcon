"use client";

import { useState } from "react";
import { FiCheckCircle, FiDownload, FiSearch, FiXCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDishconData } from "@/lib/dishcon-store";
import { EmptyState, StatusBadge, statusHint, formatRupiah } from "@/components/pages/shared";

export function MitraHistoryPage() {
  const { listings, reservations, completeReservation } = useDishconData();
  const [q, setQ] = useState("");
  const [codeInputs, setCodeInputs] = useState<Record<string, string>>({});
  const filtered = listings.filter((l) => `${l.nama_makanan} ${l.kategori} ${l.lokasi} ${l.status}`.toLowerCase().includes(q.toLowerCase()));

  async function confirm(reservationId: string) {
    const code = codeInputs[reservationId]?.trim();
    if (!code) return;
    try { await completeReservation(reservationId, code); } catch { /* pesan error ditampilkan lewat status baris */ }
  }

  return (
    <div className="space-y-6">
      <section className="soft-panel p-5">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="text-xl font-black text-brand-900">Riwayat Kantong Surplus</h2><p className="text-stone-500">Semua listing berasal dari database akun mitra.</p></div><Button variant="secondary"><FiDownload /> Export</Button></div>
        <div className="relative mb-5"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" /><Input value={q} onChange={(e) => setQ(e.target.value)} className="pl-11" placeholder="Cari riwayat listing..." /></div>
        {filtered.length === 0 ? <EmptyState title="Belum ada riwayat listing" description="Riwayat akan muncul setelah Anda memposting kantong surplus." /> : <div className="overflow-x-auto"><table className="mockup-table min-w-[820px] w-full"><thead><tr><th>Makanan</th><th>Harga</th><th>Lokasi</th><th>Batas Ambil</th><th>Status</th></tr></thead><tbody>{filtered.map((l) => <tr key={l.id}><td><b>{l.nama_makanan}</b><p className="text-xs text-stone-500">{l.kategori} · {l.jumlah_tersedia ?? l.jumlah_kantong}/{l.jumlah_kantong} kantong</p></td><td>{formatRupiah(l.harga_diskon)}</td><td>{l.lokasi}</td><td>{new Date(l.batas_waktu).toLocaleString("id-ID")}</td><td><StatusBadge status={l.status} /></td></tr>)}</tbody></table></div>}
      </section>

      <section className="soft-panel p-5">
        <div className="mb-4"><h2 className="text-xl font-black text-brand-900">Reservasi Masuk</h2><p className="text-sm text-stone-500">Masukkan kode pengambilan 6 digit untuk menandai reservasi selesai.</p></div>
        {reservations.length === 0 ? <EmptyState title="Belum ada reservasi" description="Reservasi mahasiswa terhadap kantong surplus Anda akan tampil di sini." /> : (
          <div className="overflow-x-auto"><table className="mockup-table min-w-[820px] w-full"><thead><tr><th>Makanan</th><th>Jumlah</th><th>Total</th><th>Komisi (10%)</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{reservations.map((r) => {
            const listing = listings.find((l) => l.id === r.listing_id);
            return <tr key={r.id}><td><b>{listing?.nama_makanan || "-"}</b></td><td>{r.jumlah}</td><td>{formatRupiah(r.total_harga)}</td><td>{formatRupiah(r.komisi_platform)}</td><td><StatusBadge status={r.status} /></td><td>{r.status === "reserved" ? <div className="flex items-center gap-2"><Input value={codeInputs[r.id] || ""} onChange={(e) => setCodeInputs((old) => ({ ...old, [r.id]: e.target.value }))} placeholder="Kode" className="w-24" /><Button size="sm" onClick={() => confirm(r.id)}><FiCheckCircle /></Button></div> : <span className="text-xs text-stone-400">-</span>}</td></tr>;
          })}</tbody></table></div>
        )}
      </section>
    </div>
  );
}

export function MahasiswaHistoryPage() {
  const { reservations, listings, cancelReservation } = useDishconData();
  const [q, setQ] = useState("");
  const filtered = reservations.filter((r) => {
    const listing = listings.find((l) => l.id === r.listing_id);
    return `${r.id} ${listing?.nama_makanan || ""} ${r.status}`.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <section className="soft-panel p-5">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="text-xl font-black text-brand-900">Reservasi Saya</h2><p className="text-stone-500">Tunjukkan kode pengambilan ke mitra saat serah terima.</p></div><Button variant="secondary"><FiDownload /> Export</Button></div>
      <div className="relative mb-5"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" /><Input value={q} onChange={(e) => setQ(e.target.value)} className="pl-11" placeholder="Cari reservasi..." /></div>
      {filtered.length === 0 ? <EmptyState title="Belum ada reservasi" description="Setelah memesan kantong surplus dari katalog, status dan kode pengambilan akan tersimpan di sini." /> : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => {
            const listing = listings.find((l) => l.id === r.listing_id);
            return (
              <div key={r.id} className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-card">
                <div className="p-5 border-b border-dashed border-stone-200 bg-stone-50">
                  <div className="flex justify-between items-start mb-2">
                    <StatusBadge status={r.status} />
                    <span className="text-xs text-stone-500 font-bold">{new Date(r.created_at).toLocaleDateString("id-ID")}</span>
                  </div>
                  <h3 className="text-lg font-black text-brand-900 line-clamp-1" title={listing?.nama_makanan}>{listing?.nama_makanan || "-"}</h3>
                  <p className="text-sm text-stone-500 mt-1">{r.jumlah} kantong • {formatRupiah(r.total_harga)}</p>
                </div>
                
                <div className="p-5 flex flex-col items-center justify-center bg-white relative">
                  {/* Decorative ticket cutouts */}
                  <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-white border-r border-b border-stone-200"></div>
                  <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-white border-l border-b border-stone-200"></div>
                  
                  {r.status === "reserved" ? (
                    <>
                      <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Kode Pengambilan</p>
                      <div className="bg-brand-50 border-2 border-brand-200 rounded-2xl py-3 px-6 w-full text-center">
                        <span className="text-3xl font-black tracking-widest text-brand-700">{r.kode_pengambilan}</span>
                      </div>
                      <p className="mt-3 text-xs text-center text-stone-500 px-4">{statusHint(r.status)}</p>
                    </>
                  ) : (
                    <div className="py-6 flex flex-col items-center opacity-50">
                      <FiXCircle className="text-4xl text-stone-300 mb-2" />
                      <p className="text-sm font-bold text-stone-400">Tiket Tidak Aktif</p>
                      <p className="mt-1 text-xs text-center text-stone-400">{statusHint(r.status)}</p>
                    </div>
                  )}
                </div>

                {r.status === "reserved" && (
                  <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-center">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        if (confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
                          cancelReservation(r.id);
                        }
                      }}
                    >
                      <FiXCircle className="mr-2" /> Batalkan Pesanan
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
