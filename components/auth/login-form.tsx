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

type LoginMode = "password" | "magic-link";

export function LoginForm() {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  const [mode, setMode] = useState<LoginMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingMagicLink, setLoadingMagicLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const callbackUrl = (next: string) => {
    const url = new URL("/api/auth/callback", window.location.origin);
    url.searchParams.set("next", next);
    return url.toString();
  };

  const handleGoogleLogin = async () => {
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

  const handlePasswordLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingPassword(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast(error.message, "error");
      setLoadingPassword(false);
      return;
    }
    await fetch("/api/auth/login-audit", { method: "POST" });
    router.push(redirectTo);
    router.refresh();
  };

  const handleMagicLink = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingMagicLink(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callbackUrl(redirectTo) },
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
        <h1 className="text-2xl font-bold text-dark">Masuk ke KarirAI</h1>
        <p className="mt-1 text-sm text-dark/60">
          Lanjutkan membangun karier kamu.
        </p>
      </div>

      <Button
        variant="secondary"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={loadingGoogle}
      >
        <GoogleIcon className="h-4 w-4" />
        {loadingGoogle ? "Menghubungkan..." : "Masuk dengan Google"}
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
        <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4">
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loadingPassword}>
            {loadingPassword ? "Masuk..." : "Masuk"}
          </Button>
        </form>
      ) : magicLinkSent ? (
        <div className="flex flex-col items-center gap-2 rounded-control bg-indigo/5 px-4 py-6 text-center">
          <Mail className="h-6 w-6 text-indigo" />
          <p className="text-sm text-dark">
            Link masuk sudah dikirim ke <strong>{email}</strong>. Cek inbox
            (atau folder spam) kamu.
          </p>
        </div>
      ) : (
        <form onSubmit={handleMagicLink} className="flex flex-col gap-4">
          <Input
            type="email"
            label="Email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loadingMagicLink}>
            {loadingMagicLink ? "Mengirim..." : "Kirim Magic Link"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-dark/60">
        Belum punya akun?{" "}
        <Link href="/register" className="font-medium text-indigo">
          Daftar di sini
        </Link>
      </p>
    </Card>
  );
}
