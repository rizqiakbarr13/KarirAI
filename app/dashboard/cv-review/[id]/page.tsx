import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Lightbulb } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { ScoreCircle } from "@/components/ui/score-circle";
import type { Resume } from "@/types";

export const metadata: Metadata = { title: "Review CV" };

interface PageProps {
  params: { id: string };
}

const DIMENSION_LABELS: Record<string, string> = {
  kelengkapan: "Kelengkapan",
  kata_kunci: "Kata Kunci",
  struktur: "Struktur",
  ats_readability: "ATS Readability",
};

export default async function CVReviewPage({ params }: PageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", params.id)
    .single<Resume>();

  if (!resume) {
    notFound();
  }

  if (!resume.ai_feedback) {
    return (
      <div className="mx-auto max-w-md text-center">
        <Card padding="lg">
          <CardTitle>Belum ada hasil review</CardTitle>
          <p className="mt-2 text-sm text-dark/60">
            Jalankan &ldquo;Review dengan AI&rdquo; dari halaman CV Builder terlebih dahulu.
          </p>
          <Link href={`/dashboard/cv-builder/${resume.id}`} className="mt-6 block">
            <Button className="w-full">Buka CV Builder</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const feedback = resume.ai_feedback;

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <ScoreCircle score={feedback.skor} />
        <p className="max-w-md text-dark/70">{feedback.verdict}</p>
      </div>

      <Card padding="lg" className="w-full">
        <CardTitle>Rincian Skor</CardTitle>
        <div className="mt-4 flex flex-col gap-4">
          {Object.entries(feedback.dimensi).map(([key, value]) => (
            <div key={key}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark/70">{DIMENSION_LABELS[key] ?? key}</span>
                <span className="font-medium text-dark">{value}/100</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-dark/10">
                <div
                  className="h-full rounded-full bg-indigo"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid w-full gap-4 sm:grid-cols-3">
        {feedback.saran.map((saran, index) => (
          <Card key={index} padding="md">
            <Lightbulb className="h-5 w-5 text-warm" />
            <p className="mt-3 text-sm text-dark/80">{saran}</p>
          </Card>
        ))}
      </div>

      <Link href={`/dashboard/cv-builder/${resume.id}`}>
        <Button size="lg">Perbaiki CV</Button>
      </Link>
    </div>
  );
}
