"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Mail,
  MessagesSquare,
  Settings,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/cv-builder", label: "CV Builder", icon: FileText },
  { href: "/dashboard/cover-letter", label: "Surat Lamaran", icon: Mail },
  { href: "/dashboard/interview", label: "Simulasi Interview", icon: MessagesSquare },
  { href: "/dashboard/settings", label: "Pengaturan", icon: Settings },
];

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();
  const navItems = isAdmin
    ? [...NAV_ITEMS, { href: "/dashboard/admin", label: "Admin", icon: ShieldCheck }]
    : NAV_ITEMS;

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-dark/10 bg-white md:flex">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="text-lg font-extrabold text-indigo">
          KarirAI
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-control px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-indigo/10 text-indigo"
                  : "text-dark/70 hover:bg-dark/5 hover:text-dark"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <Link
          href="/dashboard/upgrade"
          className="flex items-center gap-2 rounded-control bg-warm/15 px-3 py-2.5 text-sm font-medium text-warm hover:bg-warm/25"
        >
          <Sparkles className="h-4 w-4" />
          Upgrade ke Pro
        </Link>
      </div>
    </aside>
  );
}
