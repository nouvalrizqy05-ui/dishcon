import Link from "next/link";
import { PageLayout } from "@/components/landing/page-layout";
import { FiDownload, FiMail } from "react-icons/fi";

const news = [
  { date: "20 Sep 2026", title: "DishCon Raih Penghargaan Startup Berdampak Sosial 2026 di Jawa Tengah", outlet: "Tribun Jateng" },
  { date: "5 Agu 2026", title: "Cara Startup Ini Selamatkan Ribuan Kilogram Makanan dari Tempat Sampah", outlet: "Kompas Muda" },
  { date: "17 Jul 2026", title: "DishCon: Marketplace Kantong Surplus Pertama untuk Mahasiswa Kos di Semarang", outlet: "Suara Merdeka" },
  { date: "3 Jun 2026", title: "Menjembatani Surplus dan Kebutuhan: Kisah di Balik DishCon", outlet: "IDN Times Jateng" },
];

export default function PersPage() {
  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-brand-800 to-brand-600 py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 0)', backgroundSize: '40px 40px'}} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">Ruang Pers</h1>
          <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">
            Semua yang perlu Anda ketahui tentang DishCon — untuk media, jurnalis, dan mitra komunikasi.
          </p>
          <a href="mailto:dishcon0@gmail.com" className="mt-8 inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-6 py-3 rounded-full hover:bg-brand-50 transition shadow-lg">
            <FiMail /> dishcon0@gmail.com
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Beranda</Link>
          <span>/</span>
          <span className="text-brand-700 font-semibold">Pers</span>
        </nav>
      </div>

      {/* Brand Kit */}
      <section className="py-16 border-b border-stone-100">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl md:text-3xl font-black text-brand-900 mb-8">Brand Kit</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { title: "Logo DishCon", desc: "PNG, SVG — light & dark variant", size: "2.4 MB" },
              { title: "Brand Guidelines", desc: "Warna, tipografi, tone of voice", size: "4.1 MB" },
              { title: "Foto Tim & Produk", desc: "High-resolution, editorial use", size: "18 MB" },
            ].map((kit) => (
              <div key={kit.title} className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-brand-900">{kit.title}</h3>
                  <p className="text-stone-500 text-sm mt-2">{kit.desc}</p>
                  <p className="text-stone-400 text-xs mt-1">{kit.size}</p>
                </div>
                <button className="mt-5 flex items-center gap-2 text-brand-600 font-bold text-sm hover:text-brand-800 transition">
                  <FiDownload /> Unduh
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote media */}
      <section className="py-16 bg-brand-50 border-b border-brand-100">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <blockquote className="text-2xl md:text-3xl font-black text-brand-900 leading-snug">
            &ldquo;DishCon adalah contoh nyata bagaimana teknologi sederhana dapat menciptakan dampak sosial dan lingkungan yang luar biasa di tingkat komunitas.&rdquo;
          </blockquote>
          <cite className="block mt-5 text-stone-500 text-sm not-italic font-semibold">— Kompas Muda, Agustus 2026</cite>
        </div>
      </section>

      {/* Berita Terbaru */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl md:text-3xl font-black text-brand-900 mb-10">DishCon di Media</h2>
          <div className="space-y-4">
            {news.map((item) => (
              <div key={item.title} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-6 bg-white rounded-2xl border border-stone-100 shadow-sm hover:border-brand-200 transition">
                <div>
                  <p className="text-xs font-bold text-brand-600 mb-1">{item.outlet} &middot; {item.date}</p>
                  <h3 className="font-bold text-stone-800 leading-snug">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontak Pers */}
      <section className="py-14 bg-brand-900 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-black">Butuh Informasi Lebih?</h2>
          <p className="mt-3 text-white/70">Tim komunikasi kami siap membantu Anda dengan wawancara, data, dan materi editorial.</p>
          <a href="mailto:dishcon0@gmail.com" className="mt-6 inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-7 py-3 rounded-full hover:bg-brand-50 transition">
            <FiMail /> dishcon0@gmail.com
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
