import Link from "next/link";
import { FiMail, FiPhone } from "react-icons/fi";
import { BrandLogo } from "@/components/brand-logo";
import { HeroIllustration } from "@/components/landing/hero-illustration";
import { DistributionFlowVisual, ImpactPosterVisual, SafetyPosterVisual } from "@/components/landing/campaign-poster-visuals";
import { PublicHeader } from "@/components/landing/public-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { featureCards, howItWorks, stats } from "@/lib/data";

export default function LandingPage() {
  const contactEmailLabel = process.env.NEXT_PUBLIC_CONTACT_EMAIL_LABEL || "Email Kami";
  const contactEmailHref = process.env.NEXT_PUBLIC_CONTACT_EMAIL_HREF || "https://mail.google.com/mail/?view=cm&fs=1&to=bagusganz65%40gmail.com&su=Bantuan%20DishCon&body=Halo%20DishCon%2C%0A%0ASaya%20ingin%20bertanya%20tentang%20";
  const contactPhoneLabel = process.env.NEXT_PUBLIC_CONTACT_PHONE_LABEL || "WhatsApp";
  const contactPhoneHref = process.env.NEXT_PUBLIC_CONTACT_PHONE_HREF || "https://wa.me/6287765432823";

  return (
    <main className="min-h-screen bg-cream text-ink">
      <PublicHeader />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section id="beranda" className="container-page grid min-h-[640px] items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex rounded-full bg-brand-100 px-4 py-2 text-sm font-extrabold text-brand-700">
            Marketplace Kantong Surplus · Sekaran–Gunungpati
          </span>
          <h1 className="mt-8 max-w-2xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
            Kurangi Sisa Dagangan,{" "}
            <span className="block text-brand-600">Hemat untuk Mahasiswa</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-stone-600">
            DishCon menghubungkan UMKM mikro (warmindo, angkringan, katering rumahan) di sekitar
            kampus Unnes dengan mahasiswa kos melalui <strong>kantong surplus</strong> berbasis AI —
            harga diskon, analisis nutrisi otomatis, dan reservasi instan tanpa birokrasi.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button asChild size="lg"><Link href="/register?role=mitra">Daftar sebagai Mitra</Link></Button>
            <Button asChild variant="secondary" size="lg"><Link href="/register?role=mahasiswa">Cari Kantong Surplus</Link></Button>
          </div>
          <p className="mt-6 text-sm text-stone-500">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-extrabold text-brand-700 underline underline-offset-2">
              Login di sini →
            </Link>
          </p>
        </div>
        <HeroIllustration />
      </section>

      {/* ── Campaign Visuals ─────────────────────────────── */}
      <section className="container-page pb-16">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-card">
            <SafetyPosterVisual />
            <div className="p-6">
              <h3 className="font-black text-brand-900">Keamanan Pangan Terjamin</h3>
              <p className="mt-2 text-sm leading-7 text-stone-600">AI menganalisis foto makanan, mendeteksi alergen, dan memverifikasi kelayakan sebelum kantong surplus tayang ke mahasiswa.</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-card">
            <ImpactPosterVisual />
            <div className="p-6">
              <h3 className="font-black text-brand-900">Dampak Nyata #ZeroFoodWaste</h3>
              <p className="mt-2 text-sm leading-7 text-stone-600">Setiap kantong surplus yang terjual berarti satu porsi makanan tidak terbuang — sejalan dengan target SDG 2 Zero Hunger.</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-card">
            <DistributionFlowVisual />
            <div className="p-6">
              <h3 className="font-black text-brand-900">Distribusi Hiperlokal Cerdas</h3>
              <p className="mt-2 text-sm leading-7 text-stone-600">Jarak dihitung otomatis (rumus haversine) dari lokasi kos mahasiswa ke warung mitra dalam radius preferensi yang bisa diatur.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────── */}
      <section className="container-page -mt-2 grid gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="p-8 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-500"><Icon /></span>
              <p className="mt-5 text-3xl font-black">{item.number}</p>
              <p className="mt-1 text-sm text-stone-500">{item.label}</p>
            </Card>
          );
        })}
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section id="fitur" className="border-y border-stone-200 bg-white py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black md:text-4xl">Fitur Unggulan DishCon + AI</h2>
            <p className="mt-4 text-stone-500">
              Teknologi cerdas kami memastikan setiap kantong surplus yang disalurkan aman, bernutrisi, dan ditemukan mahasiswa terdekat tepat waktu.
            </p>
          </div>
          <div className="mt-14 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="p-8 transition hover:-translate-y-1 hover:shadow-soft">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-500"><Icon className="h-6 w-6" /></span>
                  <h3 className="mt-7 text-xl font-extrabold">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-stone-500">{item.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section id="cara-kerja" className="container-page py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black md:text-4xl">Cara Kerja DishCon</h2>
          <p className="mt-4 text-stone-500">
            Dari warung ke tangan mahasiswa — proses yang transparan, cepat, dan didukung kecerdasan buatan.
          </p>
        </div>
        <div className="relative mt-16 grid gap-8 lg:grid-cols-4">
          <div className="absolute left-[8%] right-[8%] top-8 hidden h-1 bg-brand-100 lg:block" />
          {howItWorks.map((item, index) => (
            <div key={item.title} className="relative text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-600 text-2xl font-black text-white shadow-lg shadow-brand-600/25">{index + 1}</span>
              <h3 className="mt-6 font-extrabold">{item.title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-stone-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Value Props ──────────────────────────────────── */}
      <section className="border-y border-brand-100 bg-brand-50 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black md:text-4xl text-brand-900">Mengapa DishCon?</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Card className="p-6 text-center border-brand-200">
              <p className="text-4xl">🏪</p>
              <h3 className="mt-4 font-black text-brand-900">Untuk UMKM Mikro</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">Warmindo, angkringan, katering rumahan tidak butuh modal besar untuk bergabung. Hanya 10% komisi per transaksi, tanpa biaya pendaftaran.</p>
            </Card>
            <Card className="p-6 text-center border-brand-200">
              <p className="text-4xl">🎓</p>
              <h3 className="mt-4 font-black text-brand-900">Untuk Mahasiswa Kos</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">Dapatkan makanan layak konsumsi dengan harga diskon dari warung terdekat di sekitar kampus Unnes — lebih hemat dari harga normal.</p>
            </Card>
            <Card className="p-6 text-center border-brand-200">
              <p className="text-4xl">🌱</p>
              <h3 className="mt-4 font-black text-brand-900">Untuk Lingkungan</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">Setiap transaksi mengurangi sisa makanan yang berakhir di TPA — mendukung target DLH Kota Semarang dalam mengurangi limbah organik.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="container-page py-20 text-center">
        <h2 className="text-3xl font-black md:text-4xl">Siap Bergabung?</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-stone-600">
          Daftar gratis sebagai mitra UMKM untuk mulai menjual kantong surplus, atau sebagai mahasiswa untuk menemukan makanan terdekat.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg"><Link href="/register">Daftar Sekarang — Gratis</Link></Button>
          <Button asChild variant="secondary" size="lg"><Link href="/login">Sudah Punya Akun</Link></Button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer id="tentang" className="bg-[#07101f] text-white">
        <div className="container-page py-12 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-bold text-white/90">
            <a href={contactEmailHref} className="inline-flex items-center gap-2 transition hover:text-brand-300"><FiMail className="text-lg" /> {contactEmailLabel}</a>
            <a href={contactPhoneHref} className="inline-flex items-center gap-2 transition hover:text-brand-300"><FiPhone className="text-lg" /> {contactPhoneLabel}</a>
          </div>
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-9 gap-y-3 text-sm font-semibold text-white/85">
            <Link href="/#beranda" className="transition hover:text-brand-300">Beranda</Link>
            <Link href="/#fitur" className="transition hover:text-brand-300">Fitur</Link>
            <Link href="/#cara-kerja" className="transition hover:text-brand-300">Cara Kerja</Link>
            <Link href="/#tentang" className="transition hover:text-brand-300">Tentang Kami</Link>
            <a href={contactEmailHref} className="transition hover:text-brand-300">Kontak</a>
            <Link href="/login" className="transition hover:text-brand-300">Login</Link>
            <Link href="/register" className="transition hover:text-brand-300">Daftar</Link>
          </nav>
          <div className="mx-auto mt-9 h-px max-w-3xl bg-white/10" />
          <p className="mt-6 text-sm font-bold text-white/70">DishCon — Marketplace Kantong Surplus</p>
          <p className="mt-2 text-xs text-white/40">Sekaran–Gunungpati, Semarang · Dibuat oleh Kelompok 15 © 2026</p>
        </div>
      </footer>
    </main>
  );
}
