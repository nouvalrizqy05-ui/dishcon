import { ProtectedPage } from "@/components/layout/app-shell";
import { MobileCatalog } from "@/components/mobile/mobile-catalog";
import { CatalogPage } from "@/components/pages/catalog";

export default function Page() {
  return (
    <>
      {/* CSS breakpoint: mobile catalog below md; web catalog from md upward. */}
      <div className="mobile-only"><MobileCatalog /></div>
      <div className="web-only">
        <ProtectedPage
          role="mahasiswa"
          title="Katalog Kantong Surplus"
          subtitle="Temukan makanan diskon yang tersedia di sekitar lokasi Anda."
        >
          <CatalogPage />
        </ProtectedPage>
      </div>
    </>
  );
}
