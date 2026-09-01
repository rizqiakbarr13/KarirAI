"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard/admin", label: "Monitoring" },
  { href: "/dashboard/admin/audit-log", label: "Audit Log" },
];

export function AdminTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 border-b border-dark/10">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
              active
                ? "border-indigo text-indigo"
                : "border-transparent text-dark/60 hover:text-dark"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
