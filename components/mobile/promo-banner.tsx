import Link from "next/link";
import { cn } from "@/lib/utils";

export function PromoBanner({ className }: { className?: string }) {
  return (
    <section className={cn("mt-6", className)} aria-labelledby="promo-title">
      <h3 className="text-base font-bold text-stone-900">Promo Hari Ini</h3>
      <div className="relative mt-3 overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 p-5 text-white shadow-lg shadow-brand-600/20">
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -right-2 h-24 w-24 rounded-full bg-white/5" />
        <div className="absolute left-1/2 -top-10 h-20 w-20 rounded-full bg-white/5" />
        <div className="relative z-10">
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">HEMAT HINGGA 50%</span>
          <h4 id="promo-title" className="mt-4 text-2xl font-black leading-tight">Hemat Hingga<br />50%!</h4>
          <p className="mt-2 text-sm leading-6 text-white/80">Kantong Surplus segar hari ini</p>
          <Link href="/mahasiswa/catalog" className="mt-3 inline-flex min-h-10 items-center gap-1 rounded-xl bg-white px-4 py-2 text-sm font-bold text-brand-700 shadow-sm transition hover:bg-brand-50">Lihat Semua</Link>
        </div>
      </div>
    </section>
  );
}
