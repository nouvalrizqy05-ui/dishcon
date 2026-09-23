"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FiActivity, FiCheck, FiDatabase, FiEye, FiMap, FiMapPin, FiPackage, FiSearch,
  FiShield, FiUserCheck, FiUsers, FiX, FiZap
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useDishconData } from "@/lib/dishcon-store";
import { buildMapsEmbedUrl, buildMapsSearchUrl } from "@/lib/maps";
import type { Profile, Reservation, SurplusListing } from "@/lib/types";
import { EmptyState, MetricCard, StatusBadge, statusHint, readableStatus, formatRupiah } from "@/components/pages/shared";
import { ProfilePage, NotificationsPage, SettingsPage, ComplaintPage } from "@/components/pages/account-pages";

function profileLabel(profiles: Profile[], id?: string) {
  if (!id) return "-";
  const profile = profiles.find((item) => item.id === id);
  if (!profile) return id.slice(0, 8);
  const extra = profile.nama_usaha || profile.nama_kos;
  return extra ? `${profile.name} (${extra})` : profile.name;
}

function listValue(value: unknown) {
  return Array.isArray(value) && value.length ? value.join(", ") : "-";
}

function Detail({ label, value }: { label: string; value: unknown }) {
  return <div className="rounded-2xl bg-stone-50 p-4"><span className="text-xs font-black uppercase tracking-widest text-stone-400">{label}</span><p className="mt-1 font-bold text-ink">{value !== undefined && value !== null && value !== "" ? String(value) : "-"}</p></div>;
}

function AiNutritionPanel({ listing }: { listing: SurplusListing }) {
  return (
    <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
      <b className="text-blue-900">AI Nutrition & Alergen</b>
      <div className="mt-3 grid gap-2 text-sm text-blue-900 md:grid-cols-2">
        <p>Kalori/kantong: {String(listing.nutrition?.calories_estimate ?? listing.nutrition?.calories ?? "-")}</p>
        <p>Protein: {String(listing.nutrition?.protein ?? "-")}</p>
        <p>Karbohidrat: {String(listing.nutrition?.carbohydrate ?? listing.nutrition?.carbs ?? "-")}</p>
        <p>Lemak: {String(listing.nutrition?.fat ?? "-")}</p>
      </div>
      <div className="mt-3 space-y-1 text-sm leading-6 text-blue-900">
        <p><b>Bahan utama:</b> {listValue(listing.nutrition?.ingredients_detected)}</p>
        <p><b>Alergen:</b> {Array.isArray(listing.nutrition?.allergens) && listing.nutrition.allergens.length ? listing.nutrition.allergens.join(", ") : "Tidak teridentifikasi"}</p>
        <p><b>Catatan:</b> {String(listing.nutrition?.nutrition_note || listing.nutrition?.recommendation || "-")}</p>
      </div>
    </div>
  );
}

function AiExpiryPanel({ listing }: { listing: SurplusListing }) {
  return (
    <div className="rounded-3xl border border-orange-100 bg-orange-50 p-5">
      <b className="text-orange-900">AI Expiry Risk</b>
      <p className="mt-3 text-lg font-black text-orange-700">{listing.expiry?.risk_level || "Belum dianalisis"}</p>
      <div className="mt-3 space-y-2 text-sm leading-6 text-orange-900">
        <p><b>Aman dikonsumsi:</b> {listing.expiry?.safe_hours !== undefined ? `${listing.expiry.safe_hours} jam` : "-"}</p>
        <p><b>Konsumsi sebelum:</b> {listing.expiry?.recommended_consume_before || "-"}</p>
        <p><b>Penyimpanan:</b> {listing.expiry?.storage_recommendation || listing.metode_penyimpanan || "-"}</p>
        <p><b>Peringatan:</b> {Array.isArray(listing.expiry?.food_safety_warnings) && listing.expiry.food_safety_warnings.length ? listing.expiry.food_safety_warnings.join(", ") : "Tidak ada peringatan khusus"}</p>
      </div>
    </div>
  );
}

