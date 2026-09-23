import { ProtectedPage } from "@/components/layout/app-shell";
import { MitraHistoryPage } from "@/components/pages/history-pages";
export default function Page() { return <ProtectedPage role="mitra" title="Riwayat & Reservasi" subtitle="Semua kantong surplus dan reservasi yang masuk."><MitraHistoryPage /></ProtectedPage>; }
