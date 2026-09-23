import { ProtectedPage } from "@/components/layout/app-shell";
import { AdminUsersPage } from "@/components/pages/admin-pages";
export default function Page() { return <ProtectedPage role="admin" title="Manajemen Pengguna" subtitle="Pantau profil mitra, mahasiswa, dan admin."><AdminUsersPage /></ProtectedPage>; }
