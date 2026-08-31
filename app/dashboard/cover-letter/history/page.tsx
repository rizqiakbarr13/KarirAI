import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CoverLetter } from "@/types";

function formatDate(timestamp: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(timestamp));
}

export default async function CoverLetterHistoryPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: letters } = await supabase
    .from("cover_letters")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<CoverLetter[]>();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/cover-letter">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-dark">Riwayat Surat Lamaran</h1>
      </div>

      {!letters || letters.length === 0 ? (
        <Card padding="lg" className="text-center text-sm text-dark/50">
          Belum ada surat lamaran yang dibuat.
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {letters.map((letter) => (
            <Card key={letter.id} padding="md">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo/10">
                  <Mail className="h-4 w-4 text-indigo" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-dark">
                    {letter.position} — {letter.company}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-dark/60">{letter.content}</p>
                  <p className="mt-2 text-xs text-dark/40">{formatDate(letter.created_at)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
