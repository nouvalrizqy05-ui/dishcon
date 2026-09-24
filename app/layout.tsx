import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f6f0",
};

export const metadata: Metadata = {
  title: "DishCon — Kantong Surplus Area Kampus",
  description: "Marketplace kantong surplus UMKM mikro (Warmindo, Katering, Angkringan) untuk mahasiswa di sekitar Unnes.",
  icons: {
    icon: "/logo-dishcon.jpeg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
