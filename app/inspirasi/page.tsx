import Link from "next/link";
import Image from "next/image";
import { PageLayout } from "@/components/landing/page-layout";
import { FiArrowRight } from "react-icons/fi";

const articles = [
  {
    href: "/inspirasi/satu-porsi",
    image: "/assets/visual-poster-kampanye-02.png",
    tag: "Dampak Nyata",
    tagColor: "bg-brand-600 text-white",
    title: "Satu Porsi Tidak Terbuang: Kurangi Sampah Makanan, Tingkatkan Kebaikan",
    excerpt: "Indonesia membuang 48 juta ton makanan setiap tahun. DishCon hadir untuk mengubah angka itu, satu kantong surplus pada satu waktu.",
  },
  {
    href: "/inspirasi/hemat-surplus",
    image: "/assets/visual-poster-kampanye-01.png",
    tag: "Mahasiswa",
    tagColor: "bg-white text-brand-700",
    title: "7 Cara Mahasiswa Berhemat di Akhir Bulan dengan Kantong Surplus",
    excerpt: "Tanggal tua bukan berarti harus lapar. Temukan strategi cerdas anak kos untuk tetap makan enak dengan budget minimal.",
  },
  {
    href: "/inspirasi/keamanan-pangan",
    image: "/assets/visual-alur-distribusi.png",
    tag: "Keamanan Pangan",
    tagColor: "bg-white text-brand-700",
    title: "Alur Distribusi Aman dan Cek Gizi Otomatis Berbasis AI di DishCon",
    excerpt: "Bagaimana DishCon memastikan setiap kantong surplus yang sampai ke tangan Anda adalah makanan yang aman dan layak konsumsi?",
  },
  {
    href: "/inspirasi/fitur-peta",
    image: "/assets/visual-halaman-beranda.png",
    tag: "Fitur Baru",
    tagColor: "bg-accent-500 text-white",
    title: "Eksplorasi Kantong Surplus Kini Lebih Mudah dengan Peta Hiperlokal",
    excerpt: "Fitur peta berbasis GPS DishCon membantu Anda menemukan makanan surplus terbaik dalam radius 1 km dari lokasi Anda saat ini.",
  },
];

export default function InspirasiPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-800 to-brand-600 py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4">Blog & Cerita</span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">Inspirasi DishCon</h1>
          <p className="mt-5 text-lg text-white/80 max-w-2xl mx-auto">
            Cerita, panduan, dan wawasan tentang food-rescue, gaya hidup hemat mahasiswa, dan dampak nyata yang kita ciptakan bersama.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Beranda</Link>
          <span>/</span>
          <span className="text-brand-700 font-semibold">Inspirasi</span>
        </nav>
      </div>

      {/* Articles Grid */}
      <section className="py-12 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {articles.map((article) => (
              <Link key={article.href} href={article.href} className="group block rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg transition duration-300">
                <div className="relative h-56 overflow-hidden">
                  <Image src={article.image} alt={article.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full shadow-md ${article.tagColor}`}>
                    {article.tag}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-black text-brand-900 leading-snug group-hover:text-brand-600 transition">{article.title}</h2>
                  <p className="mt-3 text-stone-500 text-sm leading-relaxed">{article.excerpt}</p>
                  <div className="mt-5 flex items-center gap-1 text-brand-600 font-bold text-sm">
                    Baca selengkapnya <FiArrowRight />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
