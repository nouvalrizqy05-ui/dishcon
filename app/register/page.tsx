import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/auth-card";

export default function MahasiswaRegisterPage() {
  return (
    <AuthLayout mode="register" role="mahasiswa">
      <RegisterForm role="mahasiswa" />
    </AuthLayout>
  );
}
