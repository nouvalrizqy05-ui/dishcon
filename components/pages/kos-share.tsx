"use client";

import { useState } from "react";
import { FiCheckCircle, FiGift, FiHome, FiPlus, FiUsers } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { useDishconData } from "@/lib/dishcon-store";
import { EmptyState, StatusBadge, formatRupiah } from "@/components/pages/shared";

/**
 * Lapisan retensi P2P dari laporan RCA: "Berbagi Antar Kos" -- model gratis/jual
 * murah untuk bahan makanan antar penghuni kos, bukan sumber pendapatan utama.
 */
export function KosSharePage() {
  const { user } = useAuth();
  const { kosShares, createKosShare, updateKosShareStatus } = useDishconData();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const tersedia = kosShares.filter((item) => item.status === "tersedia");
  const milikSaya = kosShares.filter((item) => item.poster_id === user?.id);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nama_item = String(form.get("nama_item") || "").trim();
    const lokasi_kos = String(form.get("lokasi_kos") || "").trim();
    const harga = Number(form.get("harga") || 0);
    const deskripsi = String(form.get("deskripsi") || "").trim();
    if (!nama_item || !lokasi_kos) {
      setMessage("Nama item dan lokasi kos wajib diisi.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await createKosShare({ nama_item, lokasi_kos, harga, deskripsi });
      setMessage("Berhasil dibagikan ke sesama penghuni kos.");
      e.currentTarget.reset();
      setOpen(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal membagikan item.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-card">
        <FiUsers className="text-3xl" />
        <h2 className="mt-3 text-2xl font-black">Berbagi Antar Kos</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">Bagikan atau ambil bahan makanan gratis/murah dari sesama mahasiswa kos di sekitar Anda — fitur komunitas, bukan sumber pendapatan platform.</p>
        <Button type="button" onClick={() => setOpen((value) => !value)} className="mt-4 bg-white text-brand-800 hover:bg-brand-50"><FiPlus /> {open ? "Tutup Form" : "Bagikan Item"}</Button>
      </div>

      {open && (
        <form onSubmit={submit} className="soft-panel space-y-4 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="mb-2 block text-sm font-black text-ink">Nama Item</label><Input name="nama_item" required placeholder="Contoh: Telur 6 butir, sisa beras 1kg" /></div>
            <div><label className="mb-2 block text-sm font-black text-ink">Lokasi Kos</label><Input name="lokasi_kos" required placeholder="Nama/alamat kos Anda" /></div>
            <div><label className="mb-2 block text-sm font-black text-ink">Harga (0 = gratis)</label><Input name="harga" type="number" min="0" defaultValue={0} /></div>
          </div>
          <div><label className="mb-2 block text-sm font-black text-ink">Catatan</label><Textarea name="deskripsi" placeholder="Kondisi bahan, batas waktu ambil, dsb." /></div>
          {message && <p className="text-sm font-bold text-brand-700">{message}</p>}
          <Button disabled={loading}>{loading ? "Menyimpan..." : "Bagikan Sekarang"}</Button>
        </form>
      )}

      <section className="soft-panel p-6">
        <h3 className="mb-4 text-xl font-black text-brand-900">Tersedia dari Mahasiswa Lain</h3>
        {tersedia.length === 0 ? <EmptyState title="Belum ada yang dibagikan" description="Jadilah yang pertama membagikan bahan makanan ke sesama penghuni kos." /> : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tersedia.map((item) => (
              <div key={item.id} className="rounded-3xl border border-stone-200 p-4">
                <div className="flex items-center justify-between"><FiGift className="text-xl text-brand-700" /><span className="font-black text-brand-700">{item.harga > 0 ? formatRupiah(item.harga) : "Gratis"}</span></div>
                <p className="mt-3 font-black text-ink">{item.nama_item}</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-stone-500"><FiHome /> {item.lokasi_kos}</p>
                {item.deskripsi && <p className="mt-2 text-sm text-stone-500">{item.deskripsi}</p>}
                {item.poster_id !== user?.id && <Button type="button" size="sm" className="mt-4 w-full" onClick={() => updateKosShareStatus(item.id, "diambil")}><FiCheckCircle /> Tandai Sudah Diambil</Button>}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="soft-panel p-6">
        <h3 className="mb-4 text-xl font-black text-brand-900">Item Saya</h3>
        {milikSaya.length === 0 ? <EmptyState title="Belum ada item yang Anda bagikan" description="Item yang Anda posting akan tampil di sini." /> : (
          <div className="overflow-x-auto"><table className="mockup-table min-w-[600px] w-full"><thead><tr><th>Item</th><th>Harga</th><th>Status</th></tr></thead><tbody>{milikSaya.map((item) => <tr key={item.id}><td>{item.nama_item}</td><td>{item.harga > 0 ? formatRupiah(item.harga) : "Gratis"}</td><td><StatusBadge status={item.status} /></td></tr>)}</tbody></table></div>
        )}
      </section>
    </div>
  );
}
