import { ProtectedPage } from "@/components/layout/app-shell";
import { MahasiswaDashboardPage } from "@/components/pages/mahasiswa-dashboard";
export default function Page() { return <ProtectedPage role="mahasiswa" title="Dashboard Mahasiswa" subtitle="Kantong surplus terdekat, reservasi aktif, dan ringkasan nutrisi Anda."><MahasiswaDashboardPage /></ProtectedPage>; }
