"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FiBell,
  FiCheck,
  FiCrosshair,
  FiEye,
  FiInbox,
  FiLock,
  FiLogOut,
  FiMail,
  FiSave,
  FiSend,
  FiSettings,
  FiSliders,
  FiUser
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { readableRole, useDishconData } from "@/lib/dishcon-store";
import { getCurrentPosition, formatDistanceMeters } from "@/lib/maps";
import type { Complaint, JenisUsaha, Preferences, Profile, UserRole } from "@/lib/types";
import { EmptyState, Field, StatusBadge } from "@/components/pages/shared";
import { MobileUtilityLinks } from "@/components/mobile/mobile-utility-links";

const JENIS_USAHA_OPTIONS: { value: JenisUsaha; label: string }[] = [
  { value: "warmindo", label: "Warmindo" },
  { value: "angkringan", label: "Angkringan" },
  { value: "katering_rumahan", label: "Katering Rumahan" },
  { value: "toko_kue", label: "Toko Kue" },
  { value: "lainnya", label: "Lainnya" }
];

function base(role: UserRole) {
  return role === "mitra" ? "/mitra" : role === "mahasiswa" ? "/mahasiswa" : "/admin";
}

export function ProfilePage({ role }: { role: UserRole }) {
  const { user, updateProfile, logout } = useAuth();
  const [message, setMessage] = useState("");
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(user?.lat && user?.lng ? { lat: user.lat, lng: user.lng } : null);
  if (!user) return null;

  async function captureLocation() {
    setLocating(true);
    setMessage("");
    try {
      const point = await getCurrentPosition();
      setCoords(point);
      await updateProfile({ lat: point.lat, lng: point.lng });
      setMessage("Lokasi GPS berhasil diperbarui.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal mengambil lokasi GPS.");
    } finally {
      setLocating(false);
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      const patch: Partial<Profile> = {
        name: String(form.get("name") || ""),
        phone: String(form.get("phone") || ""),
        address: String(form.get("address") || "")
      };
      if (role === "mitra") {
        patch.nama_usaha = String(form.get("nama_usaha") || "");
        patch.jenis_usaha = (form.get("jenis_usaha") as JenisUsaha) || "lainnya";
      }
      if (role === "mahasiswa") {
        patch.nama_kos = String(form.get("nama_kos") || "");
      }
      await updateProfile(patch);
      setMessage("Profil berhasil disimpan.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Profil gagal disimpan.");
    }
  }

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <form onSubmit={submit} className="soft-panel p-4 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-700 text-lg font-black text-white">{user.name.slice(0, 2).toUpperCase()}</span>
          <div><h2 className="text-2xl font-black text-brand-900">Profil Saya</h2><p className="text-stone-500">Profil ini dipakai untuk verifikasi {readableRole(role).toLowerCase()}.</p></div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Nama Lengkap"><Input name="name" defaultValue={user.name} /></Field>
          <Field label="Email"><Input value={user.email} readOnly /></Field>
          <Field label="Nomor Telepon"><Input name="phone" type="tel" inputMode="tel" defaultValue={user.phone || ""} /></Field>
          <Field label="Peran"><Input value={readableRole(role)} readOnly /></Field>
          {role === "mitra" && <>
            <Field label="Nama Usaha"><Input name="nama_usaha" defaultValue={user.nama_usaha || ""} placeholder="Nama warung/usaha" /></Field>
            <Field label="Jenis Usaha"><select name="jenis_usaha" defaultValue={user.jenis_usaha || "lainnya"} className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 font-semibold outline-none focus:ring-2 focus:ring-brand-500">{JENIS_USAHA_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></Field>
          </>}
          {role === "mahasiswa" && <Field label="Nama Kos"><Input name="nama_kos" defaultValue={user.nama_kos || ""} placeholder="Contoh: Kos Melati 2" /></Field>}
          <Field label="Alamat"><Input name="address" defaultValue={user.address || ""} placeholder="Alamat lengkap" /></Field>
        </div>
        <div className="mt-5 rounded-3xl border border-brand-100 bg-brand-50 p-4">
          <p className="font-extrabold text-brand-900">Titik Lokasi GPS</p>
          <p className="mt-1 text-xs text-brand-800">Dipakai untuk perhitungan jarak hiperlokal ke {role === "mitra" ? "mahasiswa" : "kantong surplus"}.</p>
          <Button type="button" variant="secondary" className="mt-3" onClick={captureLocation} disabled={locating}><FiCrosshair /> {locating ? "Mengambil lokasi..." : "Perbarui Lokasi Saat Ini"}</Button>
          {coords && <p className="mt-2 text-xs font-bold text-brand-700">Lokasi tersimpan: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</p>}
        </div>
        {message && <p className="mt-5 rounded-2xl bg-brand-50 p-4 text-sm font-bold text-brand-700">{message}</p>}
        <Button className="mt-6 w-full sm:w-auto"><FiSave /> Simpan Profil</Button>
      </form>
      <aside className="space-y-5">
        {role === "mitra" && (
          <div className="soft-panel p-4 sm:p-6">
            <FiUser className="text-2xl text-brand-700" />
            <h3 className="mt-3 font-black text-brand-900">Status Verifikasi</h3>
            <div className="mt-3"><StatusBadge status={user.verification_status || "belum_verifikasi"} /></div>
            <p className="mt-2 text-sm leading-6 text-stone-500">{user.verification_status === "terverifikasi" ? "Semua listing baru tayang otomatis tanpa approval berlapis." : "Listing pertama Anda akan diperiksa admin satu kali."}</p>
          </div>
        )}
        <div className="soft-panel p-4 sm:p-6"><FiLock className="text-2xl text-brand-700" /><h3 className="mt-3 font-black text-brand-900">Akses berdasarkan role</h3><p className="mt-2 text-sm leading-6 text-stone-500">Setiap halaman dilindungi agar mitra, mahasiswa, dan admin hanya membuka menu sesuai perannya.</p></div>
      </aside>
      </div>
      <div className="mt-4 md:hidden">
        <MobileUtilityLinks />
        <button type="button" onClick={logout} className="focus-ring mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 text-sm font-black text-red-700"><FiLogOut aria-hidden="true" /> Logout</button>
      </div>
    </>
  );
}

