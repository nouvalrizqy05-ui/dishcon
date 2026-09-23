import { ProtectedPage } from "@/components/layout/app-shell";
import { MahasiswaHistoryPage } from "@/components/pages/history-pages";
export default function Page() { return <ProtectedPage role="mahasiswa" title="Reservasi Saya" subtitle="Kode pengambilan dan status setiap reservasi."><MahasiswaHistoryPage /></ProtectedPage>; }
