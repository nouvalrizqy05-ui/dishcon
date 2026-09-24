import Link from "next/link";
import Image from "next/image";
import { PageLayout } from "@/components/landing/page-layout";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";

const tips = [
  { title: "Pantau Jadwal Tutup Warung Favorit", desc: "Warung biasanya posting kantong surplus 30–60 menit sebelum tutup. Set notifikasi agar tidak kehabisan." },
  { title: "Aktifkan Lokasi untuk Filter Terdekat", desc: "Gunakan filter 'Terdekat' di DishCon agar Anda tidak perlu jalan jauh hanya untuk mengambil pesanan." },
  { title: "Manfaatkan Promo Bundling", desc: "Beberapa mitra menawarkan bundling 2–3 kantong dengan harga lebih miring. Cocok dibagi bareng teman kos." },
  { title: "Pesan di Malam Hari untuk Besok Pagi", desc: "Beberapa mitra menjual sarapan sebagai kantong surplus. Pesan malam sebelumnya untuk memastikan Anda dapat." },
  { title: "Gabung Fitur Berbagi Bahan Makanan", desc: "Punya stok telur atau beras yang kebanyakan? Bagikan ke teman kos dan dapatkan kredit DishCon." },
  { title: "Simpan Mitra Favorit", desc: "Tandai warung langganan Anda agar setiap kali mereka posting kantong surplus baru, Anda langsung dapat notifikasi." },
  { title: "Bayar Tepat Waktu, Hindari Pembatalan", desc: "Rating pengguna yang tinggi memberi Anda akses prioritas ke kantong surplus yang terbatas. Jaga reputasimu!" },
];

export default function HematSurplusPage() {
  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-brand-800 to-brand-600 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">Mahasiswa</span>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">7 Cara Mahasiswa Berhemat di Akhir Bulan dengan Kantong Surplus</h1>
          <p className="mt-4 text-white/70 text-sm">20 September 2026 &middot; Tim DishCon</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Beranda</Link>
          <span>/</span>
          <Link href="/inspirasi" className="hover:text-brand-600">Inspirasi</Link>
          <span>/</span>
          <span className="text-brand-700 font-semibold">Hemat Surplus</span>
        </nav>
      </div>

      <article className="mx-auto max-w-3xl px-6 pb-24 pt-8">
        <div className="relative h-72 rounded-3xl overflow-hidden mb-10 shadow-lg">
          <Image src="/assets/visual-poster-kampanye-01.png" alt="Hemat Surplus" fill className="object-cover" />
        </div>

        <p className="text-lg text-stone-700 leading-relaxed">
          Tanggal 25 dan kiriman orang tua belum datang. Situasi ini sangat familiar bagi sebagian besar mahasiswa kos di Indonesia. Tapi tahukah kamu? Di sekitar kampusmu, ada puluhan warung dan UMKM yang setiap harinya menyisakan makanan layak konsumsi — dan mereka menjualnya dengan harga diskon hingga <strong className="text-brand-700">50–70%</strong> melalui DishCon.
        </p>

        <p className="text-stone-700 leading-relaxed mt-5">
          Berikut adalah 7 strategi yang bisa langsung kamu terapkan untuk memaksimalkan manfaat kantong surplus DishCon dan tetap makan enak tanpa menguras kantong.
        </p>

        <div className="mt-10 space-y-5">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-4 p-5 rounded-2xl border border-stone-100 hover:border-brand-200 hover:bg-brand-50/40 transition">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center font-black text-sm">
                {i + 1}
              </div>
              <div>
                <h3 className="font-black text-brand-900">{tip.title}</h3>
                <p className="text-stone-500 text-sm mt-1 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-brand-50 rounded-3xl p-8 border border-brand-100">
          <div className="flex items-start gap-3">
            <FiCheckCircle className="text-brand-600 text-2xl flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-black text-brand-900 text-lg">Mulai dari Satu Pesanan</h3>
              <p className="text-stone-600 text-sm mt-2 leading-relaxed">
                Mahasiswa yang aktif menggunakan kantong surplus DishCon rata-rata menghemat <strong>Rp 150.000 – Rp 300.000 per bulan</strong>. Cukup untuk tambah kuota atau traktir diri sendiri sesekali!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 items-center justify-between border-t border-stone-200 pt-8">
          <Link href="/inspirasi" className="flex items-center gap-2 text-brand-600 font-bold hover:text-brand-800 transition">
            <FiArrowLeft /> Kembali ke Inspirasi
          </Link>
          <Link href="/register" className="rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold px-7 py-3 transition shadow-lg shadow-brand-600/25">
            Daftar & Mulai Hemat
          </Link>
        </div>
      </article>
    </PageLayout>
  );
}
