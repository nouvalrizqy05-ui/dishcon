import { BrandLogo } from "@/components/brand-logo";

export default function Loading() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-stone-50 px-4 py-10" aria-busy="true" aria-label="Memuat halaman">
      <div className="w-full max-w-sm rounded-3xl border border-stone-200 bg-white p-5 text-center shadow-card sm:p-6">
        <BrandLogo className="justify-center" />
        <div className="mx-auto mt-6 h-12 w-12 animate-pulse rounded-full bg-brand-100" />
        <p className="mt-4 text-sm font-black text-stone-700">Menyiapkan halaman...</p>
        <div className="mx-auto mt-5 h-2 w-40 overflow-hidden rounded-full bg-stone-100">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-brand-500" />
        </div>
      </div>
    </main>
  );
}
