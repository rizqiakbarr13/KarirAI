import { createAdminClient } from "@/lib/supabase/admin";
import { getClientIp } from "@/lib/request";
import type { AuditAction } from "@/types";

interface LogAuditEventParams {
  userId: string | null;
  action: AuditAction;
  metadata?: Record<string, unknown>;
  request?: Request;
}

export async function logAuditEvent({
  userId,
  action,
  metadata,
  request,
}: LogAuditEventParams) {
  try {
    const admin = createAdminClient();
    await admin.from("audit_logs").insert({
      user_id: userId,
      action,
      metadata: metadata ?? {},
      ip_address: request ? getClientIp(request) : null,
      user_agent: request?.headers.get("user-agent") ?? null,
    });
  } catch {
    // Audit logging must never break the request it's observing.
  }
}
