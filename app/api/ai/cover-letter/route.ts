import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { generateCoverLetter } from "@/lib/anthropic";
import { checkUsageLimit, logUsage } from "@/lib/usage";
import { logAuditEvent } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  position: z.string().min(1, "Posisi wajib diisi"),
  company: z.string().min(1, "Perusahaan wajib diisi"),
  background: z.string().min(1, "Latar belakang wajib diisi"),
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
    action: "ai.cover_letter",
    limit: 15,
    windowSeconds: 3600,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan surat lamaran. Coba lagi nanti." },
      { status: 429 }
    );
  }

  const usage = await checkUsageLimit(supabase, user.id, "cover_letter");
  if (!usage.allowed) {
    return NextResponse.json(
      { error: "Kuota surat lamaran bulan ini sudah habis. Upgrade ke Pro untuk kuota tanpa batas." },
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

  let content: string;
  try {
    content = await generateCoverLetter(
      parsed.data.position,
      parsed.data.company,
      parsed.data.background
    );
  } catch {
    return NextResponse.json({ error: "Gagal membuat surat lamaran" }, { status: 502 });
  }

  const { data, error } = await supabase
    .from("cover_letters")
    .insert({
      user_id: user.id,
      position: parsed.data.position,
      company: parsed.data.company,
      content,
    })
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Gagal menyimpan" }, { status: 500 });
  }

  await logUsage(supabase, user.id, "cover_letter");
  await logAuditEvent({
    userId: user.id,
    action: "cover_letter.generated",
    metadata: { coverLetterId: data.id, position: parsed.data.position, company: parsed.data.company },
    request,
  });

  return NextResponse.json({ id: data.id, content: data.content });
}
