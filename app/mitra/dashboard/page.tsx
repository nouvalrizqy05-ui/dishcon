import { ProtectedPage } from "@/components/layout/app-shell";
import { MitraDashboardPage } from "@/components/pages/mitra-dashboard";
export default function Page() { return <ProtectedPage role="mitra" title="Dashboard Mitra" subtitle="Pantau kantong surplus, reservasi, dan pendapatan bersih Anda."><MitraDashboardPage /></ProtectedPage>; }
