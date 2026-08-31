import { Users, FileText, Mail, MessagesSquare, CreditCard, ShieldAlert } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

function startOfMonthISO() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

function last24hISO() {
  return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function AdminMonitoringPage() {
  const admin = createAdminClient();
  const monthStart = startOfMonthISO();
  const dayStart = last24hISO();

  const [
    totalUsersRes,
    freeUsersRes,
    proUsersRes,
    enterpriseUsersRes,
    resumesRes,
    coverLettersRes,
    interviewsRes,
    activeSubsRes,
    rateLimitRes,
    revenueRes,
  ] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "free"),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "pro"),
    admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("plan", "enterprise"),
    admin
      .from("resumes")
      .select("id", { count: "exact", head: true })
      .gte("created_at", monthStart),
    admin
      .from("cover_letters")
      .select("id", { count: "exact", head: true })
      .gte("created_at", monthStart),
    admin
      .from("interview_sessions")
      .select("id", { count: "exact", head: true })
      .gte("created_at", monthStart),
    admin
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    admin
      .from("audit_logs")
      .select("id", { count: "exact", head: true })
      .eq("action", "rate_limit.exceeded")
      .gte("created_at", dayStart),
    admin
      .from("subscriptions")
      .select("amount")
      .eq("status", "active")
      .gte("started_at", monthStart),
  ]);

  const revenueThisMonth = (revenueRes.data ?? []).reduce(
    (sum, row) => sum + (row.amount ?? 0),
    0
  );

  const stats = [
    {
      icon: Users,
      label: "Total Pengguna",
      value: (totalUsersRes.count ?? 0).toLocaleString("id-ID"),
      detail: `${freeUsersRes.count ?? 0} Free · ${proUsersRes.count ?? 0} Pro · ${enterpriseUsersRes.count ?? 0} Enterprise`,
    },
    {
      icon: FileText,
      label: "CV Dibuat Bulan Ini",
      value: (resumesRes.count ?? 0).toLocaleString("id-ID"),
    },
    {
      icon: Mail,
      label: "Surat Lamaran Bulan Ini",
      value: (coverLettersRes.count ?? 0).toLocaleString("id-ID"),
    },
    {
      icon: MessagesSquare,
      label: "Sesi Interview Bulan Ini",
      value: (interviewsRes.count ?? 0).toLocaleString("id-ID"),
    },
    {
      icon: CreditCard,
      label: "Langganan Aktif",
      value: (activeSubsRes.count ?? 0).toLocaleString("id-ID"),
      detail: `Pendapatan bulan ini: ${formatRupiah(revenueThisMonth)}`,
    },
    {
      icon: ShieldAlert,
      label: "Rate Limit Terpicu (24 jam)",
      value: (rateLimitRes.count ?? 0).toLocaleString("id-ID"),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} padding="lg">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-control bg-indigo/10">
            <stat.icon className="h-5 w-5 text-indigo" />
          </div>
          <CardTitle className="text-base">{stat.label}</CardTitle>
          <p className="mt-1 text-2xl font-bold text-dark">{stat.value}</p>
          {stat.detail && <CardDescription className="mt-1">{stat.detail}</CardDescription>}
        </Card>
      ))}
    </div>
  );
}
