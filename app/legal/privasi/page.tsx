import Link from "next/link";
import { PageLayout } from "@/components/landing/page-layout";

const sections = [
  { title: "1. Data yang Kami Kumpulkan", content: "Kami mengumpulkan data yang Anda berikan secara langsung saat mendaftar (nama, email, nomor telepon), data lokasi untuk fitur peta hiperlokal (hanya saat aplikasi aktif), data transaksi (riwayat pemesanan dan pembayaran), serta data penggunaan (halaman yang dikunjungi, fitur yang digunakan) untuk meningkatkan layanan." },
  { title: "2. Cara Kami Menggunakan Data", content: "Data Anda digunakan untuk memproses transaksi dan mengirim notifikasi pesanan, menampilkan kantong surplus yang relevan berdasarkan lokasi Anda, meningkatkan keamanan dan mendeteksi kecurangan, mengirimkan pembaruan layanan dan informasi promosi (jika Anda memberikan persetujuan), serta memenuhi kewajiban hukum yang berlaku." },
  { title: "3. Berbagi Data dengan Pihak Ketiga", content: "Kami tidak menjual data pribadi Anda kepada pihak ketiga. Kami hanya berbagi data yang diperlukan dengan penyedia layanan terpercaya (seperti layanan cloud hosting dan analitik) yang terikat perjanjian kerahasiaan. Dalam hal merger, akuisisi, atau penjualan aset, data Anda mungkin dialihkan dengan pemberitahuan kepada Anda terlebih dahulu." },
  { title: "4. Keamanan Data", content: "Kami menerapkan standar keamanan industri termasuk enkripsi data saat transit (TLS 1.3) dan saat disimpan (AES-256), autentikasi dua faktor untuk akun admin, audit keamanan berkala oleh pihak ketiga independen, dan pembatasan akses data berdasarkan prinsip least privilege." },
  { title: "5. Hak Anda sebagai Pengguna", content: "Anda memiliki hak untuk mengakses data pribadi yang kami simpan tentang Anda, meminta perbaikan data yang tidak akurat, meminta penghapusan akun dan data pribadi Anda, menarik persetujuan pemasaran kapan saja, dan mengajukan keberatan atas pemrosesan data tertentu. Untuk menggunakan hak-hak ini, hubungi dishcon0@gmail.com." },
  { title: "6. Retensi Data", content: "Kami menyimpan data akun selama akun Anda aktif. Data transaksi disimpan selama 5 tahun sesuai kewajiban perpajakan dan hukum. Data lokasi tidak disimpan secara permanen dan hanya digunakan secara real-time. Setelah akun dihapus, data pribadi Anda akan dianonimkan atau dihapus dalam 30 hari." },
  { title: "7. Data Protection Officer (DPO)", content: "Jika Anda memiliki pertanyaan atau kekhawatiran mengenai praktik privasi kami, silakan hubungi Data Protection Officer kami di dishcon0@gmail.com atau melalui surat ke Jl. Sekaran No. 1, Gunungpati, Semarang 50229, Jawa Tengah." },
];

export default function PrivasiPage() {
  return (
    <PageLayout>
      <section className="bg-brand-50 border-b border-brand-100 py-14 px-6 text-center">
        <p className="text-brand-600 font-bold text-sm uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-4xl md:text-5xl font-black text-brand-900">Kebijakan Privasi</h1>
        <p className="mt-3 text-stone-500">Berlaku sejak 1 Oktober 2026</p>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Beranda</Link>
          <span>/</span>
          <span className="hover:text-brand-600 cursor-pointer">Legal</span>
          <span>/</span>
          <span className="text-brand-700 font-semibold">Kebijakan Privasi</span>
        </nav>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12 pb-24">
        <p className="text-stone-600 leading-relaxed mb-10">Privasi Anda sangat penting bagi kami. Kebijakan ini menjelaskan data apa yang kami kumpulkan, bagaimana kami menggunakannya, dan hak-hak Anda sebagai pengguna platform DishCon.</p>
        {sections.map((s, i) => (
          <div key={i}>
            <h2 className="text-xl font-black text-brand-900 mb-4">{s.title}</h2>
            <p className="text-stone-600 leading-relaxed">{s.content}</p>
            {i < sections.length - 1 && <hr className="border-stone-200 my-8" />}
          </div>
        ))}
        <div className="mt-10 bg-stone-50 rounded-2xl p-5 border border-stone-200">
          <p className="text-xs text-stone-400">Terakhir diperbarui: 1 Oktober 2026. Pertanyaan tentang privasi: <a href="mailto:dishcon0@gmail.com" className="text-brand-600 underline">dishcon0@gmail.com</a>.</p>
        </div>
      </div>
    </PageLayout>
  );
}
