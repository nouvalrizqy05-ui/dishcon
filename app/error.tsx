"use client";

import { useEffect } from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-[100dvh] place-items-center bg-stone-50 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-5 text-center shadow-card sm:rounded-[2rem] sm:p-8">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-2xl text-red-600"><FiAlertTriangle aria-hidden="true" /></span>
        <h1 className="mt-5 text-2xl font-black text-stone-900">Terjadi kendala</h1>
        <p className="mt-3 text-sm leading-6 text-stone-500">Data belum dapat dimuat. Periksa koneksi lalu coba kembali.</p>
        <Button onClick={reset} className="mt-6 w-full"><FiRefreshCw aria-hidden="true" /> Coba Lagi</Button>
      </section>
    </main>
  );
}
