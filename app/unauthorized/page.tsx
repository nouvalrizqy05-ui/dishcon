import Link from "next/link";
import { FiArrowLeft, FiShield } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-stone-50 px-4 py-10 text-center">
      <section className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-5 shadow-card sm:rounded-[2rem] sm:p-8">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-2xl text-red-600"><FiShield aria-hidden="true" /></span>
        <h1 className="mt-5 text-2xl font-black text-stone-900 sm:text-3xl">Akses Ditolak</h1>
        <p className="mt-3 text-sm leading-6 text-stone-500">Halaman ini hanya bisa dibuka oleh role yang sesuai.</p>
        <Button asChild className="mt-6 w-full"><Link href="/login"><FiArrowLeft aria-hidden="true" /> Kembali Login</Link></Button>
      </section>
    </main>
  );
}