export function NotificationsPage({ role: _role }: { role: UserRole }) {
  const { notifications, markNotificationRead } = useDishconData();
  return (
    <section className="soft-panel p-5">
      <div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-black text-brand-900">Notifikasi</h2><p className="text-stone-500">Klik kartu untuk menandai sudah dibaca.</p></div><FiBell className="text-2xl text-brand-700" /></div>
      {notifications.length === 0 ? <EmptyState title="Belum ada notifikasi" description="Notifikasi akan muncul setelah ada aktivitas kantong surplus, reservasi, atau pengaduan." /> : (
        <div className="space-y-3">{notifications.map((item) => (
          <div key={item.id} className={`w-full rounded-3xl border p-4 transition hover:shadow-md ${item.is_read ? "border-stone-200 bg-white" : "border-brand-200 bg-brand-50"}`}>
            <button onClick={() => markNotificationRead(item.id)} className="w-full text-left">
              <div className="flex items-start justify-between gap-4"><div><h3 className="font-black text-ink">{item.title}</h3><p className="mt-1 text-sm text-stone-600">{item.message}</p><p className="mt-2 text-xs font-bold text-stone-400">{new Date(item.created_at).toLocaleString("id-ID")}</p></div>{item.is_read ? <FiCheck className="text-brand-700" /> : <span className="rounded-full bg-orange-500 px-2 py-1 text-xs font-black text-white">Baru</span>}</div>
            </button>
            {item.link && <Link href={item.link} className="mt-3 inline-block text-sm font-black text-brand-700">Buka detail →</Link>}
          </div>
        ))}</div>
      )}
    </section>
  );
}

const CATEGORY_OPTIONS = ["Makanan Berat", "Jajanan", "Buah & Sayur", "Minuman"];