function ListingDetailDialog({ listing, profiles, onClose }: { listing: SurplusListing | null; profiles: Profile[]; onClose: () => void }) {
  return (
    <Dialog open={Boolean(listing)} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto">
        {listing && <>
          <DialogTitle className="pr-10 text-2xl font-black text-brand-900">Verifikasi Listing: {listing.nama_makanan}</DialogTitle>
          <DialogDescription className="mt-2">Seluruh informasi berikut berasal dari input mitra dan hasil analisis AI.</DialogDescription>
          {listing.image_url && <div className="relative mt-5 h-64 w-full overflow-hidden rounded-3xl"><Image src={listing.image_url} alt={listing.nama_makanan} fill className="object-cover" /></div>}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Detail label="Mitra" value={profileLabel(profiles, listing.mitra_id)} />
            <Detail label="Kategori" value={listing.kategori} />
            <Detail label="Jumlah Kantong" value={`${listing.jumlah_tersedia ?? listing.jumlah_kantong}/${listing.jumlah_kantong} tersisa`} />
            <Detail label="Halal" value={listing.halal ? "Ya" : "Tidak / belum diklaim"} />
            <Detail label="Harga" value={`${formatRupiah(listing.harga_diskon)} (normal ${formatRupiah(listing.harga_normal)})`} />
            <Detail label="Lokasi" value={listing.lokasi} />
            <Detail label="Penyimpanan" value={listing.metode_penyimpanan || "-"} />
            <Detail label="Batas Ambil" value={new Date(listing.batas_waktu).toLocaleString("id-ID")} />
          </div>
          <div className="mt-4 rounded-3xl border border-stone-200 p-4"><b>Deskripsi Mitra</b><p className="mt-2 whitespace-pre-line text-sm leading-6 text-stone-600">{listing.deskripsi || "Tidak ada deskripsi."}</p></div>
          <div className="mt-4 grid gap-4 md:grid-cols-2"><AiNutritionPanel listing={listing} /><AiExpiryPanel listing={listing} /></div>
          <Button type="button" variant="secondary" className="mt-4 w-full" onClick={() => window.open(buildMapsSearchUrl(listing.lokasi), "_blank", "noopener,noreferrer")}><FiMap /> Buka Lokasi</Button>
        </>}
      </DialogContent>
    </Dialog>
  );
}

