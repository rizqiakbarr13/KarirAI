"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PlanType } from "@/types";

interface DashboardNavbarProps {
  name: string;
  plan: PlanType;
}

export function DashboardNavbar({ name, plan }: DashboardNavbarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-dark/10 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-dark">{name}</span>
        <Badge variant={plan === "free" ? "free" : plan === "pro" ? "pro" : "enterprise"}>
          {plan}
        </Badge>
      </div>

      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        <LogOut className="h-4 w-4" />
        Keluar
      </Button>
    </header>
  );
}
