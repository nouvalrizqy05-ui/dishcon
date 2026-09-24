import { ProtectedPage } from "@/components/layout/app-shell";
import { KosSharePage } from "@/components/pages/kos-share";
export default function Page() { return <ProtectedPage role="mahasiswa" title="Berbagi Antar Kos" subtitle="Bagikan atau ambil bahan makanan gratis/murah dari sesama penghuni kos." showMobileHeader={false}><KosSharePage /></ProtectedPage>; }
