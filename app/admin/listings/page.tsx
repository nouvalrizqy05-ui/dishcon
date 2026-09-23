import { ProtectedPage } from "@/components/layout/app-shell";
import { AdminListingsPage } from "@/components/pages/admin-pages";
export default function Page() { return <ProtectedPage role="admin" title="Kantong Surplus" subtitle="Verifikasi listing, tinjau hasil AI, dan kelola status tayang."><AdminListingsPage /></ProtectedPage>; }
