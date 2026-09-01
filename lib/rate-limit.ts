import { createAdminClient } from "@/lib/supabase/admin";
import { logAuditEvent } from "@/lib/audit";
import { getRequestIdentifier } from "@/lib/request";

interface RateLimitOptions {
  request: Request;
  userId: string | null;
  action: string;
  limit: number;
  windowSeconds: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

export async function checkRateLimit({
  request,
  userId,
  action,
  limit,
  windowSeconds,
}: RateLimitOptions): Promise<RateLimitResult> {
  const identifier = getRequestIdentifier(request, userId);
  const admin = createAdminClient();
  const windowStart = new Date(Date.now() - windowSeconds * 1000).toISOString();

  const { count } = await admin
    .from("rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("identifier", identifier)
    .eq("action", action)
    .gte("created_at", windowStart);

  const used = count ?? 0;

  if (used >= limit) {
    await logAuditEvent({
      userId,
      action: "rate_limit.exceeded",
      metadata: { limitedAction: action, limit, windowSeconds },
      request,
    });
    return { allowed: false, remaining: 0 };
  }

  await admin.from("rate_limits").insert({ identifier, action });

  // Opportunistic cleanup so the table doesn't grow unbounded; safe to ignore failures.
  if (Math.random() < 0.05) {
    admin.rpc("cleanup_old_rate_limits").then(
      () => {},
      () => {}
    );
  }

  return { allowed: true, remaining: limit - used - 1 };
}
