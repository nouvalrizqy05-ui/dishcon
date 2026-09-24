import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight, FiCheckSquare } from "react-icons/fi";
import type { PublicUserRole } from "@/lib/types";

type AuthMode = "login" | "register";

const COPY: Record<AuthMode, Record<PublicUserRole, {
  formTitle: string;
  formSubtitle?: string;
  mobileTitle: string;
  mobileSubtitle: string;
  panelTitle: string;
  panelAccent: string;
  panelBody: string;
  points: { title: string; desc?: string }[];
}>> = {
  login: {
    mahasiswa: {
      formTitle: "Masuk Akun",
      formSubtitle: "Selamat datang kembali! Silakan login.",
      mobileTitle: "Masuk Mahasiswa",
      mobileSubtitle: "Makan hemat di sekitar kampus",
      panelTitle: "Makanan sekitar kampus",
      panelAccent: "lebih hemat",
      panelBody: "Marketplace food-rescue hiperlokal untuk mahasiswa kos. Jarak dekat, stok pasti, reservasi instan.",
      points: [
        { title: "Harga lebih hemat", desc: "Kantong surplus dari warung sekitar kampus" },
        { title: "Jarak & stok pasti", desc: "Reservasi instan tanpa tebak-tebakan" },
      ],
    },
    mitra: {
      formTitle: "Masuk Mitra",
      formSubtitle: "Kelola kantong surplus warungmu.",
      mobileTitle: "Masuk Mitra",
      mobileSubtitle: "Ubah sisa dagangan jadi pemasukan",
      panelTitle: "Ubah sisa dagangan",
      panelAccent: "jadi pemasukan",
      panelBody: "Posting kantong surplus, stok terlacak otomatis, dan komisi hanya ketika transaksi terjadi.",
      points: [
        { title: "Tanpa biaya daftar", desc: "Mulai jualan surplus kapan saja" },
        { title: "Stok terlacak", desc: "Komisi 10% hanya saat laku" },
      ],
    },
  },
  register: {
    mahasiswa: {
      formTitle: "Form Pendaftaran",
      mobileTitle: "Daftar Mahasiswa",
      mobileSubtitle: "Makan hemat dari warung sekitar kampus",
      panelTitle: "Bergabung Bersama",
      panelAccent: "Kami",
      panelBody: "Daftar gratis, temukan makanan layak konsumsi dengan harga hemat, jarak dekat, dan reservasi instan.",
      points: [
        { title: "Pendaftaran gratis 100%" },
        { title: "Jarak dekat, stok pasti" },
        { title: "Reservasi instan" },
      ],
    },
    mitra: {
      formTitle: "Form Pendaftaran",
      mobileTitle: "Daftar Mitra UMKM",
      mobileSubtitle: "Ubah sisa dagangan jadi pemasukan",
      panelTitle: "Jadi Mitra",
      panelAccent: "DishCon",
      panelBody: "Posting kantong surplus tanpa biaya pendaftaran. Stok terlacak otomatis, komisi hanya saat transaksi.",
      points: [
        { title: "Pendaftaran gratis 100%" },
        { title: "Komisi 10% hanya saat laku" },
        { title: "Posting surplus sederhana" },
      ],
    },
  },
};

export function AuthLayout({
  children,
  mode,
  role,
}: {
  children: React.ReactNode;
  mode: AuthMode;
  role: PublicUserRole;
}) {
  const copy = COPY[mode][role];
  const isLogin = mode === "login";

  return (
    <main className={`relative flex min-h-[100dvh] items-end justify-center p-0 lg:items-center lg:p-4 ${
      isLogin
        ? "bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800"
        : "bg-gradient-to-br from-slate-200 via-zinc-200 to-slate-300"
    }`}>
      <Link
        href="/"
        className={`absolute left-6 top-[calc(1.5rem+env(safe-area-inset-top))] z-40 flex h-10 w-10 items-center justify-center rounded-full shadow-lg backdrop-blur-md transition active:scale-95 lg:left-8 lg:top-8 ${
          isLogin
            ? "bg-white/20 text-white shadow-brand-700/20 hover:bg-white/30"
            : "bg-brand-500 text-white shadow-brand-600/25 hover:bg-brand-600"
        }`}
        aria-label="Kembali ke beranda"
      >
        <FiArrowLeft className="h-5 w-5" />
      </Link>

      <div className="relative w-full overflow-hidden lg:grid lg:max-w-5xl lg:grid-cols-12 lg:rounded-3xl lg:bg-white lg:shadow-2xl">
        {isLogin ? (
          <div className="relative hidden flex-col justify-center overflow-hidden bg-gradient-to-br from-white to-brand-50 p-12 text-stone-900 lg:col-span-5 lg:flex">
            <div className="relative z-10">
              <div className="mb-8 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-md">
                <Image src="/logo-dishcon.jpeg" alt="DishCon" width={64} height={64} className="h-full w-full object-cover" priority />
              </div>
              <h1 className="text-3xl font-black leading-tight">
                {copy.panelTitle}
                <br />
                <span className="text-brand-600">{copy.panelAccent}</span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-stone-500">{copy.panelBody}</p>
              <div className="mt-8 space-y-3">
                {copy.points.map((point) => (
                  <div key={point.title} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                      <FiArrowRight className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-stone-900">{point.title}</p>
                      {point.desc ? <p className="text-xs text-stone-400">{point.desc}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-brand-600 p-12 text-white lg:col-span-5 lg:flex">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20px 20px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
            <div className="relative z-10 w-full text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-lg">
                <Image src="/logo-dishcon.jpeg" alt="DishCon" width={96} height={96} className="h-full w-full object-cover" priority />
              </div>
              <h1 className="mb-4 text-3xl font-black">
                {copy.panelTitle} {copy.panelAccent}
              </h1>
              <p className="mb-8 text-sm leading-relaxed text-brand-100">{copy.panelBody}</p>
              <div className="rounded-2xl bg-white/10 p-5 text-left backdrop-blur-sm">
                {copy.points.map((point) => (
                  <div key={point.title} className="mb-3 flex items-center gap-3 last:mb-0">
                    <FiCheckSquare className="h-5 w-5 shrink-0 text-brand-100" />
                    <span className="text-sm font-semibold">{point.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mobile-safe-bottom relative z-10 h-full max-h-none w-full overflow-y-auto lg:col-span-7 lg:max-h-[90vh]">
          <div className="px-4 py-7 text-center sm:px-6 sm:py-8 lg:hidden">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-xl">
              <Image src="/logo-dishcon.jpeg" alt="DishCon" width={64} height={64} className="h-full w-full object-cover" priority />
            </div>
            <h1 className="text-2xl font-black text-zinc-900">{copy.mobileTitle}</h1>
            <p className="mt-1 text-sm text-zinc-600">{copy.mobileSubtitle}</p>
          </div>

          <div className="rounded-t-3xl bg-white p-4 sm:p-6 lg:rounded-none lg:p-10">
            <h2 className="mb-1 hidden text-2xl font-black text-gray-900 lg:block">{copy.formTitle}</h2>
            {copy.formSubtitle ? (
              <p className="mb-6 hidden text-sm text-gray-500 lg:block">{copy.formSubtitle}</p>
            ) : (
              <div className="mb-6 hidden lg:block" />
            )}
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