function PreferencesForm() {
  const { preferences, updatePreferences } = useDishconData();
  const [prefs, setPrefs] = useState<Preferences>(preferences);
  const [message, setMessage] = useState("");

  useEffect(() => { setPrefs(preferences); }, [preferences]);

  function toggleCategory(category: string) {
    setPrefs((old) => ({
      ...old,
      preferredCategories: old.preferredCategories.includes(category)
        ? old.preferredCategories.filter((x) => x !== category)
        : [...old.preferredCategories, category]
    }));
  }

  async function submit() {
    await updatePreferences(prefs);
    setMessage("Preferensi berhasil disimpan.");
  }

  return (
    <section id="preferensi" className="soft-panel p-4 sm:p-6">
      <div className="mb-6 flex items-center gap-3"><FiSliders className="text-2xl text-brand-700" /><div><h2 className="text-2xl font-black text-brand-900">Preferensi Mahasiswa</h2><p className="text-stone-500">Mengatur radius hiperlokal, kategori, dan filter halal di katalog.</p></div></div>
      <div className="space-y-6">
        <label className="block rounded-3xl border border-stone-200 p-4 font-bold"><input checked={prefs.halal} onChange={(e) => setPrefs({ ...prefs, halal: e.target.checked })} type="checkbox" className="mr-3 accent-brand-700" /> Prioritaskan halal</label>
        <div className="grid gap-3 sm:grid-cols-2"><label className="flex min-h-12 items-center gap-3 rounded-2xl border border-stone-200 p-3 text-sm font-bold"><input checked={prefs.notificationEmail} onChange={(e) => setPrefs({ ...prefs, notificationEmail: e.target.checked })} type="checkbox" className="h-4 w-4 accent-brand-700" /> Notifikasi email</label><label className="flex min-h-12 items-center gap-3 rounded-2xl border border-stone-200 p-3 text-sm font-bold"><input checked={prefs.notificationPush} onChange={(e) => setPrefs({ ...prefs, notificationPush: e.target.checked })} type="checkbox" className="h-4 w-4 accent-brand-700" /> Notifikasi push</label></div>
        <Field label={`Radius Maksimal: ${formatDistanceMeters(prefs.maxRadiusMeter)}`}><input type="range" min="200" max="5000" step="100" value={prefs.maxRadiusMeter} onChange={(e) => setPrefs({ ...prefs, maxRadiusMeter: Number(e.target.value) })} className="w-full accent-brand-700" /></Field>
        <div><p className="mb-3 text-sm font-black text-ink">Kategori Favorit</p><div className="flex flex-wrap gap-3">{CATEGORY_OPTIONS.map((cat) => <button key={cat} type="button" onClick={() => toggleCategory(cat)} className={`rounded-full border px-4 py-2 text-sm font-black ${prefs.preferredCategories.includes(cat) ? "border-brand-600 bg-brand-50 text-brand-700" : "border-stone-200 text-stone-500"}`}>{cat}</button>)}</div></div>
      </div>
      {message && <p className="mt-5 rounded-2xl bg-brand-50 p-4 text-sm font-bold text-brand-700">{message}</p>}
      <Button onClick={submit} className="mt-6 w-full sm:w-auto"><FiSave /> Simpan Preferensi</Button>
    </section>
  );
}

export function PreferencesPage({ role: _role }: { role: UserRole }) {
  return <PreferencesForm />;
}

function SecuritySettingsPanel({ role }: { role: UserRole }) {
  const { user, updatePassword } = useAuth();
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");
    setPasswordMessage("");
    setPasswordError("");

    if (password.length < 8) {
      setPasswordError("Password baru minimal 8 karakter.");
      return;
    }
    if (password !== confirm) {
      setPasswordError("Konfirmasi password belum sama.");
      return;
    }

    setSavingPassword(true);
    const result = await updatePassword(password);
    setSavingPassword(false);

    if (!result.ok) {
      setPasswordError(result.error);
      return;
    }

    setPasswordMessage(result.message || "Password berhasil diperbarui.");
    e.currentTarget.reset();
  }

  return (
    <section id="keamanan" className="soft-panel p-4 sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-900">Keamanan Akun</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
            Ubah password akun {readableRole(role).toLowerCase()} yang sedang aktif.
          </p>
        </div>
        <FiLock className="shrink-0 text-2xl text-brand-700" />
      </div>

      <form onSubmit={changePassword} className="rounded-3xl border border-stone-200 bg-white p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-black text-brand-900">Ubah Password</h3>
            <p className="mt-1 text-sm text-stone-500">Akun aktif: <span className="font-bold text-ink">{user?.email || "-"}</span></p>
          </div>
          <span className="w-fit rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-700">{readableRole(role)}</span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Password Baru">
            <Input name="password" type="password" minLength={8} required placeholder="Minimal 8 karakter" autoComplete="new-password" />
          </Field>
          <Field label="Konfirmasi Password Baru">
            <Input name="confirm" type="password" minLength={8} required placeholder="Ulangi password baru" autoComplete="new-password" />
          </Field>
        </div>

        {passwordMessage && <p className="mt-4 rounded-2xl bg-brand-50 p-3 text-sm font-bold text-brand-700">{passwordMessage}</p>}
        {passwordError && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{passwordError}</p>}

        <Button disabled={savingPassword} className="mt-5 w-full sm:w-auto"><FiSave /> {savingPassword ? "Menyimpan..." : "Simpan Password"}</Button>
      </form>
    </section>
  );
}