export function AdminDashboardPage() {
  const { listings, reservations, profiles, notifications, loading } = useDishconData();
  const pendingListings = listings.filter((item) => item.status === "pending_verification");
  const pendingMitra = profiles.filter((item) => item.role === "mitra" && item.verification_status === "belum_verifikasi");
  const menunggu = reservations.filter((item) => item.status === "reserved").length;
  const assessed = listings.filter((item) => item.nutrition).length;
  const coverage = listings.length ? Math.round((assessed / listings.length) * 100) : 0;
  const komisiTerkumpul = reservations.filter((r) => r.status === "completed").reduce((sum, r) => sum + r.komisi_platform, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={FiPackage} label="Total Kantong Surplus" value={listings.length} hint={`${pendingListings.length} menunggu verifikasi mitra`} />
        <MetricCard icon={FiUsers} label="Total Reservasi" value={reservations.length} hint={`${menunggu} menunggu diambil`} tone="blue" />
        <MetricCard icon={FiZap} label="Cakupan AI" value={`${coverage}%`} hint={`${assessed} listing sudah dianalisis`} tone="purple" />
        <MetricCard icon={FiActivity} label="Komisi Terkumpul" value={formatRupiah(komisiTerkumpul)} hint="Dari reservasi selesai" tone="orange" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="space-y-6">
          <div className="grid gap-5 md:grid-cols-3">
            <Link href="/admin/listings" className="soft-panel p-5 transition hover:-translate-y-1"><FiPackage className="text-2xl text-brand-700" /><h3 className="mt-4 font-black text-ink">Kantong Surplus</h3><p className="mt-2 text-3xl font-black text-brand-700">{pendingListings.length}</p><p className="text-sm text-stone-500">menunggu verifikasi</p></Link>
            <Link href="/admin/mitra" className="soft-panel p-5 transition hover:-translate-y-1"><FiUserCheck className="text-2xl text-blue-700" /><h3 className="mt-4 font-black text-ink">Verifikasi Mitra</h3><p className="mt-2 text-3xl font-black text-blue-700">{pendingMitra.length}</p><p className="text-sm text-stone-500">mitra baru menunggu</p></Link>
            <Link href="/admin/zones" className="soft-panel p-5 transition hover:-translate-y-1"><FiMapPin className="text-2xl text-orange-700" /><h3 className="mt-4 font-black text-ink">Sebaran Lokasi</h3><p className="mt-2 text-3xl font-black text-orange-700">{new Set(listings.map((item) => item.lokasi)).size}</p><p className="text-sm text-stone-500">berdasarkan lokasi mitra</p></Link>
          </div>

          <div className="soft-panel p-5">
            <div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-black text-brand-900">Antrian Verifikasi</h2><p className="text-stone-500">Data nyata dari form mitra dan reservasi mahasiswa.</p></div>{loading && <span className="text-sm text-stone-500">Memuat...</span>}</div>
            {pendingListings.length === 0 && pendingMitra.length === 0 ? <EmptyState title="Tidak ada antrian" description="Semua listing dan mitra sudah diproses." /> : <div className="grid gap-4 md:grid-cols-2"><div className="rounded-3xl border border-stone-200 p-5"><b>Listing Menunggu</b>{pendingListings.slice(0, 4).map((item) => <div key={item.id} className="mt-3 flex items-center justify-between rounded-2xl bg-stone-50 p-3"><span><b className="block text-sm">{item.nama_makanan}</b><span className="text-xs text-stone-500">{item.jumlah_kantong} kantong</span></span><StatusBadge status={item.status} /></div>)}</div><div className="rounded-3xl border border-stone-200 p-5"><b>Mitra Menunggu</b>{pendingMitra.slice(0, 4).map((item) => <div key={item.id} className="mt-3 flex items-center justify-between rounded-2xl bg-stone-50 p-3"><span><b className="block text-sm">{item.name}</b><span className="text-xs text-stone-500">{item.nama_usaha}</span></span><StatusBadge status={item.verification_status || "belum_verifikasi"} /></div>)}</div></div>}
          </div>
        </section>

        <aside className="space-y-5">
          <div className="soft-panel p-5"><h3 className="font-black text-brand-900">Aktivitas Terbaru</h3>{notifications.length === 0 ? <p className="mt-3 text-sm text-stone-500">Belum ada aktivitas admin.</p> : <div className="mt-4 space-y-3">{notifications.slice(0, 6).map((item) => <div key={item.id} className="rounded-2xl bg-stone-50 p-3"><b className="text-sm">{item.title}</b><p className="text-xs text-stone-500">{item.message}</p></div>)}</div>}</div>
          <div className="rounded-[2rem] border border-brand-100 bg-brand-50 p-5"><FiShield className="text-2xl text-brand-700" /><h3 className="mt-3 font-black text-brand-900">Akses Admin Terkendali</h3><p className="mt-2 text-sm text-brand-800">Admin tidak dapat didaftarkan melalui formulir publik. Role admin dibuat oleh pengelola sistem.</p></div>
        </aside>
      </div>
    </div>
  );
}

