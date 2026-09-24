import Link from "next/link";
import { PageLayout } from "@/components/landing/page-layout";
import { FiArrowRight } from "react-icons/fi";

const team = [
  { initials: "MN", color: "bg-brand-600", name: "Muhammad Nouval Ar-Rizqy", role: "CEO", bio: "Membangun visi DishCon sebagai solusi nyata untuk mengurangi food waste sekaligus membantu mahasiswa kos mendapatkan makanan layak dengan harga terjangkau." },
  { initials: "RF", color: "bg-indigo-500", name: "Rizal Fajri Arrasyid", role: "CTO", bio: "Arsitek di balik sistem reservasi real-time, integrasi AI, dan infrastruktur platform DishCon yang cepat dan tangguh." },
  { initials: "MA", color: "bg-amber-500", name: "Muhammad Ammar Farras Fauzan", role: "CMO", bio: "Menggerakkan pertumbuhan pengguna dan membangun kesadaran akan pentingnya food-rescue di kalangan mahasiswa dan mitra UMKM." },
  { initials: "MR", color: "bg-rose-500", name: "Muhammad Ruiz Ruzil", role: "CFO", bio: "Memastikan keberlanjutan finansial DishCon agar misi penyelamatan makanan dapat terus berjalan dan memberikan dampak maksimal." },
];

export default function TimPage() {
  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-brand-800 to-brand-600 py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 0)', backgroundSize: '40px 40px'}} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">Tim DishCon</h1>
          <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">
            Orang-orang yang percaya bahwa satu porsi makanan pun terlalu berharga untuk dibuang.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Beranda</Link>
          <span>/</span>
          <span className="text-brand-700 font-semibold">Tim</span>
        </nav>
      </div>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm hover:shadow-md transition">
                <div className={`w-16 h-16 rounded-2xl ${member.color} text-white flex items-center justify-center font-black text-xl mb-5`}>
                  {member.initials}
                </div>
                <h3 className="text-xl font-black text-brand-900">{member.name}</h3>
                <p className="text-brand-600 font-bold text-sm mt-1">{member.role}</p>
                <p className="text-stone-500 text-sm mt-4 leading-relaxed">{member.bio}</p>
              </div>
            ))}

            {/* Join the Team card */}
            <div className="bg-brand-50 rounded-3xl p-8 border-2 border-dashed border-brand-200 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center text-2xl mb-5">+</div>
              <h3 className="text-xl font-black text-brand-900">Kamu Selanjutnya?</h3>
              <p className="text-stone-500 text-sm mt-3 leading-relaxed">Kami selalu mencari orang-orang yang passionate dengan teknologi dan dampak sosial.</p>
              <Link href="/karir" className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 text-sm transition">
                Lihat Lowongan <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-stone-50 border-t border-stone-100">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-brand-900">Budaya Kerja Kami</h2>
          <p className="mt-4 text-stone-500 max-w-2xl mx-auto">Kami bekerja dengan prinsip <em>impact first</em> — setiap keputusan produk, bisnis, dan rekrutmen dimulai dari pertanyaan: &ldquo;Apakah ini membuat lebih banyak makanan terselamatkan?&rdquo;</p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Remote-friendly", "Impact-driven", "Move fast", "No ego"].map((v) => (
              <div key={v} className="bg-white rounded-2xl px-4 py-3 border border-stone-100 font-bold text-sm text-brand-800 shadow-sm">{v}</div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
