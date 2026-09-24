import Link from "next/link";
import { FiArrowLeft, FiHome, FiSearch } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";

export default function NotFound() {
  return (
    <main className="relative grid min-h-[100dvh] place-items-center overflow-hidden bg-stone-50 px-4 py-10">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-brand-100 to-transparent" />
      <section className="relative z-10 w-full max-w-md rounded-3xl border border-stone-200 bg-white p-5 text-center shadow-card sm:rounded-[2rem] sm:p-8">
        <BrandLogo className="justify-center" />
        <p className="mt-7 text-6xl font-black text-brand-100">404</p>
        <h1 className="-mt-3 text-2xl font-black text-stone-900">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-sm leading-6 text-stone-500">Alamat yang Anda buka mungkin sudah berubah atau tidak tersedia.</p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Button asChild variant="secondary"><Link href="/"><FiHome aria-hidden="true" /> Beranda</Link></Button>
          <Button asChild><Link href="/login"><FiSearch aria-hidden="true" /> Masuk</Link></Button>
        </div>
        <Button asChild variant="ghost" className="mt-2"><Link href="/"><FiArrowLeft aria-hidden="true" /> Kembali</Link></Button>
      </section>
    </main>
  );
}