export function SettingsPage({ role }: { role: UserRole }) {
  return (
    <div className="space-y-6">
      <div className={`grid gap-6 ${role === "admin" ? "xl:grid-cols-2" : "xl:grid-cols-1"}`}>
        <div className="soft-panel p-4 sm:p-6"><FiSettings className="text-2xl text-brand-700" /><h2 className="mt-3 text-xl font-black text-brand-900">Pengaturan Akun</h2><p className="mt-2 text-sm text-stone-500">Kelola data akun {readableRole(role).toLowerCase()} dari satu halaman.</p><Button asChild className="mt-5"><Link href={`${base(role)}/profile`}>Edit Profil</Link></Button></div>
        {role === "admin" && <div className="soft-panel p-4 sm:p-6"><FiMail className="text-2xl text-brand-700" /><h2 className="mt-3 text-xl font-black text-brand-900">Notifikasi</h2><p className="mt-2 text-sm text-stone-500">Pantau seluruh pemberitahuan aktivitas sistem admin.</p><Button asChild variant="secondary" className="mt-5"><Link href={`${base(role)}/notifications`}>Buka Notifikasi</Link></Button></div>}
      </div>
      <SecuritySettingsPanel role={role} />
      {role === "mahasiswa" && <PreferencesForm />}
    </div>
  );
}

function profileForComplaint(profiles: Profile[], complaint: Complaint) {
  return profiles.find((profile) => profile.id === complaint.user_id);
}

function ComplaintDetailDialog({
  complaint,
  profiles,
  admin,
  onClose,
  onStatusChange
}: {
  complaint: Complaint | null;
  profiles: Profile[];
  admin: boolean;
  onClose: () => void;
  onStatusChange: (status: Complaint["status"]) => Promise<void>;
}) {
  const profile = complaint ? profileForComplaint(profiles, complaint) : undefined;
  return (
    <Dialog open={Boolean(complaint)} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
        {complaint && <>
          <DialogTitle className="pr-10 text-2xl font-black text-brand-900">Detail Pengaduan</DialogTitle>
          <DialogDescription className="mt-2">Informasi lengkap laporan dapat dibuka oleh pemilik pengaduan dan administrator.</DialogDescription>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-stone-50 p-4"><p className="text-xs font-black uppercase tracking-widest text-stone-400">Pelapor</p><p className="mt-2 font-black text-ink">{profile?.name || complaint.user_id}</p><p className="text-sm text-stone-500">{profile?.email || readableRole(complaint.role)}</p></div>
            <div className="rounded-2xl bg-stone-50 p-4"><p className="text-xs font-black uppercase tracking-widest text-stone-400">Status</p><div className="mt-2"><StatusBadge status={complaint.status} /></div><p className="mt-2 text-xs text-stone-500">{new Date(complaint.created_at).toLocaleString("id-ID")}</p></div>
          </div>
          <div className="mt-4 rounded-3xl border border-stone-200 p-5"><p className="text-xs font-black uppercase tracking-widest text-stone-400">Subjek</p><h3 className="mt-2 text-xl font-black text-ink">{complaint.subject}</h3></div>
          <div className="mt-4 rounded-3xl border border-stone-200 p-5"><p className="text-xs font-black uppercase tracking-widest text-stone-400">Pesan</p><p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">{complaint.message}</p></div>
          {admin && <div className="mt-5 flex flex-wrap gap-3"><Button type="button" variant="secondary" onClick={() => onStatusChange("open")}>Tandai Dibuka</Button><Button type="button" variant="secondary" onClick={() => onStatusChange("in_review")}>Sedang Ditinjau</Button><Button type="button" onClick={() => onStatusChange("resolved")}>Selesaikan</Button></div>}
        </>}
      </DialogContent>
    </Dialog>
  );
}

