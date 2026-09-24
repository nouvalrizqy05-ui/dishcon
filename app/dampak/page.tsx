import Link from "next/link";
import { PageLayout } from "@/components/landing/page-layout";
import { FiPackage, FiUsers, FiStar, FiTrendingDown } from "react-icons/fi";

const metrics = [
  { icon: FiPackage, color: "bg-emerald-100 text-emerald-700", num: "1.200 Kg", label: "Makanan Terselamatkan", desc: "Total berat makanan layak konsumsi yang berhasil diselamatkan dari tempat sampah sejak DishCon diluncurkan." },
  { icon: FiUsers, color: "bg-brand-100 text-brand-700", num: "500+", label: "Mahasiswa Aktif", desc: "Pengguna aktif mahasiswa kos yang secara rutin menggunakan DishCon untuk menemukan makanan murah di sekitar kampus." },
  { icon: FiStar, color: "bg-amber-100 text-amber-700", num: "80+", label: "Mitra UMKM", desc: "Warmindo, warteg, angkringan, dan katering rumahan yang telah bergabung dan aktif menjual kantong surplus." },
  { icon: FiTrendingDown, color: "bg-blue-100 text-blue-700", num: "500 Kg", label: "CO₂ Dicegah", desc: "Estimasi emisi karbon yang berhasil dicegah berkat berkurangnya makanan yang masuk ke TPA dan proses penguraiannya." },
];

export default function DampakPage() {
  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-brand-800 to-brand-600 py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 0)', backgroundSize: '40px 40px'}} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">Dampak Nyata</h1>
          <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">
            Setiap transaksi di DishCon bukan sekadar jual-beli makanan. Ini adalah kontribusi nyata terhadap lingkungan dan komunitas.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Beranda</Link>
          <span>/</span>
          <span className="text-brand-700 font-semibold">Dampak</span>
        </nav>
      </div>

      {/* Impact Numbers */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl md:text-4xl font-black text-brand-900 text-center mb-14">Angka yang Berbicara</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((m) => (
              <div key={m.label} className="bg-white rounded-3xl p-7 border border-stone-100 shadow-sm">
                <div className={`w-12 h-12 rounded-2xl ${m.color} flex items-center justify-center mb-5`}>
                  <m.icon className="text-xl" />
                </div>
                <div className="text-4xl font-black text-brand-900">{m.num}</div>
                <div className="text-sm font-black text-stone-600 mt-1">{m.label}</div>
                <p className="text-stone-400 text-xs mt-3 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bar Chart Visual */}
      <section className="py-16 bg-brand-50 border-y border-brand-100">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl md:text-3xl font-black text-brand-900 mb-10 text-center">Pertumbuhan Makanan Terselamatkan (2026)</h2>
          <div className="flex items-end gap-3 h-48 px-4">
            {[
              { month: "Apr", pct: 15 }, { month: "Mei", pct: 28 }, { month: "Jun", pct: 38 },
              { month: "Jul", pct: 52 }, { month: "Agu", pct: 68 }, { month: "Sep", pct: 85 },
            ].map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-brand-600 rounded-t-lg transition-all" style={{height: `${d.pct}%`}} />
                <span className="text-xs font-bold text-stone-500">{d.month}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-stone-400 mt-4">*Data dalam persentase relatif terhadap target bulanan</p>
        </div>
      </section>

      {/* Metodologi */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl md:text-3xl font-black text-brand-900 mb-6">Bagaimana Kami Menghitung Dampak</h2>
          <div className="space-y-5 text-stone-600 leading-relaxed">
            <p><strong className="text-brand-800">Makanan Terselamatkan:</strong> Dihitung dari total berat makanan pada setiap transaksi yang berhasil diselesaikan (status: completed) di platform DishCon, berdasarkan berat estimasi yang diinput mitra saat posting.</p>
            <p><strong className="text-brand-800">Penghematan Mahasiswa:</strong> Selisih antara harga normal dan harga kantong surplus dikalikan jumlah porsi yang terjual. Ini adalah uang yang benar-benar tidak perlu dikeluarkan oleh mahasiswa.</p>
            <p><strong className="text-brand-800">Emisi CO₂ Dicegah:</strong> Berdasarkan metodologi FAO (2013), setiap 1 kg makanan yang tidak terbuang ke TPA mencegah rata-rata 0,42 kg emisi CO₂ ekuivalen dari proses dekomposisi anaerobik.</p>
          </div>
        </div>
      </section>

      {/* Visi 2027 */}
      <section className="py-16 bg-brand-900 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-block bg-white/10 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">Target 2027</span>
          <h2 className="text-3xl md:text-4xl font-black">Visi Dampak Kami ke Depan</h2>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { num: "10.000 Kg", label: "Makanan Diselamatkan" },
              { num: "5.000+", label: "Mahasiswa Aktif" },
              { num: "500+", label: "Mitra UMKM" },
            ].map((v) => (
              <div key={v.label} className="bg-white/10 rounded-2xl p-5">
                <div className="text-3xl font-black text-brand-300">{v.num}</div>
                <div className="text-white/60 text-sm mt-1">{v.label}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-white/60 max-w-xl mx-auto">Bergabunglah bersama kami dan jadilah bagian dari pergerakan ini. Setiap pesanan adalah langkah kecil menuju perubahan besar.</p>
          <Link href="/register" className="mt-6 inline-block rounded-full bg-brand-400 hover:bg-brand-300 text-white font-bold px-8 py-3 transition">
            Mulai Berkontribusi
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
