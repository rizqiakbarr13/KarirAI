import { redirect } from "next/navigation";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { UpgradePlans } from "@/components/dashboard/upgrade-plans";
import type { PlanType } from "@/types";

export default async function UpgradePage() {
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

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.MIDTRANS_CLIENT_KEY}
        strategy="beforeInteractive"
      />

      <div className="text-center">
        <h1 className="text-2xl font-bold text-dark">Upgrade ke Pro</h1>
        <p className="mt-1 text-sm text-dark/60">
          Buka kuota tanpa batas dan semua template CV.
        </p>
      </div>

      <UpgradePlans currentPlan={profile?.plan ?? "free"} />
    </div>
  );
}
