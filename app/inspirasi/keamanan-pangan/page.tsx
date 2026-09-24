import Link from "next/link";
import Image from "next/image";
import { PageLayout } from "@/components/landing/page-layout";
import { FiArrowLeft, FiShield, FiZap, FiMapPin } from "react-icons/fi";

const pillars = [
  { icon: FiZap, title: "AI Nutrition & Expiry Check", color: "bg-emerald-100 text-emerald-700", desc: "Setiap posting kantong surplus dianalisis oleh AI untuk memperkirakan kandungan gizi dan risiko kedaluwarsa berdasarkan jenis makanan, waktu produksi, dan metode penyimpanan yang diinput mitra." },
  { icon: FiShield, title: "Verifikasi Mitra Berlapis", color: "bg-brand-100 text-brand-700", desc: "Mitra UMKM hanya bisa aktif posting setelah diverifikasi manual oleh Admin DishCon. Kami mengecek kelayakan dapur, foto makanan, dan rekam jejak pelaporan untuk memastikan standar higienitas terpenuhi." },
  { icon: FiMapPin, title: "Location-Based Matching & Traceability", color: "bg-amber-100 text-amber-700", desc: "Setiap transaksi tercatat lengkap — dari mitra mana makanan berasal, jam posting, hingga kode pengambilan yang unik. Jika ada masalah, Admin bisa melacak dan menindak dalam hitungan menit." },
];

export default function KeamananPanganPage() {
  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-brand-800 to-brand-600 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">Keamanan Pangan</span>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">Alur Distribusi Aman dan Cek Gizi Otomatis Berbasis AI</h1>
          <p className="mt-4 text-white/70 text-sm">18 September 2026 &middot; Tim DishCon</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Beranda</Link>
          <span>/</span>
          <Link href="/inspirasi" className="hover:text-brand-600">Inspirasi</Link>
          <span>/</span>
          <span className="text-brand-700 font-semibold">Keamanan Pangan</span>
        </nav>
      </div>

      <article className="mx-auto max-w-3xl px-6 pb-24 pt-8">
        <div className="relative h-72 rounded-3xl overflow-hidden mb-10 shadow-lg">
          <Image src="/assets/visual-alur-distribusi.png" alt="Alur Distribusi" fill className="object-cover" />
        </div>

        <p className="text-lg text-stone-700 leading-relaxed">
          Pertanyaan paling sering kami terima dari pengguna baru DishCon adalah: <em>&ldquo;Apakah makanan surplus ini benar-benar aman dimakan?&rdquo;</em> Pertanyaan yang sangat wajar dan penting. Jawaban kami: <strong className="text-brand-800">ya, dan berikut adalah bagaimana kami memastikannya.</strong>
        </p>

        <p className="text-stone-700 leading-relaxed mt-5">
          DishCon bukan sekadar marketplace biasa. Kami membangun sistem berlapis yang menggabungkan kecerdasan buatan (AI), verifikasi manual, dan kebijakan yang ketat untuk memastikan setiap kantong surplus yang beredar di platform kami adalah makanan yang layak dan aman dikonsumsi.
        </p>

        <h2 className="text-2xl font-black text-brand-900 mt-10 mb-6">3 Pilar Keamanan Pangan DishCon</h2>

        <div className="space-y-5">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="flex gap-5 p-6 rounded-2xl border border-stone-100 shadow-sm">
              <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${pillar.color} flex items-center justify-center`}>
                <pillar.icon className="text-xl" />
              </div>
              <div>
                <h3 className="font-black text-brand-900 text-lg">{pillar.title}</h3>
                <p className="text-stone-500 text-sm mt-2 leading-relaxed">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-black text-brand-900 mt-10 mb-4">Apa yang Terjadi Jika Ada Masalah?</h2>
        <p className="text-stone-700 leading-relaxed">
          Jika Anda menerima makanan yang tidak sesuai ekspektasi, DishCon menyediakan mekanisme pengaduan yang mudah. Anda cukup mengajukan laporan melalui menu Pengaduan di aplikasi dalam waktu 2 jam setelah pengambilan. Tim Admin kami akan merespons dalam 1x24 jam, dan jika laporan terbukti valid, kami akan memberikan refund penuh sekaligus menindak mitra yang bersangkutan.
        </p>

        <p className="text-stone-700 leading-relaxed mt-5">
          Kepercayaan Anda adalah fondasi platform ini. Tanpa kepercayaan, tidak ada transaksi yang terjadi, dan tidak ada makanan yang terselamatkan. Itulah mengapa keamanan pangan bukan hanya fitur — melainkan misi utama kami.
        </p>

        <div className="mt-12 flex flex-wrap gap-4 items-center justify-between border-t border-stone-200 pt-8">
          <Link href="/inspirasi" className="flex items-center gap-2 text-brand-600 font-bold hover:text-brand-800 transition">
            <FiArrowLeft /> Kembali ke Inspirasi
          </Link>
          <Link href="/register" className="rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold px-7 py-3 transition shadow-lg shadow-brand-600/25">
            Mulai Berbelanja Aman
          </Link>
        </div>
      </article>
    </PageLayout>
  );
}
