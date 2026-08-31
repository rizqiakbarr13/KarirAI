import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun KarirAI kamu untuk melanjutkan membangun CV dan karier.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-6 py-16">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
