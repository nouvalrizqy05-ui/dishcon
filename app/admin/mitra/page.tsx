import { ProtectedPage } from "@/components/layout/app-shell";
import { AdminMitraPage } from "@/components/pages/admin-pages";
export default function Page() { return <ProtectedPage role="admin" title="Verifikasi Mitra" subtitle="Verifikasi sekali per mitra -- listing berikutnya otomatis tayang."><AdminMitraPage /></ProtectedPage>; }
