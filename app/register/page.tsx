import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun KarirAI gratis dan mulai bangun CV, surat lamaran, serta latihan interview dengan AI.",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-6 py-16">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
