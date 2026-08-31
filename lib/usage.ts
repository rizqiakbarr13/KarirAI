import type { SupabaseClient } from "@supabase/supabase-js";
import { PLAN_LIMITS } from "@/lib/constants";
import type { PlanType } from "@/types";

export type UsageFeature = "cv_review" | "cover_letter" | "interview";

interface UsageStatus {
  allowed: boolean;
  plan: PlanType;
  limit: number;
  used: number;
}

export async function checkUsageLimit(
  supabase: SupabaseClient,
  userId: string,
  feature: UsageFeature
): Promise<UsageStatus> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single<{ plan: PlanType }>();

  const plan = profile?.plan ?? "free";
  const limit = PLAN_LIMITS[plan][feature];

  if (!Number.isFinite(limit)) {
    return { allowed: true, plan, limit, used: 0 };
  }

  const { data: used } = await supabase.rpc("usage_count_this_month", {
    p_user_id: userId,
    p_feature: feature,
  });

  const usedCount = (used as number) ?? 0;

  return { allowed: usedCount < limit, plan, limit, used: usedCount };
}

export async function logUsage(
  supabase: SupabaseClient,
  userId: string,
  feature: UsageFeature
) {
  await supabase.from("usage_logs").insert({ user_id: userId, feature });
}
