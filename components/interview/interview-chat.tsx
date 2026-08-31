"use client";

import { useEffect, useRef, useState } from "react";
import { ChatBubble } from "@/components/interview/chat-bubble";
import { InterviewControls } from "@/components/interview/interview-controls";
import { ScoreCard } from "@/components/interview/score-card";
import { useToast } from "@/components/ui/toast";
import { INTERVIEW_TOTAL_QUESTIONS } from "@/lib/constants";
import type { InterviewMessage } from "@/types";

interface InterviewChatProps {
  sessionId: string;
  position: string;
  initialMessages: InterviewMessage[];
  initialStatus: "active" | "completed";
  initialScore: number | null;
}

export function InterviewChat({
  sessionId,
  position,
  initialMessages,
  initialStatus,
  initialScore,
}: InterviewChatProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState(initialMessages);
  const [status, setStatus] = useState(initialStatus);
  const [finalScore, setFinalScore] = useState(initialScore);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const questionsAsked = messages.filter((m) => m.role === "ai").length;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    const userMessage: InterviewMessage = {
      role: "user",
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setSending(true);

    try {
      const res = await fetch("/api/ai/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userMessage: text }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Gagal mengirim jawaban");

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: body.aiMessage, timestamp: new Date().toISOString() },
      ]);

      if (body.isComplete) {
        setStatus("completed");
        setFinalScore(body.finalScore ?? null);
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    } finally {
      setSending(false);
    }
  };

  const lastAiMessage = [...messages].reverse().find((m) => m.role === "ai")?.text ?? "";

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-2xl flex-col">
      <div className="border-b border-dark/10 pb-4">
        <h1 className="text-lg font-semibold text-dark">Interview — {position}</h1>
        <p className="text-sm text-dark/50">
          Pertanyaan {Math.min(questionsAsked, INTERVIEW_TOTAL_QUESTIONS)} dari{" "}
          {INTERVIEW_TOTAL_QUESTIONS}
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {messages.map((message, index) => (
          <ChatBubble key={index} role={message.role} text={message.text} />
        ))}
        <div ref={bottomRef} />
      </div>

      {status === "active" && (
        <InterviewControls onSend={handleSend} disabled={sending} />
      )}

      {status === "completed" && (
        <ScoreCard score={finalScore} feedback={lastAiMessage} />
      )}
    </div>
  );
}
