import Link from "next/link";
import { PageLayout } from "@/components/landing/page-layout";

const cookies = [
  { name: "Cookie Esensial", badge: "bg-brand-100 text-brand-700", desc: "Cookie ini diperlukan agar platform berfungsi dengan baik. Termasuk cookie sesi autentikasi, cookie keamanan CSRF, dan preferensi bahasa. Cookie ini tidak dapat dinonaktifkan.", examples: ["session_token", "csrf_token", "lang_pref"] },
  { name: "Cookie Analitik", badge: "bg-amber-100 text-amber-700", desc: "Kami menggunakan cookie analitik (melalui layanan pihak ketiga yang mematuhi GDPR) untuk memahami bagaimana pengguna berinteraksi dengan platform kami, sehingga kami dapat terus meningkatkan pengalaman pengguna.", examples: ["_ga", "_gid", "mixpanel_id"] },
  { name: "Cookie Fungsional", badge: "bg-indigo-100 text-indigo-700", desc: "Cookie ini mengingat preferensi Anda seperti lokasi terakhir yang dicari, filter yang digunakan, dan pengaturan tampilan, sehingga Anda tidak perlu mengaturnya ulang setiap kali berkunjung.", examples: ["last_location", "filter_prefs", "ui_theme"] },
];

const sections = [
  { title: "1. Apa Itu Cookie?", content: "Cookie adalah file teks kecil yang disimpan di perangkat Anda (komputer, ponsel, atau tablet) ketika Anda mengunjungi sebuah situs web. Cookie membantu situs web mengingat informasi tentang kunjungan Anda, yang dapat mempermudah kunjungan Anda berikutnya dan membuat situs lebih berguna bagi Anda." },
  { title: "4. Cara Menonaktifkan Cookie", content: "Anda dapat mengontrol dan menghapus cookie melalui pengaturan browser Anda. Namun, perlu diperhatikan bahwa menonaktifkan cookie esensial dapat mempengaruhi fungsionalitas platform DishCon, termasuk kemampuan untuk masuk ke akun Anda. Untuk petunjuk cara menonaktifkan cookie pada browser Anda, kunjungi halaman bantuan browser yang bersangkutan." },
  { title: "5. Pembaruan Kebijakan Cookie", content: "Kami dapat memperbarui Kebijakan Cookie ini dari waktu ke waktu seiring perkembangan layanan kami. Perubahan signifikan akan kami informasikan melalui notifikasi di platform atau email. Dengan terus menggunakan platform DishCon setelah pembaruan, Anda dianggap menyetujui kebijakan cookie yang diperbarui." },
];

export default function CookiePage() {
  return (
    <PageLayout>
      <section className="bg-brand-50 border-b border-brand-100 py-14 px-6 text-center">
        <p className="text-brand-600 font-bold text-sm uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-4xl md:text-5xl font-black text-brand-900">Kebijakan Cookie</h1>
        <p className="mt-3 text-stone-500">Berlaku sejak 1 Oktober 2026</p>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Beranda</Link>
          <span>/</span>
          <span className="hover:text-brand-600 cursor-pointer">Legal</span>
          <span>/</span>
          <span className="text-brand-700 font-semibold">Kebijakan Cookie</span>
        </nav>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12 pb-24">
        <div>
          <h2 className="text-xl font-black text-brand-900 mb-4">1. Apa Itu Cookie?</h2>
          <p className="text-stone-600 leading-relaxed">{sections[0].content}</p>
        </div>
        <hr className="border-stone-200 my-8" />
        <div>
          <h2 className="text-xl font-black text-brand-900 mb-6">2. Jenis Cookie yang Kami Gunakan</h2>
          <div className="space-y-6">
            {cookies.map((c) => (
              <div key={c.name} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-black text-brand-900">{c.name}</h3>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.badge}`}>
                    {c.name.includes("Esensial") ? "Wajib" : "Opsional"}
                  </span>
                </div>
                <p className="text-stone-500 text-sm leading-relaxed">{c.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.examples.map((ex) => (
                    <code key={ex} className="text-xs bg-stone-100 px-2.5 py-1 rounded-lg font-mono text-stone-600">{ex}</code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <hr className="border-stone-200 my-8" />
        <div>
          <h2 className="text-xl font-black text-brand-900 mb-4">3. Cookie Pihak Ketiga</h2>
          <p className="text-stone-600 leading-relaxed">Beberapa fitur platform kami menggunakan layanan pihak ketiga yang mungkin menempatkan cookie di perangkat Anda. Layanan ini memiliki kebijakan privasi dan cookie mereka sendiri yang kami rekomendasikan untuk Anda baca.</p>
        </div>
        <hr className="border-stone-200 my-8" />
        {sections.slice(1).map((s, i) => (
          <div key={i}>
            <h2 className="text-xl font-black text-brand-900 mb-4">{s.title}</h2>
            <p className="text-stone-600 leading-relaxed">{s.content}</p>
            {i < sections.slice(1).length - 1 && <hr className="border-stone-200 my-8" />}
          </div>
        ))}
        <div className="mt-10 bg-stone-50 rounded-2xl p-5 border border-stone-200">
          <p className="text-xs text-stone-400">Terakhir diperbarui: 1 Oktober 2026. Pertanyaan: <a href="mailto:dishcon0@gmail.com" className="text-brand-600 underline">dishcon0@gmail.com</a>.</p>
        </div>
      </div>
    </PageLayout>
  );
}
