import { ProtectedPage } from "@/components/layout/app-shell";
import { SettingsPage } from "@/components/pages/account-pages";
export default function Page() { return <ProtectedPage role="mitra" title="Settings Mitra" subtitle="Pengaturan akun khusus mitra UMKM."><SettingsPage role="mitra" /></ProtectedPage>; }
