import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScoreCircle } from "@/components/ui/score-circle";

interface ScoreCardProps {
  score: number | null;
  feedback: string;
}

export function ScoreCard({ score, feedback }: ScoreCardProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/40 p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-card bg-white p-8 text-center shadow-modal">
        <h2 className="text-lg font-semibold text-dark">Interview Selesai</h2>
        {score !== null && <ScoreCircle score={score} />}
        <p className="whitespace-pre-line text-sm leading-relaxed text-dark/70">{feedback}</p>
        <div className="flex w-full gap-3">
          <Link href="/dashboard/interview" className="flex-1">
            <Button variant="secondary" className="w-full">
              Interview Baru
            </Button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full">Ke Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
