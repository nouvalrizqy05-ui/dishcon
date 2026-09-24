"use client";

import { useState } from "react";
import { FiCheckCircle, FiGift, FiHome, FiPlus, FiUsers } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { useDishconData } from "@/lib/dishcon-store";
import { EmptyState, Field, StatusBadge, formatRupiah } from "@/components/pages/shared";

/** Model retensi P2P: berbagi bahan makanan antar penghuni kos, bukan marketplace utama. */
export function KosSharePage() {
  const { user } = useAuth();
  const { kosShares, createKosShare, updateKosShareStatus } = useDishconData();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const tersedia = kosShares.filter((item) => item.status === "tersedia");
  const milikSaya = kosShares.filter((item) => item.poster_id === user?.id);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const namaItem = String(form.get("nama_item") || "").trim();
    const lokasiKos = String(form.get("lokasi_kos") || "").trim();
    const harga = Number(form.get("harga") || 0);
    const deskripsi = String(form.get("deskripsi") || "").trim();
    if (!namaItem || !lokasiKos) {
      setMessage("Nama item dan lokasi kos wajib diisi.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await createKosShare({ nama_item: namaItem, lokasi_kos: lokasiKos, harga, deskripsi });
      setMessage("Berhasil dibagikan ke sesama penghuni kos.");
      formElement.reset();
      setOpen(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal membagikan item.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white shadow-card sm:rounded-[2rem] sm:p-6">
        <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10" />
        <div className="relative z-10">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10"><FiUsers className="h-6 w-6" aria-hidden="true" /></span>
          <h2 className="mt-4 text-2xl font-black sm:text-3xl">Berbagi Antar Kos</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">Bagikan atau ambil bahan makanan gratis/murah dari sesama mahasiswa di sekitar Anda.</p>
          <Button type="button" onClick={() => setOpen((value) => !value)} className="mt-4 w-full bg-white text-brand-800 hover:bg-brand-50 sm:w-auto"><FiPlus aria-hidden="true" /> {open ? "Tutup Form" : "Bagikan Item"}</Button>
        </div>
      </section>

      {message && !open && <p role="status" className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm font-bold text-brand-700">{message}</p>}

      {open && (
        <form onSubmit={submit} className="soft-panel space-y-4 p-4 sm:p-6">
          <div>
            <h3 className="text-lg font-black text-stone-900">Detail Item</h3>
            <p className="mt-1 text-sm text-stone-500">Isi kondisi dan lokasi agar campus community mudah menemukan item.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nama Item"><Input name="nama_item" required placeholder="Contoh: Telur 6 butir" /></Field>
            <Field label="Lokasi Kos"><Input name="lokasi_kos" required placeholder="Nama/alamat kos" /></Field>
            <Field label="Harga (0 = gratis)"><Input name="harga" type="number" inputMode="numeric" min="0" defaultValue={0} /></Field>
          </div>
          <Field label="Catatan"><Textarea name="deskripsi" placeholder="Kondisi bahan, batas waktu ambil, dan informasi penting lainnya." /></Field>
          {message && <p role="status" className="rounded-2xl bg-brand-50 p-3 text-sm font-bold text-brand-700">{message}</p>}
          <Button disabled={loading} className="w-full sm:w-auto">{loading ? "Menyimpan..." : "Bagikan Sekarang"}</Button>
        </form>
      )}

      <section className="soft-panel p-4 sm:p-6">
        <h3 className="mb-4 text-lg font-black text-stone-900 sm:text-xl">Tersedia dari Mahasiswa Lain</h3>
        {tersedia.length === 0 ? (
          <EmptyState title="Belum ada yang dibagikan" description="Jadilah yang pertama membagikan bahan makanan ke sesama penghuni kos." />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
            {tersedia.map((item) => (
              <article key={item.id} className="rounded-2xl border border-stone-200 p-3 sm:rounded-3xl sm:p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-brand-50 text-brand-700 sm:h-10 sm:w-10"><FiGift aria-hidden="true" /></span>
                  <span className="text-xs font-black text-brand-700 sm:text-sm">{item.harga > 0 ? formatRupiah(item.harga) : "Gratis"}</span>
                </div>
                <h4 className="mt-3 line-clamp-2 text-sm font-black leading-5 text-stone-900">{item.nama_item}</h4>
                <p className="mt-1 flex items-start gap-1.5 text-[10px] leading-4 text-stone-500 sm:text-sm"><FiHome className="mt-0.5 shrink-0" aria-hidden="true" /> {item.lokasi_kos}</p>
                {item.deskripsi && <p className="mt-2 line-clamp-2 text-xs leading-5 text-stone-500">{item.deskripsi}</p>}
                {item.poster_id !== user?.id && <Button type="button" size="sm" className="mt-3 w-full px-2 text-[10px] sm:mt-4 sm:text-sm" onClick={() => updateKosShareStatus(item.id, "diambil")}><FiCheckCircle aria-hidden="true" /> <span className="hidden sm:inline">Tandai Sudah Diambil</span><span className="sm:hidden">Diambil</span></Button>}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="soft-panel p-4 sm:p-6">
        <h3 className="mb-4 text-lg font-black text-stone-900 sm:text-xl">Item Saya</h3>
        {milikSaya.length === 0 ? (
          <EmptyState title="Belum ada item yang Anda bagikan" description="Item yang Anda posting akan tampil di sini." />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
            {milikSaya.map((item) => (
              <article key={item.id} className="rounded-2xl border border-stone-200 p-3 sm:rounded-3xl sm:p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3"><h4 className="line-clamp-2 text-sm font-black text-stone-900">{item.nama_item}</h4><StatusBadge status={item.status} /></div>
                <p className="mt-2 text-sm font-black text-brand-700">{item.harga > 0 ? formatRupiah(item.harga) : "Gratis"}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
