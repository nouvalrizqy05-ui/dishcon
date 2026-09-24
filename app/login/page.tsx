import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/auth-card";

export default function MahasiswaLoginPage() {
  return (
    <AuthLayout mode="login" role="mahasiswa">
      <LoginForm role="mahasiswa" />
    </AuthLayout>
  );
}
