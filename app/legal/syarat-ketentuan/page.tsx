import Link from "next/link";
import { PageLayout } from "@/components/landing/page-layout";

const sections = [
  { title: "1. Definisi", content: "Dalam Syarat dan Ketentuan ini, 'DishCon' merujuk pada platform marketplace food-rescue yang dioperasikan oleh PT DishCon Teknologi Indonesia. 'Pengguna' merujuk pada setiap individu yang mendaftarkan diri dan menggunakan layanan DishCon, baik sebagai Mahasiswa maupun Mitra UMKM. 'Kantong Surplus' adalah produk makanan layak konsumsi yang dijual oleh Mitra melalui platform DishCon dengan harga diskon." },
  { title: "2. Ketentuan Akun", content: "Untuk menggunakan layanan DishCon, Anda wajib mendaftarkan diri dengan data yang akurat dan terkini. Setiap akun bersifat personal dan tidak dapat dipindahtangankan. Anda bertanggung jawab penuh atas seluruh aktivitas yang terjadi di bawah akun Anda. DishCon berhak menangguhkan atau menghapus akun yang terbukti memberikan informasi palsu atau melanggar ketentuan ini." },
  { title: "3. Ketentuan Transaksi", content: "Setiap pemesanan Kantong Surplus yang dikonfirmasi dianggap sebagai transaksi yang mengikat. Pembeli wajib mengambil pesanan dalam batas waktu yang ditentukan Mitra. DishCon mengenakan komisi sebesar 10% dari nilai transaksi kepada Mitra untuk setiap transaksi yang berhasil diselesaikan. DishCon berperan sebagai perantara transaksi dan bukan pihak dalam perjanjian jual-beli antara Mahasiswa dan Mitra." },
  { title: "4. Tanggung Jawab Pengguna (Mahasiswa)", content: "Mahasiswa wajib mengambil pesanan tepat waktu dan menjaga rating pengguna dengan menghindari pembatalan berulang. Mahasiswa yang menyalahgunakan fitur pengaduan untuk mendapatkan refund tidak semestinya dapat dikenai sanksi berupa penangguhan akun." },
  { title: "5. Tanggung Jawab Mitra UMKM", content: "Mitra bertanggung jawab penuh atas kualitas, keamanan, dan kelayakan konsumsi makanan yang diposting. Mitra wajib memastikan semua informasi produk (nama, deskripsi, berat estimasi) adalah akurat. Mitra dilarang memposting makanan yang sudah melewati batas waktu aman konsumsi atau mengandung bahan berbahaya." },
  { title: "6. Pembatasan Layanan", content: "DishCon saat ini hanya beroperasi di wilayah sekitar kampus Universitas Negeri Semarang (Unnes) dan sekitarnya. DishCon berhak menambah atau mengurangi cakupan wilayah layanan sewaktu-waktu tanpa pemberitahuan terlebih dahulu. DishCon tidak bertanggung jawab atas gangguan layanan yang disebabkan oleh faktor di luar kendali kami." },
  { title: "7. Penyelesaian Sengketa", content: "Setiap sengketa antara Mahasiswa dan Mitra diselesaikan melalui mekanisme pengaduan DishCon terlebih dahulu. Jika tidak terselesaikan dalam 7 hari kerja, para pihak dapat membawa sengketa ke Badan Arbitrase Nasional Indonesia (BANI) di Semarang. DishCon berhak membuat keputusan final dalam sengketa yang melibatkan platform." },
  { title: "8. Hukum yang Berlaku", content: "Syarat dan Ketentuan ini diatur dan ditafsirkan berdasarkan hukum Republik Indonesia. Setiap perselisihan yang timbul dari atau berkaitan dengan Syarat dan Ketentuan ini tunduk pada yurisdiksi eksklusif pengadilan negeri yang berwenang di Semarang, Jawa Tengah." },
];

export default function SyaratKetentuanPage() {
  return (
    <PageLayout>
      <section className="bg-brand-50 border-b border-brand-100 py-14 px-6 text-center">
        <p className="text-brand-600 font-bold text-sm uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-4xl md:text-5xl font-black text-brand-900">Syarat & Ketentuan</h1>
        <p className="mt-3 text-stone-500">Berlaku sejak 1 Oktober 2026</p>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Beranda</Link>
          <span>/</span>
          <Link href="/legal/privasi" className="hover:text-brand-600">Legal</Link>
          <span>/</span>
          <span className="text-brand-700 font-semibold">Syarat & Ketentuan</span>
        </nav>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12 pb-24">
        <p className="text-stone-600 leading-relaxed mb-10">Dengan menggunakan platform DishCon, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan yang tercantum di bawah ini. Harap baca dengan seksama sebelum menggunakan layanan kami.</p>
        {sections.map((s, i) => (
          <div key={i}>
            <h2 className="text-xl font-black text-brand-900 mb-4">{s.title}</h2>
            <p className="text-stone-600 leading-relaxed">{s.content}</p>
            {i < sections.length - 1 && <hr className="border-stone-200 my-8" />}
          </div>
        ))}
        <div className="mt-10 bg-stone-50 rounded-2xl p-5 border border-stone-200">
          <p className="text-xs text-stone-400">Terakhir diperbarui: 1 Oktober 2026. Pertanyaan mengenai ketentuan ini dapat dikirimkan ke <a href="mailto:dishcon0@gmail.com" className="text-brand-600 underline">dishcon0@gmail.com</a>.</p>
        </div>
      </div>
    </PageLayout>
  );
}
