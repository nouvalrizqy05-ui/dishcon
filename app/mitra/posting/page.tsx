import { ProtectedPage } from "@/components/layout/app-shell";
import { PostingFormPage } from "@/components/pages/posting-form";
export default function Page() { return <ProtectedPage role="mitra" title="Posting Kantong Surplus" subtitle="Isi detail, foto, dan biarkan AI menganalisis nutrisi serta risiko kedaluwarsa."><PostingFormPage /></ProtectedPage>; }
