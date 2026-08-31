import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { reviewCV } from "@/lib/anthropic";
import { checkUsageLimit, logUsage } from "@/lib/usage";
import { cvDataSchema } from "@/lib/validations/resume";
import { logAuditEvent } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const bodySchema = z.object({
  resumeId: z.string().uuid(),
  cvData: cvDataSchema,
});

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimit = await checkRateLimit({
    request,
    userId: user.id,
    action: "ai.review_cv",
    limit: 10,
    windowSeconds: 3600,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan review CV. Coba lagi nanti." },
      { status: 429 }
    );
  }

  const usage = await checkUsageLimit(supabase, user.id, "cv_review");
  if (!usage.allowed) {
    return NextResponse.json(
      { error: "Kuota review CV bulan ini sudah habis. Upgrade ke Pro untuk kuota tanpa batas." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  let result;
  try {
    result = await reviewCV(parsed.data.cvData);
  } catch {
    return NextResponse.json({ error: "Gagal memproses review AI" }, { status: 502 });
  }

  const { error: updateError } = await supabase
    .from("resumes")
    .update({ ai_score: result.skor, ai_feedback: result })
    .eq("id", parsed.data.resumeId)
    .eq("user_id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await logUsage(supabase, user.id, "cv_review");
  await logAuditEvent({
    userId: user.id,
    action: "cv.reviewed",
    metadata: { resumeId: parsed.data.resumeId, score: result.skor },
    request,
  });

  return NextResponse.json({ review: result });
}
