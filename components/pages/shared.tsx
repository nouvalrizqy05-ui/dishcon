"use client";

import { IconType } from "react-icons";
import { FiInbox } from "react-icons/fi";
import { cn } from "@/lib/utils";

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-6 text-center shadow-sm sm:rounded-[2rem] sm:p-8">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-2xl text-brand-700 sm:h-14 sm:w-14"><FiInbox aria-hidden="true" /></div>
      <h3 className="mt-4 text-lg font-black text-ink sm:text-xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-stone-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function MetricCard({ icon: Icon, label, value, hint, tone = "green" }: { icon: IconType; label: string; value: string | number; hint?: string; tone?: "green" | "blue" | "orange" | "purple" }) {
  const toneClass = {
    green: "bg-brand-50 text-brand-700",
    blue: "bg-blue-50 text-blue-700",
    orange: "bg-orange-50 text-orange-700",
    purple: "bg-purple-50 text-purple-700"
  }[tone];
  const longValue = String(value).length > 8;
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-card sm:p-5">
      <div className={cn("grid h-11 w-11 place-items-center rounded-2xl text-xl sm:h-12 sm:w-12", toneClass)}><Icon aria-hidden="true" /></div>
      <p className={cn("mt-4 font-black tracking-tight text-ink sm:mt-5", longValue ? "text-xl [overflow-wrap:anywhere] sm:text-3xl" : "text-2xl sm:text-4xl")}>{value}</p>
      <p className="mt-1 text-sm font-semibold text-stone-700 sm:text-base">{label}</p>
      {hint && <p className="mt-1.5 text-xs leading-5 text-stone-500 sm:mt-2 sm:text-sm">{hint}</p>}
    </div>
  );
}

export function readableStatus(status: string) {
  const lower = status.toLowerCase();
  const labels: Record<string, string> = {
    pending_verification: "Menunggu verifikasi pertama",
    active: "Tayang / tersedia",
    habis: "Kantong habis",
    kedaluwarsa: "Kedaluwarsa",
    ditolak: "Ditolak admin",
    ditarik: "Ditarik admin",
    reserved: "Menunggu diambil",
    completed: "Sudah diambil",
    dibatalkan: "Dibatalkan",
    tersedia: "Tersedia",
    diambil: "Sudah diambil",
    belum_verifikasi: "Belum diverifikasi",
    terverifikasi: "Terverifikasi",
    ditangguhkan: "Ditangguhkan",
    mitra: "Mitra UMKM",
    mahasiswa: "Mahasiswa",
    admin: "Admin",
    open: "Dibuka",
    in_review: "Diproses",
    resolved: "Selesai"
  };
  return labels[lower] || status.replaceAll("_", " ");
}

export function statusHint(status: string) {
  const lower = status.toLowerCase();
  const hints: Record<string, string> = {
    pending_verification: "Listing pertama Anda menunggu verifikasi satu kali oleh admin. Listing berikutnya tayang otomatis.",
    active: "Kantong surplus tayang dan bisa dipesan instan oleh mahasiswa.",
    habis: "Semua kantong sudah dipesan. Akan aktif kembali jika ada pembatalan.",
    kedaluwarsa: "Batas waktu pengambilan sudah lewat.",
    ditolak: "Listing tidak dapat ditampilkan ke mahasiswa.",
    ditarik: "Listing ditarik oleh admin karena pelanggaran kelayakan pangan.",
    reserved: "Reservasi tercatat, menunggu mahasiswa datang dan mitra memasukkan kode pengambilan.",
    completed: "Pengambilan sudah dikonfirmasi mitra dengan kode pengambilan.",
    dibatalkan: "Reservasi dibatalkan. Stok kembali tersedia untuk pemesan lain.",
    belum_verifikasi: "Listing pertama mitra ini masih menunggu keputusan admin.",
    terverifikasi: "Mitra sudah terverifikasi. Semua listing baru tayang otomatis.",
    ditangguhkan: "Mitra ditangguhkan sementara dan tidak bisa memposting listing baru."
  };
  return hints[lower] || "Status tercatat di sistem DishCon.";
}

export function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  const cls = lower === "active" || lower === "tersedia" || lower === "completed" || lower === "terverifikasi"
    ? "bg-brand-50 text-brand-700"
    : lower.includes("pending") || lower === "reserved" || lower === "in_review" || lower === "belum_verifikasi"
      ? "bg-orange-50 text-orange-700"
      : lower === "ditolak" || lower === "dibatalkan" || lower === "kedaluwarsa" || lower === "ditarik" || lower === "ditangguhkan"
        ? "bg-red-50 text-red-700"
        : "bg-stone-100 text-stone-600";
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-black", cls)}>{readableStatus(status)}</span>;
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-black text-ink">{label}</span>{children}</label>;
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0);
}
