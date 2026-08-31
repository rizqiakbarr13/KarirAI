import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { logAuditEvent } from "@/lib/audit";
import { AdminTabs } from "@/components/admin/admin-tabs";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  await logAuditEvent({ userId: user.id, action: "admin.access" });

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Admin</h1>
        <p className="text-sm text-dark/60">Monitoring sistem dan audit log.</p>
      </div>

      <AdminTabs />

      {children}
    </div>
  );
}
