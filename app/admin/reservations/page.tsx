import { ProtectedPage } from "@/components/layout/app-shell";
import { AdminReservationsPage } from "@/components/pages/admin-pages";
export default function Page() { return <ProtectedPage role="admin" title="Reservasi" subtitle="Reservasi instan mahasiswa -- admin memantau, tidak menyetujui manual."><AdminReservationsPage /></ProtectedPage>; }
