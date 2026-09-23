import { ProtectedPage } from "@/components/layout/app-shell";
import { ProfilePage } from "@/components/pages/account-pages";
export default function Page() { return <ProtectedPage role="mitra" title="Profil Usaha" subtitle="Kelola data usaha dan titik lokasi GPS."><ProfilePage role="mitra" /></ProtectedPage>; }
