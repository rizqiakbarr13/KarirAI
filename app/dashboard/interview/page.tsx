"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

export default function InterviewStartPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStart = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/ai/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Gagal memulai interview");
      router.push(`/dashboard/interview/${body.sessionId}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Terjadi kesalahan", "error");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo/10">
        <MessagesSquare className="h-6 w-6 text-indigo" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-dark">Simulasi Interview</h1>
        <p className="mt-1 text-sm text-dark/60">
          Latihan interview dengan AI HRD virtual, dapatkan feedback langsung.
        </p>
      </div>

      <Card padding="lg" className="w-full text-left">
        <form onSubmit={handleStart} className="flex flex-col gap-4">
          <Input
            label="Posisi yang Dilamar"
            placeholder="cth. Data Analyst"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Mempersiapkan..." : "Mulai Interview"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
