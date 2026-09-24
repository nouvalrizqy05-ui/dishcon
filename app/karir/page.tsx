import Link from "next/link";
import { PageLayout } from "@/components/landing/page-layout";
import { FiMapPin, FiArrowRight, FiCheckCircle } from "react-icons/fi";

const jobs = [
  { title: "Full Stack Developer", type: "Full-time", location: "Remote / Semarang", color: "bg-indigo-100 text-indigo-700", desc: "Membangun dan mengembangkan fitur-fitur inti DishCon menggunakan Next.js, TypeScript, dan Supabase. Pengalaman minimal 2 tahun diutamakan." },
  { title: "UI/UX Designer", type: "Full-time", location: "Remote", color: "bg-rose-100 text-rose-700", desc: "Merancang pengalaman pengguna yang intuitif untuk aplikasi web dan mobile DishCon. Portofolio Figma wajib dilampirkan." },
  { title: "Partnership Manager", type: "Full-time", location: "Semarang", color: "bg-amber-100 text-amber-700", desc: "Memperluas jaringan mitra UMKM di sekitar kampus Semarang. Kemampuan komunikasi dan negosiasi yang kuat sangat diperlukan." },
  { title: "Community Manager", type: "Part-time / Contract", location: "Remote", color: "bg-emerald-100 text-emerald-700", desc: "Mengelola komunitas mahasiswa DishCon di media sosial dan grup kampus. Cocok untuk mahasiswa aktif yang ingin pengalaman kerja nyata." },
  { title: "AI/ML Engineer", type: "Full-time", location: "Remote", color: "bg-brand-100 text-brand-700", desc: "Mengembangkan dan mengoptimalkan model AI untuk cek nutrisi, estimasi kedaluwarsa, dan sistem rekomendasi kantong surplus." },
];

const benefits = [
  "Remote-friendly & fleksibel", "Ekuitas untuk early employees", "Impact langsung terhadap lingkungan",
  "Belajar dari tim yang berpengalaman", "Budget belajar & development", "Akses kantong surplus gratis 😄",
];

export default function KarirPage() {
  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-brand-800 to-brand-600 py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 0)', backgroundSize: '40px 40px'}} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">Karir di DishCon</h1>
          <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">
            Bergabunglah dengan tim yang membangun masa depan makanan yang lebih adil dan berkelanjutan.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Beranda</Link>
          <span>/</span>
          <span className="text-brand-700 font-semibold">Karir</span>
        </nav>
      </div>

      <section className="py-16 bg-brand-50 border-y border-brand-100">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-black text-brand-900 mb-8">Kenapa Bergabung dengan DishCon?</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 border border-brand-100 shadow-sm">
                <FiCheckCircle className="text-brand-600 flex-shrink-0" />
                <span className="font-semibold text-stone-700 text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl md:text-3xl font-black text-brand-900 mb-10">Posisi Terbuka</h2>
          <div className="space-y-5">
            {jobs.map((job) => (
              <div key={job.title} className="bg-white rounded-3xl p-7 border border-stone-100 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center gap-5">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-lg font-black text-brand-900">{job.title}</h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${job.color}`}>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-400 text-sm mb-3">
                    <FiMapPin className="text-xs" /> {job.location}
                  </div>
                  <p className="text-stone-500 text-sm leading-relaxed">{job.desc}</p>
                </div>
                <Link href="/hubungi" className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 text-sm transition">
                  Lamar <FiArrowRight />
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-stone-500 text-sm">
            Tidak menemukan posisi yang sesuai?{" "}
            <Link href="/hubungi" className="text-brand-600 font-bold hover:underline">Kirim CV spontan ke kami</Link>
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