export function AdminListingsPage() {
  const { listings, profiles, loading, updateListingStatus } = useDishconData();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<SurplusListing | null>(null);
  const filtered = useMemo(() => listings.filter((item) => {
    const mitra = profileLabel(profiles, item.mitra_id);
    return `${item.nama_makanan} ${item.lokasi} ${mitra}`.toLowerCase().includes(q.toLowerCase()) && (status === "all" || item.status === status);
  }), [listings, profiles, q, status]);

  return <>
    <section className="soft-panel p-5">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-2xl font-black text-brand-900">Manajemen Kantong Surplus</h2><p className="text-stone-500">Memeriksa foto, data form, AI Nutrition, dan Expiry Risk.</p></div><div className="flex gap-2"><div className="relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" /><Input value={q} onChange={(event) => setQ(event.target.value)} className="pl-10" placeholder="Cari listing..." /></div><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-2xl border border-stone-200 px-3 text-sm font-bold"><option value="all">Semua</option><option value="pending_verification">Menunggu</option><option value="active">Aktif</option><option value="habis">Habis</option><option value="ditolak">Ditolak</option></select></div></div>
      {loading ? <p>Memuat data...</p> : filtered.length === 0 ? <EmptyState title="Belum ada kantong surplus" description="Listing yang dibuat akun mitra akan tampil otomatis pada halaman ini." /> : <div className="overflow-x-auto"><table className="mockup-table min-w-[1100px] w-full"><thead><tr><th>Foto</th><th>Makanan</th><th>Mitra</th><th>Harga</th><th>AI Assessment</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td>{item.image_url ? <div className="relative h-14 w-16 overflow-hidden rounded-xl"><Image src={item.image_url} alt="" fill className="object-cover" /></div> : <div className="grid h-14 w-16 place-items-center rounded-xl bg-stone-100">🍱</div>}</td><td><b>{item.nama_makanan}</b><p className="text-xs text-stone-500">{item.jumlah_kantong} kantong · {item.kategori}</p></td><td>{profileLabel(profiles, item.mitra_id)}</td><td>{formatRupiah(item.harga_diskon)}</td><td><p className="max-w-[260px] text-xs"><b>{String(item.nutrition?.calories_estimate || "Belum ada")}</b><br />{item.expiry?.risk_level || "Belum dianalisis"}</p></td><td><StatusBadge status={item.status} /></td><td><div className="flex gap-2"><Button size="sm" variant="secondary" onClick={() => setSelected(item)}><FiEye /> Detail</Button><Button size="sm" onClick={() => updateListingStatus(item.id, "active")} disabled={item.status === "active"}><FiCheck /> Aktifkan</Button><Button size="sm" variant="secondary" onClick={() => updateListingStatus(item.id, "ditarik")} disabled={item.status === "ditarik"}><FiX /> Tarik</Button></div></td></tr>)}</tbody></table></div>}
    </section>
    <ListingDetailDialog listing={selected} profiles={profiles} onClose={() => setSelected(null)} />
  </>;
}

export function AdminMitraPage() {
  const { profiles, listings, loading, verifyMitra } = useDishconData();
  const [q, setQ] = useState("");
  const mitras = useMemo(() => profiles.filter((item) => item.role === "mitra" && `${item.name} ${item.nama_usaha || ""} ${item.email}`.toLowerCase().includes(q.toLowerCase())), [profiles, q]);

  return (
    <section className="soft-panel p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div><h2 className="text-2xl font-black text-brand-900">Verifikasi Mitra</h2><p className="mt-1 text-stone-500">Verifikasi hanya dilakukan sekali per mitra — listing berikutnya otomatis tayang tanpa approval berlapis.</p></div>
        <div className="relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" /><Input value={q} onChange={(event) => setQ(event.target.value)} className="pl-10" placeholder="Cari mitra..." /></div>
      </div>
      {loading ? <p>Memuat mitra...</p> : mitras.length === 0 ? <EmptyState title="Belum ada mitra" description="Akun mitra akan tampil di sini setelah registrasi." /> : (
        <div className="overflow-x-auto"><table className="mockup-table min-w-[900px] w-full"><thead><tr><th>Mitra</th><th>Jenis Usaha</th><th>Kontak</th><th>Listing</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{mitras.map((mitra) => {
          const jumlahListing = listings.filter((item) => item.mitra_id === mitra.id).length;
          return <tr key={mitra.id}><td><b>{mitra.nama_usaha || mitra.name}</b><p className="text-xs text-stone-500">{mitra.name}</p></td><td>{readableStatus(mitra.jenis_usaha || "lainnya")}</td><td>{mitra.email}<p className="text-xs text-stone-500">{mitra.phone}</p></td><td>{jumlahListing}</td><td><StatusBadge status={mitra.verification_status || "belum_verifikasi"} /></td><td><div className="flex gap-2"><Button size="sm" onClick={() => verifyMitra(mitra.id, "terverifikasi")} disabled={mitra.verification_status === "terverifikasi"}><FiCheck /> Verifikasi</Button><Button size="sm" variant="secondary" onClick={() => verifyMitra(mitra.id, "ditangguhkan")} disabled={mitra.verification_status === "ditangguhkan"}><FiX /> Tangguhkan</Button></div></td></tr>;
        })}</tbody></table></div>
      )}
    </section>
  );
}

