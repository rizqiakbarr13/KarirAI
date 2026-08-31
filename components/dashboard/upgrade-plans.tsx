"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { PRICING } from "@/lib/constants";
import type { PlanType } from "@/types";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: () => void;
          onPending?: () => void;
          onError?: () => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

const COMPARISON = [
  { label: "Review CV AI / bulan", free: "1x", pro: "Tanpa batas" },
  { label: "Surat lamaran AI / bulan", free: "2x", pro: "Tanpa batas" },
  { label: "Simulasi interview / bulan", free: "1x", pro: "10x" },
  { label: "CV tersimpan", free: "1", pro: "Tanpa batas" },
  { label: "Template", free: "Minimalis", pro: "Semua template" },
];

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function UpgradePlans({ currentPlan }: { currentPlan: PlanType }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<"pro_monthly" | "pro_yearly" | null>(null);

  const handleUpgrade = async (plan: "pro_monthly" | "pro_yearly") => {
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Gagal membuat transaksi");

      if (!window.snap) {
        throw new Error("Midtrans Snap belum siap, coba muat ulang halaman.");
      }

      window.snap.pay(body.snapToken, {
        onSuccess: () => {
          toast("Pembayaran berhasil! Paket Pro kamu segera aktif.");
          router.push("/dashboard");
          router.refresh();
        },
        onPending: () => toast("Pembayaran sedang diproses."),
        onError: () => toast("Pembayaran gagal, coba lagi.", "error"),
      });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-6 sm:grid-cols-3">
        <Card padding="lg">
          <Badge variant="free">Free</Badge>
          <p className="mt-3 text-3xl font-extrabold text-dark">Rp 0</p>
          <CardDescription className="mt-1">Paket saat ini</CardDescription>
          <Button variant="secondary" className="mt-6 w-full" disabled>
            {currentPlan === "free" ? "Paket Aktif" : "Free"}
          </Button>
        </Card>

        <Card padding="lg" className="border-indigo/40 ring-2 ring-indigo/20">
          <Badge variant="pro">Pro Bulanan</Badge>
          <p className="mt-3 text-3xl font-extrabold text-dark">
            {formatRupiah(PRICING.pro_monthly)}
            <span className="text-base font-normal text-dark/50">/bulan</span>
          </p>
          <CardDescription className="mt-1">Fleksibel, batal kapan saja</CardDescription>
          <Button
            className="mt-6 w-full"
            onClick={() => handleUpgrade("pro_monthly")}
            disabled={loadingPlan !== null || currentPlan !== "free"}
          >
            {loadingPlan === "pro_monthly"
              ? "Memproses..."
              : currentPlan !== "free"
                ? "Sudah Pro"
                : "Upgrade ke Pro"}
          </Button>
        </Card>

        <Card padding="lg">
          <Badge variant="pro">Pro Tahunan</Badge>
          <p className="mt-3 text-3xl font-extrabold text-dark">
            {formatRupiah(PRICING.pro_yearly)}
            <span className="text-base font-normal text-dark/50">/tahun</span>
          </p>
          <CardDescription className="mt-1">Hemat 2 bulan dibanding bulanan</CardDescription>
          <Button
            variant="accent"
            className="mt-6 w-full"
            onClick={() => handleUpgrade("pro_yearly")}
            disabled={loadingPlan !== null || currentPlan !== "free"}
          >
            {loadingPlan === "pro_yearly"
              ? "Memproses..."
              : currentPlan !== "free"
                ? "Sudah Pro"
                : "Upgrade ke Pro"}
          </Button>
        </Card>
      </div>

      <Card padding="lg">
        <CardTitle>Bandingkan Fitur</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-dark/10 text-dark/50">
                <th className="py-2 font-medium">Fitur</th>
                <th className="py-2 font-medium">Free</th>
                <th className="py-2 font-medium">Pro</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.label} className="border-b border-dark/5">
                  <td className="py-2.5 text-dark/70">{row.label}</td>
                  <td className="py-2.5 text-dark/70">{row.free}</td>
                  <td className="py-2.5 font-medium text-indigo">
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" />
                      {row.pro}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
