import { ProtectedPage } from "@/components/layout/app-shell";
import { MobileDetail } from "@/components/mobile/mobile-detail";
import { ListingDetailPage } from "@/components/pages/listing-detail";

export default function Page() {
  return (
    <>
      {/* CSS breakpoint: mobile detail below md; web detail from md upward. */}
      <div className="mobile-only"><MobileDetail /></div>
      <div className="web-only">
        <ProtectedPage
          role="mahasiswa"
          title="Detail Kantong Surplus"
          subtitle="Pesan instan dan bawa kode pengambilan saat tiba di lokasi mitra."
          showMobileNav={false}
        >
          <ListingDetailPage />
        </ProtectedPage>
      </div>
    </>
  );
}
