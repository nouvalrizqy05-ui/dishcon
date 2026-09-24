import Link from "next/link";
import { PageLayout } from "@/components/landing/page-layout";

const faqs = {
  "Untuk Mahasiswa": [
    { q: "Bagaimana cara memesan kantong surplus di DishCon?", a: "Daftar atau masuk ke akun mahasiswa, pilih kantong surplus terdekat dari peta atau daftar, klik 'Pesan Sekarang', dan konfirmasi. Anda akan menerima tiket digital dengan kode pengambilan 6 digit secara instan." },
    { q: "Apakah makanan di DishCon benar-benar aman dikonsumsi?", a: "Ya. Setiap mitra wajib melewati verifikasi manual oleh Admin DishCon. Selain itu, AI kami menganalisis estimasi kedaluwarsa setiap posting. Jika makanan tidak sesuai, Anda bisa mengajukan pengaduan dan mendapat refund penuh." },
    { q: "Berapa batas waktu untuk mengambil pesanan?", a: "Setiap kantong surplus memiliki batas waktu pengambilan yang ditetapkan oleh mitra (biasanya 30–90 menit). Jika Anda tidak mengambil dalam waktu tersebut, pesanan akan dibatalkan otomatis." },
    { q: "Bisakah saya membatalkan pesanan?", a: "Pembatalan bisa dilakukan maksimal 10 menit setelah pemesanan tanpa dikenai penalti. Pembatalan setelah itu akan mempengaruhi rating Anda sebagai pembeli." },
    { q: "Metode pembayaran apa yang tersedia?", a: "Saat ini DishCon mendukung pembayaran tunai saat pengambilan. Integrasi dengan dompet digital (GoPay, OVO, DANA) sedang dalam pengembangan." },
  ],
  "Untuk Mitra UMKM": [
    { q: "Bagaimana cara mendaftar sebagai mitra DishCon?", a: "Klik 'Daftar Mitra UMKM' di halaman utama, isi formulir dengan data usaha Anda, dan unggah foto warung serta menu. Tim Admin kami akan melakukan verifikasi dalam 1–2 hari kerja." },
    { q: "Berapa komisi yang dikenakan DishCon?", a: "DishCon mengenakan komisi sebesar 10% dari setiap transaksi yang berhasil diselesaikan. Tidak ada biaya pendaftaran, biaya bulanan, atau biaya tersembunyi lainnya." },
    { q: "Bagaimana cara posting kantong surplus?", a: "Masuk ke dasbor mitra, klik 'Posting Kantong Surplus', unggah foto makanan, isi nama, deskripsi, harga diskon, jumlah porsi, dan batas waktu pengambilan. AI akan menganalisis nutrisi secara otomatis." },
    { q: "Apa yang terjadi jika makanan habis terjual secara offline sebelum pesanan diambil?", a: "Anda bisa menandai stok sebagai 'Habis' dari dasbor kapan saja. Pesanan yang sudah masuk akan otomatis direfund ke pembeli." },
    { q: "Kapan saya menerima pembayaran dari DishCon?", a: "Pencairan komisi dilakukan setiap minggu ke rekening yang Anda daftarkan. Minimum saldo untuk pencairan adalah Rp 50.000." },
  ],
  "Umum": [
    { q: "Apa itu DishCon?", a: "DishCon adalah platform food-rescue hiperlokal yang menghubungkan UMKM mikro di sekitar kampus (warmindo, angkringan, katering) dengan mahasiswa kos. Makanan sisa yang layak konsumsi dijual sebagai 'kantong surplus' dengan harga diskon." },
    { q: "Di kota mana DishCon tersedia?", a: "Saat ini DishCon beroperasi di area sekitar kampus Universitas Negeri Semarang (Unnes) dan sekitarnya. Ekspansi ke kampus-kampus lain di Semarang dan Jawa Tengah sedang direncanakan." },
    { q: "Apakah data pribadi saya aman?", a: "Kami menggunakan enkripsi end-to-end untuk semua data transaksi dan hanya mengumpulkan data yang benar-benar diperlukan. Baca Kebijakan Privasi kami untuk detail lengkapnya." },
    { q: "Bagaimana cara melaporkan masalah atau mitra yang bermasalah?", a: "Gunakan fitur 'Pengaduan' di menu aplikasi. Tim Admin akan menindaklanjuti laporan Anda dalam 1x24 jam." },
    { q: "Apakah DishCon tersedia sebagai aplikasi mobile?", a: "Saat ini DishCon tersedia sebagai Progressive Web App (PWA) yang bisa diakses melalui browser mobile. Aplikasi native iOS dan Android sedang dalam pengembangan." },
  ],
};

export default function FAQPage() {
  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-brand-800 to-brand-600 py-24 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">Pertanyaan Umum</h1>
          <p className="mt-5 text-lg text-white/80 max-w-xl mx-auto">Semua jawaban yang Anda butuhkan, dikumpulkan di satu tempat.</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Beranda</Link>
          <span>/</span>
          <span className="text-brand-700 font-semibold">FAQ</span>
        </nav>
      </div>

      <section className="py-16 pb-24">
        <div className="mx-auto max-w-4xl px-6">
          {Object.entries(faqs).map(([category, items]) => (
            <div key={category} className="mb-14">
              <h2 className="text-2xl font-black text-brand-900 mb-6 pb-3 border-b-2 border-brand-100">{category}</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <details key={item.q} className="group border border-stone-200 rounded-2xl overflow-hidden hover:border-brand-300 transition">
                    <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer font-bold text-brand-900 list-none select-none">
                      {item.q}
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-lg font-black group-open:rotate-45 transition-transform duration-200">+</span>
                    </summary>
                    <div className="px-6 pb-5 pt-1 text-stone-600 text-sm leading-relaxed border-t border-stone-100">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-brand-50 rounded-3xl p-8 border border-brand-100 text-center mt-8">
            <h3 className="text-xl font-black text-brand-900">Masih ada pertanyaan?</h3>
            <p className="text-stone-500 mt-2 text-sm">Tim kami siap membantu Anda secara langsung.</p>
            <Link href="/hubungi" className="mt-5 inline-block rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold px-7 py-3 transition shadow-lg shadow-brand-600/25">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
