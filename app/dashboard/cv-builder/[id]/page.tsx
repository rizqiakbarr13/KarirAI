import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CVForm } from "@/components/cv/cv-form";
import type { PlanType, Resume } from "@/types";

interface PageProps {
  params: { id: string };
}

export default async function EditCVBuilderPage({ params }: PageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: resume }, { data: profile }] = await Promise.all([
    supabase.from("resumes").select("*").eq("id", params.id).single<Resume>(),
    supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single<{ plan: PlanType }>(),
  ]);

  if (!resume) {
    notFound();
  }

  return <CVForm resume={resume} plan={profile?.plan ?? "free"} />;
}
