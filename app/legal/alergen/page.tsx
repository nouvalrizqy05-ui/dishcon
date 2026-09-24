import Link from "next/link";
import { PageLayout } from "@/components/landing/page-layout";
import { FiAlertTriangle } from "react-icons/fi";

const allergens = [
  { emoji: "🌾", name: "Gluten", sources: "Gandum, barley, rye, oat" },
  { emoji: "🦐", name: "Krustasea", sources: "Udang, kepiting, lobster" },
  { emoji: "🥚", name: "Telur", sources: "Telur ayam, telur bebek" },
  { emoji: "🐟", name: "Ikan", sources: "Semua jenis ikan" },
  { emoji: "🥜", name: "Kacang Tanah", sources: "Selai kacang, minyak kacang" },
  { emoji: "🫘", name: "Kedelai", sources: "Tahu, tempe, kecap, edamame" },
  { emoji: "🥛", name: "Susu", sources: "Susu sapi, keju, mentega, yogurt" },
  { emoji: "🌰", name: "Kacang Pohon", sources: "Almond, kenari, mete, hazel" },
  { emoji: "🌿", name: "Seledri", sources: "Batang, daun, biji seledri" },
  { emoji: "🌱", name: "Mustard", sources: "Biji, daun, minyak mustard" },
  { emoji: "⚪", name: "Wijen", sources: "Biji wijen, minyak wijen, tahini" },
  { emoji: "🍷", name: "Sulfur Dioksida", sources: "Buah kering, anggur, produk awetan" },
  { emoji: "🌸", name: "Lupin", sources: "Tepung lupin, biji lupin" },
  { emoji: "🦑", name: "Moluska", sources: "Cumi, kerang, siput laut" },
];

export default function AlergenPage() {
  return (
    <PageLayout>
      <section className="bg-brand-50 border-b border-brand-100 py-14 px-6 text-center">
        <p className="text-brand-600 font-bold text-sm uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-4xl md:text-5xl font-black text-brand-900">Informasi Alergen</h1>
        <p className="mt-3 text-stone-500">Panduan alergen untuk pengguna dan mitra DishCon</p>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Beranda</Link>
          <span>/</span>
          <span className="hover:text-brand-600 cursor-pointer">Legal</span>
          <span>/</span>
          <span className="text-brand-700 font-semibold">Informasi Alergen</span>
        </nav>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 pb-24">

        {/* Disclaimer */}
        <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-12">
          <FiAlertTriangle className="text-amber-600 text-2xl flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-black text-amber-800">Perhatian Medis Penting</h3>
            <p className="text-amber-700 text-sm mt-2 leading-relaxed">
              Informasi alergen di platform DishCon bersumber dari deklarasi mitra dan analisis AI, bukan dari uji laboratorium. Jika Anda memiliki alergi makanan yang serius atau kondisi medis terkait, selalu konfirmasi langsung dengan mitra sebelum memesan. DishCon tidak bertanggung jawab atas reaksi alergi yang terjadi akibat informasi yang tidak lengkap atau tidak akurat dari mitra.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-black text-brand-900 mb-6">14 Alergen Utama yang Kami Pantau</h2>
        <p className="text-stone-600 leading-relaxed mb-8">Berdasarkan regulasi keamanan pangan internasional, berikut adalah 14 alergen utama yang wajib dideklarasikan oleh mitra DishCon jika terdapat dalam produk makanan mereka.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-14">
          {allergens.map((a) => (
            <div key={a.name} className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm hover:border-brand-200 transition">
              <div className="text-3xl mb-3">{a.emoji}</div>
              <h3 className="font-black text-brand-900">{a.name}</h3>
              <p className="text-stone-400 text-xs mt-1">{a.sources}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-black text-brand-900 mb-4">Panduan untuk Mitra</h2>
          <p className="text-stone-600 leading-relaxed mb-4">Saat memposting kantong surplus, mitra diwajibkan untuk mencantumkan alergen yang terkandung dalam makanan. Sistem AI DishCon akan mencoba mengidentifikasi alergen potensial berdasarkan nama dan deskripsi makanan, namun ini bukan pengganti deklarasi manual yang akurat dari Anda sebagai mitra.</p>
          <p className="text-stone-600 leading-relaxed">Mitra yang tidak atau salah mendeklarasikan informasi alergen berisiko mendapatkan sanksi sesuai Syarat & Ketentuan DishCon, termasuk penangguhan akun dan tanggung jawab hukum atas kerugian yang ditimbulkan.</p>
        </div>

        <hr className="border-stone-200 my-8" />
        <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
          <p className="text-xs text-stone-400">Pertanyaan mengenai alergen: <a href="mailto:dishcon0@gmail.com" className="text-brand-600 underline">dishcon0@gmail.com</a>. Jika Anda mengalami reaksi alergi akibat produk dari platform kami, segera cari bantuan medis dan laporkan melalui fitur Pengaduan di aplikasi.</p>
        </div>
      </div>
    </PageLayout>
  );
}
