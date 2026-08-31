"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      <Card padding="lg" className="w-full">
        <h1 className="text-lg font-semibold text-dark">Gagal memuat halaman</h1>
        <p className="mt-2 text-sm text-dark/60">
          Terjadi kesalahan saat memuat data. Coba lagi atau kembali ke dashboard.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={reset}>
            Coba Lagi
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full">Ke Dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
