import { ProtectedPage } from "@/components/layout/app-shell";
import { SettingsPage } from "@/components/pages/account-pages";
export default function Page() { return <ProtectedPage role="mahasiswa" title="Settings Mahasiswa" subtitle="Preferensi katalog dan keamanan akun." showMobileHeader={false}><SettingsPage role="mahasiswa" /></ProtectedPage>; }
