import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "@/components/landing/public-header";
import { FiArrowRight } from "react-icons/fi";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[100dvh] w-full bg-white text-stone-800 font-sans">
      <PublicHeader />
      <div className="pt-[calc(5rem+env(safe-area-inset-top))]">{children}</div>

      {/* Footer CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand-800 via-brand-900 to-brand-800 py-12 sm:py-16">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-brand-700/30 rounded-b-full" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
            Ubah sisa dagangan menjadi pemasukan tambahan dengan DishCon
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/register" className="w-full rounded-full bg-white px-6 py-3 font-bold text-brand-900 shadow-xl transition hover:bg-gray-100 sm:w-auto sm:px-8">
              Daftar Mahasiswa
            </Link>
            <Link href="/mitra/register" className="w-full rounded-full bg-brand-500 px-6 py-3 font-bold text-white transition hover:bg-brand-400 sm:w-auto sm:px-8">
              Daftar Mitra UMKM
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-900 text-white pt-14 pb-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div className="space-y-3">
              <h4 className="font-black text-white mb-4">DishCon</h4>
              <Link href="/tentang" className="block text-white/60 hover:text-white transition">Tentang</Link>
              <Link href="/dampak" className="block text-white/60 hover:text-white transition">Dampak</Link>
              <Link href="/tim" className="block text-white/60 hover:text-white transition">Tim</Link>
              <Link href="/catalog" className="block text-white/60 hover:text-white transition">Katalog</Link>
            </div>
            <div className="space-y-3">
              <h4 className="font-black text-white mb-4">Lainnya</h4>
              <Link href="/karir" className="block text-white/60 hover:text-white transition">Karir</Link>
              <Link href="/pers" className="block text-white/60 hover:text-white transition">Pers</Link>
              <Link href="/faq" className="block text-white/60 hover:text-white transition">FAQ</Link>
              <Link href="/hubungi" className="block text-white/60 hover:text-white transition">Hubungi</Link>
            </div>
            <div className="col-span-2 space-y-3">
              <h4 className="font-black text-white mb-4">Legal</h4>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/60">
                <Link href="/legal/syarat-ketentuan" className="hover:text-white transition">Syarat & Ketentuan</Link>
                <Link href="/legal/privasi" className="hover:text-white transition">Kebijakan Privasi</Link>
                <Link href="/legal/cookie" className="hover:text-white transition">Kebijakan Cookie</Link>
                <Link href="/legal/lisensi" className="hover:text-white transition">Perjanjian Lisensi</Link>
                <Link href="/legal/alergen" className="hover:text-white transition">Informasi Alergen</Link>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <p>Platform food-rescue pertama di sekitar kampus</p>
            <p>DishCon &copy; 2026 &middot; Dibuat dengan &hearts; di Semarang</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