export function AdminReservationsPage() {
  const { reservations, listings, profiles, loading } = useDishconData();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Reservation | null>(null);
  const filtered = useMemo(() => reservations.filter((item) => {
    const listing = listings.find((l) => l.id === item.listing_id);
    const mahasiswa = profileLabel(profiles, item.mahasiswa_id);
    return `${item.id} ${listing?.nama_makanan || ""} ${mahasiswa}`.toLowerCase().includes(q.toLowerCase()) && (status === "all" || item.status === status);
  }), [listings, profiles, q, reservations, status]);
  const selectedListing = selected ? listings.find((l) => l.id === selected.listing_id) : undefined;

  return <>
    <section className="soft-panel p-5">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-2xl font-black text-brand-900">Reservasi</h2><p className="text-stone-500">Reservasi tercatat instan — admin hanya memantau, tidak menyetujui manual.</p></div><div className="flex gap-2"><div className="relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" /><Input value={q} onChange={(event) => setQ(event.target.value)} className="pl-10" placeholder="Cari reservasi..." /></div><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-2xl border border-stone-200 px-3 text-sm font-bold"><option value="all">Semua</option><option value="reserved">Menunggu</option><option value="completed">Selesai</option><option value="dibatalkan">Dibatalkan</option></select></div></div>
      {loading ? <p>Memuat data...</p> : filtered.length === 0 ? <EmptyState title="Belum ada reservasi" description="Reservasi mahasiswa akan tampil otomatis setelah dibuat dari katalog." /> : <div className="overflow-x-auto"><table className="mockup-table min-w-[1050px] w-full"><thead><tr><th>ID</th><th>Mahasiswa</th><th>Makanan</th><th>Mitra</th><th>Jumlah</th><th>Total</th><th>Komisi</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{filtered.map((item) => { const listing = listings.find((l) => l.id === item.listing_id); return <tr key={item.id}><td>{item.id.slice(0, 8)}</td><td>{profileLabel(profiles, item.mahasiswa_id)}</td><td><b>{listing?.nama_makanan || "-"}</b></td><td>{profileLabel(profiles, item.mitra_id)}</td><td>{item.jumlah}</td><td>{formatRupiah(item.total_harga)}</td><td>{formatRupiah(item.komisi_platform)}</td><td><StatusBadge status={item.status} /></td><td><Button size="sm" variant="secondary" onClick={() => setSelected(item)}><FiEye /> Detail</Button></td></tr>; })}</tbody></table></div>}
    </section>
    <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}>
      <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
        {selected && <>
          <DialogTitle className="pr-10 text-2xl font-black text-brand-900">Detail Reservasi</DialogTitle>
          <DialogDescription className="mt-2">Status dikelola otomatis oleh sistem sejak reservasi dibuat.</DialogDescription>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Detail label="Mahasiswa" value={profileLabel(profiles, selected.mahasiswa_id)} />
            <Detail label="Mitra" value={profileLabel(profiles, selected.mitra_id)} />
            <Detail label="Makanan" value={selectedListing?.nama_makanan} />
            <Detail label="Jumlah" value={`${selected.jumlah} kantong`} />
            <Detail label="Kode Pengambilan" value={selected.kode_pengambilan} />
            <Detail label="Status" value={readableStatus(selected.status)} />
          </div>
          <div className="mt-4 rounded-3xl border border-brand-100 bg-brand-50 p-4"><b className="text-brand-900">Keterangan</b><p className="mt-2 text-sm leading-6 text-brand-800">{statusHint(selected.status)}</p></div>
          {selectedListing && <div className="mt-4 grid gap-4 md:grid-cols-2"><AiNutritionPanel listing={selectedListing} /><AiExpiryPanel listing={selectedListing} /></div>}
        </>}
      </DialogContent>
    </Dialog>
  </>;
}

