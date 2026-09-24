"use client";

import { AuthProvider } from "@/lib/auth-context";
import { DishconDataProvider } from "@/lib/dishcon-store";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DishconDataProvider>
        {children}
        <Toaster position="bottom-center" richColors />
      </DishconDataProvider>
    </AuthProvider>
  );
}
