import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";

export const metadata: Metadata = { title: "Pengaturan" };

function formatDate(timestamp: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(timestamp));
}

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-dark">Pengaturan</h1>

      <Card padding="lg">
        <CardTitle>Profil</CardTitle>
        <div className="mt-4 flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between border-b border-dark/5 pb-3">
            <span className="text-dark/50">Nama</span>
            <span className="font-medium text-dark">{profile?.name ?? "-"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-dark/5 pb-3">
            <span className="text-dark/50">Email</span>
            <span className="font-medium text-dark">{profile?.email ?? user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-dark/50">Bergabung sejak</span>
            <span className="font-medium text-dark">
              {profile?.created_at ? formatDate(profile.created_at) : "-"}
            </span>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Paket & Billing</CardTitle>
            <CardDescription className="mt-1">
              {profile?.plan === "free"
                ? "Kamu sedang menggunakan paket Free."
                : `Paket Pro aktif${profile?.plan_expires_at ? ` hingga ${formatDate(profile.plan_expires_at)}` : ""}.`}
            </CardDescription>
          </div>
          <Badge variant={profile?.plan === "free" ? "free" : profile?.plan === "pro" ? "pro" : "enterprise"}>
            {profile?.plan ?? "free"}
          </Badge>
        </div>
        {profile?.plan === "free" && (
          <Link href="/dashboard/upgrade" className="mt-6 block">
            <Button className="w-full">Upgrade ke Pro</Button>
          </Link>
        )}
      </Card>
    </div>
  );
}