export function AdminUsersPage() {
  const { profiles, loading } = useDishconData();
  const [q, setQ] = useState("");
  const filtered = profiles.filter((item) => `${item.name} ${item.email} ${item.role} ${item.nama_usaha || ""} ${item.nama_kos || ""}`.toLowerCase().includes(q.toLowerCase()));
  return <section className="soft-panel p-6"><div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="text-2xl font-black text-brand-900">Manajemen Pengguna</h2><p className="mt-1 text-stone-500">Profil mitra, mahasiswa, dan admin terpusat untuk keperluan verifikasi.</p></div><div className="relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" /><Input value={q} onChange={(event) => setQ(event.target.value)} className="pl-10" placeholder="Cari pengguna..." /></div></div>{loading ? <p>Memuat pengguna...</p> : filtered.length === 0 ? <EmptyState title="Belum ada pengguna" description="Daftar pengguna akan muncul setelah akun dibuat." /> : <div className="overflow-x-auto"><table className="mockup-table min-w-[850px] w-full"><thead><tr><th>Nama</th><th>Email</th><th>Role</th><th>Detail</th><th>Alamat</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><b>{item.name}</b><p className="text-xs text-stone-500">{item.phone || "-"}</p></td><td>{item.email}</td><td><StatusBadge status={item.role} /></td><td>{item.nama_usaha || item.nama_kos || "-"}</td><td>{item.address || "-"}</td></tr>)}</tbody></table></div>}</section>;
}

export function AdminAiPage() {
  const { listings } = useDishconData();
  const assessed = listings.filter((item) => item.nutrition);
  const providers = Array.from(new Set(assessed.map((item) => String(item.nutrition?.provider || "unknown"))));
  return <div className="grid gap-6 lg:grid-cols-[1fr_340px]"><section className="soft-panel p-6"><h2 className="text-2xl font-black text-brand-900">Implementasi Artificial Intelligence</h2><p className="mt-2 text-stone-500">AI sudah terhubung ke form posting kantong surplus dan hasil analisis tersimpan bersama data makanan.</p><div className="mt-6 grid gap-4 md:grid-cols-2"><div className="rounded-3xl border border-blue-100 bg-blue-50 p-5"><b className="text-blue-900">AI Nutrition Estimator</b><p className="mt-2 text-sm text-blue-800">Menghasilkan estimasi kalori, makronutrisi, serat, serta potensi alergen.</p></div><div className="rounded-3xl border border-orange-100 bg-orange-50 p-5"><b className="text-orange-900">AI Expiry Risk Detection</b><p className="mt-2 text-sm text-orange-800">Mempertimbangkan jenis hidangan, waktu produksi, batas ambil, dan penyimpanan.</p></div></div><h3 className="mt-7 text-lg font-black text-brand-900">Hasil Assessment Terbaru</h3>{assessed.length === 0 ? <EmptyState title="Belum ada assessment" description="Jalankan AI dari formulir posting untuk menampilkan hasil di halaman ini." /> : <div className="mt-4 space-y-3">{assessed.slice(0, 8).map((item) => <div key={item.id} className="grid gap-3 rounded-3xl border border-stone-200 p-4 md:grid-cols-[1fr_180px_1fr]"><div><b>{item.nama_makanan}</b><p className="text-xs text-stone-500">{String(item.nutrition?.provider || "AI")}</p></div><p className="text-sm font-bold text-blue-700">{String(item.nutrition?.calories_estimate || "-")}</p><p className="text-sm text-orange-700">{item.expiry?.risk_level || "-"}</p></div>)}</div>}</section><aside className="space-y-5"><div className="soft-panel p-6"><FiActivity className="text-2xl text-brand-700" /><h3 className="mt-3 font-black text-brand-900">Status Implementasi</h3><p className="mt-3 text-4xl font-black text-brand-700">{assessed.length}</p><p className="text-sm text-stone-500">listing sudah memiliki hasil AI</p></div><div className="soft-panel p-6"><h3 className="font-black text-brand-900">Provider Aktif</h3><div className="mt-3 flex flex-wrap gap-2">{providers.length ? providers.map((provider) => <span key={provider} className="rounded-full bg-stone-100 px-3 py-2 text-xs font-bold">{provider}</span>) : <span className="text-sm text-stone-500">OpenRouter atau local rules akan tercatat setelah assessment.</span>}</div></div></aside></div>;
}