export function ComplaintPage({ role }: { role: UserRole }) {
  const { createComplaint, complaints, profiles, updateComplaintStatus } = useDishconData();
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const sortedComplaints = useMemo(() => [...complaints].sort((a, b) => b.created_at.localeCompare(a.created_at)), [complaints]);

  useEffect(() => {
    if (typeof window === "undefined" || sortedComplaints.length === 0) return;
    const complaintId = new URLSearchParams(window.location.search).get("complaint");
    if (!complaintId) return;
    const target = sortedComplaints.find((item) => item.id === complaintId);
    if (target) setSelected(target);
  }, [sortedComplaints]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const subject = String(form.get("subject") || "").trim();
    const body = String(form.get("message") || "").trim();
    if (!subject || !body) { setMessage("Subjek dan pesan wajib diisi."); return; }
    setSubmitting(true);
    try {
      await createComplaint(subject, body);
      setMessage("Pengaduan berhasil disimpan dan akan ditinjau administrator.");
      formElement.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Pengaduan gagal dikirim.");
    } finally {
      setSubmitting(false);
    }
  }

  async function changeStatus(status: Complaint["status"]) {
    if (!selected) return;
    await updateComplaintStatus(selected.id, status);
    setSelected({ ...selected, status });
  }

  const history = (
    <section className="soft-panel p-4 sm:p-6">
      <div className="flex items-center justify-between gap-4"><div><h3 className="text-xl font-black text-brand-900">{role === "admin" ? "Daftar Pengaduan" : "Riwayat Pengaduan"}</h3><p className="mt-1 text-sm text-stone-500">Klik tombol detail untuk membaca pesan lengkap.</p></div><FiInbox className="text-2xl text-brand-700" /></div>
      {sortedComplaints.length === 0 ? <div className="mt-5"><EmptyState title="Belum ada pengaduan" description={role === "admin" ? "Laporan pengguna akan tampil di halaman ini." : "Pengaduan yang dikirim akan tercatat di sini."} /></div> : (
        <div className="mt-5 space-y-3">{sortedComplaints.map((complaint) => {
          const profile = profileForComplaint(profiles, complaint);
          return <article key={complaint.id} className="rounded-3xl border border-stone-200 p-4 transition hover:border-brand-300 hover:shadow-sm"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><StatusBadge status={complaint.status} /><span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-500">{readableRole(complaint.role)}</span></div><h4 className="mt-3 truncate font-black text-ink">{complaint.subject}</h4>{role === "admin" && <p className="mt-1 text-sm text-stone-500">{profile?.name || complaint.user_id}</p>}<p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500">{complaint.message}</p><p className="mt-2 text-xs font-bold text-stone-400">{new Date(complaint.created_at).toLocaleString("id-ID")}</p></div><Button type="button" size="sm" variant="secondary" onClick={() => setSelected(complaint)}><FiEye /> Lihat Detail</Button></div></article>;
        })}</div>
      )}
    </section>
  );

  return (
    <>
      {role === "admin" ? history : (
        <div className="grid gap-6 xl:grid-cols-[1fr_430px]">
          <form onSubmit={submit} className="soft-panel p-4 sm:p-6">
            <h2 className="text-2xl font-black text-brand-900">Pusat Pengaduan {readableRole(role)}</h2>
            <p className="mt-2 leading-7 text-stone-500">Pengaduan disimpan di sistem, detailnya bisa dibuka kembali, dan salinannya dapat dikirim ke email admin jika konfigurasi email sudah diisi.</p>
            <div className="mt-6 space-y-5"><Field label="Subjek"><Input name="subject" required maxLength={150} placeholder="Contoh: Masalah jadwal pengambilan" /></Field><Field label="Pesan"><Textarea name="message" required maxLength={2000} className="min-h-40" placeholder="Tulis detail kendala Anda..." /></Field></div>
            {message && <p className={`mt-5 rounded-2xl p-4 text-sm font-bold ${message.includes("gagal") ? "bg-red-50 text-red-700" : "bg-brand-50 text-brand-700"}`}>{message}</p>}
            <Button disabled={submitting} className="mt-6 w-full sm:w-auto"><FiSend /> {submitting ? "Mengirim..." : "Kirim Pengaduan"}</Button>
          </form>
          {history}
        </div>
      )}
      <ComplaintDetailDialog complaint={selected} profiles={profiles} admin={role === "admin"} onClose={() => setSelected(null)} onStatusChange={changeStatus} />
    </>
  );
}
