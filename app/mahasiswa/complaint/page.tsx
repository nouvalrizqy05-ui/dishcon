import { ProtectedPage } from "@/components/layout/app-shell";
import { ComplaintPage } from "@/components/pages/account-pages";
export default function Page() { return <ProtectedPage role="mahasiswa" title="Pusat Pengaduan" subtitle="Laporkan kendala dan pantau statusnya." showMobileHeader={false}><ComplaintPage role="mahasiswa" /></ProtectedPage>; }
