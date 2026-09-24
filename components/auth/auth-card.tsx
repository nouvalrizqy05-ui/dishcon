"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode, Suspense } from "react";
import { FiCrosshair, FiEye, FiEyeOff, FiLock, FiMail, FiMapPin, FiPhone, FiShield, FiUser, FiHome, FiShoppingBag } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { getCurrentPosition } from "@/lib/maps";
import type { JenisUsaha, PublicUserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

const JENIS_USAHA_OPTIONS: { value: JenisUsaha; label: string }[] = [
  { value: "warmindo", label: "Warmindo" },
  { value: "angkringan", label: "Angkringan" },
  { value: "katering_rumahan", label: "Katering Rumahan" },
  { value: "toko_kue", label: "Toko Kue" },
  { value: "lainnya", label: "Lainnya" }
];

const fieldClass =
  "h-12 rounded-2xl border-gray-200 bg-gray-50 pl-11 text-base text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:ring-brand-500/20 sm:text-sm";

function IconField({
  label,
  icon: Icon,
  hint,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="label mb-1.5 block text-sm font-bold text-gray-900">{label}</label>
      <div className="group relative">
        <Icon className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-brand-600" />
        {children}
      </div>
      {hint}
    </div>
  );
}

export function LoginForm({ role }: { role: PublicUserRole }) {
  return (
    <Suspense fallback={<p className="text-sm font-semibold text-gray-400">Memuat form masuk...</p>}>
      <LoginFormInner role={role} />
    </Suspense>
  );
}

function LoginFormInner({ role }: { role: PublicUserRole }) {
  const router = useRouter();
  const params = useSearchParams();
  const { login, resendVerificationEmail } = useAuth();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const registerHref = role === "mitra" ? "/mitra/register" : "/register";
  const registered = params.get("registered") === "1";
  const verified = params.get("verified") === "1";
  const registeredEmail = params.get("email") || "";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError("");
    setLoading(true);
    const result = await login({ email: String(form.get("email") || ""), password: String(form.get("password") || ""), role });
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    const next = params.get("next");
    router.push(next || result.redirectTo);
  }

  async function resendVerification() {
    setVerificationMessage("");
    const result = await resendVerificationEmail(email || registeredEmail);
    setVerificationMessage(result.ok ? result.message || "Email verifikasi dikirim ulang." : result.error);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <IconField label="Email" icon={FiUser}>
        <Input
          name="email"
          type="text"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="email@example.com"
          className={fieldClass}
        />
      </IconField>

      <div>
        <IconField label="Kata Sandi" icon={FiLock}>
          <Input
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••"
            className={cn(fieldClass, "pr-10")}
          />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-xl text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500" aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
            {show ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        </IconField>
        <div className="mt-2 text-right">
          <Link href="/forgot-password" className="text-sm font-bold text-brand-600 hover:underline">Lupa Kata Sandi?</Link>
        </div>
      </div>

      {registered ? (
        <div className="rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
          <p>Akun berhasil dibuat{registeredEmail ? ` untuk ${registeredEmail}` : ""}. Silakan masuk setelah email diverifikasi.</p>
          <button type="button" onClick={resendVerification} className="mt-2 text-xs font-black text-emerald-700 underline">Kirim ulang email verifikasi</button>
        </div>
      ) : null}
      {verified ? (
        <div className="rounded-2xl bg-blue-50 p-3 text-sm font-semibold text-blue-800">
          <p>Email berhasil diverifikasi. Silakan masuk dengan akun Anda.</p>
          <button type="button" onClick={resendVerification} className="mt-2 text-xs font-black text-blue-700 underline">Kirim ulang email verifikasi</button>
        </div>
      ) : null}
      {verificationMessage ? <p role="status" className="rounded-2xl bg-stone-50 p-3 text-sm font-semibold text-stone-700">{verificationMessage}</p> : null}

      {error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

      <Button disabled={loading} className="mt-2 h-12 w-full rounded-2xl bg-brand-500 py-4 text-base font-bold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600">
        {loading ? "Memproses..." : "Masuk"}
      </Button>

      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-100" />
        Belum punya akun?
        <span className="h-px flex-1 bg-gray-100" />
      </div>

      <Link
        href={registerHref}
        className="flex h-12 w-full items-center justify-center rounded-2xl border-2 border-brand-500 text-base font-bold text-brand-600 transition hover:bg-brand-50"
      >
        {role === "mitra" ? "Daftar Jadi Mitra" : "Daftar Mahasiswa"}
      </Link>

      <p className="pb-6 text-center text-xs text-gray-500 lg:pb-0">
        Dengan masuk, kamu menyetujui{" "}
        <Link href="/legal/syarat-ketentuan" className="font-semibold text-brand-600 hover:underline">Syarat & Ketentuan</Link>
        {" "}serta{" "}
        <Link href="/legal/privasi" className="font-semibold text-brand-600 hover:underline">Kebijakan Privasi</Link>
      </p>
    </form>
  );
}

export function RegisterForm({ role }: { role: PublicUserRole }) {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationLabel, setLocationLabel] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const loginHref = role === "mitra" ? "/mitra/login" : "/login";

  async function captureLocation() {
    setLocating(true);
    setError("");
    try {
      const point = await getCurrentPosition();
      setCoords(point);
      setLocationLabel(`${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil lokasi GPS.");
    } finally {
      setLocating(false);
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError("");
    if (form.get("password") !== form.get("confirm")) { setError("Konfirmasi kata sandi belum sama."); return; }
    if (!form.get("agree")) { setError("Centang persetujuan Syarat & Ketentuan serta Kebijakan Privasi."); return; }
    setLoading(true);
    const result = await register({
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      password: String(form.get("password") || ""),
      role,
      address: String(form.get("address") || ""),
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      nama_usaha: String(form.get("nama_usaha") || ""),
      jenis_usaha: (form.get("jenis_usaha") as JenisUsaha) || "lainnya",
      nama_kos: String(form.get("nama_kos") || "")
    });
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    router.push(result.redirectTo);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <IconField label={role === "mitra" ? "Nama Pemilik Usaha" : "Nama Lengkap"} icon={FiUser}>
          <Input name="name" required placeholder="Sesuai nama lengkap" className={fieldClass} />
        </IconField>
        {role === "mitra" ? (
          <IconField label="Nama Usaha" icon={FiShoppingBag}>
            <Input name="nama_usaha" required placeholder="Contoh: Warmindo Bu Sri" className={fieldClass} />
          </IconField>
        ) : (
          <IconField label="Nama Kos" icon={FiHome}>
            <Input name="nama_kos" placeholder="Contoh: Kos Melati 2" className={fieldClass} />
          </IconField>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <IconField label="Email" icon={FiMail}>
          <Input name="email" type="email" required placeholder="email@example.com" className={fieldClass} />
        </IconField>
        <IconField
          label="Nomor WhatsApp"
          icon={FiPhone}
          hint={<p className="mt-1 text-[10px] text-gray-400">Dipakai untuk konfirmasi reservasi.</p>}
        >
          <Input name="phone" type="tel" inputMode="tel" required placeholder="08123456789" className={fieldClass} />
        </IconField>
      </div>

      <hr className="border-gray-100" />
      <h3 className="text-sm font-bold text-gray-900">{role === "mitra" ? "Data Usaha" : "Alamat Kos"}</h3>

      {role === "mitra" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-900">Jenis Usaha</label>
            <select name="jenis_usaha" className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-base outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 sm:text-sm">
              {JENIS_USAHA_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <IconField label="Alamat Usaha" icon={FiMapPin}>
            <Input name="address" required placeholder="Alamat warung untuk titik jarak" className={fieldClass} />
          </IconField>
        </div>
      ) : (
        <IconField label="Alamat Kos" icon={FiMapPin}>
          <Input name="address" required placeholder="Nama jalan, RT/RW, kelurahan" className={fieldClass} />
        </IconField>
      )}

      <button
        type="button"
        onClick={captureLocation}
        disabled={locating}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold text-gray-700 transition hover:border-brand-500 hover:bg-white"
      >
        <FiCrosshair className="h-5 w-5 text-gray-400" />
        {locating ? "Mengambil lokasi..." : "Ambil Lokasi GPS Saat Ini (opsional)"}
      </button>
      {locationLabel ? <p className="text-xs font-bold text-brand-600">Lokasi: {locationLabel}</p> : null}

      <hr className="border-gray-100" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <IconField label="Kata Sandi" icon={FiLock}>
          <Input name="password" type={show ? "text" : "password"} minLength={8} required placeholder="Minimal 8 karakter" className={cn(fieldClass, "pr-10")} />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-xl text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500" aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
            {show ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        </IconField>
        <IconField label="Konfirmasi Kata Sandi" icon={FiLock}>
          <Input name="confirm" type={show ? "text" : "password"} minLength={8} required placeholder="Ulangi kata sandi" className={fieldClass} />
        </IconField>
      </div>

      {error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

      <label className="flex cursor-pointer items-start gap-3">
        <input
          name="agree"
          type="checkbox"
          required
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
        />
        <span className="text-sm text-gray-600">
          Saya menyetujui{" "}
          <Link href="/legal/syarat-ketentuan" className="font-semibold text-brand-600 hover:underline">Syarat & Ketentuan</Link>
          {" "}serta{" "}
          <Link href="/legal/privasi" className="font-semibold text-brand-600 hover:underline">Kebijakan Privasi</Link>
          .
        </span>
      </label>

      <Button disabled={loading} className="mt-2 h-12 w-full rounded-2xl bg-brand-500 py-4 text-base font-bold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600">
        {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
      </Button>

      <p className="pb-6 text-center text-sm text-gray-500 lg:pb-0">
        Sudah punya akun?{" "}
        <Link href={loginHref} className="font-bold text-brand-600 hover:underline">Masuk di sini</Link>
      </p>
    </form>
  );
}

export function AdminLoginCard() {
  const router = useRouter();
  const { loginAdmin } = useAuth();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError("");
    setLoading(true);
    const result = await loginAdmin({ email: String(form.get("email") || ""), password: String(form.get("password") || "") });
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    router.push(result.redirectTo);
  }

  return (
    <div className="mx-auto mt-20 w-full max-w-[520px] rounded-3xl border border-stone-100 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
      <div className="inline-flex items-center gap-2 rounded-full bg-brand-900 px-4 py-2 text-xs font-black uppercase tracking-widest text-white"><FiShield /> Admin Area</div>
      <h2 className="mt-5 text-2xl font-extrabold text-brand-900 sm:text-3xl md:text-4xl">Login Administrator</h2>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <div><Label>Email Admin</Label><Input name="email" type="email" required placeholder="admin@domain.com" /></div>
        <div><Label>Kata Sandi</Label><div className="relative"><Input name="password" type={show ? "text" : "password"} required className="pr-12" /><button type="button" onClick={() => setShow(!show)} aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400">{show ? <FiEyeOff /> : <FiEye />}</button></div></div>
        {error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        <Button disabled={loading} className="h-12 w-full">{loading ? "Memverifikasi..." : "Masuk sebagai Admin"}</Button>
        <p className="text-center text-sm text-stone-500"><Link href="/login" className="font-extrabold text-brand-700">Kembali ke login pengguna</Link></p>
      </form>
    </div>
  );
}

export function ForgotPasswordCard() {
  const { requestPasswordReset } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError("");
    setMessage("");
    setLoading(true);
    const result = await requestPasswordReset(String(form.get("email") || ""));
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    setMessage(result.message || "Link reset sudah dikirim. Periksa email Anda.");
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-3xl border border-stone-100 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
      <h2 className="text-2xl font-black text-brand-900">Lupa Kata Sandi</h2>
      <p className="text-sm text-stone-500">Masukkan email akun DishCon. Kami akan mengirim tautan reset jika akun terhubung ke email itu.</p>
      <IconField label="Email" icon={FiMail}>
        <Input name="email" type="email" required placeholder="email@example.com" className={fieldClass} />
      </IconField>
      {error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
      {message && <p className="rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{message}</p>}
      <Button disabled={loading} className="h-12 w-full rounded-2xl bg-brand-500 font-bold text-white hover:bg-brand-600">
        {loading ? "Mengirim..." : "Kirim tautan reset"}
      </Button>
      <p className="text-center text-sm text-gray-500">
        <Link href="/login" className="font-bold text-brand-600 hover:underline">Kembali ke masuk mahasiswa</Link>
        {" · "}
        <Link href="/mitra/login" className="font-bold text-brand-600 hover:underline">Masuk mitra</Link>
      </p>
    </form>
  );
}
export function ResetPasswordCard() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (password.length < 8) {
      setError("Kata sandi baru minimal 8 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi kata sandi belum sama.");
      return;
    }
    setSaving(true);
    const result = await updatePassword(password);
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage(result.message || "Kata sandi berhasil diperbarui.");
    setTimeout(() => router.push("/login"), 1200);
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-3xl border border-stone-100 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
      <div>
        <h2 className="text-2xl font-black text-brand-900">Buat Kata Sandi Baru</h2>
        <p className="mt-2 text-sm leading-6 text-stone-500">Masukkan kata sandi baru yang kuat dan mudah Anda ingat.</p>
      </div>
      <IconField label="Kata Sandi Baru" icon={FiLock}>
        <Input name="password" type={show ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete="new-password" className={cn(fieldClass, "pr-10")} />
        <button type="button" onClick={() => setShow((value) => !value)} aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"} className="absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-xl text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">{show ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}</button>
      </IconField>
      <IconField label="Konfirmasi Kata Sandi" icon={FiLock}>
        <Input name="confirm" type={show ? "text" : "password"} value={confirm} onChange={(event) => setConfirm(event.target.value)} required minLength={8} autoComplete="new-password" className={fieldClass} />
      </IconField>
      {error && <p role="alert" className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
      {message && <p role="status" className="rounded-2xl bg-brand-50 p-3 text-sm font-semibold text-brand-700">{message}</p>}
      <Button disabled={saving} className="h-12 w-full rounded-2xl bg-brand-600 text-base font-bold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700">{saving ? "Menyimpan..." : "Simpan Kata Sandi Baru"}</Button>
      <p className="text-center text-sm text-stone-500"><Link href="/login" className="font-bold text-brand-600 hover:underline">Kembali ke halaman masuk</Link></p>
    </form>
  );
}
