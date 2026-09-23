import { ProtectedPage } from "@/components/layout/app-shell";
import { NotificationsPage } from "@/components/pages/account-pages";
export default function Page() { return <ProtectedPage role="mitra" title="Notifikasi" subtitle="Aktivitas listing dan reservasi Anda."><NotificationsPage role="mitra" /></ProtectedPage>; }
