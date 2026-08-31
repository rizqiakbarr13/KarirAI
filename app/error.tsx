"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
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
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-sand px-6 text-center">
      <h1 className="text-2xl font-bold text-dark">Terjadi kesalahan</h1>
      <p className="max-w-md text-dark/60">
        Maaf, ada yang tidak beres. Coba muat ulang halaman ini.
      </p>
      <Button onClick={reset}>Coba Lagi</Button>
    </main>
  );
}
