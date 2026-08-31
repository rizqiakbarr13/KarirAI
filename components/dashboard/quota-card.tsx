import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PlanType } from "@/types";

interface QuotaItem {
  label: string;
  used: number;
  limit: number;
}

interface QuotaCardProps {
  plan: PlanType;
  items: QuotaItem[];
}

export function QuotaCard({ plan, items }: QuotaCardProps) {
  return (
    <Card padding="lg">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Paket Kamu</CardTitle>
          <CardDescription className="mt-1">
            Sisa kuota fitur AI bulan ini
          </CardDescription>
        </div>
        <Badge variant={plan === "free" ? "free" : plan === "pro" ? "pro" : "enterprise"}>
          {plan}
        </Badge>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {items.map((item) => {
          const unlimited = !Number.isFinite(item.limit);
          const percent = unlimited
            ? 100
            : Math.min(100, (item.used / Math.max(item.limit, 1)) * 100);

          return (
            <div key={item.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark/70">{item.label}</span>
                <span className="font-medium text-dark">
                  {unlimited ? "Tanpa batas" : `${item.used} / ${item.limit}`}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-dark/10">
                <div
                  className="h-full rounded-full bg-indigo"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {plan === "free" && (
        <Link
          href="/dashboard/upgrade"
          className="mt-6 block text-center text-sm font-medium text-indigo hover:underline"
        >
          Upgrade ke Pro untuk kuota tanpa batas
        </Link>
      )}
    </Card>
  );
}
