import { ProtectedPage } from "@/components/layout/app-shell";
import { CatalogPage } from "@/components/pages/catalog";
export default function Page() { return <ProtectedPage role="mahasiswa" title="Cari Kantong Surplus" subtitle="Diurutkan berdasarkan jarak hiperlokal dari lokasi Anda."><CatalogPage /></ProtectedPage>; }
