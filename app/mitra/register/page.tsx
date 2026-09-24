import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/auth-card";

export default function MitraRegisterPage() {
  return (
    <AuthLayout mode="register" role="mitra">
      <RegisterForm role="mitra" />
    </AuthLayout>
  );
}
