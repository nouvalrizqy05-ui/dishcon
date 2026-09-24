import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/auth-card";

export default function MitraLoginPage() {
  return (
    <AuthLayout mode="login" role="mitra">
      <LoginForm role="mitra" />
    </AuthLayout>
  );
}
