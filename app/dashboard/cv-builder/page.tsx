import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PLAN_LIMITS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { emptyCVData } from "@/lib/cv";
import type { PlanType } from "@/types";

export const metadata: Metadata = { title: "CV Builder" };

export default async function NewCVBuilderPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single<{ plan: PlanType }>();

  const plan = profile?.plan ?? "free";
  const maxResumes = PLAN_LIMITS[plan].max_resumes;

  if (Number.isFinite(maxResumes)) {
    const { count } = await supabase
      .from("resumes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if ((count ?? 0) >= maxResumes) {
      return (
        <div className="mx-auto max-w-md">
          <Card padding="lg" className="text-center">
            <h1 className="text-lg font-semibold text-dark">
              Batas jumlah CV tercapai
            </h1>
            <p className="mt-2 text-sm text-dark/60">
              Paket Free hanya bisa menyimpan {maxResumes} CV. Upgrade ke Pro
              untuk membuat CV tanpa batas.
            </p>
            <Link href="/dashboard/upgrade" className="mt-6 block">
              <Button className="w-full">Upgrade ke Pro</Button>
            </Link>
          </Card>
        </div>
      );
    }
  }

  const { data: resume, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: "CV Saya",
      data: emptyCVData(),
      template: "minimalis",
    })
    .select("id")
    .single();

  if (error || !resume) {
    return (
      <div className="mx-auto max-w-md text-center text-sm text-red-500">
        Gagal membuat CV baru. Coba lagi.
      </div>
    );
  }

  redirect(`/dashboard/cv-builder/${resume.id}`);
}
