import Link from "next/link";
import Image from "next/image";
import { PageLayout } from "@/components/landing/page-layout";
import { FiArrowLeft, FiMapPin, FiNavigation, FiClock } from "react-icons/fi";

export default function FiturPetaPage() {
  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-brand-800 to-brand-600 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="inline-block bg-accent-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">Fitur Baru</span>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">Eksplorasi Kantong Surplus dengan Peta Hiperlokal</h1>
          <p className="mt-4 text-white/70 text-sm">15 September 2026 &middot; Tim Produk DishCon</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Beranda</Link>
          <span>/</span>
          <Link href="/inspirasi" className="hover:text-brand-600">Inspirasi</Link>
          <span>/</span>
          <span className="text-brand-700 font-semibold">Fitur Peta</span>
        </nav>
      </div>

      <article className="mx-auto max-w-3xl px-6 pb-24 pt-8">
        <div className="relative h-72 rounded-3xl overflow-hidden mb-10 shadow-lg">
          <Image src="/assets/visual-halaman-beranda.png" alt="Peta Hiperlokal DishCon" fill className="object-cover" />
        </div>

        <p className="text-lg text-stone-700 leading-relaxed">
          Kami dengan bangga memperkenalkan fitur terbaru DishCon: <strong className="text-brand-800">Peta Hiperlokal</strong>. Kini Anda tidak perlu lagi menggulir daftar panjang untuk menemukan kantong surplus terdekat. Cukup buka peta, dan dalam hitungan detik Anda akan melihat semua pilihan makanan yang tersedia dalam radius lokasi Anda.
        </p>

        <h2 className="text-2xl font-black text-brand-900 mt-10 mb-6">Cara Kerja Peta Hiperlokal</h2>
        <div className="space-y-4">
          {[
            { icon: FiNavigation, title: "Deteksi Lokasi Otomatis", desc: "Izinkan DishCon mengakses lokasi Anda, dan aplikasi langsung menampilkan pin-pin mitra aktif dalam radius 1 km." },
            { icon: FiMapPin, title: "Pin Berwarna Berdasarkan Kategori", desc: "Setiap pin memiliki warna berbeda: hijau untuk warmindo/warteg, oranye untuk angkringan, biru untuk katering, dan ungu untuk toko bahan makanan." },
            { icon: FiClock, title: "Real-time Stock & Countdown", desc: "Setiap pin menampilkan jumlah sisa porsi dan hitungan mundur hingga batas waktu pengambilan. Pin berkedip merah artinya stok hampir habis!" },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-5 rounded-2xl border border-stone-100 hover:border-brand-200 transition">
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                <item.icon />
              </div>
              <div>
                <h3 className="font-black text-brand-900">{item.title}</h3>
                <p className="text-stone-500 text-sm mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-black text-brand-900 mt-10 mb-4">Mengapa &lsquo;Hiperlokal&rsquo;?</h2>
        <p className="text-stone-700 leading-relaxed">
          Konsep hiperlokal berarti DishCon hanya menampilkan makanan yang bisa Anda capai dalam 5–15 menit berjalan kaki atau naik motor. Ini bukan hanya soal kenyamanan — ini adalah strategi untuk memastikan makanan benar-benar segar saat sampai ke tangan Anda, sekaligus mendukung ekosistem ekonomi mikro di sekitar kampus Anda.
        </p>

        <p className="text-stone-700 leading-relaxed mt-5">
          Berbeda dengan aplikasi pengiriman makanan yang menjangkau kota, DishCon sengaja membatasi radius agar interaksi antara mahasiswa dan UMKM terasa personal, langsung, dan berdampak nyata pada komunitas sekitar kampus.
        </p>

        <div className="mt-10 bg-brand-50 border border-brand-100 rounded-3xl p-7">
          <h3 className="font-black text-brand-900 text-lg mb-2">Tersedia di Versi Terbaru</h3>
          <p className="text-stone-600 text-sm leading-relaxed">Fitur Peta Hiperlokal tersedia untuk semua pengguna DishCon versi 2.0 ke atas. Pastikan aplikasi Anda sudah diperbarui untuk menikmati pengalaman eksplorasi terbaik.</p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 items-center justify-between border-t border-stone-200 pt-8">
          <Link href="/inspirasi" className="flex items-center gap-2 text-brand-600 font-bold hover:text-brand-800 transition">
            <FiArrowLeft /> Kembali ke Inspirasi
          </Link>
          <Link href="/register" className="rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold px-7 py-3 transition shadow-lg shadow-brand-600/25">
            Coba Peta Sekarang
          </Link>
        </div>
      </article>
    </PageLayout>
  );
}
