import Link from "next/link";
import { PageLayout } from "@/components/landing/page-layout";

const sections = [
  { title: "1. Pemberian Lisensi", content: "DishCon memberikan Anda lisensi terbatas, non-eksklusif, tidak dapat dipindahtangankan, dan dapat dicabut untuk mengakses dan menggunakan platform DishCon semata-mata untuk keperluan pribadi dan non-komersial sesuai dengan Perjanjian ini. Lisensi ini tidak mencakup hak untuk mengunduh, mendistribusikan ulang, atau memodifikasi konten platform." },
  { title: "2. Pembatasan", content: "Anda dilarang untuk: merekayasa balik (reverse engineer) atau mendekompilasi kode sumber platform; menggunakan bot, scraper, atau alat otomatis untuk mengakses platform; membuat atau mendistribusikan salinan platform; menggunakan platform untuk tujuan ilegal atau tidak sah; mengganggu keamanan atau integritas sistem platform; atau membuat karya turunan (derivative works) berdasarkan platform tanpa izin tertulis dari DishCon." },
  { title: "3. Hak Kekayaan Intelektual", content: "Seluruh konten platform DishCon, termasuk namun tidak terbatas pada logo, desain antarmuka, kode sumber, algoritma AI, dan konten editorial, adalah milik eksklusif PT DishCon Teknologi Indonesia dan dilindungi oleh hukum kekayaan intelektual Indonesia yang berlaku. Tidak ada bagian dari platform yang dapat direproduksi tanpa izin tertulis." },
  { title: "4. Konten Pengguna", content: "Dengan memposting konten di platform DishCon (termasuk foto makanan, ulasan, dan deskripsi produk), Anda memberikan DishCon lisensi tidak eksklusif, bebas royalti, dan berlaku di seluruh dunia untuk menggunakan, mereproduksi, dan mendistribusikan konten tersebut dalam konteks layanan DishCon. Anda menjamin bahwa konten yang Anda posting tidak melanggar hak pihak ketiga mana pun." },
  { title: "5. Pemutusan", content: "DishCon berhak untuk menangguhkan atau mengakhiri akses Anda ke platform kapan saja dan atas kebijaksanaan kami sendiri, khususnya jika Anda melanggar ketentuan perjanjian ini. Pemutusan oleh DishCon akan berlaku segera dan tanpa kewajiban untuk memberikan kompensasi, kecuali untuk saldo yang belum dicairkan oleh Mitra." },
  { title: "6. Disclaimer & Batasan Tanggung Jawab", content: "Platform DishCon disediakan 'sebagaimana adanya' (as-is) tanpa jaminan apapun, baik tersurat maupun tersirat. DishCon tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan platform. Total tanggung jawab DishCon dalam satu kejadian tidak akan melebihi nilai transaksi yang bersangkutan." },
];

export default function LisensiPage() {
  return (
    <PageLayout>
      <section className="bg-brand-50 border-b border-brand-100 py-14 px-6 text-center">
        <p className="text-brand-600 font-bold text-sm uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-4xl md:text-5xl font-black text-brand-900">Perjanjian Lisensi Pengguna</h1>
        <p className="mt-3 text-stone-500">Berlaku sejak 1 Oktober 2026 — End User License Agreement (EULA)</p>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Beranda</Link>
          <span>/</span>
          <span className="hover:text-brand-600 cursor-pointer">Legal</span>
          <span>/</span>
          <span className="text-brand-700 font-semibold">Perjanjian Lisensi</span>
        </nav>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12 pb-24">
        <p className="text-stone-600 leading-relaxed mb-10">Perjanjian Lisensi Pengguna Akhir ini mengatur hak Anda untuk menggunakan platform DishCon. Dengan mengakses atau menggunakan platform, Anda menyetujui perjanjian ini secara penuh.</p>
        {sections.map((s, i) => (
          <div key={i}>
            <h2 className="text-xl font-black text-brand-900 mb-4">{s.title}</h2>
            <p className="text-stone-600 leading-relaxed">{s.content}</p>
            {i < sections.length - 1 && <hr className="border-stone-200 my-8" />}
          </div>
        ))}
        <div className="mt-10 bg-stone-50 rounded-2xl p-5 border border-stone-200">
          <p className="text-xs text-stone-400">Terakhir diperbarui: 1 Oktober 2026. Pertanyaan: <a href="mailto:dishcon0@gmail.com" className="text-brand-600 underline">dishcon0@gmail.com</a>.</p>
        </div>
      </div>
    </PageLayout>
  );
}
