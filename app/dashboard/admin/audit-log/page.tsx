import Link from "next/link";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AuditAction } from "@/types";

export const metadata: Metadata = { title: "Audit Log" };

const PAGE_SIZE = 50;

const ACTION_FILTERS: { value: AuditAction | "all"; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "auth.login", label: "Login" },
  { value: "auth.logout", label: "Logout" },
  { value: "payment.activated", label: "Pembayaran Aktif" },
  { value: "rate_limit.exceeded", label: "Rate Limit" },
  { value: "admin.access", label: "Akses Admin" },
];

const ACTION_LABELS: Record<string, string> = {
  "auth.login": "Login",
  "auth.logout": "Logout",
  "cv.deleted": "CV Dihapus",
  "cv.exported": "CV Diekspor",
  "cv.reviewed": "CV Direview AI",
  "cover_letter.generated": "Surat Lamaran Dibuat",
  "interview.started": "Interview Dimulai",
  "interview.completed": "Interview Selesai",
  "payment.created": "Transaksi Dibuat",
  "payment.activated": "Pembayaran Aktif",
  "payment.expired_or_cancelled": "Pembayaran Kedaluwarsa/Batal",
  "rate_limit.exceeded": "Rate Limit Terpicu",
  "admin.access": "Akses Admin",
};

function formatDateTime(timestamp: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

interface AuditLogRow {
  id: string;
  action: string;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
  profiles: { name: string; email: string } | null;
}

interface PageProps {
  searchParams: { page?: string; action?: string };
}

export default async function AuditLogPage({ searchParams }: PageProps) {
  const admin = createAdminClient();
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const action = searchParams.action;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = admin
    .from("audit_logs")
    .select("id, action, metadata, ip_address, created_at, profiles(name, email)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (action && action !== "all") {
    query = query.eq("action", action);
  }

  const { data, count } = await query.returns<AuditLogRow[]>();
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  const buildHref = (nextPage: number) => {
    const params = new URLSearchParams();
    if (action && action !== "all") params.set("action", action);
    params.set("page", String(nextPage));
    return `/dashboard/admin/audit-log?${params.toString()}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {ACTION_FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={`/dashboard/admin/audit-log${filter.value === "all" ? "" : `?action=${filter.value}`}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              (action ?? "all") === filter.value
                ? "border-indigo bg-indigo/10 text-indigo"
                : "border-dark/10 text-dark/60 hover:border-dark/25"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <Card padding="none" className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-dark/10 text-dark/50">
              <th className="px-4 py-3 font-medium">Waktu</th>
              <th className="px-4 py-3 font-medium">Pengguna</th>
              <th className="px-4 py-3 font-medium">Aksi</th>
              <th className="px-4 py-3 font-medium">IP</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((log) => (
              <tr key={log.id} className="border-b border-dark/5">
                <td className="whitespace-nowrap px-4 py-3 text-dark/70">
                  {formatDateTime(log.created_at)}
                </td>
                <td className="px-4 py-3 text-dark/70">
                  {log.profiles?.email ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="neutral">{ACTION_LABELS[log.action] ?? log.action}</Badge>
                </td>
                <td className="px-4 py-3 text-dark/50">{log.ip_address ?? "—"}</td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-dark/40">
                  Belum ada aktivitas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center justify-between text-sm text-dark/60">
        <span>
          Halaman {page} dari {totalPages}
        </span>
        <div className="flex gap-2">
          {page > 1 && (
            <Link href={buildHref(page - 1)} className="font-medium text-indigo">
              Sebelumnya
            </Link>
          )}
          {page < totalPages && (
            <Link href={buildHref(page + 1)} className="font-medium text-indigo">
              Berikutnya
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
