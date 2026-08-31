import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { snap } from "@/lib/midtrans";
import { PRICING } from "@/lib/constants";

const bodySchema = z.object({
  plan: z.enum(["pro_monthly", "pro_yearly"]),
});

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Paket tidak valid" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", user.id)
    .single<{ name: string; email: string }>();

  const amount = PRICING[parsed.data.plan];
  const orderId = `KARIR-${user.id}-${Date.now()}`;

  let transaction;
  try {
    transaction = await snap.createTransaction({
      transaction_details: { order_id: orderId, gross_amount: amount },
      customer_details: {
        first_name: profile?.name ?? user.email ?? "Pengguna",
        email: profile?.email ?? user.email ?? undefined,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat transaksi pembayaran" },
      { status: 502 }
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.from("subscriptions").insert({
    user_id: user.id,
    midtrans_order_id: orderId,
    plan: "pro",
    amount,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ snapToken: transaction.token, orderId });
}
