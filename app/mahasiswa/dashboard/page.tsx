import { ProtectedPage } from "@/components/layout/app-shell";
import { MobileHome } from "@/components/mobile/mobile-home";
import { MahasiswaDashboardPage } from "@/components/pages/mahasiswa-dashboard";

export default function Page() {
  return (
    <>
      {/* CSS breakpoint: canonical mobile home below md; web shell from md upward. */}
      <div className="mobile-only"><MobileHome /></div>
      <div className="web-only">
        <ProtectedPage
          role="mahasiswa"
          title="Dashboard Mahasiswa"
          subtitle="Kantong surplus terdekat, reservasi aktif, dan ringkasan aktivitas Anda."
        >
          <MahasiswaDashboardPage />
        </ProtectedPage>
      </div>
    </>
  );
}
