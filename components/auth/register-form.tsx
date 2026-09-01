"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { useSupabase } from "@/components/providers/supabase-provider";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { GoogleIcon } from "@/components/ui/google-icon";
import { cn } from "@/lib/utils";

type RegisterMode = "password" | "magic-link";

export function RegisterForm() {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  const [mode, setMode] = useState<RegisterMode>("password");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingMagicLink, setLoadingMagicLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [confirmEmailSent, setConfirmEmailSent] = useState(false);

  const callbackUrl = (next: string) => {
    const url = new URL("/api/auth/callback", window.location.origin);
    url.searchParams.set("next", next);
    return url.toString();
  };

  const handleGoogleRegister = async () => {
    setLoadingGoogle(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl(redirectTo) },
    });
    if (error) {
      toast(error.message, "error");
      setLoadingGoogle(false);
    }
  };

  const handlePasswordRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast("Password minimal 6 karakter", "error");
      return;
    }
    setLoadingPassword(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: callbackUrl(redirectTo),
      },
    });
    setLoadingPassword(false);
    if (error) {
      toast(error.message, "error");
      return;
    }
    if (data.session) {
      await fetch("/api/auth/login-audit", { method: "POST" });
      router.push(redirectTo);
      router.refresh();
      return;
    }
    setConfirmEmailSent(true);
  };

  const handleMagicLinkRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingMagicLink(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl(redirectTo),
        data: { full_name: name },
      },
    });
    setLoadingMagicLink(false);
    if (error) {
      toast(error.message, "error");
      return;
    }
    setMagicLinkSent(true);
    toast("Magic link terkirim, cek email kamu.");
  };

  return (
    <Card padding="lg" className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-dark">Buat akun KarirAI</h1>
        <p className="mt-1 text-sm text-dark/60">
          Gratis, tanpa perlu kartu kredit.
        </p>
      </div>

      <Button
        variant="secondary"
        className="w-full"
        onClick={handleGoogleRegister}
        disabled={loadingGoogle}
      >
        <GoogleIcon className="h-4 w-4" />
        {loadingGoogle ? "Menghubungkan..." : "Daftar dengan Google"}
      </Button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-dark/10" />
        <span className="text-xs text-dark/40">atau</span>
        <div className="h-px flex-1 bg-dark/10" />
      </div>

      <div className="mb-4 flex rounded-control bg-sand p-1 text-sm font-medium">
        <button
          type="button"
          onClick={() => setMode("password")}
          className={cn(
            "flex-1 rounded-control py-1.5 transition-colors",
            mode === "password" ? "bg-white text-dark shadow-card" : "text-dark/50"
          )}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setMode("magic-link")}
          className={cn(
            "flex-1 rounded-control py-1.5 transition-colors",
            mode === "magic-link" ? "bg-white text-dark shadow-card" : "text-dark/50"
          )}
        >
          Magic Link
        </button>
      </div>

      {mode === "password" ? (
        confirmEmailSent ? (
          <div className="flex flex-col items-center gap-2 rounded-control bg-indigo/5 px-4 py-6 text-center">
            <Mail className="h-6 w-6 text-indigo" />
            <p className="text-sm text-dark">
              Email konfirmasi sudah dikirim ke <strong>{email}</strong>. Klik
              link di email itu untuk mengaktifkan akun, lalu masuk lewat tab
              &ldquo;Password&rdquo; di halaman login.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePasswordRegister} className="flex flex-col gap-4">
            <Input
              type="text"
              label="Nama Lengkap"
              placeholder="Nama kamu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              label="Email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loadingPassword}>
              {loadingPassword ? "Mendaftar..." : "Daftar"}
            </Button>
          </form>
        )
      ) : magicLinkSent ? (
        <div className="flex flex-col items-center gap-2 rounded-control bg-indigo/5 px-4 py-6 text-center">
          <Mail className="h-6 w-6 text-indigo" />
          <p className="text-sm text-dark">
            Link pendaftaran sudah dikirim ke <strong>{email}</strong>. Cek
            inbox (atau folder spam) kamu.
          </p>
        </div>
      ) : (
        <form onSubmit={handleMagicLinkRegister} className="flex flex-col gap-4">
          <Input
            type="text"
            label="Nama Lengkap"
            placeholder="Nama kamu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            label="Email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loadingMagicLink}>
            {loadingMagicLink ? "Mengirim..." : "Daftar dengan Magic Link"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-dark/60">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-indigo">
          Masuk di sini
        </Link>
      </p>
    </Card>
  );
}
