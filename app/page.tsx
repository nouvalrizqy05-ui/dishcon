"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HeroBlob } from "@/components/landing/hero-blob";
import { FadeIn, SlideUp } from "@/components/landing/scroll-animations";
import { FiStar, FiPlayCircle, FiArrowRight, FiShoppingBag, FiUsers, FiShoppingCart, FiUser, FiBookOpen, FiBriefcase, FiPackage, FiBook, FiCoffee, FiMapPin, FiInstagram, FiMessageCircle, FiSearch } from "react-icons/fi";
import { MdStorefront, MdFastfood, MdSchool, MdRestaurant, MdLocalCafe, MdRiceBowl, MdCake, MdRamenDining, MdTakeoutDining } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/landing/public-header";

const WARUNG_FAVORIT = [
  { src: "/assets/images (5).jpg", name: "Warteg Ibu Tia", fit: "cover" as const },
  { src: "/assets/images (2).png", name: "Warteg Kharisma", fit: "cover" as const },
  { src: "/assets/1600w-6-5BHgVR1BU.jpg", name: "Warteg Raya Borcelle", fit: "contain" as const },
  { src: "/assets/images (2).jpg", name: "Burjo Titik Kumpul", fit: "cover" as const },
  { src: "/assets/images (3).jpg", name: "Burjokes", fit: "contain" as const },
  { src: "/assets/images (4).jpg", name: "Burjo Borneo", fit: "cover" as const },
  { src: "/assets/images (6).jpg", name: "Angkringan", fit: "contain" as const },
  { src: "/assets/pngtree-angkringan-cat-food-wooden-cart-selling-trade-vector-transparent-background-png-image_6519467.png", name: "Angkringan Gerobak", fit: "contain" as const },
];

