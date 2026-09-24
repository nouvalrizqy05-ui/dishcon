import { ProtectedPage } from "@/components/layout/app-shell";
import { NotificationsPage } from "@/components/pages/account-pages";
export default function Page() { return <ProtectedPage role="mahasiswa" title="Notifikasi" subtitle="Aktivitas reservasi dan berbagi antar kos Anda." showMobileHeader={false}><NotificationsPage role="mahasiswa" /></ProtectedPage>; }
