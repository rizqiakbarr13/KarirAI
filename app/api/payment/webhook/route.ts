import crypto from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { PRICING } from "@/lib/constants";
import { logAuditEvent } from "@/lib/audit";

const notificationSchema = z.object({
  order_id: z.string(),
  status_code: z.string(),
  gross_amount: z.string(),
  signature_key: z.string(),
  transaction_status: z.string(),
  fraud_status: z.string().optional(),
});

function verifySignature(params: {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
}) {
  const expected = crypto
    .createHash("sha512")
    .update(
      `${params.order_id}${params.status_code}${params.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`
    )
    .digest("hex");
  return expected === params.signature_key;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = notificationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!verifySignature(parsed.data)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const { order_id, transaction_status, fraud_status } = parsed.data;
  const admin = createAdminClient();

  const { data: subscription } = await admin
    .from("subscriptions")
    .select("*")
    .eq("midtrans_order_id", order_id)
    .single();

  if (!subscription) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  if (
    (transaction_status === "capture" || transaction_status === "settlement") &&
    (!fraud_status || fraud_status === "accept")
  ) {
    const isYearly = subscription.amount >= PRICING.pro_yearly;
    const durationDays = isYearly ? 365 : 30;
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + durationDays * 24 * 60 * 60 * 1000);

    await admin
      .from("subscriptions")
      .update({
        status: "active",
        started_at: startedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .eq("id", subscription.id);

    await admin
      .from("profiles")
      .update({ plan: "pro", plan_expires_at: expiresAt.toISOString() })
      .eq("id", subscription.user_id);

    await logAuditEvent({
      userId: subscription.user_id,
      action: "payment.activated",
      metadata: { orderId: order_id, expiresAt: expiresAt.toISOString() },
      request,
    });
  } else if (transaction_status === "expire" || transaction_status === "cancel") {
    await admin
      .from("subscriptions")
      .update({ status: transaction_status === "expire" ? "expired" : "cancelled" })
      .eq("id", subscription.id);

    const { count } = await admin
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", subscription.user_id)
      .eq("status", "active");

    if (!count) {
      await admin
        .from("profiles")
        .update({ plan: "free", plan_expires_at: null })
        .eq("id", subscription.user_id);
    }

    await logAuditEvent({
      userId: subscription.user_id,
      action: "payment.expired_or_cancelled",
      metadata: { orderId: order_id, transactionStatus: transaction_status },
      request,
    });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