export function AdminZonesPage() {
  const { listings } = useDishconData();
  const zones = useMemo(() => {
    const grouped = new Map<string, SurplusListing[]>();
    listings.forEach((listing) => grouped.set(listing.lokasi, [...(grouped.get(listing.lokasi) || []), listing]));
    return [...grouped.entries()].map(([lokasi, items]) => ({ lokasi, items, kantong: items.reduce((sum, item) => sum + item.jumlah_kantong, 0), active: items.filter((item) => item.status === "active").length }));
  }, [listings]);
  const [selected, setSelected] = useState("");
  const selectedLocation = selected || zones[0]?.lokasi || "Sekaran, Gunungpati, Semarang";

  return <div className="grid gap-6 xl:grid-cols-[360px_1fr]"><aside className="soft-panel p-5"><h2 className="text-2xl font-black text-brand-900">Sebaran Lokasi</h2><p className="mt-2 text-sm text-stone-500">Zona dibuat otomatis dari lokasi yang diinput mitra, bukan lokasi statis.</p>{zones.length === 0 ? <div className="mt-5"><EmptyState title="Belum ada lokasi" description="Lokasi akan muncul setelah mitra mengirim form posting." /></div> : <div className="mt-5 space-y-3">{zones.map((zone) => <button key={zone.lokasi} type="button" onClick={() => setSelected(zone.lokasi)} className={`w-full rounded-3xl border p-4 text-left transition ${selectedLocation === zone.lokasi ? "border-brand-600 bg-brand-50" : "border-stone-200 hover:border-brand-300"}`}><div className="flex items-start gap-3"><FiMapPin className="mt-1 shrink-0 text-brand-700" /><div><b className="block">{zone.lokasi}</b><p className="mt-1 text-xs text-stone-500">{zone.items.length} listing · {zone.kantong} kantong · {zone.active} aktif</p></div></div></button>)}</div>}</aside><section className="soft-panel overflow-hidden p-5"><div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h3 className="text-xl font-black text-brand-900">Peta Lokasi Terpilih</h3><p className="text-sm text-stone-500">{selectedLocation}</p></div><Button type="button" variant="secondary" onClick={() => window.open(buildMapsSearchUrl(selectedLocation), "_blank", "noopener,noreferrer")}><FiMap /> Buka Google Maps</Button></div><iframe title={`Peta ${selectedLocation}`} src={buildMapsEmbedUrl(zones.find((z) => z.lokasi === selectedLocation)?.items[0]?.lat || -7.0507, zones.find((z) => z.lokasi === selectedLocation)?.items[0]?.lng || 110.4381)} className="h-[520px] w-full rounded-[2rem] border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></section></div>;
}

export function AdminComplaintsPage() { return <ComplaintPage role="admin" />; }
export function AdminProfilePage() { return <ProfilePage role="admin" />; }
export function AdminNotificationsPage() { return <NotificationsPage role="admin" />; }
export function AdminSettingsPage() { return <SettingsPage role="admin" />; }
