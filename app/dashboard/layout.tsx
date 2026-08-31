import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import type { Profile } from "@/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="flex min-h-screen bg-sand">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col pb-16 md:pb-0">
        <DashboardNavbar
          name={profile?.name ?? user.email ?? "Pengguna"}
          plan={profile?.plan ?? "free"}
        />
        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
