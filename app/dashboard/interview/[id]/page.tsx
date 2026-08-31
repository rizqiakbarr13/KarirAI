import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InterviewChat } from "@/components/interview/interview-chat";
import type { InterviewSession } from "@/types";

interface PageProps {
  params: { id: string };
}

export default async function InterviewSessionPage({ params }: PageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: session } = await supabase
    .from("interview_sessions")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single<InterviewSession>();

  if (!session) {
    notFound();
  }

  return (
    <InterviewChat
      sessionId={session.id}
      position={session.position}
      initialMessages={session.messages}
      initialStatus={session.status}
      initialScore={session.final_score}
    />
  );
}
