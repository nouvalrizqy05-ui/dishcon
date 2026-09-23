import { FiActivity, FiClock, FiGift, FiHeart, FiUsers, FiZap } from "react-icons/fi";

export const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/#fitur", label: "Fitur" },
  { href: "/#cara-kerja", label: "Cara Kerja" },
  { href: "/#tentang", label: "Tentang" }
];

export const featureCards = [
  {
    icon: FiHeart,
    title: "Kantong Surplus UMKM",
    desc: "Mitra UMKM mikro (warmindo, angkringan, katering rumahan) memposting sisa dagangan layak jual sebagai kantong misteri diskon."
  },
  {
    icon: FiZap,
    title: "Deteksi Nutrisi & Alergen",
    desc: "AI membantu menampilkan estimasi nutrisi dan potensi alergen dari setiap kantong surplus yang diposting mitra."
  },
  {
    icon: FiClock,
    title: "Prediksi Kedaluwarsa",
    desc: "AI memperkirakan batas aman konsumsi berdasarkan jenis makanan, waktu produksi, dan cara penyimpanan."
  },
  {
    icon: FiActivity,
    title: "Reservasi Instan",
    desc: "Mahasiswa memesan kantong surplus secara instan tanpa menunggu approval berlapis — stok langsung terkunci di sistem."
  }
];

export const stats = [
  { icon: FiUsers, number: "3 Role", label: "Mitra, Mahasiswa & Admin" },
  { icon: FiActivity, number: "10%", label: "Komisi Platform per Transaksi" },
  { icon: FiGift, number: "Real-time", label: "Kantong Surplus Tersedia" }
];

export const howItWorks = [
  { title: "Mitra posting kantong surplus", desc: "Foto dan masukkan detail sisa dagangan sebagai kantong misteri diskon melalui aplikasi." },
  { title: "Analisis AI", desc: "AI menganalisis nutrisi, mendeteksi alergen, dan memberi estimasi risiko kedaluwarsa." },
  { title: "Reservasi instan mahasiswa", desc: "Mahasiswa di sekitar kampus melihat kantong surplus terdekat dan memesan langsung, tanpa approval berlapis." },
  { title: "Serah terima selesai", desc: "Mahasiswa datang dengan kode pengambilan, mitra konfirmasi, dan komisi platform tercatat otomatis." }
];
