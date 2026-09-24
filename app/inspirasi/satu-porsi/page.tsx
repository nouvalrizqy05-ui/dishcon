import Link from "next/link";
import Image from "next/image";
import { PageLayout } from "@/components/landing/page-layout";
import { FiArrowLeft } from "react-icons/fi";

export default function SatuPorsiPage() {
  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-brand-800 to-brand-600 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">Dampak Nyata</span>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">Satu Porsi Tidak Terbuang</h1>
          <p className="mt-4 text-white/70 text-sm">23 September 2026 &middot; Tim DishCon</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Beranda</Link>
          <span>/</span>
          <Link href="/inspirasi" className="hover:text-brand-600">Inspirasi</Link>
          <span>/</span>
          <span className="text-brand-700 font-semibold">Satu Porsi Tidak Terbuang</span>
        </nav>
      </div>

      <article className="mx-auto max-w-3xl px-6 pb-24 pt-8">
        <div className="relative h-80 rounded-3xl overflow-hidden mb-10 shadow-lg">
          <Image src="/assets/visual-poster-kampanye-02.png" alt="Satu Porsi Tidak Terbuang" fill className="object-cover" />
        </div>

        <p className="text-lg text-stone-700 leading-relaxed">
          Indonesia adalah salah satu penghasil sampah makanan terbesar di dunia. Setiap tahunnya, sekitar <strong className="text-brand-800">48 juta ton makanan</strong> terbuang sia-sia — setara dengan kerugian ekonomi hingga Rp 213 triliun. Ironisnya, di saat yang bersamaan, jutaan mahasiswa kos harus memutar otak agar bisa makan layak di akhir bulan.
        </p>

        <blockquote className="my-8 border-l-4 border-brand-500 pl-6 bg-brand-50 py-5 pr-5 rounded-r-2xl">
          <p className="text-brand-800 font-bold text-xl leading-snug">&ldquo;48 juta ton makanan terbuang per tahun di Indonesia — cukup untuk memberi makan 100 juta orang selama setahun penuh.&rdquo;</p>
          <cite className="text-brand-600 text-sm mt-2 block not-italic">— Laporan Food and Agriculture Organization (FAO), 2023</cite>
        </blockquote>

        <p className="text-stone-700 leading-relaxed mt-6">
          Di sinilah DishCon hadir. Kami percaya bahwa setiap porsi makanan yang masih layak konsumsi memiliki nilai yang tidak seharusnya berakhir di tempat sampah. Warmindo yang menutup gerai di malam hari dengan sisa 5 porsi nasi ayam, katering yang menyisakan lauk makan siang, angkringan yang membungkus gorengan yang belum habis terjual — semua ini bisa menjadi kantong surplus yang menguntungkan semua pihak.
        </p>

        <h2 className="text-2xl font-black text-brand-900 mt-10 mb-4">Apa Itu Kantong Surplus?</h2>
        <p className="text-stone-700 leading-relaxed">
          Kantong surplus adalah konsep sederhana: makanan layak konsumsi yang dijual dengan harga diskon oleh mitra UMKM mikro di sekitar kampus melalui platform DishCon. Mitra memposting sisa dagangan mereka — lengkap dengan foto, harga diskon, estimasi nutrisi dari AI, dan batas waktu pengambilan. Mahasiswa di sekitarnya langsung bisa memesan dan mengambilnya.
        </p>

        <h2 className="text-2xl font-black text-brand-900 mt-10 mb-4">Dampak yang Sudah Tercipta</h2>
        <div className="grid grid-cols-3 gap-4 my-6">
          {[
            { num: "1.200 Kg", label: "Makanan Terselamatkan" },
            { num: "Rp 45 Jt", label: "Penghematan Mahasiswa" },
            { num: "500 Kg", label: "CO₂ Dicegah" },
          ].map((m) => (
            <div key={m.label} className="bg-brand-50 rounded-2xl p-4 text-center border border-brand-100">
              <div className="text-2xl font-black text-brand-700">{m.num}</div>
              <div className="text-xs text-stone-500 mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        <p className="text-stone-700 leading-relaxed">
          Angka-angka di atas bukan sekadar statistik — di balik setiap kilogram yang terselamatkan, ada seorang mahasiswa yang tidak perlu tidur lapar, ada seorang pemilik warung yang tidak perlu membuang hasil jerih payahnya, dan ada sedikit beban yang terangkat dari pundak bumi kita.
        </p>

        <h2 className="text-2xl font-black text-brand-900 mt-10 mb-4">Bergabunglah dalam Gerakan Ini</h2>
        <p className="text-stone-700 leading-relaxed">
          Perubahan tidak membutuhkan aksi besar. Cukup dengan memesan satu kantong surplus hari ini, Anda sudah berkontribusi dalam gerakan global melawan food waste. Jadilah bagian dari generasi yang mengubah &lsquo;sisa&rsquo; menjadi &lsquo;solusi&rsquo;.
        </p>

        <div className="mt-12 flex flex-wrap gap-4 items-center justify-between border-t border-stone-200 pt-8">
          <Link href="/inspirasi" className="flex items-center gap-2 text-brand-600 font-bold hover:text-brand-800 transition">
            <FiArrowLeft /> Kembali ke Inspirasi
          </Link>
          <Link href="/register" className="rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold px-7 py-3 transition shadow-lg shadow-brand-600/25">
            Bergabung Sekarang
          </Link>
        </div>
      </article>
    </PageLayout>
  );
}
