import Link from "next/link";
import { FileText, Mail, Sparkles } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";

export interface ActivityItem {
  id: string;
  type: "resume" | "cover_letter" | "usage";
  label: string;
  timestamp: string;
  href?: string;
}

const ICONS = {
  resume: FileText,
  cover_letter: Mail,
  usage: Sparkles,
};

function formatRelativeTime(timestamp: string) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari lalu`;
}

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <Card padding="lg">
      <CardTitle>Aktivitas Terakhir</CardTitle>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-dark/50">
          Belum ada aktivitas. Mulai dengan membuat CV pertamamu.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col divide-y divide-dark/5">
          {items.map((item) => {
            const Icon = ICONS[item.type];
            const content = (
              <div className="flex items-center gap-3 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dark/5">
                  <Icon className="h-4 w-4 text-dark/60" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-dark">{item.label}</p>
                </div>
                <span className="shrink-0 text-xs text-dark/40">
                  {formatRelativeTime(item.timestamp)}
                </span>
              </div>
            );

            return (
              <li key={`${item.type}-${item.id}`}>
                {item.href ? <Link href={item.href}>{content}</Link> : content}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
