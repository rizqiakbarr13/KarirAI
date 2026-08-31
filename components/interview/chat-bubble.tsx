import { cn } from "@/lib/utils";
import type { InterviewMessage } from "@/types";

export function ChatBubble({ role, text }: Pick<InterviewMessage, "role" | "text">) {
  const isAI = role === "ai";

  return (
    <div className={cn("flex", isAI ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[80%] whitespace-pre-line rounded-card px-4 py-3 text-sm leading-relaxed",
          isAI
            ? "border border-dark/10 bg-white text-dark"
            : "bg-indigo text-white"
        )}
      >
        {text}
      </div>
    </div>
  );
}
