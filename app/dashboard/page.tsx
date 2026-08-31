import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PLAN_LIMITS } from "@/lib/constants";
import { Greeting } from "@/components/dashboard/greeting";
import { QuotaCard } from "@/components/dashboard/quota-card";
import { ToolCards } from "@/components/dashboard/tool-cards";
import { RecentActivity, type ActivityItem } from "@/components/dashboard/recent-activity";
import type { Profile } from "@/types";

const FEATURE_LABELS = {
  cv_review: "Review CV",
  cover_letter: "Surat Lamaran",
  interview: "Simulasi Interview",
} as const;

export default async function DashboardPage() {
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

  const plan = profile?.plan ?? "free";
  const limits = PLAN_LIMITS[plan];

  const [cvReviewCount, coverLetterCount, interviewCount, resumes, coverLetters, usageLogs] =
    await Promise.all([
      supabase.rpc("usage_count_this_month", { p_user_id: user.id, p_feature: "cv_review" }),
      supabase.rpc("usage_count_this_month", { p_user_id: user.id, p_feature: "cover_letter" }),
      supabase.rpc("usage_count_this_month", { p_user_id: user.id, p_feature: "interview" }),
      supabase
        .from("resumes")
        .select("id, title, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(5),
      supabase
        .from("cover_letters")
        .select("id, position, company, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("usage_logs")
        .select("id, feature, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const quotaItems = [
    {
      label: FEATURE_LABELS.cv_review,
      used: cvReviewCount.data ?? 0,
      limit: limits.cv_review,
    },
    {
      label: FEATURE_LABELS.cover_letter,
      used: coverLetterCount.data ?? 0,
      limit: limits.cover_letter,
    },
    {
      label: FEATURE_LABELS.interview,
      used: interviewCount.data ?? 0,
      limit: limits.interview,
    },
  ];

  const activityItems: ActivityItem[] = [
    ...(resumes.data ?? []).map((r) => ({
      id: r.id,
      type: "resume" as const,
      label: `CV "${r.title}" diperbarui`,
      timestamp: r.updated_at,
      href: `/dashboard/cv-builder/${r.id}`,
    })),
    ...(coverLetters.data ?? []).map((c) => ({
      id: c.id,
      type: "cover_letter" as const,
      label: `Surat lamaran untuk ${c.position} di ${c.company}`,
      timestamp: c.created_at,
    })),
    ...(usageLogs.data ?? []).map((u) => ({
      id: u.id,
      type: "usage" as const,
      label: `Menggunakan fitur ${FEATURE_LABELS[u.feature as keyof typeof FEATURE_LABELS]}`,
      timestamp: u.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <Greeting name={profile?.name ?? user.email ?? "Pengguna"} />

      <ToolCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <QuotaCard plan={plan} items={quotaItems} />
        <RecentActivity items={activityItems} />
      </div>
    </div>
  );
}
