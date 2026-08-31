import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { interviewTurn } from "@/lib/anthropic";
import { checkUsageLimit, logUsage } from "@/lib/usage";
import { INTERVIEW_TOTAL_QUESTIONS as TOTAL_QUESTIONS } from "@/lib/constants";
import type { InterviewMessage, InterviewSession } from "@/types";

const bodySchema = z.object({
  sessionId: z.string().uuid().optional(),
  position: z.string().min(1).optional(),
  userMessage: z.string().min(1).optional(),
});

function toAnthropicHistory(messages: InterviewMessage[]) {
  return messages.map((m) => ({
    role: m.role === "ai" ? ("assistant" as const) : ("user" as const),
    content: m.text,
  }));
}

function extractScore(text: string): number | null {
  const match = text.match(/skor[^\d]{0,15}(\d{1,3})/i);
  if (!match) return null;
  const score = parseInt(match[1], 10);
  return Number.isFinite(score) ? Math.min(100, score) : null;
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { sessionId, position, userMessage } = parsed.data;

  // New session
  if (!sessionId) {
    if (!position) {
      return NextResponse.json({ error: "Posisi wajib diisi" }, { status: 400 });
    }

    const usage = await checkUsageLimit(supabase, user.id, "interview");
    if (!usage.allowed) {
      return NextResponse.json(
        { error: "Kuota simulasi interview bulan ini sudah habis. Upgrade ke Pro untuk kuota lebih banyak." },
        { status: 403 }
      );
    }

    let aiMessage: string;
    try {
      aiMessage = await interviewTurn(position, [], 1, TOTAL_QUESTIONS);
    } catch {
      return NextResponse.json({ error: "Gagal memulai interview" }, { status: 502 });
    }

    const messages: InterviewMessage[] = [
      { role: "ai", text: aiMessage, timestamp: new Date().toISOString() },
    ];

    const { data: session, error } = await supabase
      .from("interview_sessions")
      .insert({ user_id: user.id, position, messages, status: "active" })
      .select()
      .single<InterviewSession>();

    if (error || !session) {
      return NextResponse.json({ error: error?.message ?? "Gagal membuat sesi" }, { status: 500 });
    }

    await logUsage(supabase, user.id, "interview");

    return NextResponse.json({ sessionId: session.id, aiMessage });
  }

  // Continue existing session
  if (!userMessage) {
    return NextResponse.json({ error: "Jawaban wajib diisi" }, { status: 400 });
  }

  const { data: session } = await supabase
    .from("interview_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single<InterviewSession>();

  if (!session) {
    return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
  }

  const existingMessages = session.messages;
  const questionsAsked = existingMessages.filter((m) => m.role === "ai").length;

  const updatedMessages: InterviewMessage[] = [
    ...existingMessages,
    { role: "user", text: userMessage, timestamp: new Date().toISOString() },
  ];

  let aiMessage: string;
  try {
    aiMessage = await interviewTurn(
      session.position,
      toAnthropicHistory(updatedMessages),
      questionsAsked,
      TOTAL_QUESTIONS
    );
  } catch {
    return NextResponse.json({ error: "Gagal melanjutkan interview" }, { status: 502 });
  }

  const isComplete = questionsAsked >= TOTAL_QUESTIONS;
  const finalScore = isComplete ? extractScore(aiMessage) : null;

  const finalMessages: InterviewMessage[] = [
    ...updatedMessages,
    { role: "ai", text: aiMessage, timestamp: new Date().toISOString() },
  ];

  const { error: updateError } = await supabase
    .from("interview_sessions")
    .update({
      messages: finalMessages,
      ...(isComplete ? { status: "completed", final_score: finalScore } : {}),
    })
    .eq("id", sessionId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ aiMessage, isComplete, finalScore });
}