function WarungMarqueeRow({
  items,
  reverse = false,
}: {
  items: typeof WARUNG_FAVORIT;
  reverse?: boolean;
}) {
  const loop = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max items-center gap-6 md:gap-8 ${
          reverse ? "animate-infinite-scroll-reverse" : "animate-infinite-scroll"
        }`}
      >
        {loop.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="flex w-[14rem] shrink-0 flex-col items-center md:w-[18rem]"
            aria-hidden={i >= items.length}
          >
            {/* Rectangular image container with border */}
            <div className="relative h-40 w-56 md:h-48 md:w-72 overflow-hidden rounded-3xl shadow-sm bg-stone-50 border-2 border-stone-200">
              <Image
                src={item.src}
                alt={item.name}
                fill
                sizes="(min-width: 768px) 288px, 224px"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const value = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setProgress(Math.min(value, 100));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-[env(safe-area-inset-top)] z-[60] h-[3px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-brand-500 via-brand-600 to-accent-500 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function CountUp({ end, prefix = "", suffix = "", duration = 1200 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const node = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(end * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, end, started]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {new Intl.NumberFormat("id-ID").format(value)}
      {suffix}
    </span>
  );
}

function StudentDashboardPhone() {
  const categoryPills = ["Semua", "Makanan Berat", "Jajanan", "Minuman", "Paket Nasi"];
  const foodCards = [
    { name: "Nasi Ayam", price: "Rp 8.000", tone: "from-amber-100 to-orange-100" },
    { name: "Mie Dokdok", price: "Rp 6.000", tone: "from-emerald-100 to-teal-100" },
    { name: "Paket Geprek", price: "Rp 9.000", tone: "from-blue-100 to-indigo-100" },
    { name: "Roti Pisang", price: "Rp 5.000", tone: "from-rose-100 to-pink-100" },
  ];

  return (
    <div className="relative w-[256px] md:w-[310px] rounded-[2.7rem] border-[8px] border-stone-900 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.18)] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-stone-900 rounded-b-2xl" />
      <div className="bg-[#f4faf5] pt-7 pb-4 px-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 text-[10px] text-stone-500">
              <FiMapPin className="text-[11px]" />
              <span>Lokasi Saat Ini</span>
            </div>
            <p className="mt-1 text-[11px] font-bold text-stone-900">Sekitar Kampus UNNES</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-700 shadow-sm">
            <FiUser className="text-[14px]" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-sm border border-stone-100">
          <FiSearch className="text-stone-400" />
          <span className="text-[11px] text-stone-400">Cari makanan atau lokasi...</span>
        </div>

        <div className="mt-4 flex gap-2 overflow-hidden">
          {categoryPills.map((pill, index) => (
            <div
              key={pill}
              className={`shrink-0 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${
                index === 0 ? "bg-brand-600 text-white" : "bg-white text-stone-600 border border-stone-100"
              }`}
            >
              {pill}
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 p-3 text-white shadow-lg shadow-brand-600/25">
          <div className="h-2 w-20 rounded-full bg-white/35" />
          <div className="mt-2 h-2 w-12 rounded-full bg-white/20" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {foodCards.map((item, idx) => (
            <div key={item.name} className="overflow-hidden rounded-2xl bg-white shadow-sm border border-stone-100">
              <div className={`h-20 bg-gradient-to-br ${item.tone}`} />
              <div className="space-y-1 p-2">
                <div className="h-2 w-16 rounded-full bg-stone-200" />
                <div className="h-2 w-10 rounded-full bg-brand-200" />
                <div className="pt-1 text-[10px] font-bold text-brand-700">{item.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   DishCon Landing Page — Layout 1:1 mengikuti Olio (olioapp.com)
   Warna: brand indigo/violet + accent fuchsia (Access by KAI style)
   Copywriting: sesuai instruksi user
   ================================================================ */

export default function LandingPage() {
  return (
    <main className="min-h-[100dvh] w-full overflow-x-hidden bg-white text-stone-800 font-sans">

      <PublicHeader />

      {/* ─── HERO (Olio style: white bg, text left, phone right, gradient blob top-right) ─── */}
      <ScrollProgress />

      <section className="relative bg-white pb-12 pt-[calc(5rem+env(safe-area-inset-top))] md:pb-32 md:pt-16">
        <HeroBlob />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:flex md:items-center md:gap-8 lg:gap-12">
          <div className="md:w-1/2 lg:w-[55%] relative z-20">
            <h1 className="text-[2.35rem] leading-[1.08] font-black tracking-tight text-brand-900 sm:text-[2.75rem] md:text-6xl lg:text-7xl">
              Makanan{" "}
              <span className="relative inline-block">
                <span className="relative z-10">sekitar</span>
              </span>{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-accent-600">kampus</span>
              </span>
              <br className="hidden md:block" /> lebih{" "}
              <span className="text-accent-600">hemat</span>{" "}
              dengan jarak pasti
            </h1>
            <p className="mt-6 text-lg text-stone-500 max-w-lg leading-relaxed">
              DishCon adalah marketplace food-rescue hiperlokal untuk mahasiswa kos dan UMKM mikro di sekitar kampus.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-sm">
                <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 text-lg" />
                <input type="text" placeholder="Cari kampusmu (mis. Unnes)..." className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-stone-200 focus:border-brand-500 focus:ring-0 text-base font-semibold outline-none shadow-sm transition" />
              </div>
              <Button asChild size="lg" className="rounded-full bg-brand-700 hover:bg-brand-800 text-white font-bold px-8 h-[56px] shadow-xl shadow-brand-700/30 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03]">
                <Link href="/login">Mulai Eksplorasi</Link>
              </Button>
            </div>
          </div>

          <div className="md:w-1/2 lg:w-[45%] mt-12 md:mt-0 relative z-10 flex justify-center md:justify-end items-end h-full min-h-[420px]">
            <div className="relative -rotate-12 translate-y-1 md:translate-y-4 md:-translate-x-6 lg:-translate-x-10">
              <StudentDashboardPhone />
            </div>
          </div>
        </div>
      </section>

      {/* ─── "Marketplace food-rescue hiperlokal..." (like "Show your budget who's boss") ─── */}
      <section className="bg-brand-900 relative z-30">
        {/* SVG Divider top (bulges UP into the hero) */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-[99%] pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-[60px] md:h-[140px] drop-shadow-xl">
            <path d="M0,120 Q600,0 1200,120 L1200,120 L0,120 Z" fill="#14532d"></path>
          </svg>
        </div>
        
        <div className="py-24 md:py-32 mx-auto max-w-4xl px-6 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
              Marketplace{" "}
              <span className="relative inline-block z-10 text-brand-300">
                food-rescue
                <svg className="absolute -bottom-2 left-0 w-full -z-10" viewBox="0 0 300 12" fill="none"><path d="M2 8C60 2 240 2 298 8" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round"/></svg>
              </span>{" "}
              hiperlokal untuk mahasiswa kos dan UMKM mikro di sekitar kampus
            </h2>
          </FadeIn>
        </div>
      </section>

      {/* ─── ZIG-ZAG BLOCKS with CIRCULAR images (Olio style) ─── */}
      <section id="cara-kerja" className="bg-white relative z-30">
        {/* SVG Divider top (bulges UP into the dark green section) */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-[99%] pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-[60px] md:h-[140px]">
            <path d="M0,120 Q600,0 1200,120 L1200,120 L0,120 Z" fill="#ffffff"></path>
          </svg>
        </div>

        <div className="pb-12 pt-12 mx-auto max-w-6xl px-6 flex flex-col gap-12 md:gap-4">

          {/* Block 1: Hemat — image RIGHT, text LEFT */}
          <FadeIn delay={0.1}>
            <div className="md:flex md:items-center md:gap-12">
              <div className="md:w-1/2 order-2 md:order-1 md:text-right relative z-20">
                <h3 className="text-3xl md:text-5xl font-black text-brand-900 leading-tight">Hemat</h3>
                <p className="mt-4 text-lg leading-relaxed text-stone-500 max-w-md ml-auto">
                  Temukan makanan layak konsumsi dari UMKM mikro sekitar kampus dengan harga lebih hemat, jarak dekat yang jelas, stok pasti, dan reservasi instan.
                </p>
              </div>
              <div className="md:w-1/2 order-1 md:order-2 mb-6 md:mb-0 flex justify-center md:justify-start relative z-10 md:-ml-8">
                <div className="relative">
                  {/* Gradient shadow/glow (bottom-left) */}
                  <div className="absolute -left-4 -bottom-4 w-72 h-72 md:w-[26rem] md:h-[26rem] rounded-full bg-gradient-to-tr from-pink-300 via-amber-200 to-transparent opacity-60 blur-2xl"></div>
                  {/* Circular Image - slightly larger */}
                  <div className="relative w-72 h-72 md:w-[26rem] md:h-[26rem] rounded-full bg-white shadow-xl border-4 border-white overflow-hidden z-10 md:translate-x-4">
                    <Image src="/assets/Gemini_Generated_Image_2aeyq12aeyq12aey.jpg" alt="Hemat" fill className="object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Block 2: Bagikan/Bergabung — image LEFT, text RIGHT */}
          <FadeIn delay={0.2}>
            <div className="md:flex md:items-center md:gap-12 md:-mt-12">
              <div className="md:w-1/2 mb-6 md:mb-0 flex justify-center md:justify-end relative z-10 md:-mr-4">
                <div className="relative">
                  {/* Gradient shadow/glow (bottom-left) */}
                  <div className="absolute -left-2 -bottom-6 w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-rose-300 via-pink-200 to-transparent opacity-60 blur-2xl"></div>
                  {/* Circular Image - medium, slightly irregular radius */}
                  <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[45%_55%_50%_50%/50%_50%_55%_45%] bg-white shadow-xl border-4 border-white overflow-hidden z-10 md:-translate-y-4">
                    <Image src="/assets/Gemini_Generated_Image_jzp81tjzp81tjzp8.png" alt="Bagikan dan Bergabung" fill className="object-cover" />
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 relative z-20">
                <h3 className="text-3xl md:text-5xl font-black text-brand-900 leading-tight">Bergabung & Bagikan</h3>
                <p className="mt-4 text-lg leading-relaxed text-stone-500 max-w-md">
                  Bagikan bahan makanan antar-kos, pantau stok bersama, dan ubah sisa bahan menjadi pemasukan tambahan tanpa biaya pendaftaran.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Block 3: Pastikan — image RIGHT, text LEFT */}
          <FadeIn delay={0.3}>
            <div className="md:flex md:items-center md:gap-12 md:-mt-16">
              <div className="md:w-1/2 order-2 md:order-1 md:text-right relative z-20">
                <h3 className="text-3xl md:text-5xl font-black text-brand-900 leading-tight">Pastikan stok aman</h3>
                <p className="mt-4 text-lg leading-relaxed text-stone-500 max-w-md ml-auto">
                  Posting sederhana melalui &apos;kantong surplus&apos;, stok terlacak otomatis, dan komisi 10% hanya ketika transaksi terjadi.
                </p>
              </div>
              <div className="md:w-1/2 order-1 md:order-2 mb-6 md:mb-0 flex justify-center md:justify-start relative z-10 md:-ml-12">
                <div className="relative">
                  {/* Gradient shadow/glow (bottom-left) */}
                  <div className="absolute -left-8 -bottom-2 w-72 h-72 md:w-[22rem] md:h-[22rem] rounded-full bg-gradient-to-tr from-amber-300 via-orange-200 to-transparent opacity-60 blur-2xl"></div>
                  {/* Circular Image - smaller, slight shape tweak */}
                  <div className="relative w-72 h-72 md:w-[22rem] md:h-[22rem] rounded-[52%_48%_50%_50%/50%_50%_48%_52%] bg-white shadow-xl border-4 border-white overflow-hidden z-10 md:translate-y-8 md:translate-x-2">
                    <Image src="/assets/Gemini_Generated_Image_pxbbckpxbbckpxbb.jpg" alt="Pastikan" fill className="object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* ─── "Join … Olio-ers worldwide" → Social proof + phone mockup + avatars ─── */}
      <section id="kampus" className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-black text-brand-900 leading-tight">
              Bergabunglah bersama <span className="text-accent-600">ratusan mahasiswa</span> di sekitar kampus
            </h2>
          </FadeIn>

          {/* Phone mockup with floating avatar circles */}
          <div className="relative mt-20 flex justify-center h-[350px] md:h-[420px] overflow-hidden max-w-5xl mx-auto">
            {/* LEFT CLUSTER */}
            <div className="absolute left-2 md:left-12 top-20 w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand-100 border-4 border-white shadow-lg flex items-center justify-center text-brand-700 z-20"><MdSchool className="text-2xl md:text-3xl" /></div>
            <div className="absolute left-16 md:left-32 top-4 w-10 h-10 rounded-full bg-rose-100 border-[3px] border-white shadow-md flex items-center justify-center text-rose-700 z-20"><FiUser className="text-lg" /></div>
            <div className="absolute left-8 md:left-20 bottom-16 w-12 h-12 md:w-14 md:h-14 rounded-full bg-amber-100 border-4 border-white shadow-lg flex items-center justify-center text-amber-700 z-20"><MdStorefront className="text-xl md:text-2xl" /></div>
            <div className="absolute left-28 md:left-48 top-32 w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 border-[3px] border-white shadow-md flex items-center justify-center text-blue-700 z-20"><FiCoffee className="text-lg md:text-xl" /></div>
            <div className="absolute left-20 md:left-36 bottom-6 w-16 h-16 md:w-20 md:h-20 rounded-full bg-emerald-100 border-4 border-white shadow-xl flex items-center justify-center text-emerald-700 z-20"><MdFastfood className="text-3xl md:text-4xl" /></div>
            <div className="absolute left-1/4 top-14 w-8 h-8 rounded-full bg-purple-100 border-2 border-white shadow-sm flex items-center justify-center text-purple-700 z-20"><FiShoppingBag className="text-sm" /></div>
            <div className="absolute left-[30%] bottom-28 w-6 h-6 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-gray-500 z-20"><FiStar className="text-[10px]" /></div>
            
            {/* RIGHT CLUSTER */}
            <div className="absolute right-4 md:right-16 top-24 w-14 h-14 md:w-16 md:h-16 rounded-full bg-amber-100 border-4 border-white shadow-lg flex items-center justify-center text-amber-700 z-20"><MdRestaurant className="text-2xl md:text-3xl" /></div>
            <div className="absolute right-16 md:right-32 top-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-100 border-[3px] border-white shadow-md flex items-center justify-center text-brand-700 z-20"><FiUser className="text-lg md:text-xl" /></div>
            <div className="absolute right-8 md:right-20 bottom-24 w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-100 border-4 border-white shadow-lg flex items-center justify-center text-blue-700 z-20"><FiBookOpen className="text-xl md:text-2xl" /></div>
            <div className="absolute right-28 md:right-48 top-40 w-10 h-10 rounded-full bg-rose-100 border-[3px] border-white shadow-md flex items-center justify-center text-rose-700 z-20"><MdStorefront className="text-lg" /></div>
            <div className="absolute right-20 md:right-36 bottom-4 w-16 h-16 md:w-20 md:h-20 rounded-full bg-purple-100 border-4 border-white shadow-xl flex items-center justify-center text-purple-700 z-20"><FiUser className="text-3xl md:text-4xl" /></div>
            <div className="absolute right-1/4 top-16 w-8 h-8 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-emerald-700 z-20"><FiCoffee className="text-sm" /></div>
            <div className="absolute right-[30%] bottom-32 w-6 h-6 rounded-full bg-orange-100 border-2 border-white shadow-sm flex items-center justify-center text-orange-500 z-20"><FiStar className="text-[10px]" /></div>

            {/* Phone - slide up into view as the section enters viewport */}
            <SlideUp delay={0.15} className="relative z-10">
              <StudentDashboardPhone />
            </SlideUp>
          </div>

          {/* Impact Metrics row */}
          <div className="mt-16 flex flex-wrap justify-center gap-10 md:gap-16 border-t border-stone-100 pt-12">
            {/* Metric 1 */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-2">
                <FiPackage className="text-xl" />
              </div>
              <span className="text-3xl md:text-4xl font-black text-brand-900">
                <CountUp end={1200} suffix=" Kg" />
              </span>
              <span className="text-xs font-bold text-stone-500 uppercase tracking-widest text-center">Makanan<br/>Terselamatkan</span>
            </div>
            {/* Metric 2 */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-2">
                <MdStorefront className="text-xl" />
              </div>
              <span className="text-3xl md:text-4xl font-black text-brand-900">
                <CountUp end={45} prefix="Rp " suffix=" Juta" />
              </span>
              <span className="text-xs font-bold text-stone-500 uppercase tracking-widest text-center">Penghematan<br/>Mahasiswa</span>
            </div>
            {/* Metric 3 */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-2">
                <FiStar className="text-xl" />
              </div>
              <span className="text-3xl md:text-4xl font-black text-brand-900">
                <CountUp end={500} suffix=" Kg" />
              </span>
              <span className="text-xs font-bold text-stone-500 uppercase tracking-widest text-center">Emisi Karbon<br/>Dicegah</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full bg-brand-700 hover:bg-brand-800 text-white font-bold px-8 h-12 shadow-lg shadow-brand-700/30">
              <Link href="/register">Daftar Mahasiswa</Link>
            </Button>
            <Button asChild size="lg" className="rounded-full bg-white border-2 border-brand-600 text-brand-700 hover:bg-brand-50 font-bold px-8 h-12">
              <Link href="/mitra/register">Daftar Mitra UMKM</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Partner logos ─── */}
      <section id="mitra" className="scroll-mt-24 py-20 bg-white border-t border-stone-100 overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-brand-900 leading-tight">
            Makanan enak dari <span className="text-accent-600">warung favoritmu</span> hanya dalam genggaman!
          </h2>
        </div>

        {/* Running rectangular logo containers — single row, no border sekat */}
        <div className="relative mt-14">
          <div className="space-y-6 py-2">
            <WarungMarqueeRow items={WARUNG_FAVORIT} />
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button asChild className="rounded-full bg-brand-700 hover:bg-brand-800 text-white font-bold px-8 h-11 shadow-lg shadow-brand-700/30">
            <Link href="/mitra/register">Jadi mitra UMKM</Link>
          </Button>
        </div>
      </section>

      {/* ─── LIVE KANTONG SURPLUS (FOMO Widget) ─── */}
      <section id="tersedia" className="py-20 md:py-28 bg-brand-50 border-y border-brand-100 relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
                <span className="text-sm font-bold text-rose-500 uppercase tracking-widest">Live di Sekitar Unnes</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-brand-900 leading-tight">
                Kantong Surplus <span className="text-brand-600">Terbatas</span> Hari Ini
              </h2>
            </div>
            <Link href="/login" className="text-brand-700 font-bold hover:text-brand-800 transition flex items-center gap-1">
              Lihat semua <FiArrowRight />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden group">
              <div className="relative h-40 overflow-hidden">
                <Image src="/assets/images (5).jpg" alt="Nasi Ayam" fill className="object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-brand-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <FiMapPin /> 300m
                </div>
                <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md animate-pulse">
                  Sisa 2 Porsi
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-brand-900 truncate">Nasi Ayam Serundeng</h3>
                <p className="text-sm text-stone-500 mt-1">Warteg Ibu Tia</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-stone-400 line-through">Rp 15.000</div>
                    <div className="font-black text-brand-700 text-lg">Rp 7.500</div>
                  </div>
                  <Button asChild size="sm" className="rounded-full bg-brand-600 hover:bg-brand-700">
                    <Link href="/login">Pesan</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden group">
              <div className="relative h-40 overflow-hidden">
                <Image src="/assets/images (2).jpg" alt="Mie Dokdok" fill className="object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-brand-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <FiMapPin /> 450m
                </div>
                <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md animate-pulse">
                  Sisa 1 Porsi
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-brand-900 truncate">Mie Dokdok Spesial</h3>
                <p className="text-sm text-stone-500 mt-1">Burjo Titik Kumpul</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-stone-400 line-through">Rp 12.000</div>
                    <div className="font-black text-brand-700 text-lg">Rp 6.000</div>
                  </div>
                  <Button asChild size="sm" className="rounded-full bg-brand-600 hover:bg-brand-700">
                    <Link href="/login">Pesan</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden group">
              <div className="relative h-40 overflow-hidden">
                <Image src="/assets/images (4).jpg" alt="Ayam Geprek" fill className="object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-brand-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <FiMapPin /> 800m
                </div>
                <div className="absolute top-3 right-3 bg-stone-100 text-stone-600 text-xs font-bold px-2 py-1 rounded-md">
                  Sisa 4 Porsi
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-brand-900 truncate">Paket Ayam Geprek</h3>
                <p className="text-sm text-stone-500 mt-1">Burjo Borneo</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-stone-400 line-through">Rp 18.000</div>
                    <div className="font-black text-brand-700 text-lg">Rp 9.000</div>
                  </div>
                  <Button asChild size="sm" className="rounded-full bg-brand-600 hover:bg-brand-700">
                    <Link href="/login">Pesan</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex flex-col items-center justify-center rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-6 text-center text-white shadow-lg shadow-brand-700/20 transition hover:-translate-y-1 hover:shadow-brand-700/30">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-2xl shadow-inner shadow-white/20">
                <FiArrowRight className="text-white" />
              </div>
              <h3 className="text-xl font-black">Lihat 24+ porsi lainnya</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-50/90">
                Masuk untuk melihat semua makanan sisa hari ini di sekitar kampusmu.
              </p>
              <Button asChild size="sm" className="mt-5 rounded-full bg-white text-brand-800 hover:bg-brand-50 font-bold">
                <Link href="/login">Masuk sekarang</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Reviews / Testimonials (Olio style: 2 column quotes with big " marks) ─── */}
      <section className="py-20 md:py-28 bg-stone-50">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-black text-brand-900 text-center leading-tight">
              Dengarkan mengapa{" "}
              <span className="text-accent-600">mahasiswa dan UMKM</span>{" "}
              memilih DishCon
            </h2>
          </FadeIn>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {[{name:"Siti Rahmawati", role:"Mahasiswa Kos", title:"Sangat membantu anak kos", text:"Awalnya saya menggunakan DishCon karena ingin mencari makanan murah di akhir bulan. Setelah beberapa kali reservasi, ternyata banyak warung enak di sekitar kos. Sangat membantu mahasiswa kos seperti saya untuk tetap bisa makan enak tanpa harus menguras kantong!", accent:"brand"},{name:"Pak Budi", role:"Pemilik Warmindo", title:"Solusi makanan sisa warung", text:"Aplikasi ini sangat membantu saya mengurangi sisa jualan di malam hari. Daripada mubazir terbuang, saya jual sebagai kantong surplus. Mahasiswa juga senang bisa dapat makanan murah meriah. Transaksinya transparan dan potongannya kecil. Terima kasih DishCon!", accent:"accent"},{name:"Lina Permata", role:"Mahasiswa Kos", title:"Pengalaman yang luar biasa", text:"Menggunakan DishCon bukan hanya soal berhemat, tapi juga tentang mengurangi sampah makanan di lingkungan kampus. Aplikasinya sangat mudah digunakan, reservasinya cepat, dan lokasinya akurat. Fitur berbaginya juga seru banget!", accent:"amber"},{name:"Verrel Gunawan", role:"Mahasiswa Kos", title:"Penyelamat tanggal tua", text:"DishCon benar-benar penyelamat anak kos di akhir bulan. Pernah juga dapat bagian bahan makanan dari teman kos lain lewat fitur berbaginya. Komunitasnya sangat positif dan saling membantu. Sangat direkomendasikan untuk semua mahasiswa!", accent:"rose"}].map((review, index) => (
              <FadeIn key={review.name} delay={index * 0.08}>
                <div className="relative rounded-3xl bg-white p-8 shadow-sm md:p-10">
                  <span className="absolute right-8 top-6 select-none text-6xl font-serif leading-none text-brand-200">&ldquo;</span>
                  <div className="mb-4 flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <h3 className="text-xl font-black text-brand-900">{review.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-stone-500">{review.text}</p>
                  <div className="mt-8 flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${review.accent === "brand" ? "bg-brand-100 text-brand-700" : review.accent === "accent" ? "bg-accent-100 text-accent-700" : review.accent === "amber" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                      {review.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-brand-900">{review.name}</div>
                      <div className="text-xs text-stone-400">{review.role}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Inspirasi / Blog (Olio "Be inspired" grid) ─── */}
      <section id="inspirasi" className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-black text-brand-900">Inspirasi</h2>
            <Link href="/inspirasi" className="inline-flex items-center gap-2 rounded-full bg-brand-700 text-white text-sm font-bold px-5 py-2.5 hover:bg-brand-800 transition shadow-lg shadow-brand-700/25">
              Lihat semua artikel <FiArrowRight />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              { href: "/inspirasi/satu-porsi", image: "/assets/visual-poster-kampanye-02.png", tag: "Dampak Nyata", title: "Satu porsi tidak terbuang: Kurangi sampah makanan, tingkatkan kebaikan.", meta: "5 menit baca · 12 Mei 2026" },
              { href: "/inspirasi/hemat-surplus", image: "/assets/visual-poster-kampanye-01.png", tag: "Mahasiswa", title: "Cara mahasiswa berhemat di akhir bulan dengan kantong surplus", meta: "3 menit baca · 8 Mei 2026" },
              { href: "/inspirasi/keamanan-pangan", image: "/assets/visual-alur-distribusi.png", tag: "Keamanan Pangan", title: "Alur distribusi aman dan cek gizi otomatis berbasis AI", meta: "4 menit baca · 2 Mei 2026" },
              { href: "/inspirasi/fitur-peta", image: "/assets/visual-halaman-beranda.png", tag: "Fitur Baru", title: "Eksplorasi kantong surplus kini lebih mudah dengan peta hiperlokal", meta: "6 menit baca · 18 Apr 2026" },
            ].map((article, index) => (
              <FadeIn key={article.href} delay={index * 0.08}>
                <Link href={article.href} className="group relative block h-60 overflow-hidden rounded-[1.5rem] shadow-sm md:h-72 xl:h-80">
                  <Image src={article.image} alt={article.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 text-white">
                    <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.16em] text-brand-100">
                      <span className="rounded-full bg-white/15 px-2 py-1">{article.tag}</span>
                      <span>{article.meta}</span>
                    </div>
                    <h3 className="text-sm font-black leading-snug text-white group-hover:text-brand-200 md:text-base">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER CTA ─── */}
      <section className="bg-gradient-to-r from-brand-800 via-brand-900 to-brand-800 py-16 md:py-20 relative overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-brand-700/30 rounded-b-full" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Cari makan hemat di sekitar kampus? <span className="text-brand-200">Atau ubah sisa dagangan jadi pemasukan?</span>
            </h2>
          </FadeIn>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-white text-brand-900 hover:bg-brand-50 font-bold px-8 h-12 shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03]">
              <Link href="/register">Daftar Mahasiswa</Link>
            </Button>
            <Button asChild size="lg" className="rounded-full bg-brand-500 hover:bg-brand-400 text-white font-bold px-8 h-12 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03]">
              <Link href="/mitra/register">Daftar Mitra UMKM</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-brand-900 text-white pt-14 pb-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-8 text-sm md:grid-cols-4">
            <div className="space-y-3">
              <h4 className="mb-4 font-black text-white">DishCon</h4>
              <Link href="/tentang" className="block text-white/60 hover:text-white transition">Tentang</Link>
              <Link href="/dampak" className="block text-white/60 hover:text-white transition">Dampak</Link>
              <Link href="/tim" className="block text-white/60 hover:text-white transition">Tim</Link>
              <Link href="/catalog" className="block text-white/60 hover:text-white transition">Katalog</Link>
            </div>
            <div className="space-y-3">
              <h4 className="mb-4 font-black text-white">Lainnya</h4>
              <Link href="/karir" className="block text-white/60 hover:text-white transition">Karir</Link>
              <Link href="/pers" className="block text-white/60 hover:text-white transition">Pers</Link>
              <Link href="/faq" className="block text-white/60 hover:text-white transition">FAQ</Link>
              <Link href="/hubungi" className="block text-white/60 hover:text-white transition">Hubungi</Link>
            </div>
            <div className="space-y-3">
              <h4 className="mb-4 font-black text-white">Sosial</h4>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white transition"><FiInstagram /> Instagram</a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white transition"><FiPlayCircle /> TikTok</a>
              <a href="https://wa.me/628123456789" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white transition"><FiMessageCircle /> WhatsApp</a>
            </div>
            <div className="col-span-2 space-y-3 md:col-span-1">
              <h4 className="mb-4 font-black text-white">Legal</h4>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/60">
                <Link href="/legal/syarat-ketentuan" className="hover:text-white transition">Syarat & Ketentuan</Link>
                <Link href="/legal/privasi" className="hover:text-white transition">Kebijakan Privasi</Link>
                <Link href="/legal/cookie" className="hover:text-white transition">Kebijakan Cookie</Link>
                <Link href="/legal/lisensi" className="hover:text-white transition">Perjanjian Lisensi</Link>
                <Link href="/legal/alergen" className="hover:text-white transition">Informasi Alergen</Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
            <p>Platform food-rescue pertama di sekitar kampus</p>
            <p>DishCon &copy; 2026 &middot; Dibuat dengan &hearts; di Semarang</p>
          </div>
        </div>
      </footer>

    </main>
  );
}
