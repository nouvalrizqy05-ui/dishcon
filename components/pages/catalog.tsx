"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FiFilter, FiMap, FiMapPin, FiSearch, FiShield, FiZap } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDishconData } from "@/lib/dishcon-store";
import { useAuth } from "@/lib/auth-context";
import { buildMapsDirectionsUrl, formatDistanceMeters, haversineDistanceMeters } from "@/lib/maps";
import { compactNutritionLabel } from "@/lib/nutrition";
import { EmptyState, StatusBadge, formatRupiah } from "@/components/pages/shared";

const categories = ["Makanan Berat", "Jajanan", "Minuman", "Paket Nasi", "Katering"];

export function CatalogPage() {
  const { user } = useAuth();
  const { listings, loading, preferences } = useDishconData();
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [halalOnly, setHalalOnly] = useState(false);

  const activeListings = listings.filter((d) => d.status === "active" && (d.jumlah_tersedia ?? 0) > 0);
  const filtered = useMemo(() => activeListings
    .map((item) => ({
      ...item,
      distanceMeter: user?.lat && user?.lng ? haversineDistanceMeters(user.lat, user.lng, item.lat, item.lng) : Infinity
    }))
    .filter((item) => {
      const searchMatch = `${item.nama_makanan} ${item.kategori} ${item.lokasi}`.toLowerCase().includes(query.toLowerCase());
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.kategori);
      const halalMatch = !halalOnly || item.halal;
      const preferenceHalalMatch = !preferences.halal || item.halal;
      const preferenceCategoryMatch = preferences.preferredCategories.length === 0 || preferences.preferredCategories.includes(item.kategori);
      const distanceMatch = !Number.isFinite(item.distanceMeter) || item.distanceMeter <= preferences.maxRadiusMeter;
      return searchMatch && categoryMatch && halalMatch && preferenceHalalMatch && preferenceCategoryMatch && distanceMatch;
    })
    .sort((a, b) => a.distanceMeter - b.distanceMeter), [activeListings, halalOnly, preferences.halal, preferences.maxRadiusMeter, preferences.preferredCategories, query, selectedCategories, user?.lat, user?.lng]);

  function toggleCategory(category: string) {
    setSelectedCategories((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
  }

  return (
    <div className="grid w-full min-w-0 max-w-full gap-6 overflow-hidden 2xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="soft-panel h-max min-w-0 p-5">
        <div className="mb-4 flex items-center justify-between"><h2 className="font-black text-ink">Filter</h2><button onClick={() => { setQuery(""); setSelectedCategories([]); setHalalOnly(false); }} className="text-sm font-bold text-brand-700">Reset semua</button></div>
        <div className="space-y-5 text-sm">
          <div><p className="mb-2 font-black uppercase tracking-widest text-stone-400">Status</p><label className="flex items-center gap-3"><input type="checkbox" checked readOnly className="accent-brand-700" /> Hanya kantong tayang (aktif)</label></div>
          <div><p className="mb-2 font-black uppercase tracking-widest text-stone-400">Kategori</p>{categories.map((category) => <label key={category} className="mt-2 flex items-center gap-3"><input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => toggleCategory(category)} className="accent-brand-700" /> {category}</label>)}</div>
          <div><p className="mb-2 font-black uppercase tracking-widest text-stone-400">Keamanan</p><label className="flex items-center gap-3"><input type="checkbox" checked={halalOnly} onChange={(event) => setHalalOnly(event.target.checked)} className="accent-brand-700" /> Hanya makanan halal</label></div>
          <div className="rounded-2xl bg-brand-50 p-4"><p className="font-black text-brand-900">Preferensi aktif</p><p className="mt-2 text-xs leading-5 text-brand-800">Katalog otomatis mengikuti halal, kategori favorit, dan radius maksimal <b>{formatDistanceMeters(preferences.maxRadiusMeter)}</b> dari halaman Settings.</p></div>
        </div>
      </aside>

      <section className="min-w-0 space-y-5">
        <div className="flex flex-col gap-3 rounded-3xl border border-stone-200 bg-white p-4 shadow-card md:flex-row">
          <div className="relative flex-1"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" /><Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-11" placeholder="Cari nama makanan atau lokasi..." /></div>
          <Button type="button"><FiSearch /> Cari</Button>
          <Button type="button" variant="secondary" onClick={() => setHalalOnly((value) => !value)}><FiFilter /> {halalOnly ? "Halal aktif" : "Filter halal"}</Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm"><span className="text-stone-500">Indikator:</span><span className="rounded-full border border-brand-100 bg-brand-50 px-4 py-2 font-bold text-brand-700"><FiShield className="mr-2 inline" /> Terverifikasi</span><span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 font-bold text-blue-700"><FiZap className="mr-2 inline" /> Dianalisis AI</span></div>

        <div className="soft-panel min-w-0 p-5">
          <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-black text-ink">Kantong Surplus Tersedia <span className="text-base text-stone-400">({filtered.length} hasil)</span></h2></div>
          {loading ? <p className="text-stone-500">Memuat katalog...</p> : filtered.length === 0 ? (
            <EmptyState title="Katalog masih kosong" description="Belum ada kantong surplus aktif yang sesuai preferensi halal, kategori, dan radius maksimal. Ubah preferensi dari Settings bila perlu." />
          ) : (
            <div className="grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <article key={item.id} className="relative overflow-hidden rounded-[1.7rem] border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
                  {item.harga_normal > item.harga_diskon && (
                    <div className="absolute right-0 top-0 z-10 rounded-bl-2xl rounded-tr-[1.7rem] bg-red-600 px-4 py-2 font-black text-white shadow-sm">
                      Diskon {Math.round(((item.harga_normal - item.harga_diskon) / item.harga_normal) * 100)}%
                    </div>
                  )}
                  <div className="relative grid h-44 place-items-center overflow-hidden bg-gradient-to-br from-brand-50 to-amber-50 text-5xl">
                    {item.image_url ? (
                      <div className="relative h-full w-full">
                        <Image src={item.image_url} alt={item.nama_makanan} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                      </div>
                    ) : (
                      "🍱"
                    )}
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                      <StatusBadge status={item.status} />
                      {item.halal && <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-black text-brand-800 shadow-sm backdrop-blur-md">Halal</span>}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="mt-1 text-xl font-black text-ink line-clamp-1" title={item.nama_makanan}>{item.nama_makanan}</h3>
                    <p className="mt-1 flex items-start gap-2 text-sm text-stone-500 line-clamp-1" title={item.lokasi}><FiMapPin className="mt-0.5 shrink-0" /> {item.lokasi}</p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-brand-700">{formatRupiah(item.harga_diskon)}</span>
                        {item.harga_normal > item.harga_diskon && <span className="ml-2 text-xs font-semibold text-stone-400 line-through">{formatRupiah(item.harga_normal)}</span>}
                      </div>
                      <p className="text-xs font-black text-stone-500 bg-stone-100 px-2 py-1 rounded-lg">📍 {formatDistanceMeters(item.distanceMeter)}</p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 text-sm font-semibold">
                      <span className={item.jumlah_tersedia && item.jumlah_tersedia < 3 ? "text-red-600" : "text-brand-700"}>
                        {item.jumlah_tersedia} kantong tersisa
                      </span>
                      <span className="text-stone-500">⏳ {new Date(item.batas_waktu).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button type="button" variant="secondary" className="w-full text-xs font-bold" onClick={() => window.open(buildMapsDirectionsUrl(user?.lat && user?.lng ? { lat: user.lat, lng: user.lng } : undefined, { lat: item.lat, lng: item.lng }), "_blank", "noopener,noreferrer")}>
                        <FiMap className="mr-1" /> Peta
                      </Button>
                      <Button asChild className="w-full text-xs font-bold">
                        <Link href={`/mahasiswa/listing/${item.id}`}>Amankan →</Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
