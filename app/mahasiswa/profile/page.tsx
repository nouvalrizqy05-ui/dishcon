import { ProtectedPage } from "@/components/layout/app-shell";
import { ProfilePage } from "@/components/pages/account-pages";
export default function Page() { return <ProtectedPage role="mahasiswa" title="Profil Saya" subtitle="Kelola data diri dan titik lokasi GPS kos."><ProfilePage role="mahasiswa" /></ProtectedPage>; }
