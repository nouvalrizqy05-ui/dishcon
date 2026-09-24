"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiClock, FiHeart, FiMap, FiMapPin, FiShield, FiZap } from "react-icons/fi";
import type { IconType } from "react-icons";
import {
  MdFastfood,
  MdLocalCafe,
  MdRamenDining,
  MdRestaurant,
  MdRiceBowl,
  MdSoupKitchen,
  MdTakeoutDining,
} from "react-icons/md";
import type { SurplusListing } from "@/lib/types";
import { formatRupiah } from "@/components/pages/shared";
import { formatDistanceMeters, buildMapsSearchUrl } from "@/lib/maps";

const foodIcons: Record<string, IconType> = {
  "Makanan Berat": MdRiceBowl,
  Jajanan: MdFastfood,
  Minuman: MdLocalCafe,
  "Paket Nasi": MdTakeoutDining,
  Katering: MdSoupKitchen,
};

const gradients = ["from-amber-100 to-orange-50", "from-green-100 to-emerald-50", "from-blue-100 to-cyan-50", "from-pink-100 to-rose-50", "from-purple-100 to-violet-50", "from-yellow-100 to-amber-50"];

type FoodCardProps = { listing: SurplusListing & { distanceMeter?: number }; index?: number };

export function FoodCard({ listing, index = 0 }: FoodCardProps) {
  const [liked, setLiked] = useState(false);
  const gradient = gradients[index % gradients.length];
  const Icon = foodIcons[listing.kategori] || MdRestaurant;
  const available = listing.jumlah_tersedia ?? listing.jumlah_kantong;
  const deadline = new Date(listing.batas_waktu).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });
  const discount = listing.harga_normal > listing.harga_diskon ? Math.round(((listing.harga_normal - listing.harga_diskon) / listing.harga_normal) * 100) : 0;

  return (
    <div className="relative h-full">
      <Link href={`/mahasiswa/listing/${listing.id}`} className="focus-ring group block h-full rounded-2xl active:scale-[0.98] sm:rounded-3xl" aria-label={`Lihat detail ${listing.nama_makanan}`}>
        <article className="h-full overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md sm:rounded-3xl">
          <div className={`relative h-32 bg-gradient-to-br sm:h-40 xl:h-44 ${gradient}`}>
            {listing.image_url ? <Image src={listing.image_url} alt={listing.nama_makanan} fill className="object-cover transition duration-300 group-hover:scale-[1.03]" sizes="(max-width: 640px) 45vw, (max-width: 1280px) 30vw, 22vw" /> : <div className="flex h-full w-full items-center justify-center text-brand-700/25"><Icon className="h-16 w-16" aria-hidden="true" /></div>}
            {discount > 0 && <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-black text-white shadow-sm sm:left-3 sm:top-3 sm:text-[10px]">-{discount}%</div>}
            {listing.distanceMeter !== undefined && Number.isFinite(listing.distanceMeter) && <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 shadow-sm backdrop-blur sm:bottom-3 sm:left-3"><FiMapPin className="h-2.5 w-2.5 text-brand-600" /><span className="text-[10px] font-bold text-stone-700">{formatDistanceMeters(listing.distanceMeter)}</span></div>}
          </div>
          <div className="p-3 sm:p-4">
            <div className="mb-1.5 flex flex-wrap items-center gap-1"><span className="text-[9px] font-black uppercase tracking-wide text-brand-700">{listing.kategori}</span>{listing.halal && <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-brand-700"><FiShield className="h-2.5 w-2.5" /> Halal</span>}{listing.nutrition && <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-blue-700"><FiZap className="h-2.5 w-2.5" /> AI</span>}</div>
            <h3 className="truncate text-sm font-bold text-stone-900">{listing.nama_makanan}</h3>
            <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-stone-500"><FiClock className="h-3 w-3 text-orange-500" /><span>Ambil sebelum {deadline}</span></div>
            <div className="mt-2 flex items-center justify-between gap-1"><span className="rounded-lg bg-brand-600 px-2.5 py-1 text-xs font-bold text-white">{formatRupiah(listing.harga_diskon)}</span>{discount > 0 && <span className="text-[10px] text-stone-400 line-through">{formatRupiah(listing.harga_normal)}</span>}</div>
            <p className={`mt-1.5 text-[10px] font-bold ${available < 3 ? "text-red-600" : "text-stone-400"}`}>{available} tersisa</p>
          </div>
        </article>
      </Link>
      <a href={buildMapsSearchUrl(listing.lokasi)} target="_blank" rel="noreferrer" aria-label={`Buka lokasi ${listing.nama_makanan}`} className="focus-ring absolute right-2 top-12 inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-xl bg-white/90 px-2 text-[10px] font-black text-stone-700 shadow-sm backdrop-blur sm:right-3 sm:top-14"><FiMap className="h-3 w-3" /> Peta</a>
      <button type="button" onClick={() => setLiked((value) => !value)} aria-label={liked ? "Hapus dari favorit" : "Tambahkan ke favorit"} aria-pressed={liked} className="focus-ring absolute right-2 top-2 grid min-h-11 min-w-11 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:bg-white sm:right-3 sm:top-3"><FiHeart className={`h-3.5 w-3.5 ${liked ? "text-red-500" : "text-red-400"}`} style={liked ? { fill: "currentColor" } : undefined} /></button>
    </div>
  );
}
