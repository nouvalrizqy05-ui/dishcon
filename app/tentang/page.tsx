import Link from "next/link";
import { PageLayout } from "@/components/landing/page-layout";
import { FiCheckCircle, FiShield, FiZap, FiMapPin } from "react-icons/fi";
import { MdStorefront, MdSchool } from "react-icons/md";

const impacts = [
  { num: "1.200 Kg", label: "Makanan Terselamatkan", icon: "🥘" },
  { num: "500+", label: "Mahasiswa Aktif", icon: "🎓" },
  { num: "80+", label: "Mitra UMKM Bergabung", icon: "🏪" },
  { num: "500 Kg", label: "CO₂ Emisi Dicegah", icon: "🌿" },
];

const steps = [
  { n: "01", title: "Mitra posting kantong surplus", desc: "UMKM mikro memfoto sisa dagangan, set harga diskon, dan posting melalui dasbor mitra. AI menganalisis nutrisi dan estimasi kedaluwarsa otomatis." },
  { n: "02", title: "Tampil di katalog hiperlokal", desc: "Kantong surplus langsung muncul di peta dan daftar mahasiswa dalam radius 1 km. Stok terkunci otomatis saat dipesan." },
  { n: "03", title: "Mahasiswa memesan instan", desc: "Tanpa chat, tanpa antrian — mahasiswa klik pesan, terima tiket digital dengan kode 6 digit, dan berangkat ke warung." },
  { n: "04", title: "Serah terima & selesai", desc: "Mitra verifikasi kode. Transaksi selesai. Komisi 10% tercatat otomatis. Makanan terselamatkan, semua senang." },
];

const values = [
  { icon: FiZap, title: "Instan & Tanpa Hambatan", desc: "Tidak ada approval berlapis. Pesan, ambil, selesai dalam 15 menit." },
  { icon: FiShield, title: "Aman & Terpercaya", desc: "Setiap mitra diverifikasi. Setiap makanan dicek AI. Setiap transaksi terlacak." },
  { icon: FiMapPin, title: "Hiperlokal & Komunitas", desc: "Menguatkan ekosistem UMKM mikro di sekitar kampus, bukan korporasi besar." },
  { icon: FiCheckCircle, title: "Berdampak Nyata", desc: "Setiap transaksi berkontribusi mengurangi food waste dan emisi karbon." },
];

export default function TentangPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-800 to-brand-600 py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 0)', backgroundSize: '40px 40px'}} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">Tentang DishCon</h1>
          <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Platform food-rescue hiperlokal pertama yang menghubungkan UMKM mikro sekitar kampus dengan mahasiswa kos — mengubah sisa menjadi solusi.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Beranda</Link>
          <span>/</span>
          <span className="text-brand-700 font-semibold">Tentang</span>
        </nav>
      </div>

      {/* Misi & Cerita */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brand-600 font-bold text-sm uppercase tracking-widest">Mengapa Kami Ada</span>
              <h2 className="text-4xl md:text-5xl font-black text-brand-900 mt-3 leading-tight">Satu masalah, dua solusi sekaligus.</h2>
              <p className="mt-6 text-stone-600 leading-relaxed">
                DishCon lahir dari satu pengamatan sederhana: setiap malam, warmindo dan angkringan di sekitar kampus membuang makanan sisa yang masih layak — sementara di gedung kos sebelahnya, mahasiswa tidur lapar karena kiriman belum datang.
              </p>
              <p className="mt-4 text-stone-600 leading-relaxed">
                Kami membangun DishCon untuk menjembatani dua realitas ini. Dengan teknologi sederhana namun tepat sasaran, kami menciptakan pasar mikro yang menguntungkan semua pihak: UMKM mendapat pemasukan tambahan, mahasiswa mendapat makanan murah, dan lingkungan mendapat lebih sedikit sampah.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {impacts.map((item) => (
                <div key={item.label} className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm text-center">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <div className="text-3xl font-black text-brand-700">{item.num}</div>
                  <div className="text-xs text-stone-500 mt-1 font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cara Kerja */}
      <section className="py-20 bg-stone-50 border-y border-stone-100">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl md:text-4xl font-black text-brand-900 text-center mb-14">Bagaimana DishCon Bekerja</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-sm">{s.n}</div>
                <div>
                  <h3 className="font-black text-brand-900 text-lg">{s.title}</h3>
                  <p className="text-stone-500 text-sm mt-2 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nilai */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl md:text-4xl font-black text-brand-900 text-center mb-14">Nilai-Nilai Kami</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="text-xl" />
                </div>
                <h3 className="font-black text-brand-900">{v.title}</h3>
                <p className="text-stone-500 text-sm mt-2 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jaminan Keamanan */}
      <section className="py-16 bg-brand-900 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black">Jaminan Keamanan Pangan Kami</h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">Kami tidak hanya menjual makanan — kami menjual kepercayaan.</p>
          <div className="mt-10 grid sm:grid-cols-3 gap-6 text-left">
            {[
              { title: "Verifikasi Manual Mitra", desc: "Setiap mitra UMKM harus melewati proses verifikasi admin sebelum bisa aktif posting." },
              { title: "AI Expiry & Nutrition Check", desc: "Setiap listing dianalisis AI untuk estimasi kedaluwarsa dan kandungan nutrisi." },
              { title: "Refund Policy", desc: "Pengaduan valid diproses dalam 24 jam dengan jaminan refund penuh." },
            ].map((g) => (
              <div key={g.title} className="bg-white/10 rounded-2xl p-5">
                <FiCheckCircle className="text-brand-300 text-xl mb-3" />
                <h3 className="font-black text-white">{g.title}</h3>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
