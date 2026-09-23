import { ProtectedPage } from "@/components/layout/app-shell";
import { ListingDetailPage } from "@/components/pages/listing-detail";
export default function Page() { return <ProtectedPage role="mahasiswa" title="Detail Kantong Surplus" subtitle="Pesan instan — stok langsung terkunci, tanpa menunggu persetujuan."><ListingDetailPage /></ProtectedPage>; }
