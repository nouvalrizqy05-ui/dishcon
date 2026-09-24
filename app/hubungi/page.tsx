"use client";

import Link from "next/link";
import { useState } from "react";
import { PageLayout } from "@/components/landing/page-layout";
import { FiMail, FiPhone, FiInstagram, FiMapPin, FiSend } from "react-icons/fi";

const channels = [
  { icon: FiMail, title: "Email", value: "dishcon0@gmail.com", href: "mailto:dishcon0@gmail.com", color: "bg-brand-100 text-brand-700" },
  { icon: FiPhone, title: "WhatsApp", value: "+62 812-3456-7890", href: "https://wa.me/6281234567890", color: "bg-emerald-100 text-emerald-700" },
  { icon: FiInstagram, title: "Instagram", value: "@dishcon.id", href: "https://instagram.com/dishcon.id", color: "bg-rose-100 text-rose-700" },
];

export default function HubungiPage() {
  const [sent, setSent] = useState(false);

  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-brand-800 to-brand-600 py-24 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">Hubungi Kami</h1>
          <p className="mt-5 text-lg text-white/80 max-w-xl mx-auto">Ada pertanyaan, laporan, atau ingin bermitra? Kami senang mendengar dari Anda.</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600">Beranda</Link>
          <span>/</span>
          <span className="text-brand-700 font-semibold">Hubungi</span>
        </nav>
      </div>

      <section className="py-16 pb-24">
        <div className="mx-auto max-w-5xl px-6">

          {/* Channels */}
          <div className="grid sm:grid-cols-3 gap-5 mb-14">
            {channels.map((ch) => (
              <a key={ch.title} href={ch.href} target="_blank" rel="noopener noreferrer"
                className="bg-white rounded-3xl p-7 border border-stone-100 shadow-sm hover:shadow-md hover:border-brand-200 transition flex flex-col items-center text-center group">
                <div className={`w-14 h-14 rounded-2xl ${ch.color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <ch.icon className="text-xl" />
                </div>
                <h3 className="font-black text-brand-900">{ch.title}</h3>
                <p className="text-brand-600 font-semibold text-sm mt-1">{ch.value}</p>
              </a>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Form */}
            <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm">
              <h2 className="text-2xl font-black text-brand-900 mb-6">Kirim Pesan</h2>
              {sent ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-3xl mb-4">✓</div>
                  <h3 className="font-black text-brand-900 text-lg">Pesan Terkirim!</h3>
                  <p className="text-stone-500 text-sm mt-2">Kami akan membalas dalam 1×24 jam.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1.5">Nama Lengkap</label>
                    <input required type="text" placeholder="Masukkan nama Anda" className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-brand-500 focus:ring-0 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1.5">Email</label>
                    <input required type="email" placeholder="nama@email.com" className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-brand-500 focus:ring-0 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1.5">Subjek</label>
                    <select required className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-brand-500 focus:ring-0 outline-none transition bg-white">
                      <option value="">Pilih subjek</option>
                      <option>Pertanyaan Umum</option>
                      <option>Laporan Masalah</option>
                      <option>Kemitraan</option>
                      <option>Karir</option>
                      <option>Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1.5">Pesan</label>
                    <textarea required rows={4} placeholder="Tulis pesan Anda di sini..." className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-brand-500 focus:ring-0 outline-none transition resize-none" />
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 transition shadow-lg shadow-brand-600/25">
                    <FiSend /> Kirim Pesan
                  </button>
                  <p className="text-xs text-stone-400 text-center">Kami akan membalas dalam 1×24 jam pada hari kerja.</p>
                </form>
              )}
            </div>

            {/* Info & Map */}
            <div className="space-y-6">
              <div className="bg-brand-50 rounded-3xl p-7 border border-brand-100">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-brand-600 text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-black text-brand-900">Alamat Kantor</h3>
                    <p className="text-stone-600 text-sm mt-2 leading-relaxed">
                      Jl. Sekaran No. 1, Gunungpati<br />Kota Semarang, Jawa Tengah 50229
                    </p>
                    <p className="text-stone-400 text-xs mt-3">Senin – Jumat, 09.00 – 17.00 WIB</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-stone-100 rounded-3xl h-64 flex flex-col items-center justify-center text-center p-6 border border-stone-200">
                <FiMapPin className="text-stone-400 text-4xl mb-3" />
                <p className="text-stone-500 font-semibold text-sm">Peta Interaktif</p>
                <p className="text-stone-400 text-xs mt-1">Integrasi Google Maps segera hadir</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
