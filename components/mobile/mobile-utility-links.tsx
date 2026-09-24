import Link from "next/link";
import { FiBell, FiMessageCircle, FiSettings } from "react-icons/fi";

export function MobileUtilityLinks() {
  return (
    <section className="mt-4" aria-labelledby="mobile-utility-title">
      <h3 id="mobile-utility-title" className="mb-2 text-sm font-black text-stone-900">Lainnya</h3>
      <div className="grid grid-cols-3 gap-2">
        <Link href="/mahasiswa/notifications" className="focus-ring flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border border-stone-200 bg-white text-[10px] font-bold text-stone-600 shadow-sm"><FiBell className="h-4 w-4 text-brand-600" aria-hidden="true" />Notifikasi</Link>
        <Link href="/mahasiswa/complaint" className="focus-ring flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border border-stone-200 bg-white text-[10px] font-bold text-stone-600 shadow-sm"><FiMessageCircle className="h-4 w-4 text-brand-600" aria-hidden="true" />Pengaduan</Link>
        <Link href="/mahasiswa/settings" className="focus-ring flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border border-stone-200 bg-white text-[10px] font-bold text-stone-600 shadow-sm"><FiSettings className="h-4 w-4 text-brand-600" aria-hidden="true" />Pengaturan</Link>
      </div>
    </section>
  );
}
